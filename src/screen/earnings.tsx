import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Linking,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Button, FAB, Icon, Skeleton} from '@rneui/base';
import Header from '../shared-components/header';
import gStyles from '../utils/gStyles';
import Statistics from '../shared-components/statistics';
import CoinsSelect from '../shared-components/coinsSelect';
import {Card, Tab} from '@rneui/themed';
import {
  $$earningsBalance,
  $$earningsHistory,
  $$paymentHistory,
} from '../utils/api';
import {EarningBalance} from '../utils/interfaces';
import {userContext} from '../utils/context';
import {addThousandSep, sumUp} from '../utils/functions';
import {Row, Table} from 'react-native-table-component';
import moment from 'moment/moment';

const textCell = (title: string, subtitle?: string | null, append?: string) => (
  <View
    style={{
      display: 'flex',
      marginLeft: 5,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <Text
      style={{
        color: '#000',
        fontSize: 15,
        fontWeight: '400',
        fontFamily: gStyles.body.font,
        textAlign: 'center',
      }}>
      {title}
    </Text>
    {append && (
      <Text style={{fontSize: 11, fontWeight: 'bold', marginLeft: 5}}>
        {append}
      </Text>
    )}
    {subtitle && (
      <Text
        style={{
          color: '#000',
          fontSize: 10,
          fontWeight: '300',
          fontFamily: gStyles.body.font,
        }}>
        {subtitle}
      </Text>
    )}
  </View>
);

const Earnings = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };
  const {user} = useContext(userContext);

  const [selectedCoin, setSelectedCoin] = useState('btc');

  const [balances, setBalances] = useState<Array<EarningBalance>>([]);
  const [earningHistory, setEarningHistory] = useState<Array<any>>([]);
  const [paymentHistory, setPaymentHistory] = useState<Array<any>>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    $$earningsHistory(user?.token).then(response =>
      setEarningHistory(response.data),
    );
    $$paymentHistory(user?.token).then(response =>
      setPaymentHistory(response.data),
    );
  }, []);

  const [selectedCoinData, setSelectedCoinData] = useState(null);
  useEffect(() => {
    $$earningsBalance(user?.token).then(response => {
      setBalances(response.data);
    });
  }, []);

  const getSelectedCoinInfo = () => {
    let selected = balances.filter(item => item.currency == selectedCoin);
    if (selected.length) {
      return selected[0];
    } else {
      return {
        balance: {
          minimum: 0,
          paid: 0,
          price: 0,
          wallet: '',
        },
        currency: 'btc',
        total: 0,
        yesterday: 0,
      };
    }
  };

  const getSelectedCoinsExtraData = () => {
    // @ts-ignore
    let selected = selectedCoinData.filter(
      (item: any) => item.coin.toLowerCase() === selectedCoin,
    );
    if (selected.length) {
      return selected[0];
    } else {
      return {};
    }
  };

  const [tab, setTab] = useState(0);

  const [earningTable, setEarningTable] = useState({
    tableHead: [
      <Text style={styles.tableHeaderTitle}>Earnings Date</Text>,
      <Text style={styles.tableHeaderTitle}>Amount</Text>,
      <Text style={styles.tableHeaderTitle}>Status</Text>,
    ],
    tableData: [],
  });

  const [paymentTable, setPaymentTable] = useState({
    tableHead: [
      <Text style={styles.tableHeaderTitle}>Payment Time</Text>,
      <Text style={styles.tableHeaderTitle}>Amount</Text>,
      <Text style={styles.tableHeaderTitle}>Tx Link</Text>,
    ],
    tableData: [],
  });

  const txInfoLink = (item: any) => {
    let txInfoSites = {
      dgb: `https://digiexplorer.info/tx/${item.txInfo}`,
      bsv: `https://whatsonchain.com/tx/${item.txInfo}`,
      bch: `https://www.blockchain.com/bch/tx/${item.txInfo}`,
      btc: `https://www.blockchain.com/btc/tx/${item.txInfo}`,
    };
    //@ts-ignore
    return txInfoSites[item.currency.toLowerCase()];
  };

  useEffect(() => {
    let rows: any = [];
    if (tab === 0) {
      earningHistory.map((item, index) => {
        item.since = moment(item.since, 'YYYYMMDDHH').format('YYYY-MM-DD');
        item.id = index;
        item.currency = item.currency.toUpperCase();
        rows.push([
          textCell(item.since),
          textCell(item.price.toFixed(8), null, item.currency),
          textCell(item.paid ? 'Settled' : 'Not Settled'),
        ]);
      });
      let newTable = {...earningTable};
      // @ts-ignore
      newTable.tableData = rows.slice(page * 5, page * 5 + 5);
      setEarningTable(newTable);
    } else {
      paymentHistory.map((item, index) => {
        item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD');
        item.id = index;
        item.currency = item.currency.toUpperCase();
        rows.push([
          textCell(item.updatedAt),
          textCell(
            item.price.toFixed(item.currency.toLowerCase() === 'btc' ? 8 : 2),
            null,
            item.currency,
          ),
          <Button
            onPress={() => {
              if (item.txInfo) {
                Linking.canOpenURL(txInfoLink(item)).then(supported => {
                  if (supported) {
                    Linking.openURL(txInfoLink(item));
                  } else {
                    Alert.alert(
                      'Error!',
                      'Your Device Does"nt Support Open Links in Browser',
                    );
                  }
                });
              } else {
                Alert.alert(
                  'Error!',
                  'Payment is in Process , Blockchain Transaction Link is Unavailable !',
                );
              }
            }}>
            {item.txInfo ? 'View' : 'Not Paid'}
          </Button>,
        ]);
      });
      let newTable = {...paymentTable};
      // @ts-ignore
      newTable.tableData = rows.slice(page * 5, page * 5 + 5);
      setPaymentTable(newTable);
    }
  }, [earningHistory, paymentHistory, page, tab]);

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header
          left={
            <Icon
              name={'sort'}
              type={'MaterialIcons'}
              size={25}
              style={{marginTop: -3}}
            />
          }
          user
          right={<CoinsSelect selection={{selectedCoin, setSelectedCoin}} />}
        />
        <View style={styles.container}>
          <View style={styles.cardsContainer}>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>24H Earning</Card.Title>
              <View style={styles.cardContent}>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentBody}>
                    {getSelectedCoinInfo().yesterday.toFixed(8)}
                    <Text style={styles.unit}>
                      {' '}
                      {selectedCoin.toUpperCase()}
                    </Text>
                  </Text>
                  <Text style={styles.cardContentBody}>
                    $
                    {selectedCoinData && getSelectedCoinsExtraData
                      ? addThousandSep(
                          (
                            getSelectedCoinsExtraData().price *
                            getSelectedCoinInfo().yesterday
                          ).toFixed(2),
                        )
                      : 0.0}
                  </Text>
                </View>
              </View>
            </Card>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>Total Earning</Card.Title>
              <View style={styles.cardContent}>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentBody}>
                    {selectedCoin.toLowerCase() === 'dgb'
                      ? getSelectedCoinInfo().total.toFixed(2)
                      : getSelectedCoinInfo().total.toFixed(8)}
                    <Text style={styles.unit}>
                      {' '}
                      {selectedCoin.toUpperCase()}
                    </Text>
                  </Text>
                  <Text style={styles.cardContentBody}>
                    $
                    {selectedCoinData && getSelectedCoinsExtraData
                      ? addThousandSep(
                          (
                            getSelectedCoinsExtraData().price *
                            getSelectedCoinInfo().total
                          ).toFixed(2),
                        )
                      : 0.0}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
          <View style={styles.cardsContainer}>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>Total Paid</Card.Title>
              <View style={styles.cardContent}>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentBody}>
                    {selectedCoin.toLowerCase() === 'dgb'
                      ? (getSelectedCoinInfo().balance.paid || 0).toFixed(2)
                      : (getSelectedCoinInfo().balance.paid || 0).toFixed(8)}
                    <Text style={styles.unit}>
                      {' '}
                      {selectedCoin.toUpperCase()}
                    </Text>
                  </Text>
                  <Text style={styles.cardContentBody}>
                    $
                    {selectedCoinData && getSelectedCoinsExtraData
                      ? addThousandSep(
                          (
                            getSelectedCoinsExtraData().price *
                            getSelectedCoinInfo().balance.paid
                          ).toFixed(2),
                        )
                      : 0.0}
                  </Text>
                </View>
              </View>
            </Card>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>Balance</Card.Title>
              <View style={styles.cardContent}>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentBody}>
                    {selectedCoin.toLowerCase() === 'dgb'
                      ? (getSelectedCoinInfo().balance.price || 0).toFixed(2)
                      : (getSelectedCoinInfo().balance.price || 0).toFixed(8)}
                    <Text style={styles.unit}>
                      {' '}
                      {selectedCoin.toUpperCase()}
                    </Text>
                  </Text>
                  <Text style={styles.cardContentBody}>
                    ${' '}
                    {selectedCoinData && getSelectedCoinsExtraData
                      ? addThousandSep(
                          (
                            getSelectedCoinsExtraData().price *
                            getSelectedCoinInfo().balance.price
                          ).toFixed(2),
                        )
                      : 0.0}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
          <Statistics justApiResult setSelectedCoinData={setSelectedCoinData} />
          <View style={styles.tabContainer}>
            <Tab
              containerStyle={styles.tabContainerStyle}
              style={styles.tabStyle}
              indicatorStyle={styles.tabIndicatorStyle}
              value={tab}
              onChange={index => setTab(index)}>
              <Tab.Item
                style={styles.tabItemStyle}
                containerStyle={[
                  styles.tabItemContainerStyle,
                  {marginLeft: 20},
                ]}
                buttonStyle={tab === 0 ? styles.tabButtonStyle : undefined}
                titleStyle={[
                  styles.tabTitleStyle,
                  tab === 0 ? styles.activeTabTitle : undefined,
                ]}>
                Earning
              </Tab.Item>
              <Tab.Item
                style={styles.tabItemStyle}
                containerStyle={[
                  styles.tabItemContainerStyle,
                  {marginRight: 20},
                ]}
                buttonStyle={tab === 1 ? styles.tabButtonStyle : undefined}
                titleStyle={[
                  styles.tabTitleStyle,
                  tab === 1 ? styles.activeTabTitle : undefined,
                ]}>
                Payment
              </Tab.Item>
            </Tab>
            <View style={styles.tableContainer}>
              {tab === 0 ? (
                <Table>
                  <Row
                    key={moment.now().toString()}
                    data={earningTable.tableHead}
                    style={styles.head}
                    flexArr={[2, 3, 2]}
                  />
                  {earningTable.tableData.map((item: any, index: number) => (
                    <Row
                      key={index}
                      data={item}
                      flexArr={[2, 3, 2]}
                      style={{
                        ...styles.row,
                        backgroundColor:
                          index % 2 === 0 ? '#E5ECF6' : 'transparent',
                      }}
                    />
                  ))}
                  <Skeleton
                    animation="pulse"
                    width={
                      earningTable.tableData.length < 1
                        ? Dimensions.get('window').width
                        : 0
                    }
                    height={earningTable.tableData.length < 1 ? 130 : 0}
                  />
                </Table>
              ) : (
                <Table>
                  <Row
                    key={moment.now().toString()}
                    data={paymentTable.tableHead}
                    style={styles.head}
                    flexArr={[2, 3, 2]}
                  />
                  {paymentTable.tableData.map((item: any, index: number) => (
                    <Row
                      key={index}
                      data={item}
                      flexArr={[2, 3, 2]}
                      style={{
                        ...styles.row,
                        backgroundColor:
                          index % 2 === 0 ? '#E5ECF6' : 'transparent',
                      }}
                    />
                  ))}
                  <Skeleton
                    animation="pulse"
                    width={
                      paymentTable.tableData.length < 1
                        ? Dimensions.get('window').width
                        : 0
                    }
                    height={paymentTable.tableData.length < 1 ? 130 : 0}
                  />
                </Table>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <FAB
        placement={'right'}
        visible={
          page * 5 + 5 <
          (tab === 0 ? earningHistory.length : paymentHistory.length)
        }
        disabled={
          page * 5 + 5 >
          (tab === 0 ? earningHistory.length : paymentHistory.length)
        }
        icon={{name: 'chevron-right', color: 'white'}}
        size="small"
        color={gStyles.colors.primary}
        onPress={() => setPage(page + 1)}
      />
      <FAB
        placement={'left'}
        visible={page > 0}
        disabled={page < 0}
        icon={{name: 'chevron-left', color: 'white'}}
        size="small"
        color={gStyles.colors.primary}
        onPress={() => setPage(page - 1)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  subContainer: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
    paddingHorizontal: 15,
    marginHorizontal: 7,
    width: (Dimensions.get('window').width - 32) / 2,
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
  headerTitle: {
    fontFamily: gStyles.fonts.mont,
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
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
    fontWeight: '500',
    fontSize: 12,
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
    fontSize: 12,
    textAlign: 'left',
    marginRight: 5,
  },
  dataWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  unit: {
    fontSize: 8,
    color: '#000',
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
  },
  tabContainer: {
    marginVertical: 20,
  },
  tabContainerStyle: {
    backgroundColor: '#E5ECF6',
  },
  tabStyle: {},
  tabIndicatorStyle: {
    backgroundColor: 'transparent',
  },
  tabItemContainerStyle: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    marginTop: 6,
  },
  tabItemStyle: {},
  tabButtonStyle: {
    backgroundColor: '#fff',
  },
  tabTitleStyle: {
    color: '#000',
    fontFamily: gStyles.fonts.openSans,
  },
  activeTabTitle: {
    fontWeight: 'bold',
  },
  tableHeaderTitle: {
    fontFamily: gStyles.title.font,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
  },
  tableContainer: {
    flex: 1,
    paddingBottom: 16,
    width: '100%',
    marginTop: 15,
  },
  row: {
    height: 50,
    paddingLeft: 10,
  },
  head: {height: 40, backgroundColor: 'transparent', paddingLeft: 10},
});

export default Earnings;
