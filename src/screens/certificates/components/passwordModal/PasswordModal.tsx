import React from 'react';
import {Text, View} from "react-native";
import Input from "../../../../components/input";
import Button from "../../../../components/button";
import RbSheet from '../../../../components/rbSheet';
import {styles} from "./passwordModal.style.ts";

type PasswordModalPropsModel = {
    loading: boolean;
    show: boolean;
    onClose: () => void;
    onInquiry: (password: string) => void;
};

const PasswordModal: React.FC<PasswordModalPropsModel> = props => {
    const {loading, show, onClose, onInquiry} = props;
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] =React.useState<string | null>(null);
    const refRBSheet = React.useRef();

    const onPasswordChange = (_pass: string) => {
        if (passwordError) {
            setPasswordError(null);
        }
        setPassword(_pass);
    };

    const handleInquiry = () => {
        if (password && password !== '') {
            return onInquiry(password);
        }
        setPasswordError('لطفا رمز خود را وارد نمایید');
    };

    return (
        <View>
            <RbSheet
                ref={refRBSheet}
                disabled={true}
                height={380}
                visible={show}
                onClose={onClose}
                closeOnPressBack={false}
                closeOnDragDown={false}
                closeOnPressMask={false}>
                <View style={{padding: 10}}>
                    <Text
                        style={[
                            styles.titleText,
                            {
                                textAlign: 'center',
                                borderColor: '#EBECF0',
                                borderBottomWidth: 1,
                            },
                        ]}>
                        اعتبار سنجی گواهی امضای دیجیتال
                    </Text>

                    <Text style={[styles.titleText, {fontSize: 18, borderWidth: 0}]}>
                        وارد کردن رمز عبور
                    </Text>

                    <Text style={[styles.text]}>
                        جهت اعتبار سنجی گواهی امضای دیجیتال خود، رمز عبوری که موقع صدور گواهی
                        تعیین کرده‌اید را وارد کنید
                    </Text>

                    <View style={{paddingHorizontal: 10}}>
                        <Input
                            onChangeText={(value: string) => onPasswordChange(value)}
                            label="رمز عبور"
                            error={passwordError}
                            keyboardType="number-pad"
                            placeholder="رمز عبور گواهی امضای خود را بنویسید"
                            size="sm"
                            textHidden={true}
                        />

                        <View style={styles.btnGroupWrapper}>
                            <View style={styles.btnWrapper}>
                                <Button
                                    title="تایید"
                                    type="success"
                                    onPress={handleInquiry}
                                    loading={loading}
                                    disabled={loading}
                                />
                            </View>
                            <View style={styles.btnWrapper}>
                                <Button
                                    title="انصراف"
                                    type="white-outline"
                                    onPress={onClose}
                                    loading={false}
                                    disabled={loading}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </RbSheet>
        </View>
    );
};

export default PasswordModal;