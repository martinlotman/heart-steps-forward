
import { Link } from 'react-router-dom';
import { Check, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DailyTask {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  completed: boolean;
}

interface DailyTasksListProps {
  tasks: DailyTask[];
  allTasksCompleted: boolean;
}

const DailyTasksList = ({ tasks, allTasksCompleted }: DailyTasksListProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Tasks</h2>
      
      {allTasksCompleted && (
        <Card className="mb-4 bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center text-green-700">
              <Check className="mr-2" size={20} />
              <span className="font-medium">All daily tasks completed! Great job! 🎉</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {tasks.map((task, index) => (
        <div key={index} className="relative">
          <Link to={task.to}>
            <Card className={`hover:shadow-md transition-all cursor-pointer ${
              task.completed 
                ? 'bg-green-50 border-green-200 shadow-sm' 
                : 'hover:shadow-md'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <task.icon className={`mr-4 ${
                      task.completed ? 'text-green-600' : task.to === '/medications' ? 'text-blue-600' : task.to === '/health' ? 'text-red-500' : 'text-green-600'
                    }`} size={24} />
                    <div>
                      <h3 className={`font-medium ${
                        task.completed ? 'text-green-800' : 'text-gray-800'
                      }`}>{task.title}</h3>
                      <p className={`text-sm ${
                        task.completed ? 'text-green-600' : 'text-gray-500'
                      }`}>{task.description}</p>
                    </div>
                  </div>
                  {task.completed && (
                    <Check className="text-green-600" size={20} />
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DailyTasksList;
