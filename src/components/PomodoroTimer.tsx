import React from 'react';
import { Box, Text, HStack, Button, VStack, Pressable, Icon, Badge } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { usePomodoro, TimerMode } from '../context/PomodoroContext';
import { useTasks } from '../context/TasksContext';

interface PomodoroTimerProps {
  selectedTaskId?: number | null;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ selectedTaskId }) => {
  const {
    currentMode,
    timeLeft,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setMode,
    stats,
    estimatedEndTime,
  } = usePomodoro();
  
  const { tasks } = useTasks();
  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;

  // Formatar o tempo restante em minutos e segundos
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determinar a cor de fundo com base no modo atual
  const getBgColor = (): string => {
    switch (currentMode) {
      case 'pomodoro':
        return 'red.500'; // Vermelho para o modo Pomodoro
      case 'shortBreak':
        return 'green.500'; // Verde para pausa curta
      case 'longBreak':
        return 'blue.500'; // Azul para pausa longa
      default:
        return 'red.500';
    }
  };

  // Renderizar o botão de controle principal (iniciar/pausar)
  const renderControlButton = () => {
    if (!isActive) {
      return (
        <Button
          size="lg"
          width="80%"
          bg="white"
          _text={{ color: getBgColor(), fontWeight: 'bold', fontSize: 'xl' }}
          _pressed={{ bg: 'gray.100' }}
          onPress={startTimer}
        >
          INICIAR
        </Button>
      );
    }

    return (
      <Button
        size="lg"
        width="80%"
        bg="white"
        _text={{ color: getBgColor(), fontWeight: 'bold', fontSize: 'xl' }}
        _pressed={{ bg: 'gray.100' }}
        onPress={pauseTimer}
      >
        {isPaused ? 'CONTINUAR' : 'PAUSAR'}
      </Button>
    );
  };

  // Renderizar o botão de modo (Pomodoro, Short Break, Long Break)
  const renderModeButton = (mode: TimerMode, label: string) => {
    const isSelected = currentMode === mode;
    return (
      <Pressable
        py="2"
        px="4"
        borderRadius="md"
        bg={isSelected ? 'rgba(255, 255, 255, 0.2)' : 'transparent'}
        _pressed={{ opacity: 0.8 }}
        onPress={() => setMode(mode)}
      >
        <Text color="white" fontWeight={isSelected ? 'bold' : 'normal'}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <Box width="100%" p="4">
      <VStack space="4" alignItems="center" bg={getBgColor()} p="6" borderRadius="lg">
        {/* Seleção de modo */}
        <HStack space="2" justifyContent="center">
          {renderModeButton('pomodoro', 'Pomodoro')}
          {renderModeButton('shortBreak', 'Short Break')}
          {renderModeButton('longBreak', 'Long Break')}
        </HStack>
        
        {/* Tarefa atual */}
        {selectedTask && currentMode === 'pomodoro' && (
          <Badge colorScheme="light" variant="subtle" rounded="md" p="2">
            <Text color="white" fontSize="sm" textAlign="center">
              Focando em: {selectedTask.text}
            </Text>
          </Badge>
        )}

        {/* Timer */}
        <Text fontSize="6xl" fontWeight="bold" color="white">
          {formatTime(timeLeft)}
        </Text>

        {/* Botão de controle principal */}
        {renderControlButton()}

        {/* Botões adicionais */}
        {isActive && (
          <HStack space="4">
            <Button
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<Icon as={MaterialIcons} name="refresh" color="white" />}
              onPress={resetTimer}
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<Icon as={MaterialIcons} name="skip-next" color="white" />}
              onPress={skipTimer}
            >
              Skip
            </Button>
          </HStack>
        )}
      </VStack>

      {/* Estatísticas */}
      <HStack justifyContent="space-between" mt="4" px="2">
        <Text color="gray.600">
          Pomos: {stats.completedPomodoros}/{stats.totalPomodoros}
        </Text>
        <Text color="gray.600">
          Finish At: {estimatedEndTime} ({Math.ceil((stats.totalPomodoros - stats.completedPomodoros) * 25 / 60)}h)
        </Text>
      </HStack>
    </Box>
  );
};

export default PomodoroTimer;