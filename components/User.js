import React from 'react'
import { StyleSheet, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Title } from 'components/Typography'
import { m } from 'constants/Spaces';

export default ({user}) => {
  const navigation = useNavigation()
  const { avatar, id, name } = user
  const photo = avatar ? {uri: avatar} : require('assets/avatar.png')
  return (
    <Pressable style={styles.center} onPress={() => navigation.navigate("User", {id, review: false})}>
      <Image style={styles.profileImg} source={photo} />
      <Text>{name}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: m,
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
  },
});