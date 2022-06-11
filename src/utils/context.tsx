import {createContext} from 'react';
import {UserState} from './interfaces';

export const userContext = createContext<UserState>({
  user: null,
  setUser: () => {},
});
