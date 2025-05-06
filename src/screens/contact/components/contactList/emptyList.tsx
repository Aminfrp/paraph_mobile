import React from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Button from '../../../../components/button';
import styles from '../../contactList/style';
import * as routesName from '../../../../constants/routesName';

type PropsModel = {
  showCreateBtn?: boolean;
};

const Index: React.FC<PropsModel> = props => {
  const {showCreateBtn = true} = props;
  const {navigate} = useNavigation();

  // @ts-ignore
  const onCreate = () => navigate(routesName.CREATE_CONTACT, {contact: null});

  return (
    <View style={styles.emptyListWrapper}>
      <Text style={styles.emptyListText}>مخاطبی وجود ندارد.</Text>
      <View style={{width: '40%', marginTop: 20}}>
        {showCreateBtn && (
          <Button
            title="ایجاد"
            type="success-outline"
            disabled={false}
            onPress={onCreate}
          />
        )}
      </View>
    </View>
  );
};

export default Index;
