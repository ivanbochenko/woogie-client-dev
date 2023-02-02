import React, { useContext, useState, useCallback } from 'react'
import { View, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { useQuery, useMutation } from 'urql';
import { AppContext } from 'lib/AppContext'
import { Text, Title } from 'components/Typography'
import { s, m, l, xl } from 'constants/Spaces';
import { Spinner } from 'components/Loading';
import Error from 'components/Error'
import Swipe from 'components/Swipe';
import Switch from 'components/Switch';
import Animated, {
  Layout,
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";

// Chats screen displays links to chats of events i matched to

const Matches = () => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    reexecuteQuery({requestPolicy: 'cache-and-network'})
    setRefreshing(false)
  }, []);
  const { id } = useContext(AppContext).getState();
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: myMatches,
    variables: { user_id: id },
  });
  const [deleteResult, deleteMatch] = useMutation(matchMutation)
  if (fetching) return <Spinner/>;
  if (error) return <Error error={error}/>
  return (
    <>
      <Animated.View
        entering={SlideInLeft}
        exiting={SlideOutLeft}
        layout={Layout.duration(200)}
      >
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {data.matches.length ? data.matches.map( match => (
            <Swipe
              key={match.id}
              event={match.event}
              leave={async () => await deleteMatch({ id: match.id })}
            />
            )) : <View style={{alignItems: 'center'}}><Title>No matches</Title></View>}
        </ScrollView>
      </Animated.View>
    </>
  )
}

const Events = () => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    reexecuteQuery({requestPolicy: 'cache-and-network'})
    setRefreshing(false)
  }, []);
  const { id } = useContext(AppContext).getState();
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: myEvents,
    variables: { author_id: id },
  });
  const [deleteResult, deleteEvent] = useMutation(eventMutation)
  if (fetching) return <Spinner/>;
  if (error) return <Error error={error}/>
  return (
    <>
      <Animated.View
        entering={SlideInRight}
        exiting={SlideOutRight}
        layout={Layout.duration(200)}
        >
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {data.events.length ? data.events.map( event =>
            <Swipe
              key={event.id}
              event={event}
              leave={async () => await deleteEvent({ id: event.id })}
              />
              ) : <View style={{alignItems: 'center'}}><Title>No events</Title></View> }
        </ScrollView>
      </Animated.View>
    </>
  )
}

export default () => {
  const [show, setShow] = useState(true)
  return (
    <SafeAreaView style={{flex: 1, paddingHorizontal: m}}>
      <Switch
        firstName={'My matches'}
        firstAction={()=>setShow(true)}
        secondName={'My events'}
        secondAction={()=>setShow(false)}
      />
      {show ? <Matches/> : <Events/>}
    </SafeAreaView>
  )
}


const myMatches = `
  query ($user_id: ID!) {
    matches(user_id: $user_id) {
      id
      event {
        id
        title
        time
        photo
      }
    }
  }
`

const matchMutation = `
  mutation ($id: ID!) {
    deleteMatch(id: $id) {
      id
    }
  }
`

const myEvents = `
  query ($author_id: ID!) {
    events(author_id: $author_id) {
      id
      title
      time
      photo
    }
  }
`

const eventMutation = `
  mutation ($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`