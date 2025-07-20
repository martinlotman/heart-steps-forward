import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { therapeuticGoalsService, TherapeuticGoal, defaultTherapeuticGoals } from '@/services/therapeuticGoalsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditingGoal {
  id: string;
  target_value: string;
}

const TherapeuticGoalsTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<TherapeuticGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState<EditingGoal | null>(null);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Loading therapeutic goals for user:', user.id);
      const userGoals = await therapeuticGoalsService.initializeDefaultGoals(user.id);
      console.log('Loaded goals:', userGoals.length);
      setGoals(userGoals);
    } catch (error) {
      console.error('Error loading therapeutic goals:', error);
      toast({
        title: "Error",
        description: "Failed to load therapeutic goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal: TherapeuticGoal) => {
    setEditingGoal({
      id: goal.id,
      target_value: goal.target_value
    });
  };

  const handleSave = async () => {
    if (!editingGoal) return;

    try {
      console.log('Saving therapeutic goal:', editingGoal.id, 'with value:', editingGoal.target_value);
      const updatedGoal = await therapeuticGoalsService.updateTherapeuticGoal(editingGoal.id, {
        target_value: editingGoal.target_value
      });

      // Update the local state with the saved goal
      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal.id === updatedGoal.id ? updatedGoal : goal
        )
      );

      setEditingGoal(null);
      console.log('Therapeutic goal saved successfully');
      toast({
        title: "Success",
        description: "Your therapeutic goal has been saved and will persist across sessions",
      });
    } catch (error) {
      console.error('Error updating therapeutic goal:', error);
      toast({
        title: "Error",
        description: "Failed to save therapeutic goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingGoal(null);
  };

  const getDisplayName = (goalType: string) => {
    const defaultGoal = defaultTherapeuticGoals.find(g => g.goal_type === goalType);
    return defaultGoal?.display_name || goalType;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Therapeutic Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 ml-4">Loading therapeutic goals...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Therapeutic Goals</CardTitle>
        <p className="text-sm text-gray-600">Set and track your health targets. You can edit these values to match your personal goals.</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Health Parameter</TableHead>
              <TableHead>Target Value</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.id}>
                <TableCell className="font-medium">
                  {getDisplayName(goal.goal_type)}
                </TableCell>
                <TableCell>
                  {editingGoal?.id === goal.id ? (
                    <Input
                      value={editingGoal.target_value}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          target_value: e.target.value
                        })
                      }
                      className="w-32"
                    />
                  ) : (
                    goal.target_value
                  )}
                </TableCell>
                <TableCell>{goal.unit}</TableCell>
                <TableCell>
                  {editingGoal?.id === goal.id ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleSave}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancel}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(goal)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TherapeuticGoalsTable;