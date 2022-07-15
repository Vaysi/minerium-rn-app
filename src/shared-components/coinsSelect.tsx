import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Icon, Text} from '@rneui/base';
import gStyles from '../utils/gStyles';
import SelectDropdown from 'react-native-select-dropdown';

interface Props {
  selection: {
    selectedCoin: string;
    setSelectedCoin: any;
  };
}

const CoinsSelect = (props: Props) => {
  const coins = [
    {title: 'BTC', image: require('../../assets/coins/btc.png')},
    {title: 'BCH', image: require('../../assets/coins/bch.png')},
    {title: 'DGB', image: require('../../assets/coins/dgb.png')},
  ];

  const {selectedCoin, setSelectedCoin} = props.selection;

  return (
    // @ts-ignore
    <SelectDropdown
      data={coins}
      defaultValue={selectedCoin}
      defaultValueByIndex={0}
      onSelect={(selectedItem: any) => {
        setSelectedCoin(selectedItem.title.toLowerCase());
      }}
      buttonStyle={styles.dropdown3BtnStyle}
      renderCustomizedButtonChild={(selectedItem: any) => {
        return (
          <View style={styles.dropdown3BtnChildStyle}>
            {selectedItem ? (
              <Image
                source={selectedItem.image}
                style={styles.dropdown3BtnImage}
              />
            ) : (
              <Icon
                name="add-circle-outline"
                type={'MaterialIcons'}
                color={'#444'}
                size={32}
              />
            )}
            <Text style={styles.dropdown3BtnTxt}>
              {selectedItem ? selectedItem.title : 'Select a Coin'}
            </Text>
            <Icon
              name={'expand-more'}
              type={'MaterialIcons'}
              size={22}
              color={'#043180'}
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
            <Image source={item.image} style={styles.dropdownRowImage} />
            <Text style={styles.dropdown3RowTxt}>{item.title}</Text>
          </View>
        );
      }}
      search
      searchInputStyle={styles.dropdown3searchInputStyleStyle}
      searchPlaceHolder={'Search here'}
      searchPlaceHolderColor={'#F8F8F8'}
      renderSearchInputLeftIcon={() => {
        return (
          <Icon
            name={'search'}
            type={'MaterialIcons'}
            color={'#FFF'}
            size={18}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown3BtnStyle: {
    width: 100,
    height: 34,
    backgroundColor: '#D4E2F4',
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
    color: '#043180',
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: gStyles.fonts.poppins,
    fontSize: 15,
    marginLeft: 11,
    marginRight: 7,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: 'slategray',
    borderBottomColor: '#444',
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: {width: 22, height: 22, resizeMode: 'cover'},
  dropdown3RowTxt: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 12,
  },
  dropdown3searchInputStyleStyle: {
    backgroundColor: 'slategray',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  dropdown1SelectedRowStyle: {backgroundColor: 'rgba(0,0,0,0.1)'},
});

export default CoinsSelect;
