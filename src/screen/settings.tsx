import React, {useContext, useEffect, useState} from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Icon} from '@rneui/base';
import Header from '../shared-components/header';
import gStyles from '../utils/gStyles';
import {userContext} from '../utils/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showHelp, setShowHelp] = useState(false);
  const {user, setUser} = useContext(userContext);

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header
          user
          left={
            <Icon
              name={'sort'}
              type={'MaterialIcons'}
              size={25}
              style={{marginTop: -3}}
            />
          }
        />
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              props.navigation.navigate('PaymentSettings');
            }}>
            <Text style={styles.buttonText}>Payment Settings</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Notification Settings</Text>
          </TouchableOpacity>*/}
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              setUser({...user, loggedIn: false});
              await AsyncStorage.removeItem('userData');
              props.navigation.replace('Login');
            }}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          {/*<TouchableOpacity
            style={styles.button}
            onPress={() => setShowHelp(!showHelp)}>
            <View style={styles.toggleBar}>
              <View style={{flex: 1}}></View>
              <Text style={[styles.buttonText, {flex: 1}]}>Help</Text>
              <View
                style={{
                  alignItems: 'flex-end',
                  flex: 1,
                  marginRight: 15,
                }}>
                <Icon
                  name={showHelp ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  type={'MaterialIcons'}
                  color={'#000'}
                  size={25}
                />
              </View>
            </View>
            <View>
              {showHelp && (
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    paddingRight: 15,
                  }}>
                  <TouchableOpacity style={{marginTop: 10}}>
                    <Text style={[styles.buttonText, {flex: 1}]}>FAQ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginTop: 10}}>
                    <Text style={[styles.buttonText, {flex: 1}]}>
                      How do i mine?
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>*/}
        </View>
        {/*<View style={styles.subContainer}>
          <TouchableOpacity style={styles.secondButton}>
            <Text style={styles.secondButtonText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondButton}>
            <Text style={styles.secondButtonText}>About Us</Text>
          </TouchableOpacity>
        </View>*/}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 90,
  },
  subContainer: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  button: {
    textAlign: 'center',
    backgroundColor: '#E5ECF6',
    paddingVertical: 10,
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 30,
    marginBottom: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: gStyles.fonts.openSans,
  },
  secondButton: {
    textAlign: 'center',
    backgroundColor: '#043386',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 30,
    width: 182,
  },
  secondButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: gStyles.fonts.openSans,
    color: '#fff',
    fontWeight: '600',
  },
  toggleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Settings;
