import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Linking,
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
import {Input} from '@rneui/themed';
import gStyles from '../utils/gStyles';
import {Button} from '@rneui/base';
import {userContext} from '../utils/context';
import {$$userRegister} from '../utils/api';
import Header from '../shared-components/header';
import {hasLower, hasUpper} from '../utils/functions';

// @ts-ignore
const Register = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const {user, setUser} = useContext(userContext);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [passRules, setPassRules] = useState({
    min: false,
    lowerCase: false,
    upperCase: false,
    numbers: false,
  });

  useEffect(() => {
    let newRules = {...passRules};
    if (/\d/.test(password)) {
      newRules.numbers = true;
    } else {
      newRules.numbers = false;
    }
    if (hasUpper(password)) {
      newRules.upperCase = true;
    } else {
      newRules.upperCase = false;
    }
    if (hasLower(password)) {
      newRules.lowerCase = true;
    } else {
      newRules.lowerCase = false;
    }
    if (password.length > 7) {
      newRules.min = true;
    } else {
      newRules.min = false;
    }
    setPassRules(newRules);
  }, [password]);

  const ready = () => {
    return (
      email.length > 4 &&
      username.length > 4 &&
      password === confirmPassword &&
      passRules.upperCase &&
      passRules.min &&
      passRules.numbers &&
      passRules.lowerCase
    );
  };

  const onSubmit = () => {
    if (!ready()) {
      Alert.alert('Error', 'Please Enter Valid Values');
      return;
    }
    setLoading(true);
    $$userRegister(email, password, confirmPassword, username)
      .then(response => {
        let params = {
          email: email,
        };
        setTimeout(() => {
          navigation.navigate('Verify', params);
        }, 1000);
        setUser({...user, email, username});
        setLoading(false);
      })
      .catch(reason => {
        if ('message' in reason) {
          Alert.alert('Error', reason.message);
          console.log(reason);
          if (reason.data.error === 'TRY_LOGIN') {
            setTimeout(() => {
              navigation.navigate('Login');
            }, 2000);
          }

          if (reason.data.error === 'NOT_VERIFIED') {
            let params = {
              email: email,
            };
            setTimeout(() => {
              navigation.navigate('Verify', params);
            }, 1000);
          }
        }
        setLoading(false);
      });
  };

  const openTerms = async () => {
    const url = 'https://minerium.com/terms-of-services/';
    await Linking.canOpenURL(url);
    await Linking.openURL(url);
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
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                label={'Email'}
                labelStyle={styles.inputLabel}
              />
              <Input
                value={username}
                onChangeText={text => setUsername(text)}
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                label={'Username'}
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
              {password.length > 1 &&
              (passRules.min ||
                passRules.numbers ||
                passRules.lowerCase ||
                passRules.upperCase) ? (
                <View style={styles.passRulesContainer}>
                  <Text
                    style={[
                      styles.passRules,
                      passRules.min ? styles.check : styles.unCheck,
                    ]}>
                    More than 8 characters
                  </Text>
                  <Text
                    style={[
                      styles.passRules,
                      passRules.lowerCase ? styles.check : styles.unCheck,
                    ]}>
                    Has Lowercase characters (a-z)
                  </Text>
                  <Text
                    style={[
                      styles.passRules,
                      passRules.upperCase ? styles.check : styles.unCheck,
                    ]}>
                    Has Uppercase characters (A-Z)
                  </Text>
                  <Text
                    style={[
                      styles.passRules,
                      passRules.numbers ? styles.check : styles.unCheck,
                    ]}>
                    Has numbers (0-9)
                  </Text>
                </View>
              ) : null}
              <Input
                secureTextEntry
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                label={'Confirm Password'}
                labelStyle={styles.inputLabel}
              />
              <TouchableOpacity
                onPress={openTerms}
                style={{
                  width: '100%',
                }}
                hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
                <Text style={styles.agreement}>
                  By signing up, I accept the Minerium{' '}
                  <Text style={styles.agreementText}>
                    Terms And Conditions.
                  </Text>
                </Text>
              </TouchableOpacity>
              <Button
                onPress={onSubmit}
                titleStyle={styles.submitButton}
                containerStyle={styles.submitButtonContainer}
                buttonStyle={styles.submitButtonSelf}
                loading={loading}
                radius={10}>
                Sign Up
              </Button>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}
                hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
                <Text style={styles.signup}>
                  Already have an account? &nbsp;
                  <Text style={styles.register}>Login</Text>
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
  agreement: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily: gStyles.fonts.mont,
    fontSize: 12,
    fontWeight: '400',
  },
  agreementText: {
    color: '#043386',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationColor: '#043386',
  },
  passRules: {},
  passRulesContainer: {
    backgroundColor: '#E5ECF6',
    width: '93%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
    marginBottom: 15,
    marginTop: -20,
  },
  check: {
    color: '#0D621F',
  },
  unCheck: {
    color: '#C30303',
  },
});

export default Register;
