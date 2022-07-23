import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
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
import {Icon, Image, Input} from '@rneui/themed';
import gStyles from '../utils/gStyles';
import {Button} from '@rneui/base';
import {userContext} from '../utils/context';
import {$$userLogin} from '../utils/api';
import Header from '../shared-components/header';
import {addThousandSep} from '../utils/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// @ts-ignore
const Login = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const {user, setUser} = useContext(userContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if (user && 'loggedIn' in user && user.loggedIn) {
      navigation.navigate('Main');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submit = async () => {
    if (email.length < 4 || password.length < 4) {
      Alert.alert('Invalid Data', 'Please Enter Valid Values');
      return;
    }
    setLoading(true);
    await $$userLogin(email, password)
      .then(async response => {
        setUser({...response.data.user, loggedIn: true});
        setLoading(false);
        navigation.navigate('Main');
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify({...response.data.user, loggedIn: true}),
        );
      })
      .catch(reason => {
        setLoading(false);
        console.log(reason);
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        backgroundColor={'#F5F5F7'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          <Header />
          <View style={styles.welcome}>
            <Text style={styles.welcomeText}>Welcome to our Community</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.formContainer}>
              <Input
                keyboardType={'email-address'}
                autoFocus
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                label={'Email / Username'}
                labelStyle={styles.inputLabel}
              />
              <Input
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                label={'Password'}
                labelStyle={styles.inputLabel}
              />
              <Button
                onPress={submit}
                titleStyle={styles.submitButton}
                containerStyle={styles.submitButtonContainer}
                buttonStyle={styles.submitButtonSelf}
                loading={loading}
                radius={10}>
                Log in
              </Button>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Register');
                }}
                style={{marginTop: 10}}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Text style={styles.signup}>
                  Don’t have an account? &nbsp;
                  <Text style={styles.register}>Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  container: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  submitButton: {
    fontFamily: gStyles.fonts.poppins,
    fontSize: 15,
    color: '#D4E2F4',
  },
  submitButtonContainer: {
    width: '94%',
  },
  welcome: {
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: gStyles.fonts.mont,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 30,
  },
  input: {
    backgroundColor: '#E5ECF6',
    borderRadius: 3,
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontFamily: gStyles.fonts.mont,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginBottom: 5,
  },
  selfInputContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    borderRadius: 5,
    borderTopLeftRadius: 5,
  },
  inputItself: {},
  submitButtonSelf: {
    backgroundColor: '#043386',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d4e2f418',
    shadowColor: '#000000',
    shadowOffset: {
      width: 6,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
  },
  signup: {
    fontFamily: gStyles.fonts.mont,
    fontSize: 14,
    color: '#000',
    marginVertical: 10,
  },
  register: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Login;
