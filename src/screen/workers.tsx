import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  RefreshControl,
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
import {FAB, Icon, Skeleton} from '@rneui/base';
import Header from '../shared-components/header';
import gStyles from '../utils/gStyles';
import {userContext} from '../utils/context';
import {Row, Table} from 'react-native-table-component';
import {$$workersGroups, $$workersList} from '../utils/api';
import {dynamicSort, Hashrate} from '../utils/functions';
import {WorkerGroups, WorkersList} from '../utils/interfaces';
import SelectDropdown from 'react-native-select-dropdown';

const textCell = (title: string, subtitle?: string, color?: string | null) => (
  <View style={{display: 'flex', marginLeft: 2}}>
    <Text
      style={{
        color: color ? color : '#000',
        fontSize: 12,
        fontWeight: '400',
        fontFamily: gStyles.fonts.mont,
        textAlign: 'center',
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
const Workers = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const {user} = useContext(userContext);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#F5F5F7',
  };

  const [page, setPage] = useState(0);

  const [table, setTable] = useState({
    tableHead: [
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Username</Text>
        </View>
      </View>,
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>Real-Time</Text>
        </View>
      </View>,
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>24H</Text>
        </View>
      </View>,
      <View style={styles.tableHeader}>
        <View>
          <Text style={styles.tableHeaderTitle}>7D</Text>
        </View>
      </View>,
    ],
    tableData: [],
  });
  const [rows, setRows] = useState<Array<WorkersList>>([]);
  const [realRows, setRealRows] = useState<Array<WorkersList>>([]);
  const [groups, setGroups] = useState<Array<WorkerGroups>>([]);
  const [selected, setSelected] = useState('all');
  const [sortVal, setSortVal] = useState('sort');
  const sortOptions = [
    {
      title: 'User: Ascending',
      value: 'user.ascending',
    },
    {
      title: 'User: Descending',
      value: 'user.descending',
    },
    {
      title: 'Real-Time: Ascending',
      value: 'realtime.ascending',
    },
    {
      title: 'Real-Time: Descending',
      value: 'realtime.descending',
    },
    {
      title: '24H: Ascending',
      value: '24h.ascending',
    },
    {
      title: '24H: Descending',
      value: '24h.descending',
    },
    {
      title: '7D: Ascending',
      value: '7d.ascending',
    },
    {
      title: '7D: Descending',
      value: '7d.descending',
    },
  ];

  useEffect(() => {
    getWorkersList();
    $$workersGroups(user?.token).then(response => {
      setGroups(
        response.data.map((item: any) => {
          item.title = item.name;
          return item;
        }),
      );
    });
  }, []);

  useEffect(() => {
    let newRows: any = [];
    rows.map(item => {
      newRows.push([
        textCell(
          item.worker_name.split('.')[1],
          undefined,
          item.hash1m > 0 ? 'green' : 'red',
        ),
        textCell(Hashrate(item.hash1m)),
        textCell(Hashrate(item.hash1d)),
        textCell(Hashrate(item.hash7d)),
      ]);
    });
    let newTable = {...table};
    // @ts-ignore
    newTable.tableData = newRows;
    setTable(newTable);
  }, [rows]);

  const getWorkersList = async (groupId: number | string | null = null) => {
    await $$workersList(user?.token, groupId).then(response => {
      let newRows = response.data.workers.map((item: any) => {
        item.id = item.worker_id;
        return item;
      });
      newRows = newRows.sort(dynamicSort('-hash1m'));
      setRows([...newRows]);
      setRealRows([...newRows]);
      setRefreshing(false);
      setPage(0);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getWorkersList();
  }, []);

  const [status, setStatus] = useState({
    activeTab: 'all',
    all: 0,
    online: 0,
    offline: 0,
    inactive: 0,
  });

  const applyFilter = (state: string) => {
    let newState = 'all';
    let query = realRows;
    switch (state) {
      case 'online':
        query = realRows.filter(worker => worker.hash1m > 0);
        newState = 'online';
        break;
      case 'offline':
        query = realRows.filter(worker => worker.hash5m === 0);
        newState = 'offline';
        break;
      case 'inactive':
        query = realRows.filter(worker => worker.hash1d === 0);
        newState = 'inactive';
        break;
    }
    setRows(query);
    setStatus({...status, activeTab: newState});
  };

  const workersStatus = (data: any = null) => {
    let newRows = data || realRows;
    let statusObj = {
      all: newRows.length,
      online: 0,
      offline: 0,
      inactive: 0,
    };
    newRows.map((worker: any) => {
      statusObj.online += worker.hash1m > 0 ? 1 : 0;
      statusObj.offline += worker.hash5m === 0 ? 1 : 0;
      statusObj.inactive += worker.hash1d === 0 ? 1 : 0;
    });
    return statusObj;
  };

  useEffect(() => {
    setStatus({...status, ...workersStatus(rows)});
  }, [realRows]);

  useEffect(() => {
    if (selected === 'all') {
      getWorkersList();
    } else {
      getWorkersList(selected);
    }
  }, [selected]);

  const preSort = (selectedColumn: string, sortModel: string) => {
    if (sortModel == 'zta') {
      return function (a: any, b: any) {
        if (a[selectedColumn] < b[selectedColumn]) {
          return -1;
        }
        if (a[selectedColumn] > b[selectedColumn]) {
          return 1;
        }
        return 0;
      };
    } else {
      return function (a: any, b: any) {
        if (a[selectedColumn] > b[selectedColumn]) {
          return -1;
        }
        if (a[selectedColumn] < b[selectedColumn]) {
          return 1;
        }
        return 0;
      };
    }
  };

  useEffect(() => {
    if (sortVal === 'sort') {
      setRows([...realRows]);
    } else {
      let selectedColumn, sortModel;
      switch (sortVal) {
        case 'user.ascending':
          selectedColumn = 'worker_name';
          sortModel = 'atz';
          break;
        case 'user.descending':
          selectedColumn = 'worker_name';
          sortModel = 'zta';
          break;
        case 'realtime.descending':
          selectedColumn = 'hash1m';
          sortModel = 'zta';
          break;
        case 'realtime.ascending':
          selectedColumn = 'hash1m';
          sortModel = 'atz';
          break;
        case '24h.ascending':
          selectedColumn = 'hash1d';
          sortModel = 'atz';
          break;
        case '24h.descending':
          selectedColumn = 'hash1d';
          sortModel = 'zta';
          break;
        case '7d.descending':
          selectedColumn = 'hash7d';
          sortModel = 'zta';
          break;
        case '7d.ascending':
          selectedColumn = 'hash7d';
          sortModel = 'atz';
          break;
      }
      console.log(selectedColumn, sortModel, sortVal);
      // @ts-ignore
      setRows([...realRows.sort(preSort(selectedColumn, sortModel))]);
    }
  }, [sortVal]);

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
          <View style={styles.filters}>
            <View>
              <SelectDropdown
                data={[
                  {
                    title: 'All',
                    value: 'all',
                  },
                  ...groups,
                ]}
                defaultValue={selected}
                defaultValueByIndex={0}
                onSelect={(selectedItem: any) => {
                  setSelected(selectedItem.id);
                }}
                buttonStyle={styles.dropdown3BtnStyle}
                renderCustomizedButtonChild={(selectedItem: any) => {
                  return (
                    <View style={styles.dropdown3BtnChildStyle}>
                      <Text style={styles.dropdown3BtnTxt}>
                        {selectedItem ? selectedItem.title : 'All'}
                      </Text>
                      <Icon
                        name={'expand-more'}
                        type={'MaterialIcons'}
                        size={22}
                        color={'#fff'}
                      />
                    </View>
                  );
                }}
                dropdownStyle={styles.dropdown3DropdownStyle}
                rowStyle={styles.dropdown3RowStyle}
                selectedRowStyle={styles.dropdown1SelectedRowStyle}
                renderCustomizedRowChild={(item: any) => {
                  return (
                    <View style={styles.dropdown3RowChildStyle}>
                      <Text style={styles.dropdown3RowTxt}>{item.title}</Text>
                    </View>
                  );
                }}
              />
            </View>
            <View style={{marginLeft: 20}}>
              <SelectDropdown
                data={[
                  {
                    title: 'Sort',
                    value: 'sort',
                  },
                  ...sortOptions,
                ]}
                defaultValue={sortVal}
                defaultValueByIndex={0}
                onSelect={(selectedItem: any) => {
                  setSortVal(selectedItem.value);
                }}
                buttonStyle={styles.dropdown3BtnStyle}
                renderCustomizedButtonChild={(selectedItem: any) => {
                  return (
                    <View style={styles.dropdown3BtnChildStyle}>
                      <Text style={styles.dropdown3BtnTxt}>
                        {selectedItem ? selectedItem.title : 'Sort'}
                      </Text>
                      <Icon
                        name={'expand-more'}
                        type={'MaterialIcons'}
                        size={22}
                        color={'#fff'}
                      />
                    </View>
                  );
                }}
                dropdownStyle={styles.dropdown3DropdownStyle}
                rowStyle={styles.dropdown3RowStyle}
                selectedRowStyle={styles.dropdown1SelectedRowStyle}
                renderCustomizedRowChild={(item: any) => {
                  return (
                    <View style={styles.dropdown3RowChildStyle}>
                      <Text style={styles.dropdown3RowTxt}>{item.title}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
          <View style={styles.statusFilter}>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => applyFilter('all')}>
              <View
                style={[
                  styles.filterText,
                  status.activeTab === 'all'
                    ? styles.filterTextActive
                    : undefined,
                ]}>
                <Text
                  style={[
                    styles.filterTextSelf,
                    status.activeTab === 'all'
                      ? styles.filterActiveTextSelf
                      : undefined,
                  ]}>
                  All
                </Text>
              </View>
              <View style={styles.filterNumber}>
                <Text style={styles.filterNumberText}>{status.all}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => applyFilter('online')}>
              <View
                style={[
                  styles.filterText,
                  status.activeTab === 'online'
                    ? styles.filterTextActive
                    : undefined,
                ]}>
                <Text
                  style={[
                    styles.filterTextSelf,
                    status.activeTab === 'online'
                      ? styles.filterActiveTextSelf
                      : undefined,
                  ]}>
                  Online
                </Text>
              </View>
              <View style={styles.filterNumber}>
                <Text style={styles.filterNumberText}>{status.online}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => applyFilter('offline')}
              style={styles.filterItem}>
              <View
                style={[
                  styles.filterText,
                  status.activeTab === 'offline'
                    ? styles.filterTextActive
                    : undefined,
                ]}>
                <Text
                  style={[
                    styles.filterTextSelf,
                    status.activeTab === 'offline'
                      ? styles.filterActiveTextSelf
                      : undefined,
                  ]}>
                  Offline
                </Text>
              </View>
              <View style={styles.filterNumber}>
                <Text style={styles.filterNumberText}>{status.offline}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => applyFilter('inactive')}>
              <View
                style={[
                  styles.filterText,
                  status.activeTab === 'inactive'
                    ? styles.filterTextActive
                    : undefined,
                ]}>
                <Text
                  style={[
                    styles.filterTextSelf,
                    status.activeTab === 'inactive'
                      ? styles.filterActiveTextSelf
                      : undefined,
                  ]}>
                  Inactive
                </Text>
              </View>
              <View style={styles.filterNumber}>
                <Text style={styles.filterNumberText}>{status.inactive}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>All Miners</Text>
        </View>
        <View style={styles.tableContainer}>
          <Table>
            {rows.length > 0 ? (
              <>
                <Row
                  data={table.tableHead}
                  style={styles.head}
                  flexArr={[2.2, 2, 2, 2]}
                />
                {table.tableData
                  .slice(page * 5, page * 5 + 5)
                  .map((item: any, index: number) => (
                    <Row
                      key={index}
                      data={item}
                      flexArr={[2.2, 2, 2, 2]}
                      style={[
                        styles.row,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {backgroundColor: index % 2 === 0 ? '#E5ECF6' : ''},
                      ]}
                    />
                  ))}
              </>
            ) : (
              <></>
            )}
            <Skeleton
              animation="pulse"
              width={
                table.tableData.length < 1 ? Dimensions.get('window').width : 0
              }
              height={table.tableData.length < 1 ? 130 : 0}
            />
          </Table>
        </View>
      </ScrollView>
      <FAB
        placement={'right'}
        visible={page * 5 + 5 !== rows.length}
        disabled={page * 5 + 5 === rows.length}
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
    paddingHorizontal: 10,
  },
  row: {
    height: 50,
    paddingLeft: 5,
  },
  title: {
    fontFamily: gStyles.fonts.mont,
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
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
    fontFamily: gStyles.fonts.poppins,
    color: '#000',
    textAlign: 'center',
    fontSize: 13,
  },
  tableHeader: {
    textAlign: 'center',
  },
  statusFilter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterItem: {
    backgroundColor: '#DAE5F5',
    borderColor: '#04338621',
    borderWidth: 1,
    borderRadius: 3,
    width: (Dimensions.get('window').width - 30 - 40) / 4,
  },
  filterText: {
    backgroundColor: '#043386',
    margin: 6,
    borderRadius: 5,
    paddingVertical: 6,
  },
  filterTextActive: {
    backgroundColor: '#CEA716',
  },
  filterTextSelf: {
    textAlign: 'center',
    fontFamily: gStyles.fonts.poppins,
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  filterActiveTextSelf: {
    color: '#000',
  },
  filterNumber: {
    marginBottom: 6,
  },
  filterNumberText: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: gStyles.fonts.poppins,
  },
  dropdown3BtnStyle: {
    width: (Dimensions.get('window').width - 42 - 11) / 2,
    height: 34,
    backgroundColor: '#043386',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#04338615',
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 30,
    marginBottom: 10,
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dropdown3BtnImage: {width: 22, height: 22, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: gStyles.fonts.poppins,
    fontSize: 15,
    marginLeft: 11,
    marginRight: 7,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: '#043180',
    borderBottomWidth: 0,
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dropdownRowImage: {width: 22, height: 22, resizeMode: 'cover'},
  dropdown3RowTxt: {
    color: '#fff',
    textAlign: 'left',
    fontSize: 12,
    fontFamily: gStyles.fonts.mont,
    marginHorizontal: 13,
  },
  dropdown3searchInputStyleStyle: {
    backgroundColor: 'slategray',
    borderBottomWidth: 0,
    borderBottomColor: '#FFF',
  },
  dropdown1SelectedRowStyle: {backgroundColor: 'rgba(0,0,0,0.1)'},
  filters: {
    marginHorizontal: 5,
    display: 'flex',
    flexDirection: 'row',
  },
});

export default Workers;
