import { StackScreenProps } from '@react-navigation/stack';

// Define a estrutura de uma tarefa
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// Define os nomes das telas e seus parâmetros
// AddTask pode receber parâmetros para o modo de edição
export type RootStackParamList = {
  TaskList: undefined;
  AddTask: { taskId?: number; taskText?: string } | undefined;
};

// As telas agora recebem apenas as props de navegação padrão.
// Os dados das tarefas são consumidos via context hook.
export type TaskListScreenProps = StackScreenProps<
  RootStackParamList,
  'TaskList'
>;

export type AddTaskScreenProps = StackScreenProps<
  RootStackParamList,
  'AddTask'
>;
