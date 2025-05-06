import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultTheme} from '@react-navigation/native';

import NamadCertificateRequestPayment from '../../screens/certificates/namad/requestPayment';
import NamadCertificatePayment from '../../screens/certificates/namad/payment';
import NamadCertificateGenerate from '../../screens/certificates/namad/generate';
import NamadCertificateGenerateStatus from '../../screens/certificates/namad/generateStatus';
import NamadCertificatePaymentHistory from '../../screens/certificates/namad/paymentHistory';

import RisheCertificateRequestPayment from '../../screens/certificates/root/requestPayment';
import RisheCertificatePayment from '../../screens/certificates/root/payment';
import RisheCertificateGenerate from '../../screens/certificates/root/generate';
import RisheCertificateGenerateStatus from '../../screens/certificates/root/generateStatus';
import RisheCertificatePaymentHistory from '../../screens/certificates/root/paymentHistory';

import GenerateDeepLink from '../../screens/certificates/generateDeepLink';
import Certificates from '../../screens/certificates';

import {CertificateContext} from '../../context';
import {CertificateAction} from '../../context/actions';

import * as routesName from '../../constants/routesName';
import {
  NAMAD_PRODUCT_INVOICE_ID,
  RISHE_PRODUCT_INVOICE_ID,
} from '../../config/APIConfig';

export const CertificateStack = createStackNavigator();

const Index: React.FC = () => {
  const {certificateDispatch} = useContext<any>(CertificateContext);

  useEffect(() => {
    getProduct().then(r => {});
  }, []);

  const getProduct = async () => {
    await CertificateAction.getProductById(RISHE_PRODUCT_INVOICE_ID)(
      certificateDispatch,
    );
    await CertificateAction.getNamadProductById(NAMAD_PRODUCT_INVOICE_ID)(
      certificateDispatch,
    );
  };

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
    },
  };

  return (
    <CertificateStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
      initialRouteName={routesName.CHECK_CERTIFICATE}>
      {/*  CERTIFICATES*/}
      <CertificateStack.Screen
        name={routesName.CERTIFICATES}
        component={Certificates}
        initialParams={{showCancellation: true}}
      />

      {/*  NAMAD*/}
      <CertificateStack.Screen
        name={routesName.NAMAD_CERTIFICATE_REQUEST_PAYMENT}
        component={NamadCertificateRequestPayment}
      />
      <CertificateStack.Screen
        name={routesName.NAMAD_CERTIFICATE_PAYMENT}
        component={NamadCertificatePayment}
      />
      <CertificateStack.Screen
        name={routesName.NAMAD_CERTIFICATE_GENERATE}
        component={NamadCertificateGenerate}
        initialParams={{keyId: null}}
      />
      <CertificateStack.Screen
        name={routesName.NAMAD_CERTIFICATE_GENERATE_STATUS}
        component={NamadCertificateGenerateStatus}
      />
      <CertificateStack.Screen
        name={routesName.NAMAD_CERTIFICATE_PAYMENT_HISTORY}
        component={NamadCertificatePaymentHistory}
      />

      {/*  RISHE*/}
      <CertificateStack.Screen
        name={routesName.RISHE_CERTIFICATE_REQUEST_PAYMENT}
        component={RisheCertificateRequestPayment}
      />
      <CertificateStack.Screen
        name={routesName.RISHE_CERTIFICATE_PAYMENT}
        component={RisheCertificatePayment}
      />
      <CertificateStack.Screen
        name={routesName.RISHE_CERTIFICATE_GENERATE}
        component={RisheCertificateGenerate}
        initialParams={{keyId: null}}
      />
      <CertificateStack.Screen
        name={routesName.RISHE_CERTIFICATE_GENERATE_STATUS}
        component={RisheCertificateGenerateStatus}
      />
      <CertificateStack.Screen
        name={routesName.RISHE_CERTIFICATE_PAYMENT_HISTORY}
        component={RisheCertificatePaymentHistory}
      />

      {/*  DEEP_LINK*/}
      <CertificateStack.Screen
        name={routesName.GENERATE_CERTIFICATE_DEEP_LINK}
        component={GenerateDeepLink}
        initialParams={{
          invoiceId: null,
          customerInvoiceId: null,
          keyId: null,
        }}
      />
    </CertificateStack.Navigator>
  );
};

export default Index;
