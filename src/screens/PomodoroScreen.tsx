import React from 'react';
import { Box, Text, VStack, HStack, Icon, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import PomodoroTimer from '../components/PomodoroTimer';
import { useTasks } from '../context/TasksContext';
import { usePomodoro } from '../context/PomodoroContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Clock1Icon from '../assets/icons/Clock1Icon';
import Clock2Icon from '../assets/icons/Clock2Icon';

type PomodoroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

const PomodoroScreen: React.FC = () => {
  const { tasks } = useTasks();
  const { setTotalPomodoros, stats } = usePomodoro();
  const navigation = useNavigation<PomodoroScreenNavigationProp>();

  // Total de pomodoros estimados (memoizado)
  const totalEstimatedPomodoros = React.useMemo(() => {
    return tasks
      .filter(task => !task.completed)
      .reduce((total, task) => total + (task.estimatedPomodoros || 1), 0);
  }, [tasks]);

  // Atualizar o total de pomodoros com base nas tarefas não concluídas
  React.useEffect(() => {
    if (stats.totalPomodoros !== totalEstimatedPomodoros) {
      setTotalPomodoros(totalEstimatedPomodoros);
    }
  }, [totalEstimatedPomodoros, setTotalPomodoros, stats.totalPomodoros]);

  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <Box flex={1} bg="white">
      <Header
        title="Timer Pomodoro"
        rightIcon={
          <View style={styles.clockContainer}>
            <View style={styles.clock1Container}>
              <Clock1Icon />
            </View>
            <View style={styles.clock2Container}>
              <Clock2Icon />
            </View>
          </View>
        }
      />

      {/* Contador de tarefas */}
      {tasks.length > 0 && (
        <Box bg="coolGray.50" p="4" borderBottomWidth="1" borderBottomColor="coolGray.200">
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space={2} alignItems="center">
              <Icon as={MaterialIcons} name="assignment" size="sm" color="red.600" />
              <Text fontSize="sm" color="coolGray.600" fontWeight="medium">
                {pendingTasks === 0 
                  ? 'Todas as tarefas concluídas! 🎉'
                  : `${pendingTasks} tarefa${pendingTasks !== 1 ? 's' : ''} pendente${pendingTasks !== 1 ? 's' : ''}`
                }
              </Text>
            </HStack>
            {tasks.length > 0 && (
              <HStack space={1} alignItems="center">
                <Text fontSize="xs" color="coolGray.500">
                  {completedTasks}/{tasks.length}
                </Text>
                <Text fontSize="xs" color="coolGray.400">
                  concluídas
                </Text>
              </HStack>
            )}
          </HStack>
        </Box>
      )}

      {/* Timer Principal */}
      <VStack flex={1} justifyContent="center" alignItems="center" px="6" space={8}>
        <PomodoroTimer selectedTaskId={null} />

        {/* Ação principal: gerenciar tarefas */}
        <Button
          onPress={() => navigation.navigate('TaskList')}
          leftIcon={<Icon as={MaterialIcons} name="list" size="sm" color="white" />}
          colorScheme="primary"
          bg="primary.600"
          _pressed={{ bg: 'primary.700' }}
          size="lg"
          w="64"
          borderRadius="full"
        >
          Ver Tarefas
        </Button>
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  clockContainer: {
    width: 24,
    height: 24,
  },
  clock1Container: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
  clock2Container: {
    position: 'absolute',
    top: 6,
    left: 12,
  }
});

export default PomodoroScreen;
