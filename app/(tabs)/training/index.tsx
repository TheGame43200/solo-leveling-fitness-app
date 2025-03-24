import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Play, Plus, Minus, ChevronRight, Clock, Award, ChartBar as BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TrainingScreen() {
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [exerciseGoals, setExerciseGoals] = useState({
    pushups: 10,
    squats: 10,
    situps: 10,
  });

  // Sample workout data
  const workouts = [
    {
      id: 1,
      name: 'Full Body Challenge',
      description: 'Un entraînement complet pour renforcer tout le corps',
      duration: '25 min',
      points: 15,
      exercises: [
        { name: 'Pompes', sets: 3, reps: exerciseGoals.pushups },
        { name: 'Squats', sets: 3, reps: exerciseGoals.squats },
        { name: 'Abdos', sets: 3, reps: exerciseGoals.situps },
      ],
    },
    {
      id: 2,
      name: 'Cardio Intense',
      description: 'Brûlez des calories avec cet entraînement cardio',
      duration: '20 min',
      points: 12,
      exercises: [
        { name: 'Jumping Jacks', sets: 4, reps: 20 },
        { name: 'Mountain Climbers', sets: 3, reps: 15 },
        { name: 'Burpees', sets: 2, reps: 10 },
      ],
    },
  ];

  const updateExerciseGoal = (exercise: keyof typeof exerciseGoals, increment: boolean) => {
    setExerciseGoals(prev => ({
      ...prev,
      [exercise]: increment ? prev[exercise] + 5 : Math.max(5, prev[exercise] - 5),
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Entraînements disponibles</Text>
          <Text style={styles.subtitle}>
            Choisissez votre défi du jour
          </Text>
        </View>

        {/* Workouts list */}
        <View style={styles.workoutsList}>
          {workouts.map(workout => (
            <Pressable
              key={workout.id}
              style={[
                styles.workoutCard,
                selectedWorkout === workout.id && styles.selectedWorkoutCard
              ]}
              onPress={() => setSelectedWorkout(workout.id)}
            >
              <View style={styles.workoutCardHeader}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <View style={styles.workoutStats}>
                  <View style={styles.workoutStat}>
                    <Clock size={14} color="#d4d4d8" />
                    <Text style={styles.workoutStatText}>{workout.duration}</Text>
                  </View>
                  <View style={styles.workoutStat}>
                    <Award size={14} color="#d4d4d8" />
                    <Text style={styles.workoutStatText}>+{workout.points} pts</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.workoutDescription}>
                {workout.description}
              </Text>

              {selectedWorkout === workout.id && (
                <View style={styles.workoutDetails}>
                  <Text style={styles.workoutExercisesTitle}>Exercices:</Text>
                  {workout.exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.sets} séries x {exercise.reps} répétitions
                      </Text>
                    </View>
                  ))}

                  <Link href="/training/session" asChild>
                    <Pressable style={styles.startButton}>
                      <LinearGradient
                        colors={['#7e22ce', '#6d28d9']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.startButtonGradient}
                      >
                        <Play size={16} color="#fff" />
                        <Text style={styles.startButtonText}>Commencer</Text>
                      </LinearGradient>
                    </Pressable>
                  </Link>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Goal setting section */}
        <View style={styles.goalSection}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={20} color="#a855f7" />
            <Text style={styles.sectionTitle}>Définir vos objectifs</Text>
          </View>

          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>Définissez le nombre de répétitions par série</Text>
            
            <View style={styles.goalItem}>
              <Text style={styles.goalItemLabel}>Pompes</Text>
              <View style={styles.goalControls}>
                <Pressable 
                  style={styles.goalButton}
                  onPress={() => updateExerciseGoal('pushups', false)}
                >
                  <Minus size={16} color="#fff" />
                </Pressable>
                <Text style={styles.goalValue}>{exerciseGoals.pushups}</Text>
                <Pressable 
                  style={styles.goalButton}
                  onPress={() => updateExerciseGoal('pushups', true)}
                >
                  <Plus size={16} color="#fff" />
                </Pressable>
              </View>
            </View>

            <View style={styles.goalItem}>
              <Text style={styles.goalItemLabel}>Squats</Text>
              <View style={styles.goalControls}>
                <Pressable 
                  style={styles.goalButton}
                  onPress={() => updateExerciseGoal('squats', false)}
                >
                  <Minus size={16} color="#fff" />
                </Pressable>
                <Text style={styles.goalValue}>{exerciseGoals.squats}</Text>
                <Pressable 
                  style={styles.goalButton}
                  onPress={() => updateExerciseGoal('squats', true)}
                >
                  <Plus size={16} color="#fff" />
                </Pressable>
              </View>
            </View>

            <View style={styles.goalItem}>
              <Text style={styles.goalItemLabel}>Abdos</Text>
              <View style={styles.goalControls}>
                <Pressable 
                  style={styles.goalButton}
                  onPress={() => updateExerciseGoal('situps', false)}
                >
                  <Minus size={16} color="#fff" />
                </Pressable>
                <Text style={styles.goalValue}>{exerciseGoals.situps}</Text>
                <Pressable 
                  style={styles.goalButton}
                  onPress={() => updateExerciseGoal('situps', true)}
                >
                  <Plus size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Custom workout button */}
        <View style={styles.customWorkoutContainer}>
          <Pressable style={styles.customWorkoutButton}>
            <Text style={styles.customWorkoutText}>Créer un entraînement personnalisé</Text>
            <ChevronRight size={20} color="#a855f7" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1221',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#d4d4d8',
  },
  workoutsList: {
    marginBottom: 30,
  },
  workoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  selectedWorkoutCard: {
    borderColor: '#7e22ce',
    backgroundColor: 'rgba(126, 34, 206, 0.1)',
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  workoutStats: {
    flexDirection: 'row',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  workoutStatText: {
    fontSize: 14,
    color: '#d4d4d8',
    marginLeft: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#d4d4d8',
    marginBottom: 15,
  },
  workoutDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 15,
    marginTop: 5,
  },
  workoutExercisesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  exerciseItem: {
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#d4d4d8',
  },
  startButton: {
    marginTop: 15,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 30,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  goalSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalItemLabel: {
    fontSize: 16,
    color: '#e4e4e7',
  },
  goalControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(126, 34, 206, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 40,
    textAlign: 'center',
  },
  customWorkoutContainer: {
    marginBottom: 30,
  },
  customWorkoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  customWorkoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});