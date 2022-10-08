import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Icon} from '@rneui/base';
import Header from '../../shared-components/header';
import gStyles from '../../utils/gStyles';
import {ListItem} from '@rneui/themed';

const HowDoIMine = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };

  const [pools, setPool] = useState([
    {
      title: '1. Create an Account',
      display: false,
      description: `Sign up or sign in to your Minerium mining pool account.`,
    },
    {
      title: '2. Start the Miner',
      display: false,
      description:
        'Power your miners and then connect the Ethernet cable to your miner(s) and the' +
        'other head to your Router or the switch device' +
        'You can turn on your units or switch on your Power Supply Units (PSU).',
    },
    {
      title: '3. Get Miner’s IP Address',
      display: false,
      description:
        'Connect a device to a computer, mobile phone, or machine to find your IP address' +
        'and then log o nto your Admin Dash. You also can find the required information on' +
        'your Router box or tagged labels on the equipment. Now you can see your Miner' +
        'unit(s) IP address on your Admin Dashboard.' +
        '(FYI: You can use IP scanning tools to find your Miner’s IP address)',
    },
    {
      title: '4. Configure the Miner',
      display: false,
      description:
        'Click on a web browser and enter the Miner’s IP address, there you will see a' +
        'dialogue box that requires you to fill it up with the necessary information.' +
        'Then enter the Minerium Mining Pool settings, as you can see in Figure .1,' +
        'which you can see below:',
    },
    {
      title: '5. Monitor Revenue and Miner',
      display: false,
      description:
        'Congratulations, now you can monitor your Miners and revenue.' +
        'Once you have signed in to [the Minerium website or app] , you can monitor your mining' +
        'stats in your admin dashboard.',
    },
  ]);

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header
          left={
            <Icon
              name={'arrow-back'}
              type={'MaterialIcons'}
              size={25}
              style={{marginTop: -3}}
              onPress={() => {
                props.navigation.navigate('Settings');
              }}
            />
          }
          alignCenter
          main={<Text style={styles.headerTitle}>How Do I Mine ?</Text>}
        />
        <View style={{marginTop: 15}}>
          {pools.map((item, index) => (
            <ListItem
              onPress={() => {
                setPool(
                  [...pools].map((subItem, subIndex) => {
                    if (index == subIndex) {
                      subItem.display = !subItem.display;
                    }
                    return subItem;
                  }),
                );
              }}
              containerStyle={index % 2 === 0 ? styles.even : styles.odd}>
              <Icon name={item.display ? 'minimize' : 'add'} />
              <ListItem.Content>
                <ListItem.Title style={styles.title}>
                  {item.title}
                </ListItem.Title>
                {item.display ? (
                  <View style={styles.subtitleView}>
                    <Text style={styles.ratingText}>{item.description}</Text>
                  </View>
                ) : null}
              </ListItem.Content>
            </ListItem>
          ))}
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
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontFamily: gStyles.fonts.mont,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  subtitleView: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  ratingText: {
    color: '#000',
    fontFamily: gStyles.fonts.mont,
    fontSize: 14,
  },
  even: {
    backgroundColor: '#E5ECF6',
  },
  odd: {
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: gStyles.fonts.mont,
    fontSize: 14,
    color: '#000',
  },
});

export default HowDoIMine;
