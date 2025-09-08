import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { CoinChartData } from '../types';

interface PriceChartProps {
  data: CoinChartData[];
  coinName: string;
}

const createStyles = () => StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1e293b',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

export const PriceChart: React.FC<PriceChartProps> = ({ data, coinName }) => {
  const styles = createStyles();

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>7-Day Price Chart</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No chart data available for {coinName}
          </Text>
        </View>
      </View>
    );
  }

  const chartData = {
    labels: data.map((_, index) => {
      if (index === 0) return '7d ago';
      if (index === data.length - 1) return 'Today';
      return '';
    }),
    datasets: [
      {
        data: data.map((item) => item.price),
        color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#0ea5e9',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e2e8f0',
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>7-Day Price Chart</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 72}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={false}
          withShadow={false}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
        />
      </View>
    </View>
  );
};
