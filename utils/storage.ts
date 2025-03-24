import AsyncStorage from '@react-native-async-storage/async-storage';

// User Profile Type
export type UserProfile = {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  coachingStyle: 'bienveillant' | 'strict' | 'equilibre';
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  points: number;
  evaluation: {
    pushups: number;
    squats: number;
    situps: number;
    burpees: number;
  };
};

// Exercise Goals Type
export type ExerciseGoals = {
  pushups: number;
  squats: number;
  situps: number;
};

// Workout History Item Type
export type WorkoutHistoryItem = {
  id: string;
  date: string;
  name: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    completed: number; // Number of completed sets
  }[];
  duration: number; // In seconds
  completed: boolean;
  points: number;
};

// Storage Keys
const STORAGE_KEYS = {
  USER_PROFILE: '@solo_fitness:user_profile',
  EXERCISE_GOALS: '@solo_fitness:exercise_goals',
  WORKOUT_HISTORY: '@solo_fitness:workout_history',
  APP_SETTINGS: '@solo_fitness:app_settings',
};

// Save user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Save exercise goals
export const saveExerciseGoals = async (goals: ExerciseGoals): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving exercise goals:', error);
  }
};

// Get exercise goals
export const getExerciseGoals = async (): Promise<ExerciseGoals | null> => {
  try {
    const goalsData = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_GOALS);
    return goalsData ? JSON.parse(goalsData) : null;
  } catch (error) {
    console.error('Error getting exercise goals:', error);
    return null;
  }
};

// Save workout to history
export const saveWorkoutToHistory = async (workout: WorkoutHistoryItem): Promise<void> => {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    const history: WorkoutHistoryItem[] = historyData ? JSON.parse(historyData) : [];
    
    // Add new workout at the beginning of the array
    history.unshift(workout);
    
    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving workout history:', error);
  }
};

// Get workout history
export const getWorkoutHistory = async (): Promise<WorkoutHistoryItem[]> => {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Error getting workout history:', error);
    return [];
  }
};

// App Settings Type
export type AppSettings = {
  darkMode: boolean;
  notifications: boolean;
  sounds: boolean;
};

// Save app settings
export const saveAppSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving app settings:', error);
  }
};

// Get app settings
export const getAppSettings = async (): Promise<AppSettings | null> => {
  try {
    const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return settingsData ? JSON.parse(settingsData) : null;
  } catch (error) {
    console.error('Error getting app settings:', error);
    return null;
  }
};

// Calculate points needed for next rank
export const pointsForNextRank = (currentRank: string): number => {
  switch (currentRank) {
    case 'E': return 100; // Points needed to reach D
    case 'D': return 250; // Points needed to reach C
    case 'C': return 500; // Points needed to reach B
    case 'B': return 1000; // Points needed to reach A
    case 'A': return 2000; // Points needed to reach S
    default: return 0;
  }
};

// Update user rank based on points
export const updateRank = async (): Promise<void> => {
  try {
    const profile = await getUserProfile();
    if (!profile) return;
    
    const { points, rank } = profile;
    let newRank = rank;
    
    if (rank === 'E' && points >= 100) newRank = 'D';
    else if (rank === 'D' && points >= 250) newRank = 'C';
    else if (rank === 'C' && points >= 500) newRank = 'B';
    else if (rank === 'B' && points >= 1000) newRank = 'A';
    else if (rank === 'A' && points >= 2000) newRank = 'S';
    
    if (newRank !== rank) {
      await saveUserProfile({ ...profile, rank: newRank as UserProfile['rank'] });
    }
  } catch (error) {
    console.error('Error updating rank:', error);
  }
};