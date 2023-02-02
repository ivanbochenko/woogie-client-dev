import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Linking from 'expo-linking';
import { AppContext } from 'lib/AppContext'
import {Button} from 'components/Button';
import { Title } from 'components/Typography'
import { useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

export const Settings = ({navigation}) => {
  const { colors } = useTheme()
  const { signOut, setMaxDistance } = useContext(AppContext)
  const { maxDistance } = useContext(AppContext).getState()

  return (
    <View style={[styles.center, {flex: 1}]}>

      <View>
        <Title>Max distance to event: {maxDistance} km</Title>
        <Slider
          step={1}
          minimumValue={1}
          maximumValue={100}
          value={maxDistance}
          thumbTintColor={colors.primary}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.card}
          onSlidingComplete={value => setMaxDistance(value)}
        />
      </View>

      <View>
        <Button title={'FEEDBACK'} onPress={() => Linking.openURL('mailto:woogie.ceo@gmail.com')}/>
        <Button title={'UPGRADE'} onPress={() => {}}/>
        <Button title={'TEST'} onPress={() => navigation.navigate('Test')}/>
      </View>

      <Button title={'LOG OUT'} onPress={signOut}/>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
});
