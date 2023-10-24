import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { ScreenProps } from '../../navigation/ScreenProps';
import { useAuth } from '../../utils/Auth/AuthContext';
import axios from 'axios';

const Profile: React.FC<ScreenProps<'Profile'>> = ({ }) => {
  const { logout, user } = useAuth();
  const [answer, setAnswer] = useState({})
  const healthCheck = async () => {
    await axios.get('https://api.techarena.com.br/api/health-check')
      .then((response: { data: JSON }) => {
        return setAnswer(response.data);
      })
      .catch((error: string | undefined) => {
        throw new Error(error);
      });
  };
  const renderJSON = (data: {}) => {
    return (
      <>
        <Text style={styles.text}>{`Resultado para\n https://api.techarena.com.br/api/health-check`}</Text>
        <Text style={styles.text}>{JSON.stringify(data, null, 1)}</Text>
        <Text style={styles.text}>{`Hora do resultado: ${new Date().toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        })}`}</Text>
      </>
    );
  };
  const handleLogout = () => {
    logout();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Este é seu perfil, ${user.name}`}</Text>
      {user.picture && <Image style={styles.picture} source={{ uri: user.picture }} />}
      <View style={styles.button}>
        <Button title="HealthCheck API" onPress={healthCheck} />
      </View>
      <View style={styles.text}>
        {Object.keys(answer).length > 0 && renderJSON(answer)}
      </View>
      <View style={styles.button}>
        <Button title="Sair" onPress={handleLogout} />
      </View>

    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'black',
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F4F4',
  },
  button: {
    color: 'black',
    padding: 16,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  text: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginVertical: 8,
  },
  item: {
    color: 'black',
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  picture: {
    padding: 30,
    margin: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
});

export default Profile;
