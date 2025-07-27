"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { UserInfo } from '@/lib/types';

interface UserInfoContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
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
  const [userInfo, setUserInfo] = useLocalStorage<UserInfo>('userInfo', defaultUserInfo);

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
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
