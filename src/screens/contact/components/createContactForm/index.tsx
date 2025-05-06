import React from 'react';
import {View} from 'react-native';
import Input from '../../../../components/input';
import Button from '../../../../components/button';
import styles from '../../create/style';
import {ContractModel} from '../../../../model/contract.model';

type PropsModel = {
  loading: boolean;
  submit: () => void;
  goBack: () => void;
  disabled: boolean;
  firstName: string;
  lastName: string;
  nationalId: string;
  cellphoneNumber: string;
  isNationalCode: boolean;
  onFirstName: (value: string) => void;
  onLastName: (value: string) => void;
  onCellphoneNumberName: (value: string) => void;
  onNationalId: (value: string) => void;
  onCheckBox: (value: boolean) => void;
  contactData: ContractModel;
  error: any;
  isLegal: boolean;
  onCompanyName: (value: string) => void;
  companyName: string;
  onCompanyId: (value: string) => void;
  companyId: string;
  isEditMode?: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {
    loading,
    submit,
    goBack,
    disabled,
    firstName,
    lastName,
    nationalId,
    cellphoneNumber,
    isNationalCode,
    onFirstName,
    onLastName,
    onCellphoneNumberName,
    onNationalId,
    onCheckBox,
    contactData,
    error,
    isLegal,
    onCompanyName,
    companyName,
    onCompanyId,
    companyId,
    isEditMode,
  } = props;

  return (
    <View style={styles.form}>
      {isLegal ? (
        <>
          <Input
            onChangeText={(value: string) => onCompanyName(value)}
            label="نام شرکت/سازمان"
            error={error && error.companyName}
            icon={null}
            value={companyName}
            size="sm"
          />
          <Input
            onChangeText={(value: string) => onCompanyId(value)}
            label="شناسه ملی شرکت/سازمان"
            error={error && error.companyId}
            icon={null}
            keyboardType="number-pad"
            value={companyId}
            size="sm"
            editable={
              contactData ? !(contactData && !!contactData.nationalId) : true
            }
          />
        </>
      ) : (
        <>
          <Input
            onChangeText={(value: string) => onFirstName(value)}
            label="نام"
            error={error && error.firstName}
            icon={null}
            value={firstName}
            size="sm"
          />
          <Input
            onChangeText={(value: string) => onLastName(value)}
            label="نام خانوادگی"
            error={error && error.lastName}
            icon={null}
            value={lastName}
            size="sm"
          />
          {!contactData && (
            <>
              {isNationalCode ? (
                <Input
                  onChangeText={(value: string) => onNationalId(value)}
                  label="شماره ملی"
                  error={error && error.nationalId}
                  icon={null}
                  keyboardType="number-pad"
                  value={nationalId}
                  size="sm"
                  editable={
                    contactData
                      ? !(contactData && !!contactData.nationalId)
                      : true
                  }
                  switchLabel="استفاده از شماره ملی"
                  switchOnChange={onCheckBox}
                  switchValue={isNationalCode}
                />
              ) : (
                <Input
                  onChangeText={(value: string) => onCellphoneNumberName(value)}
                  label="شماره تماس"
                  error={error && error.cellphoneNumber}
                  icon={null}
                  keyboardType="number-pad"
                  value={cellphoneNumber}
                  size="sm"
                  editable={
                    contactData
                      ? !(contactData && !!contactData.cellphoneNumber)
                      : true
                  }
                  switchLabel="استفاده از شماره ملی"
                  switchOnChange={onCheckBox}
                  switchValue={isNationalCode}
                />
              )}
            </>
          )}
        </>
      )}
      <View style={styles.submitWrapper}>
        <View style={styles.btnWrapper}>
          <Button
            title="لغو"
            disabled={loading}
            loading={false}
            onPress={goBack}
            type="white-outline"
          />
        </View>
        <View style={styles.btnWrapper}>
          <Button
            title={!contactData ? 'ایجاد مخاطب' : 'ویرایش'}
            disabled={disabled || loading}
            loading={loading}
            onPress={submit}
            type="success"
          />
        </View>
      </View>
    </View>
  );
};

export default Index;
