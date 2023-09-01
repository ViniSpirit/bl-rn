import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useBLE from './useBLE';

const App = () => {
  const {requestPermission, scanForDevices, allDevices} = useBLE();

  const scan = async () => {
    requestPermission((isGranted: boolean) => {
      if (isGranted) {
        scanForDevices();
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={scan} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>{'Connect'}</Text>
      </TouchableOpacity>

      <FlatList
        data={allDevices.filter(device => device.name && device)}
        renderItem={({item}) => (
          <View style={styles.deviceCard}>
            <Text>{item.name || item.localName || 'no name'}</Text>
            <Text>{item.id}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  deviceCard: {
    paddingVertical: 10,
  },
});

export default App;
