import React, { useContext, useState, useCallback } from 'react'
import { SafeAreaView, ScrollView, View, Image, Pressable, StyleSheet, RefreshControl } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery, useMutation } from 'urql';
import { AppContext } from 'lib/AppContext'
import { Text, Title } from 'components/Typography'
import { Spinner } from 'components/Loading';
import { Square } from 'components/Button';
import Error from 'components/Error'
import { s, m, l, xl } from 'constants/Spaces';
import Match from "components/Match";
import NewEvent from './NewEvent'

// This screen displays matches and link to event
// Chats screen displays links to chats of events matched to

// Animated.View has bug that shifts all modal view up on android

export default ({ navigation }) => {
  const { colors } = useTheme()
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    reexecuteQuery({requestPolicy: 'network-only'})
    setRefreshing(false)
  }, []);
  const [show, setShow] = useState(false)
  const { id } = useContext(AppContext).getState();
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: myEventToday,
    variables: { author_id: id }
  });
  const [matchUserResult, matchUser] = useMutation(matchMutation)

  // return <NewEvent refresh={reexecuteQuery}/>
  if (fetching) return <Spinner/>;
  if (error) return <Error error={error}/>
  if (!data.lastEvent) return (
    show ? <NewEvent refresh={()=>reexecuteQuery({requestPolicy: 'network-only'})}/> :
    <View style={styles.container}>
      <Title style={{margin: l}}>Create one event for today</Title>
      <Square
        onPress={()=>setShow(true)}
        icon={<FontAwesome name="plus" size={60} color={colors.primary} />}
      />
    </View>
  )
  const { id: event_id, title, photo, matches } = data.lastEvent
  const img = photo ? {uri: photo} : require('assets/avatar.png')
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Pressable
          style={[styles.card, {backgroundColor: colors.card}]}
          onPress={() => navigation.navigate('Chat', { event_id, title })}
        >
          <Image style={styles.img} source={img} />
          <View style={{flex: 1}}>
            <Title>{title}</Title>
          </View>
        </Pressable>
        {matches.length ? matches.map( match => (
          <Match
            key={match.id}
            match={match}
            onPress={async () => await matchUser({id: match.id})}
          />
        )) : <Title style={{margin: m}}>No matches yet</Title>}
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: m
  },
  card: {
    flex: 1,
    padding: m,
    borderRadius: l,
    borderTopLeftRadius: 150/2 + m,
    width: '100%',
    flexDirection: "row",
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    marginRight: m,
  },
  create: {
    alignItems: 'center',
    justifyContent: 'center',
    width: m*10,
    height: m*10,
    borderRadius: l,
    margin: l,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    elevation: s,
  },
});

const myEventToday = `
  query ($author_id: ID!) {
    lastEvent(author_id: $author_id) {
      id
      title
      photo
      matches {
        id
        accepted
        user {
          id
          avatar
          name
        }
      }
    }
  }
`

const matchMutation = `
  mutation ($id: ID!){
    acceptMatch(id: $id) {
      id
    }
  }
`