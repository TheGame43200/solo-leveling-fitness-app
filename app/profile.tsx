import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronRight, User } from 'lucide-react-native';
import { useAuth } from '@/context/auth';

export default function ProfileScreen() {
  const { userData, updateUserData, user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: userData?.name || '',
    age: userData?.age ? String(userData.age) : '',
    weight: userData?.weight ? String(userData.weight) : '',
    height: userData?.height ? String(userData.height) : '',
    gender: userData?.gender || '' as 'male' | 'female' | '',
  });

  const [errors, setErrors] = useState({
    name: false,
    age: false,
    weight: false,
    height: false,
    gender: false,
  });

  const [loading, setLoading] = useState(false);

  // Mettre à jour le state local quand les données utilisateur changent
  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.name || '',
        age: userData.age ? String(userData.age) : '',
        weight: userData.weight ? String(userData.weight) : '',
        height: userData.height ? String(userData.height) : '',
        gender: userData.gender || '',
      });
    }
  }, [userData]);

  const handleContinue = async () => {
    // Valider les entrées
    const newErrors = {
      name: !profile.name,
      age: !profile.age || parseInt(profile.age) <= 0 || parseInt(profile.age) > 120,
      weight: !profile.weight || parseFloat(profile.weight) <= 0,
      height: !profile.height || parseInt(profile.height) <= 0,
      gender: !profile.gender,
    };

    setErrors(newErrors);

    // Si pas d'erreurs, continuer vers la prochaine écran
    if (!Object.values(newErrors).some(error => error)) {
      setLoading(true);
      try {
        // Mise à jour du profil utilisateur
        const { error } = await updateUserData({
          name: profile.name,
          age: parseInt(profile.age),
          weight: parseFloat(profile.weight),
          height: parseInt(profile.height),
          gender: profile.gender as 'male' | 'female',
        });
        
        if (error) {
          Alert.alert(
            "Erreur de mise à jour",
            "Impossible de mettre à jour votre profil. Veuillez réessayer."
          );
        } else {
          // Si l'utilisateur n'a pas encore choisi un style de coaching, le rediriger
          if (!userData?.coaching_style) {
            router.push('/coaching-style');
          } else {
            router.replace('/(tabs)');
          }
        }
      } catch (error) {
        console.error('Profile update error:', error);
        Alert.alert(
          "Erreur",
          "Une erreur inattendue s'est produite. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
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
          <User color="#a855f7" size={32} />
          <Text style={styles.title}>Créer votre profil</Text>
          <Text style={styles.subtitle}>
            Ces informations nous aideront à personnaliser votre entraînement
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Entrez votre nom"
              placeholderTextColor="#9ca3af"
              value={profile.name}
              onChangeText={(text) => {
                setProfile({ ...profile, name: text });
                if (errors.name) setErrors({ ...errors, name: false });
              }}
            />
            {errors.name && (
              <Text style={styles.errorText}>Veuillez entrer votre nom</Text>
            )}
          </View>

          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Âge</Text>
            <TextInput
              style={[styles.input, errors.age && styles.inputError]}
              placeholder="Entrez votre âge"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={profile.age}
              onChangeText={(text) => {
                setProfile({ ...profile, age: text.replace(/[^0-9]/g, '') });
                if (errors.age) setErrors({ ...errors, age: false });
              }}
            />
            {errors.age && (
              <Text style={styles.errorText}>Veuillez entrer un âge valide</Text>
            )}
          </View>

          {/* Weight Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Poids (kg)</Text>
            <TextInput
              style={[styles.input, errors.weight && styles.inputError]}
              placeholder="Entrez votre poids en kg"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={profile.weight}
              onChangeText={(text) => {
                setProfile({ ...profile, weight: text.replace(/[^0-9.]/g, '') });
                if (errors.weight) setErrors({ ...errors, weight: false });
              }}
            />
            {errors.weight && (
              <Text style={styles.errorText}>Veuillez entrer un poids valide</Text>
            )}
          </View>

          {/* Height Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Taille (cm)</Text>
            <TextInput
              style={[styles.input, errors.height && styles.inputError]}
              placeholder="Entrez votre taille en cm"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={profile.height}
              onChangeText={(text) => {
                setProfile({ ...profile, height: text.replace(/[^0-9]/g, '') });
                if (errors.height) setErrors({ ...errors, height: false });
              }}
            />
            {errors.height && (
              <Text style={styles.errorText}>Veuillez entrer une taille valide</Text>
            )}
          </View>

          {/* Gender Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Sexe</Text>
            <View style={styles.genderContainer}>
              <Pressable
                style={[
                  styles.genderButton,
                  profile.gender === 'male' && styles.genderButtonSelected,
                ]}
                onPress={() => {
                  setProfile({ ...profile, gender: 'male' });
                  if (errors.gender) setErrors({ ...errors, gender: false });
                }}
              >
                <Text
                  style={[
                    styles.genderText,
                    profile.gender === 'male' && styles.genderTextSelected,
                  ]}
                >
                  Homme
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.genderButton,
                  profile.gender === 'female' && styles.genderButtonSelected,
                ]}
                onPress={() => {
                  setProfile({ ...profile, gender: 'female' });
                  if (errors.gender) setErrors({ ...errors, gender: false });
                }}
              >
                <Text
                  style={[
                    styles.genderText,
                    profile.gender === 'female' && styles.genderTextSelected,
                  ]}
                >
                  Femme
                </Text>
              </Pressable>
            </View>
            {errors.gender && (
              <Text style={styles.errorText}>Veuillez sélectionner votre sexe</Text>
            )}
          </View>
        </View>

        {/* Continue Button */}
        <Pressable 
          onPress={handleContinue}
          disabled={loading}
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
              <>
                <Text style={styles.buttonText}>Continuer</Text>
                <ChevronRight color="#fff" size={20} />
              </>
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
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#d4d4d8',
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e4e4e7',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 6,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  genderButtonSelected: {
    backgroundColor: 'rgba(126, 34, 206, 0.3)',
    borderColor: '#7e22ce',
  },
  genderText: {
    fontSize: 16,
    color: '#e4e4e7',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginHorizontal: 20,
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
    marginRight: 8,
  },
});