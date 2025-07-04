
import { LocalNotifications } from '@capacitor/local-notifications';

export interface MedicationReminder {
  id: number;
  medicationName: string;
  time: string;
  dosage: string;
}

export class NotificationService {
  static async requestPermissions() {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  }

  static async scheduleMedicationReminder(reminder: MedicationReminder) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log('Notification permission denied');
      return false;
    }

    // Parse time string (e.g., "8:00 AM") to schedule notification
    const [time, period] = reminder.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);

    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour24, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Medication Reminder',
          body: `Time to take ${reminder.medicationName} (${reminder.dosage})`,
          id: reminder.id,
          schedule: { at: scheduledTime, repeats: true, every: 'day' },
          sound: 'beep.wav',
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }
      ]
    });

    return true;
  }

  static async cancelMedicationReminder(id: number) {
    await LocalNotifications.cancel({
      notifications: [{ id: id }]
    });
  }

  static async cancelAllReminders() {
    await LocalNotifications.cancel({
      notifications: []
    });
  }
}
