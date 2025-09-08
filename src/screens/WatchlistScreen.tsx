import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import { CoinCard } from '../components/CoinCard';
import { Coin } from '../types';

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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
});

export const WatchlistScreen: React.FC = () => {
  const navigation = useNavigation();
  const { favorites, theme } = useStore();
  const styles = createStyles(theme);

  const handleCoinPress = useCallback((coin: Coin) => {
    navigation.navigate('CoinDetail', { coinId: coin.id });
  }, [navigation]);

  const handleAddCoins = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const renderCoinItem = useCallback(({ item, index }: { item: Coin; index: number }) => (
    <CoinCard
      coin={item}
      onPress={() => handleCoinPress(item)}
      index={index}
    />
  ), [handleCoinPress]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="heart-outline"
        size={64}
        color={theme === 'dark' ? '#64748b' : '#94a3b8'}
        style={styles.emptyStateIcon}
      />
      <Text style={[styles.emptyStateTitle, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
        Your Watchlist is Empty
      </Text>
      <Text style={[styles.emptyStateText, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
        Start building your watchlist by adding cryptocurrencies from the home screen. Tap the heart icon on any coin to add it here.
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddCoins}>
        <Text style={styles.addButtonText}>Browse Coins</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
          Watchlist
        </Text>
        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
          {favorites.length === 0
            ? 'No favorites yet'
            : `${favorites.length} favorite${favorites.length === 1 ? '' : 's'}`}
        </Text>
      </View>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites.filter(coin => coin && coin.id && coin.name)}
          renderItem={renderCoinItem}
          keyExtractor={(item: Coin) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          style={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};
