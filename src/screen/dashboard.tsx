import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Card} from '@rneui/themed';
import gStyles from '../utils/gStyles';
import {Text} from '@rneui/base';
import Coins from '../components/coins';

const Dashboard = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Account Overview</Text>
            </View>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>Hashrate</Card.Title>
              <View style={styles.cardContent}>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentTitle}>Real-Time</Text>
                  <Text style={styles.cardContentBody}>0.00 TH/s</Text>
                </View>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentTitle}>Average (24H)</Text>
                  <Text style={styles.cardContentBody}>0.00 TH/s</Text>
                </View>
              </View>
            </Card>
            <Card containerStyle={styles.card}>
              <Card.Title style={styles.cardTitle}>Workers</Card.Title>
              <View style={styles.cardContent}>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentTitle}>All</Text>
                  <Text style={styles.cardContentBody}>104</Text>
                </View>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentTitle}>Active</Text>
                  <Text style={styles.cardContentBody}>0</Text>
                </View>
                <View style={styles.dataWrapper}>
                  <Text style={styles.cardContentTitle}>Offline</Text>
                  <Text style={styles.cardContentBody}>104</Text>
                </View>
              </View>
            </Card>
            <Coins />
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
    marginTop: 10,
  },
  card: {
    borderRadius: 10,
    backgroundColor: gStyles.colors.blue,
    shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 30,
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'left',
    color: '#040480',
  },
  title: {
    fontFamily: gStyles.title.font,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'left',
  },
  titleContainer: {
    marginLeft: 16,
    marginRight: 16,
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardContentTitle: {
    color: '#00000087',
    fontFamily: gStyles.body.font,
  },
  cardContentBody: {
    color: gStyles.colors.primary,
    fontFamily: gStyles.body.font,
    fontWeight: 'bold',
    fontSize: 20,
  },
  dataWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

export default Dashboard;
