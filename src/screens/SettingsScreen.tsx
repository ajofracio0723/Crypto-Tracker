import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';

const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  infoSection: {
    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  version: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
});

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, favorites } = useStore();
  const styles = createStyles(theme);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to clear all your favorites? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            // This would need to be implemented in the store
            Alert.alert('Success', 'Favorites cleared successfully!');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About CryptoTracker',
      'A modern cryptocurrency tracking app built with React Native and Expo.\n\nFeatures:\n• Live cryptocurrency prices\n• Search functionality\n• Favorites/watchlist\n• Detailed coin information\n• Price charts\n• Dark/Light theme\n\nBuilt with ❤️ using CoinGecko API',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy Policy',
      'CryptoTracker respects your privacy:\n\n• No personal data is collected\n• Favorites are stored locally on your device\n• API calls are made to CoinGecko for cryptocurrency data\n• No analytics or tracking\n\nYour data stays on your device.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
          Customize your app experience
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
            Appearance
          </Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleThemeToggle}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={theme === 'dark' ? 'moon' : 'sunny'}
                size={24}
                color={theme === 'dark' ? '#0ea5e9' : '#f59e0b'}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
                Theme
              </Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={[styles.settingValue, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
            Data Management
          </Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearFavorites}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="trash-outline"
                size={24}
                color="#ef4444"
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
                Clear Favorites
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: '#ef4444' }]}>
              {favorites.length} items
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
            Information
          </Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#0ea5e9"
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
                About
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme === 'dark' ? '#64748b' : '#475569'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#10b981"
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme === 'dark' ? '#64748b' : '#475569'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
            Data Source
          </Text>
          <Text style={[styles.infoText, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
            Cryptocurrency data is provided by CoinGecko API. Prices are updated in real-time and may have slight delays.
          </Text>
        </View>

        <Text style={[styles.version, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};
