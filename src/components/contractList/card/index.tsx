import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../style';
import Badge from '../../badge';

type PropsType = {
  type: string;
  title: string;
  company: string;
  badgeText: string;
  badgeType: string;
  onPress: () => void;
};

const Index: React.FC<PropsType> = props => {
  const {type, title, company, badgeText, badgeType, onPress} = props;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTypeText} numberOfLines={1}>
        {type}
      </Text>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.cardFooterWrapper}>
        <View
          style={{
            maxWidth: '60%',
          }}>
          <Badge text={badgeText} type={badgeType} isBold={false} />
        </View>
        <Text style={styles.cardCompanyName} numberOfLines={1}>
          {company}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Index;
