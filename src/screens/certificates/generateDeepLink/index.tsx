import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useEffect} from 'react';
import {View} from 'react-native';
import {getInvoiceListWithMetadataSearchService} from '../../../apis';
import Loading from '../../../components/loading';
import {
  NAMAD_CERTIFICATE_GENERATE,
  RISHE_CERTIFICATE_GENERATE,
} from '../../../constants/routesName';
import {CertificateTypeEnum} from '../../../model/certificateType.enum';
import {GetInvoiceListInputModel} from '../../../model/getInvoiceListInput.model';
import {InvoiceModel} from '../../../model/invoice.model';
import {Logger} from '../../../modules/log/logger';

const Index: React.FC = () => {
  const {params} = useRoute<RouteProp<any>>();
  const {navigate} = useNavigation();
  const keyId: string = params?.keyId;
  const invoiceId: string = params?.invoiceId;
  const customerInvoiceId: string = params?.customerInvoiceId;

  useEffect(() => {
    handleOpenURL().then(r => {});
  }, []);

  const handleOpenURL = async () => {
    if (keyId) {
      const invoice: InvoiceModel = await getInvoiceByKeyId(keyId);
      if (invoice) {
        const certificateType =
          invoice?.metadata?.clientMetadata[0]?.certificateType;

        if (certificateType === CertificateTypeEnum.namad) {
          // @ts-ignore
          navigate(NAMAD_CERTIFICATE_GENERATE, {
            invoiceId: invoiceId,
            customerInvoiceId: customerInvoiceId,
            keyId: keyId,
          });
        } else if (certificateType === CertificateTypeEnum.rishe) {
          // @ts-ignore
          navigate(RISHE_CERTIFICATE_GENERATE, {
            invoiceId: invoiceId,
            customerInvoiceId: customerInvoiceId,
            keyId: keyId,
          });
        }
      }
    }
  };

  const getInvoiceByKeyId = async (keyId: string): Promise<InvoiceModel> => {
    try {
      const now = new Date();
      const toDate = now.toISOString().slice(0, 19).replace('T', ' ');
      const fromDate = `${now.getFullYear() - 1}/01/01 00:00:00`;

      const postData: GetInvoiceListInputModel = {
        fromDate,
        toDate,
        offset: 0,
        size: 1,
        customerInvoice: false,
      };

      const response = await getInvoiceListWithMetadataSearchService(postData);
      const data = response && response.data.result;

      return Promise.resolve(data[0]);
    } catch (error) {
      Logger.debugLogger('error in getInvoiceByKeyId: ', error);
      return Promise.reject(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Loading />
    </View>
  );
};

export default Index;
