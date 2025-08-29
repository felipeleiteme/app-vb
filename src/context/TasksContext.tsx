
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Alert } from 'react-native';
import { useToast } from 'native-base';
import { loadTasks, saveTasks } from '../storage/tasksStorage';
import { Task } from '../types';

// Define o formato do que será exposto pelo Contexto
interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (text: string) => void;
  removeTask: (id: number) => void;
  toggleTask: (id: number) => void;
  editTask: (id: number, newText: string) => void;
}

// Cria o Contexto
const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Cria o Provedor do Contexto
export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Para evitar salvar no AsyncStorage na primeira renderização
  const isInitialMount = useRef(true);

  // Carregar tarefas do AsyncStorage na inicialização
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const storedTasks = await loadTasks();
        if (mounted && storedTasks) {
          setTasks(storedTasks);
        }
      } catch (error) {
        console.error('Falha ao carregar tarefas.', error);
        Alert.alert('Erro', 'Não foi possível carregar suas tarefas.');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Salvar tarefas no AsyncStorage sempre que a lista for alterada
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isLoading) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((text: string) => {
    setTasks((prevTasks) => {
      const maxId = prevTasks.length ? Math.max(...prevTasks.map((t) => t.id)) : 0;
      const newTask: Task = { id: maxId + 1, text, completed: false };
      return [...prevTasks, newTask];
    });
    toast.show({ description: 'Tarefa adicionada com sucesso!' });
  }, [toast]);

  const removeTask = useCallback((id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast.show({ description: 'Tarefa removida.', bg: 'danger.500' });
  }, [toast]);

  const toggleTask = useCallback((id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const editTask = useCallback((id: number, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
    toast.show({ description: 'Tarefa atualizada com sucesso!' });
  }, [toast]);

  const value = {
    tasks,
    isLoading,
    addTask,
    removeTask,
    toggleTask,
    editTask,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

// Hook customizado para consumir o contexto facilmente
export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks deve ser usado dentro de um TasksProvider');
  }
  return context;
};
