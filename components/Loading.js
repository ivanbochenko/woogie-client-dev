import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect } from 'react';
import { Platform, StyleSheet, View, ActivityIndicator, Animated, Image } from 'react-native';

export const Spinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={'gray'} />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
    </View>
  );
}

export const Splash = () => {
  return (
    <View style={styles.container}>
      <Image resizeMode={'center'} source={require('assets/logo.png')}/>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
    </View>
  );
}

export const Fade = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          delay: 100,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          delay: 100,
          useNativeDriver: true
        })
      ])
    ).start()
  }, [fadeAnim])

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image resizeMode={'center'} source={require('assets/logo.png')}/>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});