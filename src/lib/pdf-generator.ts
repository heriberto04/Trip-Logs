import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { UserInfo, Trip, AppSettings, Vehicle } from './types';
import { calculateDuration, formatCurrency } from './utils';
import { format } from 'date-fns';

// Extend the jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export function generatePdf(
  userInfo: UserInfo,
  trips: Trip[],
  settings: AppSettings,
  vehicles: Vehicle[],
  year: string
) {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('DriveTrack Pro', 14, 22);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Yearly Driving Report: ${year}`, 14, 30);
  
  // User Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('User Information', 14, 45);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const userInfoText = [
    `Name: ${userInfo.name || 'N/A'}`,
    `Address: ${userInfo.address || 'N/A'}`,
    `City/State: ${userInfo.cityState || 'N/A'}`,
    `Zip Code: ${userInfo.zipCode || 'N/A'}`,
    `Country: ${userInfo.country || 'N/A'}`,
  ].join('\n');
  doc.text(userInfoText, 14, 52);

  // Summary
  const summaryData = trips.reduce((acc, trip) => {
      const durationMinutes = calculateDuration(trip.startTime, trip.endTime);
      const totalExpenses = trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
      acc.totalMiles += trip.miles;
      acc.grossEarnings += trip.grossEarnings;
      acc.totalExpenses += totalExpenses;
      return acc;
  }, { totalMiles: 0, grossEarnings: 0, totalExpenses: 0 });

  const totalDeductions = summaryData.totalMiles * settings.deductionRate;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Summary', 14, 80);
  doc.autoTable({
      startY: 85,
      head: [['Metric', 'Value']],
      body: [
          [`Total ${settings.unit === 'miles' ? 'Miles' : 'Kilometers'} Driven`, summaryData.totalMiles.toFixed(1)],
          ['Gross Earnings', formatCurrency(summaryData.grossEarnings, settings.currency)],
          ['Total Expenses', formatCurrency(summaryData.totalExpenses, settings.currency)],
          ['Tax Deduction Rate', `${formatCurrency(settings.deductionRate, settings.currency)} / ${settings.unit.slice(0, -1)}`],
          ['Total Tax Deduction', formatCurrency(totalDeductions, settings.currency)],
      ],
      theme: 'striped',
  });

  // Trip Details Table
  const tableBody = trips.map(trip => {
    const duration = calculateDuration(trip.startTime, trip.endTime);
    const expenses = trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const tripDate = new Date(trip.date);
    const formattedDate = format(new Date(tripDate.getTime() + tripDate.getTimezoneOffset() * 60000), 'yyyy-MM-dd');


    return [
      formattedDate,
      `${Math.floor(duration / 60)}h ${duration % 60}m`,
      trip.miles,
      formatCurrency(trip.grossEarnings, settings.currency),
      formatCurrency(expenses, settings.currency),
      vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A',
    ];
  });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const finalY = (doc as any).lastAutoTable.finalY || 130;
  doc.text('Trip Log', 14, finalY + 15);
  doc.autoTable({
    startY: finalY + 20,
    head: [['Date', 'Duration', 'Distance', 'Gross', 'Expenses', 'Vehicle']],
    body: tableBody,
    theme: 'grid',
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    doc.text(`DriveTrack Pro Report © ${year}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`DriveTrack_Pro_Report_${year}.pdf`);
}
