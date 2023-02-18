import React, { useReducer, useEffect, useMemo, useRef } from 'react'
import { useColorScheme } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import * as Notifications from 'expo-notifications'
import * as SecureStore from 'expo-secure-store'
import { useFonts } from 'expo-font'
import { Provider } from 'urql'
import { AppContext } from 'lib/AppContext'
import { gqlClient, apiClient } from 'lib/Client'
import { registerForPushNotificationsAsync } from 'lib/Notification'
import { getLocation } from 'lib/Location'
import { MyDarkTheme, MyLightTheme } from 'constants/Colors'
import { fonts } from 'constants/Fonts'
import { RootNavigator } from 'screens/RootNavigator'
import LoginNavigator from 'screens/login/LoginNavigator'
import { Splash } from 'components/Loading'

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default () => {
  try {
    // State
    const initialState = {
      isLoading: true,
      id: null,
      token: null,
      location: null,
      maxDistance: null,
      notification: null
    }
    const reduce = (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            ...action.data,
            isLoading: false,
          }
        case 'SIGN_OUT':
          return {
            ...initialState,
            isLoading: false,
          }
        case 'SET_DATA':
          return {
            ...prevState,
            ...action.data,
          }
      }
    }
    const [state, dispatch] = useReducer(reduce, initialState)
    
    const notificationListener = useRef()
    const responseListener = useRef()
    const colorScheme = useColorScheme()
    const api = apiClient(state.token)
    const client = gqlClient(state.token)
    const [fontsLoaded] = useFonts(fonts)
    
    useEffect(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded])

    const linking = {
      prefixes: ['https://woogie.com', 'woogie://'],
      config: {
        screens: {
          Home: 'Root',
          Login: 'Login'
        },
      },
    }

    useEffect(() => {
      
      // Login
      const loginWithToken = async () => {
        let shouldSignOut = true
        const token = await SecureStore.getItemAsync('token')
        if (token) {
          const pushToken = await registerForPushNotificationsAsync()
          const { status, data } = await api.post(`login`, {token, pushToken})
          if (status === 200) {
            const { location, maxDistance } = await getLocation()
            dispatch({
              type: 'SIGN_IN',
              data: {
                token: data.token,
                id: data.id,
                location,
                maxDistance
              }
            })
            await SecureStore.setItemAsync('token', token)
            shouldSignOut = false
          }
        }
        if (shouldSignOut) {
          dispatch({ type: 'SIGN_OUT' })
        }
      };

      if (state.isLoading) {
        loginWithToken().catch(error => api.post('error', error))        
      }

      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(
        notification => {
          dispatch({type: 'SET_DATA', data: {notification}})
        }
      )

      // This listener is fired whenever a user taps on or interacts with a notification
      // works when app is foregrounded, backgrounded, or killed
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        response => {
          console.error(response)
        }
      )

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }, [])

    const appContext = useMemo(() => ({

      api,
      
      getState: () => state,

      signIn: async ({token, id}) => {
        dispatch({ type: 'SIGN_IN', data: { token, id } })
        await SecureStore.setItemAsync('token', token)
      },

      signOut: async () => {
        dispatch({ type: 'SIGN_OUT' })
        await SecureStore.deleteItemAsync('token')
      },

      setMaxDistance: async (maxDistance) => {
        dispatch({ type: 'SET_DATA', data: { maxDistance }})
        await SecureStore.setItemAsync('maxDistance', JSON.stringify(maxDistance))
      },

    }), [state])

    if (state.isLoading || !fontsLoaded) {
      return <Splash/>
    } else {
      return (
        <NavigationContainer
          linking={linking}
          theme={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}
        >
          <AppContext.Provider value={appContext}>
            {state.token
              ? <Provider value={client} children={<RootNavigator/>}/>
              : <LoginNavigator/>
            }
          </AppContext.Provider>
        </NavigationContainer>
      )
    }
  } catch (error) {
    apiClient().post('error', error)
  }
}