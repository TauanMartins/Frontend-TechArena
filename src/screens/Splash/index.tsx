import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Splash = () => {
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
