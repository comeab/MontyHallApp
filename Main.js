import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function Main({ querySimulationEngine }) {
  const [isSwitching, setToggleCheckBox] = useState(false);
  const [numberOfSimulations, onChangeText] = useState('1');
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState({});

  const runSimulation = async (numberOfSimulations, isSwitching) => {
    setLoading(true);
    try {
      const result = await querySimulationEngine(
        numberOfSimulations,
        isSwitching,
      );
      setResult({
        ...result.data,
        percentageOfWins: result.data.percentageOfWins * 100
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(`Error: ${error?.response?.data}`);
    }
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: 20 }}>
            <Text style={{ ...styles.sectionTitle }}>
              Monty Hall Simulation App
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={{ ...styles.label }}>Number of Simulated Games</Text>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={(text) => onChangeText(text)}
                keyboardType="number-pad"
                value={numberOfSimulations}
                testID={'txtSimulations'}
              />
            </View>
            <View style={{ ...styles.sectionContainer, flexDirection: 'row' }}>
              <CheckBox
                value={isSwitching}
                onValueChange={setToggleCheckBox}
                style={{ alignSelf: 'center' }}
                testID="cbIsSwitching"
              />
              <Text style={styles.label}>I am always switching</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Button
                testID="btSubmit"
                title={isLoading ? 'Processing...' : 'Run Simulation'}
                onPress={() => runSimulation(numberOfSimulations, isSwitching)}
                disabled={isLoading}
              />
            </View>
            <View style={{ ...styles.sectionContainer }}>
              <Text style={{ ...styles.sectionTitle }}>Results</Text>
              <Text style={styles.label} testID='lbPercentageOfWins'>
                Percentage of Wins: {result.percentageOfWins} %
              </Text>
              <Text style={styles.label} testID={'lbWins'}>Wins: {result.wins}</Text>
              <Text style={styles.label} testID='lbLosses'>Losses: {result.losses}</Text>
              <Text style={styles.label} testID='lbGames'>Simulated Games: {result.numberOfSimulations} </Text>
              <Text style={styles.label}>Doors: {result.numberOfDoors}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  label: {
    fontSize: 18,
    color: Colors.dark,
  },
});
