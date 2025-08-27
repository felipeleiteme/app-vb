import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Input,
  Button,
  Icon,
} from 'react-native-elements';
import { AddTaskScreenProps } from '../types';

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#6200ee',
  },
});

const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation, addTask }) => {
  const [taskText, setTaskText] = useState('');

  const handleSaveTask = () => {
    if (taskText.trim().length > 0) {
      addTask(taskText.trim());
      navigation.goBack();
    } else {
      Alert.alert('Campo Vazio', 'Por favor, digite o nome da tarefa.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.formContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Input
        placeholder="Ex: Estudar React Native"
        value={taskText}
        onChangeText={setTaskText}
        leftIcon={<Icon name="create" type="material" size={24} color="gray" />}
        onSubmitEditing={handleSaveTask}
        returnKeyType="done"
      />
      <Button
        title="Salvar Tarefa"
        onPress={handleSaveTask}
        icon={<Icon name="save" type="material" color="white" style={{ marginRight: 8 }} />}
        buttonStyle={styles.saveButton}
      />
    </KeyboardAvoidingView>
  );
};

export default AddTaskScreen;
