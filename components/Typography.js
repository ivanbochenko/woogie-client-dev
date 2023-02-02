import React from 'react'
import { Text as NativeText, TextInput } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { m, l } from 'constants/Spaces';

export const Text = (props) => {
  const { colors } = useTheme()
  return (
    <NativeText
      style={[
        {
          fontSize: 18,
          fontFamily: 'Lato_400Regular',
          color: colors.text,
        }, 
        props.style
      ]}
    >
      {props.children}
    </NativeText>
  )
}

export const Title = (props) => {
  const { colors } = useTheme()
  return (
    <Text
      style={[
        {
          fontSize: 22,
          fontFamily: 'Lato_700Bold',
          color: colors.text,
        }, 
        props.style
      ]}
    >
      {props.children}
    </Text>
  )
}

export const Input = (props) => {
  const { colors } = useTheme()
  return (
    <TextInput
      ref={props.innerRef}
      style={[
        {
          fontSize: 18,
          fontFamily: 'Lato_400Regular',
          width: '100%',
          padding: m,
          borderRadius: l,
          marginTop: m,
          minHeight: 60,
          color: colors.text,
          backgroundColor: colors.card
        }, 
        props.style
      ]}
      placeholderTextColor={'gray'}
      {...props}
    />
  )
}