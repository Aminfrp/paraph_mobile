import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import * as routesName from '../../../../constants/routesName';
import colors from '../../../../assets/theme/colors';

type PropsModel = {
  navigation: any;
  state: any;
};

const Index: React.FC<PropsModel> = props => {
  const {
    navigation: {navigate, getState},
    state,
  } = props;
  const activeIndex = state?.index;
  const routes = getState()?.routes;
  const currentRoute = routes[activeIndex]?.name;

  const getFilterItemBorderColor = (key: string) => {
    return currentRoute === key
      ? styles.activeFilterItem
      : styles.inActiveFilterItem;
  };

  const getFilterItemTextColor = (key: string) => {
    return currentRoute === key
      ? styles.activeFilterItemText
      : styles.inActiveFilterItemText;
  };

  const filterList = [
    {
      key: routesName.DOCUMENT_CREATED,
      name: 'ایجاد شده',
      icon: null,
      onPress: () => navigate(routesName.DOCUMENT_CREATED),
    },
    {
      key: routesName.DOCUMENT_RECEIVED,
      name: 'دریافتی',
      icon: null,
      onPress: () => navigate(routesName.DOCUMENT_RECEIVED),
    },
    {
      key: routesName.DOCUMENT_ARCHIVED,
      name: 'آرشیو شده',
      icon: null,
      onPress: () => navigate(routesName.DOCUMENT_ARCHIVED),
    },
  ];

  return (
    <View style={styles.filterWrapper}>
      {filterList &&
        filterList.map(item => {
          return (
            <TouchableOpacity
              onPress={item.onPress}
              key={item.key}
              style={[styles.filterItem, getFilterItemBorderColor(item.key)]}>
              <Text
                style={[
                  styles.filterItemText,
                  getFilterItemTextColor(item.key),
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  filterWrapper: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterItem: {
    width: '33%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: colors.white,
    borderTopColor: colors.secondary.gray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  activeFilterItem: {
    borderBottomColor: colors.primary.success,
  },
  inActiveFilterItem: {
    borderBottomColor: colors.secondary.gray,
  },
  filterItemText: {
    fontFamily: 'YekanBakh-Bold',
    fontSize: 16,
  },
  activeFilterItemText: {
    color: colors.primary.success,
  },
  inActiveFilterItemText: {
    color: colors.primary.gray,
  },
});

export default Index;
