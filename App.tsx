import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screen/login';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {userContext} from './src/utils/context';
import Home from './src/screen/home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import gStyles from './src/utils/gStyles';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from './src/screen/dashboard';
import {Icon} from '@rneui/base';
import {StyleSheet} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (user && 'loggedIn' in user && user.loggedIn) {
        let cachedUser = await AsyncStorage.getItem('userData');
        if (!cachedUser) {
          await AsyncStorage.setItem('userData', JSON.stringify(user));
        }
      }
      return () => {
        console.log('This will be logged on unmount');
      };
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      let cachedUser = await AsyncStorage.getItem('userData');
      if (cachedUser) {
        cachedUser = JSON.parse(cachedUser);
        setUser(cachedUser);
      }
    })();
  }, []);

  return (
    <userContext.Provider value={{user, setUser}}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: '#043180',
                height: 60,
              },
              tabBarItemStyle: {},
              tabBarLabelStyle: styles.tabsLabel,
              headerShown: false,
              tabBarIconStyle: {marginTop: 5},
            }}
            initialRouteName={'Login'}>
            <Tab.Screen
              name={'Login'}
              options={{
                tabBarLabel: '',
                title: '',
                tabBarButton: () => null,
              }}
              component={Login}
            />
            <Tab.Screen
              options={{
                title: 'Minerium',
                tabBarIcon: ({color, size}) => (
                  <Icon
                    name={'home-filled'}
                    type={'MaterialIcons'}
                    size={30}
                    style={styles.tabsIcon}
                    color={'#E5ECF6'}
                  />
                ),
              }}
              name={'Home'}
              component={Home}
            />
            <Tab.Screen
              options={{
                title: 'Dashboard',
                tabBarIcon: ({color, size}) => (
                  <Icon
                    name={'insert-chart'}
                    type={'MaterialIcons'}
                    size={30}
                    style={styles.tabsIcon}
                    color={'#E5ECF6'}
                  />
                ),
              }}
              name={'Dashboard'}
              component={Dashboard}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </userContext.Provider>
  );
};

const styles = StyleSheet.create({
  tabsIcon: {},
  tabsLabel: {
    color: '#E5ECF6',
    fontFamily: gStyles.body.font,
    fontSize: 12,
    marginBottom: 5,
  },
});

export default App;
