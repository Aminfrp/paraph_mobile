import {View, Text} from 'react-native';
import React from 'react';
import styles from './style';

export default function Index(props) {
  return (
    <View style={styles.rulesContainer}>
      <View style={styles.iconContainer}>
        <Text style={[styles.text, {color: '#219775'}]}>
          راهنما و شرایط امضای دیجیتال
        </Text>
      </View>
      <View>
        <Text style={[styles.text, {color: '#333333'}]}>
          ۱. مطابق قانون تجارت الکترونیکی اگر سند شما شامل موارد زیر باشد، امکان
          امضای دیجیتال آن وجود ندارد:
        </Text>
        <Text style={[styles.text, {color: '#333333'}]}>
          الف) راهنمای استفاده از دارو
        </Text>
        <Text style={[styles.text, {color: '#333333'}]}>
          ب) سند مالکیت اموال غیرمنقول
        </Text>
        <Text style={[styles.text, {color: '#333333'}]}>
          ج) اعلام، اخطار، هشدار و یا عبارات مشابهی که دستور خاصی برای استفاده
          کالا ‌صادر می‌کند و یا از بکارگیری روش‌های خاصی به صورت فعل یا ترک فعل
          منع می‌کند.
        </Text>
        <Text style={[styles.text, {color: '#333333'}]}>
          ۲. پس از امضای سند امکان بازگشت یا برداشتن امضا وجود ندارد.
        </Text>
      </View>
    </View>
  );
}
