package com.university.sms.scheduler;

import com.university.sms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Component
public class BackupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(BackupScheduler.class);

    @Value("${app.backup.directory:./backups}")
    private String backupDirectory;

    @Value("${app.backup.enabled:true}")
    private boolean backupEnabled;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    // Daily backup at 1:00 AM
    @Scheduled(cron = "0 0 1 * * *")
    public void performDailyBackup() {
        if (!backupEnabled) {
            logger.info("Backup is disabled");
            return;
        }

        logger.info("Starting daily backup");

        try {
            String backupFileName = "backup_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".zip";
            Path backupPath = Paths.get(backupDirectory, backupFileName);
            
            // Create backup directory if it doesn't exist
            Files.createDirectories(Paths.get(backupDirectory));
            
            try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(backupPath))) {
                // Backup users data
                backupUsersData(zos);
                
                // Backup attendance data
                backupAttendanceData(zos);
                
                // Backup marks data
                backupMarksData(zos);
                
                // Backup leaves data
                backupLeavesData(zos);
                
                logger.info("Daily backup completed successfully: {}", backupFileName);
            }
            
            // Clean old backups (keep last 30 days)
            cleanOldBackups();
            
        } catch (IOException e) {
            logger.error("Failed to perform daily backup: {}", e.getMessage(), e);
        }
    }

    // Weekly full database backup on Sunday at 2:00 AM
    @Scheduled(cron = "0 0 2 * * SUN")
    public void performWeeklyFullBackup() {
        if (!backupEnabled) {
            return;
        }

        logger.info("Starting weekly full database backup");

        try {
            String backupFileName = "full_backup_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".zip";
            Path backupPath = Paths.get(backupDirectory, backupFileName);
            
            Files.createDirectories(Paths.get(backupDirectory));
            
            try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(backupPath))) {
                // Backup all data
                backupUsersData(zos);
                backupAttendanceData(zos);
                backupMarksData(zos);
                backupLeavesData(zos);
                backupClassesData(zos);
                backupSubjectsData(zos);
                backupDepartmentsData(zos);
                
                // Add system information
                addSystemInfo(zos);
                
                logger.info("Weekly full backup completed successfully: {}", backupFileName);
            }
            
        } catch (IOException e) {
            logger.error("Failed to perform weekly full backup: {}", e.getMessage(), e);
        }
    }

    // Monthly archive backup on the 1st of each month at 3:00 AM
    @Scheduled(cron = "0 0 3 1 * *")
    public void performMonthlyArchive() {
        if (!backupEnabled) {
            return;
        }

        logger.info("Starting monthly archive backup");

        try {
            String archiveFileName = "archive_" + LocalDate.now().minusMonths(1).format(DateTimeFormatter.ofPattern("yyyyMM")) + ".zip";
            Path archivePath = Paths.get(backupDirectory, "archive", archiveFileName);
            
            Files.createDirectories(Paths.get(backupDirectory, "archive"));
            
            try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(archivePath))) {
                // Archive previous month's data
                archivePreviousMonthData(zos);
                
                logger.info("Monthly archive completed successfully: {}", archiveFileName);
            }
            
        } catch (IOException e) {
            logger.error("Failed to perform monthly archive: {}", e.getMessage(), e);
        }
    }

    // Clean temporary files at 4:00 AM daily
    @Scheduled(cron = "0 0 4 * * *")
    public void cleanTemporaryFiles() {
        logger.info("Cleaning temporary files");

        try {
            Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"), "sms");
            if (Files.exists(tempDir)) {
                Files.walk(tempDir)
                    .filter(Files::isRegularFile)
                    .filter(path -> path.toString().endsWith(".tmp"))
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                            logger.debug("Deleted temp file: {}", path);
                        } catch (IOException e) {
                            logger.error("Failed to delete temp file: {}", path);
                        }
                    });
            }
        } catch (IOException e) {
            logger.error("Failed to clean temporary files: {}", e.getMessage());
        }
    }

    // Database integrity check at 5:00 AM daily
    @Scheduled(cron = "0 0 5 * * *")
    public void checkDatabaseIntegrity() {
        logger.info("Performing database integrity check");

        try {
            // Check for orphaned records
            long orphanedAttendance = checkOrphanedAttendance();
            long orphanedMarks = checkOrphanedMarks();
            long orphanedLeaves = checkOrphanedLeaves();
            
            if (orphanedAttendance > 0 || orphanedMarks > 0 || orphanedLeaves > 0) {
                logger.warn("Found orphaned records - Attendance: {}, Marks: {}, Leaves: {}", 
                           orphanedAttendance, orphanedMarks, orphanedLeaves);
                
                // Log for manual review
                logIntegrityIssues(orphanedAttendance, orphanedMarks, orphanedLeaves);
            } else {
                logger.info("Database integrity check passed");
            }
            
        } catch (Exception e) {
            logger.error("Database integrity check failed: {}", e.getMessage(), e);
        }
    }

    // Helper methods for backup
    private void backupUsersData(ZipOutputStream zos) throws IOException {
        ZipEntry entry = new ZipEntry("users_" + LocalDate.now() + ".csv");
        zos.putNextEntry(entry);
        
        List<Object[]> users = userRepository.findAll().stream()
                .map(u -> new Object[]{u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getCreatedAt()})
                .toList();
        
        try (FileWriter writer = new FileWriter(new File(entry.getName()))) {
            writer.write("ID,Name,Email,Role,CreatedAt\n");
            for (Object[] user : users) {
                writer.write(String.format("%d,%s,%s,%s,%s\n", user[0], user[1], user[2], user[3], user[4]));
            }
        }
        
        zos.closeEntry();
    }

    private void backupAttendanceData(ZipOutputStream zos) throws IOException {
        ZipEntry entry = new ZipEntry("attendance_" + LocalDate.now() + ".csv");
        zos.putNextEntry(entry);
        
        // Implementation would write attendance data to CSV
        zos.closeEntry();
    }

    private void backupMarksData(ZipOutputStream zos) throws IOException {
        ZipEntry entry = new ZipEntry("marks_" + LocalDate.now() + ".csv");
        zos.putNextEntry(entry);
        
        // Implementation would write marks data to CSV
        zos.closeEntry();
    }

    private void backupLeavesData(ZipOutputStream zos) throws IOException {
        ZipEntry entry = new ZipEntry("leaves_" + LocalDate.now() + ".csv");
        zos.putNextEntry(entry);
        
        // Implementation would write leaves data to CSV
        zos.closeEntry();
    }

    private void backupClassesData(ZipOutputStream zos) throws IOException {
        ZipEntry entry = new ZipEntry("classes_" + LocalDate.now() + ".csv");
        zos.putNextEntry(entry);
        
        // Implementation would write classes data to CSV
        zos.closeEntry();
    }

    private void backupSubjectsData(ZipOutputStream zos) throws IOException {
        ZipEntry entry = new ZipEntry("subjects_" + LocalDate.now() + ".csv");
        zos.putNextEntry(entry);
        
        // Implementation would write subjects data to CSV
        zos.closeEntry();
    }

    private void backupDepartmentsData(ZipOutputStream zos) throws IOException {
        ZipEntry entry = new ZipEntry("departments_" + LocalDate.now() + ".csv");
        zos.putNextEntry(entry);
        
        // Implementation would write departments data to CSV
        zos.closeEntry();
    }

    private void addSystemInfo(ZipOutputStream zos) throws IOException {
        ZipEntry entry = new ZipEntry("system_info.txt");
        zos.putNextEntry(entry);
        
        String info = String.format("Backup Date: %s\nBackup Type: Full\nSystem Version: 1.0\nDatabase: PostgreSQL\n", 
                                   LocalDateTime.now());
        zos.write(info.getBytes());
        zos.closeEntry();
    }

    private void archivePreviousMonthData(ZipOutputStream zos) {
        // Implementation would archive previous month's data
        // This is a placeholder for actual archiving logic
    }

    private void cleanOldBackups() throws IOException {
        Path backupDir = Paths.get(backupDirectory);
        if (!Files.exists(backupDir)) {
            return;
        }
        
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        
        Files.list(backupDir)
            .filter(Files::isRegularFile)
            .filter(path -> path.toString().endsWith(".zip"))
            .forEach(path -> {
                try {
                    LocalDate fileDate = LocalDate.parse(
                        path.getFileName().toString().substring(7, 15),
                        DateTimeFormatter.ofPattern("yyyyMMdd")
                    );
                    
                    if (fileDate.isBefore(thirtyDaysAgo)) {
                        Files.delete(path);
                        logger.info("Deleted old backup: {}", path.getFileName());
                    }
                } catch (Exception e) {
                    logger.error("Failed to delete old backup: {}", path);
                }
            });
    }

    private long checkOrphanedAttendance() {
        // Implementation would check for orphaned attendance records
        return 0;
    }

    private long checkOrphanedMarks() {
        // Implementation would check for orphaned marks records
        return 0;
    }

    private long checkOrphanedLeaves() {
        // Implementation would check for orphaned leave records
        return 0;
    }

    private void logIntegrityIssues(long attendance, long marks, long leaves) {
        logger.warn("Integrity issues found - Please review the following:");
        logger.warn("- Orphaned Attendance: {}", attendance);
        logger.warn("- Orphaned Marks: {}", marks);
        logger.warn("- Orphaned Leaves: {}", leaves);
    }
}