import React, { createContext, useContext, ReactNode } from 'react';
import { useAsyncStorage } from '../lib/storage';
import type { UserInfo } from '../lib/types';

interface UserInfoContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  importUserInfo: (userInfo: UserInfo) => void;
  isReady: boolean;
}

const defaultUserInfo: UserInfo = {
  name: '',
  address: '',
  cityState: '',
  country: '',
  zipCode: '',
};

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo, isLoading] = useAsyncStorage<UserInfo>('userInfo', defaultUserInfo);

  const importUserInfo = (newUserInfo: UserInfo) => {
    setUserInfo(newUserInfo);
  };

  return (
    <UserInfoContext.Provider value={{ 
      userInfo, 
      setUserInfo, 
      importUserInfo, 
      isReady: !isLoading 
    }}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }
  return context;
}