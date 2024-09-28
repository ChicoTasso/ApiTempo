import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const apiKey = '81ad9b91b67e1ae22fe2bbefaa654a3d';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const { latitude, longitude } = location.coords;
      setLat(latitude);
      setLon(longitude);
    })();
  }, []);

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData();
      fetchForecastData();
    }
  }, [lat, lon]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=pt_br&units=metric&appid=${apiKey}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`);
      const data = await response.json();
      const filteredForecast = data.list.filter(item => {
        const date = new Date(item.dt * 1000);
        return date.getHours() === 15;
      });
      setForecast(filteredForecast);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const renderForecastItem = ({ item }) => {
    const iconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('pt-BR', { weekday: 'long' });

    return (
      <View style={styles.forecastItem}>
        <Text style={styles.day}>{day}</Text>
        <Image style={styles.forecastIcon} source={{ uri: iconUrl }} />
        <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
      </View>
    );
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${lat}, Longitude: ${lon}`;
  }

  return (
    <LinearGradient colors={['#0A0C14', '#17243E', '#17243E']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {weather && (
          <View style={styles.box}>
            <Image
              style={styles.weatherIcon}
              source={{ uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png` }}
            />
            <Text style={styles.temp}>{Number(weather.main.temp).toFixed(0)}°C</Text>
            <Text style={styles.clima}>
              {weather.weather[0].main} {Number(weather.main.temp_min).toFixed(0)}°C/
              {Number(weather.main.temp_max).toFixed(0)}°C
            </Text>
          </View>
        )}

        {forecast.length > 0 && (
          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>Previsão para os próximos dias:</Text>
            <FlatList
              data={forecast}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderForecastItem}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </SafeAreaView>
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:100,
  },
  temp: {
    color: 'white',
    fontSize: 60,
    fontWeight: '200',
    paddingBottom: 10,
  },
  clima: {
    color: 'white',
    opacity: 0.8,
    fontSize: 18,
  },
  forecastContainer: {
    marginTop: 20,
  },
  forecastTitle: {
    color: 'white',
    fontSize: 22,
    marginBottom: 10,
  },
  forecastItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    height:150,
    marginRight: 10,
    width: 120, // Ajusta a largura fixa para o card
    flexShrink: 0, // Garante que os itens não sejam esticados
  },
  day: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  forecastIcon: {
    width: 60,
    height: 60,
  },
  background: {
    // position: 'absolute',
    // height: '100%',
    flex: 1,

  },
});
