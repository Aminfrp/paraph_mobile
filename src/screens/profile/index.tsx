import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
import styles from './style';
import Input from '../../components/input';
import Button from '../../components/button';
import {changeUserNameService, getUserProfileService} from '../../apis';
import * as Toast from '../../components/toastNotification/utils';
import {isPersianString} from '../../modules/validation/validation';
import debugLogger from '../../helpers/debugLogger';
import sleep from '../../helpers/sleep';

const Index: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [changeUsernameLoading, setChangeUsernameLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserInfo();

    return () => {};
  }, []);

  const getUserInfo = async () => {
    try {
      setLoading(true);

      const response = await getUserProfileService();
      const data = response.data;
      setUsername(data.result.username);
      setLoading(false);
    } catch (error) {
      debugLogger('error in getUserProfile:', error);
      setLoading(false);
    }
  };

  const onUsername = (value: string) => {
    setUsername(value);

    if (value !== '') {
      if (value.length < 3) {
        setError('نام کاربری معتبر نیست!');
      } else {
        setError(null);
      }
    } else {
      setError('نام کاربری را وارد نمایید!');
    }
  };

  const onSubmit = async () => {
    try {
      setChangeUsernameLoading(true);

      if (validation(username)) {
        await changeUsername(username);
        await sleep(1500);
        await getUserInfo();
      }

      setChangeUsernameLoading(false);
    } catch (error) {
      debugLogger('error in onSubmit:', error);
      setChangeUsernameLoading(false);
    }
  };

  const validation = (username: string) => {
    if (username === '') {
      setError('نام کاربری را وارد نمایید!');
      return false;
    }
    if (username.length < 3) {
      setError('نام کاربری معتبر نیست!');
      return false;
    }

    if (isPersianString(username)) {
      setError('نام کاربری معتبر نیست!');
      return false;
    }

    return true;
  };

  const changeUsername = async (username: string) => {
    try {
      const response = await changeUserNameService(username);

      if (response) {
        Toast.showToast(
          'success',
          'نام کاربری',
          'نام کاربری با موفقیت تغییر یافت',
        );
      }
    } catch (error: any) {
      debugLogger('error in changeUsername:', error);

      if (error && error.data && error.data.error) {
        Toast.showToast('danger', 'نام کاربری', error.data.error);
      } else {
        Toast.showToast(
          'danger',
          'نام کاربری',
          'تغییر نام کاربری با خطا مواجه شد',
        );
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <Text style={styles.title}> حساب کاربری</Text>
        </View>
        <View style={styles.form}>
          <Input
            onChangeText={(value: string) => onUsername(value)}
            label="نام کاربری"
            error={error}
            iconPosition="right"
            value={username}
            type="secondary"
            size="md"
          />

          <Button
            title="ذخیره"
            disabled={changeUsernameLoading}
            loading={changeUsernameLoading}
            onPress={onSubmit}
            type="success"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
