import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ScreenProps } from '../../navigation/ScreenProps';
import { useAuth } from '../../utils/Auth/AuthContext';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';

const Dashboard: React.FC<ScreenProps<'Dashboard'>> = ({ navigation }) => {
  const { logout, user } = useAuth();
  const [countries, setCountries] = useState([{ id: 0, name: '' }])
  const handleLogout = () => {
    logout();
  };
  const api = async () => {
    await axios.get('http://15.228.203.132/api/http?route=/common/countries')
      .then((response: { data: any; }) => {
        let countries = response.data;
        setCountries(countries)
      }).catch((error: string | undefined) => {
        throw new Error(error);
      })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Dashboard, {user.name}</Text>
      <Text style={styles.text}>
        Aqui você pode ver as informações da sua conta e do seu aplicativo
      </Text>
      <Button title="Sair" onPress={handleLogout} />
      <Text style={styles.text}> Token de acesso vence em {new Date(user.exp * 1000).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' })}</Text>
      <Button
        title="Ir"
        onPress={() => api()}
      />
      {countries.length > 1 ? (
        <FlatList
          data={countries}
          renderItem={({ item }) => (
            <Text style={styles.item} key={item.id}>
              {item.name}
            </Text>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => (
            <Text style={styles.title}>Countries</Text>
          )}
        />
      ) : (
        <Text style={styles.title}>No countries available</Text>
      )}
    </View >
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
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  text: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  item: {
    color: 'black',
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default Dashboard;
