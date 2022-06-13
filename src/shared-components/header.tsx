import React, {useContext} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {userContext} from '../utils/context';
import gStyles from '../utils/gStyles';

interface Props {
  left?: any;
  main?: any;
  right?: any;
  user?: boolean;
}

const Header = (props: Props) => {
  let main = null;
  let {user} = useContext(userContext);
  if (props.user) {
    main = <Text style={styles.user}>{user.username}</Text>;
  } else {
    main = props.main ? (
      props.main
    ) : (
      <Image
        source={require('../../assets/logoType.png')}
        style={styles.logo}
        resizeMode={'contain'}
      />
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.left}>{props.left}</View>
      <View style={styles.main}>{main}</View>
      <View style={styles.right}>{props.right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    paddingLeft: 15,
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
  },
  main: {
    height: 50,
    display: 'flex',
    flex: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    paddingRight: 15,
    flex: 3,
  },
  logo: {
    width: 130,
    height: 30,
  },
  user: {
    textTransform: 'capitalize',
    color: '#000',
    fontFamily: gStyles.fonts.poppins,
    fontSize: 20,
    textAlign: 'left',
  },
});

export default Header;
