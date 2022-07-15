import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Card} from '@rneui/themed';
import gStyles from '../utils/gStyles';
import {Icon, Skeleton, Text} from '@rneui/base';
import Header from '../shared-components/header';
import {userContext} from '../utils/context';
import CustomDivider from '../shared-components/divider';
import {addThousandSep, hashToE, hasJsonStructure} from '../utils/functions';
import {$$getCoinsData} from '../utils/api';
import useWebSocket from 'react-native-use-websocket';
import {MinerStats_Coins} from '../utils/interfaces';
import CoinsSelect from '../shared-components/coinsSelect';

const Dashboard = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };

  const {user} = useContext(userContext);
  const [dashboardData, setDashboardData] = useState({
    graphDay: [],
    graphHour: [],
    info: {
      hash1d: 0,
      hash1m: 0,
      hash5m: 0,
      offline_workers: 0,
      workers: 0,
    },
    userEarning: [],
  });

  const getSocketUrl = useCallback(() => {
    return new Promise(resolve => {
      resolve('wss://pool.minerium.com/ws/ws');
    });
  }, []);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
    getWebSocket,
    // @ts-ignore
  } = useWebSocket(getSocketUrl);

  const [messageHistory, setMessageHistory] = useState([]);
  const [socketFiler, setSocketFilter] = useState<'day' | 'hour'>('day');
  const [selectedCoin, setSelectedCoin] = useState('btc');

  useEffect(() => {
    if (lastMessage !== null) {
      // @ts-ignore
      setMessageHistory(prev => prev.concat(lastMessage));
      if (hasJsonStructure(lastMessage.data)) {
        let data = JSON.parse(lastMessage.data);
        if (
          'type' in data &&
          data.type.includes('dashboard') &&
          'data' in data
        ) {
          setDashboardData(data.data);
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    sendJsonMessage({
      type: 'authenticate',
      data: user?.token,
    });
  }, [user]);

  useEffect(() => {
    sendJsonMessage({type: 'subscribe', data: 'dashboard_' + socketFiler});
    sendJsonMessage({
      type: 'unsubscribe',
      data: 'dashboard_' + (socketFiler == 'day' ? 'hour' : 'day'),
    });
  }, [socketFiler]);

  const [coinsInfo, setCoinsInfo] = useState<Array<MinerStats_Coins>>([]);

  useEffect(() => {
    $$getCoinsData().then((response: Array<object>) => {
      //@ts-ignore
      setCoinsInfo([...response.filter(item => item.algorithm === 'SHA-256')]);
    });
  }, []);

  const getSelectedCoinInfo = () => {
    let coin = coinsInfo.filter(
      item => item.coin == selectedCoin.toUpperCase(),
    );
    if (coin.length) {
      return coin[0];
    }
    return null;
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
            right={<CoinsSelect selection={{selectedCoin, setSelectedCoin}} />}
          />
          <View style={styles.container}>
            {messageHistory.length > 1 && (
              <>
                <View style={styles.cardsContainer}>
                  <Card containerStyle={styles.card}>
                    <Card.Title style={styles.cardTitle}>Hashrate</Card.Title>
                    <View style={styles.cardContent}>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.cardContentTitle}>Real-Time:</Text>
                        <Text style={styles.cardContentTitle}>Avg 24H:</Text>
                      </View>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.cardContentBody}>
                          {dashboardData.info.hash5m.toFixed(2)}{' '}
                          <Text style={styles.unit}>TH/s</Text>
                        </Text>
                        <Text style={styles.cardContentBody}>
                          {dashboardData.info.hash1d.toFixed(2)}{' '}
                          <Text style={styles.unit}>TH/s</Text>
                        </Text>
                      </View>
                    </View>
                  </Card>
                  <Card containerStyle={styles.card}>
                    <Card.Title style={styles.cardTitle}>Earning</Card.Title>
                    <View style={styles.cardContent}>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.cardContentTitle}>Total</Text>
                        <Text style={styles.cardContentTitle}>24H</Text>
                      </View>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.cardContentBody}>
                          {
                            //@ts-ignore
                            dashboardData.userEarning[selectedCoin] &&
                            'balance' in dashboardData.userEarning[selectedCoin]
                              ? parseFloat(
                                  dashboardData.userEarning[selectedCoin]
                                    .balance,
                                ).toFixed(8)
                              : 0.0
                          }
                          <Text style={styles.unit}>
                            {' '}
                            {selectedCoin.toUpperCase()}
                          </Text>
                        </Text>
                        <Text style={styles.cardContentBody}>
                          {
                            //@ts-ignore
                            dashboardData.userEarning[selectedCoin] &&
                            'yesterday' in
                              dashboardData.userEarning[selectedCoin]
                              ? parseFloat(
                                  dashboardData.userEarning[selectedCoin]
                                    .yesterday,
                                ).toFixed(8)
                              : 0.0
                          }{' '}
                          <Text style={styles.unit}>
                            {selectedCoin.toUpperCase()}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </Card>
                </View>
                <View style={styles.cardsContainer}>
                  <Card containerStyle={styles.card}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.cardContentTitle}>All</Text>
                        <Text style={styles.cardContentBody}>
                          {dashboardData.info.workers}
                        </Text>
                      </View>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.cardContentTitle}>Active</Text>
                        <Text style={styles.cardContentBody}>
                          {dashboardData.info.workers -
                            dashboardData.info.offline_workers}
                        </Text>
                      </View>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.cardContentTitle}>Offline</Text>
                        <Text style={styles.cardContentBody}>
                          {dashboardData.info.offline_workers}
                        </Text>
                      </View>
                    </View>
                  </Card>
                  <Card containerStyle={styles.card}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.cardContentTitle}>Balance</Text>
                        <Text style={styles.cardContentBody}>
                          {
                            //@ts-ignore
                            dashboardData.userEarning[selectedCoin] &&
                            'balance' in dashboardData.userEarning[selectedCoin]
                              ? parseFloat(
                                  dashboardData.userEarning[selectedCoin]
                                    .balance,
                                ).toFixed(8)
                              : 0.0
                          }{' '}
                          <Text style={styles.unit}>
                            {selectedCoin.toUpperCase()}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </Card>
                </View>
              </>
            )}
            <Skeleton
              animation="pulse"
              width={
                messageHistory.length < 2 ? Dimensions.get('window').width : 0
              }
              height={messageHistory.length < 2 ? 200 : 0}
            />
            <CustomDivider />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Network Info</Text>
            </View>
            {coinsInfo.length > 0 && (
              <>
                <View style={styles.cardsContainer}>
                  <Card containerStyle={styles.card}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.customCardTitle}>Net Hashrate</Text>
                        <Text style={styles.customCardSubtitle}>
                          {getSelectedCoinInfo()
                            ? hashToE(
                                getSelectedCoinInfo().network_hashrate,
                              ).toFixed(4)
                            : 0}
                          <Text style={styles.unit}> EH/s</Text>
                        </Text>
                      </View>
                    </View>
                  </Card>
                  <Card containerStyle={styles.card}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}>
                        <Text style={styles.customCardTitle}>
                          Daily Revenue Per T
                        </Text>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            flexWrap: 'wrap',
                          }}>
                          <Text style={styles.customCardSubtitle}>
                            {getSelectedCoinInfo()
                              ? (
                                  getSelectedCoinInfo()?.reward *
                                  1000000000000 *
                                  24
                                ).toFixed(7)
                              : 0}{' '}
                            <Text style={styles.unit}>
                              {selectedCoin.toUpperCase()}
                            </Text>
                          </Text>
                          <Text style={styles.customCardSubtitle}>
                            $
                            {getSelectedCoinInfo()
                              ? (
                                  getSelectedCoinInfo()?.reward *
                                  1000000000000 *
                                  24 *
                                  getSelectedCoinInfo()?.price
                                ).toFixed(3)
                              : 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                </View>
                <View style={styles.cardsContainer}>
                  <Card containerStyle={styles.card}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.customCardTitle}>Difficulty</Text>
                        <Text style={styles.customCardSubtitle}>
                          {getSelectedCoinInfo()
                            ? addThousandSep(getSelectedCoinInfo()?.difficulty)
                            : 0}
                        </Text>
                      </View>
                    </View>
                  </Card>
                  <Card containerStyle={styles.card}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}>
                        <Text style={styles.customCardTitle}>Coin Price</Text>
                        <Text style={styles.customCardSubtitle}>
                          $
                          {getSelectedCoinInfo()
                            ? addThousandSep(
                                getSelectedCoinInfo()?.price.toFixed(2),
                              )
                            : 0}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </View>
                <View style={styles.cardsContainer}>
                  <Card containerStyle={styles.card}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View style={styles.dataWrapper}>
                        <Text style={styles.customCardTitle}>Volume</Text>
                        <Text style={styles.customCardSubtitle}>
                          $
                          {getSelectedCoinInfo()
                            ? addThousandSep(
                                getSelectedCoinInfo()?.volume.toFixed(2),
                              )
                            : 0}
                        </Text>
                      </View>
                    </View>
                  </Card>
                  <Card containerStyle={styles.card}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.customCardTitle}>Block Reward</Text>
                        <Text style={styles.customCardSubtitle}>
                          {getSelectedCoinInfo()
                            ? getSelectedCoinInfo()?.reward_block
                            : 0}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </View>
              </>
            )}
            <Skeleton
              animation="pulse"
              width={coinsInfo.length == 0 ? Dimensions.get('window').width : 0}
              height={coinsInfo.length == 0 ? 210 : 0}
            />
            <View style={[styles.titleContainer, {marginTop: 15}]}>
              <Text style={styles.title}>Pool Info</Text>
            </View>
            <View style={[styles.cardsContainer, {paddingHorizontal: 13}]}>
              <Card containerStyle={[styles.card, {width: '100%'}]}>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.customCardTitle, {fontSize: 12}]}>
                    Fee PPS+:
                  </Text>
                  <Text style={styles.customCardSubtitle}>2 %</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text style={[styles.customCardTitle, {fontSize: 12}]}>
                    Minimum Payout:
                  </Text>
                  <Text style={styles.customCardSubtitle}>0.005 BTC</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text style={[styles.customCardTitle, {fontSize: 12}]}>
                    Payment Time:
                  </Text>
                  <Text style={styles.customCardSubtitle}>00:00-01:00 UTC</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text style={[styles.customCardTitle, {fontSize: 12}]}>
                    Miner Config:
                  </Text>
                  <Text style={styles.customCardSubtitle}>
                    {user?.username}.001, {user?.username}.002
                  </Text>
                </View>
              </Card>
            </View>
            <View
              style={[
                styles.titleContainer,
                {marginTop: 15, marginBottom: 10},
              ]}>
              <Text style={styles.title}>Mining Addresses</Text>
            </View>
            <View>
              <View style={styles.miningAddressContainer}>
                <Text style={styles.miningAddress}>
                  stratum+tcp://stratum.minerium.com:3333
                </Text>
                <Icon
                  name={'content-copy'}
                  type={'MaterialIcons'}
                  color={'#CEA716'}
                  size={25}
                  onPress={() => {
                    ToastAndroid.show('Copied Successfully', 2000);
                  }}
                />
              </View>
              <View
                style={[
                  styles.miningAddressContainer,
                  {backgroundColor: 'transparent'},
                ]}>
                <Text style={styles.miningAddress}>
                  stratum+tcp://stratum.minerium.com:4444
                </Text>
                <Icon
                  name={'content-copy'}
                  type={'MaterialIcons'}
                  color={'#CEA716'}
                  size={25}
                  onPress={() => {
                    ToastAndroid.show('Copied Successfully', 2000);
                  }}
                />
              </View>

              <View style={styles.miningAddressContainer}>
                <Text style={styles.miningAddress}>
                  stratum+tcp://stratum.minerium.com:44443
                </Text>
                <Icon
                  name={'content-copy'}
                  type={'MaterialIcons'}
                  color={'#CEA716'}
                  size={25}
                  onPress={() => {
                    ToastAndroid.show('Copied Successfully', 2000);
                  }}
                />
              </View>
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
  container: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  card: {
    borderRadius: 5,
    backgroundColor: gStyles.colors.blue,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 50,
    width: (Dimensions.get('window').width - 20) / 2,
  },
  cardTitle: {
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    color: '#000',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardContentTitle: {
    color: '#00000087',
    fontFamily: gStyles.title.font,
    fontSize: 11,
    marginRight: 5,
    textAlign: 'center',
  },
  cardContentBody: {
    color: '#000',
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
    marginRight: 5,
  },
  dataWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  unit: {
    fontSize: 10,
    color: '#000',
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
  },
  title: {
    color: '#000',
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
    fontSize: 20,
  },
  titleContainer: {
    paddingLeft: 15,
  },
  customCardTitle: {
    color: '#00000087',
    fontFamily: gStyles.title.font,
    fontWeight: '400',
    fontSize: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  customCardSubtitle: {
    color: '#000',
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    marginRight: 10,
  },
  miningAddressContainer: {
    backgroundColor: '#E5ECF6',
    display: 'flex',
    height: 46,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  miningAddress: {
    color: '#043386',
    fontSize: 13,
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
  },
});

export default Dashboard;
