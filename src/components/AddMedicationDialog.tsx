
import { useState } from 'react';
import { Calendar, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreateMedicationData } from '@/services/medicationService';

interface AddMedicationDialogProps {
  onAddMedication: (medication: CreateMedicationData) => void;
}

const AddMedicationDialog = ({ onAddMedication }: AddMedicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reminderTimes, setReminderTimes] = useState<string[]>(['09:00']);

  const form = useForm({
    defaultValues: {
      name: '',
      dosage: '',
      frequency: 'once daily',
      instructions: '',
      prescribed_by: '',
    },
  });

  const getTimesCountForFrequency = (frequency: string): number => {
    switch (frequency) {
      case 'twice daily':
      case 'every 12 hours':
        return 2;
      case 'three times daily':
      case 'every 8 hours':
        return 3;
      case 'four times daily':
      case 'every 6 hours':
        return 4;
      default:
        return 1;
    }
  };

  const handleFrequencyChange = (frequency: string) => {
    form.setValue('frequency', frequency);
    const timesCount = getTimesCountForFrequency(frequency);
    const newTimes = Array.from({ length: timesCount }, (_, i) => 
      reminderTimes[i] || `${String(9 + i * 4).padStart(2, '0')}:00`
    );
    setReminderTimes(newTimes);
  };

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = time;
    setReminderTimes(newTimes);
  };

  const handleSubmit = (data: any) => {
    if (!selectedDate) return;
    
    const medicationData: CreateMedicationData = {
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      instructions: data.instructions || undefined,
      prescribed_by: data.prescribed_by || undefined,
      start_date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      reminder_times: reminderTimes,
    };

    onAddMedication(medicationData);

    form.reset();
    setSelectedDate(new Date());
    setReminderTimes(['09:00']);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-6 bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2" size={20} />
          Add New Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Aspirin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 81mg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={handleFrequencyChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="once daily">Once Daily</SelectItem>
                      <SelectItem value="twice daily">Twice Daily</SelectItem>
                      <SelectItem value="three times daily">Three Times Daily</SelectItem>
                      <SelectItem value="four times daily">Four Times Daily</SelectItem>
                      <SelectItem value="every 6 hours">Every 6 Hours</SelectItem>
                      <SelectItem value="every 8 hours">Every 8 Hours</SelectItem>
                      <SelectItem value="every 12 hours">Every 12 Hours</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="as needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Take with food, avoid alcohol"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prescribed_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prescribed By (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Reminder Times</label>
              {reminderTimes.map((time, index) => (
                <div key={index} className="mb-2">
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="pl-10"
                      placeholder={`Time ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Add Medication
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationDialog;
