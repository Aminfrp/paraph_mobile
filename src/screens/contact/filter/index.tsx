import React from 'react';
import {View, ScrollView} from 'react-native';
import styles from '../contactList/style';
import useCurrentRoute from '../../../hooks/useCurrentRoute';
import Input from '../../../components/input';
import Button from '../../../components/button';
import useCustomState from '../../../hooks/useCustomState';

type PropsModel = {
  onSubmit: <T>(input: T) => void;
  onResetFilter: () => void;
};

type SubmitInputModel = {firstName: string; lastName: string};

const Index: React.FC<PropsModel> = props => {
  const {onSubmit, onResetFilter} = props;
  const [firstName, setFirstName] = useCustomState('');
  const [lastName, setLastName] = useCustomState('');
  const [error, setError] = useCustomState<any>(null);

  useCurrentRoute(true);

  const onFirstName = (value: string) => {
    resetError('firstName');
    setFirstName(value);
  };

  const onLastName = (value: string) => {
    resetError('lastName');
    setLastName(value);
  };

  const resetError = (key: string) => {
    if (error !== null) {
      const errorObj = {...error};

      if (error.hasOwnProperty(key)) {
        delete errorObj[key];
      }

      setError(errorObj);
    }
  };

  const onSubmitHandler = () =>
    onSubmit<SubmitInputModel>({firstName, lastName});

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={{padding: 20}}>
        <Input
          onChangeText={onFirstName}
          label="نام"
          value={firstName}
          size="sm"
          isBorder={false}
          iconPosition="left"
          style={styles.filterInput}
        />
        <Input
          onChangeText={onLastName}
          label="نام خانوادگی"
          value={lastName}
          size="sm"
          isBorder={false}
          iconPosition="left"
          style={styles.filterInput}
        />

        <Button
          title="اعمال"
          onPress={onSubmitHandler}
          disabled={false}
          loading={false}
          type="success"
        />
        <Button
          title="بازنشانی"
          onPress={onResetFilter}
          disabled={false}
          loading={false}
          type="primary-outline"
        />
      </View>
    </ScrollView>
  );
};

export default Index;
