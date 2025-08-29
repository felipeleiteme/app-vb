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
} from 'native-base';
import React from 'react';
import { FlatList, Alert, Platform } from 'react-native';

import { useTasks } from '../context/TasksContext';
import { TaskListScreenProps, Task } from '../types';

const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const { tasks, isLoading, removeTask, toggleTask } = useTasks();

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

  const renderTaskItem = ({ item }: { item: Task }) => (
    <Box borderBottomWidth="1" borderBottomColor="coolGray.200" py="3" px="4">
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
    </Box>
  );

  return (
    <Box flex={1} bg="white">
      <Box bg="primary.600" py="5" px="4">
        <Text color="white" fontSize="22" fontWeight="bold">
          Minhas Tarefas
        </Text>
      </Box>

      {isLoading ? (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner accessibilityLabel="Carregando tarefas" color="primary.600" size="lg" />
          <Text mt="2" color="gray.500">Carregando...</Text>
        </VStack>
      ) : tasks.length === 0 ? (
        <VStack flex={1} justifyContent="center" alignItems="center" space={2}>
          <Icon as={MaterialIcons} name="playlist-add-check" size="2xl" color="gray.300" />
          <Text fontSize="lg" color="gray.500">
            Nenhuma tarefa adicionada!
          </Text>
          <Text color="gray.400">Clique em &quot;Nova Tarefa&quot; para começar.</Text>
        </VStack>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskItem}
        />
      )}

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
    </Box>
  );
};

export default TaskListScreen;
