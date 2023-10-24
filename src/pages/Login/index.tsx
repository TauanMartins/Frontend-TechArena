import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAuth} from '../../utils/Auth/AuthContext';
import {ScreenProps} from '../../navigation/ScreenProps';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

const Login: React.FC<ScreenProps<'Login'>> = ({}) => {
  const {login} = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.log(error);
      setFeedbackMessage(error.message);
      setTimeout(() => {
        setFeedbackMessage('');
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça o login na sua conta</Text>
      <GoogleSigninButton
        style={styles.button}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleLogin}
      />
      <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'black',
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F4F4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: 'black',
  },
  button: {
    textAlign: 'center',
    marginVertical: 20,
    width: 'auto',
  },
  input: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
  },
  feedbackMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default Login;
