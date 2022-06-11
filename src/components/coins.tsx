import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text} from '@rneui/base';
import {Tab, TabView} from '@rneui/themed';
import gStyles from '../utils/gStyles';

const Coins = () => {
  const [index, setIndex] = useState(0);
  return (
    <>
      <Tab
        value={index}
        onChange={e => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
        }}
        variant="primary">
        <Tab.Item
          title="BTC"
          titleStyle={{fontSize: 12}}
          containerStyle={styles.tabHeaderItem}
          icon={
            <Image
              source={require('../../assets/coins/btc.png')}
              resizeMode={'stretch'}
              style={styles.coinIcon}
            />
          }
        />
        <Tab.Item
          title="BCH"
          titleStyle={{fontSize: 12}}
          containerStyle={styles.tabHeaderItem}
          icon={
            <Image
              source={require('../../assets/coins/bch.png')}
              resizeMode={'stretch'}
              style={styles.coinIcon}
            />
          }
        />
        <Tab.Item
          title="BSV"
          titleStyle={{fontSize: 12}}
          containerStyle={styles.tabHeaderItem}
          icon={
            <Image
              source={require('../../assets/coins/bsv.png')}
              resizeMode={'stretch'}
              style={styles.coinIcon}
            />
          }
        />
        <Tab.Item
          title="DGB"
          titleStyle={{fontSize: 12}}
          containerStyle={styles.tabHeaderItem}
          icon={
            <Image
              source={require('../../assets/coins/dgb.png')}
              resizeMode={'stretch'}
              style={styles.coinIcon}
            />
          }
        />
      </Tab>
      <TabView
        containerStyle={{minHeight: 120}}
        value={index}
        onChange={setIndex}>
        <TabView.Item style={styles.tabItem}>
          <View>
            <View style={styles.coinWrapper}>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Daily Revenue</Text>
                <Text style={styles.detailContent}>0.00</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Yesterday Earning</Text>
                <Text style={styles.detailContent}>0.00</Text>
              </View>
            </View>
            <View style={styles.coinWrapper}>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Total Earning</Text>
                <Text style={styles.detailContent}>1.58089740</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Balance</Text>
                <Text style={styles.detailContent}>1.580898046</Text>
              </View>
            </View>
          </View>
        </TabView.Item>
        <TabView.Item style={styles.tabItem}>
          <View>
            <View style={styles.coinWrapper}>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Daily Revenue</Text>
                <Text style={styles.detailContent}>0.00</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Yesterday Earning</Text>
                <Text style={styles.detailContent}>0.00</Text>
              </View>
            </View>
            <View style={styles.coinWrapper}>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Total Earning</Text>
                <Text style={styles.detailContent}>1.58089740</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Balance</Text>
                <Text style={styles.detailContent}>1.580898046</Text>
              </View>
            </View>
          </View>
        </TabView.Item>
        <TabView.Item style={styles.tabItem}>
          <View>
            <View style={styles.coinWrapper}>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Daily Revenue</Text>
                <Text style={styles.detailContent}>0.00</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Yesterday Earning</Text>
                <Text style={styles.detailContent}>0.00</Text>
              </View>
            </View>
            <View style={styles.coinWrapper}>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Total Earning</Text>
                <Text style={styles.detailContent}>1.58089740</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Balance</Text>
                <Text style={styles.detailContent}>1.580898046</Text>
              </View>
            </View>
          </View>
        </TabView.Item>
        <TabView.Item style={styles.tabItem}>
          <View>
            <View style={styles.coinWrapper}>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Daily Revenue</Text>
                <Text style={styles.detailContent}>0.00</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Yesterday Earning</Text>
                <Text style={styles.detailContent}>0.00</Text>
              </View>
            </View>
            <View style={styles.coinWrapper}>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Total Earning</Text>
                <Text style={styles.detailContent}>1.58089740</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Balance</Text>
                <Text style={styles.detailContent}>1.580898046</Text>
              </View>
            </View>
          </View>
        </TabView.Item>
      </TabView>
    </>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    width: '100%',
    backgroundColor: gStyles.colors.blue,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabHeaderItem: {
    backgroundColor: gStyles.colors.primary,
  },
  coinIcon: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 15,
  },
  coinWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  detail: {
    alignItems: 'center',
    paddingTop: 5,
  },
  detailTitle: {
    fontFamily: gStyles.body.font,
    fontWeight: 'bold',
    fontSize: 18,
  },
  detailContent: {
    fontFamily: gStyles.body.font,
    fontSize: 17,
    color: gStyles.colors.primary,
  },
});

export default Coins;
