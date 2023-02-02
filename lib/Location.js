import * as Location from 'expo-location'
import * as SecureStore from 'expo-secure-store'

export const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status === 'granted') {
    const maxDistance = Number(await SecureStore.getItemAsync('maxDistance')) ?? 100
    const { latitude, longitude } = (await Location.getCurrentPositionAsync({})).coords
    return { maxDistance, location: { latitude, longitude }}
  } else {
    return { maxDistance: null, location: null }
  }
}