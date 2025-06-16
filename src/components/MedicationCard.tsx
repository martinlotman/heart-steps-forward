
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MedicationCardProps {
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  onMarkTaken: () => void;
}

const MedicationCard = ({ name, dosage, time, taken, onMarkTaken }: MedicationCardProps) => {
  return (
    <Card className={`mb-4 ${taken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="font-semibold text-gray-800">{name}</span>
          {taken ? (
            <CheckCircle className="text-green-600" size={24} />
          ) : (
            <AlertCircle className="text-orange-500" size={24} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">{dosage}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1" />
              {time}
            </div>
          </div>
          {!taken && (
            <Button 
              onClick={onMarkTaken}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Mark Taken
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
