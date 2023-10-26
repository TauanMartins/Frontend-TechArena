import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useAuth } from '../../utils/Auth/AuthContext';
import { ScreenProps } from '../../navigation/ScreenProps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../components/Loader';
import PrivacyPolicies_ServiceTems from '../../components/PrivacyPoliciesServiceTerms';

const Login: React.FC<ScreenProps<'Login'>> = ({ }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login();
    } catch (error: any) {
      Alert.alert('Sentimos muito!', 'Não conseguimos confirmar sua conta. :(')
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>TECHARENA</Text>
        <Image source={require('../../assets/Logo/logo_WT.png')} style={styles.logo} />
      </View>
      <View style={styles.container_2}>
        <Text style={styles.text_1}>O aplicativo perfeito para você praticar esportes a qualquer momento e em qualquer lugar.</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <AntDesign name='google' color={'#424242'} size={25} />
          <Text style={styles.button_text}>Continuar com o Google</Text>
        </TouchableOpacity >
        <PrivacyPolicies_ServiceTems />
      </View>
      {loading && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    color: '#424242',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  container_2: {
    color: '#F4F4F4',
    flex: 1,
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 170,
    borderTopLeftRadius: 170,
    backgroundColor: '#424242'
  },
  title: {
    fontFamily: 'PostNoBillsColombo Medium',
    fontSize: 36,
    color: '#424242',
    textShadowColor: '#424242',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6
  },
  text_1: {
    fontFamily: 'PostNoBillsColombo Medium',
    textAlign: 'center',
    fontSize: 24,
    color: '#F4F4F4',
    marginLeft: 20,
    marginRight: 20,
    textShadowColor: '#F4F4F4',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  logo: {
    height: 250,
    width: 250,
  },
  button: {
    backgroundColor: '#D3DDDF',
    elevation: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 18,
    borderRadius: 50
  },
  button_text: {
    fontFamily: 'Sansation Regular',
    fontSize: 22,
    color: '#424242',
    marginLeft: 20,
    marginRight: 20,
    textShadowColor: '#424242',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4
  },
});

export default Login;
