import React, { useContext } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { useMutation } from 'urql';
import { AppContext } from 'lib/AppContext'
import {Button} from "components/Button";
import { m, l, xl } from 'constants/Spaces';
import { Text, Title } from 'components/Typography'

export default ({ navigation }) => {
  const { signOut, getState } = useContext(AppContext)
  const { id } = getState();
  const [deleteResult, deleteProfile] = useMutation(deleteMutation)
  const onDelete = async () => {
    Alert.alert(
      "",
      "Are you sure?",
      [
        {
          text: "No",
          onPress: () => navigation.goBack(),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            await deleteProfile({id})
            await signOut()
          }
        }
      ]
    )
  }
  return (
    <SafeAreaView style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
      <Title style={{color: '#F72C25', marginBottom: l}}>DANGER</Title>
      <Text style={{margin: m}}>You are going to delete your profile with all your data</Text>
      <Button title={'DELETE'} onPress={onDelete} style={{backgroundColor: '#F72C25', marginTop: l}} />
    </SafeAreaView>
  )
}

const deleteMutation = `
  mutation ($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`