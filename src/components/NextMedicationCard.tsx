
import { Check, Clock, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MedicationScheduleDialog from './MedicationScheduleDialog';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  timeUntil?: string;
}

interface NextMedicationCardProps {
  nextMedication: Medication | null;
  onMarkTaken: (id: number) => void;
  onUpdateMedication: (id: number, newTime: string) => void;
}

const NextMedicationCard = ({ 
  nextMedication, 
  onMarkTaken, 
  onUpdateMedication 
}: NextMedicationCardProps) => {
  if (!nextMedication) {
    return (
      <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-green-800">
            Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-green-700">
            <Check className="mr-2" size={20} />
            <span className="font-medium">All medications taken for today! 🎉</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-l-4 border-l-orange-500 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-orange-800 flex items-center justify-between">
          Next Medication
          <MedicationScheduleDialog
            medication={nextMedication}
            onUpdateMedication={onUpdateMedication}
          >
            <Button variant="outline" size="sm" className="bg-white border-orange-200 text-orange-700 hover:bg-orange-100">
              <Settings size={16} className="mr-1" />
              Schedule
            </Button>
          </MedicationScheduleDialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-gray-800">{nextMedication.name}</p>
            <p className="text-sm text-gray-600">{nextMedication.dosage}</p>
            <div className="flex items-center text-sm text-orange-600 font-medium mt-1">
              <Clock size={14} className="mr-1" />
              Due at {nextMedication.time}
              {nextMedication.timeUntil !== 'Now' && (
                <span className="ml-2">• In {nextMedication.timeUntil}</span>
              )}
            </div>
          </div>
          <Button 
            onClick={() => onMarkTaken(nextMedication.id)}
            className="bg-orange-600 hover:bg-orange-700 text-white ml-4"
          >
            <Check size={16} className="mr-1" />
            Mark Taken
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextMedicationCard;
