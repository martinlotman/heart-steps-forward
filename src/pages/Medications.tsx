import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MedicationCard from '@/components/MedicationCard';
import AddMedicationDialog from '@/components/AddMedicationDialog';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  medicationService, 
  MedicationIntake, 
  Medication,
  CreateMedicationData 
} from '@/services/medicationService';

const Medications = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todaysIntakes, setTodaysIntakes] = useState<MedicationIntake[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user's medications and today's intakes
  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const [userMedications, intakes] = await Promise.all([
        medicationService.getUserMedications(user.id),
        medicationService.getTodaysIntakes(user.id)
      ]);
      
      setMedications(userMedications);
      setTodaysIntakes(intakes);
    } catch (error) {
      console.error('Error loading medication data:', error);
      toast({
        title: "Error",
        description: "Failed to load medication data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async (medicationData: CreateMedicationData) => {
    try {
      const newMedication = await medicationService.createMedication(medicationData);
      
      // Generate scheduled intakes for the new medication
      const scheduledIntakes = medicationService.generateScheduledIntakes(newMedication, 7); // 7 days ahead
      
      // Create the scheduled intakes
      await Promise.all(
        scheduledIntakes.map(intake => 
          medicationService.createMedicationIntake(intake)
        )
      );
      
      toast({
        title: "Medication added",
        description: `${medicationData.name} has been added to your medications`,
      });
      
      // Reload data to show new medication and intakes
      await loadData();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive"
      });
    }
  };

  const handleMarkTaken = async (intakeId: string) => {
    try {
      await medicationService.markMedicationTaken(intakeId);
      
      // Update local state
      setTodaysIntakes(prev => 
        prev.map(intake => 
          intake.id === intakeId 
            ? { ...intake, status: 'taken' as const, taken_at: new Date().toISOString() }
            : intake
        )
      );
      
      toast({
        title: "Medication marked as taken",
        description: "Great job staying on track!",
      });
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      toast({
        title: "Error",
        description: "Failed to mark medication as taken",
        variant: "destructive"
      });
    }
  };

  const handleMarkMissed = async (intakeId: string) => {
    try {
      await medicationService.updateIntakeStatus(intakeId, 'missed');
      
      // Update local state
      setTodaysIntakes(prev => 
        prev.map(intake => 
          intake.id === intakeId 
            ? { ...intake, status: 'missed' as const }
            : intake
        )
      );
      
      toast({
        title: "Medication marked as missed",
        description: "Don't worry, try to take your next dose on time",
      });
    } catch (error) {
      console.error('Error marking medication as missed:', error);
      toast({
        title: "Error",
        description: "Failed to update medication status",
        variant: "destructive"
      });
    }
  };

  const calculateAdherence = () => {
    if (todaysIntakes.length === 0) return { taken: 0, total: 0, percentage: 0 };
    
    const taken = todaysIntakes.filter(intake => intake.status === 'taken').length;
    const total = todaysIntakes.length;
    const percentage = Math.round((taken / total) * 100);
    
    return { taken, total, percentage };
  };

  const adherence = calculateAdherence();

  if (loading) {
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
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading medications...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

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
            <TabsTrigger value="medications">My Medications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Today's Schedule</p>
              <div className="bg-accent p-4 rounded-lg">
                <p className="text-primary font-medium">
                  {adherence.taken} of {adherence.total} medications taken
                </p>
                {adherence.total > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {adherence.percentage}% adherence today
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {todaysIntakes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No medications scheduled for today</p>
                  <AddMedicationDialog onAddMedication={handleAddMedication} />
                </div>
              ) : (
                todaysIntakes.map(intake => (
                  <MedicationCard
                    key={intake.id}
                    intake={intake}
                    onMarkTaken={handleMarkTaken}
                    onMarkMissed={handleMarkMissed}
                  />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="medications" className="space-y-4">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">All Medications</p>
              <div className="bg-accent p-4 rounded-lg">
                <p className="text-primary font-medium">
                  {medications.length} active medication{medications.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {medications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No medications added yet</p>
                  <Button onClick={() => {}} className="bg-primary">
                    <Plus className="mr-2" size={16} />
                    Add Your First Medication
                  </Button>
                </div>
              ) : (
                medications.map(medication => (
                  <div key={medication.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{medication.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        medication.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {medication.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">
                      <strong>Dosage:</strong> {medication.dosage}
                    </p>
                    <p className="text-muted-foreground text-sm mb-1">
                      <strong>Frequency:</strong> {medication.frequency}
                    </p>
                    {medication.instructions && (
                      <p className="text-muted-foreground text-sm mb-1">
                        <strong>Instructions:</strong> {medication.instructions}
                      </p>
                    )}
                    {medication.prescribed_by && (
                      <p className="text-muted-foreground text-sm">
                        <strong>Prescribed by:</strong> {medication.prescribed_by}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default Medications;
