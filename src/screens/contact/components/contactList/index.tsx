import React from 'react';
import {FlatList, View} from 'react-native';
import ContactCard from '../contactCard';
import AbsoluteLoading from '../../../../components/absoluteLoading';
import EmptyList from './emptyList';
import styles from '../../contactList/style';
import UserTypeFilter from './userTypeFilter';
import {ContactModel} from '../../../../model/contact.model';

type PropsModel = {
  data: ContactModel[];
  loadMoreData: () => void;
  loading: boolean;
  getCardBorderColor: (input: string) => string;
  holdContactHandler: (input: ContactModel) => void;
  onContactHandler: (input: ContactModel) => void;
  showCreateBtn?: boolean;
  onUserType: (input: string) => void;
  userType: string;
};

const Index: React.FC<PropsModel> = props => {
  const {
    data,
    loadMoreData,
    loading,
    getCardBorderColor,
    holdContactHandler,
    onContactHandler,
    showCreateBtn = true,
    onUserType,
    userType,
  } = props;

  return (
    <View style={styles.wrapper}>
      {loading && <AbsoluteLoading />}
      <FlatList
        style={{paddingHorizontal: 10}}
        data={data && data}
        renderItem={({item, index}) => (
          <ContactCard
            key={index}
            item={item}
            getCardBorderColor={getCardBorderColor}
            holdContactHandler={holdContactHandler}
            onContactHandler={onContactHandler}
          />
        )}
        keyExtractor={item => item.id}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        refreshing={false}
        ListEmptyComponent={<EmptyList showCreateBtn={showCreateBtn} />}
        ListHeaderComponent={
          <UserTypeFilter onChange={onUserType} value={userType} />
        }
      />
    </View>
  );
};

export default Index;
