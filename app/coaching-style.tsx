import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, Shield, Dumbbell } from 'lucide-react-native';
import { useAuth } from '@/context/auth';

type CoachingStyle = 'bienveillant' | 'strict' | 'equilibre' | null;

export default function CoachingStyleScreen() {
  const { updateUserData } = useAuth();
  const [selectedStyle, setSelectedStyle] = useState<CoachingStyle>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedStyle) {
      setError(true);
      return;
    }
    
    setLoading(true);
    try {
      // Sauvegarder le style de coaching choisi
      const { error } = await updateUserData({ 
        coaching_style: selectedStyle 
      });
      
      if (error) {
        Alert.alert(
          "Erreur",
          "Impossible de sauvegarder votre style de coaching. Veuillez réessayer."
        );
      } else {
        // Si tout va bien, passer à l'évaluation
        router.push('/evaluation');
      }
    } catch (error) {
      console.error('Error saving coaching style:', error);
      Alert.alert(
        "Erreur",
        "Une erreur inattendue s'est produite. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>Choisissez votre style de coaching</Text>
          <Text style={styles.subtitle}>
            Sélectionnez l'approche qui vous motivera le plus
          </Text>
        </View>

        {/* Coaching Style Options */}
        <View style={styles.optionsContainer}>
          {/* Maître bienveillant */}
          <Pressable
            style={[
              styles.optionCard,
              selectedStyle === 'bienveillant' && styles.selectedCard,
            ]}
            onPress={() => {
              setSelectedStyle('bienveillant');
              setError(false);
            }}
          >
            <View style={styles.iconContainer}>
              <Heart 
                color={selectedStyle === 'bienveillant' ? '#fff' : '#a855f7'} 
                size={28} 
              />
            </View>
            <Text style={styles.optionTitle}>Maître bienveillant</Text>
            <Text style={styles.optionDescription}>
              Encouragements positifs et soutien constant pour progresser à votre rythme
            </Text>
            <View style={[
              styles.selectionIndicator,
              selectedStyle === 'bienveillant' && styles.selectedIndicator,
            ]} />
          </Pressable>

          {/* Coach strict */}
          <Pressable
            style={[
              styles.optionCard,
              selectedStyle === 'strict' && styles.selectedCard,
            ]}
            onPress={() => {
              setSelectedStyle('strict');
              setError(false);
            }}
          >
            <View style={styles.iconContainer}>
              <Dumbbell 
                color={selectedStyle === 'strict' ? '#fff' : '#a855f7'} 
                size={28} 
              />
            </View>
            <Text style={styles.optionTitle}>Coach strict</Text>
            <Text style={styles.optionDescription}>
              Discipline et exigence pour repousser vos limites et maximiser vos résultats
            </Text>
            <View style={[
              styles.selectionIndicator,
              selectedStyle === 'strict' && styles.selectedIndicator,
            ]} />
          </Pressable>

          {/* Mode équilibré */}
          <Pressable
            style={[
              styles.optionCard,
              selectedStyle === 'equilibre' && styles.selectedCard,
            ]}
            onPress={() => {
              setSelectedStyle('equilibre');
              setError(false);
            }}
          >
            <View style={styles.iconContainer}>
              <Shield 
                color={selectedStyle === 'equilibre' ? '#fff' : '#a855f7'} 
                size={28} 
              />
            </View>
            <Text style={styles.optionTitle}>Mode équilibré</Text>
            <Text style={styles.optionDescription}>
              Un mélange adaptatif qui ajuste le style de coaching selon vos performances
            </Text>
            <View style={[
              styles.selectionIndicator,
              selectedStyle === 'equilibre' && styles.selectedIndicator,
            ]} />
          </Pressable>
        </View>

        {error && (
          <Text style={styles.errorText}>
            Veuillez sélectionner un style de coaching
          </Text>
        )}

        {/* Continue Button */}
        <Pressable 
          onPress={handleContinue}
          disabled={loading}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={['#7e22ce', '#6d28d9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Continuer</Text>
            )}
          </LinearGradient>
        </Pressable>
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
    marginBottom: 40,
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
  optionsContainer: {
    marginBottom: 30,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCard: {
    backgroundColor: 'rgba(126, 34, 206, 0.2)',
    borderColor: '#7e22ce',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 15,
    color: '#d4d4d8',
    lineHeight: 22,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  selectedIndicator: {
    backgroundColor: '#7e22ce',
    borderColor: '#fff',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    width: '100%',
  },
  button: {
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});