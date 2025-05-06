import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import styles from '../style';
import Button from '../../../components/button';
import FileUploadView from '../../../components/fileUploadView';
import {downloadLocalFile} from '../modules/downloadHandler';
import {useNavigation} from '@react-navigation/native';

type PropsModel = {
  route: any;
};

const Index: React.FC<PropsModel> = props => {
  const {route} = props;
  const {goBack} = useNavigation();

  const paramsState = route.params;
  const value = paramsState.value;

  const downloadHandler = () => downloadLocalFile(value.fileCopyUri);

  return (
    <ScrollView>
      <View style={styles.wrapper}>
        <View style={styles.notValidHeaderWrapper}>
          <FileUploadView value={value} icon={true} onPress={downloadHandler} />
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 28,
              marginBottom: 33,
            }}>
            <Image
              source={require('../../../assets/img/warning_error_icon.png')}
            />
          </View>

          <Text style={styles.notValidTitle}>
            متاسفانه چنین سندی تاکنون در پلتفرم پاراف امضا نگردیده است.
          </Text>
          <Text style={[styles.notValidHeaderText, {paddingHorizontal: 10}]}>
            دقت نمایید که هر تغیری در فایل سند، موجب شناسایی آن به عنوان سند
            جدید است.
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <View style={{marginTop: 10, marginHorizontal: 5, width: '60%'}}>
            <Button
              title="اعتبار سنجی سند جدید"
              disabled={false}
              loading={false}
              onPress={goBack}
              type="warning"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
