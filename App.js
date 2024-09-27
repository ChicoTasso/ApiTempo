import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lat, setLat] = useState(''); 
  const [lon, setLon] = useState('');
  const [weather, setWeather] = useState(null);
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
      
      // Atualiza latitude e longitude
      const { latitude, longitude } = location.coords;
      setLat(latitude);
      setLon(longitude);
    })();
  }, []);

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData();
    }
  }, [lat, lon]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=pt_br&units=metric&appid=${apiKey}`);
      const data = await response.json();
      console.log(data);
      setWeather(data); // Armazena os dados do clima
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${lat}, Longitude: ${lon}`;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0C14', '#17243E', '#17243E']}
        style={styles.background}
      />
      
      {weather && (
        <View style={styles.box}>
          <Image
            style={styles.weatherIcon}
            source={{ uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png` }}
          />
          <Text style ={styles.temp}>{Number(weather.main.temp).toFixed(0)}°C</Text>
          <Text style={styles.clima}>{weather.weather[0].main} {Number(weather.main.temp_min).toFixed(0)}°C/{Number(weather.main.temp_max).toFixed(0)}°C</Text>
        </View>
      )}
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box :{
    flex : 1,
    alignItems:'center',
    justifyContent:'center',
    marginBottom: 160,
  },
  temp : {
    color : 'white',
    fontSize :87,
    fontWeight: 'ultralight',
    paddingBottom: 13,
  },
  clima : {
    color :'white',
    opacity: 0.55,
    fontSize: 14,
    fontWeight: 'ultralight'
  },
  weatherIcon: {
    width: 184,
    height: 184,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
});
