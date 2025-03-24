import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Award, Calendar, Clock } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  // This would typically come from a context or state manager
  const userRank = 'E';
  const nextRank = 'D';
  const progressToNextRank = 65; // percentage
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section with Rank */}
        <LinearGradient
          colors={['#0f1221', '#1d1d42', '#382161']}
          style={styles.heroSection}
        >
          <View style={styles.rankBadgeContainer}>
            <LinearGradient
              colors={['#ef4444', '#ef444480']}
              style={styles.rankBadge}
            >
              <Text style={styles.rankText}>{userRank}</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.welcomeText}>Bienvenue, Hunter</Text>
          <Text style={styles.heroSubtitle}>Prêt à t'entraîner aujourd'hui ?</Text>
          
          {/* Progress to next rank */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progression vers le rang {nextRank}</Text>
              <Text style={styles.progressPercentage}>{progressToNextRank}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressToNextRank}%` }]} />
            </View>
          </View>
        </LinearGradient>
        
        {/* Today's Training Card */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#a855f7" />
            <Text style={styles.sectionTitle}>Entraînement du jour</Text>
          </View>
          
          <LinearGradient
            colors={['rgba(126, 34, 206, 0.2)', 'rgba(126, 34, 206, 0.1)']}
            style={styles.trainingCard}
          >
            <View style={styles.trainingCardContent}>
              <Text style={styles.trainingTitle}>Full Body Challenge</Text>
              <Text style={styles.trainingDescription}>
                3 séries de 10 pompes, 15 squats et 12 abdos
              </Text>
              
              <View style={styles.trainingStats}>
                <View style={styles.trainingStat}>
                  <Clock size={16} color="#d4d4d8" />
                  <Text style={styles.trainingStatText}>25 min</Text>
                </View>
                <View style={styles.trainingStat}>
                  <Award size={16} color="#d4d4d8" />
                  <Text style={styles.trainingStatText}>+15 points</Text>
                </View>
              </View>
              
              <Link href="/training" asChild>
                <Pressable style={styles.startButton}>
                  <Play size={16} color="#fff" />
                  <Text style={styles.startButtonText}>Commencer</Text>
                </Pressable>
              </Link>
            </View>
          </LinearGradient>
        </View>
        
        {/* Achievements Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Award size={20} color="#a855f7" />
            <Text style={styles.sectionTitle}>Vos réalisations</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsContainer}
          >
            {/* Achievement cards */}
            <View style={styles.achievementCard}>
              <View style={[styles.achievementIcon, { backgroundColor: 'rgba(234, 179, 8, 0.2)' }]}>
                <Award size={24} color="#eab308" />
              </View>
              <Text style={styles.achievementTitle}>Premier entraînement</Text>
              <Text style={styles.achievementDesc}>Débloqué</Text>
            </View>
            
            <View style={styles.achievementCard}>
              <View style={[styles.achievementIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                <Award size={24} color="#ec4899" />
              </View>
              <Text style={styles.achievementTitle}>Série parfaite</Text>
              <Text style={styles.achievementDesc}>À venir</Text>
            </View>
            
            <View style={styles.achievementCard}>
              <View style={[styles.achievementIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <Award size={24} color="#3b82f6" />
              </View>
              <Text style={styles.achievementTitle}>7 jours consécutifs</Text>
              <Text style={styles.achievementDesc}>2/7 complétés</Text>
            </View>
          </ScrollView>
        </View>
        
        {/* Tips Section */}
        <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Conseil du jour</Text>
          </View>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Hydratation</Text>
            <Text style={styles.tipText}>
              N'oubliez pas de boire de l'eau régulièrement pendant votre entraînement.
              Une bonne hydratation améliore vos performances et votre récupération.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1221',
  },
  heroSection: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  rankBadgeContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  rankText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#d4d4d8',
    marginTop: 5,
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#e4e4e7',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#a855f7',
    borderRadius: 4,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
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
  trainingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  trainingCardContent: {
    padding: 20,
  },
  trainingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  trainingDescription: {
    fontSize: 14,
    color: '#d4d4d8',
    marginBottom: 15,
    lineHeight: 20,
  },
  trainingStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  trainingStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  trainingStatText: {
    fontSize: 14,
    color: '#d4d4d8',
    marginLeft: 6,
  },
  startButton: {
    backgroundColor: '#7e22ce',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  achievementsContainer: {
    paddingBottom: 10,
    paddingRight: 20,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    width: 150,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#d4d4d8',
    lineHeight: 22,
  },
});