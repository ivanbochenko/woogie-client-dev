import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { m, l} from 'constants/Spaces';
import { Text } from 'components/Typography'

const size = l*3

export default ({first, second, third}) => {
  const { colors } = useTheme();
  const coloredCircle = [ {backgroundColor: colors.card}, styles.circle, styles.center ]
  return (
    <View style={styles.row}>
      <View style={{ alignItems: "center", marginRight: l}}>
        <Pressable
          style={coloredCircle}
          onPress={first[2]}
        >
          <FontAwesome name={first[0]} size={30} color={colors.primary}/>
        </Pressable>
        <Text style={{color: colors.primary}}>{first[1]}</Text>
      </View>
      <View style={{alignItems: "center", marginRight: l, marginTop: l}}>
        <Pressable
          style={coloredCircle}
          onPress={second[2]}
        >
          <FontAwesome name={second[0]} size={30} color={colors.primary}/>
        </Pressable>
        <Text style={{marginBottom: l, color: colors.primary}}>{second[1]}</Text>
      </View>
      <View style={{alignItems: "center"}}>
        <Pressable
          style={coloredCircle}
          onPress={third[2]}
        >
          <FontAwesome name={third[0]} size={30} color={colors.primary}/>
        </Pressable>
        <Text style={{color: colors.primary}}>{third[1]}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    marginTop: m,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  circle: {
    width: size,
    height: size,
    borderRadius: size/2,
    marginBottom: m
  },
});