import {ContractStatesModel} from '../../model/contractStates.model.ts';

export const getContractStatusBadgeType = (status: string): string => {
  switch (status) {
    case 'SUBMITTED': {
      return 'warning';
    }
    case 'DOWNLOADED': {
      return 'warning';
    }
    case 'NOT_SIGNED': {
      return 'danger';
    }
    case 'OPENED': {
      return 'primary';
    }
    case 'FAIL_TO_FETCH': {
      return 'info';
    }
    case 'SIGNED': {
      return 'success';
    }
    case 'REJECTED': {
      return 'danger';
    }
    case 'GATEWAY_SIGNED': {
      return 'success';
    }
    case 'WAIT_FOR_SIGN_ON_GATEWAY': {
      return 'warning';
    }

    default: {
      return 'warning';
    }
  }
};

export const getContractStatusBadgeText = (
  status: string,
  states?: ContractStatesModel,
): string => {
  if (states) {
    return Object.values(states[status])[0];
  }
  switch (status) {
    case 'SUBMITTED': {
      return 'ثبت شده';
    }
    case 'DOWNLOADED': {
      return 'در انتظار امضا';
    }
    case 'NOT_SIGNED': {
      return 'رد شده';
    }
    case 'OPENED': {
      return 'مشاهده شده';
    }
    case 'FAIL_TO_FETCH': {
      return 'خطا در دریافت اطلاعات';
    }
    case 'SIGNED': {
      return 'امضا شده';
    }
    case 'REJECTED': {
      return 'لغو شده';
    }
    case 'GATEWAY_SIGNED': {
      return 'امضا شده در درگاه امضا';
    }
    case 'WAIT_FOR_SIGN_ON_GATEWAY': {
      return 'در انتظار امضا درگاه';
    }

    default: {
      return 'ارسال شده';
    }
  }
};
