import { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const SearchField = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    onSearch(city);
  };

  return (
    <View className="flex flex-row mx-auto mt-10 justify-center items-center w-64 space-x-1">
      <TextInput className="border-2 bg-gray-100 rounded-lg w-full h-12" 
        placeholder="What's the weather like in..."
        value={city}
        onChangeText={setCity}
      />
      <TouchableOpacity className="rounded-xl" onPress={handleSearch} style={{backgroundColor: "#1e2f97"}}>
        <Icon className="p-2" name="search" size={30} color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default SearchField;