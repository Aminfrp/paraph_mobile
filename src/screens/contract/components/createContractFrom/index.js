import React from 'react';
import {View} from 'react-native';
import Input from '../../../../components/input';
import styles from '../../create/style';
import FileUploader from '../../../../components/fileUploader';
import DatePicker from '../../../../components/datePicker';
import {getPersianDate} from '../../../../helpers/date';

const Index = props => {
  const {
    onFile,
    file,
    onTitle,
    onCode,
    onExpireTime,
    title,
    code,
    description,
    expireTime,
    onDescription,
    error,
  } = props;

  return (
    <View style={styles.formWrapper}>
      <Input
        onChangeText={onTitle}
        label="عنوان سند*"
        error={error && error.title}
        icon={null}
        value={title}
        type="dark"
        size="sm"
        isBorder={false}
        description="این عنوان سند است که به دیگر کاربران نیز نمایش داده می شود."
      />

      <Input
        onChangeText={onCode}
        label="شماره سند*"
        error={error && error.code}
        icon={null}
        value={code}
        type="dark"
        size="sm"
        isBorder={false}
        description="این شماره سند است که به دیگر کاربران نیز نمایش داده می شود."
      />

      <FileUploader
        label="بارگذاری فایل سند*"
        onChange={onFile}
        defaultValue={file}
        error={error && error.file}
        size="sm"
      />

      <Input
        onChangeText={onDescription}
        label="توضیحات سند"
        error={null}
        icon={null}
        value={description}
        type="dark"
        size="sm"
        isBorder={false}
        description="این توضیحات مربوط به سند است و به دیگر کاربران نیز نمایش داده می شود."
      />

      <DatePicker
        onChangeText={onExpireTime}
        label="مهلت امضای سند"
        error={error && error.expireTime}
        iconPosition="left"
        value={
          expireTime ? getPersianDate(new Date(expireTime).getTime()).date : ''
        }
        type="dark"
        size="sm"
        isBorder={false}
        onSubmit={onExpireTime}
      />
    </View>
  );
};

export default Index;
