import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';

import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import { RootStackParamList, Task } from '../types';
import { loadTasks, saveTasks } from '../storage/tasksStorage';

const Stack = createStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6200ee',
  },
});

const AppNavigator: React.FC = () => {
  const defaultTasks: Task[] = [
    { id: 1, text: 'Comprar pão', completed: false },
    { id: 2, text: 'Estudar React Native', completed: true },
    { id: 3, text: 'Passear com o cachorro', completed: false },
  ];
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await loadTasks();
      if (mounted && stored && Array.isArray(stored) && stored.length >= 0) {
        setTasks(stored);
      }
      if (mounted) setHydrated(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveTasks(tasks);
    }
  }, [tasks, hydrated]);

  return (
    <Stack.Navigator initialRouteName="TaskList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskList">
        {(props) => (
          <TaskListScreen
            {...props}
            tasks={tasks}
            setTasks={setTasks}
            removeTask={(id: number) =>
              setTasks((prev) => prev.filter((t) => t.id !== id))
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="AddTask"
        options={{
          headerShown: true,
          title: 'Adicionar Nova Tarefa',
          headerStyle: styles.header,
          headerTintColor: '#fff',
          headerTitleStyle: { color: '#fff', fontSize: 18 },
        }}
      >
        {(props) => (
          <AddTaskScreen
            {...props}
            addTask={(newTaskText) => {
              const newTask: Task = {
                id: Date.now(),
                text: newTaskText,
                completed: false,
              };
              setTasks((prevTasks) => [...prevTasks, newTask]);
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;