import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Header from '../shared-components/header';
import Statistics from '../shared-components/statistics';

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };

  // @ts-ignore
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
          <View>
            <Image
              source={require('../../assets/screens/home/main.png')}
              style={styles.cover}
              resizeMode={'contain'}
            />
          </View>
          {/*<View style={styles.container}>
            <View style={styles.buttons}>
              <RectIconButton
                text={'Calculator'}
                icon={
                  <Icon
                    color={'#fff'}
                    name={'calculate'}
                    type={'MaterialIcons'}
                    size={22}
                  />
                }
                onPress={async () => {
                  props.navigation.navigate('Calculator');
                }}
              />
              <RectIconButton
                text={'Logout'}
                onPress={async () => {
                  setUser({...user, loggedIn: false});
                  await AsyncStorage.removeItem('userData');
                  props.navigation.navigate('Login');
                }}
                icon={
                  <Icon
                    color={'#fff'}
                    name={'logout'}
                    type={'MaterialIcons'}
                    size={22}
                  />
                }
              />
            </View>
          </View>*/}
          {/*<CustomDivider />*/}
          <Statistics />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cover: {
    width: '100%',
    height: 190,
    flex: 1,
    borderColor: 'transparent',
    borderWidth: 1,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  wrapper: {flexDirection: 'row'},
});

export default Home;
