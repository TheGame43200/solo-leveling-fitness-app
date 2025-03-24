import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Mail, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });
  const { signIn } = useAuth();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    // Valider les entrées
    const newErrors = {
      email: !email || !validateEmail(email),
      password: !password || password.length < 6,
    };

    setErrors(newErrors);

    // Si pas d'erreurs, procéder à la connexion
    if (!newErrors.email && !newErrors.password) {
      setLoading(true);
      try {
        const { error } = await signIn(email, password);
        
        if (error) {
          Alert.alert(
            "Erreur de connexion",
            error.message || "Impossible de se connecter. Vérifiez vos identifiants."
          );
        }
      } catch (error) {
        console.error('Login error:', error);
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
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Bienvenue dans Solo Fitness. Connectez-vous pour accéder à votre programme d'entraînement personnalisé.
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
              <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez votre email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: false });
                }}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>Veuillez entrer une adresse email valide</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
              <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: false });
                }}
              />
            </View>
            {errors.password && (
              <Text style={styles.errorText}>Le mot de passe doit contenir au moins 6 caractères</Text>
            )}
          </View>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            styles.buttonContainer,
            pressed && { opacity: 0.8 }
          ]}
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
                <Text style={styles.buttonText}>Se connecter</Text>
                <ArrowRight color="#fff" size={20} />
              </>
            )}
          </LinearGradient>
        </Pressable>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Pas encore de compte ?</Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>S'inscrire</Text>
          </Pressable>
        </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#d4d4d8',
    textAlign: 'center',
    maxWidth: '90%',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e4e4e7',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapperError: {
    borderColor: '#ef4444',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 6,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#d4d4d8',
    fontSize: 16,
    marginRight: 5,
  },
  registerLink: {
    color: '#a855f7',
    fontSize: 16,
    fontWeight: '600',
  },
});