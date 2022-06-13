import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Icon, Image, Input} from '@rneui/themed';
import gStyles from '../utils/gStyles';
import {Button} from '@rneui/base';
import {userContext} from '../utils/context';
import {$$userLogin} from '../utils/api';

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

  const submit = () => {
    if (email.length < 4 || password.length < 4) {
      Alert.alert('Invalid Data', 'Please Enter Valid Values');
      return;
    }
    setLoading(true);
    $$userLogin(email, password)
      .then(response => {
        setUser({...response.data.user, loggedIn: true});
        setLoading(false);
        navigation.navigate('Main');
      })
      .catch(reason => {
        setLoading(false);
        console.log(reason);
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/512.png')}
              style={styles.logo}
              PlaceholderContent={<ActivityIndicator />}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.formContainer}>
              <Input
                placeholder={'Email'}
                leftIcon={
                  <Icon
                    name="alternate-email"
                    type={'MaterialIcons'}
                    size={18}
                  />
                }
                keyboardType={'email-address'}
                autoFocus
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <Input
                placeholder={'Password'}
                secureTextEntry
                leftIcon={<Icon name="lock" type={'MaterialIcons'} size={18} />}
                value={password}
                onChangeText={text => setPassword(text)}
              />
              <Button
                disabled={loading}
                onPress={submit}
                titleStyle={styles.submitButton}
                containerStyle={styles.submitButtonContainer}
                radius={10}>
                Login
              </Button>
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
  title: {
    fontFamily: gStyles.title.boldFont,
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-start',
    fontSize: 30,
    marginTop: 20,
    color: gStyles.title.color,
    marginLeft: 10,
  },
  submitButton: {
    fontFamily: gStyles.button.font,
    fontSize: 20,
  },
  submitButtonContainer: {
    width: '94%',
  },
});

export default Login;
