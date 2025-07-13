
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmergencyButton = () => {
  const handleEmergencyCall = () => {
    window.location.href = 'tel:112';
  };

  return (
    <Button 
      onClick={handleEmergencyCall}
      className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-4 text-lg font-semibold rounded-xl shadow-lg"
    >
      <Phone className="mr-2" size={20} />
      Emergency Call 112
    </Button>
  );
};

export default EmergencyButton;
