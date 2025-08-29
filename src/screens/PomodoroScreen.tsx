import React from 'react';
import { Box, Text, VStack, HStack, Icon, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import PomodoroTimer from '../components/PomodoroTimer';
import { useTasks } from '../context/TasksContext';
import { usePomodoro } from '../context/PomodoroContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type PomodoroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

const PomodoroScreen: React.FC = () => {
  const { tasks } = useTasks();
  const { setTotalPomodoros, setMode } = usePomodoro();
  const navigation = useNavigation<PomodoroScreenNavigationProp>();

  // Atualizar o total de pomodoros com base nas tarefas não concluídas
  React.useEffect(() => {
    const totalEstimatedPomodoros = tasks
      .filter(task => !task.completed)
      .reduce((total, task) => total + (task.estimatedPomodoros || 1), 0);
    setTotalPomodoros(totalEstimatedPomodoros);
  }, [tasks, setTotalPomodoros]);

  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <Box flex={1} bg="white">
      {/* Header com gradiente */}
      <Box 
        bg={{
          linearGradient: {
            colors: ['red.600', 'red.700'],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        py="6" 
        px="4"
        shadow={3}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text color="white" fontSize="24" fontWeight="bold">
              Pomodoro Timer
            </Text>
            <Text color="white" fontSize="sm" opacity={0.9}>
              Foque no que importa
            </Text>
          </VStack>
          <Icon 
            as={MaterialIcons} 
            name="timer" 
            size="xl" 
            color="white" 
            opacity={0.8}
          />
        </HStack>
      </Box>

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
        
        {/* Botões de modo */}
        <VStack space={4} w="full" maxW="300">
          <Button
            onPress={() => setMode('pomodoro')}
            leftIcon={<Icon as={MaterialIcons} name="work" size="sm" color="white" />}
            colorScheme="red"
            bg="red.600"
            _pressed={{ bg: 'red.700' }}
            size="lg"
          >
            Pomodoro (25min)
          </Button>
          
          <Button
            onPress={() => setMode('shortBreak')}
            leftIcon={<Icon as={MaterialIcons} name="coffee" size="sm" color="white" />}
            colorScheme="orange"
            bg="orange.500"
            _pressed={{ bg: 'orange.600' }}
            size="lg"
          >
            Pausa Curta (5min)
          </Button>
          
          <Button
            onPress={() => setMode('longBreak')}
            leftIcon={<Icon as={MaterialIcons} name="restaurant" size="sm" color="white" />}
            colorScheme="green"
            bg="green.600"
            _pressed={{ bg: 'green.700' }}
            size="lg"
          >
            Pausa Longa (15min)
          </Button>
        </VStack>

        {/* Botão para gerenciar tarefas */}
        <Button
          onPress={() => navigation.navigate('TaskList')}
          leftIcon={<Icon as={MaterialIcons} name="list" size="sm" color="white" />}
          colorScheme="gray"
          bg="gray.600"
          _pressed={{ bg: 'gray.700' }}
          size="md"
          variant="outline"
        >
          Gerenciar Tarefas
        </Button>
      </VStack>
    </Box>
  );
};

export default PomodoroScreen;
