import React, { useEffect, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Facebook from 'expo-auth-session/providers/facebook'
import { ResponseType } from 'expo-auth-session'
import { Button } from 'components/Button'
import { Text, Title } from 'components/Typography'
import { AppContext } from 'lib/AppContext'
import { clientId, redirectUri } from 'constants/Keys'
import { registerForPushNotificationsAsync } from 'lib/Notification'

WebBrowser.maybeCompleteAuthSession()

export const Login = ({navigation}) => {
  const { signIn, api } = useContext(AppContext)
  
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    responseType: ResponseType.Code,
    clientId,
    redirectUri
  })

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        const pushToken = await registerForPushNotificationsAsync()
        signIn((await api.post('login/facebook', {
          verifier: request?.codeVerifier,
          code: response.params.code,
          pushToken
        })).data)
      }
    })()
  }, [response])

  return (
    <View style={styles.container}>
      <Title style={{ padding: 24 }}>Welcome to Woogie!</Title>
      <Text>Login options:</Text>
      <Button
        title={"Facebook"}
        onPress={promptAsync}
      />
      <Button
        title={"Password"}
        onPress={() => navigation.navigate('Password')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})