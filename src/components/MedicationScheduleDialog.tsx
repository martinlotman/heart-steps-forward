
import { useState } from 'react';
import { Clock, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface MedicationScheduleDialogProps {
  medication: Medication;
  onUpdateMedication: (id: number, newTime: string) => void;
  children: React.ReactNode;
}

const MedicationScheduleDialog = ({ 
  medication, 
  onUpdateMedication, 
  children 
}: MedicationScheduleDialogProps) => {
  const { toast } = useToast();
  const [newTime, setNewTime] = useState(medication.time);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onUpdateMedication(medication.id, newTime);
    toast({
      title: "Schedule updated",
      description: `${medication.name} time changed to ${newTime}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock size={20} />
            Edit Medication Schedule
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">{medication.name}</h4>
            <p className="text-sm text-gray-600">{medication.dosage}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={newTime.replace(/\s?(AM|PM)$/i, '')}
              onChange={(e) => {
                const time = e.target.value;
                const [hours, minutes] = time.split(':');
                const hour12 = parseInt(hours) === 0 ? 12 : 
                              parseInt(hours) > 12 ? parseInt(hours) - 12 : 
                              parseInt(hours);
                const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
                setNewTime(`${hour12}:${minutes} ${period}`);
              }}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save size={16} className="mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationScheduleDialog;
