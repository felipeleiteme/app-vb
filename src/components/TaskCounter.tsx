import React from 'react';
import { Box, Text, HStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Task } from '../types';

interface TaskCounterProps {
  tasks: Task[];
}

const TaskCounter: React.FC<TaskCounterProps> = ({ tasks }) => {
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <Box bg="coolGray.50" p="4" borderBottomWidth="1" borderBottomColor="coolGray.200">
      <HStack justifyContent="space-between" alignItems="center">
        <HStack space={2} alignItems="center">
          <Icon as={MaterialIcons} name="assignment" size="sm" color="primary.600" />
          <Text fontSize="sm" color="coolGray.600" fontWeight="medium">
            {pendingTasks === 0 
              ? 'Todas as tarefas concluídas! 🎉'
              : `Você tem ${pendingTasks} tarefa${pendingTasks !== 1 ? 's' : ''} pendente${pendingTasks !== 1 ? 's' : ''}`
            }
          </Text>
        </HStack>
        {totalTasks > 0 && (
          <HStack space={1} alignItems="center">
            <Text fontSize="xs" color="coolGray.500">
              {completedTasks}/{totalTasks}
            </Text>
            <Text fontSize="xs" color="coolGray.400">
              concluídas
            </Text>
          </HStack>
        )}
      </HStack>
    </Box>
  );
};

export default TaskCounter;
