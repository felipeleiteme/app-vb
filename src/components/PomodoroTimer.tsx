import React from 'react';
import { Box, Text, HStack, Button, VStack, Pressable, Icon, Badge } from 'native-base';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Platform, Vibration } from 'react-native';
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

  // Tempo total do modo atual (para calcular progresso)
  const getTotalSeconds = (): number => {
    switch (currentMode) {
      case 'pomodoro':
        return 25 * 60;
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
      default:
        return 25 * 60;
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
          _pressed={{ bg: 'gray.100', shadow: 1 }}
          onPress={async () => { await triggerHaptic('impact'); startTimer(); }}
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
        _pressed={{ bg: 'gray.100', shadow: 1 }}
        onPress={async () => { await triggerHaptic('impact'); pauseTimer(); }}
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
        borderRadius="full"
        bg={isSelected ? 'rgba(255, 255, 255, 0.28)' : 'transparent'}
        _pressed={{ opacity: 0.85 }}
        onPress={() => setMode(mode)}
        flex={1}
        alignItems="center"
        minW={0}
      >
        <Text color="white" fontWeight={isSelected ? 'bold' : 'normal'} noOfLines={1} fontSize={{ base: 'sm', md: 'md' }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  const totalSeconds = getTotalSeconds();
  const progress = Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  // Config do círculo
  const SIZE = 240; // dimensão do SVG (ligeiramente maior)
  const STROKE = 14; // espessura um pouco maior
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset = CIRCUMFERENCE * (1 - progress / 100);

  // Gradiente do anel por modo
  const getRingGradient = (): [string, string] => {
    switch (currentMode) {
      case 'pomodoro':
        return ['#FFFFFF', '#FFE0E0'];
      case 'shortBreak':
        return ['#FFFFFF', '#D6F5E5'];
      case 'longBreak':
        return ['#FFFFFF', '#D6E8FF'];
      default:
        return ['#FFFFFF', '#F1F1F1'];
    }
  };

  const [gradStart, gradEnd] = getRingGradient();

  // Feedback tátil simples usando Vibration (sem dependências extras)
  const triggerHaptic = async (_type: 'impact' | 'success' = 'impact') => {
    if (Platform.OS === 'web') return;
    try { Vibration.vibrate(15); } catch (_) { /* Ignore vibration errors */ }
  };

  return (
    <Box width="100%" p="4">
      {/* Card do Timer */}
      <VStack
        space="4"
        alignItems="center"
        bg={getBgColor()}
        p="6"
        borderRadius="2xl"
        shadow={4}
      >
        {/* Segmented control dos modos */}
        <HStack
          space="1"
          bg="rgba(255,255,255,0.18)"
          borderRadius="full"
          p="1"
          w="90%"
          maxW="360"
        >
          {renderModeButton('pomodoro', 'Pomodoro')}
          {renderModeButton('shortBreak', 'Pausa Curta')}
          {renderModeButton('longBreak', 'Pausa Longa')}
        </HStack>

        {/* Tarefa atual (quando houver) */}
        {selectedTask && currentMode === 'pomodoro' && (
          <Badge colorScheme="light" variant="subtle" rounded="md" p="2">
            <Text color="white" fontSize="sm" textAlign="center">
              Focando em: {selectedTask.text}
            </Text>
          </Badge>
        )}

        {/* Anel de progresso com o tempo ao centro */}
        <Box position="relative" alignItems="center" justifyContent="center">
          <Svg width={SIZE} height={SIZE}>
            <Defs>
              <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={gradStart} stopOpacity="1" />
                <Stop offset="100%" stopColor={gradEnd} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            {/* trilho */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={STROKE}
              fill="transparent"
            />
            {/* preenchimento */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="url(#ringGrad)"
              strokeWidth={STROKE}
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </Svg>
          <Text position="absolute" fontSize="7xl" fontWeight="extrabold" color="white" letterSpacing="1.5">
            {formatTime(timeLeft)}
          </Text>
        </Box>

        {/* Botão de controle principal */}
        <Box w="90%" maxW="360">{renderControlButton()}</Box>

        {/* Botões adicionais */}
        {isActive && (
          <HStack space="4">
            <Button
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<Icon as={MaterialIcons} name="refresh" color="white" />}
              onPress={async () => { await triggerHaptic('impact'); resetTimer(); }}
            >
              Reiniciar
            </Button>
            <Button
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<Icon as={MaterialIcons} name="skip-next" color="white" />}
              onPress={async () => { await triggerHaptic('impact'); skipTimer(); }}
            >
              Pular
            </Button>
          </HStack>
        )}
      </VStack>

      {/* Estatísticas resumidas abaixo do card */}
      <HStack justifyContent="space-between" mt="4" px="2">
        <Text color="gray.600">
          Pomodoros: {stats.completedPomodoros}/{stats.totalPomodoros}
        </Text>
        <Text color="gray.600">
          Termina às: {estimatedEndTime}
        </Text>
      </HStack>
    </Box>
  );
};

export default PomodoroTimer;
