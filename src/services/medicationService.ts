import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from './notificationService';

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  prescribed_by?: string;
  start_date: string;
  end_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationIntake {
  id: string;
  user_id: string;
  medication_id: string;
  scheduled_time: string;
  taken_at?: string;
  status: 'taken' | 'missed' | 'delayed' | 'scheduled';
  notes?: string;
  created_at: string;
  medication?: Medication;
}

export interface CreateMedicationData {
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  prescribed_by?: string;
  start_date: string;
  end_date?: string;
  reminder_times: string[];
}

export interface CreateIntakeData {
  medication_id: string;
  scheduled_time: string;
  status?: 'scheduled' | 'taken' | 'missed' | 'delayed';
  notes?: string;
}

class MedicationService {
  // Medications CRUD
  async getUserMedications(userId: string): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createMedication(medicationData: CreateMedicationData): Promise<Medication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('medications')
      .insert({
        ...medicationData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Schedule notification reminders for each time
    try {
      for (const reminderTime of medicationData.reminder_times) {
        await this.scheduleNotificationReminders(data, reminderTime);
      }
    } catch (notificationError) {
      console.error('Failed to schedule notifications:', notificationError);
    }

    return data;
  }

  async updateMedication(medicationId: string, updates: Partial<CreateMedicationData>): Promise<Medication> {
    const { data, error } = await supabase
      .from('medications')
      .update(updates)
      .eq('id', medicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteMedication(medicationId: string): Promise<void> {
    const { error } = await supabase
      .from('medications')
      .update({ active: false })
      .eq('id', medicationId);

    if (error) throw error;
  }

  // Medication Intakes CRUD
  async getMedicationIntakes(userId: string, startDate?: string, endDate?: string): Promise<MedicationIntake[]> {
    let query = supabase
      .from('medication_intakes')
      .select(`
        *,
        medication:medications(*)
      `)
      .eq('user_id', userId)
      .order('scheduled_time', { ascending: false });

    if (startDate) {
      query = query.gte('scheduled_time', startDate);
    }
    if (endDate) {
      query = query.lte('scheduled_time', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as MedicationIntake[];
  }

  async getTodaysIntakes(userId: string): Promise<MedicationIntake[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    return this.getMedicationIntakes(userId, startOfDay, endOfDay);
  }

  async createMedicationIntake(intakeData: CreateIntakeData): Promise<MedicationIntake> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('medication_intakes')
      .insert({
        ...intakeData,
        user_id: user.id,
        status: intakeData.status || 'scheduled',
      })
      .select(`
        *,
        medication:medications(*)
      `)
      .single();

    if (error) throw error;
    return data as MedicationIntake;
  }

  async markMedicationTaken(intakeId: string, notes?: string): Promise<MedicationIntake> {
    const { data, error } = await supabase
      .from('medication_intakes')
      .update({
        status: 'taken',
        taken_at: new Date().toISOString(),
        notes
      })
      .eq('id', intakeId)
      .select(`
        *,
        medication:medications(*)
      `)
      .single();

    if (error) throw error;
    return data as MedicationIntake;
  }

  async updateIntakeStatus(
    intakeId: string, 
    status: 'taken' | 'missed' | 'delayed' | 'scheduled',
    notes?: string
  ): Promise<MedicationIntake> {
    const updateData: any = { status, notes };
    
    if (status === 'taken') {
      updateData.taken_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('medication_intakes')
      .update(updateData)
      .eq('id', intakeId)
      .select(`
        *,
        medication:medications(*)
      `)
      .single();

    if (error) throw error;
    return data as MedicationIntake;
  }

  // Helper methods for scheduling
  generateScheduledIntakes(medication: Medication, days: number = 30): CreateIntakeData[] {
    const intakes: CreateIntakeData[] = [];
    const startDate = new Date(medication.start_date);
    const endDate = medication.end_date ? new Date(medication.end_date) : new Date();
    endDate.setDate(endDate.getDate() + days);

    // Parse frequency to determine scheduling pattern
    const times = this.parseFrequencyToTimes(medication.frequency);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      times.forEach(time => {
        const scheduledDateTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        scheduledDateTime.setHours(hours, minutes, 0, 0);

        intakes.push({
          medication_id: medication.id,
          scheduled_time: scheduledDateTime.toISOString(),
          status: 'scheduled'
        });
      });
    }

    return intakes;
  }

  private parseFrequencyToTimes(frequency: string, baseTime?: string): string[] {
    const defaultTime = baseTime || '08:00';
    const lowerFreq = frequency.toLowerCase();
    
    if (lowerFreq.includes('once daily') || lowerFreq.includes('once a day')) {
      return [defaultTime];
    } else if (lowerFreq.includes('twice daily') || lowerFreq.includes('twice a day')) {
      const [hours] = defaultTime.split(':').map(Number);
      const secondTime = `${String((hours + 12) % 24).padStart(2, '0')}:00`;
      return [defaultTime, secondTime];
    } else if (lowerFreq.includes('three times') || lowerFreq.includes('3 times')) {
      const [hours] = defaultTime.split(':').map(Number);
      const secondTime = `${String((hours + 6) % 24).padStart(2, '0')}:00`;
      const thirdTime = `${String((hours + 12) % 24).padStart(2, '0')}:00`;
      return [defaultTime, secondTime, thirdTime];
    } else if (lowerFreq.includes('four times') || lowerFreq.includes('4 times')) {
      const [hours] = defaultTime.split(':').map(Number);
      const times = [];
      for (let i = 0; i < 4; i++) {
        times.push(`${String((hours + i * 6) % 24).padStart(2, '0')}:00`);
      }
      return times;
    } else if (lowerFreq.includes('every 8 hours')) {
      const [hours] = defaultTime.split(':').map(Number);
      return [
        defaultTime,
        `${String((hours + 8) % 24).padStart(2, '0')}:00`,
        `${String((hours + 16) % 24).padStart(2, '0')}:00`
      ];
    } else if (lowerFreq.includes('every 12 hours')) {
      const [hours] = defaultTime.split(':').map(Number);
      const secondTime = `${String((hours + 12) % 24).padStart(2, '0')}:00`;
      return [defaultTime, secondTime];
    } else if (lowerFreq.includes('every 6 hours')) {
      const [hours] = defaultTime.split(':').map(Number);
      const times = [];
      for (let i = 0; i < 4; i++) {
        times.push(`${String((hours + i * 6) % 24).padStart(2, '0')}:00`);
      }
      return times;
    }
    
    return [defaultTime];
  }

  async getAdherenceStats(userId: string, days: number = 30): Promise<{
    totalScheduled: number;
    totalTaken: number;
    adherencePercentage: number;
    missedCount: number;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const intakes = await this.getMedicationIntakes(
      userId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    const totalScheduled = intakes.length;
    const totalTaken = intakes.filter(intake => intake.status === 'taken').length;
    const missedCount = intakes.filter(intake => intake.status === 'missed').length;
    const adherencePercentage = totalScheduled > 0 ? (totalTaken / totalScheduled) * 100 : 0;

    return {
      totalScheduled,
      totalTaken,
      adherencePercentage: Math.round(adherencePercentage),
      missedCount
    };
  }

  // Notification scheduling
  private async scheduleNotificationReminders(medication: Medication, reminderTime: string): Promise<void> {
    try {
      // Generate daily reminders based on frequency
      const times = this.parseFrequencyToTimes(medication.frequency, reminderTime);
      
      for (const time of times) {
        const reminder = {
          id: parseInt(medication.id.slice(-6), 16) + times.indexOf(time), // Simple ID generation
          medicationName: medication.name,
          time: time,
          dosage: medication.dosage
        };

        await NotificationService.scheduleMedicationReminder(reminder);
      }
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

}

export const medicationService = new MedicationService();