import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, CircleCheck as CheckCircle, ChevronRight, X, MessageSquare } from 'lucide-react-native';

// Mock workout data - in a real app this would come from context/state
const mockWorkout = {
  name: 'Full Body Challenge',
  exercises: [
    { id: 1, name: 'Pompes', sets: 3, reps: 10 },
    { id: 2, name: 'Squats', sets: 3, reps: 10 },
    { id: 3, name: 'Abdos', sets: 3, reps: 10 },
  ]
};

export default function SessionScreen() {
  // Session state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<'warmup' | 'exercise' | 'rest' | 'completed'>('warmup');
  const [timer, setTimer] = useState(300); // 5 minutes for warmup
  const [isPaused, setIsPaused] = useState(false);
  const [completedSets, setCompletedSets] = useState<{[key: string]: boolean[]}>({});
  const [feedbackModal, setFeedbackModal] = useState(false);
  
  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize completed sets tracking
  useEffect(() => {
    const initialCompletedSets: {[key: string]: boolean[]} = {};
    mockWorkout.exercises.forEach(exercise => {
      initialCompletedSets[exercise.id] = Array(exercise.sets).fill(false);
    });
    setCompletedSets(initialCompletedSets);
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (isPaused) return;
    
    if (timer > 0) {
      timerInterval.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      // Timer finished
      if (sessionStatus === 'warmup') {
        // Start the first exercise
        setSessionStatus('exercise');
        setTimer(0); // No timer for exercise mode
      } else if (sessionStatus === 'rest') {
        // Move to next set or exercise
        setSessionStatus('exercise');
        setTimer(0);
      }
    }
    
    // Clear interval on component unmount or status change
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [timer, isPaused, sessionStatus]);
  
  // Update progress animation
  useEffect(() => {
    let maxTime = 0;
    if (sessionStatus === 'warmup') maxTime = 300;
    else if (sessionStatus === 'rest') maxTime = 60;
    
    if (maxTime > 0) {
      Animated.timing(progressAnim, {
        toValue: 1 - timer / maxTime,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [timer, sessionStatus]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Complete current set and handle progression
  const completeSet = () => {
    const currentExercise = mockWorkout.exercises[currentExerciseIndex];
    
    // Mark current set as completed
    setCompletedSets(prev => {
      const newCompletedSets = {...prev};
      newCompletedSets[currentExercise.id][currentSetIndex] = true;
      return newCompletedSets;
    });
    
    // Check if all sets for this exercise are completed
    const isLastSet = currentSetIndex === currentExercise.sets - 1;
    const isLastExercise = currentExerciseIndex === mockWorkout.exercises.length - 1;
    
    if (isLastSet) {
      if (isLastExercise) {
        // Workout completed
        setSessionStatus('completed');
      } else {
        // Move to next exercise
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSetIndex(0);
      }
    } else {
      // Move to next set
      setCurrentSetIndex(prev => prev + 1);
    }
    
    // Start rest period
    setSessionStatus('rest');
    setTimer(60); // 60 seconds rest
  };
  
  // Get current exercise
  const currentExercise = mockWorkout.exercises[currentExerciseIndex];
  
  // Calculate completion percentage
  const calculateCompletionPercentage = (): number => {
    let totalSets = 0;
    let completedSetsCount = 0;
    
    Object.values(completedSets).forEach(sets => {
      totalSets += sets.length;
      completedSetsCount += sets.filter(completed => completed).length;
    });
    
    return totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;
  };
  
  // Get motivational message based on completion percentage
  const getMotivationalMessage = (): string => {
    const percentage = calculateCompletionPercentage();
    
    if (percentage === 0) return "C'est parti ! Montrez de quoi vous êtes capable.";
    if (percentage < 25) return "Bon début ! Continuez comme ça.";
    if (percentage < 50) return "Vous êtes sur la bonne voie. Ne lâchez rien !";
    if (percentage < 75) return "Plus de la moitié ! Vous pouvez le faire.";
    if (percentage < 100) return "Presque fini ! Donnez tout ce qu'il vous reste.";
    return "Incroyable ! Vous avez complété l'entraînement.";
  };
  
  // Handle session end
  const handleSessionEnd = () => {
    setFeedbackModal(true);
  };
  
  // Submit feedback and return to training screen
  const submitFeedback = () => {
    // In a real app, you would save the session data to state/storage
    router.replace('/training');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{mockWorkout.name}</Text>
        
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#fff" />
        </Pressable>
      </View>
      
      {/* Main content */}
      {sessionStatus === 'warmup' && (
        <View style={styles.warmupContainer}>
          <Text style={styles.warmupTitle}>Échauffement</Text>
          <Text style={styles.warmupTimer}>{formatTime(timer)}</Text>
          
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }) }
              ]} 
            />
          </View>
          
          <Text style={styles.warmupInstructions}>
            Suivez ces exercices d'échauffement :
          </Text>
          
          <View style={styles.warmupSteps}>
            <Text style={styles.warmupStep}>• Rotation des épaules (30 sec)</Text>
            <Text style={styles.warmupStep}>• Jumping jacks légers (1 min)</Text>
            <Text style={styles.warmupStep}>• Rotation du tronc (30 sec)</Text>
            <Text style={styles.warmupStep}>• Marche sur place (1 min)</Text>
            <Text style={styles.warmupStep}>• Étirements dynamiques (2 min)</Text>
          </View>
          
          <Pressable 
            style={styles.skipButton}
            onPress={() => {
              setTimer(0);
              setSessionStatus('exercise');
            }}
          >
            <Text style={styles.skipButtonText}>Passer l'échauffement</Text>
          </Pressable>
        </View>
      )}
      
      {sessionStatus === 'exercise' && (
        <View style={styles.exerciseContainer}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseSet}>
              Série {currentSetIndex + 1}/{currentExercise.sets}
            </Text>
          </View>
          
          <View style={styles.repCountContainer}>
            <Text style={styles.repCount}>{currentExercise.reps}</Text>
            <Text style={styles.repLabel}>répétitions</Text>
          </View>
          
          <View style={styles.setsProgressContainer}>
            {Array.from({ length: currentExercise.sets }).map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.setIndicator,
                  completedSets[currentExercise.id]?.[index] && styles.completedSetIndicator,
                  index === currentSetIndex && styles.currentSetIndicator
                ]}
              />
            ))}
          </View>
          
          <Pressable 
            style={styles.completeButton}
            onPress={completeSet}
          >
            <LinearGradient
              colors={['#7e22ce', '#6d28d9']}
              style={styles.completeButtonGradient}
            >
              <CheckCircle size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Série terminée</Text>
            </LinearGradient>
          </Pressable>
          
          <View style={styles.motivationContainer}>
            <Text style={styles.motivationText}>
              {getMotivationalMessage()}
            </Text>
          </View>
        </View>
      )}
      
      {sessionStatus === 'rest' && (
        <View style={styles.restContainer}>
          <Text style={styles.restTitle}>Repos</Text>
          <Text style={styles.restTimer}>{formatTime(timer)}</Text>
          
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }) }
              ]} 
            />
          </View>
          
          <Text style={styles.restMessage}>
            Récupérez et préparez-vous pour la prochaine série
          </Text>
          
          <View style={styles.pauseButtonsContainer}>
            <Pressable 
              style={[styles.pauseButton, isPaused ? styles.pauseButtonActive : null]}
              onPress={() => setIsPaused(!isPaused)}
            >
              {isPaused ? (
                <Play size={20} color="#fff" />
              ) : (
                <Pause size={20} color="#fff" />
              )}
            </Pressable>
            
            <Pressable 
              style={styles.skipButton}
              onPress={() => {
                setTimer(0);
                setSessionStatus('exercise');
              }}
            >
              <Text style={styles.skipButtonText}>Passer</Text>
              <ChevronRight size={16} color="#a855f7" />
            </Pressable>
          </View>
          
          <View style={styles.nextExerciseContainer}>
            <Text style={styles.nextExerciseLabel}>À suivre :</Text>
            <Text style={styles.nextExerciseName}>
              {mockWorkout.exercises[currentExerciseIndex].name} - Série {currentSetIndex + 1}
            </Text>
          </View>
        </View>
      )}
      
      {sessionStatus === 'completed' && (
        <View style={styles.completedContainer}>
          <LinearGradient
            colors={['rgba(126, 34, 206, 0.2)', 'rgba(126, 34, 206, 0.05)']}
            style={styles.completedBadge}
          >
            <CheckCircle size={40} color="#a855f7" />
          </LinearGradient>
          
          <Text style={styles.completedTitle}>Entraînement terminé!</Text>
          <Text style={styles.completedMessage}>
            Félicitations ! Vous avez terminé l'entraînement avec succès.
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {mockWorkout.exercises.reduce((total, ex) => total + ex.sets, 0)}
              </Text>
              <Text style={styles.statLabel}>Séries</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {mockWorkout.exercises.reduce((total, ex) => total + (ex.sets * ex.reps), 0)}
              </Text>
              <Text style={styles.statLabel}>Répétitions</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>+15</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
          
          <Pressable 
            style={styles.feedbackButton}
            onPress={handleSessionEnd}
          >
            <MessageSquare size={20} color="#fff" />
            <Text style={styles.feedbackButtonText}>Partager votre ressenti</Text>
          </Pressable>
          
          <Pressable 
            style={styles.returnButton}
            onPress={() => router.replace('/training')}
          >
            <Text style={styles.returnButtonText}>Retour aux entraînements</Text>
          </Pressable>
        </View>
      )}
      
      {/* Feedback Modal */}
      {feedbackModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Comment vous sentez-vous ?</Text>
            
            <View style={styles.feedbackOptions}>
              <Pressable style={styles.feedbackOption} onPress={submitFeedback}>
                <Text style={styles.feedbackOptionText}>Fatigué</Text>
              </Pressable>
              
              <Pressable style={styles.feedbackOption} onPress={submitFeedback}>
                <Text style={styles.feedbackOptionText}>Motivé</Text>
              </Pressable>
              
              <Pressable style={styles.feedbackOption} onPress={submitFeedback}>
                <Text style={styles.feedbackOptionText}>Trop facile</Text>
              </Pressable>
              
              <Pressable style={styles.feedbackOption} onPress={submitFeedback}>
                <Text style={styles.feedbackOptionText}>Trop difficile</Text>
              </Pressable>
            </View>
            
            <Pressable 
              style={styles.modalCloseButton}
              onPress={() => router.replace('/training')}
            >
              <Text style={styles.modalCloseButtonText}>Ignorer</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1221',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
  },
  warmupContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warmupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  warmupTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    width: '100%',
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#a855f7',
    borderRadius: 5,
  },
  warmupInstructions: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  warmupSteps: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  warmupStep: {
    fontSize: 16,
    color: '#d4d4d8',
    marginBottom: 8,
    lineHeight: 24,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#a855f7',
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  exerciseHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  exerciseSet: {
    fontSize: 18,
    color: '#d4d4d8',
  },
  repCountContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  repCount: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#a855f7',
  },
  repLabel: {
    fontSize: 18,
    color: '#d4d4d8',
  },
  setsProgressContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  setIndicator: {
    width: 30,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
  },
  completedSetIndicator: {
    backgroundColor: '#22c55e',
  },
  currentSetIndicator: {
    backgroundColor: '#a855f7',
  },
  completeButton: {
    width: '100%',
    marginBottom: 30,
    borderRadius: 30,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  motivationContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
  },
  motivationText: {
    color: '#e4e4e7',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  restContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  restTimer: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 20,
  },
  restMessage: {
    fontSize: 16,
    color: '#d4d4d8',
    textAlign: 'center',
    marginBottom: 30,
  },
  pauseButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  pauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(126, 34, 206, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  pauseButtonActive: {
    backgroundColor: '#7e22ce',
  },
  nextExerciseContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
    alignItems: 'center',
  },
  nextExerciseLabel: {
    fontSize: 14,
    color: '#d4d4d8',
    marginBottom: 5,
  },
  nextExerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  completedContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  completedMessage: {
    fontSize: 16,
    color: '#d4d4d8',
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#d4d4d8',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7e22ce',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 15,
    width: '100%',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  returnButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  returnButtonText: {
    color: '#e4e4e7',
    fontSize: 16,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(126, 34, 206, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  feedbackOptions: {
    width: '100%',
    marginBottom: 20,
  },
  feedbackOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  feedbackOptionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    paddingVertical: 10,
  },
  modalCloseButtonText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});