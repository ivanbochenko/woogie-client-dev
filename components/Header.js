import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Title } from 'components/Typography'
import { m, l, xl } from 'constants/Spaces';

export const Header = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.background }]}>
      <Pressable onPress={() => navigation.navigate("Profile")}>
        <FontAwesome
          color={'gray'}
          name="user"
          size={30}
        />
      </Pressable>
      <Title style={{color: colors.primary}}>Woogie</Title>
      <Pressable onPress={() => navigation.navigate('Settings')}>
        <FontAwesome
          color={'gray'}
          name="cog"
          size={30}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingTop: xl,
    paddingBottom: m,
    paddingHorizontal: l,
  },
});
