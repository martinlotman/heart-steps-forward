
import { useState } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddMedicationDialogProps {
  onAddMedication: (medication: {
    name: string;
    dosage: string;
    time: string;
    startDate: Date;
    frequency: string;
  }) => void;
}

const AddMedicationDialog = ({ onAddMedication }: AddMedicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['']);

  const form = useForm({
    defaultValues: {
      name: '',
      dosage: '',
      frequency: 'daily',
    },
  });

  const addTimeSlot = () => {
    setSelectedTimes([...selectedTimes, '']);
  };

  const removeTimeSlot = (index: number) => {
    if (selectedTimes.length > 1) {
      setSelectedTimes(selectedTimes.filter((_, i) => i !== index));
    }
  };

  const updateTime = (index: number, time: string) => {
    const newTimes = [...selectedTimes];
    newTimes[index] = time;
    setSelectedTimes(newTimes);
  };

  const handleSubmit = (data: any) => {
    if (!selectedDate) return;
    
    selectedTimes.forEach((time) => {
      if (time) {
        onAddMedication({
          name: data.name,
          dosage: data.dosage,
          time: time,
          startDate: selectedDate,
          frequency: data.frequency,
        });
      }
    });

    form.reset();
    setSelectedDate(undefined);
    setSelectedTimes(['']);
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
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded-md">
                      <option value="daily">Daily</option>
                      <option value="twice-daily">Twice Daily</option>
                      <option value="three-times">Three Times Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
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
              <label className="text-sm font-medium mb-2 block">Times</label>
              {selectedTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Clock className="text-gray-400" size={16} />
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(index, e.target.value)}
                    className="flex-1"
                  />
                  {selectedTimes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTimeSlot(index)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
                className="w-full"
              >
                <Plus size={16} className="mr-1" />
                Add Time
              </Button>
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
