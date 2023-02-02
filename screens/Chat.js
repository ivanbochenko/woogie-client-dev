import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Image, Pressable, TextInput, SafeAreaView, ScrollView, Keyboard } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useSubscription, useMutation } from 'urql';
import { s, m, l, xl } from 'constants/Spaces'
import { height, width } from 'constants/Layout';
import { AppContext } from 'lib/AppContext'
import { Text } from 'components/Typography'
import { Spinner } from 'components/Loading'

import Animated, {
  Layout,
  FadeOutRight,
  FadeInLeft,
} from "react-native-reanimated";

export default ({ route, navigation }) => {

  const { title, event_id } = route.params

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerRight: (props) => (
        <Pressable onPress={() => navigation.navigate('Event', {event_id})}>
          <FontAwesome style={{marginRight: 6}} size={30} name="ticket" color={'gray'} />
        </Pressable>
      ),
    });
  }, [navigation]);

  const { colors } = useTheme()
  const { getState, api } = useContext(AppContext)
  const { id } = getState()

  const [fetching, setFetching] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const inputRef = useRef()
  const scrollRef = useRef()

  // Load previous messages
  
  useEffect(() => {
    (async () => {
      const { data } = await api.post('graphql', {
        query: messagesQuery,
        variables: { event_id }
      })
      setMessages(data.data.messages)
      setFetching(false)
    })()
    Keyboard.addListener('keyboardWillShow', (e) => setKeyboardHeight(e.endCoordinates.height))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardHeight(0))
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow')
      Keyboard.removeAllListeners('keyboardWillHide')
    }
  }, [])
  
  // Subscribe to new messages

  const [res] = useSubscription({
    query: MessagesSubscription, variables: { event_id }
  },
    (messages = [], response) => [ ...messages, response.messages ]
  )

  // Send message
  
  const [messagePostResult, messagePost] = useMutation(PostMessage);
  
  const onSubmit = async () => {
    const text = input
    inputRef.current.clear()
    if (text) {
      const result = await messagePost({
        event_id,
        author_id: id,
        text,
      })
      if (result.error) console.error('Oh no!', result.error);
    }
  }
  
  if (fetching) return <Spinner/>
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        keyboardDismissMode='on-drag'
        overScrollMode={'never'}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd()}
        contentContainerStyle={{paddingBottom: keyboardHeight + 84}}
      >
        {[...messages, ...(res.data ?? [])].map((item, index, array) =>
          <Message
            key={item.id}
            id={id}
            data={item}
            renderAvatar={(array[index-1]?.author.id ?? null) !== item.author.id}
            onPress={()=>navigation.navigate("User", {id: item.author.id, review: true})}
          />
        )}
      </ScrollView>
      <View style={[styles.input, { backgroundColor: colors.card, bottom: keyboardHeight + m }]}>
        <TextInput
          ref={inputRef}
          editable
          onFocus={() => scrollRef.current.scrollToEnd()}
          maxLength={150}
          placeholder={'Message...'}
          placeholderTextColor={'gray'}
          onChangeText={text => setInput(text)}
          value={input}
          onSubmitEditing={onSubmit}
          style={{ flex: 1, color: colors.text, fontFamily: 'Lato_400Regular', fontSize: 18 }}
        />
        <Pressable onPress={onSubmit}>
          <Ionicons name="send" size={30} color={colors.primary} />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const Message = ({data, renderAvatar, onPress, id}) => {
  const { colors } = useTheme()
  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutRight}
      layout={Layout.springify()}
      style={styles.row}
    >
      {!renderAvatar
        ? <View style={{width: l*3}}/>
        : <Pressable onPress={onPress}>
            <Image
              style={styles.profileImg}
              source={data.author.avatar ? {uri: data.author.avatar} : require('assets/avatar.png')}
            />
          </Pressable>
      }
      <View style={[styles.card, { backgroundColor: data.author.id === id ? colors.card : colors.border }]}>
        <Text>{data.text}</Text>
        <Text style={{fontSize: 14, color: 'gray', marginTop: s }}>
          {new Date(data.time).toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    // borderTopLeftRadius: m,
    borderTopRightRadius: l,
    borderBottomRightRadius: l,
    borderBottomLeftRadius: l,
    maxWidth: width-m-l-60,
    padding: m,
    justifyContent: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: m,
    paddingHorizontal: m,
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    overflow: "hidden",
    marginRight: m,
  },
  input: {
    position: 'absolute',
    alignItems: "center",
    flexDirection: "row",
    width: width-l,
    borderRadius: l,
    marginHorizontal: m,
    height: 60,
    padding: m,
  },
});

const PostMessage = `
  mutation ($text: String!, $event_id: ID!, $author_id: ID!) {
    postMessage(text: $text, event_id: $event_id, author_id: $author_id) {
      id
    }
  }
`

const MessagesSubscription =`
  subscription ($event_id: ID!) {
    messages(event_id: $event_id) {
      id
      time
      text
      author {
        id
        name
        avatar
      }
    }
  }
`

const messagesQuery = `
  query ($event_id: ID!) {
    messages(event_id: $event_id) {
      id
      time
      text
      author {
        id
        name
        avatar
      }
    }
  }
`