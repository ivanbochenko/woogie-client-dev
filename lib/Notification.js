import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

export const registerForPushNotificationsAsync = async () => {

  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications')
    return
  }

  const { status } = await Notifications.getPermissionsAsync()

  if (status !== 'granted') {
    const requestedStatus = (await Notifications.requestPermissionsAsync()).status
    if (requestedStatus !== 'granted') {
      throw new Error('Permission for notifications not granted!')
    }
  }

  const { data } = await Notifications.getExpoPushTokenAsync()
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  
  return data
}