import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const STORAGE_KEY = 'app-vb/tasks';

export async function loadTasks(): Promise<Task[] | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    const parsed: unknown = JSON.parse(json);
    if (Array.isArray(parsed)) {
      // Basic shape check
      return parsed.filter(
        (t: any) =>
          t && typeof t.id === 'number' && typeof t.text === 'string' && typeof t.completed === 'boolean'
      ) as Task[];
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    const json = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    // noop
  }
}

