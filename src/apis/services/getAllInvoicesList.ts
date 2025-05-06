import {getDeviceUniqueId} from '../../helpers/deviceInfo';
import {GetInvoiceListInputModel} from '../../model/getInvoiceListInput.model';
import {getInvoiceListWithMetadataSearchService} from '../index';

export default async (
  postData: GetInvoiceListInputModel,
  justDevice?: boolean,
) => {
  const now = new Date();
  const toDate = now.toISOString().slice(0, 19).replace('T', ' ');

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  const fromDate = oneWeekAgo.toISOString().slice(0, 19).replace('T', ' ');

  try {
    const postDataFilter: any = {
      fromDate,
      toDate,
      offset: 0,
      size: 50,
      customerInvoice: false,
      field: 'certificateType',
    };

    return await getInvoiceListWithMetadataSearchService(postDataFilter);
  } catch (e) {
    throw e;
  }
};

const buildExtendedFilter = (filterData: any) => {
  const filterJson = [
    {
      field: 'deviceType',
      is: filterData?.deviceType,
    },
    {
      field: 'macId',
      is: filterData?.macId,
    },

    // {
    //   "field": "version",
    //   "is": "1",
    //   "or": [
    //     {
    //       "field": "version",
    //       "is": "legacy"
    //     }
    //   ]
    // }
  ];

  return encodeURIComponent(JSON.stringify(filterJson));
};
