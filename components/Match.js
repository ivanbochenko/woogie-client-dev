import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, } from 'components/Typography'
import { m, l } from 'constants/Spaces';
import { useTheme } from '@react-navigation/native';
import User from "components/User";
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  Layout,
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";

export default ({match, onPress}) => {
  const {colors} = useTheme()
  return (
    <>
      <Animated.View
        entering={FadeInLeft}
        exiting={FadeOutRight}
        layout={Layout.springify()}
        style={[styles.match, {backgroundColor: colors.border}]}
      >
        <User user={match.user}/>
        <Pressable style={{alignItems: 'center'}} onPress={onPress}>
          <View style={[styles.circle, {backgroundColor: colors.card}]}>
            <FontAwesome name="check" size={30} color={colors.primary}/>
          </View>
          <Text>Accept</Text>
        </Pressable>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  match: {
    width: '100%',
    flexDirection: "row",
    justifyContent: 'space-around',
    padding: m,
    marginTop: m,
    borderRadius: l,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});