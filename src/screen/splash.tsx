import React, {useContext, useEffect} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {userContext} from '../utils/context';
import LottieView from 'lottie-react-native';
import {$$me} from '../utils/api';
import {User} from '../utils/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };
  const {user, setUser} = useContext(userContext);

  useEffect(() => {
    if (props.route.params?.logout) {
      props.navigation.replace('Login');
      setUser({...user, loggedIn: false});
      AsyncStorage.setItem('userData', JSON.stringify({...user}));
    }
  }, [props.route.params?.logout]);

  useEffect(() => {
    if (user && user.loggedIn) {
      const fetchData = async () => {
        await $$me(user.token)
          .then((response: any) => {
            if (response.data.user.username) {
              props.navigation.replace('Main');
            } else {
              props.navigation.replace('Login');
              setUser({...user, loggedIn: false});
            }
          })
          .catch(() => {
            props.navigation.replace('Login');
            setUser({...user, loggedIn: false});
          });
      };
      fetchData();
    } else {
      props.navigation.replace('Login');
    }
  }, [user]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        backgroundColor={'#F5F5F7'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <View style={styles.container}>
        <Image
          source={require('../../assets/logoType.png')}
          style={styles.logo}
          resizeMode={'contain'}
        />
        <LottieView
          source={require('../../assets/loading.json')}
          autoPlay
          loop
          style={styles.spinner}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
  },
  spinner: {
    width: 150,
    height: 150,
  },
});

export default Splash;
