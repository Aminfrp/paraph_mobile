import {getDeviceUniqueId} from '../../helpers/deviceInfo';
import {GetInvoiceListInputModel} from '../../model/getInvoiceListInput.model';
import {getInvoiceListWithMetadataSearchService} from '../index';

export default async (postData: GetInvoiceListInputModel) => {
  const now = new Date();
  const fromDate = `${now.getFullYear() - 2}/01/01 00:00:00`;
  const toDate = `${now.getFullYear() + 2}/01/01 00:00:00`;

  try {
    const uniqId = await getDeviceUniqueId();
    let extendedFilter = buildExtendedFilter({
      deviceType: 'mobile',
      macId: uniqId,
      keyIdResponse: postData.is,
    });

    const postDataFilter: any = {
      fromDate,
      toDate,
      offset: 0,
      size: 50,
      customerInvoice: false,
      field: 'keyIdResponse',
      is: postData?.is,
      and: extendedFilter,
    };

    if (!extendedFilter) {
      delete postDataFilter.and;
    }

    if (postData?.field === 'keyIdResponse' && !postData.is) {
      delete postDataFilter.field;
      delete postDataFilter.is;
      delete postDataFilter.and;
    }

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

  if (filterData.keyIdResponse) {
    filterJson.push({
      field: 'keyIdResponse',
      is: filterData?.keyIdResponse,
    });
  }

  return encodeURIComponent(JSON.stringify(filterJson));
};
