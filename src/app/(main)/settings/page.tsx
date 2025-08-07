
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, PlusCircle, Upload, Download, FileUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUserInfo } from '@/contexts/user-info-context';
import { useVehicles } from '@/contexts/vehicles-context';
import { useSettings } from '@/contexts/settings-context';
import { useTrips } from '@/contexts/trips-context';
import { useOdometer } from '@/contexts/odometer-context';
import { generatePdf } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AddVehicleDialog = dynamic(() => import('@/components/add-vehicle-dialog').then(mod => mod.AddVehicleDialog));

export default function SettingsPage() {
  const { userInfo, setUserInfo, importUserInfo } = useUserInfo();
  const { vehicles, deleteVehicle, importVehicles } = useVehicles();
  const { settings, setSettings, importSettings } = useSettings();
  const { trips, importTrips } = useTrips();
  const { odometerReadings, importOdometerReadings } = useOdometer();
  const { toast } = useToast();

  const [isAddVehicleOpen, setIsAddVehicleOpen] = React.useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = React.useState(false);
  const [fileToImport, setFileToImport] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [exportYear, setExportYear] = React.useState<string>(new Date().getFullYear().toString());

  const availableYears = React.useMemo(() => {
    const tripYears = trips.map(t => new Date(t.date).getFullYear().toString());
    const odometerYears = odometerReadings.map(r => new Date(r.date).getFullYear().toString());
    const years = new Set([...tripYears, ...odometerYears]);
    return Array.from(years).sort((a,b) => Number(b) - Number(a));
  }, [trips, odometerReadings]);

  const handleExport = async () => {
    const yearTrips = trips.filter(t => new Date(t.date).getFullYear().toString() === exportYear);
    const yearOdometerReadings = odometerReadings.filter(r => new Date(r.date).getFullYear().toString() === exportYear);

    if(yearTrips.length === 0 && yearOdometerReadings.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: `No data found for the year ${exportYear}.`,
      });
      return;
    }
    const result = await generatePdf(userInfo, yearTrips, yearOdometerReadings, settings, vehicles, exportYear);
    
    if (result.success) {
        toast({
            title: "PDF Exported",
            description: `Your report for ${exportYear} has been generated.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: result.error || "Could not generate the PDF.",
        });
    }
  };

  const handleExportAllData = async () => {
    const allData = {
      userInfo,
      vehicles,
      settings,
      trips,
      odometerReadings
    };
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = `trip-logs-backup-${new Date().toISOString().split('T')[0]}.json`;
    const file = new File([blob], fileName, { type: 'application/json' });

    const downloadData = () => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({
          title: "Data Exported",
          description: "All your data has been saved to a JSON file.",
        });
    }

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: "Trip Logs Backup",
                files: [file],
            });
            toast({
              title: "Data Exported",
              description: "Your backup file has been shared.",
            });
        } catch (error) {
            console.error('Error sharing data:', error);
            // Fallback to download if sharing fails
            downloadData();
        }
    } else {
        // Fallback for browsers that don't support Web Share API for files
        downloadData();
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileToImport(file);
      setIsImportConfirmOpen(true);
    }
  };
  
  const handleConfirmImport = () => {
    if (!fileToImport) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File is not valid text");
        }
        const data = JSON.parse(text);
        
        // Basic validation
        if (data.userInfo && data.vehicles && data.settings && data.trips && data.odometerReadings) {
          importUserInfo(data.userInfo);
          importVehicles(data.vehicles);
          importSettings(data.settings);
          importTrips(data.trips);
          importOdometerReadings(data.odometerReadings);
          
          toast({
            title: "Import Successful",
            description: "Your data has been restored from the backup file.",
          });
        } else {
          throw new Error("Invalid backup file format.");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Could not read or parse the file.",
        });
      } finally {
        setIsImportConfirmOpen(false);
        setFileToImport(null);
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = () => {
       toast({
          variant: "destructive",
          title: "Import Failed",
          description: "There was an error reading the file.",
        });
    }
    reader.readAsText(fileToImport);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      
      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['user-info']}>
        {/* User Information */}
        <AccordionItem value="user-info" className="border-b-0">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-card rounded-lg">User Information</AccordionTrigger>
          <AccordionContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={userInfo.name} onChange={e => setUserInfo(prev => ({...prev, name: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={userInfo.address} onChange={e => setUserInfo(prev => ({...prev, address: e.target.value}))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cityState">City/State</Label>
                <Input id="cityState" value={userInfo.cityState} onChange={e => setUserInfo(prev => ({...prev, cityState: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" value={userInfo.zipCode} onChange={e => setUserInfo(prev => ({...prev, zipCode: e.target.value}))} />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={userInfo.country} onChange={e => setUserInfo(prev => ({...prev, country: e.target.value}))} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Vehicles */}
        <AccordionItem value="vehicles" className="border-b-0">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-card rounded-lg">Vehicles</AccordionTrigger>
          <AccordionContent className="p-4 space-y-4">
            {vehicles.map(v => (
              <Card key={v.id}>
                <CardContent className="p-3 flex justify-between items-center">
                  <p>{v.year} {v.make} {v.model}</p>
                  <Button variant="ghost" size="icon" onClick={() => deleteVehicle(v.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={() => setIsAddVehicleOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </AccordionContent>
        </AccordionItem>
        
        {/* Export / Import Data */}
        <AccordionItem value="data-export-import" className="border-b-0">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-card rounded-lg">Data Management</AccordionTrigger>
           <AccordionContent className="p-4 space-y-4">
             <div className="space-y-2">
               <Label>Export PDF Report</Label>
                <div className="flex gap-2">
                  <Select value={exportYear} onValueChange={setExportYear}>
                      <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                          {availableYears.map(year => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <Button onClick={handleExport} disabled={availableYears.length === 0} className="w-48">
                      <Upload className="mr-2 h-4 w-4"/>
                      Export PDF
                  </Button>
                </div>
             </div>
             <div className="space-y-2">
                <Label>Backup & Restore</Label>
                <div className="flex gap-2">
                  <Button onClick={handleExportAllData} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4"/> Export All Data
                  </Button>
                  <Button onClick={handleImportClick} variant="outline" className="w-full">
                    <FileUp className="mr-2 h-4 w-4"/> Import Data
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="application/json"
                  />
                </div>
             </div>
          </AccordionContent>
        </AccordionItem>

        {/* App Settings */}
        <AccordionItem value="app-settings" className="border-b-0">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-card rounded-lg">App Settings</AccordionTrigger>
          <AccordionContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Unit</Label>
              <div className="flex items-center gap-2">
                <span>Miles</span>
                <Switch
                  checked={settings.unit === 'kilometers'}
                  onCheckedChange={checked => setSettings(prev => ({ ...prev, unit: checked ? 'kilometers' : 'miles' }))}
                />
                <span>Kilometers</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Currency</Label>
              <Input className="w-24" value={settings.currency} onChange={e => setSettings(prev => ({ ...prev, currency: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label>Tax Deduction per {settings.unit === 'miles' ? 'Mile' : 'Kilometer'}</Label>
              <Input type="number" step="0.01" value={settings.deductionRate} onChange={e => setSettings(prev => ({ ...prev, deductionRate: parseFloat(e.target.value) || 0 }))} />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* About */}
        <AccordionItem value="about" className="border-b-0">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-card rounded-lg">About Trip Logs</AccordionTrigger>
          <AccordionContent className="p-4 space-y-4 text-muted-foreground">
            <h3 className="font-semibold text-foreground">App Description</h3>
            <p>Trip Logs is a comprehensive yet intuitive application designed for drivers who need to meticulously track their trips for business and tax purposes. Log every journey with details on earnings, expenses, and mileage, and let the app provide you with powerful summaries and automated calculations to maximize your deductions and understand your profitability.</p>
            <h3 className="font-semibold text-foreground">Privacy Statement</h3>
            <p>Your privacy is our utmost priority. All the information you enter into Trip Logs, including your personal details, vehicle information, and trip logs, is stored exclusively on your local device. We do not have access to your data, and it is never transmitted to any external servers. You are in complete control of your information at all times.</p>
            <h3 className="font-semibold text-foreground">User Agreement</h3>
            <p>By using Trip Logs, you agree that you are responsible for the accuracy of the data you enter. The calculations provided by the app are for informational purposes and should be verified with a professional tax advisor. The developers of Trip Logs are not liable for any financial decisions or tax filings made based on the information provided by this application.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <p className="text-center text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} Trip Logs. All rights reserved.
      </p>

      <div className="flex justify-center mt-4">
        <Image src="/icon.png" alt="Trip Logs Logo" width={256} height={256} className="w-32 h-32" />
      </div>

      {isAddVehicleOpen && (
        <AddVehicleDialog isOpen={isAddVehicleOpen} setIsOpen={setIsAddVehicleOpen} />
      )}
      
       <AlertDialog open={isImportConfirmOpen} onOpenChange={setIsImportConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to import data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite all your current data. This action cannot be undone. Please ensure you have a backup of your current data if you wish to keep it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              if(fileInputRef.current) fileInputRef.current.value = "";
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>Import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
