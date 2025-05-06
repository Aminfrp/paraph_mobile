package com.paraph_mobile;

import android.os.Build;

import com.ibm.icu.text.ArabicShaping;
import com.ibm.icu.text.Bidi;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.signatures.PdfSignatureAppearance;
import com.itextpdf.signatures.PdfSigner;

import java.io.ByteArrayOutputStream;
import java.security.cert.Certificate;
import java.util.Base64;

public class PDFContentUtil {

    public byte[] getPdfContentBytes(String content) throws Exception {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return EncryptionUtil.isValidBase64(content) ?
                    Base64.getDecoder().decode(content) :
                    createNewPdfContent(content);
        }
        return new byte[0];
    }

    private byte[] createNewPdfContent(String content) throws Exception {
        // buffer size based on the content length (1 byte per character + overhead)
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(Math.max(1024, content.length() * 2));
        try (PdfWriter pdfWriter = new PdfWriter(byteArrayOutputStream)) {
            PdfDocument pdfDoc = new PdfDocument(pdfWriter);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.add(new Paragraph(content));
            document.close();
        }
        return byteArrayOutputStream.toByteArray();
    }

    public static void addSignerInfo(PdfSigner signer, String signerInfo, Certificate[] chain) throws Exception {
        Rectangle rect = new Rectangle(30, 0, 250, 100);

        signer.getSignatureAppearance()
                .setLayer2Text(makeSignerInfoRtl(signerInfo))
//                .setLayer2Font(getPdfFont())
                .setLayer2FontSize(8f)
                .setReuseAppearance(false)
                .setRenderingMode(PdfSignatureAppearance.RenderingMode.DESCRIPTION)
                .setPageRect(rect)
                .setCertificate(chain[0])
                .setPageNumber(signer.getDocument().getNumberOfPages());

        signer.setFieldName("paraph-sign");
    } 

    public static PdfFont getPdfFont() throws Exception {
        String fontPath = "./font.ttf";
        return PdfFontFactory.createFont(fontPath, "Identity-H", PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED);
    }

    public static String makeSignerInfoRtl(String signerInfo) throws Exception {
        ArabicShaping arabicShaping = new ArabicShaping(ArabicShaping.LETTERS_SHAPE);
        String shapedText = arabicShaping.shape(signerInfo);
        Bidi bidi = new Bidi(shapedText, Bidi.DIRECTION_RIGHT_TO_LEFT);
        String rtlText = bidi.writeReordered(Bidi.DO_MIRRORING);
        return "Digitally signed by: " + rtlText;
    }
}
