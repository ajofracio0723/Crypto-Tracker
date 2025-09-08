import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Coin } from '../types';
import { useStore } from '../store/useStore';

interface CoinCardProps {
  coin: Coin;
  onPress: () => void;
  index: number;
}

const createStyles = (theme: 'light' | 'dark', priceChange: number) => StyleSheet.create({
  container: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
    shadowColor: theme === 'dark' ? '#000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  coinInfo: {
    flex: 1,
  },
  coinNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  coinName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#ffffff' : '#0f172a',
  },
  coinSymbol: {
    marginLeft: 8,
    fontSize: 14,
    color: theme === 'dark' ? '#64748b' : '#475569',
  },
  coinRank: {
    fontSize: 14,
    color: theme === 'dark' ? '#64748b' : '#475569',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme === 'dark' ? '#ffffff' : '#0f172a',
  },
  percentageContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: priceChange >= 0 ? '#dcfce7' : '#fee2e2',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: priceChange >= 0 ? '#166534' : '#dc2626',
  },
  favoriteButton: {
    marginLeft: 12,
    padding: 8,
  },
});

export const CoinCard: React.FC<CoinCardProps> = ({ coin, onPress, index }) => {
  const { favorites, toggleFavorite, theme } = useStore();
  
  // Add safety checks for coin data
  if (!coin || !coin.id) {
    return null; // Don't render if coin data is invalid
  }
  
  const isFavorite = favorites.some(fav => fav.id === coin.id);
  const scaleAnim = new Animated.Value(1);

  const handleFavoritePress = () => {
    toggleFavorite(coin);
    
    // Add haptic feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    onPress();
  };

  const styles = createStyles(theme, coin.price_change_percentage_24h || 0);

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

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: coin.image }}
                style={styles.coinImage}
              />
              <View style={styles.coinInfo}>
                <View style={styles.coinNameRow}>
                  <Text style={styles.coinName} numberOfLines={1}>
                    {coin.name || 'Unknown Coin'}
                  </Text>
                  <Text style={styles.coinSymbol}>
                    {coin.symbol ? coin.symbol.toUpperCase() : 'N/A'}
                  </Text>
                </View>
                <Text style={styles.coinRank}>
                  #{coin.market_cap_rank || 'N/A'}
                </Text>
              </View>
            </View>
            
            <View style={styles.rightSection}>
              <Text style={styles.price}>
                {formatPrice(coin.current_price)}
              </Text>
              <View style={styles.percentageContainer}>
                <Text style={styles.percentageText}>
                  {formatPercentage(coin.price_change_percentage_24h)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#ef4444' : theme === 'dark' ? '#64748b' : '#475569'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
