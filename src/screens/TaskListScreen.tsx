import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Alert,
} from 'react-native';
import {
  Header,
  ListItem,
  CheckBox,
  FAB,
  Icon,
  Text,
} from 'react-native-elements';
import { TaskListScreenProps, Task } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: 'rgb(0, 122, 255)',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(242, 242, 242)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    color: '#888',
  },
  taskText: {
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
    fontStyle: 'italic',
  },
});

const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation, tasks, setTasks, removeTask }) => {
  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const confirmDelete = (id: number) => {
    Alert.alert('Excluir tarefa', 'Deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removeTask(id) },
    ]);
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <ListItem bottomDivider onPress={() => toggleTaskCompletion(item.id)}>
      <CheckBox
        checked={item.completed}
        onPress={() => toggleTaskCompletion(item.id)}
        iconType="material-community"
        checkedIcon="checkbox-marked-circle"
        uncheckedIcon="checkbox-blank-circle-outline"
      />
      <ListItem.Content>
        <ListItem.Title style={item.completed ? styles.taskTextCompleted : styles.taskText}>
          {item.text}
        </ListItem.Title>
      </ListItem.Content>
      <Icon name="delete" type="material" color="#d32f2f" onPress={() => confirmDelete(item.id)} />
    </ListItem>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        centerComponent={{ text: 'Minhas Tarefas', style: styles.headerTitle }}
        containerStyle={styles.header}
      />

      {tasks.length === 0 ? (
        <View style={styles.emptyView}>
          <Text h4 style={styles.noTasksText}>
            Nenhuma tarefa adicionada!
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskItem}
        />
      )}

      <FAB
        title={<Icon name="add" type="material" color="white" />}
        placement="right"
        color="#6200ee"
        onPress={() => navigation.navigate('AddTask')}
      />
    </SafeAreaView>
  );
};

export default TaskListScreen;
