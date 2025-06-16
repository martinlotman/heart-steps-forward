
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MedicationCard from '@/components/MedicationCard';
import Navigation from '@/components/Navigation';

const Medications = () => {
  const [medications, setMedications] = useState([
    { id: 1, name: 'Metoprolol', dosage: '50mg', time: '8:00 AM', taken: false },
    { id: 2, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: true },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false },
    { id: 4, name: 'Aspirin', dosage: '81mg', time: '8:00 AM', taken: true },
  ]);

  const handleMarkTaken = (id: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, taken: true } : med
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">My Medications</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Today's Schedule</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 font-medium">
              {medications.filter(med => med.taken).length} of {medications.length} medications taken
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {medications.map(medication => (
            <MedicationCard
              key={medication.id}
              name={medication.name}
              dosage={medication.dosage}
              time={medication.time}
              taken={medication.taken}
              onMarkTaken={() => handleMarkTaken(medication.id)}
            />
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Medications;
