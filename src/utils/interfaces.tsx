export interface User {
  displayName: string;
  email: string;
  expiresAt: number;
  firstName: string;
  lastName: string;
  role: string;
  security: {
    has2fa: boolean;
  };
  token: string;
  username: string;
  loggedIn: boolean;
}

export interface UserState {
  user: User | null;
  setUser: any;
}

export interface MinerStats_Coins {
  id: string;
  coin: string;
  name: string;
  algorithm: string;
  price: number;
  network_hashrate: number;
  difficulty: number;
  volume: number;
  reward: number;
  reward_block: number;
}

export interface EarningBalance {
  balance: {
    minimum: number;
    paid: number;
    price: number;
    wallet: string;
  };
  currency: string;
  total: number;
  yesterday: number;
}
