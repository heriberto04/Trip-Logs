import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSettings } from '../contexts/settings-context';
import { useUserInfo } from '../contexts/user-info-context';
import { useVehicles } from '../contexts/vehicles-context';

export default function SettingsScreen() {
  const { settings, setSettings } = useSettings();
  const { userInfo, setUserInfo } = useUserInfo();
  const { vehicles } = useVehicles();

  const toggleUnit = () => {
    setSettings(prev => ({
      ...prev,
      unit: prev.unit === 'miles' ? 'kilometers' : 'miles'
    }));
  };

  const showUserInfoForm = () => {
    Alert.alert('User Info', 'User information editing will be implemented in a future update.');
  };

  const showVehicleManagement = () => {
    Alert.alert('Vehicles', 'Vehicle management will be implemented in a future update.');
  };

  const showExportOptions = () => {
    Alert.alert('Export', 'Data export options will be implemented in a future update.');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <TouchableOpacity style={styles.settingRow} onPress={showUserInfoForm}>
            <Text style={styles.settingLabel}>Name</Text>
            <Text style={styles.settingValue}>
              {userInfo.name || 'Not set'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow} onPress={showUserInfoForm}>
            <Text style={styles.settingLabel}>Address</Text>
            <Text style={styles.settingValue}>
              {userInfo.address || 'Not set'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={toggleUnit}>
            <Text style={styles.settingLabel}>Distance Unit</Text>
            <Text style={styles.settingValue}>{settings.unit}</Text>
          </TouchableOpacity>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Currency</Text>
            <Text style={styles.settingValue}>{settings.currency}</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Deduction Rate</Text>
            <Text style={styles.settingValue}>${settings.deductionRate}/mile</Text>
          </View>
        </View>

        {/* Vehicles Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicles</Text>
          <TouchableOpacity style={styles.settingRow} onPress={showVehicleManagement}>
            <Text style={styles.settingLabel}>Manage Vehicles</Text>
            <Text style={styles.settingValue}>
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={showExportOptions}>
            <Text style={styles.settingLabel}>Export Data</Text>
            <Text style={styles.settingValue}>PDF, CSV</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  settingRow: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#333',
    borderWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'right',
  },
});