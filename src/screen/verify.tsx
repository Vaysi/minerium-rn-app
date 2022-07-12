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
import {$$resendVerification, $$userLogin, $$verifyEmail} from '../utils/api';
import Header from '../shared-components/header';
import {addThousandSep, msToHMS} from '../utils/functions';
import useCountDown from 'react-countdown-hook';

// @ts-ignore
const Verify = ({route, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const {email: userEmail} = route.params;
  const {user, setUser} = useContext(userContext);
  const [email, setEmail] = useState<string>((userEmail as string) || '');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, {start, pause, resume, reset}] = useCountDown(565000, 1000);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    start();
    setEmail((userEmail as string) || '');
  }, [userEmail]);

  const restart = React.useCallback(() => {
    resend();
    start();
  }, []);

  const resend = () => {
    setLoading(true);
    $$resendVerification(email).then(() => {
      Alert.alert(
        "We sent you a new verification token. Please check your email and if it's not there, please check the spam folder",
      );
      restart();
      setLoading(false);
    });
  };

  const verify = () => {
    setLoading(true);
    $$verifyEmail(email, token).then(res => {
      Alert.alert('Congratulation', "You're Account Successfully Verified");
      setUser({...res.data, loggedIn: true});
      navigation.navigate('Main');
      setLoading(false);
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
                label={'Email'}
                labelStyle={styles.inputLabel}
              />
              <Input
                value={token}
                onChangeText={text => setToken(text)}
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                label={'Token'}
                labelStyle={styles.inputLabel}
              />
              <View style={styles.buttonContainer}>
                <Button
                  onPress={verify}
                  titleStyle={styles.submitButton}
                  containerStyle={styles.submitButtonContainer}
                  buttonStyle={styles.submitButtonSelf}
                  loading={loading}
                  disabled={token.length < 2}
                  radius={10}>
                  Validate
                </Button>
                <Button
                  onPress={restart}
                  titleStyle={styles.submitButton}
                  containerStyle={styles.submitButtonContainer}
                  buttonStyle={styles.submitButtonSelf}
                  loading={loading}
                  iconPosition={'left'}
                  disabled={timeLeft > 0}
                  radius={10}>
                  {msToHMS(timeLeft)} Resend Email
                </Button>
              </View>

              <Text style={styles.signup}>
                We automatically send a verification email to the email address
                you used to sign up for your account, but you can resend the
                verification email if you didn't receive it.
              </Text>
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
    marginHorizontal: 10,
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
    textAlign: 'justify',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Verify;
