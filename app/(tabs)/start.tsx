import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Cet écran ne sera pas visible car nous utilisons un bouton personnalisé
// qui redirige directement vers la page de session d'entraînement
export default function StartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Redirection vers la page d'entraînement...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1221',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});