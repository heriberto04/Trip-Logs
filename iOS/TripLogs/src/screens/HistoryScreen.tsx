import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useTrips } from '../contexts/TripsContext';

export const HistoryScreen: React.FC = () => {
  const { trips } = useTrips();

  const yearlyData = useMemo(() => {
    const grouped = trips.reduce((acc, trip) => {
      const year = new Date(trip.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(trip);
      return acc;
    }, {} as Record<number, typeof trips>);

    return Object.entries(grouped)
      .map(([year, yearTrips]) => {
        const totalMiles = yearTrips.reduce((sum, trip) => sum + trip.miles, 0);
        const totalEarnings = yearTrips.reduce((sum, trip) => sum + trip.grossEarnings, 0);
        const totalExpenses = yearTrips.reduce((sum, trip) => {
          return sum + trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
        }, 0);

        return {
          year: parseInt(year, 10),
          tripCount: yearTrips.length,
          totalMiles,
          totalEarnings,
          totalExpenses,
          netEarnings: totalEarnings - totalExpenses,
        };
      })
      .sort((a, b) => b.year - a.year);
  }, [trips]);

  const renderYearItem = ({ item }: { item: typeof yearlyData[0] }) => (
    <View style={styles.yearCard}>
      <View style={styles.yearHeader}>
        <Text style={styles.yearTitle}>{item.year}</Text>
        <Text style={styles.tripCount}>{item.tripCount} trips</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Miles</Text>
          <Text style={styles.statValue}>{item.totalMiles.toFixed(1)}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Earnings</Text>
          <Text style={styles.statValue}>${item.totalEarnings.toFixed(2)}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={styles.statValue}>${item.totalExpenses.toFixed(2)}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Net</Text>
          <Text style={[
            styles.statValue,
            styles.netEarnings,
            item.netEarnings >= 0 ? styles.positiveEarnings : styles.negativeEarnings
          ]}>
            ${item.netEarnings.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (trips.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No trip history found</Text>
        <Text style={styles.emptySubtext}>Start by adding your first trip!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip History</Text>
      
      <FlatList
        data={yearlyData}
        renderItem={renderYearItem}
        keyExtractor={item => item.year.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  yearCard: {
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
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  yearTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tripCount: {
    fontSize: 14,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  netEarnings: {
    // Base style for net earnings
  },
  positiveEarnings: {
    color: '#4CAF50',
  },
  negativeEarnings: {
    color: '#F44336',
  },
});