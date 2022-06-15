import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import gStyles from '../utils/gStyles';
import {Button, ButtonGroup, Icon, Input, Skeleton} from '@rneui/base';
import Header from '../shared-components/header';
import {Row, Table} from 'react-native-table-component';
import {$$getPps} from '../utils/api';
import {addThousandSep, humanize} from '../utils/functions';
import CustomDivider from '../shared-components/divider';

const textCell = (title: string, subtitle?: string) => (
  <Text
    style={{
      color: '#000',
      fontSize: 13,
      fontWeight: '700',
      fontFamily: gStyles.body.font,
    }}>
    {title}
    {'\n'}
    {subtitle && (
      <Text
        style={{
          color: '#000',
          fontSize: 11,
          fontWeight: '500',
          fontFamily: gStyles.body.font,
          flex: 1,
          width: '100%',
        }}>
        {subtitle}
      </Text>
    )}
  </Text>
);

function createData(
  per: any,
  fee: any,
  reward: any,
  btc: any,
  usd: any,
  cost: any,
  profit: any,
) {
  return {per, fee, reward, btc, usd, cost, profit};
}

const Calculator = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };

  const [coin, setCoin] = useState<string>('BTC');

  const [table, setTable] = useState({
    tableHead: [
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Per</Text>
        </View>
      </View>,
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Rewards ($)</Text>
          <Text style={styles.tableHeaderSubtitle}>
            Rewards ({coin.toUpperCase()})
          </Text>
        </View>
      </View>,
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Profit</Text>
          <Text style={styles.tableHeaderSubtitle}>Cost</Text>
        </View>
      </View>,
    ],
    tableData: [],
  });

  const [tab, setTab] = useState('basic');

  const [networkDiff, setNetworkDiff] = useState<number>(0);
  const [hashrate, setHashrate] = useState<string | number>(1);
  const [poolFee, setPoolFee] = useState<string | number>(4);
  const [coinValue, setCoinValue] = useState<string | number>(0);
  const [pps, setPps] = useState<number>(0);
  const [hashUnit, setHashUnit] = useState<string>('TH/s');
  const [powerUnit, setPowerUnit] = useState<string>('W');
  const [powerCostUnit, setPowerCostUnit] = useState<string>('cent');
  const [power, setPower] = useState<string | number>(0);
  const [powerCost, setPowerCost] = useState<string | number>(0);
  const [rows, setRows] = useState<Array<any>>([]);

  const HOURS_IN_DAY = 24,
    DAYS_IN_WEEK = 7,
    DAYS_IN_MONTH = 30,
    DAYS_IN_YEAR = 365;
  const HOURS_IN_WEEK = HOURS_IN_DAY * DAYS_IN_WEEK,
    HOURS_IN_MONTH = HOURS_IN_DAY * DAYS_IN_MONTH,
    HOURS_IN_YEAR = HOURS_IN_DAY * DAYS_IN_YEAR;

  let earning_currency_after_electricity = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  };
  let earning_currency_after_electricity_no_fee = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  };
  let earning_usd_after_electricity = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  };

  const calculate = (
    i_hashrate: any,
    i_electricity_Wh: any,
    i_kWh_usd_rate: any,
    i_pool_fee: any,
    i_currency_to_usd_rate: any,
    i_network_diff: any,
    i_pps: any = 0,
  ) => {
    if (i_currency_to_usd_rate === 0) {
      return false;
    }

    if (hashUnit != 'TH/s') {
      if (hashUnit == 'PH/s') {
        i_hashrate *= 1000;
      } else if (hashUnit == 'EH/s') {
        i_hashrate *= 1000000;
      }
    }

    if (powerUnit != 'W') {
      if (powerUnit == 'KW') {
        i_electricity_Wh *= 1000;
      } else if (powerUnit == 'MW') {
        i_electricity_Wh *= 1000000;
      }
    }

    if (powerCostUnit == 'cent') {
      i_kWh_usd_rate /= 100;
    }

    // Watt to kW
    const w2kw = (w: number) => w / 1000;
    let electricity_per_hour_usd = i_electricity_Wh * w2kw(i_kWh_usd_rate);
    const electricity_cost_usd = {
      daily: electricity_per_hour_usd * HOURS_IN_DAY,
      weekly: electricity_per_hour_usd * HOURS_IN_WEEK,
      monthly: electricity_per_hour_usd * HOURS_IN_MONTH,
      yearly: electricity_per_hour_usd * HOURS_IN_YEAR,
    };

    const electricity_cost_currency = {
      daily: electricity_cost_usd.daily / i_currency_to_usd_rate,
      weekly: electricity_cost_usd.weekly / i_currency_to_usd_rate,
      monthly: electricity_cost_usd.monthly / i_currency_to_usd_rate,
      yearly: electricity_cost_usd.yearly / i_currency_to_usd_rate,
    };

    const fee_in_percent = (fee: number) => 1.0 - fee * 0.01;
    const EARNING_CURRENCY_DAY =
      i_hashrate *
      (i_pps || pps) *
      fee_in_percent(i_pool_fee) *
      (networkDiff / i_network_diff);

    const EARNING_CURRENCY_DAY_NO_FEE =
      i_hashrate * (i_pps || pps) * (networkDiff / i_network_diff);
    const earning_currency = {
      daily: EARNING_CURRENCY_DAY,
      weekly: EARNING_CURRENCY_DAY * DAYS_IN_WEEK,
      monthly: EARNING_CURRENCY_DAY * DAYS_IN_MONTH,
      yearly: EARNING_CURRENCY_DAY * DAYS_IN_YEAR,
    };

    const earning_currency_no_fee = {
      daily: EARNING_CURRENCY_DAY_NO_FEE,
      weekly: EARNING_CURRENCY_DAY_NO_FEE * DAYS_IN_WEEK,
      monthly: EARNING_CURRENCY_DAY_NO_FEE * DAYS_IN_MONTH,
      yearly: EARNING_CURRENCY_DAY_NO_FEE * DAYS_IN_YEAR,
    };

    const earning_usd = {
      daily: earning_currency.daily * i_currency_to_usd_rate,
      weekly: earning_currency.weekly * i_currency_to_usd_rate,
      monthly: earning_currency.monthly * i_currency_to_usd_rate,
      yearly: earning_currency.yearly * i_currency_to_usd_rate,
    };

    earning_currency_after_electricity = {
      daily: earning_currency.daily - electricity_cost_currency.daily,
      weekly: earning_currency.weekly - electricity_cost_currency.weekly,
      monthly: earning_currency.monthly - electricity_cost_currency.monthly,
      yearly: earning_currency.yearly - electricity_cost_currency.yearly,
    };

    earning_currency_after_electricity_no_fee = {
      daily: earning_currency_no_fee.daily - electricity_cost_currency.daily,
      weekly: earning_currency_no_fee.weekly - electricity_cost_currency.weekly,
      monthly:
        earning_currency_no_fee.monthly - electricity_cost_currency.monthly,
      yearly: earning_currency_no_fee.yearly - electricity_cost_currency.yearly,
    };

    earning_usd_after_electricity = {
      daily: earning_usd.daily - electricity_cost_usd.daily,
      weekly: earning_usd.weekly - electricity_cost_usd.weekly,
      monthly: earning_usd.monthly - electricity_cost_usd.monthly,
      yearly: earning_usd.yearly - electricity_cost_usd.yearly,
    };
    const calcFeeInBtc = (reward: any) => reward * (i_pool_fee * 0.01);
    setRows([
      createData(
        'Day',
        humanize(calcFeeInBtc(earning_currency_no_fee.daily)),
        humanize(earning_currency_no_fee.daily),
        humanize(earning_currency.daily),
        humanize(earning_usd.daily, 2),
        humanize(electricity_cost_usd.daily, 2),
        humanize(earning_usd_after_electricity.daily, 2),
      ),
      createData(
        'Week',
        humanize(calcFeeInBtc(earning_currency_no_fee.weekly)),
        humanize(earning_currency_no_fee.weekly),
        humanize(earning_currency.weekly),
        humanize(earning_usd.weekly, 2),
        humanize(electricity_cost_usd.weekly, 2),
        humanize(earning_usd_after_electricity.weekly, 2),
      ),
      createData(
        'Month',
        humanize(calcFeeInBtc(earning_currency_no_fee.monthly)),
        humanize(earning_currency_no_fee.monthly),
        humanize(earning_currency.monthly),
        humanize(earning_usd.monthly, 2),
        humanize(electricity_cost_usd.monthly, 2),
        humanize(earning_usd_after_electricity.monthly, 2),
      ),
      createData(
        'Year',
        humanize(calcFeeInBtc(earning_currency_no_fee.yearly)),
        humanize(earning_currency_no_fee.yearly),
        humanize(earning_currency.yearly),
        humanize(earning_usd.yearly, 2),
        humanize(electricity_cost_usd.yearly, 2),
        humanize(earning_usd_after_electricity.yearly, 2),
      ),
    ]);
    return true;
  };

  useEffect(() => {
    $$getPps(coin).then(res => {
      setNetworkDiff(res.data.difficulty);
      setCoinValue(res.data.exchangeRate);
      setPps(res.data.pps);
    });
  }, [coin]);

  useEffect(() => {
    calculate(hashrate, power, powerCost, poolFee, coinValue, networkDiff);
  }, [
    networkDiff,
    hashrate,
    poolFee,
    power,
    powerCost,
    coinValue,
    coin,
    hashUnit,
    powerUnit,
    powerCostUnit,
  ]);

  useEffect(() => {
    $$getPps(coin).then(res => {
      setNetworkDiff(res.data.difficulty);
      setCoinValue(res.data.exchangeRate);
      setPps(res.data.pps);
      calculate(
        hashrate,
        power,
        powerCost,
        poolFee,
        res.data.exchangeRate,
        res.data.difficulty,
        res.data.pps,
      );
    });
    setTimeout(() => {
      setHashUnit('PH/s');
      setHashUnit('TH/s');
    }, 2000);
  }, []);

  const getSelectedCoinIndex = () => {
    if (coin.toLowerCase() === 'btc') {
      return 0;
    } else if (coin.toLowerCase() === 'bch') {
      return 1;
    } else if (coin.toLowerCase() === 'bsv') {
      return 2;
    } else {
      return 3;
    }
  };

  const setCoinByIndex = (index: number) => {
    if (index === 0) {
      setCoin('BTC');
    } else if (index === 1) {
      setCoin('BCH');
    } else if (index === 2) {
      setCoin('BSV');
    } else {
      setCoin('DGB');
    }
  };

  useEffect(() => {
    let newRows: any = [];
    rows.map(item => {
      newRows.push([
        textCell(item.per),
        textCell(`${item.usd} $`, item.btc),
        textCell(`${item.profit} $`, `${item.cost} $`),
      ]);
    });
    let newTable = {...table};
    // @ts-ignore
    newTable.tableData = newRows;
    setTable(newTable);
  }, [rows]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          <Header
            left={
              <Icon
                name={'arrow-back'}
                type={'MaterialIcons'}
                onPress={() => props.navigation.goBack()}
              />
            }
            alignCenter
            main={<Text style={styles.headerTitle}>Calculator</Text>}
          />
          <View style={styles.container}>
            <View style={styles.tabsButton}>
              <Button
                onPress={() => setTab('basic')}
                titleStyle={styles.button}
                containerStyle={styles.buttonContainer}
                color={'#043386'}
                icon={
                  tab === 'basic' ? (
                    <Icon
                      type={'MaterialIcons'}
                      name={'keyboard-arrow-up'}
                      color={'#fff'}
                    />
                  ) : (
                    <Icon
                      type={'MaterialIcons'}
                      name={'keyboard-arrow-down'}
                      color={'#fff'}
                    />
                  )
                }
                iconRight={true}
                radius={10}>
                Basic
              </Button>
              <Button
                onPress={() => setTab('advanced')}
                titleStyle={styles.button}
                containerStyle={styles.buttonContainer}
                color={'#043386'}
                icon={
                  tab === 'advanced' ? (
                    <Icon
                      type={'MaterialIcons'}
                      name={'keyboard-arrow-up'}
                      color={'#fff'}
                    />
                  ) : (
                    <Icon
                      type={'MaterialIcons'}
                      name={'keyboard-arrow-down'}
                      color={'#fff'}
                    />
                  )
                }
                iconRight={true}
                radius={10}>
                Advanced
              </Button>
            </View>
            <View style={styles.fields}>
              <ButtonGroup
                buttons={['BTC', 'BCH', 'BSV', 'DGB']}
                selectedIndex={getSelectedCoinIndex()}
                onPress={value => setCoinByIndex(value)}
                containerStyle={{marginBottom: 20}}
              />
              <Input
                placeholder="Hashrate"
                value={addThousandSep(hashrate)}
                onChangeText={text => {
                  setHashrate(text.replace(/,/g, ''));
                }}
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                rightIcon={
                  <View style={styles.unitContainer}>
                    <Text style={styles.unit}>TH/s</Text>
                  </View>
                }
                label={'Hashrate'}
                labelStyle={styles.inputLabel}
              />
              <Input
                label={'Fee'}
                onChangeText={text => {
                  setPoolFee(text.replace(/,/g, ''));
                }}
                defaultValue={poolFee}
                style={styles.input}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                rightIcon={
                  <View style={styles.unitContainer}>
                    <Text style={styles.unit}>%</Text>
                  </View>
                }
              />
              <Input
                label={`${coin.toUpperCase()} Price`}
                onChangeText={text => {
                  setCoinValue(text.replace(/,/g, ''));
                }}
                value={addThousandSep(coinValue)}
                style={styles.input}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
                rightIcon={
                  <View style={styles.unitContainer}>
                    <Text style={styles.unit}>$</Text>
                  </View>
                }
              />
              <Input
                label={`Net. Difficulty`}
                onChangeText={text => {
                  //@ts-ignore
                  setNetworkDiff(text.replace(/,/g, ''));
                }}
                value={addThousandSep(networkDiff)}
                style={styles.input}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputItself}
                inputContainerStyle={styles.selfInputContainer}
              />
              {tab == 'advanced' ? (
                <>
                  <Input
                    label={`Power Cost`}
                    onChangeText={text => {
                      setPowerCost(text.replace(/,/g, ''));
                    }}
                    value={addThousandSep(powerCost)}
                    style={styles.input}
                    labelStyle={styles.inputLabel}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.inputItself}
                    inputContainerStyle={styles.selfInputContainer}
                    rightIcon={
                      <View style={styles.unitContainer}>
                        <Text style={styles.unit}>$</Text>
                      </View>
                    }
                  />
                  <Input
                    label={`Power Consumption`}
                    onChangeText={text => {
                      setPower(text.replace(/,/g, ''));
                    }}
                    value={addThousandSep(power)}
                    style={styles.input}
                    labelStyle={styles.inputLabel}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.inputItself}
                    inputContainerStyle={styles.selfInputContainer}
                    rightIcon={
                      <View style={styles.unitContainer}>
                        <Text style={styles.unit}>$/kWH</Text>
                      </View>
                    }
                  />
                </>
              ) : null}
            </View>
          </View>
          <CustomDivider />
          <View style={styles.tableContainer}>
            <Table>
              <Row
                data={table.tableHead}
                style={styles.head}
                flexArr={[2, 2, 3, 1]}
              />
              {table.tableData.map((item: any, index: number) => (
                <Row
                  key={index}
                  data={item}
                  flexArr={[2, 2, 3, 1]}
                  style={[
                    styles.row,
                    {backgroundColor: index % 2 === 0 ? '#E5ECF6' : ''},
                  ]}
                />
              ))}
              <Skeleton
                animation="pulse"
                width={
                  table.tableData.length < 1
                    ? Dimensions.get('window').width
                    : 0
                }
                height={table.tableData.length < 1 ? 130 : 0}
              />
            </Table>
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
  head: {height: 40, backgroundColor: 'transparent', paddingLeft: 10},
  wrapper: {flexDirection: 'row'},
  row: {
    height: 50,
    paddingLeft: 10,
  },
  tableContainer: {
    flex: 1,
    paddingBottom: 16,
    width: '100%',
  },
  tableHeaderTitle: {
    fontFamily: gStyles.title.font,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 13,
  },
  tableHeaderSubtitle: {
    fontFamily: gStyles.title.font,
    color: '#00000046',
    textAlign: 'left',
    fontSize: 10,
  },
  tableHeader: {},
  coinContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 25,
    height: 25,
  },
  title: {
    paddingLeft: 10,
    fontSize: 20,
    color: '#000',
    fontFamily: gStyles.title.font,
    fontWeight: '300',
  },
  headerTitle: {
    fontFamily: gStyles.fonts.mont,
    fontWeight: 'bold',
    fontSize: 18,
  },
  tabsButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: Dimensions.get('window').width / 2 - 70,
    textAlign: 'left',
    fontFamily: gStyles.fonts.poppins,
    fontSize: 15,
    fontWeight: '500',
    color: '#D4E2F4',
    paddingBottom: 0,
  },
  buttonContainer: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 30,
  },
  fields: {
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    backgroundColor: gStyles.colors.primary,
    marginTop: 5,
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  inputContainer: {
    width: '100%',
  },
  inputItself: {},
  unitContainer: {
    marginRight: 5,
  },
  unit: {
    fontFamily: gStyles.fonts.mont,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontFamily: gStyles.fonts.mont,
    fontSize: 13,
    color: '#F5F5F7',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selfInputContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    borderRadius: 5,
    borderTopLeftRadius: 5,
  },
});

export default Calculator;
