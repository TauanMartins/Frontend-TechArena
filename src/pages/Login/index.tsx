import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {useAuth} from '../../utils/Auth/AuthContext';
import {ScreenProps} from '../../navigation/ScreenProps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../components/Loader';
import PrivacyPolicies_ServiceTems from '../../components/PrivacyPoliciesServiceTerms';
import {useTheme} from '../../utils/Theme/ThemeContext';

const Login: React.FC<ScreenProps<'Login'>> = () => {
  const {login, loading, setLoading} = useAuth();
  const {changeThemeFirstScreen} = useTheme();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login();
    } catch (error: any) {
      console.log('erro: ', error)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    changeThemeFirstScreen();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <View style={styles.containerUp}>
        <Text style={styles.brandName}>TECHARENA</Text>
        <Image
          style={styles.logo}
          source={require('../../assets/Logo/logo_WT.png')}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.containerDownContent}
        style={styles.containerDown}>
        <Text style={styles.text}>
          O aplicativo perfeito para você praticar esportes a qualquer momento e
          em qualquer lugar.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <AntDesign
            style={styles.buttonIcon}
            name="google"
            color={'#424242'}
            size={25}
          />
          <Text style={styles.buttonText}>Continuar com o Google</Text>
        </TouchableOpacity>
        <PrivacyPolicies_ServiceTems />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerUp: {
    height: '60%',
    alignItems: 'center',
  },
  containerDown: {
    flex: 1,
    borderTopRightRadius: 150,
    borderTopLeftRadius: 150,
    overflow: 'hidden',
    backgroundColor: '#424242',
  },
  containerDownContent: {
    paddingVertical: '15%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  brandName: {
    fontFamily: 'PostNoBillsColombo Medium',
    fontSize: 25,
    color: '#424242',
    margin: '7.5%',
    textShadowColor: '#424242',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 6,
  },
  logo: {
    height: 200,
    width: 200,
  },
  text: {
    fontFamily: 'PostNoBillsColombo Medium',
    textAlign: 'center',
    fontSize: 18,
    color: '#F4F4F4',
    marginLeft: '10%',
    marginRight: '10%',
    textShadowColor: '#F4F4F4',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: '#D3DDDF',
    elevation: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: '4%',
    margin: 15,
    borderRadius: 50,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontFamily: 'Sansation Regular',
    fontSize: 13,
    color: '#424242',
    textShadowColor: '#424242',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
});

export default Login;
