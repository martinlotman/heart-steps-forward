
import { CapacitorHealthData } from '@capacitor-community/health';

export interface HealthActivity {
  type: 'steps' | 'distance' | 'calories' | 'exercise';
  value: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  source: 'google_fit' | 'apple_health' | 'manual';
}

export class HealthDataService {
  private static instance: HealthDataService;
  private isInitialized = false;

  static getInstance(): HealthDataService {
    if (!HealthDataService.instance) {
      HealthDataService.instance = new HealthDataService();
    }
    return HealthDataService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      const isAvailable = await CapacitorHealthData.isAvailable();
      if (isAvailable.value) {
        this.isInitialized = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Health data service initialization failed:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const permissions = await CapacitorHealthData.requestAuthorization({
        read: [
          'steps',
          'distance',
          'calories',
          'activity'
        ],
        write: []
      });

      return permissions.granted;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async getStepsData(startDate: Date, endDate: Date): Promise<HealthActivity[]> {
    try {
      const result = await CapacitorHealthData.queryHKitSampleType({
        sampleName: 'steps',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      return result.resultData.map(item => ({
        type: 'steps',
        value: item.value,
        unit: 'steps',
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        source: this.getHealthSource()
      }));
    } catch (error) {
      console.error('Failed to get steps data:', error);
      return [];
    }
  }

  async getCaloriesData(startDate: Date, endDate: Date): Promise<HealthActivity[]> {
    try {
      const result = await CapacitorHealthData.queryHKitSampleType({
        sampleName: 'calories',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      return result.resultData.map(item => ({
        type: 'calories',
        value: item.value,
        unit: 'cal',
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        source: this.getHealthSource()
      }));
    } catch (error) {
      console.error('Failed to get calories data:', error);
      return [];
    }
  }

  async getActivityData(startDate: Date, endDate: Date): Promise<HealthActivity[]> {
    try {
      const stepsData = await this.getStepsData(startDate, endDate);
      const caloriesData = await this.getCaloriesData(startDate, endDate);
      
      return [...stepsData, ...caloriesData];
    } catch (error) {
      console.error('Failed to get activity data:', error);
      return [];
    }
  }

  private getHealthSource(): 'google_fit' | 'apple_health' {
    // Detect platform - this is a simplified check
    const userAgent = navigator.userAgent;
    if (userAgent.includes('iPad') || userAgent.includes('iPhone')) {
      return 'apple_health';
    }
    return 'google_fit';
  }

  async syncTodaysActivity(): Promise<HealthActivity[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return await this.getActivityData(startOfDay, endOfDay);
  }
}

export const healthDataService = HealthDataService.getInstance();
