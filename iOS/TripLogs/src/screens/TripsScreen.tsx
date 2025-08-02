import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTrips } from '../contexts/TripsContext';
import { Trip } from '../types';

export const TripsScreen: React.FC = () => {
  const { trips, deleteTrip, loading } = useTrips();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, you might want to reload from storage
    setRefreshing(false);
  };

  const handleDeleteTrip = (trip: Trip) => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete the trip from ${trip.date}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTrip(trip.id),
        },
      ]
    );
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <View style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <Text style={styles.tripDate}>{item.date}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteTrip(item)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tripDetails}>
        <Text style={styles.detailText}>
          Time: {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.detailText}>
          Miles: {item.miles}
        </Text>
        <Text style={styles.detailText}>
          Earnings: ${item.grossEarnings.toFixed(2)}
        </Text>
        <Text style={styles.detailText}>
          Expenses: Gas ${item.expenses.gasoline.toFixed(2)}, 
          Tolls ${item.expenses.tolls.toFixed(2)}, 
          Food ${item.expenses.food.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const currentYear = new Date().getFullYear();
  const currentYearTrips = trips.filter(
    trip => new Date(trip.date).getFullYear() === currentYear
  );

  const sortedTrips = currentYearTrips.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Logs ({currentYear})</Text>
      
      {sortedTrips.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No trips found for {currentYear}</Text>
          <Text style={styles.emptySubtext}>Start by adding your first trip!</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTrips}
          renderItem={renderTripItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  listContainer: {
    paddingBottom: 16,
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tripDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});