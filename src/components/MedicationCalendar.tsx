
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { Clock } from 'lucide-react';

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

interface MedicationCalendarProps {
  medications: Medication[];
}

const MedicationCalendar = ({ medications }: MedicationCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get medications for the selected date
  const getMedicationsForDate = (date: Date) => {
    return medications.filter(med => {
      if (!med.startDate) return true; // Show all medications without start date
      
      // For now, show all medications that started before or on the selected date
      return med.startDate <= date;
    });
  };

  const selectedDateMedications = getMedicationsForDate(selectedDate);

  // Get dates that have medications scheduled
  const getDatesWithMedications = () => {
    const dates: Date[] = [];
    medications.forEach(med => {
      if (med.startDate) {
        dates.push(med.startDate);
      }
    });
    return dates;
  };

  const medicationDates = getDatesWithMedications();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medication Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border pointer-events-auto"
            modifiers={{
              hasMedications: medicationDates,
            }}
            modifiersClassNames={{
              hasMedications: "bg-blue-100 text-blue-900 font-semibold",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Medications for {format(selectedDate, 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateMedications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No medications scheduled for this date
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateMedications.map((medication) => (
                <div
                  key={medication.id}
                  className={`p-3 rounded-lg border ${
                    medication.taken
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {medication.name}
                      </h4>
                      <p className="text-sm text-gray-600">{medication.dosage}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {medication.time}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={medication.taken ? "default" : "secondary"}
                        className={medication.taken ? "bg-green-600" : ""}
                      >
                        {medication.taken ? "Taken" : "Pending"}
                      </Badge>
                      {medication.frequency && (
                        <Badge variant="outline" className="text-xs">
                          {medication.frequency}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationCalendar;
