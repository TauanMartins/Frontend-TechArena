import React from 'react';
import {Linking, StyleSheet, Text} from 'react-native';

const PrivacyPolicies_ServiceTems = () => {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };
  return (
    <Text style={styles.text}>
      Ao prosseguir, você concorda com nossos{' '}
      <Text
        style={styles.link}
        onPress={() =>
          handleLinkPress('https://techarena.com.br/use-terms')
        }>
        Termos de Uso
      </Text>{' '}
      e confirma ter lido nossa{' '}
      <Text
        style={styles.link}
        onPress={() =>
          handleLinkPress('https://techarena.com.br/privacy-policies')
        }>
        Política de Privacidade
      </Text>
      .
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Sansation Regular',
    textAlign: 'center',
    fontSize: 12,
    color: '#F4F4F4',
    marginTop: '2%',
    marginLeft: '7%',
    marginRight: '7%',
  },
  link: {
    fontFamily: 'Sansation Regular',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 12,
    color: '#0a0a0a',
  },
});

export default PrivacyPolicies_ServiceTems;
