import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUpRight, ArrowRight, Calendar, Clock, Award } from 'lucide-react-native';

export default function ProgressScreen() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  // Mock data for radar chart and stats
  const currentRank = 'E';
  const stats = {
    pushups: 60,
    squats: 45,
    situps: 70,
    cardio: 30,
  };
  
  const activities = [
    {
      id: 1,
      date: '12 Juin 2025',
      name: 'Full Body Challenge',
      duration: '25 min',
      points: 15,
      completed: true,
    },
    {
      id: 2,
      date: '10 Juin 2025',
      name: 'Cardio Intense',
      duration: '20 min',
      points: 12,
      completed: true,
    },
    {
      id: 3,
      date: '08 Juin 2025',
      name: 'Full Body Challenge',
      duration: '25 min',
      points: 8, // Lower points, didn't complete fully
      completed: false,
    },
  ];
  
  const totalStats = {
    totalWorkouts: 15,
    totalMinutes: 320,
    totalPoints: 185,
    streak: 5,
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Rank Section */}
        <LinearGradient
          colors={['#0f1221', '#1d1d42', '#382161']}
          style={styles.rankSection}
        >
          <Text style={styles.rankTitle}>Votre niveau actuel</Text>
          
          <View style={styles.rankBadgeContainer}>
            <LinearGradient
              colors={['#ef4444', '#ef444480']}
              style={styles.rankBadge}
            >
              <Text style={styles.rankText}>{currentRank}</Text>
            </LinearGradient>
            <Text style={styles.rankLabel}>Rang E</Text>
          </View>
          
          <View style={styles.nextRankContainer}>
            <Text style={styles.nextRankText}>
              <ArrowUpRight size={16} color="#22c55e" /> 15 points pour atteindre le rang D
            </Text>
          </View>
        </LinearGradient>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Performances</Text>
          
          {/* Time range selector */}
          <View style={styles.timeRangeSelector}>
            <Pressable
              style={[
                styles.timeRangeButton,
                timeRange === 'week' && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange('week')}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === 'week' && styles.timeRangeTextActive,
                ]}
              >
                Semaine
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.timeRangeButton,
                timeRange === 'month' && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange('month')}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === 'month' && styles.timeRangeTextActive,
                ]}
              >
                Mois
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.timeRangeButton,
                timeRange === 'all' && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange('all')}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === 'all' && styles.timeRangeTextActive,
                ]}
              >
                Tout
              </Text>
            </Pressable>
          </View>
          
          {/* Radar chart visualization (placeholder) */}
          <View style={styles.radarChartContainer}>
            <View style={styles.radarChart}>
              <View style={styles.radarChartLabels}>
                <Text style={[styles.radarChartLabel, { top: '5%', left: '50%' }]}>Pompes</Text>
                <Text style={[styles.radarChartLabel, { top: '50%', right: '5%' }]}>Squats</Text>
                <Text style={[styles.radarChartLabel, { bottom: '5%', left: '50%' }]}>Abdos</Text>
                <Text style={[styles.radarChartLabel, { top: '50%', left: '5%' }]}>Cardio</Text>
              </View>
              
              {/* This is a simple mockup of a radar chart - in a real app you'd use a proper chart library */}
              <View style={styles.radarOuterCircle} />
              <View style={styles.radarMiddleCircle} />
              <View style={styles.radarInnerCircle} />
              
              <View style={styles.radarFill}>
                <View style={[styles.radarPoint, { top: `${20 + (60 / 100) * 60}%`, left: '50%' }]} />
                <View style={[styles.radarPoint, { top: '50%', right: `${20 + (60 / 100) * 45}%` }]} />
                <View style={[styles.radarPoint, { bottom: `${20 + (60 / 100) * 70}%`, left: '50%' }]} />
                <View style={[styles.radarPoint, { top: '50%', left: `${20 + (60 / 100) * 30}%` }]} />
              </View>
            </View>
          </View>
          
          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalStats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Entraînements</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes totales</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalStats.totalPoints}</Text>
              <Text style={styles.statLabel}>Points gagnés</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalStats.streak}</Text>
              <Text style={styles.statLabel}>Jours consécutifs</Text>
            </View>
          </View>
        </View>
        
        {/* Activity History */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Historique des activités</Text>
          
          {activities.map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityDateContainer}>
                  <Calendar size={14} color="#9ca3af" />
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                
                <View style={[
                  styles.activityStatus,
                  activity.completed ? styles.activityCompleted : styles.activityIncomplete,
                ]}>
                  <Text style={styles.activityStatusText}>
                    {activity.completed ? 'Complété' : 'Incomplet'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.activityName}>{activity.name}</Text>
              
              <View style={styles.activityStats}>
                <View style={styles.activityStat}>
                  <Clock size={14} color="#d4d4d8" />
                  <Text style={styles.activityStatText}>{activity.duration}</Text>
                </View>
                
                <View style={styles.activityStat}>
                  <Award size={14} color="#d4d4d8" />
                  <Text style={styles.activityStatText}>+{activity.points} pts</Text>
                </View>
              </View>
              
              {!activity.completed && (
                <Text style={styles.tryAgainText}>
                  <ArrowRight size={14} color="#a855f7" /> Réessayer cet entraînement
                </Text>
              )}
            </View>
          ))}
          
          <Pressable style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>Voir plus d'activités</Text>
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
  },
  rankSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  rankBadgeContainer: {
    alignItems: 'center',
  },
  rankBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rankText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankLabel: {
    fontSize: 16,
    color: '#e4e4e7',
  },
  nextRankContainer: {
    marginTop: 15,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  nextRankText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '500',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  timeRangeButtonActive: {
    backgroundColor: '#7e22ce',
  },
  timeRangeText: {
    color: '#d4d4d8',
    fontSize: 14,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  radarChartContainer: {
    height: 300,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarChart: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  radarChartLabels: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  radarChartLabel: {
    position: 'absolute',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: 80,
    marginLeft: -40,
  },
  radarOuterCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    top: 0,
    left: 0,
  },
  radarMiddleCircle: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    top: '20%',
    left: '20%',
  },
  radarInnerCircle: {
    position: 'absolute',
    width: '20%',
    height: '20%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    top: '40%',
    left: '40%',
  },
  radarFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  radarPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a855f7',
    marginLeft: -5,
    marginTop: -5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#d4d4d8',
  },
  activitySection: {
    padding: 20,
    paddingTop: 0,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 6,
  },
  activityStatus: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  activityCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  activityIncomplete: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  activityStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#22c55e',
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  activityStats: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  activityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  activityStatText: {
    fontSize: 14,
    color: '#d4d4d8',
    marginLeft: 6,
  },
  tryAgainText: {
    fontSize: 14,
    color: '#a855f7',
    marginTop: 10,
  },
  viewMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  viewMoreText: {
    fontSize: 16,
    color: '#a855f7',
    fontWeight: '500',
  },
});