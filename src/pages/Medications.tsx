
import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, BellOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import MedicationCard from '@/components/MedicationCard';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { NotificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  notificationsEnabled: boolean;
}

const Medications = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: 'Metoprolol', dosage: '50mg', time: '8:00 AM', taken: false, notificationsEnabled: false },
    { id: 2, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: true, notificationsEnabled: false },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false, notificationsEnabled: false },
    { id: 4, name: 'Aspirin', dosage: '81mg', time: '8:00 AM', taken: true, notificationsEnabled: false },
  ]);

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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">My Medications</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Today's Schedule</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 font-medium">
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
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-500'
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
      </div>

      <Navigation />
    </div>
  );
};

export default Medications;
