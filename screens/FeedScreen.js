import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useMutation } from 'urql';
import { AppContext } from 'lib/AppContext'
import { getLocation } from 'lib/Location'
import { Fade } from "components/Loading";
import CardStack from 'components/CardStack';
import { Text } from 'components/Typography'

const matchMutation = `
  mutation ($user_id: ID!, $event_id: ID!) {
    createMatch(event_id: $event_id, user_id: $user_id) {
      id
    }
  }
`

export default () => {
  const { api } = useContext(AppContext)
  const { id, location, maxDistance } = useContext(AppContext).getState()
  const [events, setEvents] = useState(null)
  // Get location and fetch close events
  useEffect(() => {
    (async () => {
      if (location && maxDistance) {
        setEvents((await api.post(`feed`, {id, location, maxDistance})).data)
      } else {
        const result = await getLocation()
        setEvents((await api.post(`feed`, {id, location: result.location, maxDistance: result.maxDistance})).data)
      }
    })()
  }, [location, maxDistance])

  const [matchResult, match] = useMutation(matchMutation)

  const onSwipeRight = async (event_id) => {
    await match({user_id: id, event_id, dismissed: false})
  }

  const onSwipeLeft = async (event_id) => {
    await match({user_id: id, event_id, dismissed: true})
  }

  if (!events) return <Fade/>

  return (
    <SafeAreaView style={styles.container}>
      <CardStack
        events={events}
        onSwipeRight={onSwipeRight}
        onSwipeLeft={onSwipeLeft}
      >
        <Text>Thats all events in your area</Text>
      </CardStack>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});