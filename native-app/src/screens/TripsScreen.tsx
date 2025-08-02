import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTrips } from '../contexts/trips-context';

export default function TripsScreen() {
  const { trips } = useTrips();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Recent Trips</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Trip</Text>
          </TouchableOpacity>
        </View>
        
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No trips recorded yet.</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first trip.</Text>
          </View>
        ) : (
          trips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <Text style={styles.tripDate}>{trip.date}</Text>
              <Text style={styles.tripDetails}>
                {trip.miles} miles • ${trip.grossEarnings}
              </Text>
              <Text style={styles.tripTime}>
                {trip.startTime} - {trip.endTime}
              </Text>
            </View>
          ))
        )}
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
    paddingBottom: 100, // Account for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
  },
  tripCard: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#333',
    borderWidth: 1,
  },
  tripDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  tripDetails: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  tripTime: {
    fontSize: 12,
    color: '#888',
  },
});