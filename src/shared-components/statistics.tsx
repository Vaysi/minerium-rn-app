import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {Skeleton, Text} from '@rneui/base';
import gStyles from '../utils/gStyles';
import {Row, Table} from 'react-native-table-component';
import {MinerStats_Coins} from '../utils/interfaces';
import {$$getCoinsData} from '../utils/api';
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

const textCell = (title: string, subtitle?: string) => (
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
interface Props {
  setSelectedCoinData?: any;
}
const Statistics = (props: Props) => {
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
          <Text style={styles.tableHeaderTitle}>Price</Text>
        </View>
      </View>,
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Network Hashrate</Text>
        </View>
      </View>,
    ],
    tableData: [],
  });
  const [coins, setCoins] = useState<Array<MinerStats_Coins>>([]);

  useEffect(() => {
    $$getCoinsData().then((response: Array<object>) => {
      //@ts-ignore
      setCoins(response.filter(item => item.algorithm === 'SHA-256'));
      if (Boolean(props.setSelectedCoinData)) {
        props.setSelectedCoinData(
          response.filter(item => item.algorithm === 'SHA-256'),
        );
      }
    });
  }, []);

  useEffect(() => {
    let rows: any = [];
    coins.map(item => {
      rows.push([
        firstCell(item.coin, item.algorithm),
        textCell('$ ' + addThousandSep(item.price.toFixed(2))),
        textCell(`${hashToE(item.network_hashrate).toFixed(2)} EH/s`),
      ]);
    });
    let newTable = {...table};
    // @ts-ignore
    newTable.tableData = rows;
    setTable(newTable);
  }, [coins]);
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.title}>Statistics</Text>
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
              // eslint-disable-next-line react-native/no-inline-styles
              {backgroundColor: index % 2 === 0 ? '#E5ECF6' : ''},
            ]}
          />
        ))}
        <Skeleton
          animation="pulse"
          width={
            table.tableData.length < 1 ? Dimensions.get('window').width : 0
          }
          height={table.tableData.length < 1 ? 130 : 0}
        />
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 50,
    paddingLeft: 10,
  },
  tableContainer: {
    flex: 1,
    paddingBottom: 16,
    width: '100%',
    marginTop: 15,
  },
  head: {height: 40, backgroundColor: 'transparent', paddingLeft: 10},
  wrapper: {flexDirection: 'row'},
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

export default Statistics;
