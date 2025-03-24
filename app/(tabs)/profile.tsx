import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Calendar, Mail, Clock, Award, ChevronRight, Settings, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function ProfileScreen() {
  const { userData, signOut, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Erreur', 'Un problème est survenu lors de la déconnexion');
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#0f1221', '#1d1d42', '#382161']}
          style={styles.header}
        >
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <User size={40} color="#fff" />
            </View>
          </View>
          
          <Text style={styles.profileName}>{userData?.name || 'Utilisateur'}</Text>
          
          <View style={styles.profileInfo}>
            <View style={styles.profileInfoItem}>
              <Mail size={14} color="#9ca3af" />
              <Text style={styles.profileInfoText}>{userData?.email}</Text>
            </View>
            
            <View style={styles.profileInfoItem}>
              <Calendar size={14} color="#9ca3af" />
              <Text style={styles.profileInfoText}>
                Inscrit le {new Date(userData?.created_at || Date.now()).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.rankBadgeContainer}>
            <LinearGradient
              colors={['#ef4444', '#ef444480']}
              style={styles.rankBadge}
            >
              <Text style={styles.rankText}>{userData?.rank || 'E'}</Text>
            </LinearGradient>
          </View>
        </LinearGradient>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{15}</Text> {/* À remplacer par des données réelles */}
              <Text style={styles.statLabel}>Entraînements</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{320}</Text> {/* À remplacer par des données réelles */}
              <Text style={styles.statLabel}>Minutes totales</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{5}</Text> {/* À remplacer par des données réelles */}
              <Text style={styles.statLabel}>Jours consécutifs</Text>
            </View>
          </View>
        </View>
        
        {/* Profile Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => router.push('/profile')}
          >
            <View style={styles.settingItemLeft}>
              <User size={20} color="#a855f7" />
              <Text style={styles.settingLabel}>Éditer le profil</Text>
            </View>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => router.push('/coaching-style')}
          >
            <View style={styles.settingItemLeft}>
              <Award size={20} color="#a855f7" />
              <Text style={styles.settingLabel}>Style de coaching</Text>
              <Text style={styles.settingValue}>{userData?.coaching_style === 'bienveillant' 
                ? 'Maître bienveillant' 
                : userData?.coaching_style === 'strict' 
                  ? 'Coach strict' 
                  : userData?.coaching_style === 'equilibre' 
                    ? 'Mode équilibré' 
                    : 'Non défini'}</Text>
            </View>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.settingItemLeft}>
              <Settings size={20} color="#a855f7" />
              <Text style={styles.settingLabel}>Paramètres de l'application</Text>
            </View>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
        </View>
        
        {/* Logout Button */}
        <Pressable 
          style={styles.logoutButton}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator color="#ef4444" size="small" />
          ) : (
            <>
              <LogOut size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1221',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#7e22ce',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileInfoText: {
    fontSize: 14,
    color: '#d4d4d8',
    marginLeft: 6,
  },
  rankBadgeContainer: {
    position: 'absolute',
    top: 30,
    right: 30,
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
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
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
  settingsSection: {
    padding: 20,
    paddingTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 8,
  },
  logoutButton: {
    margin: 20,
    marginTop: 10,
    marginBottom: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 30,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});