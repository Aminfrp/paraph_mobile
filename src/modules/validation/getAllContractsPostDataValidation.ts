type PostDataModel = {
  pageSize: number;
  pageNumber: number;
  start_date: string;
  to_date: string;
  contactId: number;
};

export default (postData: PostDataModel) => {
  checkDate(postData);

  if (!postData.pageSize && !postData.pageNumber) {
    return Promise.reject(['تعداد و صفحه خواسته شده وجود ندارد!']);
  }

  if (!postData.contactId) {
    return Promise.reject(['آیدی کاربر یافت نشد!']);
  }

  if (!postData.hasOwnProperty('accountOwner')) {
    return Promise.reject(['لطفا دیتای مربوط به نوع کاربر را مشخص کنید!']);
  }

  return true;
};

const checkDate = (postData: PostDataModel) => {
  if (postData.start_date) {
    if (postData.to_date) {
      const isValid = differenceDateValidation(
        postData.start_date,
        postData.to_date,
      );

      return (
        !isValid && Promise.reject(['بازه زمانی مشخص شده معتبر نمی باشد!'])
      );
    } else {
      return Promise.reject(['بازه زمانی مشخص شده معتبر نمی باشد!']);
    }
  }
};

// 2021-10-21...
const differenceDateValidation = (startDate: string, toDate: string) => {
  const START_DATE = startDate.split('-').join('/');
  const TO_DATE = toDate.split('-').join('/');

  return Date.parse(TO_DATE) >= Date.parse(START_DATE);
};
