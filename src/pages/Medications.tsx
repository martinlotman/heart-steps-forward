
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DailyMedTask from '@/components/DailyMedTask';
import Navigation from '@/components/Navigation';

const Medications = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Daily Medication Task</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <DailyMedTask />
      </div>

      <Navigation />
    </div>
  );
};

export default Medications;
