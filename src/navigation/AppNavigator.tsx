import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import AddTaskScreen from '../screens/AddTaskScreen';
import TaskListScreen from '../screens/TaskListScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import theme from '../theme';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Stack Navigator para as telas de tarefas
const TasksStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary[600] },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff', fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ title: 'Minhas Tarefas', headerShown: false }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        // O título será definido dinamicamente na tela
        options={({ route }) => ({
          title: route.params?.taskId ? 'Editar Tarefa' : 'Adicionar Nova Tarefa',
        })}
      />
    </Stack.Navigator>
  );
};

// App Navigator principal com Tab Navigation
const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[600],
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="TaskList" 
        component={TasksStack} 
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ color, size }) => (
            <Icon as={MaterialIcons} name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Pomodoro" 
        component={PomodoroScreen} 
        options={{
          tabBarLabel: 'Pomodoro',
          tabBarIcon: ({ color, size }) => (
            <Icon as={MaterialIcons} name="timer" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
