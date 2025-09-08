import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cryptoAPI } from '../services/api';
import { Coin } from '../types';

interface SearchBarProps {
  onSearchResults: (results: Coin[]) => void;
  onSearching: (searching: boolean) => void;
}

const createStyles = () => StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  loadingContainer: {
    marginLeft: 8,
  },
});

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchResults,
  onSearching,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const styles = createStyles();

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      onSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      onSearching(true);
      const results = await cryptoAPI.searchCoins(searchQuery);
      onSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([]);
    } finally {
      setIsLoading(false);
      onSearching(false);
    }
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.trim().length === 0) {
      onSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(text);
    }, 500);
  };

  const handleClear = () => {
    setQuery('');
    onSearchResults([]);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cryptocurrencies..."
          placeholderTextColor="#94a3b8"
          value={query}
          onChangeText={handleQueryChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0ea5e9" />
          </View>
        )}
      </View>
    </View>
  );
};
