import AsyncStorage from '@react-native-async-storage/async-storage';

export class NativeStorage {
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

// Hook to replace useLocalStorage from the web version
export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(initialValue);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadValue = async () => {
      try {
        const item = await NativeStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error loading from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadValue();
  }, [key]);

  const setValue = React.useCallback(async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await NativeStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue, isLoading] as const;
}

import React from 'react';