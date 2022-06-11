import React, {useEffect, useState} from 'react';
import {
  Image,
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
import RectIconButton from '../shared-components/rect-icon-button';
import {Icon} from '@rneui/base';
import Header from '../shared-components/header';
import {Row, Table} from 'react-native-table-component';
import {$$getCoinsData} from '../utils/api';
import {MinerStats_Coins} from '../utils/interfaces';
import {addThousandSep, hashToE} from '../utils/functions';

const firstCell = (title: string, subtitle: string) => {
  let source = require('../../assets/coins/btc.png');
  switch (title.toLowerCase()) {
    case 'btc':
      source = require('../../assets/coins/btc.png');
      break;
    case 'bch':
      source = require('../../assets/coins/bch.png');
      break;
    case 'bsv':
      source = require('../../assets/coins/bsv.png');
      break;
    case 'dgb':
      source = require('../../assets/coins/dgb.png');
      break;
  }
  return (
    <View style={styles.coinContainer}>
      <View style={{display: 'flex'}}>
        <Image source={source} style={styles.coinIcon} resizeMode={'contain'} />
      </View>
      <View style={{display: 'flex', marginLeft: 5}}>
        <Text style={{color: '#000', fontSize: 12}}>{title}</Text>
        <Text style={{color: '#000', fontSize: 10}}>{subtitle}</Text>
      </View>
    </View>
  );
};

const textCell = (title: string, subtitle: string) => (
  <View style={{display: 'flex', marginLeft: 5}}>
    <Text
      style={{
        color: '#000',
        fontSize: 13,
        fontWeight: '400',
        fontFamily: gStyles.body.font,
      }}>
      {title}
    </Text>
    <Text
      style={{
        color: '#000',
        fontSize: 10,
        fontWeight: '300',
        fontFamily: gStyles.body.font,
      }}>
      {subtitle}
    </Text>
  </View>
);

const iconCell = () => (
  <Icon
    name={'calculate'}
    type={'MaterialIcons'}
    size={30}
    color={gStyles.colors.primary}
  />
);
const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [table, setTable] = useState({
    tableHead: [
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Coins</Text>
          <Text style={styles.tableHeaderSubtitle}>Algorithm</Text>
        </View>
      </View>,
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Profit</Text>
          <Text style={styles.tableHeaderSubtitle}>Price</Text>
        </View>
      </View>,
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Pool Hashrate</Text>
          <Text style={styles.tableHeaderSubtitle}>Network Hashrate</Text>
        </View>
      </View>,
      '',
    ],
    tableData: [],
  });
  const [coins, setCoins] = useState<Array<MinerStats_Coins>>([]);

  useEffect(() => {
    $$getCoinsData().then((response: Array<object>) => {
      //@ts-ignore
      setCoins(response.filter(item => item.algorithm === 'SHA-256'));
    });
  }, []);

  useEffect(() => {
    let rows: any = [];
    coins.map(item => {
      rows.push([
        firstCell(item.coin, item.algorithm),
        textCell('$ 0.3386', addThousandSep(item.price.toFixed(2))),
        textCell(
          '166.83 EH/s',
          `${hashToE(item.network_hashrate).toFixed(2)} EH/s`,
        ),
        iconCell(),
      ]);
    });
    let newTable = {...table};
    // @ts-ignore
    newTable.tableData = rows;
    setTable(newTable);
  }, [coins]);

  // @ts-ignore
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
          <View style={styles.container}>
            <View style={styles.buttons}>
              <RectIconButton
                text={'Favorite'}
                icon={
                  <Icon
                    color={'#fff'}
                    name={'bookmark-outline'}
                    type={'MaterialIcons'}
                    size={22}
                  />
                }
              />
              <RectIconButton
                text={'Pop Miners'}
                icon={
                  <Icon
                    color={'#fff'}
                    name={'grid-view'}
                    type={'MaterialIcons'}
                    size={22}
                  />
                }
              />
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
              />
              <RectIconButton
                text={'Watchers'}
                icon={
                  <Icon
                    color={'#fff'}
                    name={'remove-red-eye'}
                    type={'MaterialIcons'}
                    size={22}
                  />
                }
              />
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#D4E2F4',
              height: 3,
              width: '100%',
              marginVertical: 15,
            }}
          />
          <View style={styles.tableContainer}>
            <Text style={styles.title}>Statistics</Text>
            <Table>
              <Row data={table.tableHead} style={styles.head} />
              {table.tableData.map((item: any, index: number) => (
                <Row
                  key={index}
                  data={item}
                  style={[
                    styles.row,
                    //@ts-ignore
                    index % 2 == 0 && {backgroundColor: '#E5ECF6'},
                  ]}
                  textStyle={styles.text}
                />
              ))}
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
  text: {},
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
});

export default Home;
