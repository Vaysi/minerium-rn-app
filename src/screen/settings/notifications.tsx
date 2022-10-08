import React, {useContext, useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Icon, Input, Overlay, Switch} from '@rneui/base';
import Header from '../../shared-components/header';
import gStyles from '../../utils/gStyles';
import {userContext} from '../../utils/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {$$getNotifications, $$setNotifications} from '../../utils/api';

const Notifications = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, setUser} = useContext(userContext);

  const [notifications, setNotifications] = useState({
    hashrate: 0,
    totalHashrate: 0,
    dailyReport: false,
    activeWorkers: 0,
  });
  const [dailyReport, setDailyReport] = useState(false);
  const [offlineWorkers, setOfflineWorkers] = useState(false);
  const [minerHashrate, setMinerHashrate] = useState(false);
  const [totalHashrate, setTotalHashrate] = useState(false);
  const [activeModal, setActiveModal] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };

  useEffect(() => {
    $$getNotifications(user?.token).then(response => {
      setNotifications(response.data);
      setDailyReport(response.data.dailyReport as boolean);
      setMinerHashrate(response.data.hashrate > -1);
      setTotalHashrate(response.data.totalHashrate > -1);
      setOfflineWorkers(response.data.activeWorkers > -1);
    });
  }, []);

  const modalTitle: any = {
    offlineWorkers: 'Workers Offline',
    minerHashrate: 'Low Miner Hashrate',
    totalHashrate: 'Low Total Hashrate',
  };

  const inputValue: any = () => {
    switch (activeModal) {
      case 'minerHashrate':
        return notifications.hashrate.toString();
      case 'totalHashrate':
        return notifications.totalHashrate.toString();
      case 'offlineWorkers':
        return notifications.activeWorkers.toString();
      default:
        return '';
    }
  };

  const changeField = (text: string) => {
    switch (activeModal) {
      case 'minerHashrate':
        setNotifications({...notifications, hashrate: parseInt(text, 10)});
        break;
      case 'totalHashrate':
        setNotifications({...notifications, totalHashrate: parseInt(text, 10)});
        break;
      case 'offlineWorkers':
        setNotifications({...notifications, activeWorkers: parseInt(text, 10)});
        break;
    }
  };

  const [tempVal, setTempVal] = useState('');

  const submit = () => {
    setTempVal('');
    setActiveModal('');
    $$setNotifications(
      notifications.activeWorkers,
      dailyReport,
      notifications.hashrate,
      notifications.totalHashrate,
      user?.token,
    ).then(() => {
      ToastAndroid.show('Settings Saved !', 2000);
    });
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
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
        />
        <View style={styles.container}>
          <Text style={styles.mainTitle}>Notification Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.flex}>
              <View>
                <Text style={styles.settingItemText}>Daily Report</Text>
              </View>
              <View>
                <Switch
                  thumbColor={dailyReport ? '#043386' : '#CEA716'}
                  style={styles.settingItemCheckbox}
                  value={dailyReport}
                  onValueChange={value => setDailyReport(value)}
                />
              </View>
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.flex}>
              <View>
                <Text style={styles.settingItemText}>Workers Offline</Text>
                <Text style={styles.settingsItemSubtext}>
                  Active workers below{' '}
                  <Text style={{color: '#CEA716'}}>
                    {notifications.activeWorkers} Miners
                  </Text>{' '}
                  report me.
                </Text>
              </View>
              <View>
                <Switch
                  thumbColor={offlineWorkers ? '#043386' : '#CEA716'}
                  style={styles.settingItemCheckbox}
                  value={offlineWorkers}
                  onValueChange={value => setOfflineWorkers(value)}
                />
              </View>
            </View>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
              <TouchableOpacity
                disabled={!offlineWorkers}
                style={
                  !offlineWorkers ? styles.disabledButton : styles.secondButton
                }
                onPress={() => {
                  setActiveModal('offlineWorkers');
                  setTempVal(notifications.activeWorkers.toString());
                }}>
                <Text style={styles.secondButtonText}>Modify</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.flex}>
              <View>
                <Text style={styles.settingItemText}>Low miner hashrate</Text>
                <Text style={styles.settingsItemSubtext}>
                  Hashrate of any miner below{' '}
                  <Text style={{color: '#CEA716'}}>
                    {notifications.hashrate} TH/s
                  </Text>{' '}
                  report me.
                </Text>
              </View>
              <View>
                <Switch
                  thumbColor={minerHashrate ? '#043386' : '#CEA716'}
                  style={styles.settingItemCheckbox}
                  value={minerHashrate}
                  onValueChange={value => setMinerHashrate(value)}
                />
              </View>
            </View>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
              <TouchableOpacity
                style={
                  !minerHashrate ? styles.disabledButton : styles.secondButton
                }
                disabled={!minerHashrate}
                onPress={() => {
                  setActiveModal('minerHashrate');
                  setTempVal(notifications.hashrate.toString());
                }}>
                <Text style={styles.secondButtonText}>Modify</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.flex}>
              <View>
                <Text style={styles.settingItemText}>Low total hashrate</Text>
                <Text style={styles.settingsItemSubtext}>
                  Total hashrate below{' '}
                  <Text style={{color: '#CEA716'}}>
                    {notifications.totalHashrate} TH/s
                  </Text>{' '}
                  report me.
                </Text>
              </View>
              <View>
                <Switch
                  thumbColor={totalHashrate ? '#043386' : '#CEA716'}
                  style={styles.settingItemCheckbox}
                  value={totalHashrate}
                  onValueChange={value => setTotalHashrate(value)}
                />
              </View>
            </View>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
              <TouchableOpacity
                style={
                  !totalHashrate ? styles.disabledButton : styles.secondButton
                }
                disabled={!totalHashrate}
                onPress={() => {
                  setActiveModal('totalHashrate');
                  setTempVal(notifications.totalHashrate.toString());
                }}>
                <Text style={styles.secondButtonText}>Modify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Overlay
          isVisible={activeModal.length > 0}
          backdropStyle={{
            backgroundColor: '#20202078',
          }}
          overlayStyle={{
            backgroundColor: '#F5F5F7',
            borderRadius: 15,
            paddingHorizontal: 30,
          }}
          onBackdropPress={() => {
            setActiveModal('');
            switch (activeModal) {
              case 'minerHashrate':
                setNotifications({
                  ...notifications,
                  hashrate: parseInt(tempVal, 10),
                });
                break;
              case 'totalHashrate':
                setNotifications({
                  ...notifications,
                  totalHashrate: parseInt(tempVal, 10),
                });
                break;
              case 'offlineWorkers':
                setNotifications({
                  ...notifications,
                  activeWorkers: parseInt(tempVal, 10),
                });
                break;
            }
            setTempVal('');
          }}>
          <Text style={styles.modalTitle}>{modalTitle[activeModal]}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 15,
            }}>
            <Text>Report me if it's below</Text>
            <TextInput
              autoFocus
              value={inputValue()}
              defaultValue={inputValue()}
              keyboardType={'numeric'}
              style={{
                backgroundColor: '#e5ecf678',
                borderWidth: 1,
                borderColor: '#04338671',
                borderRadius: 3,
                height: 25,
                padding: 0,
                marginHorizontal: 5,
                paddingHorizontal: 7,
                textAlign: 'center',
              }}
              onChangeText={text => changeField(text)}
            />
          </View>
          <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={submit}
              style={[styles.secondButton, {marginTop: 0}]}>
              <Text style={styles.secondButtonText}>Modify</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 90,
  },
  secondButton: {
    textAlign: 'center',
    backgroundColor: '#043386',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 30,
    width: 100,
  },
  secondButtonText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: gStyles.fonts.poppins,
    color: '#D4E2F4',
    fontWeight: '500',
  },
  mainTitle: {
    fontSize: 20,
    fontFamily: gStyles.fonts.mont,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 20,
  },
  settingItem: {
    marginTop: 25,
    borderBottomWidth: 3,
    borderBottomColor: '#d4e2f485',
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  settingItemText: {
    fontSize: 16,
    fontFamily: gStyles.fonts.mont,
    fontWeight: '600',
    color: '#000',
  },
  settingsItemSubtext: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: gStyles.fonts.mont,
  },
  settingItemCheckbox: {
    borderColor: '#043386',
    borderWidth: 1,
    borderRadius: 17,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: gStyles.fonts.mont,
    color: '#000',
  },
  disabledButton: {
    textAlign: 'center',
    backgroundColor: '#04338641',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 30,
    width: 100,
  },
});

export default Notifications;
