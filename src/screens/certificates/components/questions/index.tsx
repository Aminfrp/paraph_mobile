import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from '../../style';

const Index: React.FC = () => {
  return (
    <View style={{}}>
      <Text style={styles.textTitle}>سوالات پرتکرار درباره گواهی امضا</Text>
      <View style={{marginVertical: 15}}>
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
        <QuestionItem />
      </View>
    </View>
  );
};

const QuestionItem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <TouchableOpacity onPress={toggle} style={{marginBottom: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 5,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/*<Image*/}
          {/*  source={require('../../../../assets/img/png/question 1.png')}*/}
          {/*  resizeMode="contain"*/}
          {/*  style={{*/}
          {/*    width: 30,*/}
          {/*    height: 30,*/}
          {/*  }}*/}
          {/*/>*/}
          <Text style={styles.certificateDataCardDateText}>
            سوال متداول اول
          </Text>
        </View>
        <Image
          source={require('../../../../assets/img/png/arrow-down.png')}
          resizeMode="contain"
          style={{
            width: 15,
            height: 15,
            transform: [{rotate: isOpen ? '180deg' : '0deg'}],
          }}
        />
      </View>
      {isOpen && (
        <View>
          <Text
            style={[
              styles.certificateDataCardDateText,
              {color: '#253858', fontSize: 14, textAlign: 'right'},
            ]}>
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
            استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است،
          </Text>
        </View>
      )}
      <View style={styles.certificateDataCardDivider} />
    </TouchableOpacity>
  );
};

export default Index;
