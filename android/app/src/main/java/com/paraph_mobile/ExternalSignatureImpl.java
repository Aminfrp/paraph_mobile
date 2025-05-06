package com.paraph_mobile;

import android.os.Build;

import com.itextpdf.signatures.IExternalSignature;

import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Base64;

public class ExternalSignatureImpl implements IExternalSignature {

    private final String privateKeyPEM;

    public ExternalSignatureImpl(String privateKeyPEM) {
        this.privateKeyPEM = privateKeyPEM;
    }

    @Override
    public String getHashAlgorithm() {
        return "SHA-256";
    }

    @Override
    public String getEncryptionAlgorithm() {
        return "RSA";
    }

    @Override
    public byte[] sign(byte[] message) throws GeneralSecurityException {
        try {
            EncryptionUtil encryptionUtil = new EncryptionUtil();
            String signature = encryptionUtil.makeSignatureRSA(privateKeyPEM, message);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                return Base64.getDecoder().decode(signature);
            }
        } catch (Exception e) {
            throw new GeneralSecurityException(e);
        }
        return message;
    }
}
