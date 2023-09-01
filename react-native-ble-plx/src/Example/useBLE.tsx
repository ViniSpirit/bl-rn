import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device, ScanMode, ScanOptions} from 'react-native-ble-plx';

type PermissionCallBack = (result: boolean) => void;

type BluetoothLowEnergyApi = {
  requestPermission(callback: PermissionCallBack): Promise<void>;
  scanForDevices(): void;
  allDevices: Device[];
};

const bleManager = new BleManager();

const scanOptions: ScanOptions = {
  scanMode: ScanMode.LowLatency,
};

export default function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<Device[]>([]);

  const requestPermission = async (callback: PermissionCallBack) => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const grantedLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const grantedBluetooth = await PermissionsAndroid.requestMultiple([
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
        grantedLocation === PermissionsAndroid.RESULTS.GRANTED;

      const allPermissions =
        bluetoothConnectStatus &&
        bluetoothscantStatus &&
        bluetoothLocationStatus;
      callback(allPermissions);
    } else {
      const grantedLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      callback(grantedLocation === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForDevices = () =>
    bleManager.startDeviceScan(null, scanOptions, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  return {
    requestPermission,
    scanForDevices,
    allDevices,
  };
}
