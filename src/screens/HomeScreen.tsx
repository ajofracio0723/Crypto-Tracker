import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import { cryptoAPI } from '../services/api';
import { Coin } from '../types';
import { CoinCard } from '../components/CoinCard';
import { SearchBar } from '../components/SearchBar';

const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
  },
  header: {
    marginBottom: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === 'dark' ? '#1e293b' : '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#334155' : '#f59e0b',
  },
  networkStatusText: {
    fontSize: 14,
    marginLeft: 8,
  },
  searchResultsHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchResultsText: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { coins, setCoins, isLoading, setLoading, setError, theme } = useStore();
  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);

  const fetchCoins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsUsingFallbackData(false);
      
      const topCoins = await cryptoAPI.getTopCoins(1, 50);
      setCoins(topCoins);
      
      // Check if we're using fallback data (coins will have static prices)
      if (topCoins.length > 0 && topCoins[0].current_price === 45000) {
        setIsUsingFallbackData(true);
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
      setError('Failed to fetch cryptocurrency data');
      Alert.alert('Error', 'Failed to fetch cryptocurrency data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setCoins, setLoading, setError]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCoins();
    setRefreshing(false);
  }, [fetchCoins]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const handleCoinPress = (coin: Coin) => {
    navigation.navigate('CoinDetail', { coinId: coin.id });
  };

  const handleSearchResults = (results: Coin[]) => {
    setSearchResults(results);
  };

  const handleSearching = (searching: boolean) => {
    setIsSearching(searching);
  };

  const displayCoins = searchResults.length > 0 ? searchResults : coins;

  // Filter out any invalid coins to prevent crashes
  const validCoins = displayCoins.filter(coin => coin && coin.id && coin.name);

  const renderCoinItem = ({ item, index }: { item: Coin; index: number }) => (
    <CoinCard
      coin={item}
      onPress={() => handleCoinPress(item)}
      index={index}
    />
  );

  const renderEmptyState = () => {
    const styles = createStyles(theme);
    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyStateText, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
          {isSearching
            ? 'Searching...'
            : searchResults.length === 0 && coins.length === 0
            ? 'No cryptocurrencies found'
            : 'No search results'}
        </Text>
      </View>
    );
  };

  const renderNetworkStatus = () => {
    if (!isUsingFallbackData) return null;
    
    const styles = createStyles(theme);
    return (
      <View style={styles.networkStatus}>
        <Ionicons 
          name="warning" 
          size={16} 
          color={theme === 'dark' ? '#f59e0b' : '#d97706'} 
        />
        <Text style={[
          styles.networkStatusText, 
          { color: theme === 'dark' ? '#f59e0b' : '#d97706' }
        ]}>
          Using offline data - API rate limited
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    const styles = createStyles(theme);
    return (
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
          CryptoTracker
        </Text>
        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
          Track the latest cryptocurrency prices
        </Text>
        <SearchBar
          onSearchResults={handleSearchResults}
          onSearching={handleSearching}
        />
        {renderNetworkStatus()}
        {searchResults.length > 0 && (
          <View style={styles.searchResultsHeader}>
            <Text style={[styles.searchResultsText, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
              Search Results ({searchResults.length})
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderErrorState = () => {
    const styles = createStyles(theme);
    return (
      <View style={styles.errorContainer}>
        <Ionicons 
          name="cloud-offline" 
          size={64} 
          color={theme === 'dark' ? '#64748b' : '#94a3b8'} 
        />
        <Text style={[styles.errorText, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
          Unable to fetch cryptocurrency data
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCoins}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = createStyles(theme);

  if (isLoading && coins.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={[styles.loadingText, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
            Loading cryptocurrencies...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (coins.length === 0 && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <FlatList
        data={validCoins}
        renderItem={renderCoinItem}
        keyExtractor={(item: Coin) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme === 'dark' ? '#0ea5e9' : '#0284c7'}
            colors={[theme === 'dark' ? '#0ea5e9' : '#0284c7']}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        onEndReachedThreshold={0.1}
      />
    </SafeAreaView>
  );
};
