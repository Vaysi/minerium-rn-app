import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from '@rneui/base';
import gStyles from '../utils/gStyles';

interface Props {
  params?: any;
  icon: any;
  text: any;
  onPress?: any;
}
const RectIconButton = (props: Props) => {
  return (
    <Button
      type="solid"
      {...props.params}
      color={'#043180'}
      onPress={props.onPress}
      buttonStyle={styles.button}>
      <View style={styles.button}>
        <View style={styles.icon}>{props.icon}</View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.text}</Text>
        </View>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginBottom: 4,
  },
  textContainer: {},
  text: {
    color: '#fff',
    fontSize: 12,
    fontFamily: gStyles.body.font,
  },
  button: {
    borderRadius: 2,
    borderTopRightRadius: 18,
    marginHorizontal: 0,
  },
});

export default RectIconButton;
