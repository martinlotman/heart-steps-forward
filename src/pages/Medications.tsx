import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, BellOff, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import MedicationCard from '@/components/MedicationCard';
import AddMedicationDialog from '@/components/AddMedicationDialog';
import MedicationCalendar from '@/components/MedicationCalendar';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  notificationsEnabled: boolean;
  startDate?: Date;
  frequency?: string;
}

const Medications = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: 'Metoprolol', dosage: '50mg', time: '8:00 AM', taken: false, notificationsEnabled: false },
    { id: 2, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: true, notificationsEnabled: false },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false, notificationsEnabled: false },
    { id: 4, name: 'Aspirin', dosage: '81mg', time: '8:00 AM', taken: true, notificationsEnabled: false },
  ]);

  const handleAddMedication = (newMed: {
    name: string;
    dosage: string;
    time: string;
    startDate: Date;
    frequency: string;
  }) => {
    const medication: Medication = {
      id: Date.now(), // Simple ID generation
      name: newMed.name,
      dosage: newMed.dosage,
      time: newMed.time,
      taken: false,
      notificationsEnabled: false,
      startDate: newMed.startDate,
      frequency: newMed.frequency,
    };

    setMedications(prev => [...prev, medication]);
    
    toast({
      title: "Medication added",
      description: `${newMed.name} has been scheduled for ${newMed.time}`,
    });
  };

  const handleMarkTaken = (id: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, taken: true } : med
      )
    );
  };

  const handleToggleNotifications = async (id: number) => {
    const medication = medications.find(med => med.id === id);
    if (!medication) return;

    try {
      if (medication.notificationsEnabled) {
        await NotificationService.cancelMedicationReminder(id);
        toast({
          title: "Notifications disabled",
          description: `Reminders turned off for ${medication.name}`,
        });
      } else {
        const success = await NotificationService.scheduleMedicationReminder({
          id: medication.id,
          medicationName: medication.name,
          time: medication.time,
          dosage: medication.dosage
        });

        if (success) {
          toast({
            title: "Notifications enabled",
            description: `Daily reminders set for ${medication.name} at ${medication.time}`,
          });
        } else {
          toast({
            title: "Permission required",
            description: "Please enable notifications in your device settings",
            variant: "destructive"
          });
          return;
        }
      }

      setMedications(prev => 
        prev.map(med => 
          med.id === id ? { ...med, notificationsEnabled: !med.notificationsEnabled } : med
        )
      );
    } catch (error) {
      console.error('Error managing notifications:', error);
      toast({
        title: "Error",
        description: "Failed to manage notification settings",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-20">
      <div className="bg-background shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-muted-foreground" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-foreground">My Medications</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <AddMedicationDialog onAddMedication={handleAddMedication} />

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Today's Meds</TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2" size={16} />
              Calendar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Today's Schedule</p>
              <div className="bg-accent p-4 rounded-lg">
                <p className="text-primary font-medium">
                  {medications.filter(med => med.taken).length} of {medications.length} medications taken
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {medications.map(medication => (
                <div key={medication.id} className="relative">
                  <MedicationCard
                    name={medication.name}
                    dosage={medication.dosage}
                    time={medication.time}
                    taken={medication.taken}
                    onMarkTaken={() => handleMarkTaken(medication.id)}
                  />
                  <Button
                    onClick={() => handleToggleNotifications(medication.id)}
                    variant="outline"
                    size="sm"
                    className={`absolute top-3 right-3 ${
                      medication.notificationsEnabled 
                        ? 'bg-accent border-primary text-primary' 
                        : 'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    {medication.notificationsEnabled ? (
                      <Bell size={16} />
                    ) : (
                      <BellOff size={16} />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <MedicationCalendar medications={medications} />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default Medications;
