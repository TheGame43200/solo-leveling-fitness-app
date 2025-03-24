import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, TextInput, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Clock, Check, X, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';

// Type d'exercice
type Exercise = {
  id: string;
  name: string;
  description: string;
  repCount: number;
  completed: boolean;
};

// Exercices initiaux
const initialExercises: Exercise[] = [
  {
    id: 'pushups',
    name: 'Pompes',
    description: 'Faites le plus de pompes possible en 5 minutes',
    repCount: 0,
    completed: false,
  },
  {
    id: 'crunches',
    name: 'Crunchs',
    description: 'Faites le plus de crunchs possible en 5 minutes',
    repCount: 0,
    completed: false,
  },
  {
    id: 'squats',
    name: 'Squats',
    description: 'Faites le plus de squats possible en 5 minutes',
    repCount: 0,
    completed: false,
  },
  {
    id: 'burpees',
    name: 'Burpees',
    description: 'Faites le plus de burpees possible en 5 minutes',
    repCount: 0,
    completed: false,
  },
];

export default function EvaluationScreen() {
  const { userData, updateUserData } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes en secondes
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restTime, setRestTime] = useState<number>(60); // 1 minute de repos
  const [evaluationComplete, setEvaluationComplete] = useState<boolean>(false);
  const [showPushupOption, setShowPushupOption] = useState<boolean>(false);
  const [pushupType, setPushupType] = useState<'regular' | 'knee' | null>(null);
  const [isReadyPromptVisible, setIsReadyPromptVisible] = useState<boolean>(false);
  const [manualRepCount, setManualRepCount] = useState<string>('');
  const [savingResults, setSavingResults] = useState<boolean>(false);
  
  // Valeurs d'animation
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Démarrer le premier exercice
  const startExercise = (index: number) => {
    setCurrentExerciseIndex(index);
    setTimeLeft(300); // Réinitialiser le minuteur à 5 minutes
    
    // Si ce sont des pompes et que le type n'est pas encore sélectionné, montrer les options
    if (index === 0 && !pushupType) {
      setShowPushupOption(true);
      return;
    }
    
    // Montrer le prompt "prêt" au lieu de démarrer le minuteur immédiatement
    setIsReadyPromptVisible(true);
  };
  
  // Gérer la sélection du type de pompes
  const handlePushupTypeSelect = (type: 'regular' | 'knee') => {
    setPushupType(type);
    setShowPushupOption(false);
    setIsReadyPromptVisible(true);
  };
  
  // Gérer la confirmation "prêt"
  const handleReadyConfirm = () => {
    setIsReadyPromptVisible(false);
    startTimer();
  };
  
  // Fonction de minuteur
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          
          if (isResting) {
            // Période de repos terminée, passer à l'exercice suivant
            setIsResting(false);
            setCurrentExerciseIndex((prev) => {
              if (prev !== null && prev < exercises.length - 1) {
                return prev + 1;
              } else {
                // Tous les exercices sont terminés
                setEvaluationComplete(true);
                return prev;
              }
            });
            // Montrer le prompt "prêt" pour le prochain exercice
            setIsReadyPromptVisible(true);
          } else {
            // Exercice terminé, commencer la période de repos
            setIsResting(true);
            setRestTime(60);
            setManualRepCount(exercises[currentExerciseIndex!].repCount.toString());
            startRestTimer();
          }
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Minuteur de repos
  const startRestTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setRestTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          
          // Sauvegarder le nombre de répétitions entrées manuellement avant de passer à l'exercice suivant
          if (manualRepCount !== '') {
            setExercises((prevExercises) => {
              const newExercises = [...prevExercises];
              if (currentExerciseIndex !== null) {
                const repCount = parseInt(manualRepCount);
                if (!isNaN(repCount)) {
                  newExercises[currentExerciseIndex].repCount = repCount;
                }
              }
              return newExercises;
            });
          }
          
          // Vérifier s'il y a plus d'exercices
          setCurrentExerciseIndex((prev) => {
            if (prev !== null && prev < exercises.length - 1) {
              // Commencer l'exercice suivant après le repos
              const nextIndex = prev + 1;
              // Montrer le prompt "prêt" pour le prochain exercice
              setIsReadyPromptVisible(true);
              return nextIndex;
            } else {
              // Tous les exercices sont terminés
              setEvaluationComplete(true);
              return prev;
            }
          });
          
          setIsResting(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Mettre à jour le nombre de répétitions
  const updateRepCount = (increment: boolean = true) => {
    if (currentExerciseIndex === null) return;
    
    setExercises((prevExercises) => {
      const newExercises = [...prevExercises];
      if (increment) {
        newExercises[currentExerciseIndex].repCount += 1;
      } else if (newExercises[currentExerciseIndex].repCount > 0) {
        newExercises[currentExerciseIndex].repCount -= 1;
      }
      return newExercises;
    });
  };
  
  // Gérer le changement de nombre de répétitions manuel
  const handleManualRepCountChange = (text: string) => {
    // Autoriser uniquement les nombres
    if (/^\d*$/.test(text)) {
      setManualRepCount(text);
    }
  };
  
  // Enregistrer le nombre de répétitions manuel
  const saveManualRepCount = () => {
    if (currentExerciseIndex === null) return;
    
    const repCount = parseInt(manualRepCount);
    if (!isNaN(repCount)) {
      setExercises((prevExercises) => {
        const newExercises = [...prevExercises];
        newExercises[currentExerciseIndex].repCount = repCount;
        return newExercises;
      });
    }
  };
  
  // Terminer l'exercice manuellement
  const completeExercise = () => {
    if (currentExerciseIndex === null) return;
    
    // Effacer le minuteur
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Marquer l'exercice actuel comme terminé
    setExercises((prevExercises) => {
      const newExercises = [...prevExercises];
      newExercises[currentExerciseIndex].completed = true;
      return newExercises;
    });
    
    // Vérifier si c'était le dernier exercice
    if (currentExerciseIndex === exercises.length - 1) {
      setEvaluationComplete(true);
      return;
    }
    
    // Commencer la période de repos
    setIsResting(true);
    setRestTime(60);
    setManualRepCount(exercises[currentExerciseIndex].repCount.toString());
    startRestTimer();
  };
  
  // Formater le temps en MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculer et afficher le rang de l'utilisateur en fonction des performances
  const calculateRank = (): { rank: string; color: string } => {
    const totalReps = exercises.reduce((sum, exercise) => sum + exercise.repCount, 0);
    
    if (totalReps > 250) return { rank: 'B', color: '#3b82f6' }; // Bleu
    if (totalReps > 150) return { rank: 'C', color: '#22c55e' }; // Vert
    if (totalReps > 75) return { rank: 'D', color: '#eab308' }; // Jaune
    return { rank: 'E', color: '#ef4444' }; // Rouge
  };

  // Sauvegarder les résultats d'évaluation
  const saveEvaluationResults = async () => {
    if (!userData) return;

    setSavingResults(true);
    try {
      const { rank } = calculateRank();
      
      // Mettre à jour le rang de l'utilisateur
      const { error } = await updateUserData({ 
        rank: rank as 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
      });
      
      if (error) {
        Alert.alert(
          "Erreur",
          "Impossible de sauvegarder vos résultats. Veuillez réessayer."
        );
        return;
      }
      
      // Enregistrer les résultats d'exercice
      const totalReps = exercises.reduce((sum, exercise) => sum + exercise.repCount, 0);
      const exerciseData = {
        pushups: exercises.find(e => e.id === 'pushups')?.repCount || 0,
        crunches: exercises.find(e => e.id === 'crunches')?.repCount || 0,
        squats: exercises.find(e => e.id === 'squats')?.repCount || 0,
        burpees: exercises.find(e => e.id === 'burpees')?.repCount || 0,
      };
      
      // Enregistrer la session d'entraînement
      const { error: workoutError } = await supabase
        .from('workout_history')
        .insert({
          user_id: userData.id,
          name: 'Évaluation initiale',
          duration: exercises.length * 300, // 5 minutes par exercice
          points_earned: Math.round(totalReps / 10), // Points en fonction des répétitions
          completed: true,
          data: {
            type: 'evaluation',
            exercises: exerciseData
          }
        });
      
      if (workoutError) {
        console.error('Error saving workout history:', workoutError);
      }
      
      // Rediriger vers l'écran principal
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error in saving evaluation results:', error);
      Alert.alert(
        "Erreur",
        "Une erreur inattendue s'est produite. Veuillez réessayer."
      );
    } finally {
      setSavingResults(false);
    }
  };
  
  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Mettre à jour l'animation de progression
  useEffect(() => {
    if (currentExerciseIndex === null || isResting) return;
    
    Animated.timing(progressAnim, {
      toValue: 1 - timeLeft / 300,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, currentExerciseIndex, isResting]);
  
  const { rank, color } = calculateRank();

  return (
    <LinearGradient
      colors={['#0f1221', '#1d1d42', '#382161']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Évaluation Initiale</Text>
          <Text style={styles.subtitle}>
            Voyons de quoi vous êtes capable pour adapter votre programme
          </Text>
        </View>

        {/* Sélection du type de pompes */}
        {showPushupOption && (
          <View style={styles.optionContainer}>
            <Text style={styles.optionTitle}>Quel type de pompes préférez-vous ?</Text>
            
            <Pressable
              style={styles.optionButton}
              onPress={() => handlePushupTypeSelect('regular')}
            >
              <Text style={styles.optionButtonText}>Pompes classiques</Text>
            </Pressable>
            
            <Pressable
              style={styles.optionButton}
              onPress={() => handlePushupTypeSelect('knee')}
            >
              <Text style={styles.optionButtonText}>Pompes sur les genoux</Text>
            </Pressable>
          </View>
        )}

        {/* Prompt "prêt à commencer" */}
        {isReadyPromptVisible && currentExerciseIndex !== null && !evaluationComplete && !showPushupOption && (
          <View style={styles.readyPromptContainer}>
            <Text style={styles.readyPromptTitle}>
              Prêt à commencer l'exercice ?
            </Text>
            <Text style={styles.readyPromptExercise}>
              {exercises[currentExerciseIndex].name}
            </Text>
            <Text style={styles.readyPromptDesc}>
              {exercises[currentExerciseIndex].description}
            </Text>
            
            <Pressable 
              style={styles.readyButton}
              onPress={handleReadyConfirm}
            >
              <Text style={styles.readyButtonText}>Prêt</Text>
            </Pressable>
          </View>
        )}

        {/* Liste d'exercices quand aucun exercice n'est actif */}
        {currentExerciseIndex === null && !evaluationComplete && !showPushupOption && (
          <View style={styles.exerciseList}>
            {exercises.map((exercise, index) => (
              <Pressable 
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  exercise.completed && styles.completedExerciseCard
                ]}
                onPress={() => !exercise.completed && startExercise(index)}
                disabled={exercise.completed}
              >
                <View style={styles.exerciseCardContent}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                  
                  {exercise.completed ? (
                    <View style={styles.completedBadge}>
                      <Check size={16} color="#fff" />
                      <Text style={styles.completedText}>Complété - {exercise.repCount} reps</Text>
                    </View>
                  ) : (
                    <Text style={styles.tapToStart}>Appuyez pour commencer</Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Exercice actif */}
        {currentExerciseIndex !== null && !evaluationComplete && !showPushupOption && !isReadyPromptVisible && (
          <View style={styles.activeExerciseContainer}>
            {isResting ? (
              // Interface de période de repos avec nombre de répétitions manuel
              <View style={styles.restContainer}>
                <Text style={styles.restTitle}>Repos</Text>
                <Text style={styles.restTimer}>{formatTime(restTime)}</Text>
                
                <View style={styles.manualRepContainer}>
                  <Text style={styles.manualRepLabel}>
                    Entrez manuellement le nombre de {exercises[currentExerciseIndex].name.toLowerCase()} effectués:
                  </Text>
                  <View style={styles.manualRepInputContainer}>
                    <TextInput 
                      style={styles.manualRepInput}
                      keyboardType="number-pad"
                      value={manualRepCount}
                      onChangeText={handleManualRepCountChange}
                      onEndEditing={saveManualRepCount}
                    />
                  </View>
                </View>
                
                <Text style={styles.restMessage}>
                  Préparez-vous pour le prochain exercice
                </Text>
              </View>
            ) : (
              // Interface d'exercice actif
              <>
                <View style={styles.timerContainer}>
                  <Clock size={28} color="#a855f7" />
                  <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>
                
                <Text style={styles.activeExerciseName}>
                  {exercises[currentExerciseIndex].name}
                </Text>
                
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
                
                <View style={styles.repCountContainer}>
                  <Pressable 
                    style={styles.repButton}
                    onPress={() => updateRepCount(false)}
                  >
                    <Text style={styles.repButtonText}>-</Text>
                  </Pressable>
                  
                  <Text style={styles.repCount}>
                    {exercises[currentExerciseIndex].repCount}
                  </Text>
                  
                  <Pressable 
                    style={styles.repButton}
                    onPress={() => updateRepCount(true)}
                  >
                    <Text style={styles.repButtonText}>+</Text>
                  </Pressable>
                </View>
                
                <Pressable 
                  style={styles.completeButton}
                  onPress={completeExercise}
                >
                  <Text style={styles.completeButtonText}>Terminer</Text>
                </Pressable>
              </>
            )}
          </View>
        )}

        {/* Résultats d'évaluation */}
        {evaluationComplete && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Évaluation terminée!</Text>
            
            <View style={styles.rankContainer}>
              <LinearGradient
                colors={[color, color + '80']}
                style={styles.rankBadge}
              >
                <Text style={styles.rankText}>{rank}</Text>
              </LinearGradient>
              <Text style={styles.rankLabel}>Votre rang</Text>
            </View>
            
            <View style={styles.resultsStatsContainer}>
              {exercises.map((exercise) => (
                <View key={exercise.id} style={styles.resultStat}>
                  <Text style={styles.resultStatLabel}>{exercise.name}</Text>
                  <Text style={styles.resultStatValue}>{exercise.repCount}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.recommendationTitle}>Recommandations</Text>
            <Text style={styles.recommendationText}>
              Basé sur votre évaluation, nous avons créé un programme personnalisé.
              Continuez pour découvrir votre plan d'entraînement.
            </Text>
            
            <Pressable 
              style={styles.continueButton}
              onPress={saveEvaluationResults}
              disabled={savingResults}
            >
              <LinearGradient
                colors={['#7e22ce', '#6d28d9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                {savingResults ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.continueButtonText}>Voir mon programme</Text>
                    <ChevronRight color="#fff" size={20} />
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#d4d4d8',
    textAlign: 'center',
    maxWidth: '90%',
  },
  exerciseList: {
    marginTop: 10,
  },
  exerciseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  completedExerciseCard: {
    backgroundColor: 'rgba(21, 128, 61, 0.15)',
    borderColor: 'rgba(21, 128, 61, 0.4)',
  },
  exerciseCardContent: {
    padding: 20,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 15,
    color: '#d4d4d8',
    marginBottom: 16,
  },
  tapToStart: {
    fontSize: 14,
    color: '#a855f7',
    fontWeight: '500',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
    marginLeft: 6,
  },
  readyPromptContainer: {
    backgroundColor: 'rgba(126, 34, 206, 0.15)',
    borderRadius: 20,
    padding: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  readyPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  readyPromptExercise: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 10,
    textAlign: 'center',
  },
  readyPromptDesc: {
    fontSize: 16,
    color: '#d4d4d8',
    marginBottom: 30,
    textAlign: 'center',
  },
  readyButton: {
    backgroundColor: '#7e22ce',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  readyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeExerciseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  activeExerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
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
  repCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  repButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  repCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 30,
    minWidth: 80,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  restTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  restTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 20,
  },
  manualRepContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  manualRepLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  manualRepInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualRepInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: '40%',
    height: 50,
    borderRadius: 10,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restMessage: {
    fontSize: 16,
    color: '#d4d4d8',
    textAlign: 'center',
    marginTop: 10,
  },
  resultsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  rankContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  rankBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rankText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankLabel: {
    fontSize: 18,
    color: '#e4e4e7',
    fontWeight: '500',
  },
  resultsStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  resultStat: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  resultStatLabel: {
    fontSize: 16,
    color: '#d4d4d8',
    marginBottom: 8,
  },
  resultStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  recommendationText: {
    fontSize: 16,
    color: '#d4d4d8',
    lineHeight: 24,
    marginBottom: 30,
  },
  continueButton: {
    width: '100%',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#7e22ce',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  optionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: 'rgba(126, 34, 206, 0.3)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});