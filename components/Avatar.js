import React from 'react'
import { StyleSheet, Image } from 'react-native'

const size = 180

export const Avatar = ({source}) => {
  const photo = source ? {uri: source} : require('assets/avatar.png')
  return (
    <Image style={styles.profileImg} source={photo} />
  )
}

const styles = StyleSheet.create({
  profileImg: {
    width: size,
    height: size,
    borderRadius: size/2,
  },
});