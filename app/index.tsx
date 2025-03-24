import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/context/auth';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { session, loading } = useAuth();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = React.useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = React.useRef(new Animated.Value(0)).current;

  // Rediriger l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace('/(tabs)');
      }
    }
  }, [session, loading]);

  useEffect(() => {
    // Animations séquentielles
    Animated.sequence([
      // Fade in et agrandissement du logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      // Fade in du texte
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
      // Fade in du bouton
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Rediriger vers la page de connexion
  const handleStart = () => {
    router.push('/login');
  };

  // Afficher un écran de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#0f1221', '#1d1d42', '#382161']}
      style={styles.container}
    >
      {/* Effet d'animation pour le logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>SL</Text>
        </View>
        <View style={styles.logoShadow} />
      </Animated.View>

      {/* Texte animé */}
      <Animated.View style={{ opacity: textFadeAnim }}>
        <Text style={styles.title}>Solo Fitness</Text>
        <Text style={styles.slogan}>Éveille ton potentiel, deviens plus fort !</Text>
      </Animated.View>

      {/* Bouton de démarrage */}
      <Animated.View style={{ opacity: buttonFadeAnim, width: '100%' }}>
        <Pressable onPress={handleStart}>
          <LinearGradient
            colors={['#7e22ce', '#6d28d9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Commencer</Text>
            <ArrowRight color="#fff" size={20} />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Éléments décoratifs */}
      <View style={styles.patternTopRight} />
      <View style={styles.patternBottomLeft} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 50,
    position: 'relative',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7e22ce',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#a855f7',
  },
  logoShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'transparent',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  slogan: {
    fontSize: 18,
    color: '#e4e4e7',
    textAlign: 'center',
    marginBottom: 60,
    fontStyle: 'italic',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginHorizontal: 40,
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
    marginRight: 10,
  },
  patternTopRight: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    transform: [{ scale: 1.2 }],
  },
  patternBottomLeft: {
    position: 'absolute',
    bottom: height * 0.08,
    left: width * 0.1,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(126, 34, 206, 0.15)',
    transform: [{ scale: 1.5 }],
  },
});