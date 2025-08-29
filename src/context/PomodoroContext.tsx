import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from 'native-base';
import { loadPomodoroStats, savePomodoroStats } from '../storage/pomodoroStorage';
import { PomodoroStats } from '../types';

// Tipos de timer
export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

// Configurações padrão do timer
const DEFAULT_TIMES = {
  pomodoro: 25 * 60, // 25 minutos em segundos
  shortBreak: 5 * 60, // 5 minutos em segundos
  longBreak: 15 * 60, // 15 minutos em segundos
};

// Estatísticas do Pomodoro movidas para src/types

// Interface para o contexto do Pomodoro
interface PomodoroContextType {
  currentMode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  stats: PomodoroStats;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  setMode: (mode: TimerMode) => void;
  estimatedEndTime: string;
  setTotalPomodoros: (total: number) => void;
}

// Criação do contexto
const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

// Provider do contexto
export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados
  const [currentMode, setCurrentMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.pomodoro);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState<PomodoroStats>({
    completedPomodoros: 0,
    totalPomodoros: 0,
  });
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();

  // Carregar estatísticas do armazenamento
  useEffect(() => {
    const loadStats = async () => {
      try {
        const loadedStats = await loadPomodoroStats();
        if (loadedStats) {
          setStats(loadedStats);
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas do Pomodoro:', error);
      }
    };
    
    loadStats();
  }, []);

  // Salvar estatísticas no armazenamento
  useEffect(() => {
    const saveStats = async () => {
      try {
        await savePomodoroStats(stats);
      } catch (error) {
        console.error('Erro ao salvar estatísticas do Pomodoro:', error);
      }
    };
    
  saveStats();
  }, [stats]);

  // Definir o modo do timer (precisa vir antes de usos)
  const setMode = useCallback((mode: TimerMode) => {
    setCurrentMode(mode);
    setTimeLeft(DEFAULT_TIMES[mode]);
    setIsActive(false);
    setIsPaused(false);
  }, []);

  // Lidar com a conclusão do timer (usa setMode)
  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    
    // Notificar o usuário
    toast.show({
      description: `${currentMode === 'pomodoro' ? 'Tempo de foco' : 'Tempo de pausa'} concluído!`,
      placement: 'top',
    });

    // Atualizar estatísticas se for um pomodoro concluído
    if (currentMode === 'pomodoro') {
      setStats(prev => ({
        ...prev,
        completedPomodoros: prev.completedPomodoros + 1
      }));
    }

    // Alternar automaticamente para o próximo modo
    if (currentMode === 'pomodoro') {
      // Após um pomodoro, ir para uma pausa curta
      setMode('shortBreak');
    } else {
      // Após uma pausa, voltar para o pomodoro
      setMode('pomodoro');
    }
  }, [currentMode, setMode, toast]);

  // Efeito para o timer (usa handleTimerComplete)
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft, handleTimerComplete]);

  // Iniciar o timer
  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  // Pausar o timer
  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  // Resetar o timer
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(DEFAULT_TIMES[currentMode]);
  };

  // Pular para o próximo timer
  const skipTimer = () => {
    resetTimer();
    if (currentMode === 'pomodoro') {
      setMode('shortBreak');
    } else if (currentMode === 'shortBreak') {
      setMode('longBreak');
    } else {
      setMode('pomodoro');
    }
  };

  // Definir o total de pomodoros planejados
  const setTotalPomodoros = (total: number) => {
    setStats(prev => ({
      ...prev,
      totalPomodoros: total
    }));
  };

  // Calcular o horário estimado de término
  const calculateEstimatedEndTime = (): string => {
    if (stats.totalPomodoros <= stats.completedPomodoros) {
      return '--:--';
    }

    const remainingPomodoros = stats.totalPomodoros - stats.completedPomodoros;
    const currentTimeInSeconds = isActive && currentMode === 'pomodoro' ? timeLeft : 0;
    const totalRemainingSeconds = (remainingPomodoros * DEFAULT_TIMES.pomodoro) - currentTimeInSeconds;
    
    const now = new Date();
    const endTime = new Date(now.getTime() + totalRemainingSeconds * 1000);
    
    return endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const estimatedEndTime = calculateEstimatedEndTime();

  // Valor do contexto
  const value: PomodoroContextType = {
    currentMode,
    timeLeft,
    isActive,
    isPaused,
    stats,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setMode,
    estimatedEndTime,
    setTotalPomodoros,
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const usePomodoro = (): PomodoroContextType => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro deve ser usado dentro de um PomodoroProvider');
  }
  return context;
};
