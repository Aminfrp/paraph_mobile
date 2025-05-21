const isDevMode: boolean = true;

const CONTRACT_IV = 'fZNZP__$__cONTRACT__$__iV__Key';

const APP_VERSION = 'm-4-0-2';
const APP_VERSION_STRING = `4.0.2 ${isDevMode ? 'QC' : ''}`;

const WE_POD_LEVEL_UP_LINK =
  'https://levelup.wepod.ir/fa/profile/standalone-login?theme=219775&logo=QCE7RMLWI1BTVWEW&redirect_url=https:%2F%2Fparaph.me%2Fcallbackapplication';

const QC_SERVER_URL = 'http://172.16.110.167:8080/';

let SERVER_URL: string;
let CLIENT_ID: string;
let USER_NAME: string;
let BUSINESS_CODE: number;
let RAD_SERVER_URL: string;
let POD_SERVER_URL: string;
let SSO_SERVER_URL: string;
let POD_SPACE_UPLOAD_FILE_LINK: string;
let LANDING_URL: string;
let PAYMENT_GATEWAY_URL: string;
let PAYMENT_GATEWAY_CALLBACK_URL: string;
let GATEWAY_TYPE: string;

const RAD_SANDBOX_SERVER_URL = 'https://rad-sandbox.sandpod.ir/';
const SSO_SANDBOX_SERVER_URL = 'https://sso-sandbox.sandpod.ir/';
const POD_SANDBOX_SERVER_URL = 'https://sandbox.sandpod.ir/';
const POD_SPACE_UPLOAD_LINK_SANDBOX_SERVER_URL =
  'https://podspace.sandpod.ir/api/files/';

const SSO_MAIN_SERVER_URL = 'https://accounts.pod.ir/';
const RAD_MAIN_SERVER_URL = 'https://rad-services.pod.ir/';
const POD_MAIN_SERVER_URL = 'https://api.pod.ir/';
const POD_SPACE_UPLOAD_LINK_MAIN_SERVER_URL =
  'http://podspace.pod.ir/api/files/';

const TESTBUSINESS_CLIENT_ID: string = '19106074ab16c4502b87b0e629ade3d70';
const TEST_USER_NAME: string = 'd.sajedi';
const TEST_BUSINESS_CODE: number = 3;
const TEST_LANDING_URL: string = 'https://landing.paraph.me/';

const PARAPH_CLIENT_ID: string = '22011487qcab0454d9bf6f9c1bf0171d2';
const PARAPH_USER_NAME: string = 'paraph';
const PARAPH_BUSINESS_CODE: number = 3;
const PARAPH_LANDING_URL: string = 'https://paraph.me/';

const PAYMENT_GATEWAY_SANDBOX_URL: string =
  'https://sandbox.sandpod.ir:1033/v1/pbc/payinvoice';
const PAYMENT_GATEWAY_MAIN_URL: string = 'https://pay.pod.ir/v1/pbc/payInvoice';

const NAMAD_PRODUCT_INVOICE_KEY: string = 'paraph-inv-namad';
let NAMAD_PRODUCT_INVOICE_ID: string;

const NAMAD_SANDBOX_PRODUCT_INVOICE_ID: string = '195807';
const NAMAD_MAIN_PRODUCT_INVOICE_ID: string = '19479360';
const NAMAD_MAIN_PRODUCT_INVOICE_ID_YE_RIAL: string = '40860010';

const RISHE_PRODUCT_INVOICE_KEY: string = 'paraph-inv';
let RISHE_PRODUCT_INVOICE_ID: string;

const RISHE_SANDBOX_PRODUCT_INVOICE_ID: string = '182737';
const RISHE_MAIN_PRODUCT_INVOICE_ID: string = '19479360';
const RISHE_MAIN_PRODUCT_INVOICE_ID_YE_RIAL: string = '8670294';

let AUTHORIZE_SCOPE: string = '';

if (isDevMode) {
  PAYMENT_GATEWAY_URL = PAYMENT_GATEWAY_SANDBOX_URL;
  GATEWAY_TYPE = 'LOC';
  NAMAD_PRODUCT_INVOICE_ID = NAMAD_SANDBOX_PRODUCT_INVOICE_ID;
  RISHE_PRODUCT_INVOICE_ID = RISHE_SANDBOX_PRODUCT_INVOICE_ID;

  CLIENT_ID = PARAPH_CLIENT_ID;
  USER_NAME = TEST_USER_NAME;
  BUSINESS_CODE = TEST_BUSINESS_CODE;
  AUTHORIZE_SCOPE =
    'profile login legal_nationalcode legal_birthdate storage_write legal phone key key_write key_sign certificate_write certificate';

  // server_url
  SERVER_URL = 'https://paraph.sandpod.ir/'; //'http://contract-qc.pod.ir:8080/'
  RAD_SERVER_URL = RAD_SANDBOX_SERVER_URL;
  POD_SERVER_URL = POD_SANDBOX_SERVER_URL;
  SSO_SERVER_URL = SSO_SANDBOX_SERVER_URL;
  POD_SPACE_UPLOAD_FILE_LINK = POD_SPACE_UPLOAD_LINK_SANDBOX_SERVER_URL;
  LANDING_URL = TEST_LANDING_URL;
} else {
  PAYMENT_GATEWAY_URL = PAYMENT_GATEWAY_MAIN_URL;
  GATEWAY_TYPE = 'PEP';
  NAMAD_PRODUCT_INVOICE_ID = NAMAD_MAIN_PRODUCT_INVOICE_ID_YE_RIAL;
  RISHE_PRODUCT_INVOICE_ID = RISHE_MAIN_PRODUCT_INVOICE_ID;

  CLIENT_ID = PARAPH_CLIENT_ID;
  USER_NAME = PARAPH_USER_NAME;
  BUSINESS_CODE = PARAPH_BUSINESS_CODE;
  AUTHORIZE_SCOPE =
    'profile login profile_write legal_nationalcode_write legal_birthdate storage_write legal_nationalcode profile_nickname_write profile_nickname storage legal key key_write key_sign certificate_write certificate';
  // server_url
  // todo: change main server for test namad certificate release(test)...
  SERVER_URL = 'https://paraph.pod.ir/';
  // SERVER_URL = 'https://paraph-test.sandpod.ir/';
  RAD_SERVER_URL = RAD_MAIN_SERVER_URL;
  POD_SERVER_URL = POD_MAIN_SERVER_URL;
  SSO_SERVER_URL = SSO_MAIN_SERVER_URL;
  POD_SPACE_UPLOAD_FILE_LINK = POD_SPACE_UPLOAD_LINK_MAIN_SERVER_URL;
  LANDING_URL = PARAPH_LANDING_URL;
}

PAYMENT_GATEWAY_CALLBACK_URL = `${LANDING_URL}payment/callback`;

export {
  APP_VERSION,
  APP_VERSION_STRING,
  AUTHORIZE_SCOPE,
  BUSINESS_CODE,
  CLIENT_ID,
  CONTRACT_IV,
  isDevMode,
  LANDING_URL,
  NAMAD_PRODUCT_INVOICE_ID,
  NAMAD_PRODUCT_INVOICE_KEY,
  PAYMENT_GATEWAY_CALLBACK_URL,
  PAYMENT_GATEWAY_URL,
  POD_SERVER_URL,
  POD_SPACE_UPLOAD_FILE_LINK,
  RAD_SERVER_URL,
  RISHE_PRODUCT_INVOICE_ID,
  RISHE_PRODUCT_INVOICE_KEY,
  SERVER_URL,
  SSO_SERVER_URL,
  USER_NAME,
  WE_POD_LEVEL_UP_LINK,
  GATEWAY_TYPE,
};
