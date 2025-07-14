import { Card, CardContent } from '@/components/ui/card';

const JourneyLegend = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Daily Tasks</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center text-white text-xs font-bold mr-3">3</div>
            <span>All 3 tasks completed (Medications + Health metrics + Education)</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center text-white text-xs font-bold mr-3">1-2</div>
            <span>Some tasks completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-600 flex items-center justify-center text-white text-xs font-bold mr-3">0</div>
            <span>No tasks completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyLegend;