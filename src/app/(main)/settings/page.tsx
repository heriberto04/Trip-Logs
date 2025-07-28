
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, PlusCircle, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUserInfo } from '@/contexts/user-info-context';
import { useVehicles } from '@/contexts/vehicles-context';
import { useSettings } from '@/contexts/settings-context';
import { useTrips } from '@/contexts/trips-context';
import { AddVehicleDialog } from '@/components/add-vehicle-dialog';
import { generatePdf } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function SettingsPage() {
  const { userInfo, setUserInfo } = useUserInfo();
  const { vehicles, deleteVehicle } = useVehicles();
  const { settings, setSettings } = useSettings();
  const { trips } = useTrips();
  const { toast } = useToast();

  const [isAddVehicleOpen, setIsAddVehicleOpen] = React.useState(false);
  const [exportYear, setExportYear] = React.useState<string>(new Date().getFullYear().toString());

  const availableYears = React.useMemo(() => {
    const years = new Set(trips.map(t => new Date(t.date).getFullYear().toString()));
    return Array.from(years).sort((a,b) => Number(b) - Number(a));
  }, [trips]);

  const handleExport = async () => {
    const yearData = trips.filter(t => new Date(t.date).getFullYear().toString() === exportYear);
    if(yearData.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: `No trips found for the year ${exportYear}.`,
      });
      return;
    }
    await generatePdf(userInfo, yearData, settings, vehicles, exportYear);
    toast({
        title: "PDF Exported",
        description: `Your report for ${exportYear} has been generated.`,
    });
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      
      <Accordion type="multiple" className="w-full space-y-4">
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

        {/* Export PDF */}
        <AccordionItem value="export-pdf" className="border-b-0">
          <AccordionTrigger className="text-xl font-semibold p-4 bg-card rounded-lg">Export PDF</AccordionTrigger>
          <AccordionContent className="p-4 space-y-4">
            <div className="space-y-2">
                <Label>Select Year</Label>
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
            </div>
            <Button className="w-full" onClick={handleExport} disabled={availableYears.length === 0}>
                <Upload className="mr-2 h-4 w-4"/>
                Export PDF
            </Button>
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
        <Image src="/icon.png" alt="Trip Logs Logo" width={64} height={64} />
      </div>

      <AddVehicleDialog isOpen={isAddVehicleOpen} setIsOpen={setIsAddVehicleOpen} />
    </div>
  );
}
