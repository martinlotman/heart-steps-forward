
import { Clock, CheckCircle, AlertCircle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MedicationIntake } from '@/services/medicationService';
import { format } from 'date-fns';

interface MedicationCardProps {
  intake: MedicationIntake;
  onMarkTaken: (intakeId: string) => void;
  onMarkMissed?: (intakeId: string) => void;
  onEditMedication?: (medicationId: string) => void;
}

const MedicationCard = ({ intake, onMarkTaken, onMarkMissed, onEditMedication }: MedicationCardProps) => {
  const isTaken = intake.status === 'taken';
  const isMissed = intake.status === 'missed';
  const scheduledTime = format(new Date(intake.scheduled_time), 'h:mm a');
  
  const getStatusColor = () => {
    switch (intake.status) {
      case 'taken': return 'bg-green-50 border-green-200';
      case 'missed': return 'bg-red-50 border-red-200';
      case 'delayed': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-card border-border';
    }
  };

  const getStatusIcon = () => {
    switch (intake.status) {
      case 'taken': return <CheckCircle className="text-green-600" size={24} />;
      case 'missed': return <AlertCircle className="text-red-500" size={24} />;
      case 'delayed': return <AlertCircle className="text-yellow-500" size={24} />;
      default: return <AlertCircle className="text-amber-500" size={24} />;
    }
  };

  return (
    <Card className={`mb-4 ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="font-semibold text-foreground">
            {intake.medication?.name || 'Unknown Medication'}
          </span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {!isTaken && !isMissed && (
                  <>
                    <DropdownMenuItem onClick={() => onMarkTaken(intake.id)}>
                      Mark as Taken
                    </DropdownMenuItem>
                    {onMarkMissed && (
                      <DropdownMenuItem onClick={() => onMarkMissed(intake.id)}>
                        Mark as Missed
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                {onEditMedication && intake.medication && (
                  <DropdownMenuItem onClick={() => onEditMedication(intake.medication!.id)}>
                    Edit Medication
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mb-1">
              {intake.medication?.dosage || 'Unknown dosage'}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={16} className="mr-1" />
              {scheduledTime}
            </div>
            {intake.medication?.instructions && (
              <p className="text-xs text-muted-foreground mt-1">
                {intake.medication.instructions}
              </p>
            )}
            {intake.taken_at && (
              <p className="text-xs text-green-600 mt-1">
                Taken at {format(new Date(intake.taken_at), 'h:mm a')}
              </p>
            )}
            {intake.notes && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                Note: {intake.notes}
              </p>
            )}
          </div>
          {!isTaken && !isMissed && (
            <Button 
              onClick={() => onMarkTaken(intake.id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
