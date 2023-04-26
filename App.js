import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [counter, setCounter] = useState(0);
  const [interval, setIntervalID] = useState([]);
  const [log, setLog] = useState(null);

  var numberToAdd = 0;

  function action(number) {
    numberToAdd = numberToAdd + number;
    confirmAction(numberToAdd)
  }

  function startAction(number) {
    setLog('StartAction')
    const id = setInterval(() => {
      action(number);
    }, 100); // decrementa a cada 200ms    
    setIntervalID(id);
  }

  function confirmAction(number) {
    setCounter(counter + number)
  }

  function stopAction() {
    setLog('StopAction')
    numberToAdd = 0;    
    clearInterval(interval)
    setIntervalID(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.title}>Bem-vindo ao TechArena!</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text>Contador: {counter}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]}
            onPress={() => { setLog('Action'); action(-1) }}
            onLongPress={() => startAction(-1)}
            onPressOut={() => stopAction()}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.col}>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]}
            onPress={() => { setLog('Action'); action(1) }}
            onLongPress={() => startAction(1)}
            onPressOut={() => stopAction()}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text>{log}</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: 'black',
    paddingBottom: 100
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
});