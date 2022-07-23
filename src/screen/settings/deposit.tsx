import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
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
import {Icon} from '@rneui/base';
import Header from '../../shared-components/header';
import gStyles from '../../utils/gStyles';
import Statistics from '../../shared-components/statistics';
import CoinsSelect from '../../shared-components/coinsSelect';
import {Card} from '@rneui/themed';
import {$$earningsBalance, $$getCoinsData} from '../../utils/api';
import {EarningBalance} from '../../utils/interfaces';
import {userContext} from '../../utils/context';
import {addThousandSep} from '../../utils/functions';

const Deposit = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };
  const {user} = useContext(userContext);

  const [selectedCoin, setSelectedCoin] = useState('btc');

  const [balances, setBalances] = useState<Array<EarningBalance>>([]);
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
      (item: any) => item.coin.toLowerCase() == selectedCoin,
    );
    if (selected.length) {
      return selected[0];
    } else {
      return {};
    }
  };

  useEffect(() => {
    $$getCoinsData().then((response: Array<object>) => {
      //@ts-ignore
      setSelectedCoinData(
        response.filter(item => item.algorithm === 'SHA-256'),
      );
    });
  }, []);

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
              onPress={() => props.navigation.navigate('PaymentSettings')}
            />
          }
          alignCenter
          main={<Text style={styles.headerTitle}>Deposit</Text>}
          right={<CoinsSelect selection={{selectedCoin, setSelectedCoin}} />}
        />
        <View style={styles.container}>
          <View style={styles.cardsContainer}>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>24H Earning</Card.Title>
              <View style={styles.cardContent}>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentBody}>
                    {
                      //@ts-ignore
                      getSelectedCoinInfo()
                        ? parseFloat(getSelectedCoinInfo().yesterday).toFixed(6)
                        : 0.0
                    }
                    <Text style={styles.unit}>
                      {' '}
                      {selectedCoin.toUpperCase()}
                    </Text>
                  </Text>
                  <Text style={styles.cardContentBody}>
                    $
                    {
                      //@ts-ignore
                      selectedCoinData && getSelectedCoinsExtraData()
                        ? addThousandSep(
                            (
                              getSelectedCoinsExtraData().price *
                              getSelectedCoinInfo().yesterday
                            ).toFixed(2),
                          )
                        : 0.0
                    }
                  </Text>
                </View>
              </View>
            </Card>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>Total Earning</Card.Title>
              <View style={styles.cardContent}>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentBody}>
                    {
                      //@ts-ignore
                      getSelectedCoinInfo()
                        ? parseFloat(getSelectedCoinInfo().total).toFixed(6)
                        : 0.0
                    }
                    <Text style={styles.unit}>
                      {' '}
                      {selectedCoin.toUpperCase()}
                    </Text>
                  </Text>
                  <Text style={styles.cardContentBody}>
                    $
                    {
                      //@ts-ignore
                      selectedCoinData && getSelectedCoinsExtraData
                        ? addThousandSep(
                            (
                              getSelectedCoinsExtraData().price *
                              getSelectedCoinInfo().total
                            ).toFixed(2),
                          )
                        : 0.0
                    }
                  </Text>
                </View>
              </View>
            </Card>
          </View>
          <View style={styles.subContainer}>
            <TouchableOpacity style={styles.secondButton}>
              <Text style={styles.secondButtonText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondButton}>
              <Text style={styles.secondButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  subContainer: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondButton: {
    textAlign: 'center',
    backgroundColor: '#043386',
    paddingVertical: 5,
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
    width: (Dimensions.get('window').width - 32) / 3,
  },
  secondButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: gStyles.fonts.poppins,
    color: '#fff',
    fontWeight: '500',
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
});

export default Deposit;
