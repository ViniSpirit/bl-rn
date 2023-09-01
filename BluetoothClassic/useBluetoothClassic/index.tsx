import {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform, Linking} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

type BluetoothClassicHook = {
  requestPermissions(): Promise<boolean>;
  pairedDevices: BluetoothDevice[];
  getPairedDevices(): Promise<void>;
  connectDevice(device: BluetoothDevice): Promise<void>;
  deviceConnection: boolean;
};

function useBluetoothClassic(): BluetoothClassicHook {
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
  const [deviceConnection, setDeviceConnection] = useState<boolean>(false);

  const requestPermissions = async () => {
    const isBluetoothAvailable =
      await RNBluetoothClassic.isBluetoothAvailable();

    if (!isBluetoothAvailable) {
      return false;
    }

    const isBluetoothEnabled = await RNBluetoothClassic.isBluetoothEnabled();

    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const grantedBluetooth = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      const bluetoothConnectStatus =
        grantedBluetooth['android.permission.BLUETOOTH_CONNECT'] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const bluetoothscantStatus =
        grantedBluetooth['android.permission.BLUETOOTH_CONNECT'] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const bluetoothLocationStatus =
        grantedBluetooth['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const allPermissions =
        bluetoothConnectStatus &&
        bluetoothscantStatus &&
        bluetoothLocationStatus;

      if (!isBluetoothEnabled && allPermissions) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }

      return allPermissions;
    } else {
      const grantedLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const permission = grantedLocation === PermissionsAndroid.RESULTS.GRANTED;

      if (!isBluetoothEnabled && permission) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }

      return permission;
    }
  };

  const getPairedDevices = async () => {
    const devicesPaired = await RNBluetoothClassic.getBondedDevices();

    setPairedDevices(devicesPaired);
  };

  const connectDevice = async (device: BluetoothDevice) => {
    try {
      let connection = await device.isConnected();

      if (!connection) {
        connection = await device.connect();
        console.log(connection);
        setDeviceConnection(connection);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    requestPermissions,
    pairedDevices,
    getPairedDevices,
    connectDevice,
    deviceConnection,
  };
}

export default useBluetoothClassic;
