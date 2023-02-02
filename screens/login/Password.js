import React, { useContext, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'components/Button'
import { Input, Text } from 'components/Typography'
import { AppContext } from 'lib/AppContext'

export const Password = ({navigation}) => {
  const { signIn, api } = useContext(AppContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  
  const login = async () => {
    setError(false)
    const { data } = await api.post('login/password', {
      email,
      password,
    })
    if (data.success) {
      signIn(data)
    } else {
      setError(true)
    }
  }

  return (
    <View style={styles.container}>
      {error && <Text style={{color: '#F72C25'}}>Wrong email or password</Text>}
      <Input
        maxLength={50}
        placeholder={'Email...'}
        onChangeText={ t => setEmail(t)}
        value={email}
      />
      <Input
        maxLength={50}
        placeholder={'Password...'}
        onChangeText={ t => setPassword(t)}
        value={password}
      />
      <Button
        title={"LOG IN"}
        onPress={login}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
})