import axios from 'axios';
import { Coin, CoinChartData } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1200; // 1.2 seconds between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

let lastRequestTime = 0;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'CryptoTracker/1.0.0',
  },
});

// Fallback data for when API is rate limited
const fallbackCoins: Coin[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 45000,
    market_cap: 850000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 850000000000,
    total_volume: 25000000000,
    high_24h: 46000,
    low_24h: 44000,
    price_change_24h: 1000,
    price_change_percentage_24h: 2.27,
    market_cap_change_24h: 20000000000,
    market_cap_change_percentage_24h: 2.41,
    circulating_supply: 19500000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69000,
    ath_change_percentage: -34.78,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 67.81,
    atl_change_percentage: 66263.62,
    atl_date: '2013-07-06T00:00:00.000Z',
    roi: null,
    last_updated: new Date().toISOString(),
    price_change_percentage_1h_in_currency: 0.5,
    price_change_percentage_7d_in_currency: 5.2,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2800,
    market_cap: 350000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 350000000000,
    total_volume: 15000000000,
    high_24h: 2850,
    low_24h: 2750,
    price_change_24h: 50,
    price_change_percentage_24h: 1.82,
    market_cap_change_24h: 6000000000,
    market_cap_change_percentage_24h: 1.74,
    circulating_supply: 120000000,
    total_supply: 120000000,
    max_supply: null,
    ath: 4800,
    ath_change_percentage: -41.67,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 0.432979,
    atl_change_percentage: 646165.12,
    atl_date: '2015-10-20T00:00:00.000Z',
    roi: null,
    last_updated: new Date().toISOString(),
    price_change_percentage_1h_in_currency: 0.3,
    price_change_percentage_7d_in_currency: 3.8,
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 320,
    market_cap: 50000000000,
    market_cap_rank: 3,
    fully_diluted_valuation: 50000000000,
    total_volume: 2000000000,
    high_24h: 325,
    low_24h: 315,
    price_change_24h: 5,
    price_change_percentage_24h: 1.59,
    market_cap_change_24h: 800000000,
    market_cap_change_percentage_24h: 1.62,
    circulating_supply: 155000000,
    total_supply: 155000000,
    max_supply: 200000000,
    ath: 686,
    ath_change_percentage: -53.35,
    ath_date: '2021-05-10T07:24:17.097Z',
    atl: 0.0398177,
    atl_change_percentage: 803900.12,
    atl_date: '2017-10-19T00:00:00.000Z',
    roi: null,
    last_updated: new Date().toISOString(),
    price_change_percentage_1h_in_currency: 0.2,
    price_change_percentage_7d_in_currency: 2.1,
  },
];

// Generate fallback chart data
const generateFallbackChartData = (days: number = 7): CoinChartData[] => {
  const data: CoinChartData[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * dayMs);
    const basePrice = 45000; // Bitcoin base price
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const price = basePrice * (1 + variation);
    
    data.push({
      timestamp,
      price,
    });
  }
  
  return data;
};

// Rate limiting middleware
const rateLimitMiddleware = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
};

// Retry logic with exponential backoff
const retryRequest = async (requestFn: () => Promise<any>, retries: number = MAX_RETRIES): Promise<any> => {
  try {
    return await requestFn();
  } catch (error: any) {
    if (retries > 0 && (error.response?.status === 429 || error.response?.status >= 500)) {
      console.log(`Request failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(requestFn, retries - 1);
    }
    throw error;
  }
};

export const cryptoAPI = {
  // Get top coins by market cap
  getTopCoins: async (page: number = 1, perPage: number = 50): Promise<Coin[]> => {
    try {
      await rateLimitMiddleware();
      
      const request = () => api.get(
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d`
      );
      
      const response = await retryRequest(request);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching top coins:', error);
      if (error.response?.status === 429) {
        console.log('Using fallback data due to rate limiting');
        return fallbackCoins.slice(0, perPage);
      }
      throw new Error('Failed to fetch top coins. Please check your internet connection.');
    }
  },

  // Get coin details by ID
  getCoinDetails: async (coinId: string): Promise<Coin> => {
    try {
      await rateLimitMiddleware();
      
      const request = () => api.get(
        `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      const response = await retryRequest(request);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching coin details:', error);
      if (error.response?.status === 429) {
        console.log('Using fallback data due to rate limiting');
        const fallbackCoin = fallbackCoins.find(coin => coin.id === coinId);
        if (fallbackCoin) {
          return fallbackCoin;
        }
        throw new Error('Coin not found in fallback data.');
      }
      if (error.response?.status === 404) {
        throw new Error('Coin not found. Please check the coin ID.');
      }
      throw new Error('Failed to fetch coin details. Please check your internet connection.');
    }
  },

  // Get coin chart data for the last 7 days
  getCoinChart: async (coinId: string, days: number = 7): Promise<CoinChartData[]> => {
    try {
      await rateLimitMiddleware();
      
      const request = () => api.get(
        `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      const response = await retryRequest(request);
      
      // Transform the CoinGecko API response to match our interface
      if (response.data.prices && Array.isArray(response.data.prices)) {
        return response.data.prices.map(([timestamp, price]: [number, number]) => ({
          timestamp,
          price,
        }));
      }
      
      return [];
    } catch (error: any) {
      console.error('Error fetching coin chart:', error);
      if (error.response?.status === 429) {
        console.log('Using fallback chart data due to rate limiting');
        return generateFallbackChartData(days);
      }
      throw new Error('Failed to fetch coin chart. Please check your internet connection.');
    }
  },

  // Search coins
  searchCoins: async (query: string): Promise<Coin[]> => {
    try {
      await rateLimitMiddleware();
      
      const request = () => api.get(
        `/search?query=${encodeURIComponent(query)}`
      );
      
      const response = await retryRequest(request);
      
      if (response.data.coins && response.data.coins.length > 0) {
        // Get detailed info for top 10 search results
        const topResults = response.data.coins.slice(0, 10);
        const coinIds = topResults.map((coin: any) => coin.id).join(',');
        
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const detailedRequest = () => api.get(
          `/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&sparkline=false&price_change_percentage=1h,24h,7d`
        );
        
        const detailedResponse = await retryRequest(detailedRequest);
        return detailedResponse.data;
      }
      
      return [];
    } catch (error: any) {
      console.error('Error searching coins:', error);
      if (error.response?.status === 429) {
        console.log('Using fallback search data due to rate limiting');
        const queryLower = query.toLowerCase();
        return fallbackCoins.filter(coin => 
          coin.name.toLowerCase().includes(queryLower) || 
          coin.symbol.toLowerCase().includes(queryLower)
        );
      }
      throw new Error('Failed to search coins. Please check your internet connection.');
    }
  },
};
