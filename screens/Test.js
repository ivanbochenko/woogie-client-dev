import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { AppContext } from 'lib/AppContext'

export const Test = () => {
  const { notification } = useContext(AppContext).getState()

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {notification &&
        <View>
          <Text>Title: {notification.request.content.title} </Text>
          <Text>Body: {notification.request.content.body}</Text>
          <Text>Data: {JSON.stringify(notification.request.content.data)}</Text>
        </View>
      }
    </View>
  );
}
