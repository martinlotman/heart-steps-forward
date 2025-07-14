import { ArrowLeft, Smartphone, Watch, Activity, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

const HealthSync = () => {
  const apps = [
    {
      name: 'Apple Health',
      icon: Heart,
      description: 'Sync with Apple HealthKit',
      available: true,
    },
    {
      name: 'Google Fit',
      icon: Activity,
      description: 'Connect to Google Fit data',
      available: true,
    },
  ];

  const devices = [
    {
      name: 'Withings',
      icon: Watch,
      description: 'Smart scales and health devices',
      available: true,
    },
    {
      name: 'Fitbit',
      icon: Activity,
      description: 'Fitness trackers and smartwatches',
      available: true,
    },
    {
      name: 'Garmin',
      icon: Watch,
      description: 'GPS watches and fitness devices',
      available: false,
    },
    {
      name: 'Samsung Health',
      icon: Smartphone,
      description: 'Samsung Health ecosystem',
      available: false,
    },
  ];

  const handleConnect = (providerName: string) => {
    // TODO: Implement actual connection logic
    console.log(`Connecting to ${providerName}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/health" className="mr-4">
              <ArrowLeft className="text-muted-foreground" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Device Sync</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            Connect your health apps and devices to automatically sync your health data
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Health Apps</h2>
          <div className="space-y-3">
            {apps.map((app) => (
              <Card key={app.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <app.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={app.available ? "default" : "outline"}
                    disabled={!app.available}
                    onClick={() => handleConnect(app.name)}
                  >
                    {app.available ? 'Connect' : 'Soon'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Devices</h2>
          <div className="space-y-3">
            {devices.map((device) => (
              <Card key={device.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <device.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{device.name}</h3>
                      <p className="text-sm text-muted-foreground">{device.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={device.available ? "default" : "outline"}
                    disabled={!device.available}
                    onClick={() => handleConnect(device.name)}
                  >
                    {device.available ? 'Connect' : 'Soon'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4 bg-accent/50">
          <div className="text-center">
            <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground mb-1">Manual Entry</h3>
            <p className="text-sm text-muted-foreground mb-3">
              You can always manually enter your health data
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/health">Go to Health Metrics</Link>
            </Button>
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default HealthSync;