import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styles from './style';

const Index = props => {
  const {type, nationalCode, name, show, number, date, status} = props;

  const getColor = () => {
    switch (type) {
      case 'unSigned':
        return 'red';
      case 'info':
        return 'yellow';
      case 'sign':
        return 'green';
      case 'primary':
        return 'none';
      default:
        return 'green';
    }
  };

  return (
    <>
      {show && (
        <View style={[styles.wrapper, {borderColor: getColor()}]}>
          <View style={styles.cardContainer}>
            <View style={styles.titleContainer}>
              <View>
                <Text style={styles.name}>{name}</Text>
              </View>
              <View style={styles.codeContainer}>
                <Text style={styles.code}>کد ملی</Text>
                <Text style={styles.code}>{nationalCode}</Text>
              </View>
            </View>
            <View style={styles.numberStyle}>
              <Text style={styles.number}>{number}</Text>
            </View>
          </View>
          <View>
            <Text style={[styles.dateTitle, {color: getColor()}]}>
              {status}
            </Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      )}
    </>
  );
};

export default Index;
