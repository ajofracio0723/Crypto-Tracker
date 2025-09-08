# CryptoTracker 📈

A **native mobile** cryptocurrency tracking application built with **React Native** and **Expo**. Track real-time cryptocurrency prices, view detailed market data, and manage your favorite coins with a beautiful, responsive interface optimized for mobile devices.

## 📱 Mobile Platforms

- **📱 iOS**: Compatible with iPhone and iPad
- **🤖 Android**: Compatible with all Android devices
- **🔗 Expo Go**: Scan QR code for instant testing
- **📦 App Stores**: Ready for iOS App Store and Google Play deployment

### 📸 Mobile Screenshots

| iPhone | Android | iPad |
|--------|---------|------|
| *Add iPhone screenshots* | *Add Android screenshots* | *Add iPad screenshots* |

## 🎯 Portfolio Highlights

### Native Mobile Development
- **React Native**: True native performance with 60fps animations
- **Cross-Platform**: Single codebase for iOS and Android
- **Native Features**: Touch gestures, haptic feedback, and platform-specific UI
- **Mobile-Optimized**: Designed specifically for mobile user experience

### Mobile-First Features
- **Touch Gestures**: Native swipe, pull-to-refresh, and haptic feedback
- **Offline Support**: Local data persistence with AsyncStorage
- **Push Notifications**: Ready for price alerts (future enhancement)
- **Native Navigation**: Platform-specific navigation patterns

## ✨ Features

### 🏠 Home Screen
- **Live Cryptocurrency Prices**: Real-time data from CoinGecko API
- **Top Coins List**: Display top 50 cryptocurrencies by market cap
- **Search Functionality**: Find specific coins with instant search
- **Pull-to-Refresh**: Update data with a simple swipe down
- **Responsive Design**: Optimized for both iOS and Android

### 🔍 Coin Details
- **Comprehensive Information**: Price, market cap, volume, supply data
- **Price Charts**: 7-day price history with interactive charts
- **Market Statistics**: Detailed market data and rankings
- **Price Changes**: 1h, 24h, and 7-day percentage changes
- **All-Time Stats**: Historical highs and lows with dates

### ❤️ Watchlist
- **Favorites Management**: Add/remove coins to your watchlist
- **Persistent Storage**: Favorites saved locally on your device
- **Quick Access**: Dedicated tab for your favorite cryptocurrencies
- **Real-time Updates**: Live data for all your saved coins

### ⚙️ Settings & Customization
- **Theme Toggle**: Switch between light and dark modes
- **Dark Mode Default**: Modern dark theme as the primary interface
- **App Information**: Version details and privacy information
- **Data Source Info**: Transparency about data providers

## 🎨 Design Features

- **Modern UI/UX**: Clean, minimalist design with smooth animations
- **Dark Mode First**: Beautiful dark theme with light mode option
- **Smooth Animations**: Spring animations for interactions
- **Rounded Cards**: Modern card-based layout with shadows
- **Responsive Typography**: Optimized text sizing and spacing
- **Icon Integration**: Comprehensive use of Ionicons

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand with persistence
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Charts**: React Native Chart Kit
- **Navigation**: React Navigation (ready for implementation)
- **API**: CoinGecko API for cryptocurrency data
- **Storage**: AsyncStorage for local data persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CryptoTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on your device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── CoinCard.tsx    # Individual coin display card
│   ├── SearchBar.tsx   # Search functionality
│   └── PriceChart.tsx  # Price history charts
├── screens/            # Main app screens
│   ├── HomeScreen.tsx  # Main cryptocurrency list
│   ├── CoinDetailScreen.tsx # Detailed coin view
│   ├── WatchlistScreen.tsx  # Favorites list
│   └── SettingsScreen.tsx   # App settings
├── store/              # State management
│   └── useStore.ts     # Zustand store configuration
├── services/           # API and external services
│   └── api.ts         # CoinGecko API integration
├── types/              # TypeScript type definitions
│   └── index.ts       # App-wide type definitions
└── navigation/         # Navigation configuration
    └── AppNavigator.tsx # Main navigation structure
```

## 🔌 API Integration

The app uses the **CoinGecko API** for cryptocurrency data:
- **Free Tier**: No API key required
- **Rate Limits**: Respectful usage with built-in error handling
- **Data Sources**: Real-time prices, market data, and charts
- **Endpoints**: Markets, coin details, search, and historical data

## 🎯 Key Components

### CoinCard
- Displays coin logo, name, symbol, and current price
- Shows 24h price change with color-coded indicators
- Heart icon for adding/removing from favorites
- Smooth press animations and modern styling

### SearchBar
- Real-time search with debounced API calls
- Instant results as you type
- Clear button and loading indicators
- Responsive design for all screen sizes

### PriceChart
- 7-day price history visualization
- Interactive line charts with custom styling
- Price change calculations and display
- Responsive chart sizing

## 🔄 State Management

- **Zustand Store**: Lightweight state management
- **Persistence**: Local storage for favorites and theme preferences
- **Real-time Updates**: Live data fetching and state updates
- **Error Handling**: Comprehensive error states and user feedback

## 🎨 Theming System

- **Dark Mode Default**: Modern dark theme as primary
- **Light Mode Option**: Clean light theme alternative
- **Dynamic Colors**: Theme-aware component styling
- **Consistent Design**: Unified color palette and spacing

## 📊 Data Features

- **Real-time Prices**: Live cryptocurrency data
- **Market Rankings**: Top 50 coins by market cap
- **Historical Data**: 7-day price charts
- **Supply Information**: Circulating and max supply data
- **Volume Data**: 24h trading volume
- **Price Changes**: Multiple timeframe percentage changes

## 🚧 Future Enhancements

- [ ] **Portfolio Tracking**: Add/remove coins with quantities
- [ ] **Price Alerts**: Set price notifications
- [ ] **News Integration**: Cryptocurrency news feed
- [ ] **Advanced Charts**: Multiple timeframes and indicators
- [ ] **Social Features**: Share portfolios and insights
- [ ] **Offline Support**: Cached data for offline viewing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CoinGecko**: For providing free cryptocurrency data API
- **Expo**: For the excellent React Native development platform
- **React Native Community**: For the amazing ecosystem and tools
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

If you have any questions or need help with the app:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ using React Native & Expo**

*CryptoTracker v1.0.0*
