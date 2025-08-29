import AsyncStorage from '@react-native-async-storage/async-storage';
import { PomodoroStats } from '../types';

const POMODORO_STATS_KEY = '@pomodoro_stats';

/**
 * Carrega as estatísticas do Pomodoro do AsyncStorage
 */
export const loadPomodoroStats = async (): Promise<PomodoroStats | null> => {
  try {
    const statsJson = await AsyncStorage.getItem(POMODORO_STATS_KEY);
    if (statsJson) {
      const stats = JSON.parse(statsJson);
      if (isPomodoroStats(stats)) {
        return stats;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar estatísticas do Pomodoro:', error);
    return null;
  }
};

/**
 * Salva as estatísticas do Pomodoro no AsyncStorage
 */
export const savePomodoroStats = async (stats: PomodoroStats): Promise<void> => {
  try {
    const statsJson = JSON.stringify(stats);
    await AsyncStorage.setItem(POMODORO_STATS_KEY, statsJson);
  } catch (error) {
    console.error('Erro ao salvar estatísticas do Pomodoro:', error);
  }
};

/**
 * Verifica se o objeto é do tipo PomodoroStats
 */
const isPomodoroStats = (obj: unknown): obj is PomodoroStats => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'completedPomodoros' in obj &&
    'totalPomodoros' in obj &&
    typeof (obj as PomodoroStats).completedPomodoros === 'number' &&
    typeof (obj as PomodoroStats).totalPomodoros === 'number'
  );
};
