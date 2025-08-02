import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTrips } from '../contexts/TripsContext';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
  </View>
);

export const SummaryScreen: React.FC = () => {
  const { trips } = useTrips();

  const summary = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentYearTrips = trips.filter(
      trip => new Date(trip.date).getFullYear() === currentYear
    );

    const totalMiles = currentYearTrips.reduce((sum, trip) => sum + trip.miles, 0);
    const totalEarnings = currentYearTrips.reduce((sum, trip) => sum + trip.grossEarnings, 0);
    const totalExpenses = currentYearTrips.reduce((sum, trip) => {
      return sum + trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
    }, 0);
    const netEarnings = totalEarnings - totalExpenses;

    return {
      year: currentYear,
      tripCount: currentYearTrips.length,
      totalMiles,
      totalEarnings,
      totalExpenses,
      netEarnings,
    };
  }, [trips]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Summary ({summary.year})</Text>
      
      <View style={styles.grid}>
        <SummaryCard
          title="Total Trips"
          value={summary.tripCount.toString()}
          subtitle="this year"
        />
        
        <SummaryCard
          title="Total Miles"
          value={summary.totalMiles.toFixed(1)}
          subtitle="driven"
        />
        
        <SummaryCard
          title="Total Earnings"
          value={`$${summary.totalEarnings.toFixed(2)}`}
          subtitle="gross income"
        />
        
        <SummaryCard
          title="Total Expenses"
          value={`$${summary.totalExpenses.toFixed(2)}`}
          subtitle="gas, tolls, food"
        />
        
        <SummaryCard
          title="Net Earnings"
          value={`$${summary.netEarnings.toFixed(2)}`}
          subtitle="after expenses"
        />
        
        <SummaryCard
          title="Average per Trip"
          value={summary.tripCount > 0 ? `$${(summary.netEarnings / summary.tripCount).toFixed(2)}` : '$0.00'}
          subtitle="net per trip"
        />
      </View>
      
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Average miles per trip:</Text>
          <Text style={styles.statValue}>
            {summary.tripCount > 0 ? (summary.totalMiles / summary.tripCount).toFixed(1) : '0.0'}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Average earnings per mile:</Text>
          <Text style={styles.statValue}>
            {summary.totalMiles > 0 ? `$${(summary.totalEarnings / summary.totalMiles).toFixed(2)}` : '$0.00'}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Expense ratio:</Text>
          <Text style={styles.statValue}>
            {summary.totalEarnings > 0 ? `${((summary.totalExpenses / summary.totalEarnings) * 100).toFixed(1)}%` : '0.0%'}
          </Text>
        </View>
      </View>
    </ScrollView>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  detailsSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});