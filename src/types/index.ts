import { StackScreenProps } from '@react-navigation/stack';

// Define a estrutura de uma tarefa
export interface Task {
  id: number;
  text: string;
  completed: boolean;
  estimatedPomodoros?: number; // Número estimado de pomodoros para completar a tarefa
}

// Estatísticas do Pomodoro
export interface PomodoroStats {
  completedPomodoros: number;
  totalPomodoros: number;
}

// Define os nomes das telas e seus parâmetros
// AddTask pode receber parâmetros para o modo de edição
export type RootStackParamList = {
  TaskList: undefined;
  AddTask: { taskId?: number; taskText?: string } | undefined;
  Pomodoro: undefined;
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

export type PomodoroScreenProps = StackScreenProps<
  RootStackParamList,
  'Pomodoro'
>;
