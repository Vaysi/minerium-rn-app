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

const AboutUs = (props: any) => {
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
          main={<Text style={styles.headerTitle}>About Us</Text>}
        />
        <View style={styles.container}>
          <Text style={styles.title}>Who We Are</Text>
          <Text style={styles.subtitle}>
            We began as an international high-tech IT security infrastructure
            and hospitality systems company in 2004. By the early 2010s, with
            technology in our DNA and an eye on the future, we recognized an
            emerging cryptocurrency known as Bitcoin. We quickly began mining
            Bitcoin and put the pieces in place to start up a mining pool in the
            United States. In 2016, we evolved with the revolutionary notion of
            pushing the mining pool industry ahead to safe, sustainable energy.
          </Text>
          <Text style={styles.subtitle}>
            <Text style={{...styles.subtitle, fontWeight: 'bold'}}>
              Today we are Minerium
            </Text>
            , a fast-growing, multi-currency crypto mining pool that is
            committed to making a green industry even greener. We’re continuing
            our mission to find reasonable and feasible green solutions — while
            providing truly decentralized mining services to customers
            worldwide.
          </Text>
          <Text style={styles.title}>
            Leading the Way in the Mining Pool Industry
          </Text>
          <Text style={styles.subtitle}>
            From the start, Minerium successfully invested in several sizable
            cryptocurrency ventures with one vision in mind: to lead the way in
            the mining pool industry. We saw a need early on for a formalized
            network of miners and have been on a mission ever since to create a
            better mining pool for the skyrocketing crypto economy. With
            support, trust, and encouragement as core values, the Minerium Pool
            continues to sustain each mining wave with the greatest success and
            profit for our mining customers. Our rich technological knowledge,
            including data science and deep learning algorithms, builds upon
            these core values and allows us to outperform and outcompete when
            and where it matters: bringing performance and profit for our
            customers.
            {'\n\n'}
            We consistently offer trusted, innovative, and easy-to-use
            solutions. The recent launch of our Chia Mining Pool and plotting
            service, that’s based on Proof of Space and Proof of Time, is one
            example of our commitment towards a more efficient and secure pool
            for our customers.
            {'\n\n'}
            We are a team of innovative, smart visionaries who are passionate
            about our work and believe our customers are our most valued
            partners. It’s together that we do our best work. It’s together that
            we bring value to our customers’ investments and that we can achieve
            our dream of becoming industry leader. We seek to grow long-lasting
            relationships through understanding expectations and offering
            solutions backed by sound experience and trusted expertise.
          </Text>
          <Text style={styles.title}>Are You Ready to Build with Us?</Text>
          <Text style={styles.subtitle}>
            At Minerium, we see opportunities for growth and improvement where
            others see obstacles. We always look at the brighter side of the
            coin. And we’re always looking for other optimists to join our
            highly profitable mining pool. Come build with us.
            {'\n\n'}
            <Text style={{...styles.subtitle, fontWeight: 'bold'}}>
              Minreium.com™
            </Text>{' '}
            is registered under USA law and a subsidiary organization of{' '}
            <Text style={{...styles.subtitle, fontWeight: 'bold'}}>
              TECHNOHEFAZ
            </Text>{' '}
            LLC, in Las Vegas Technology Center, 2500 N Buffalo Dr, Las Vegas,
            NV 89128.
          </Text>
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
    fontSize: 17,
    color: '#000',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  subtitle: {
    color: '#000',
    fontFamily: gStyles.fonts.openSans,
    fontSize: 14,
  },
});

export default AboutUs;
