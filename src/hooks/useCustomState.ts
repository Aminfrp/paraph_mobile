import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

export default function useCustomState<T>(
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const navigation = useNavigation();

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setValue(defaultValue);
    });
  }, [navigation]);

  return [value, setValue];
}
