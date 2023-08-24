import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import SearchField from '../components/SearchField';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Home = () => {
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [locationName, setLocationName] = useState('');
  const [dateData, setDateData] = useState([]);
  const [location, setLocation] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      getLocationName();
    }
  }, [location]);

  const getLocationName = async () => {
    try {
      const { coords } = location;
      const result = await Location.reverseGeocodeAsync(coords);

      if (result.length > 0) {
        const address = result[0];
        setLocationName(address.city || address.region || address.country);
        setCity(address.city || address.region || address.country);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  useEffect(() => {
    getWeather();
  }, [city]);

  const options = {
    method: 'GET',
    url: 'http://api.weatherapi.com/v1/forecast.json',
    params: {
      key: 'dacf27ef63b24343a1420605232308',
      q: city,
      days: '5',
    },
  };

  const getWeather = async () => {
    try {
      setIsLoading(true);
      const response = await axios.request(options);
      setWeatherData(response.data);
      const dates = response.data.forecast.forecastday.map(item => {
        const date = new Date(item.date);
        const dayOfWeek = daysOfWeek[date.getDay()];
        return { date: item.date, dayOfWeek };
      });
      setDateData(dates);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSearchCity = city => {
    setCity(city);
  };

  return (
    <View className="flex flex-col justify-center items-center min-h-screen" style={{backgroundColor: '#1aa7ec'}}>
      <View className="mb-3">
        <Text>Current Location: {locationName}</Text>
      </View>
      <Text className="text-4xl">What is the Weather?</Text>
      <SearchField onSearch={setSearchCity} />
      {isLoading ? <ActivityIndicator /> : null}
      {weatherData.location && weatherData && (
        <View className="mt-10">
          <Text style={{ fontSize: 18 }}>
            {weatherData.location.name}, {weatherData.location.region}
          </Text>
        </View>
      )}
      {dateData.length > 0 ? (
        <View className="flex flex-row justify-between items-center border rounded-md mx-5 mt-5">
            <FlatList
            className="p-3 rounded mb-11 ml-2"
            style={{backgroundColor: "#1aa7ec"}}
            data={dateData}
            renderItem={({ item }) => (
                <View className="flex flex-row justify-between items-center mt-8">
                <Text>{item.dayOfWeek}</Text>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
            <FlatList 
                className="p-3 rounded mb-5 mr-2"
                data={weatherData.forecast.forecastday}
                renderItem={({ item }) => (
                <View className="flex flex-row justify-between items-center mt-2">
                    <Text>Min {item.day.mintemp_c}</Text>
                    <Text>Max {item.day.maxtemp_c}</Text>
                    {item.day.condition.icon && (
                        <Image
                            source={{ uri: "http:" + item.day.condition.icon }}
                            style={{ width: 40, height: 40 }}
                        />
                    )}
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        </View>
      ) : null}
    </View>
  );
};

export default Home;
