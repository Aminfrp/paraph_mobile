package com.paraph_mobile;

import com.facebook.react.bridge.ReactApplicationContext;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import java.util.Arrays;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SmsListenerModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public SmsListenerModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        registerSMSReceiver();
    }

    @NonNull
    @Override
    public String getName() {
        return "SmsListener";
    }

    private void sendEvent(String eventName, String message) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, message);
    }


    private void registerSMSReceiver() {
        BroadcastReceiver smsReceiver = new BroadcastReceiver() {
            @SuppressLint("LongLogTag")
            @Override
            public void onReceive(Context context, Intent intent) {
                Bundle extras = intent.getExtras();
                if (extras != null) {
                    Object[] pdus = (Object[]) extras.get("pdus");

                    StringBuilder message = new StringBuilder();
                    StringBuilder senderPhoneNumber = new StringBuilder();
                    StringBuilder timestamp = new StringBuilder();

                    for (Object pdu : pdus) {
                        SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdu);
                        String messageBody = sms.getMessageBody();
                        String senderPhoneNumberBody = sms.getOriginatingAddress();
                        long timestampBody = sms.getTimestampMillis();

                        message.append(messageBody);
                        message.append(senderPhoneNumberBody);
                        message.append(timestampBody);
                    }

                    WritableMap params = Arguments.createMap();
                    params.putString("messageBody", message.toString());
                    params.putString("senderPhoneNumber", senderPhoneNumber.toString());
                    params.putString("timestamp", senderPhoneNumber.toString());

                    String patternString = "code: (\\d{6})";
                    Pattern pattern = Pattern.compile(patternString);
                    Matcher matcher = pattern.matcher(message.toString());

                    if (matcher.find()) {
                        String codeValue = matcher.group(1); // Extract the code value
                        assert codeValue != null;
                        params.putString("codeValue", codeValue);
                        System.out.println("Code value: " + codeValue);
                    } else {
                        params.putDouble("codeValue", Double.parseDouble(""));
                        System.out.println("Code value not found.");
                    }

                    String jsonString = params.toString();
                    Log.i("jsonString////",jsonString);


                    if (message.toString().contains("paraph")) {
                        sendEvent("onSMSReceived", jsonString);
                    }
                }
            }
        };

        IntentFilter filter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
        this.reactContext.registerReceiver(smsReceiver, filter);
    }


    @ReactMethod
    public void startListeningToSMS() {
        registerSMSReceiver();
    }
}
