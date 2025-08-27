import { StackScreenProps } from '@react-navigation/stack';

// Define a estrutura de uma tarefa
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// Define os nomes das telas e seus parâmetros
export type RootStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
};

// Define as propriedades para a tela de lista de tarefas
export type TaskListScreenProps = StackScreenProps<RootStackParamList, 'TaskList'> & {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  removeTask: (id: number) => void;
};

// Define as propriedades para a tela de adicionar tarefa
export type AddTaskScreenProps = StackScreenProps<RootStackParamList, 'AddTask'> & {
  addTask: (text: string) => void;
};
