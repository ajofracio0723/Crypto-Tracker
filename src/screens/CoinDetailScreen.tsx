import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import { cryptoAPI } from '../services/api';
import { Coin, CoinChartData } from '../types';
import { PriceChart } from '../components/PriceChart';
import { RootStackParamList } from '../types';

type CoinDetailRouteProp = RouteProp<RootStackParamList, 'CoinDetail'>;

const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#334155' : '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  coinName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  coinSymbol: {
    fontSize: 16,
    textTransform: 'uppercase',
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === 'dark' ? '#1e293b' : '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#334155' : '#f59e0b',
  },
  networkStatusText: {
    fontSize: 14,
    marginLeft: 8,
  },
  priceSection: {
    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceChange: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    width: '48%',
    backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
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

export const CoinDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CoinDetailRouteProp>();
  const { coinId } = route.params;
  const { theme, favorites, toggleFavorite } = useStore();
  
  const [coin, setCoin] = useState<Coin | null>(null);
  const [chartData, setChartData] = useState<CoinChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);

  const styles = createStyles(theme);

  useEffect(() => {
    fetchCoinDetails();
  }, [coinId]);

  const fetchCoinDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsUsingFallbackData(false);
      
      const [coinDetails, chartDataResult] = await Promise.all([
        cryptoAPI.getCoinDetails(coinId),
        cryptoAPI.getCoinChart(coinId, 7),
      ]);
      
      setCoin(coinDetails);
      setChartData(chartDataResult);
      
      // Check if we're using fallback data
      if (coinDetails.current_price === 45000 || coinDetails.current_price === 2800 || coinDetails.current_price === 320) {
        setIsUsingFallbackData(true);
      }
    } catch (error) {
      console.error('Error fetching coin details:', error);
      setError('Failed to fetch coin details');
      Alert.alert('Error', 'Failed to fetch coin details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFavoriteToggle = () => {
    if (coin) {
      toggleFavorite(coin);
    }
  };

  const isFavorite = coin ? favorites.some(fav => fav.id === coin.id) : false;

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined || price === null || isNaN(price)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatPercentage = (percentage: number | undefined): string => {
    if (percentage === undefined || percentage === null || isNaN(percentage)) return 'N/A';
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const formatMarketCap = (marketCap: number | undefined): string => {
    if (marketCap === undefined || marketCap === null || isNaN(marketCap)) return 'N/A';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number | undefined): string => {
    if (volume === undefined || volume === null || isNaN(volume)) return 'N/A';
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const formatSupply = (supply: number | undefined): string => {
    if (supply === undefined || supply === null || isNaN(supply)) return 'N/A';
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`;
    return supply.toLocaleString();
  };

  const renderNetworkStatus = () => {
    if (!isUsingFallbackData) return null;
    
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={[styles.loadingText, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
            Loading coin details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !coin) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
            {error || 'Coin not found'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCoinDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={theme === 'dark' ? '#ffffff' : '#0f172a'} 
          />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.coinName, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
            {coin.name}
          </Text>
          <Text style={[styles.coinSymbol, { color: theme === 'dark' ? '#64748b' : '#475569' }]}>
            {coin.symbol}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isFavorite ? '#ef4444' : theme === 'dark' ? '#64748b' : '#475569'} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderNetworkStatus()}
        
        <View style={styles.priceSection}>
          <Text style={[styles.currentPrice, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
            {formatPrice(coin.current_price)}
          </Text>
          
          <Text 
            style={[
              styles.priceChange,
              { 
                color: coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444' 
              }
            ]}
          >
            {formatPercentage(coin.price_change_percentage_24h)}
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme === 'dark' ? '#94a3b8' : '#64748b' }]}>
                Market Cap
              </Text>
              <Text style={[styles.statValue, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
                {formatMarketCap(coin.market_cap)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme === 'dark' ? '#94a3b8' : '#64748b' }]}>
                24h Volume
              </Text>
              <Text style={[styles.statValue, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
                {formatVolume(coin.total_volume)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme === 'dark' ? '#94a3b8' : '#64748b' }]}>
                Circulating Supply
              </Text>
              <Text style={[styles.statValue, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
                {formatSupply(coin.circulating_supply)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme === 'dark' ? '#94a3b8' : '#64748b' }]}>
                Max Supply
              </Text>
              <Text style={[styles.statValue, { color: theme === 'dark' ? '#ffffff' : '#0f172a' }]}>
                {coin.max_supply ? formatSupply(coin.max_supply) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <PriceChart data={chartData} coinName={coin.name} />
      </ScrollView>
    </SafeAreaView>
  );
};
