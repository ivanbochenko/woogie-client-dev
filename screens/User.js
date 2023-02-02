import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useQuery } from 'urql';
import { Spinner } from "components/Loading";
import Error from "components/Error";
import { s, m, l, xl } from 'constants/Spaces';
import { Text, Title } from 'components/Typography'
import { FontAwesome } from '@expo/vector-icons';
import {Review} from 'components/Review'
import { Avatar } from 'components/Avatar';

const query = `
  query ($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      age
      stars
      bio
      reviews {
        id
        time
        text
        stars
        author {
          id
          name
          avatar
        }
      }
    }
  }
`

export default ({route, navigation}) => {
  const { id, review } = route.params
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => ( review &&
        <Pressable onPress={() => navigation.navigate('Review', { id })}>
          <FontAwesome style={{marginRight: 6}} size={30} name="star" color={'gray'} />
        </Pressable>
      ),
    })
  }, [navigation]);
  const { colors } = useTheme()
  const [show, setShow] = useState(false)
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query,
    variables: { id },
  });
  if (fetching) return <Spinner/>;
  if (error) return <Error error={error}/>
  const { avatar, name, age, bio, stars, reviews } = data.user
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={[styles.center, {padding: m}]}>
        <Avatar source={avatar} />
        <Title style={{fontSize: l, marginTop: m}}>{name ?? 'Name'}, {age ?? 'age'}</Title>
        <Pressable
          onPress={() => setShow(s=>!s)}
          style={[styles.starRow, { backgroundColor: colors.card }]}
        >
          {[...Array(5)].map(( item, index ) =>
            <FontAwesome
              key={index}
              name="star"
              size={l}
              color={stars <= index ? 'gray' : colors.primary}
            />
          )}
        </Pressable>
        {show
          ? reviews.map( review  => <Review key={review.id} data={review}/>)
          : <Text>{bio}</Text>
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  starRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: 'space-evenly',
    padding: m,
    borderRadius: l,
    marginVertical: m,
    width: l*10,
    height: xl
  },
});