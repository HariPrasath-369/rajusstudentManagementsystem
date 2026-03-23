package com.university.sms.utils;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class QrCodeGenerator {

    private static final int QR_CODE_SIZE = 300;
    private static final String QR_CODE_FORMAT = "PNG";

    public String generateQrCode(String data) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 1);
            
            BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE, hints);
            
            BufferedImage qrImage = new BufferedImage(QR_CODE_SIZE, QR_CODE_SIZE, BufferedImage.TYPE_INT_RGB);
            
            for (int x = 0; x < QR_CODE_SIZE; x++) {
                for (int y = 0; y < QR_CODE_SIZE; y++) {
                    qrImage.setRGB(x, y, bitMatrix.get(x, y) ? 0x000000 : 0xFFFFFF);
                }
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, QR_CODE_FORMAT, baos);
            
            return Base64.getEncoder().encodeToString(baos.toByteArray());
            
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    public Map<String, String> decodeQrCode(String qrCodeBase64) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(qrCodeBase64);
            BufferedImage qrImage = ImageIO.read(new java.io.ByteArrayInputStream(decodedBytes));
            
            LuminanceSource source = new BufferedImageLuminanceSource(qrImage);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            
            Map<DecodeHintType, Object> hints = new HashMap<>();
            hints.put(DecodeHintType.CHARACTER_SET, "UTF-8");
            
            Result result = new MultiFormatReader().decode(bitmap, hints);
            String decodedData = result.getText();
            
            // Parse QR code data (format: KEY:VALUE,KEY:VALUE)
            Map<String, String> parsedData = new HashMap<>();
            String[] parts = decodedData.split(",");
            for (String part : parts) {
                String[] keyValue = part.split(":");
                if (keyValue.length == 2) {
                    parsedData.put(keyValue[0], keyValue[1]);
                }
            }
            
            return parsedData;
            
        } catch (NotFoundException | IOException e) {
            throw new RuntimeException("Failed to decode QR code", e);
        }
    }

    public String generateAttendanceQrCode(Long classId, LocalDate date, Long teacherId) {
        String data = String.format("ATT:%d:%s:%d:%d", classId, date.toString(), System.currentTimeMillis(), teacherId);
        return generateQrCode(data);
    }

    public boolean validateQrCode(String qrCodeBase64) {
        try {
            Map<String, String> decodedData = decodeQrCode(qrCodeBase64);
            return decodedData.containsKey("ATT");
        } catch (Exception e) {
            return false;
        }
    }
}