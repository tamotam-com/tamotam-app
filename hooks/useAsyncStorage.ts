import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'

export default function useAsyncStorage(key: string, defaultValue: any) {
  const [storedValue, setStoredValue] = useState<any>();

  const readItemFromStorage: (key: string, defaultValue: any) => Promise<any> = async (key: string, defaultValue: any) => {
    let value: any = defaultValue;

    try {
      const itemJSON: any = await AsyncStorage.getItem(key);
      value = itemJSON ?? JSON.parse(itemJSON);
      setStoredValue(value);
    } catch (error) {
      if (error instanceof Error) {
        console.error('useAsyncStorage getItem error:', error);
      }
    }

    return value;
  };

  useEffect(() => {
    readItemFromStorage(key, defaultValue);
  }, [key, defaultValue]);

  const writeItemToStorage = useCallback(
    async (newValue: any) => {
      try {
        const itemStringifed: string = JSON.stringify(newValue);
        setStoredValue(itemStringifed);
        await AsyncStorage.setItem(key, itemStringifed);
      } catch (error) {
        if (error instanceof Error) {
          console.error('useAsyncStorage getItem error:', error);
        }
      }
    },
    [key],
  )

  return [storedValue, writeItemToStorage]
}
