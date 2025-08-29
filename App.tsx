import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { NativeBaseProvider } from 'native-base';
import theme from './src/theme';
import { TasksProvider } from './src/context/TasksContext';
import { PomodoroProvider } from './src/context/PomodoroContext';

const App: React.FC = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <TasksProvider>
        <PomodoroProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PomodoroProvider>
      </TasksProvider>
    </NativeBaseProvider>
  );
};

export default App;
