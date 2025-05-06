package com.paraph_mobile;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SignatureException;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public class EncryptionUtilModule extends ReactContextBaseJavaModule {

    final private EncryptionUtil EncryptUtilInstance = new EncryptionUtil();

    public EncryptionUtilModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "EncryptionUtil";
    }

    @ReactMethod
    public WritableMap getRsaKeyPairsAsync(int size, Promise promise) {
        try {
            Map<String, String> keyPair = this.EncryptUtilInstance.getRSAKeyPairPEM(size);
            final String publicKey = (String) keyPair.get("publicKey");
            final String privateKey = (String) keyPair.get("privateKey");

            WritableMap resultData = new WritableNativeMap();
            resultData.putString("private", privateKey);
            resultData.putString("public", publicKey);

            promise.resolve(resultData);
        } catch (Exception e) {
            promise.reject(e);
        }
        return null;
    }

    @ReactMethod
    public WritableMap generateSecretKey(String private_key, String public_key, Promise promise) {
        try {
            Map<String, String> ecKeyPair = this.EncryptUtilInstance.getKeyPair();

            String secretByJsPairs = this.EncryptUtilInstance.generateECDHSecretString((String) private_key, (String) public_key);

            WritableMap resultData = new WritableNativeMap();
            resultData.putString("data", secretByJsPairs);

            promise.resolve(resultData);
        } catch (Exception e) {
            promise.reject(e);
        }
        return null;
    }

    @ReactMethod
    public byte[] encryptWithAES(String secret, String initialVector, String encryptingObject, Promise promise) throws InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        try {
            byte[] encFile = this.EncryptUtilInstance.encryptBase64valuesWithAES(secret, initialVector, encryptingObject);
            WritableMap resultData = new WritableNativeMap();

            String base64 = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                base64 = Base64.getEncoder().encodeToString(encFile);
                resultData.putString("data", base64);
            }
            promise.resolve(resultData);
        } catch (Exception e) {
            promise.reject(e);
        }
        return null;

    }

    @ReactMethod
    public byte[] decryptWithAES(String secret, String initialVector, String encryptingObject, Promise promise) throws InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        try {
            byte[] decFile = this.EncryptUtilInstance.decryptBase64valuesWithAES(secret, initialVector, encryptingObject);
            WritableMap resultData = new WritableNativeMap();
            String value = this.EncryptUtilInstance.byteToBase64(decFile);
            resultData.putString("data", value);
            promise.resolve(resultData);
        } catch (Exception e) { 
            promise.reject(e);
        }
        return null;
    }

    @ReactMethod
    public String createSignatureRSA(String privateKey, String signText, Promise promise) throws UnsupportedEncodingException, SignatureException, NoSuchAlgorithmException, InvalidKeySpecException, InvalidKeyException {
        try {
            String signature = this.EncryptUtilInstance.makeSignatureHsa256RSA(privateKey, signText);
            promise.resolve(signature);
        } catch (Exception e) {
            promise.reject(e);
        }
        return null;
    }

    @ReactMethod
    public String createSignCSR(String subject, String private_key, String public_key, Promise promise) {
        try {
            PrivateKey privateKey = this.EncryptUtilInstance.generateRSAPrivateKeyFromBytes(private_key);
            PublicKey publicKey = this.EncryptUtilInstance.generateRSAPublicKeyFromBytes(public_key);

            String signature = this.EncryptUtilInstance.signCSR(subject, publicKey, privateKey);

            promise.resolve(signature);
        } catch (Exception e) {
            promise.reject(e);
        }
        return null;
    }
}
