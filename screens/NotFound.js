import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {Button} from 'components/Button';
import { Title } from 'components/Typography'

export const NotFound = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Title>This screen doesn't exist.</Title>
      <Button title={'HOME'} onPress={() => navigation.navigate('Root')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
