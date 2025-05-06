package com.paraph_mobile;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Base64;

public class FileManipulatorModule extends ReactContextBaseJavaModule {

    public FileManipulatorModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "FileManipulator";
    }

    @ReactMethod
    public byte[] decodeBase64String(String base64Data) {
        byte[] bytes = new byte[0];
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            bytes = Base64.getDecoder().decode(base64Data);
        }
        return bytes;
    }

    @ReactMethod
    public boolean isBase64DataAsPdf(String base64Data, Promise promise) {
        boolean isValid = true;

        try {
            byte[] bytes = base64Decoder(base64Data);
            // Check if the first few bytes of the data match the PDF magic number
            String pdfMagicNumber = "%PDF-";
            byte[] magicNumberBytes = pdfMagicNumber.getBytes();

            for (int i = 0; i < magicNumberBytes.length; i++) {
                if (bytes.length <= i || bytes[i] != magicNumberBytes[i]) {
                    isValid = false;
                    break;
                }
            }
            promise.resolve(isValid);

        } catch (Exception e) {
            promise.reject(e);
        }
        return false;
    }

    private byte[] base64Decoder(String base64Data) {
        byte[] bytes = new byte[0];
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            bytes = Base64.getDecoder().decode(base64Data);
        }
        return bytes;
    }
}
