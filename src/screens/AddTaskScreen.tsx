import { MaterialIcons } from '@expo/vector-icons';
import {
  Input,
  Button,
  Icon,
  VStack,
} from 'native-base';
import React, { useState, useLayoutEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { useTasks } from '../context/TasksContext';
import { AddTaskScreenProps } from '../types';

const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation, route }) => {
  const { addTask, editTask, tasks } = useTasks();

  // Verifica se está em modo de edição
  const params = route.params;
  const isEditMode = params?.taskId !== undefined;
  const taskToEdit = isEditMode ? tasks.find(t => t.id === params.taskId) : undefined;

  const [taskText, setTaskText] = useState(isEditMode ? taskToEdit?.text || '' : '');

  // Atualiza o título da tela dinamicamente
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Editar Tarefa' : 'Adicionar Nova Tarefa',
    });
  }, [navigation, isEditMode]);

  const handleSaveTask = () => {
    const trimmedText = taskText.trim();
    if (trimmedText.length > 0) {
      if (isEditMode && params.taskId) {
        editTask(params.taskId, trimmedText);
      } else {
        addTask(trimmedText);
      }
      navigation.goBack();
    } else {
      Alert.alert('Campo Vazio', 'Por favor, digite o nome da tarefa.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <VStack flex={1} p="5" justifyContent="space-between">
        <Input
          placeholder="Ex: Estudar React Native"
          value={taskText}
          onChangeText={setTaskText}
          autoFocus
          fontSize="lg"
          onSubmitEditing={handleSaveTask}
          returnKeyType="done"
        />
        <Button
          onPress={handleSaveTask}
          leftIcon={<Icon as={MaterialIcons} name="save" size="sm" color="white" />}
          colorScheme="primary"
          bg="primary.600"
          _pressed={{ bg: 'primary.700' }}
          size="lg"
        >
          {isEditMode ? 'Salvar Alterações' : 'Adicionar Tarefa'}
        </Button>
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default AddTaskScreen;
