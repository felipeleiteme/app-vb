import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AddTaskScreen from '../screens/AddTaskScreen';
import TaskListScreen from '../screens/TaskListScreen';
import theme from '../theme';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary[600] },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff', fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ headerShown: false }}
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

export default AppNavigator;
