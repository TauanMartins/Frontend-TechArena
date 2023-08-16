import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import { ScreenProps } from '../../navigation/ScreenProps';

const Splash: React.FC<ScreenProps<'Splash'>> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Logo/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default Splash;
