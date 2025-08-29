import { MaterialIcons } from '@expo/vector-icons';
import {
  Input,
  Button,
  Icon,
  VStack,
  HStack,
  Text,
  FormControl,
  Box,
  Divider,
  Slide,
} from 'native-base';
import React, { useState, useLayoutEffect, useEffect } from 'react';
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
  const [estimatedPomodoros, setEstimatedPomodoros] = useState<number>(isEditMode ? taskToEdit?.estimatedPomodoros || 1 : 1);
  const [isValid, setIsValid] = useState(false);

  // Atualiza o título da tela dinamicamente
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Editar Tarefa' : 'Nova Tarefa',
      headerStyle: {
        backgroundColor: '#6366F1',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, isEditMode]);

  // Validação em tempo real
  useEffect(() => {
    setIsValid(taskText.trim().length > 0);
  }, [taskText]);

  const handleSaveTask = () => {
    const trimmedText = taskText.trim();
    if (trimmedText.length > 0) {
      if (isEditMode && params.taskId) {
        editTask(params.taskId, trimmedText, estimatedPomodoros);
      } else {
        addTask(trimmedText, estimatedPomodoros);
      }
      navigation.goBack();
    } else {
      Alert.alert('Campo Vazio', 'Por favor, digite o nome da tarefa.');
    }
  };

  const handleCancel = () => {
    if (taskText.trim() !== (isEditMode ? taskToEdit?.text || '' : '')) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja descartá-las?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <VStack flex={1} p="6" space={6}>
        

        {/* Formulário */}
        <VStack space={6} flex={1}>
          <FormControl isInvalid={!isValid && taskText.length > 0}>
            <FormControl.Label>
              <HStack space={2} alignItems="center">
                <Icon as={MaterialIcons} name="assignment" size="sm" color="gray.600" />
                <Text fontSize="md" fontWeight="medium" color="gray.700">
                  Nome da Tarefa
                </Text>
              </HStack>
            </FormControl.Label>
            <Input
              placeholder="Ex: Estudar React Native, Fazer exercícios..."
              value={taskText}
              onChangeText={setTaskText}
              autoFocus
              fontSize="lg"
              returnKeyType="next"
              autoComplete="off"
              borderColor={!isValid && taskText.length > 0 ? "red.300" : "gray.300"}
              _focus={{
                borderColor: "primary.500",
                bg: "white",
              }}
              _invalid={{
                borderColor: "red.300",
              }}
            />
            {!isValid && taskText.length > 0 && (
              <FormControl.ErrorMessage>
                O nome da tarefa não pode estar vazio
              </FormControl.ErrorMessage>
            )}
          </FormControl>
          
          <Divider />
          
          <FormControl>
            <FormControl.Label>
              <HStack space={2} alignItems="center">
                <Icon as={MaterialIcons} name="timer" size="sm" color="gray.600" />
                <Text fontSize="md" fontWeight="medium" color="gray.700">
                  Tempo Estimado
                </Text>
              </HStack>
            </FormControl.Label>
            <VStack space={3}>
              <HStack alignItems="center" space={4}>
                <HStack alignItems="center" space={3}>
                  <Button
                    onPress={() => setEstimatedPomodoros((v) => Math.max(1, v - 1))}
                    variant="outline"
                    size="sm"
                  >
                    -
                  </Button>
                  <Text fontSize="lg" minW="8" textAlign="center">
                    {estimatedPomodoros}
                  </Text>
                  <Button
                    onPress={() => setEstimatedPomodoros((v) => Math.min(10, v + 1))}
                    variant="outline"
                    size="sm"
                  >
                    +
                  </Button>
                </HStack>
                <VStack flex={1}>
                  <Text color="gray.600" fontSize="md">
                    {estimatedPomodoros === 1 ? '1 pomodoro' : `${estimatedPomodoros} pomodoros`}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    ({estimatedPomodoros * 25} minutos)
                  </Text>
                </VStack>
              </HStack>
              <Box bg="coolGray.50" p="3" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  💡 Dica: Um pomodoro = 25 minutos de foco + 5 minutos de pausa
                </Text>
              </Box>
            </VStack>
          </FormControl>
        </VStack>

        {/* Botões de ação */}
        <VStack space={3}>
          <Button
            onPress={handleSaveTask}
            leftIcon={
              <Icon 
                as={MaterialIcons} 
                name={isEditMode ? "save" : "add"} 
                size="sm" 
                color="white" 
              />
            }
            colorScheme="primary"
            bg="primary.600"
            _pressed={{ bg: 'primary.700' }}
            size="lg"
            isDisabled={!isValid}
            opacity={isValid ? 1 : 0.6}
          >
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Tarefa'}
          </Button>
          
          <Button
            onPress={handleCancel}
            variant="outline"
            colorScheme="gray"
            size="lg"
            _pressed={{ bg: 'gray.100' }}
          >
            Cancelar
          </Button>
        </VStack>
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default AddTaskScreen;
