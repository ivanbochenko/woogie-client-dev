import React from 'react'
import { View, StyleSheet } from 'react-native';
import { Text, Title } from 'components/Typography'
import { s, m, l, xl } from 'constants/Spaces';
import { useTheme } from '@react-navigation/native';
import User from "components/User";
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  Layout,
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";

export const Review = ({data}) => {
  const { colors } = useTheme()
  const { time, text, stars, author } = data
  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutRight}
      layout={Layout.springify()}
      style={[styles.review, {backgroundColor: colors.border}]}
    >
      <View style={styles.row}>
        <User user={author}/>

        <View style={{flex: 1}}>
          <View style={[styles.row, styles.rating]}>
            {[...Array(5)].map(( item, index ) => (
              <FontAwesome
                key={index}
                name="star"
                size={l}
                color={stars <= index ? 'gray' : colors.primary}
              />
            ))}
          </View>
          
          <Text>{text}</Text>
        </View>
      </View>

      <Text style={{color: 'gray', paddingTop: m}}>
        {new Date(time).toLocaleString().replace(/(:\d{2}| [AP]M)$/, "")}
      </Text>
    </Animated.View>
  )
}


const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  review: {
    alignItems: "center",
    padding: m,
    marginTop: m,
    borderRadius: l,
  },
  rating: {
    justifyContent: 'space-between',
    marginBottom: m,
    marginRight: l*3
  },
});