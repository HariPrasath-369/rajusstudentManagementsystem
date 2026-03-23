package com.university.sms.utils;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
public class PdfGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy");

    public byte[] generateMarksheet(String studentName, String rollNumber, String className,
                                     List<Map<String, Object>> marks, double totalMarks, 
                                     double percentage, String result) throws IOException {
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, PageSize.A4);
        
        // Add logo or header
        addHeader(document);
        
        // Title
        Paragraph title = new Paragraph("MARKSHEET")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(20)
                .setBold()
                .setFontColor(ColorConstants.BLUE);
        document.add(title);
        
        document.add(new Paragraph("\n"));
        
        // Student Details Table
        Table detailsTable = new Table(UnitValue.createPercentArray(new float[]{30, 70}));
        detailsTable.setWidth(UnitValue.createPercentValue(100));
        detailsTable.setMarginBottom(10);
        
        addDetailRow(detailsTable, "Student Name:", studentName);
        addDetailRow(detailsTable, "Roll Number:", rollNumber);
        addDetailRow(detailsTable, "Class:", className);
        addDetailRow(detailsTable, "Date:", LocalDate.now().format(DATE_FORMATTER));
        
        document.add(detailsTable);
        document.add(new Paragraph("\n"));
        
        // Marks Table
        Table marksTable = new Table(UnitValue.createPercentArray(new float[]{40, 30, 30}));
        marksTable.setWidth(UnitValue.createPercentValue(100));
        
        // Headers
        addTableHeader(marksTable, "Subject", "Marks Obtained", "Max Marks");
        
        // Data rows
        for (Map<String, Object> mark : marks) {
            marksTable.addCell(new Cell().add(new Paragraph(mark.get("subject").toString())));
            marksTable.addCell(new Cell().add(new Paragraph(mark.get("marksObtained").toString())));
            marksTable.addCell(new Cell().add(new Paragraph(mark.get("maxMarks").toString())));
        }
        
        document.add(marksTable);
        document.add(new Paragraph("\n"));
        
        // Summary Table
        Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{30, 70}));
        summaryTable.setWidth(UnitValue.createPercentValue(100));
        
        addDetailRow(summaryTable, "Total Marks:", String.format("%.2f / %.2f", totalMarks, getTotalMaxMarks(marks)));
        addDetailRow(summaryTable, "Percentage:", String.format("%.2f%%", percentage));
        addDetailRow(summaryTable, "Result:", result);
        
        document.add(summaryTable);
        
        // Add footer
        addFooter(document);
        
        document.close();
        
        return baos.toByteArray();
    }

    public byte[] generateAttendanceReport(String className, List<Map<String, Object>> attendanceData) 
            throws IOException {
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, PageSize.A4.rotate());
        
        addHeader(document);
        
        Paragraph title = new Paragraph("Attendance Report - " + className)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(16)
                .setBold();
        document.add(title);
        
        document.add(new Paragraph("Generated on: " + LocalDate.now().format(DATE_FORMATTER))
                .setTextAlignment(TextAlignment.RIGHT));
        document.add(new Paragraph("\n"));
        
        Table table = new Table(UnitValue.createPercentArray(new float[]{15, 35, 15, 15, 20}));
        table.setWidth(UnitValue.createPercentValue(100));
        
        addTableHeader(table, "Roll Number", "Student Name", "Total Days", "Present Days", "Attendance %");
        
        for (Map<String, Object> data : attendanceData) {
            table.addCell(data.get("rollNumber").toString());
            table.addCell(data.get("studentName").toString());
            table.addCell(data.get("totalDays").toString());
            table.addCell(data.get("presentDays").toString());
            table.addCell(data.get("percentage").toString() + "%");
        }
        
        document.add(table);
        addFooter(document);
        document.close();
        
        return baos.toByteArray();
    }

    public byte[] generatePerformanceReport(String academicYear, List<Map<String, Object>> performanceData) 
            throws IOException {
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, PageSize.A4);
        
        addHeader(document);
        
        Paragraph title = new Paragraph("Performance Report - " + academicYear)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18)
                .setBold();
        document.add(title);
        
        document.add(new Paragraph("\n"));
        
        Table table = new Table(UnitValue.createPercentArray(new float[]{20, 30, 20, 15, 15}));
        table.setWidth(UnitValue.createPercentValue(100));
        
        addTableHeader(table, "Student Name", "Roll Number", "Class", "Percentage", "Grade");
        
        for (Map<String, Object> data : performanceData) {
            table.addCell(data.get("studentName").toString());
            table.addCell(data.get("rollNumber").toString());
            table.addCell(data.get("className").toString());
            table.addCell(String.format("%.2f%%", data.get("percentage")));
            table.addCell(getGrade((Double) data.get("percentage")));
        }
        
        document.add(table);
        addFooter(document);
        document.close();
        
        return baos.toByteArray();
    }

    private void addHeader(Document document) throws IOException {
        PdfFont font = PdfFontFactory.createFont();
        Paragraph header = new Paragraph("University Management System")
                .setFont(font)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY);
        document.add(header);
        document.add(new Paragraph("\n"));
    }

    private void addFooter(Document document) {
        Paragraph footer = new Paragraph("This is a system-generated document. No signature required.")
                .setFontSize(8)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY);
        document.add(footer);
    }

    private void addDetailRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label)).setBold());
        table.addCell(new Cell().add(new Paragraph(value)));
    }

    private void addTableHeader(Table table, String... headers) {
        for (String header : headers) {
            table.addHeaderCell(new Cell().add(new Paragraph(header)).setBold());
        }
    }

    private double getTotalMaxMarks(List<Map<String, Object>> marks) {
        return marks.stream()
                .mapToDouble(m -> Double.parseDouble(m.get("maxMarks").toString()))
                .sum();
    }

    private String getGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 40) return "D";
        return "F";
    }
}