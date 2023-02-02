import React, { useRef } from 'react'
import { View, Animated, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { Text, Title } from 'components/Typography'
import { height, width } from 'constants/Layout';
import { s, m, l, xl } from 'constants/Spaces';

export default ({firstName, secondName, firstAction, secondAction}) => {
  const {colors} = useTheme()
  let transformX = useRef(new Animated.Value(0)).current
  const toggle = (v) => {
    if (v) {
      // Second button action
      Animated.timing(transformX, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start()
      secondAction()
    } else {
      // First button action
      Animated.timing(transformX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start()
      firstAction()
    }
  }
  const rotationX = transformX.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width / 2 - m]
  })
  return (
    <View style={{
      flexDirection: 'row',
      height: xl+m,
      borderRadius: l,
      backgroundColor: colors.card,
      marginVertical: m,
    }}>
      <Animated.View
        style={{
          position: 'absolute',
          height: xl,
          left: s,
          top: s,
          bottom: s,
          borderRadius: l,
          width: width / 2 -l-2,
          transform: [
            { translateX: rotationX }
          ],
          backgroundColor: colors.background,
        }}
      >
      </Animated.View>
      <TouchableOpacity style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }} onPress={()=>toggle(false)}>
        <Text>{firstName}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }} onPress={()=>toggle(true)}>
        <Text>{secondName}</Text>
      </TouchableOpacity>
    </View>
  )
}