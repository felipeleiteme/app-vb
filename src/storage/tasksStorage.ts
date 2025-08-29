import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from '../types';

const STORAGE_KEY = 'app-vb/tasks';

export async function loadTasks(): Promise<Task[] | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    const parsed: unknown = JSON.parse(json);
    if (Array.isArray(parsed)) {
      // Basic shape check via type guard
      return parsed.filter(isTask) as Task[];
    }
    return null;
  } catch (e) {
    if (__DEV__) console.warn('Falha ao carregar tarefas do AsyncStorage', e);
    return null;
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    const json = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    if (__DEV__) console.warn('Falha ao salvar tarefas no AsyncStorage', e);
  }
}

function isTask(t: unknown): t is Task {
  if (typeof t !== 'object' || t === null) return false;
  const obj = t as Record<string, unknown>;
  return (
    typeof obj.id === 'number' &&
    typeof obj.text === 'string' &&
    typeof obj.completed === 'boolean'
  );
}
