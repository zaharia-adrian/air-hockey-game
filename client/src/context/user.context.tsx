import React, { createContext, useContext, useState, ReactNode} from "react";
import { User } from "../types/user.type";


type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};


const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const value: UserContextType = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
