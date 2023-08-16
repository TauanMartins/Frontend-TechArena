import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {ScreenProps} from '../../navigation/ScreenProps';
import {useAuth} from '../../utils/Auth/AuthContext';
import {navigate} from '../../navigation/NavigationUtils';

const Dashboard: React.FC<ScreenProps<'Dashboard'>> = ({navigation}) => {
  const {logout, isAuthenticated, user} = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Dashboard</Text>
      <Text style={styles.text}>
        Aqui você pode ver as informações da sua conta e do seu aplicativo
      </Text>
      <Button title="Sair" onPress={handleLogout} />
      <Text style={styles.title}> </Text>
      <Button
        title="Ir"
        onPress={() => navigate(navigation, 'Dashboard', isAuthenticated, user)}
      />
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
});

export default Dashboard;
