import { useState, useEffect } from 'react';

type UseLocalStorageReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>, boolean];

export function useLocalStorage<T>(key: string, defaultValue: T): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [isReady, setIsReady] = useState(false);

  // This effect will only run on the client, after the initial render.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    } finally {
        setIsReady(true);
    }
  }, [key]);

  useEffect(() => {
    // This effect ensures we only write to localStorage on the client
    // and when the value is not the initial default.
    if(isReady){
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage for key "${key}":`, error);
        }
    }
  }, [key, value, isReady]);

  return [value, setValue, isReady];
}
