import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'components/Typography'
import { l } from 'constants/Spaces';
import {Button} from 'components/Button'

export default ({error}) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Title>Server error</Title>
      <Text style={{padding: l}}>{error.message}</Text>
      <Button title={'Go Back'} onPress={()=>navigation.goBack()}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});