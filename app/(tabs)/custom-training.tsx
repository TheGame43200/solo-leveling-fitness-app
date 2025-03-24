import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Check, CreditCard as Edit, ChevronRight, Clock, Award } from 'lucide-react-native';
import { router } from 'expo-router';

export default function CustomTrainingScreen() {
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Pompes', sets: 3, reps: 10, enabled: true },
    { id: 2, name: 'Squats', sets: 3, reps: 12, enabled: true },
    { id: 3, name: 'Abdos', sets: 3, reps: 15, enabled: true },
    { id: 4, name: 'Burpees', sets: 2, reps: 8, enabled: false },
    { id: 5, name: 'Mountain Climbers', sets: 3, reps: 20, enabled: false },
    { id: 6, name: 'Jumping Jacks', sets: 3, reps: 25, enabled: false },
  ]);
  
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseSets, setNewExerciseSets] = useState('3');
  const [newExerciseReps, setNewExerciseReps] = useState('10');
  
  const toggleExercise = (id: number) => {
    setExercises(
      exercises.map(exercise => 
        exercise.id === id ? { ...exercise, enabled: !exercise.enabled } : exercise
      )
    );
  };
  
  const addExercise = () => {
    if (newExerciseName.trim() === '') return;
    
    const newId = Math.max(...exercises.map(e => e.id), 0) + 1;
    const newExercise = {
      id: newId,
      name: newExerciseName,
      sets: parseInt(newExerciseSets) || 3,
      reps: parseInt(newExerciseReps) || 10,
      enabled: true
    };
    
    setExercises([...exercises, newExercise]);
    setNewExerciseName('');
    setNewExerciseSets('3');
    setNewExerciseReps('10');
    setShowAddExercise(false);
  };
  
  const enabledExercises = exercises.filter(e => e.enabled);
  const disabledExercises = exercises.filter(e => !e.enabled);
  
  // Calculate estimated workout duration (rough estimate)
  const calculateDuration = () => {
    const totalSets = enabledExercises.reduce((sum, exercise) => sum + exercise.sets, 0);
    // Estimate: each set takes ~1 minute + 30 seconds rest
    const estimatedMinutes = Math.ceil(totalSets * 1.5);
    return estimatedMinutes;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Entraînement personnalisé</Text>
          <Text style={styles.subtitle}>
            Créez votre propre routine d'exercices
          </Text>
        </View>
        
        {/* Exercise List Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Exercices sélectionnés</Text>
          
          {enabledExercises.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Aucun exercice sélectionné. Ajoutez des exercices depuis la liste ci-dessous.
              </Text>
            </View>
          ) : (
            enabledExercises.map(exercise => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} séries x {exercise.reps} répétitions
                  </Text>
                </View>
                
                <Pressable 
                  style={styles.exerciseActionButton}
                  onPress={() => toggleExercise(exercise.id)}
                >
                  <View style={[styles.actionButtonInner, styles.removeButton]}>
                    <Check size={16} color="#fff" />
                  </View>
                </Pressable>
              </View>
            ))
          )}
        </View>
        
        {/* Available Exercises Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Exercices disponibles</Text>
          
          {disabledExercises.map(exercise => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.sets} séries x {exercise.reps} répétitions
                </Text>
              </View>
              
              <Pressable 
                style={styles.exerciseActionButton}
                onPress={() => toggleExercise(exercise.id)}
              >
                <View style={[styles.actionButtonInner, styles.addButton]}>
                  <Plus size={16} color="#fff" />
                </View>
              </Pressable>
            </View>
          ))}
          
          {/* Add Custom Exercise Button */}
          {!showAddExercise ? (
            <Pressable 
              style={styles.addExerciseButton}
              onPress={() => setShowAddExercise(true)}
            >
              <Text style={styles.addExerciseText}>Ajouter un exercice personnalisé</Text>
              <Plus size={18} color="#a855f7" />
            </Pressable>
          ) : (
            <View style={styles.addExerciseForm}>
              <TextInput
                style={styles.input}
                placeholder="Nom de l'exercice"
                placeholderTextColor="#9ca3af"
                value={newExerciseName}
                onChangeText={setNewExerciseName}
              />
              
              <View style={styles.numberInputsContainer}>
                <View style={styles.numberInputGroup}>
                  <Text style={styles.inputLabel}>Séries</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    placeholder="3"
                    placeholderTextColor="#9ca3af"
                    value={newExerciseSets}
                    onChangeText={setNewExerciseSets}
                  />
                </View>
                
                <View style={styles.numberInputGroup}>
                  <Text style={styles.inputLabel}>Répétitions</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    placeholder="10"
                    placeholderTextColor="#9ca3af"
                    value={newExerciseReps}
                    onChangeText={setNewExerciseReps}
                  />
                </View>
              </View>
              
              <View style={styles.formButtons}>
                <Pressable 
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowAddExercise(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.formButton, styles.submitButton]}
                  onPress={addExercise}
                >
                  <Text style={styles.submitButtonText}>Ajouter</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
        
        {/* Workout Summary */}
        {enabledExercises.length > 0 && (
          <View style={styles.summarySectionContainer}>
            <Text style={styles.sectionTitle}>Résumé de l'entraînement</Text>
            
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={['rgba(126, 34, 206, 0.2)', 'rgba(126, 34, 206, 0.1)']}
                style={styles.summaryCardInner}
              >
                <Text style={styles.summaryTitle}>Entraînement personnalisé</Text>
                
                <View style={styles.summaryStats}>
                  <View style={styles.summaryStat}>
                    <Clock size={16} color="#d4d4d8" />
                    <Text style={styles.summaryStatText}>
                      ~{calculateDuration()} min
                    </Text>
                  </View>
                  
                  <View style={styles.summaryStat}>
                    <Award size={16} color="#d4d4d8" />
                    <Text style={styles.summaryStatText}>
                      +{enabledExercises.length * 5} points estimés
                    </Text>
                  </View>
                </View>
                
                <Pressable 
                  style={styles.startTrainingButton}
                  onPress={() => router.push('/training/session')}
                >
                  <LinearGradient
                    colors={['#7e22ce', '#6d28d9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startTrainingButtonGradient}
                  >
                    <Text style={styles.startTrainingButtonText}>
                      Commencer l'entraînement
                    </Text>
                    <ChevronRight size={18} color="#fff" />
                  </LinearGradient>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        )}
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
  sectionContainer: {
    marginBottom: 25,
  },
  summarySectionContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyStateText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 14,
  },
  exerciseItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#9ca3af',
  },
  exerciseActionButton: {
    marginLeft: 10,
  },
  actionButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#22c55e',
  },
  removeButton: {
    backgroundColor: '#7e22ce',
  },
  addExerciseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addExerciseText: {
    color: '#a855f7',
    fontSize: 15,
    fontWeight: '500',
  },
  addExerciseForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
  },
  numberInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  numberInputGroup: {
    width: '48%',
  },
  inputLabel: {
    color: '#d4d4d8',
    marginBottom: 6,
    fontSize: 14,
  },
  numberInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#7e22ce',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#d4d4d8',
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  summaryCardInner: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  summaryStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  summaryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  summaryStatText: {
    fontSize: 14,
    color: '#d4d4d8',
    marginLeft: 6,
  },
  startTrainingButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  startTrainingButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  startTrainingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
});