import axios, {AxiosInstance, AxiosRequestConfig, Method} from 'axios';
import {ToastAndroid} from 'react-native';

const axiosConfig: AxiosRequestConfig = {
  baseURL: 'https://pool.minerium.com/api/',
};

const instance: AxiosInstance = axios.create(axiosConfig);

const {POST, GET, DELETE} = {POST: 'POST', GET: 'GET', DELETE: 'DELETE'};

instance.interceptors.response.use(
  response => response,
  error => {
    ToastAndroid.show(`${error.response.data.message} `, 2000);
    throw error;
  },
);

const routes = {
  users: {
    login: {
      route: 'users/login',
      method: POST,
    },
    me: {
      route: 'users/me',
      method: GET,
    },
    register: {
      route: 'users/register',
      method: POST,
    },
    verify: {
      method: POST,
      route: 'users/verify-email',
    },
    resend: {
      method: POST,
      route: 'users/request-token',
    },
    reset: {
      route: 'users/reset-password',
      method: POST,
    },
    notifications: {
      route: 'users/notifications',
      method: GET,
    },
    setNotifications: {
      route: 'users/notifications',
      method: POST,
    },
    me: {
      route: 'users/me',
      method: GET,
    },
    setMe: {
      route: 'users/me',
      method: POST,
    },
    twoFA: {
      route: 'users/request-2fa',
      method: POST,
    },
    active2Fa: {
      route: 'users/activate-2fa',
      method: POST,
    },
    disable2Fa: {
      route: 'users/deactivate-2fa',
      method: POST,
    },
    updatePassword: {
      route: 'users/update-password',
      method: POST,
    },
    resetPassword: {
      route: 'users/reset-password',
      method: POST,
    },
  },
  earnings: {
    balance: {
      route: 'earnings/balance',
      method: GET,
    },
    history: {
      route: 'earnings',
      method: GET,
    },
    paymentHistory: {
      route: 'earnings/payment-history',
      method: GET,
    },
    paymentPreference: {
      route: 'earnings/payment-preference',
      method: POST,
    },
    cap: {
      route: 'earnings/cap',
      method: GET,
    },
    setCap: {
      route: 'earnings/cap',
      method: POST,
    },
  },
  workers: {
    list: {
      route: 'workers',
      method: GET,
    },
    byGroup: {
      route: 'workers/groups/:groupId',
      method: GET,
    },
    groupList: {
      route: 'workers/groups',
      method: GET,
    },
    createGroup: {
      route: 'workers/groups',
      method: POST,
    },
  },
  watchers: {
    create: {
      route: 'watchers',
      method: POST,
    },
    list: {
      route: 'watchers',
      method: GET,
    },
    delete: {
      route: 'watchers/:watcherId',
      method: DELETE,
    },
  },
  pool: {
    allPps: {
      route: 'pool/all-pps',
      method: GET,
    },
    pps: {
      route: 'pool/pps-info',
      method: GET,
    },
  },
  minerstat: {
    coins: {
      route: 'https://api.minerstat.com/v2/coins?list=BTC,BCH,DGB&algo=SHA-256',
      method: GET,
    },
  },
};

const $$userLogin = (identifier: string, password: string) => {
  return instance
    .request({
      method: routes.users.login.method as Method,
      url: routes.users.login.route,
      data: {
        identifier,
        password,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$userRegister = (
  email: string,
  password: string,
  repeat_password: string,
  username: string,
) => {
  return instance
    .request({
      method: routes.users.register.method as Method,
      url: routes.users.register.route,
      data: {
        email,
        username,
        password,
        repeat_password,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$earningsBalance = (token: string) => {
  return instance
    .request({
      method: routes.earnings.balance.method as Method,
      url: routes.earnings.balance.route,
      headers: {Authorization: `Bearer ${token}`},
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$earningsHistory = () => {
  return instance
    .request({
      method: routes.earnings.history.method as Method,
      url: routes.earnings.history.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$paymentHistory = () => {
  return instance
    .request({
      method: routes.earnings.paymentHistory.method as Method,
      url: routes.earnings.paymentHistory.route,
      params: {
        coin: 'all',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$workersList = (
  groupId: Number | null | string = null,
  since: number = 1,
) => {
  let method =
    groupId != null
      ? routes.workers.byGroup.method
      : routes.workers.list.method;
  let route =
    groupId != null
      ? routes.workers.byGroup.route.replace(':groupId', String(groupId))
      : routes.workers.list.route;
  return instance
    .request({
      method: method as Method,
      url: route,
      params: {
        since,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$workersGroups = () => {
  return instance
    .request({
      method: routes.workers.groupList.method as Method,
      url: routes.workers.groupList.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$createWorkerGroup = (name: string, workers: Array<any>) => {
  return instance
    .request({
      method: routes.workers.createGroup.method as Method,
      url: routes.workers.createGroup.route,
      data: {
        name,
        workers,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$createWatcher = (name: string, workerGroupId: number | string) => {
  return instance
    .request({
      method: routes.watchers.create.method as Method,
      url: routes.watchers.create.route,
      data: {
        name,
        workerGroupId,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$getWatchers = () => {
  return instance
    .request({
      method: routes.watchers.list.method as Method,
      url: routes.watchers.list.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$deleteWatcher = (watcherId: any) => {
  return instance
    .request({
      method: routes.watchers.delete.method as Method,
      url: routes.watchers.delete.route.replace(':watcherId', watcherId),
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$getAllPPS = () => {
  return instance
    .request({
      method: routes.pool.allPps.method as Method,
      url: routes.pool.allPps.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$changePaymentPreference = (currency: string, method?: string) => {
  return instance
    .request({
      method: routes.earnings.paymentPreference.method as Method,
      url: routes.earnings.paymentPreference.route,
      data: {
        currency,
        method: method ?? undefined,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$getCap = () => {
  return instance
    .request({
      method: routes.earnings.cap.method as Method,
      url: routes.earnings.cap.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$setCap = (coin: string, priceCap: number, wallet: string) => {
  return instance
    .request({
      method: routes.earnings.setCap.method as Method,
      url: routes.earnings.setCap.route,
      params: {
        coin,
      },
      data: {
        coin,
        priceCap,
        wallet,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$getNotifications = () => {
  return instance
    .request({
      method: routes.users.notifications.method as Method,
      url: routes.users.notifications.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$getMe = () => {
  return instance
    .request({
      method: routes.users.me.method as Method,
      url: routes.users.me.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$setMe = (firstName: string, lastName: string) => {
  return instance
    .request({
      method: routes.users.setMe.method as Method,
      url: routes.users.setMe.route,
      data: {
        firstName,
        lastName,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$setNotifications = (
  activeWorkers: any,
  dailyReport: boolean,
  hashrate: any,
  totalHashrate: any,
) => {
  let data = {
    activeWorkers: parseInt(activeWorkers),
    dailyReport,
    hashrate: parseInt(hashrate),
    totalHashrate: parseInt(totalHashrate),
  };
  return instance
    .request({
      method: routes.users.setNotifications.method as Method,
      url: routes.users.setNotifications.route,
      data,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$get2FA = () => {
  return instance
    .request({
      method: routes.users.twoFA.method as Method,
      url: routes.users.twoFA.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$active2FA = (token: string) => {
  return instance
    .request({
      method: routes.users.active2Fa.method as Method,
      url: routes.users.active2Fa.route,
      data: {
        token,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$disable2FA = (token: string) => {
  return instance
    .request({
      method: routes.users.disable2Fa.method as Method,
      url: routes.users.disable2Fa.route,
      data: {
        token,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$updatePassword = (
  old_password: string,
  password: string,
  repeat_password: string,
) => {
  return instance
    .request({
      method: routes.users.updatePassword.method as Method,
      url: routes.users.updatePassword.route,
      data: {
        old_password,
        password,
        repeat_password,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$resetPassword = (email: string) => {
  return instance
    .request({
      method: routes.users.resetPassword.method as Method,
      url: routes.users.resetPassword.route,
      data: {
        email: email,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$getPps = (coin: string) => {
  return instance
    .request({
      method: routes.pool.pps.method as Method,
      url: routes.pool.pps.route,
      params: {
        coin: coin.toLowerCase(),
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$verifyEmail = (email: string, token: string) => {
  return instance
    .request({
      method: routes.users.verify.method as Method,
      url: routes.users.verify.route,
      data: {
        email,
        token,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$resendVerification = (email: string) => {
  return instance
    .request({
      method: routes.users.resend.method as Method,
      url: routes.users.resend.route,
      data: {
        email,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$getCoinsData = () => {
  return instance
    .request({
      method: routes.minerstat.coins.method as Method,
      url: routes.minerstat.coins.route,
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

const $$me = (token: string) => {
  return instance
    .request({
      method: routes.users.me.method as Method,
      url: routes.users.me.route,
      headers: {Authorization: `Bearer ${token}`},
    })
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
};

export {
  $$userLogin,
  $$userRegister,
  $$earningsBalance,
  $$earningsHistory,
  $$paymentHistory,
  $$workersList,
  $$workersGroups,
  $$createWorkerGroup,
  $$createWatcher,
  $$getAllPPS,
  $$changePaymentPreference,
  $$getCap,
  $$setCap,
  $$getNotifications,
  $$setNotifications,
  $$getWatchers,
  $$deleteWatcher,
  $$getMe,
  $$setMe,
  $$get2FA,
  $$active2FA,
  $$disable2FA,
  $$updatePassword,
  $$getPps,
  $$verifyEmail,
  $$resendVerification,
  $$resetPassword,
  $$getCoinsData,
  $$me,
};
