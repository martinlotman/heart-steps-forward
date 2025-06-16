
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ec2f832c4e2c4756a712c044dc425feb',
  appName: 'CardiacCare',
  webDir: 'dist',
  server: {
    url: 'https://ec2f832c-4e2c-4756-a712-c044dc425feb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
  },
};

export default config;
