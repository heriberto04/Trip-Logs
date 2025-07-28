import { useState, useEffect, useCallback } from 'react';

type UseLocalStorageReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>, boolean];

export function useLocalStorage<T>(key: string, defaultValue: T): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
    } finally {
      setIsReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (isReady) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error writing to localStorage for key "${key}":`, error);
      }
    }
  }, [key, value, isReady]);

  const handleStorageChange = useCallback((event: StorageEvent) => {
    if (event.key === key && event.newValue) {
      try {
        setValue(JSON.parse(event.newValue));
      } catch(e) {
        console.error(`Error parsing storage change for key "${key}"`, e)
      }
    }
  }, [key]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  return [value, setValue, isReady];
}
