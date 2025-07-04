
import { useState } from 'react';
import { Check, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const DailyMedTask = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: 'Metoprolol', dosage: '50mg', time: '8:00 AM', taken: false },
    { id: 2, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: false },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false },
    { id: 4, name: 'Aspirin', dosage: '81mg', time: '8:00 AM', taken: false },
  ]);

  const handleMarkTaken = (id: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, taken: true } : med
      )
    );
    
    const medication = medications.find(med => med.id === id);
    toast({
      title: "Medication marked taken",
      description: `${medication?.name} has been logged for today`,
    });
  };

  const completedCount = medications.filter(med => med.taken).length;
  const totalCount = medications.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Medication Task</h2>
        <p className="text-gray-600">Mark all medications as taken</p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 font-medium">
            {completedCount} of {totalCount} medications taken today
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {medications.map(medication => (
          <Card key={medication.id} className={medication.taken ? 'bg-green-50 border-green-200' : 'bg-white'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    medication.taken ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    {medication.taken ? (
                      <Check className="text-white" size={20} />
                    ) : (
                      <Clock className="text-gray-500" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{medication.name}</h3>
                    <p className="text-sm text-gray-600">{medication.dosage} at {medication.time}</p>
                  </div>
                </div>
                {!medication.taken && (
                  <Button 
                    onClick={() => handleMarkTaken(medication.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Mark Taken
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyMedTask;
