import React, { useState } from 'react';
import { 
  Text, View, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, ScrollView, SafeAreaView, StatusBar 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'ac843695dfc010694e0f9a3e792ec64c';

  const getWeatherIcon = (id) => {
    if (id >= 200 && id < 300) return "weather-lightning";
    if (id >= 300 && id < 600) return "weather-pouring";
    if (id >= 600 && id < 700) return "weather-snowy";
    if (id === 800) return "weather-sunny";
    return "weather-partly-cloudy";
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      // Current Weather
      const currentResp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentResp.json();

      // 24-Hour Forecast
      const forecastResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResp.json();

      if (currentResp.ok) {
        setWeather(currentData);
        setForecast(forecastData.list.slice(0, 8));
      } else {
        alert("City not found");
      }
    } catch (e) {
      alert("Check your connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Branded Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="atom" size={28} color="#3F51B5" />
        <Text style={styles.brandTitle}>WEATHER<Text style={styles.brandAccent}>TECH LABS</Text></Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput 
          style={styles.input} 
          placeholder="Enter City Name" 
          value={city} 
          onChangeText={setCity} 
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={fetchWeather}>
          <MaterialCommunityIcons name="magnify" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#3F51B5" style={{marginTop: 50}} />}

      {weather && !loading && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Main Card */}
          <View style={styles.mainCard}>
            <Text style={styles.locationText}>{weather.name}, {weather.sys.country}</Text>
            <MaterialCommunityIcons 
              name={getWeatherIcon(weather.weather[0].id)} 
              size={120} 
              color="#FFA726" 
            />
            <Text style={styles.mainTemp}>{Math.round(weather.main.temp)}°C</Text>
            <Text style={styles.weatherDesc}>{weather.weather[0].description}</Text>
          </View>

          {/* Forecast Title */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#3F51B5" />
            <Text style={styles.sectionTitle}> 24-Hour Forecast</Text>
          </View>

          {/* Horizontal Forecast */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastList}>
            {forecast.map((item, index) => (
              <View key={index} style={styles.forecastCard}>
                <Text style={styles.forecastTime}>
                  {new Date(item.dt * 1000).getHours()}:00
                </Text>
                <MaterialCommunityIcons 
                  name={getWeatherIcon(item.weather[0].id)} 
                  size={30} 
                  color="#3F51B5" 
                />
                <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°</Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={{ height: 100 }} /> 
        </ScrollView>
      )}

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>SYSTEM VERSION 1.0.0</Text>
        <Text style={styles.footerAuthor}>CREATED BY TEHSEEN ULLAH</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20, 
    marginBottom: 30 
  },
  brandTitle: { fontSize: 20, fontWeight: '900', color: '#1A237E', marginLeft: 8, letterSpacing: 1 },
  brandAccent: { color: '#3F51B5', fontWeight: '300' },
  searchSection: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  input: { 
    flex: 1, height: 55, backgroundColor: '#FFF', borderRadius: 15, 
    paddingHorizontal: 20, elevation: 3, shadowColor: '#000', 
    shadowOpacity: 0.05, shadowRadius: 10 
  },
  searchBtn: { 
    width: 55, height: 55, backgroundColor: '#3F51B5', 
    borderRadius: 15, justifyContent: 'center', alignItems: 'center' 
  },
  mainCard: { 
    backgroundColor: '#FFF', borderRadius: 30, padding: 40, 
    alignItems: 'center', elevation: 10, shadowColor: '#3F51B5', 
    shadowOpacity: 0.1, shadowRadius: 20, marginBottom: 30
  },
  locationText: { fontSize: 18, fontWeight: '700', color: '#546E7A', marginBottom: 10 },
  mainTemp: { fontSize: 80, fontWeight: '200', color: '#1A237E' },
  weatherDesc: { fontSize: 18, color: '#78909C', textTransform: 'capitalize', fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
  forecastList: { flexDirection: 'row' },
  forecastCard: { 
    backgroundColor: '#FFF', padding: 15, borderRadius: 20, 
    alignItems: 'center', marginRight: 15, width: 85, elevation: 3 
  },
  forecastTime: { fontSize: 12, color: '#90A4AE', marginBottom: 8 },
  forecastTemp: { fontSize: 18, fontWeight: 'bold', color: '#37474F', marginTop: 5 },
  footer: { 
    position: 'absolute', bottom: 20, left: 0, right: 0, 
    alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0', 
    paddingTop: 15, backgroundColor: '#F8FAFC' 
  },
  footerLabel: { fontSize: 10, color: '#90A4AE', letterSpacing: 2 },
  footerAuthor: { fontSize: 12, fontWeight: '800', color: '#1A237E', marginTop: 4 }
});