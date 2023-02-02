import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Title } from 'components/Typography'
import { Spinner } from 'components/Loading'
import { m, l, xl } from 'constants/Spaces'

export const Button = ({ title, onPress, style }) => {
  const { colors } = useTheme()
  const [loading, setLoading] = useState(false)
  return (
    <Pressable
      onPress={async () => {
        setLoading(true)
        await onPress()
        setLoading(false)
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? colors.border : colors.card },
        style
      ]}
    >
      {loading ? <Spinner/> : <Title>{title}</Title>}
    </Pressable>
  );
}

export const Square = ({icon, onPress, style}) => {
  const { colors } = useTheme()
  const [loading, setLoading] = useState(false)
  return (
    <Pressable
      onPress={async () => {
        setLoading(true)
        await onPress()
        setLoading(false)
      }}
      style={({ pressed }) => [
        styles.square,
        { backgroundColor: pressed ? colors.border : colors.card },
        style
      ]}
    >
      {loading ? <Spinner/> : icon }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: l*10,
    borderRadius: l,
    height: xl,
    alignItems:"center",
    justifyContent:"center",
    marginTop: m,
  },
  square: {
    justifyContent:"center",
    alignItems:"center",
    width: m*10,
    height: m*10,
    padding: m,
    marginTop: m,
    borderRadius: l,
  },
});