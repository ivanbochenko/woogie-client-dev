import React, { useRef } from 'react';
import { Animated, StyleSheet, View, Image, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import { useTheme, useNavigation } from '@react-navigation/native';
import { Text, Title } from 'components/Typography'
import { s, m, l, xl } from 'constants/Spaces';


export default ({event, leave}) => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { id, title, time, photo } = event
  const image = photo ? {uri: photo} : require('assets/placeholder.png')

  const ref = useRef({})
  const onDelete = () => {
    ref.current.close()
    leave()
  }

  const renderRightActions = (progress, dragX) => {
    const translateX = dragX.interpolate({
      inputRange: [0, 24],
      outputRange: [0, 1],
    });
    return (
      <View style={[styles.row, {backgroundColor: colors.card, alignItems: 'center'}]}>
        <Text style={{flex: 1, marginLeft: m}}>Are you sure?</Text>
        <Animated.View style={{transform: [{ translateX }]}}>
          <Pressable onPress={onDelete}>
            <FontAwesome name="times-circle" size={60} color={colors.background} />
          </Pressable>
        </Animated.View>
      </View>
    )
  }
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Swipeable ref={ref} renderRightActions={renderRightActions}>
        <Pressable
          key={id}
          style={[styles.row, {backgroundColor: colors.background}]}
          onPress={() => navigation.navigate('Chat', {event_id: id, title})}
        >
          <Image style={styles.chatImg} source={image} />
          <View style={{flex: 1}}>
            <Title style={{flex: 1}}>{title}</Title>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{color: 'gray', marginRight: m}}>{new Date(time).toLocaleDateString()}</Text>
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  chatImg: {
    width: xl*2,
    height: xl*2,
    borderRadius: xl,
    marginRight: m,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    borderRadius: l,
    marginBottom: m,
  },
});