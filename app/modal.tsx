import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS, SPACING } from '@/constants/colors';

// Import camera components conditionally
let CameraView: any = null;
let Camera: any = null;
let BarCodeScanner: any = null;

try {
  const cameraModule = require('expo-camera');
  CameraView = cameraModule.CameraView;
  Camera = cameraModule.Camera;
} catch (error) {
  console.log('Camera not available');
}

try {
  BarCodeScanner = require('expo-barcode-scanner').BarCodeScanner;
} catch (error) {
  console.log('BarCodeScanner not available');
}

export default function QRCodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');

  useEffect(() => {
    const getCameraPermissions = async () => {
      if (!Camera) {
        // If camera is not available, use BarCodeScanner fallback
        if (BarCodeScanner) {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        } else {
          setHasPermission(false);
        }
        return;
      }

      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    console.log('QR Code scanned!', { type, data });
    setScanned(true);
    setScannedData(data);
    
    try {
      // Try to parse as JSON (our QR code format)
      const connectionData = JSON.parse(data);
      console.log('Parsed connection data:', connectionData);
      
      // Validate that it has the expected structure
      if (connectionData.firstName && connectionData.email) {
        console.log('Valid connection data found, showing alert');
        // Save to localStorage
        saveConnectionToStorage(connectionData);
        
        Alert.alert(
          'Connection Added!',
          `${connectionData.firstName} has been successfully added to your connections list.`,
          [
            {
              text: 'Scan Another',
              onPress: () => setScanned(false),
            },
            {
              text: 'View Connections',
              onPress: () => {
                router.back();
                // Navigate back to networking screen, connections tab will auto-refresh
              },
            },
          ]
        );
      } else {
        // Not our QR code format, show raw data
        console.log('Invalid connection data structure:', connectionData);
        Alert.alert(
          'QR Code Scanned!',
          `Data: ${data}`,
          [
            {
              text: 'Scan Another',
              onPress: () => setScanned(false),
            },
            {
              text: 'Done',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      // Not JSON, show raw data
      console.log('Failed to parse QR data as JSON:', error, 'Data:', data);
      Alert.alert(
        'QR Code Scanned!',
        `Data: ${data}`,
        [
          {
            text: 'Scan Another',
            onPress: () => setScanned(false),
          },
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  // Save connection to storage
  const saveConnectionToStorage = async (connectionData: any) => {
    try {
      let existingConnections: any[] = [];
      
      if (Platform.OS === 'web') {
        // Web platform - use localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          existingConnections = JSON.parse(localStorage.getItem('decanetworking_connections') || '[]');
        }
      } else {
        // Mobile platform - use AsyncStorage
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const storedData = await AsyncStorage.getItem('decanetworking_connections');
          existingConnections = JSON.parse(storedData || '[]');
        } catch (asyncError) {
          console.log('AsyncStorage not available, falling back to localStorage');
          if (typeof window !== 'undefined' && window.localStorage) {
            existingConnections = JSON.parse(localStorage.getItem('decanetworking_connections') || '[]');
          }
        }
      }
      
      // Check if connection already exists (by email)
      const existingIndex = existingConnections.findIndex((conn: any) => conn.email === connectionData.email);
      
      if (existingIndex >= 0) {
        // Update existing connection
        existingConnections[existingIndex] = {
          ...connectionData,
          connected: new Date().toLocaleString(),
          id: existingConnections[existingIndex].id || Date.now().toString()
        };
      } else {
        // Add new connection
        const newConnection = {
          ...connectionData,
          connected: new Date().toLocaleString(),
          id: Date.now().toString()
        };
        existingConnections.unshift(newConnection);
      }
      
      // Save back to storage
      const dataToSave = JSON.stringify(existingConnections);
      
      if (Platform.OS === 'web') {
        // Web platform - use localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('decanetworking_connections', dataToSave);
        }
      } else {
        // Mobile platform - use AsyncStorage
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          await AsyncStorage.setItem('decanetworking_connections', dataToSave);
        } catch (asyncError) {
          console.log('AsyncStorage not available, falling back to localStorage');
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('decanetworking_connections', dataToSave);
          }
        }
      }
      
    } catch (error) {
      console.error('Error saving connection:', error);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {CameraView ? (
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'pdf417'],
            }}
          >
            {/* Scanning Overlay */}
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Text style={styles.instructionText}>
                Position the QR code within the frame
              </Text>
            </View>
          </CameraView>
        ) : BarCodeScanner ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.camera}
          >
            {/* Scanning Overlay */}
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Text style={styles.instructionText}>
                Position the QR code within the frame
              </Text>
            </View>
          </BarCodeScanner>
        ) : (
          <View style={styles.camera}>
            <View style={styles.overlay}>
              <Text style={styles.text}>
                Camera functionality is not available on this platform.
              </Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => router.back()}
              >
                <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Scanned Data Display */}
      {scannedData ? (
        <View style={styles.dataContainer}>
          {(() => {
            try {
              const connectionData = JSON.parse(scannedData);
              if (connectionData.firstName && connectionData.email) {
                return (
                  <>
                    <Text style={styles.dataLabel}>Connection Added!</Text>
                    <Text style={styles.dataText}>
                      {connectionData.firstName} {connectionData.lastName}'s connection was scanned
                    </Text>
                  </>
                );
              }
            } catch (error) {
              // Not JSON or invalid format
            }
            return <Text style={styles.dataLabel}>QR Code Scanned</Text>;
          })()}
          <TouchableOpacity 
            style={styles.scanAgainButton}
            onPress={() => {
              setScanned(false);
              setScannedData('');
            }}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    position: 'absolute',
    bottom: -50,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: SPACING.sm,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dataContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: SPACING.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dataLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  dataText: {
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
