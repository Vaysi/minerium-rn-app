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

const Faq = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };

  const [basics, setBasics] = useState([
    {
      title: 'What is SOLO Mining?',
      display: false,
      description:
        'Solo mining is when a miner performs the mining operations alone without joining a pool. All mined blocks are generated to the miner’s credit',
    },
    {
      title: 'What is Pooled Mining?',
      display: false,
      description:
        'Smart mining means that we can switch the hash rate to other currencies of the same algorithm at our mining pools without changing the configuration of the miner.\n' +
        '\n' +
        'For example: If we found BCH’s earnings are relatively high these days when we are mining BTC, the automated intelligent system changes currency mining accordingly. Under these circumstances, you don’t have to modify the mining address and miners of each miner, you just need to choose smart mining from the top menu.',
    },
    {
      title: 'What should I choose? solo, pooled...',
      display: false,
      description:
        'The answer would be: Always go shared!\n' +
        '\n' +
        'Go SOLO only if you know what it implies, have a very substantial amount of hashpower, and you understand that you may have to wait a long time without rewards.',
    },
    {
      title: 'What are PPS, PPLNS, PPS+, FPPS, SOLO?',
      display: false,
      description:
        'Before understanding these settlements, users first need to understand the profit components of the cryptocurrency. Mining profit generally consists of two parts, including the block reward for the block (current bitcoin block reward is 6.25 bitcoin) and mining fee/transaction fee. After understanding the profit components, you can understand these settlements more accurately.',
    },
    {
      title: 'What is PPS (Pay Per Share)?',
      display: false,
      description:
        'Simply, PPS is a mode of payment. The miners sell the hashrate to the mining pool to obtain fixed income. The mining pool is responsible for its profits and losses. Because the mining pool bears certain risks, the mining pool fee is relatively higher in the PPS mode.\n' +
        '\n' +
        'Share refers to the task answer submitted by the miners to the mining pool. Profit is calculated according to the number of shares submitted by the miners in the PPS mode.\n' +
        '\n' +
        'For example, the miner’s hashrate is 1T, hashrate in the whole mining pool is 100T, the total network’s hashrate is 1000T. It is generally clear that 1 block out every 10 minutes in the Bitcoin network, and the block out reward is 6.25 BTC. The hashrate of the mining pool accounts for onetenth of the total network’s hashrate. The expected profit of the mining pool is 1.25 BTC, and the hashrate of the miners accounts for one percent of the hashrate of the mining pool. No matter whether the block out or not in the mining pool, the profit of the miners is one percent of 1.25 BTC according to the theoretical profit.',
    },
    {
      title: 'What is PPLNS (Pay Per Last N Share)?',
      display: false,
      description:
        'The profits will be allocated based on the number of shares miners contribute. This kind of allocation method is closely related to the block mined out. If the mining pool excavates multiple blocks in a day, the miners will have a high profit; if the mining pool is not able to mine a block during the whole day, the miner’s profit during the whole day is zero.\n' +
        '\n' +
        'In the short term, the PPLNS mode has a great relationship with the pool’s luck. It should be noted that miners joining a new PPLNS mining pool will find that the profits in the first few hours are relatively low. This is because other miners have contributed a lot of shares in this mining pool.\n' +
        '\n' +
        'The contribution of newly added miners is still very small, so the benefits of new miners are relatively low when paying dividends. This is because PPLNS has certain lag inertia and periodicity. And the mining profits of the newly added miners will have a certain delay.',
    },
    {
      title: 'What is PPS+ (Pay Per Share + Pay Per Last N Share)?',
      display: false,
      description:
        'PPS+ is a combination of two modes above, PPS and PPLNS, that is, the block reward is settled according to the PPS mode. And the mining service charge /transaction fee is settled according to the PPLNS mode. That is to say, in this mode, the miner can additionally obtain the income of part of the transaction fee based on the PPLNS payment method.',
    },
    {
      title: 'What is FPPS (Full Pay Per Share)?',
      display: false,
      description:
        'In this mode, both the block out reward and the mining service charge are settled according to the theoretical profit',
    },
    {
      title: 'What is SOLO?',
      display: false,
      description:
        'Solo means mining independently. If the block is mined out, the miner will receive all the block rewards (after deducting the mining fee for the mining pool). If there have been no blocks, there will always be no gains.',
    },
  ]);

  const [pools, setPool] = useState([
    {
      title: 'What are the mining fee and Tx fee?',
      display: false,
      description:
        'When users mine on the Minerium pool, they should pay the mining fee to the Minerium pool. When users send a transaction to others via bitcoin, they should pay a transaction fee to other workers',
    },
    {
      title: 'How often are the payouts?',
      display: false,
      description:
        'Payouts are made automatically every 2 hours for balances above 0.1. For balances below 0.1 payouts are made on Sunday 19:00 UTC. The process is automatic and can’t be controlled',
    },
    {
      title: 'What is the the Minerium pool fee?',
      display: false,
      description:
        'The Minerium Standard Pool fee is 1%. If you mine in solo or Smart mode fee is 4%',
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
          main={<Text style={styles.headerTitle}>FAQ</Text>}
        />
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Basics</Text>
        </View>
        <View style={{marginTop: 15}}>
          {basics.map((item, index) => (
            <ListItem
              onPress={() => {
                setBasics(
                  [...basics].map((subItem, subIndex) => {
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
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Minerium Pools</Text>
        </View>
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

export default Faq;
