
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmergencyButton = () => {
  const handleEmergencyCall = () => {
    window.location.href = 'tel:911';
  };

  return (
    <Button 
      onClick={handleEmergencyCall}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
    >
      <Phone className="mr-2" size={20} />
      Emergency Call 911
    </Button>
  );
};

export default EmergencyButton;
