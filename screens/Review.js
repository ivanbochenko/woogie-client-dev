import React, { useState, useContext } from 'react';
import { StyleSheet, View, Pressable, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import {Button} from 'components/Button';
import { AppContext } from 'lib/AppContext'
import { useMutation } from 'urql';
import { Title, Input } from 'components/Typography'
import { s, m, l, xl } from 'constants/Spaces';

const postReview =`
  mutation ($author_id: ID!, $user_id: ID!, $stars: Int!, $text: String!) {
    postReview(author_id: $author_id, stars: $stars, text: $text, user_id: $user_id) {
      id
    }
  }
`

export default ({route}) => {

  const { colors } = useTheme();
  
  const { id } = useContext(AppContext).getState()
  
  const [value, setValue] = useState({
    author_id: id,
    user_id: route.params.id,
    text: null,
    stars: null
  })

  const [reviewResult, review] = useMutation(postReview)
  
  const onSubmit = async () => {
    if (!value.text) {
      Alert.alert('Add text')
      return
    }
    if (!value.stars) {
      Alert.alert('Put stars')
      return
    }
    const result = await review(value)
    if (result.error) {
      Alert.alert('Error, review not sent')
    } else {
      Alert.alert('Review sent')
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Title>Review user</Title>
        <View style={[styles.row, styles.rating, { backgroundColor: colors.card }]}>
          {[...Array(5)].map(( item, index ) =>
            <Pressable
              key={index}
              onPress={()=>setValue(value => ({...value, stars: ++index}))}
            >
              <FontAwesome
                name="star"
                size={l}
                color={ value.stars <= index ? 'gray' : colors.primary }
              />
            </Pressable>
          )}
        </View>
        <Input
          multiline
          maxLength={250}
          placeholder={'Review...'}
          onChangeText={ text => setValue(value => ({...value, text}))}
          value={value.text}
        />
        <Button title={'SEND'} onPress={onSubmit}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: m,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rating: {
    alignItems: "center",
    justifyContent: 'space-evenly',
    padding: m,
    borderRadius: xl,
    marginTop: m,
    width: l*10,
    height: xl
  },
});
