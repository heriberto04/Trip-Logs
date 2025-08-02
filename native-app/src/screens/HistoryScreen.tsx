import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTrips } from '../contexts/trips-context';

export default function HistoryScreen() {
  const { trips } = useTrips();

  // Group trips by year
  const tripsByYear = trips.reduce((acc, trip) => {
    const year = new Date(trip.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(trip);
    return acc;
  }, {} as Record<number, typeof trips>);

  const years = Object.keys(tripsByYear)
    .map(Number)
    .sort((a, b) => b - a); // Most recent first

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Trip History</Text>
        
        {years.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No trip history available.</Text>
            <Text style={styles.emptySubtext}>Start logging trips to see your history here.</Text>
          </View>
        ) : (
          years.map(year => {
            const yearTrips = tripsByYear[year];
            const totalMiles = yearTrips.reduce((sum, trip) => sum + trip.miles, 0);
            const totalEarnings = yearTrips.reduce((sum, trip) => sum + trip.grossEarnings, 0);
            
            return (
              <View key={year} style={styles.yearSection}>
                <Text style={styles.yearHeader}>{year}</Text>
                <View style={styles.yearSummary}>
                  <Text style={styles.yearStats}>
                    {yearTrips.length} trips • {totalMiles.toFixed(1)} miles • ${totalEarnings.toFixed(2)}
                  </Text>
                </View>
                
                {yearTrips
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5) // Show only first 5 trips
                  .map(trip => (
                    <View key={trip.id} style={styles.tripCard}>
                      <Text style={styles.tripDate}>{trip.date}</Text>
                      <Text style={styles.tripDetails}>
                        {trip.miles} miles • ${trip.grossEarnings}
                      </Text>
                    </View>
                  ))}
                
                {yearTrips.length > 5 && (
                  <Text style={styles.moreText}>
                    +{yearTrips.length - 5} more trips
                  </Text>
                )}
              </View>
            );
          })
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
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
  yearSection: {
    marginBottom: 30,
  },
  yearHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  yearSummary: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#333',
    borderWidth: 1,
  },
  yearStats: {
    fontSize: 14,
    color: '#ccc',
  },
  tripCard: {
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: '#222',
    borderWidth: 1,
  },
  tripDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  tripDetails: {
    fontSize: 12,
    color: '#999',
  },
  moreText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});