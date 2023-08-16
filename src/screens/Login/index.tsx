import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../utils/AuthContext';
import { ScreenProps } from '../../navigation/ScreenProps';

const Login: React.FC<ScreenProps<'Login'>> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const { login } = useAuth(); // Função de login do contexto de autenticação

  const handleLogin = async () => {
    if (email && password) {
      try {
        await login(email, password);
      } catch (error: any) {
        console.log(error);
        setFeedbackMessage(error.message);
        setTimeout(()=>{
          setFeedbackMessage('');
        },3000)        
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça o login na sua conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'black',
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: 'black'
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
