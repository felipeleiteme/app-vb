import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, FlatList, HStack, Checkbox, Icon, Pressable, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Platform } from 'react-native';
import PomodoroTimer from '../components/PomodoroTimer';
import { useTasks } from '../context/TasksContext';
import { usePomodoro } from '../context/PomodoroContext';
import { Task } from '../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type PomodoroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

const PomodoroScreen: React.FC = () => {
  const { tasks, removeTask, toggleTask } = useTasks();
  const { setTotalPomodoros, startTimer, setMode } = usePomodoro();
  const navigation = useNavigation<PomodoroScreenNavigationProp>();
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Atualizar o total de pomodoros com base nas tarefas não concluídas e seus pomodoros estimados
  useEffect(() => {
    const totalEstimatedPomodoros = tasks
      .filter(task => !task.completed)
      .reduce((total, task) => total + (task.estimatedPomodoros || 1), 0);
    setTotalPomodoros(totalEstimatedPomodoros);
  }, [tasks, setTotalPomodoros]);

  const confirmDelete = (id: number) => {
    if (Platform.OS === 'web') {
      const g: unknown = global;
      const confirmFn = (g as { confirm?: (msg?: string) => boolean }).confirm;
      const yes = typeof confirmFn === 'function' ? confirmFn('Deseja realmente excluir esta tarefa?') : true;
      if (yes) removeTask(id);
      return;
    }
    Alert.alert('Excluir tarefa', 'Deseja realmente excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removeTask(id) },
    ]);
  };

  const handleEdit = (task: Task) => {
    navigation.navigate('AddTask', { taskId: task.id, taskText: task.text });
  };

  // Iniciar o timer para uma tarefa específica
  const startTimerForTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setMode('pomodoro');
    startTimer();
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <Box borderBottomWidth="1" borderBottomColor="coolGray.200" py="3" px="4">
      <VStack>
        <HStack alignItems="center" justifyContent="space-between">
          <HStack alignItems="center" space={3} flex={1}>
            <Checkbox
              value={item.id.toString()}
              isChecked={item.completed}
              onChange={() => toggleTask(item.id)}
              accessibilityLabel="Marcar tarefa como concluída"
              colorScheme="primary"
            />
            <Pressable onPress={() => toggleTask(item.id)} _pressed={{ opacity: 0.5 }} flex={1}>
              <Text
                strikeThrough={item.completed}
                color={item.completed ? 'coolGray.400' : 'coolGray.800'}
                fontSize="md"
              >
                {item.text}
              </Text>
            </Pressable>
          </HStack>
          <HStack space={4}>
            <Pressable onPress={() => handleEdit(item)} accessibilityLabel={`Editar tarefa ${item.text}`}>
              <Icon
                as={MaterialIcons}
                name="edit"
                size="5"
                color="gray.500"
              />
            </Pressable>
            <Pressable onPress={() => confirmDelete(item.id)} accessibilityLabel={`Excluir tarefa ${item.text}`}>
              <Icon
                as={MaterialIcons}
                name="delete"
                size="5"
                color="red.500"
              />
            </Pressable>
          </HStack>
        </HStack>
        
        {/* Informações de pomodoros e botão de iniciar */}
        <HStack ml="10" mt="1" justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={1}>
            <Icon
              as={MaterialIcons}
              name="timer"
              size="4"
              color="red.500"
            />
            <Text fontSize="xs" color="gray.500">
              {item.estimatedPomodoros || 1} {(item.estimatedPomodoros || 1) === 1 ? 'pomodoro' : 'pomodoros'} ({(item.estimatedPomodoros || 1) * 25} min)
            </Text>
          </HStack>
          
          {!item.completed && (
            <Pressable 
              onPress={() => startTimerForTask(item.id)}
              bg={selectedTaskId === item.id ? "red.100" : "transparent"}
              px="2"
              py="1"
              borderRadius="md"
              _pressed={{ opacity: 0.7 }}
            >
              <HStack alignItems="center" space={1}>
                <Icon
                  as={MaterialIcons}
                  name="play-arrow"
                  size="4"
                  color="red.500"
                />
                <Text fontSize="xs" color="red.500" fontWeight={selectedTaskId === item.id ? "bold" : "normal"}>
                  {selectedTaskId === item.id ? "Focando" : "Focar"}
                </Text>
              </HStack>
            </Pressable>
          )}
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <Box flex={1} bg="white">
      <Box bg="primary.600" py="5" px="4">
        <Text color="white" fontSize="22" fontWeight="bold">
          Pomodoro
        </Text>
      </Box>
      {/* Pomodoro Timer */}
      <PomodoroTimer selectedTaskId={selectedTaskId} />

      {/* Tarefas */}
      <VStack flex={1}>
        <Box px="4" py="2">
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.700">
              Tasks
            </Text>
            <Text fontSize="sm" color="gray.500">
              {tasks.filter(t => !t.completed).length} tarefas restantes
            </Text>
          </HStack>
        </Box>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskItem}
          flex={1}
        />

        <Button
          position="absolute"
          bottom="8"
          right="6"
          size="lg"
          borderRadius="full"
          shadow={6}
          colorScheme="primary"
          bg="primary.600"
          _pressed={{ bg: 'primary.700' }}
          leftIcon={<Icon as={MaterialIcons} name="add" size="md" color="white" />}
          onPress={() => navigation.navigate('AddTask', {})}
          accessibilityLabel="Adicionar nova tarefa"
        >
          Nova Tarefa
        </Button>
      </VStack>
    </Box>
  );
};

export default PomodoroScreen;
