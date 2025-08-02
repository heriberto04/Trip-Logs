import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTrips } from '../contexts/trips-context';
import { useSettings } from '../contexts/settings-context';

export default function SummaryScreen() {
  const { trips } = useTrips();
  const { settings } = useSettings();

  // Basic calculations for current year
  const currentYear = new Date().getFullYear();
  const currentYearTrips = trips.filter(trip => 
    new Date(trip.date).getFullYear() === currentYear
  );

  const totalMiles = currentYearTrips.reduce((sum, trip) => sum + trip.miles, 0);
  const totalEarnings = currentYearTrips.reduce((sum, trip) => sum + trip.grossEarnings, 0);
  const totalExpenses = currentYearTrips.reduce((sum, trip) => 
    sum + trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food, 0
  );
  const netEarnings = totalEarnings - totalExpenses;
  const taxDeduction = totalMiles * settings.deductionRate;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{currentYear} Summary</Text>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{currentYearTrips.length}</Text>
            <Text style={styles.summaryLabel}>Total Trips</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalMiles.toFixed(1)}</Text>
            <Text style={styles.summaryLabel}>Miles Driven</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>${totalEarnings.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>${netEarnings.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Net Earnings</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>${taxDeduction.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Tax Deduction</Text>
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
    borderColor: '#333',
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});