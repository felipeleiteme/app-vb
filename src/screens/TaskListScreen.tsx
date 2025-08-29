import { MaterialIcons } from '@expo/vector-icons';
import {
  Box,
  Text,
  HStack,
  Checkbox,
  Icon,
  Button,
  Pressable,
  Spinner,
  VStack,
  Animated,
  Fade,
  Slide,
} from 'native-base';
import React, { useRef, useEffect } from 'react';
import { FlatList, Alert, Platform } from 'react-native';

import { useTasks } from '../context/TasksContext';
import { TaskListScreenProps, Task } from '../types';
import TaskCounter from '../components/TaskCounter';
import EditableTaskText from '../components/EditableTaskText';

const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const { tasks, isLoading, removeTask, toggleTask, editTask } = useTasks();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  const handleInlineEdit = (id: number, newText: string) => {
    editTask(id, newText);
  };

  const renderTaskItem = ({ item, index }: { item: Task; index: number }) => (
    <Slide in={true} placement="right" duration={300} delay={index * 100}>
      <Box 
        borderBottomWidth="1" 
        borderBottomColor="coolGray.200" 
        py="4" 
        px="4"
        bg={item.completed ? 'coolGray.50' : 'white'}
        _pressed={{ bg: 'coolGray.100' }}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <HStack alignItems="center" space={3} flex={1}>
            <Checkbox
              value={item.id.toString()}
              isChecked={item.completed}
              onChange={() => toggleTask(item.id)}
              accessibilityLabel="Marcar tarefa como concluída"
              colorScheme="primary"
              size="lg"
            />
            <EditableTaskText
              text={item.text}
              completed={item.completed}
              onSave={(newText) => handleInlineEdit(item.id, newText)}
              onToggle={() => toggleTask(item.id)}
            />
          </HStack>
          <HStack space={3}>
            <Pressable 
              onPress={() => handleEdit(item)} 
              accessibilityLabel={`Editar tarefa ${item.text}`}
              _pressed={{ opacity: 0.6 }}
              p="2"
              borderRadius="md"
              bg="coolGray.100"
            >
              <Icon
                as={MaterialIcons}
                name="edit"
                size="5"
                color="gray.600"
              />
            </Pressable>
            <Pressable 
              onPress={() => confirmDelete(item.id)} 
              accessibilityLabel={`Excluir tarefa ${item.text}`}
              _pressed={{ opacity: 0.6 }}
              p="2"
              borderRadius="md"
              bg="red.100"
            >
              <Icon
                as={MaterialIcons}
                name="delete"
                size="5"
                color="red.600"
              />
            </Pressable>
          </HStack>
        </HStack>
      </Box>
    </Slide>
  );

  return (
    <Box flex={1} bg="white">
      {/* Header com gradiente */}
      <Box 
        bg={{
          linearGradient: {
            colors: ['primary.600', 'primary.700'],
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
              Minhas Tarefas
            </Text>
            <Text color="white" fontSize="sm" opacity={0.9}>
              Organize suas atividades
            </Text>
          </VStack>
          <HStack space={2}>
            <Pressable 
              onPress={() => navigation.navigate('Pomodoro')}
              _pressed={{ opacity: 0.8 }}
              p="2"
              borderRadius="md"
              bg="white"
              opacity={0.2}
            >
              <Icon 
                as={MaterialIcons} 
                name="timer" 
                size="md" 
                color="white" 
              />
            </Pressable>
            <Icon 
              as={MaterialIcons} 
              name="check-circle" 
              size="xl" 
              color="white" 
              opacity={0.8}
            />
          </HStack>
        </HStack>
      </Box>

      {/* Contador de tarefas */}
      {!isLoading && tasks.length > 0 && (
        <TaskCounter tasks={tasks} />
      )}

      {/* Conteúdo principal */}
      {isLoading ? (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner accessibilityLabel="Carregando tarefas" color="primary.600" size="lg" />
          <Text mt="3" color="gray.500" fontSize="md">Carregando suas tarefas...</Text>
        </VStack>
      ) : tasks.length === 0 ? (
        <VStack flex={1} justifyContent="center" alignItems="center" space={4} px="8">
          <Fade in={true} duration={800}>
            <VStack alignItems="center" space={3}>
              <Icon 
                as={MaterialIcons} 
                name="playlist-add-check" 
                size="4xl" 
                color="gray.300" 
              />
              <Text fontSize="xl" color="gray.500" fontWeight="medium" textAlign="center">
                Nenhuma tarefa adicionada!
              </Text>
              <Text color="gray.400" textAlign="center" fontSize="md">
                Clique no botão abaixo para criar sua primeira tarefa e começar a organizar seu dia.
              </Text>
            </VStack>
          </Fade>
        </VStack>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Botão FAB melhorado */}
      <Button
        position="absolute"
        bottom="8"
        right="6"
        size="lg"
        borderRadius="full"
        shadow={8}
        colorScheme="primary"
        bg="primary.600"
        _pressed={{ 
          bg: 'primary.700',
          transform: [{ scale: 0.95 }]
        }}
        leftIcon={
          <Icon 
            as={MaterialIcons} 
            name="add" 
            size="md" 
            color="white" 
          />
        }
        onPress={() => navigation.navigate('AddTask', {})}
        accessibilityLabel="Adicionar nova tarefa"
        _text={{ fontWeight: 'bold' }}
      >
        Nova Tarefa
      </Button>
    </Box>
  );
};

export default TaskListScreen;
