package com.paraph_mobile;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.StampingProperties;
import com.itextpdf.signatures.BouncyCastleDigest;
import com.itextpdf.signatures.IExternalDigest;
import com.itextpdf.signatures.IExternalSignature;
import com.itextpdf.signatures.PdfSigner;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.security.Security;
import java.security.cert.Certificate;
import java.util.Base64;

public class PDFSignerModule extends ReactContextBaseJavaModule {
    final private EncryptionUtil EncryptUtilInstance = new EncryptionUtil();


    @NonNull
    @Override
    public String getName() {
        return "PDFSigner";
    }

    public PDFSignerModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void addSignature(String pdfContentBase64, String privateKeyPEM, String certificate, String signerInfo, Promise promise) {
        try {
            // Decode the Base64 encoded PDF content
            byte[] pdfContentToSign = new byte[0];
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                pdfContentToSign = Base64.getDecoder().decode(pdfContentBase64);
            }

            // Obtain the certificate chain from the certificate string
            Certificate[] chain =  EncryptionUtil.getCertificateChainFromString(certificate);

            // Attach the signature to the PDF
            byte[] signedPdfBytes = attachSignatureToPdf(pdfContentToSign, chain, privateKeyPEM, signerInfo);

            // Encode the signed PDF back to Base64 to return to JavaScript
            String signedPdfBase64 = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                signedPdfBase64 = Base64.getEncoder().encodeToString(signedPdfBytes);
            }

            // Resolve the promise with the Base64 encoded signed PDF
            promise.resolve(signedPdfBase64);
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject("PDF_SIGN_ERROR", e.getMessage());
        }
    }

    private byte[] attachSignatureToPdf(byte[] pdfBytes, Certificate[] chain, String privateKeyPEM, String signerInfo) throws Exception {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(pdfBytes.length + 2048);
        try (PdfReader pdfReader = new PdfReader(new ByteArrayInputStream(pdfBytes));
             PdfWriter pdfWriter = new PdfWriter(byteArrayOutputStream)) {

            PdfSigner signer = new PdfSigner(pdfReader, pdfWriter, new StampingProperties().useAppendMode());
//            signer.setCertificationLevel(PdfSigner.CERTIFIED_NO_CHANGES_ALLOWED);
            PDFContentUtil.addSignerInfo(signer, signerInfo, chain);

            IExternalSignature pks = new ExternalSignatureImpl(privateKeyPEM);
            IExternalDigest digest = new BouncyCastleDigest();

            signer.signDetached(digest, pks, chain, null, null, null, 0, PdfSigner.CryptoStandard.CMS);

        }
        return byteArrayOutputStream.toByteArray();
    }
}
