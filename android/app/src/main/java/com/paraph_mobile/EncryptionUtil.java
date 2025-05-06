package com.paraph_mobile;

import android.os.Build;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.security.auth.x500.X500Principal;

import java.security.cert.Certificate;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import org.bouncycastle.jcajce.provider.symmetric.ARC4;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.regex.Pattern;

import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;
import org.bouncycastle.util.io.pem.PemObject;

import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.pqc.crypto.util.PrivateKeyInfoFactory;
import org.bouncycastle.pqc.crypto.util.SubjectPublicKeyInfoFactory;


public class EncryptionUtil {
    private final BouncyCastleProvider bouncyCastleProvider = new BouncyCastleProvider();

    public static Certificate[] getCertificateChainFromString(String pemCertificate) throws Exception {
        String cleanPem = pemCertificate.replaceAll("-----BEGIN CERTIFICATE-----", "")
                .replaceAll("-----END CERTIFICATE-----", "")
                .replaceAll("\\s", "");
        byte[] decoded = new byte[0];
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            decoded = Base64.getDecoder().decode(cleanPem);
        }
        java.security.cert.CertificateFactory factory = java.security.cert.CertificateFactory.getInstance("X.509");

        return new Certificate[]{
                factory.generateCertificate(new ByteArrayInputStream(decoded))
        };
    }

    public Map<String, String> getKeyPair() throws InvalidAlgorithmParameterException, NoSuchAlgorithmException {
        Map<String, String> result = new HashMap<>();

        KeyPairGenerator g = KeyPairGenerator.getInstance("EC", bouncyCastleProvider);
        g.initialize(new ECGenParameterSpec("prime256v1"), new SecureRandom());
        KeyPair keyPair = g.generateKeyPair();
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            String privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());
            result.put("private", privateKey);
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            String publicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
            result.put("public", publicKey);

        }
        return result;
    }

    public String makeSignatureHsa256RSA(String privateKey, String signText) throws Exception {
        String s = privateKey.replaceAll("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll("-----END PRIVATE KEY-----", "").replaceAll(System.lineSeparator(), "");
        Signature rsaSign = Signature.getInstance("SHA256withRSA", bouncyCastleProvider);
        PrivateKey privateKey1 = generateRSAPrivateKeyFromBytes(s);
        rsaSign.initSign(privateKey1);
      
        rsaSign.update(signText.getBytes("UTF-8"));
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return Base64.getEncoder().encodeToString(rsaSign.sign());
        }
        return "";
    }

    public static boolean isValidBase64(String string) {
        Pattern BASE64_PATTERN = Pattern.compile(
                "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
        );
        return BASE64_PATTERN.matcher(string).matches();
    }

    public boolean verifySignatureHsa256RSA(PublicKey publicKey, byte[] signature, String verifiedString) throws SignatureException, UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException, InvalidKeySpecException {
        Signature rsaVerify = Signature.getInstance("SHA256withRSA", bouncyCastleProvider);
        rsaVerify.initVerify(publicKey);

        if (isValidBase64(verifiedString)) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                rsaVerify.update(Base64.getDecoder().decode(verifiedString));
            }
        } else {
            rsaVerify.update(verifiedString.getBytes("UTF-8"));

        }

        return rsaVerify.verify(signature);
    }

//     public String makeSignatureRSA(String privateKeyPem, String payload) throws Exception {
//         String s = privateKeyPem.replaceAll("-----BEGIN PRIVATE KEY-----", "")
//                 .replaceAll("-----END PRIVATE KEY-----", "").replaceAll(System.lineSeparator(), "");
//         Signature rsaSign = Signature.getInstance("SHA256withRSA", bouncyCastleProvider);
//         PrivateKey privateKey1 = generateRSAPrivateKeyFromBytes(s);
//         rsaSign.initSign(privateKey1);
//         if (isValidBase64(payload)){
//             if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//                 rsaSign.update(Base64.getDecoder().decode(payload));
//             }
//         }
//         else {
//             rsaSign.update(payload.getBytes("UTF-8"));
//         }
//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//             return Base64.getEncoder().encodeToString(rsaSign.sign());
//         }
//         return "";
//
//     }

    public Map<String, String> getRSAKeyPair() throws InvalidAlgorithmParameterException, NoSuchAlgorithmException {
        KeyPair keyPair = getRSAKeyPairObject();
        Map<String, String> res = new HashMap<>();
        PemObject privateKey = new PemObject("", keyPair.getPrivate().getEncoded());
        PemObject publicKey = new PemObject("", keyPair.getPublic().getEncoded());
        res.put("private", privateKey.toString());
        res.put("public", publicKey.toString());

        return res;
    }


    public KeyPair getRSAKeyPairObject() throws InvalidAlgorithmParameterException, NoSuchAlgorithmException {
        KeyPairGenerator g = KeyPairGenerator.getInstance("RSA", bouncyCastleProvider);
        g.initialize(1024, new SecureRandom());
        KeyPair keyPair = g.generateKeyPair();

        return keyPair;
    }

    public Map<String, String> getRSAKeyPairPEM(int size) throws Exception {
        Map<String, String> result = new HashMap<>();
        KeyPairGenerator g = KeyPairGenerator.getInstance("RSA", bouncyCastleProvider);

        g.initialize(size, new SecureRandom());
        KeyPair keyPair = g.generateKeyPair();
        byte[] publicKeyBytes = keyPair.getPublic().getEncoded();
        String publicKeyContent = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            publicKeyContent = Base64.getEncoder().encodeToString(publicKeyBytes);
        }
        String publicKeyFormatted = "-----BEGIN PUBLIC KEY-----" + System.lineSeparator();
        String[] results = publicKeyContent.split("(?<=\\G.{" + 76 + "})");
        final List<String> strings = Arrays.asList(results);
        for (final Object row : strings) {
            publicKeyFormatted += row + System.lineSeparator();
        }
        publicKeyFormatted += "-----END PUBLIC KEY-----";

        byte[] privateKeyBytes = keyPair.getPrivate().getEncoded();
        String privateKeyContent = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            privateKeyContent = Base64.getEncoder().encodeToString(privateKeyBytes);
        }
        String privateKeyFormatted = "-----BEGIN PRIVATE KEY-----" + System.lineSeparator();
        String[] privateResults = privateKeyContent.split("(?<=\\G.{" + 76 + "})");
        final List<String> privateStrings = Arrays.asList(privateResults);
        for (final Object row : privateStrings) {
            privateKeyFormatted += row + System.lineSeparator();
        }
        privateKeyFormatted += "-----END PRIVATE KEY-----";
        result.put("publicKey", publicKeyFormatted);
        result.put("privateKey", privateKeyFormatted);

        return result;
    }

    public String signCSR(String csr, PublicKey publicKey, PrivateKey privateKey) throws Exception {
        JcaPKCS10CertificationRequestBuilder builder = new JcaPKCS10CertificationRequestBuilder(
                new X500Principal(csr), publicKey);

        JcaContentSignerBuilder csBuilder = new JcaContentSignerBuilder("SHA1WithRSA");
        ContentSigner signer = csBuilder.build(privateKey);
        PKCS10CertificationRequest csrSigned = builder.build(signer);

        StringWriter pemCert = new StringWriter();
        JcaPEMWriter jcaPEMWriter = new JcaPEMWriter(pemCert);
        jcaPEMWriter.writeObject(csrSigned);
        jcaPEMWriter.flush();
        jcaPEMWriter.close();
        return pemCert.toString();
    }


    public PublicKey generateRSAPublicKeyFromBytes(String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] keyBytes = new byte[0];
        String s = publicKey.replaceAll("-----BEGIN PUBLIC KEY-----", "")
                .replaceAll("-----END PUBLIC KEY-----", "").replaceAll(System.lineSeparator(), "");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            keyBytes = Base64.getDecoder().decode(s);
        }


        KeyFactory factNode1 = KeyFactory.getInstance("RSA", bouncyCastleProvider);
        return factNode1.generatePublic(new X509EncodedKeySpec(keyBytes));

    }

    private static KeyPair convertBcToJceKeyPair(AsymmetricCipherKeyPair bcKeyPair) throws Exception {
        byte[] pkcs8Encoded = PrivateKeyInfoFactory.createPrivateKeyInfo(bcKeyPair.getPrivate()).getEncoded();
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(pkcs8Encoded);
        byte[] spkiEncoded = SubjectPublicKeyInfoFactory.createSubjectPublicKeyInfo(bcKeyPair.getPublic()).getEncoded();
        X509EncodedKeySpec spkiKeySpec = new X509EncodedKeySpec(spkiEncoded);
        KeyFactory keyFac = KeyFactory.getInstance("RSA");
        return new KeyPair(keyFac.generatePublic(spkiKeySpec), keyFac.generatePrivate(pkcs8KeySpec));
    }

    private static Map<String, String> convertBcToJceKeyPair1(AsymmetricCipherKeyPair bcKeyPair) throws Exception {
        byte[] pkcs8Encoded = PrivateKeyInfoFactory.createPrivateKeyInfo(bcKeyPair.getPrivate()).getEncoded();
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(pkcs8Encoded);
        byte[] spkiEncoded = SubjectPublicKeyInfoFactory.createSubjectPublicKeyInfo(bcKeyPair.getPublic()).getEncoded();
        X509EncodedKeySpec spkiKeySpec = new X509EncodedKeySpec(spkiEncoded);
        KeyFactory keyFac = KeyFactory.getInstance("RSA");
        KeyPair keyPair = new KeyPair(keyFac.generatePublic(spkiKeySpec), keyFac.generatePrivate(pkcs8KeySpec));

        Map<String, String> resultData = new HashMap<>();
        resultData.put("private", String.valueOf(keyPair.getPrivate()));
        resultData.put("public", String.valueOf(keyPair.getPublic()));

        return resultData;
    }

    private KeyAgreement getECDHKeyAgreement(Key key) throws InvalidKeyException, NoSuchAlgorithmException {
        KeyAgreement keyAgree = KeyAgreement.getInstance("ECDH", bouncyCastleProvider);
        keyAgree.init(key);
        return keyAgree;
    }

    private byte[] generateECDHSecret(Key privateKey, Key publicKey) throws InvalidKeyException, NoSuchAlgorithmException {
        KeyAgreement keyAgreement = getECDHKeyAgreement(privateKey);
        keyAgreement.doPhase(publicKey, true);
        return keyAgreement.generateSecret();
    }

    public String generateECDHSecretString(String privateKey, String publicKey) throws InvalidKeyException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchProviderException {
        privateKey = privateKey.replaceAll(" ", "").replaceAll("\n", "").replaceAll("-----BEGINECPRIVATEKEY-----", "")
                .replaceAll("-----ENDECPRIVATEKEY-----", "").replaceAll(System.lineSeparator(), "");
        publicKey = publicKey.replaceAll(" ", "").replaceAll("\n", "").replaceAll("-----BEGINPUBLICKEY-----", "")
                .replaceAll("-----ENDPUBLICKEY-----", "").replaceAll(System.lineSeparator(), "");

        System.out.println("privateKey java : "+ privateKey);
        System.out.println("publicKey java : "+ publicKey);

        PrivateKey privateKey1 = generateECDHPrivateKeyFromBytes(privateKey);

        PublicKey publicKey1 = generateECDHPublicKeyFromBytes(publicKey);


        byte[] secret = generateECDHSecret(privateKey1, publicKey1);


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return Base64.getEncoder().encodeToString(secret);
        }
        return "";
    }


    public String generateECDHSecretStringFromStringPairs(String privateKey, String publicKey) throws InvalidKeyException, NoSuchAlgorithmException, InvalidKeySpecException {
        PrivateKey privateKey1 = generateECDHPrivateKeyFromBytes(privateKey);
        PublicKey publicKey1 = generateECDHPublicKeyFromBytes(publicKey);

        byte[] secret = generateECDHSecret(privateKey1, publicKey1);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return Base64.getEncoder().encodeToString(secret);
        }
        return "";
    }

    public byte[] encryptWithAES(byte[] Secret, byte[] initialVector, byte[] encryptingObject) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS7Padding");
        SecretKey aesKey = new SecretKeySpec(Secret, 0, 32, "AES");
        IvParameterSpec ivspec = new IvParameterSpec(initialVector);
        cipher.init(Cipher.ENCRYPT_MODE, aesKey, ivspec);
        return cipher.doFinal(encryptingObject);
    }


    public byte[] decryptWithAES(byte[] Secret, byte[] initialVector, byte[] encryptedObject) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        Cipher cipherD = Cipher.getInstance("AES/CBC/PKCS7Padding");
        SecretKey aesKeyD = new SecretKeySpec(Secret, 0, 32, "AES");
        IvParameterSpec ivspec = new IvParameterSpec(initialVector);
        cipherD.init(Cipher.DECRYPT_MODE, aesKeyD, ivspec);
        return cipherD.doFinal(encryptedObject);
    }


    public byte[] encryptBase64valuesWithAES(String Secret, String initialVector, String encryptingObject) throws InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        byte[] _secret = base64toByte(Secret);

        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] iv = md.digest(initialVector.getBytes());


        byte[] _encryptingObject = base64toByte(encryptingObject);

        return encryptWithAES(_secret, iv, _encryptingObject);
    }


    public byte[] decryptBase64valuesWithAES(String Secret, String initialVector, String encryptingObject) throws InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        byte[] _secret = base64toByte(Secret);

        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] iv = md.digest(initialVector.getBytes());


        byte[] _decryptingObject = base64toByte(encryptingObject);


        return decryptWithAES(_secret, iv, _decryptingObject);
    }


    public byte[] base64toByte(String base64string) {
        byte[] bytes = new byte[0];
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            bytes = Base64.getDecoder().decode(base64string);
        }

        return bytes;
    }

    public String byteToBase64(byte[] _byte) {
        String bytes = "";
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            bytes = Base64.getEncoder().encodeToString(_byte);
        }

        return bytes;
    }

    public PrivateKey generateECDHPrivateKeyFromBytes(String privateKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] keyBytes = android.util.Base64.decode(privateKey, android.util.Base64.DEFAULT);

        KeyFactory factNode1 = KeyFactory.getInstance("ECDH", bouncyCastleProvider);

        return factNode1.generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
    }

    public PrivateKey generateRSAPrivateKeyFromBytes(String privateKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] keyBytes = new byte[0];
        String s = privateKey.replaceAll("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll("-----END PRIVATE KEY-----", "").replaceAll(System.lineSeparator(), "");
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            keyBytes = Base64.getDecoder().decode(s);
        }

        KeyFactory factNode1 = KeyFactory.getInstance("RSA", bouncyCastleProvider);

        return factNode1.generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
    }

    public PublicKey generateECDHPublicKeyFromBytes(String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {


        byte[] keyBytes = android.util.Base64.decode(publicKey, android.util.Base64.DEFAULT);

        KeyFactory factNode1 = KeyFactory.getInstance("ECDH", bouncyCastleProvider);

        return factNode1.generatePublic(new X509EncodedKeySpec(keyBytes));
    }

    public String makeSignatureRSA(String privateKeyPem, String payload) throws Exception {
        String s = privateKeyPem.replaceAll("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll("-----END PRIVATE KEY-----", "").replaceAll(System.lineSeparator(), "");
        Signature rsaSign = Signature.getInstance("SHA256withRSA", bouncyCastleProvider);
        PrivateKey privateKey1 = generateRSAPrivateKeyFromBytes(s);
        rsaSign.initSign(privateKey1);
        if (isValidBase64(payload)) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                rsaSign.update(Base64.getDecoder().decode(payload));
            } else {

                throw new Exception("");
            }
        } else {
            rsaSign.update(payload.getBytes("UTF-8"));
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return Base64.getEncoder().encodeToString(rsaSign.sign());
        } else {

            throw new Exception("");
        }

    }

    public String makeSignatureRSA(String privateKeyPem, byte[] payload) throws Exception {
        String s = privateKeyPem.replaceAll("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll("-----END PRIVATE KEY-----", "").replaceAll(System.lineSeparator(), "");
        Signature rsaSign = Signature.getInstance("SHA256withRSA", bouncyCastleProvider);
        PrivateKey privateKey1 = generateRSAPrivateKeyFromBytes(s);
        rsaSign.initSign(privateKey1);

        rsaSign.update(payload);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return Base64.getEncoder().encodeToString(rsaSign.sign());
        }else {

            throw new Exception("") ;
        }


    }

    public byte[] makeSignature(PrivateKey privateKey, String signText) throws SignatureException, UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException {
        Signature ecdsaSign = Signature.getInstance("SHA256withECDSA", bouncyCastleProvider);
        ecdsaSign.initSign(privateKey);
        ecdsaSign.update(signText.getBytes("UTF-8"));
        return ecdsaSign.sign();
    }

    public boolean verifySignature(PublicKey publicKey, byte[] signature, String verifiedString) throws SignatureException, UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException {
        Signature ecdsaVerify = Signature.getInstance("SHA256withECDSA", bouncyCastleProvider);
        ecdsaVerify.initVerify(publicKey);
        ecdsaVerify.update(verifiedString.getBytes("UTF-8"));
        return ecdsaVerify.verify(signature);
    }

    public PublicKey getPublicKeyFromKeyPair(KeyPair keyPair) {

        return keyPair.getPublic();
    }

    public PrivateKey getPrivateKeyFromKeyPair(KeyPair keyPair) {
        return keyPair.getPrivate();
    }

    public String getString(byte[] key) {
        final char[] HEX_ARRAY = "0123456789ABCDEF".toCharArray();
        char[] hexChars = new char[key.length * 2];
        for (int j = 0; j < key.length; j++) {
            int v = key[j] & 0xFF;
            hexChars[j * 2] = HEX_ARRAY[v >>> 4];
            hexChars[j * 2 + 1] = HEX_ARRAY[v & 0x0F];
        }
        return new String(hexChars);
    }
}
