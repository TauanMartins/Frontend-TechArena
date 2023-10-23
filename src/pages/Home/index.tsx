import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenProps } from '../../navigation/ScreenProps';
import { useAuth } from '../../utils/Auth/AuthContext';

const Home: React.FC<ScreenProps<'Home'>> = ({ route }) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao {route.name}, {user.name}</Text>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'black',
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F4F4',
    borderWidth: 0
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
  picture: {
    borderRadius: 50,
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
});

export default Home;
