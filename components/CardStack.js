import React, { useState, useEffect } from 'react';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import Card from './Card';

const CIRCLE_RADIUS = 96

export default ({events, children, onSwipeRight, onSwipeLeft}) => {
  const [remainingEvents, setRemainingEvents] = useState(events)
  useEffect(() => {
    setRemainingEvents(events)
  }, [events])
  

  const onRelease = (swipedRight) => {
    const id = remainingEvents[0].id
    if (swipedRight) onSwipeRight(id)
    if (!swipedRight) onSwipeLeft(id)
    setTimeout(() => {
      setRemainingEvents(events => events.slice(1))
      translateX.value = 0
    }, 140);
  }

  // Swipe gesturehandler
  const translateX = useSharedValue(0)

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
    },
    onEnd: () => {
      const distance = Math.abs(translateX.value);

      if (distance < CIRCLE_RADIUS) {
        translateX.value = withSpring(0);
      }
      if (distance > CIRCLE_RADIUS && translateX.value > 0) {
        translateX.value = withTiming(CIRCLE_RADIUS * 5);
        runOnJS(onRelease)(true);
      }
      if (distance > CIRCLE_RADIUS && translateX.value < 0) {
        translateX.value = withTiming(CIRCLE_RADIUS * -5);
        runOnJS(onRelease)(false);
      }
    },
  });

  const FirstCard = ({event}) => {
    const firstCardStyle = useAnimatedStyle(() => ({
        transform: [
          { translateX: translateX.value },
          { rotateZ: `${ translateX.value / 16 }deg` },
        ],
      })
    );
    return (
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={panGestureEvent} activeOffsetX={[-20,20]}>
          <Animated.View style={firstCardStyle}>
            <Card event={event}/>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    )
  }

  const NextCard = ({event}) => {
    const nextCardStyle = useAnimatedStyle(() => ({
      opacity: Math.abs(translateX.value) / 128,
      transform: [
        { 
          scale: 1 - 2 / (0.1 + Math.abs(translateX.value))
        }
      ],
    }));
    return (
      <Animated.View style={[{position: 'absolute'}, nextCardStyle]}>
        <Card event={event}/>
      </Animated.View>
    )
  }

  return (
    <>
      {remainingEvents[1] ? <NextCard event={remainingEvents[1]}/> : null}
      {remainingEvents[0] ? <FirstCard event={remainingEvents[0]}/> : children}
    </>
  );
}