import React, { useContext } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useQuery } from 'urql';
import { AppContext } from 'lib/AppContext'
import { Spinner } from "components/Loading";
import Error from "components/Error";
import Circles from "components/Circles";
import { Avatar } from 'components/Avatar';
import { m, l } from 'constants/Spaces';
import { Text, Title } from 'components/Typography'

export default ({ navigation }) => {
  const { id } = useContext(AppContext).getState()
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query,
    variables: { id },
  });
  if (fetching) return <Spinner/>;
  if (error) return <Error error={error}/>
  const { name, age, sex, bio, avatar, reviews } = data.user
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{alignItems: "center", padding: m}}>
        <Avatar source={avatar} />
        <Title style={{fontSize: l, marginTop: m}}>{name ?? 'Name'}, {age ?? 'age'}</Title>
        <Circles 
          first={["trash", 'Delete', () => navigation.navigate('Delete')]}
          second={["star", 'Reviews', () => navigation.navigate('Reviews', { reviews })]}
          third={["pencil", 'Edit', () => navigation.navigate('Edit', {name, age, sex, avatar, bio})]}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const query = `
  query ($id: ID!){
    user(id: $id) {
      id
      name
      avatar
      age
      sex
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