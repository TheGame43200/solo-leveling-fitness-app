import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { User, Moon, Bell, Heart, Volume2, Shield, ChevronRight, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  // State for toggles
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  
  // Mock user data
  const user = {
    name: 'Hunter',
    email: 'hunter@example.com',
    coachStyle: 'Maître bienveillant',
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Paramètres</Text>
        </View>
        
        {/* User Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.profileIconContainer}>
              <User size={24} color="#fff" />
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
            
            <Pressable style={styles.editButton}>
              <Text style={styles.editButtonText}>Modifier</Text>
            </Pressable>
          </View>
        </View>
        
        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Moon size={20} color="#a855f7" />
              <Text style={styles.settingLabel}>Mode sombre</Text>
            </View>
            <Switch
              trackColor={{ false: '#3f3f46', true: '#7e22ce' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3f3f46"
              onValueChange={() => setDarkMode(!darkMode)}
              value={darkMode}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Bell size={20} color="#a855f7" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#3f3f46', true: '#7e22ce' }}
              thumbColor={notifications ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3f3f46"
              onValueChange={() => setNotifications(!notifications)}
              value={notifications}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Volume2 size={20} color="#a855f7" />
              <Text style={styles.settingLabel}>Sons</Text>
            </View>
            <Switch
              trackColor={{ false: '#3f3f46', true: '#7e22ce' }}
              thumbColor={sounds ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3f3f46"
              onValueChange={() => setSounds(!sounds)}
              value={sounds}
            />
          </View>
        </View>
        
        {/* Coaching Style Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coaching</Text>
          
          <Pressable style={styles.coachingStyleItem}>
            <View style={styles.settingItemLeft}>
              <Heart size={20} color="#a855f7" />
              <View>
                <Text style={styles.settingLabel}>Style de coaching</Text>
                <Text style={styles.settingValue}>{user.coachStyle}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </Pressable>
          
          <Pressable style={styles.coachingStyleItem}>
            <View style={styles.settingItemLeft}>
              <Shield size={20} color="#a855f7" />
              <View>
                <Text style={styles.settingLabel}>Réinitialiser progression</Text>
                <Text style={styles.settingValue}>Recommencer l'évaluation</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </Pressable>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          
          <Pressable style={styles.aboutItem}>
            <Text style={styles.aboutItemText}>Conditions d'utilisation</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable style={styles.aboutItem}>
            <Text style={styles.aboutItemText}>Politique de confidentialité</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable style={styles.aboutItem}>
            <Text style={styles.aboutItemText}>Version de l'application</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </Pressable>
        </View>
        
        {/* Logout Button */}
        <Pressable style={styles.logoutButton}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Déconnexion</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7e22ce',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#d4d4d8',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(126, 34, 206, 0.2)',
  },
  editButtonText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
  },
  settingValue: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 15,
    marginTop: 3,
  },
  coachingStyleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  aboutItemText: {
    fontSize: 16,
    color: '#fff',
  },
  versionText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  logoutButton: {
    marginVertical: 30,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
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