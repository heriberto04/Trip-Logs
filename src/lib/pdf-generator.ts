
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { UserInfo, Trip, AppSettings, Vehicle, OdometerReading } from './types';
import { calculateDuration, formatCurrency } from './utils';
import { format } from 'date-fns';

// Extend the jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

type TimelineItem = (Trip & { type: 'trip' }) | (OdometerReading & { type: 'odometer' });


export async function generatePdf(
  userInfo: UserInfo,
  trips: Trip[],
  odometerReadings: OdometerReading[],
  settings: AppSettings,
  vehicles: Vehicle[],
  year: string
) {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const fileName = `Trip_Logs_Report_${year}.pdf`;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Trip Logs', 14, 22);
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
    `Country: ${userInfo.country || 'N/A'}`,
    `Zip Code: ${userInfo.zipCode || 'N/A'}`,
  ].join('\n');
  doc.text(userInfoText, 14, 52);

  // Summary
  const summaryData = trips.reduce((acc, trip) => {
      const totalExpenses = trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
      acc.totalMiles += trip.miles;
      acc.grossEarnings += trip.grossEarnings;
      acc.totalExpenses += totalExpenses;
      return acc;
  }, { totalMiles: 0, grossEarnings: 0, totalExpenses: 0 });

  const totalDeductions = summaryData.totalMiles * settings.deductionRate;
  const netEarnings = summaryData.grossEarnings - summaryData.totalExpenses;

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
          ['Total Net', formatCurrency(netEarnings, settings.currency)],
          ['Tax Deduction Rate', `${formatCurrency(settings.deductionRate, settings.currency)} / ${settings.unit.slice(0, -1)}`],
          ['Total Tax Deduction', formatCurrency(totalDeductions, settings.currency)],
      ],
      theme: 'striped',
  });

  // Data Log Table
  const timelineItems: TimelineItem[] = [
    ...trips.map(t => ({ ...t, type: 'trip' as const })),
    ...odometerReadings.map(r => ({ ...r, type: 'odometer' as const }))
  ];

  const sortedItems = timelineItems.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tableBody = sortedItems.map(item => {
    const itemDate = new Date(item.date);
    const formattedDate = format(new Date(itemDate.getTime() + itemDate.getTimezoneOffset() * 60000), 'yyyy-MM-dd');
    const vehicle = vehicles.find(v => v.id === item.vehicleId);
    
    if (item.type === 'trip') {
      const duration = calculateDuration(item.startTime, item.endTime);
      return [
        formattedDate,
        `${Math.floor(duration / 60)}h ${duration % 60}m`,
        item.miles,
        formatCurrency(item.grossEarnings, settings.currency),
        formatCurrency(item.expenses.gasoline, settings.currency),
        formatCurrency(item.expenses.tolls, settings.currency),
        formatCurrency(item.expenses.food, settings.currency),
        vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'N/A',
      ];
    } else { // Odometer reading
      const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'N/A';
      const odometerText = `Odometer Update: ${item.odometer.toLocaleString()} for ${vehicleName}`;
      return [
        formattedDate,
        { content: odometerText, colSpan: 7, styles: { fontStyle: 'italic', textColor: [100, 100, 100]} },
      ];
    }
  });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const finalY = (doc as any).lastAutoTable.finalY || 130;
  doc.text('Data Log', 14, finalY + 15);
  doc.autoTable({
    startY: finalY + 20,
    head: [['Date', 'Duration', 'Distance', 'Gross', 'Gasoline', 'Tolls', 'Food', 'Vehicle']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fontSize: 8,
    },
    bodyStyles: {
        fontSize: 8,
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    doc.text(`Trip Logs Report © ${year}`, 14, doc.internal.pageSize.height - 10);
  }

  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        title: `Trip Logs Report ${year}`,
        text: `Here is your trip log report for ${year}.`,
        files: [pdfFile],
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      // Fallback to download if sharing fails
      doc.save(fileName);
    }
  } else {
    // Fallback for browsers that don't support Web Share API for files
    doc.save(fileName);
  }
}
