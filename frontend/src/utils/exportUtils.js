import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDisplayDate } from './formatters';

// Export to CSV
export const exportToCSV = (data, filename, columns) => {
  try {
    // Convert data to CSV format
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(row => {
      return columns.map(col => {
        let value = row[col.accessor];
        if (col.formatter) {
          value = col.formatter(value);
        }
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
    return true;
  } catch (error) {
    console.error('Export to CSV failed:', error);
    return false;
  }
};

// Export to Excel
export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Export to Excel failed:', error);
    return false;
  }
};

// Export to PDF
export const exportToPDF = (data, filename, columns, title = 'Report') => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${formatDisplayDate(new Date())}`, 14, 32);
    
    // Prepare table data
    const tableData = data.map(row => {
      return columns.map(col => {
        let value = row[col.accessor];
        if (col.formatter) {
          value = col.formatter(value);
        }
        return value || '';
      });
    });
    
    const tableHeaders = columns.map(col => col.header);
    
    // Add table
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 40,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    
    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Export to PDF failed:', error);
    return false;
  }
};

// Export attendance report
export const exportAttendanceReport = (data, classInfo) => {
  const columns = [
    { header: 'Roll Number', accessor: 'rollNumber' },
    { header: 'Student Name', accessor: 'studentName' },
    { header: 'Total Days', accessor: 'totalDays' },
    { header: 'Present', accessor: 'present' },
    { header: 'Absent', accessor: 'absent' },
    { header: 'Late', accessor: 'late' },
    { header: 'Leave', accessor: 'leave' },
    { 
      header: 'Percentage', 
      accessor: 'percentage',
      formatter: (value) => `${value}%`
    },
  ];
  
  const title = `Attendance Report - ${classInfo.className}`;
  exportToPDF(data, `attendance_${classInfo.className}`, columns, title);
};

// Export marks report
export const exportMarksReport = (data, subjectInfo) => {
  const columns = [
    { header: 'Roll Number', accessor: 'rollNumber' },
    { header: 'Student Name', accessor: 'studentName' },
    { header: 'Marks Obtained', accessor: 'marksObtained' },
    { header: 'Max Marks', accessor: 'maxMarks' },
    { 
      header: 'Percentage', 
      accessor: 'percentage',
      formatter: (value) => `${value}%`
    },
    { header: 'Grade', accessor: 'grade' },
    { header: 'Result', accessor: 'result' },
  ];
  
  const title = `Marks Report - ${subjectInfo.subjectName} (Semester ${subjectInfo.semester})`;
  exportToPDF(data, `marks_${subjectInfo.subjectName}`, columns, title);
};

// Export timetable
export const exportTimetable = (timetable, className) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  
  doc.setFontSize(18);
  doc.text(`Timetable - ${className}`, 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${formatDisplayDate(new Date())}`, 14, 32);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];
  
  const tableData = timeSlots.map(timeSlot => {
    const row = [timeSlot];
    days.forEach(day => {
      const class_ = timetable[day]?.find(c => c.time === timeSlot);
      row.push(class_ ? `${class_.subject}\n${class_.teacher}\n${class_.room}` : '-');
    });
    return row;
  });
  
  autoTable(doc, {
    head: [['Time', ...days]],
    body: tableData,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, cellWidth: 'auto' },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
  });
  
  doc.save(`timetable_${className}.pdf`);
};

// Export marksheet for student
export const exportStudentMarksheet = (studentData, marksData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('MARKSHEET', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Student Name: ${studentData.name}`, 20, 40);
  doc.text(`Roll Number: ${studentData.rollNumber}`, 20, 48);
  doc.text(`Class: ${studentData.className}`, 20, 56);
  doc.text(`Semester: ${studentData.semester}`, 20, 64);
  doc.text(`Academic Year: ${studentData.academicYear}`, 20, 72);
  
  // Marks Table
  const tableData = marksData.map(mark => [
    mark.subjectName,
    mark.marksObtained,
    mark.maxMarks,
    `${((mark.marksObtained / mark.maxMarks) * 100).toFixed(1)}%`,
    mark.grade,
  ]);
  
  autoTable(doc, {
    head: [['Subject', 'Marks Obtained', 'Max Marks', 'Percentage', 'Grade']],
    body: tableData,
    startY: 85,
    theme: 'striped',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
  });
  
  // Summary
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Marks: ${studentData.totalObtained} / ${studentData.totalMax}`, 20, finalY);
  doc.text(`Percentage: ${studentData.percentage}%`, 20, finalY + 8);
  doc.text(`Result: ${studentData.result}`, 20, finalY + 16);
  doc.text(`Grade: ${studentData.grade}`, 20, finalY + 24);
  
  doc.save(`marksheet_${studentData.rollNumber}_sem${studentData.semester}.pdf`);
};