import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

interface Props {
  left?: any;
  main?: any;
  right?: any;
}

const Header = (props: Props) => {
  return (
    <View>
      <View style={styles.left}>{props.left}</View>
      <View style={styles.main}>
        {props.main ? (
          props.main
        ) : (
          <Image
            source={require('../../assets/logoType.png')}
            style={styles.logo}
            resizeMode={'contain'}
          />
        )}
      </View>
      <View style={styles.right}>{props.right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  left: {},
  main: {
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
  },
  right: {},
  logo: {
    width: 130,
    height: 30,
  },
});

export default Header;
