import React from 'react'
import { View } from 'react-native'
import { useQuery } from 'urql';
import Error from 'components/Error'
import { Spinner } from 'components/Loading';
import Card from 'components/Card'

const eventQuery = `
  query ($id: ID!) {
    event(id: $id) {
      id
      author {
        id
        name
        avatar
      }
      title
      text
      time
      slots
      photo
      latitude
      longitude
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

export default ({ route }) => {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: eventQuery,
    variables: { id: route.params.event_id }
  })
  
  if (fetching) return <Spinner/>;
  if (error) return <Error error={error}/>
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Card event={data.event}/>
    </View>
  )
}
