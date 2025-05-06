import React from 'react';
import {View} from 'react-native';
import Input from '../../../../components/input';

type PropsModel = {
  firstName?: string;
  lastName?: string;
  onFirstName?: (input: string) => void;
  onLastName?: (input: string) => void;
  firstNameError?: string | null;
  lastNameError?: string | null;
  email?: string;
  address?: string;
  onEmail?: (input: string) => void;
  onAddress?: (input: string) => void;
  emailError?: string | null;
  addressError?: string | null;
  showEmail?: boolean;
  isFullName?: boolean;
  loading: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {
    firstName,
    lastName,
    onFirstName,
    onLastName,
    firstNameError,
    lastNameError,
    onEmail,
    emailError,
    email,
    onAddress,
    addressError,
    address,
    showEmail,
    isFullName = true,
    loading,
  } = props;

  return (
    <View style={[]}>
      <View>
        {isFullName && (
          <>
            <Input
              onChangeText={onFirstName}
              placeholder="نام خود را به انگلیسی وارد نمایید..."
              label="نام به انگلیسی"
              error={firstNameError}
              size="sm"
              value={firstName}
              editable={!loading}
            />
            <Input
              onChangeText={onLastName}
              placeholder="نام خانوادگی خود را به انگلیسی وارد نمایید..."
              label="نام خانوادگی به انگلیسی"
              error={lastNameError}
              size="sm"
              value={lastName}
              editable={!loading}
            />
          </>
        )}

        {showEmail && (
          <Input
            onChangeText={onEmail}
            placeholder="ایمیل خود را وارد نمایید..."
            label="ایمیل"
            error={emailError}
            size="sm"
            value={email}
            editable={!loading}
          />
        )}
        {showEmail && (
          <Input
            onChangeText={onAddress}
            placeholder="آدرس خود را وارد نمایید..."
            label="آدرس"
            error={addressError}
            size="sm"
            value={address}
            editable={!loading}
          />
        )}
      </View>
    </View>
  );
};

export default Index;
