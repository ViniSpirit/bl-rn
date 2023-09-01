import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import useBluetoothClassic from './useBluetoothClassic';

const App: React.FC = () => {
  const {requestPermissions, pairedDevices, getPairedDevices, connectDevice} =
    useBluetoothClassic();

  const scan = async () => {
    const permission = await requestPermissions();

    if (permission) {
      await getPairedDevices();
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Scan" onPress={scan} />

      <FlatList
        data={pairedDevices}
        contentContainerStyle={styles.flatListStyle}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.deviceCard}
            onPress={() => connectDevice(item)}>
            <Text style={styles.deviceCardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333',
  },
  flatListStyle: {
    marginVertical: 12,
    gap: 12,
  },
  deviceCard: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
  },
  deviceCardText: {
    color: '#333',
  },
});

export default App;
