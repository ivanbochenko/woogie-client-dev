import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Constants from "expo-constants";
import {Button, Square} from 'components/Button';
import { Avatar } from 'components/Avatar';
import BottomSheet from 'components/BottomSheet';
import {getUploadedPhotoUrl} from 'lib/getUploadedPhotoUrl'
import { AppContext } from 'lib/AppContext'
import { useMutation } from 'urql';
import { s, m, l, xl } from 'constants/Spaces';
import { Text, Input } from 'components/Typography'

const EditUser =`
  mutation ($id: ID!, $name: String!, $bio: String, $age: Int!, $sex: String!, $avatar: String) {
    editUser(id: $id, name: $name, bio: $bio, age: $age, sex: $sex, avatar: $avatar) {
      id
    }
  }
`

export default ({route}) => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const { api } = useContext(AppContext)
  
  const { id } = useContext(AppContext).getState()
  const [photoShow, setPhotoShow] = useState(false)
  const [value, setValue] = useState({...route.params, id})

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if ( cameraRollStatus.status !== "granted" || cameraStatus.status !== "granted" ) {
          Alert.alert("App needs camera permissions")
        }
      }
    })();
  }, []);

  const launchPicker = async (pickFromCamera) => {
    const photoOptions = {
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }
    const photo = pickFromCamera ?
      (await ImagePicker.launchCameraAsync(photoOptions)) :
      (await ImagePicker.launchImageLibraryAsync(photoOptions))
    setPhotoShow(false)
    if (!photo.canceled) {
      const avatar = await getUploadedPhotoUrl({
        photo: photo.assets[0], 
        width: 240, 
        heigth: 240, 
        url: (await api.get(`s3url`)).data
      })
      setValue(value => ({...value, avatar}))
    }
  }

  const [editProfileResult, editProfile] = useMutation(EditUser);
  const onSubmit = async () => {
    if (!value.name) {
      Alert.alert('Add name')
      return
    }
    if (!value.age) {
      Alert.alert('Add age')
      return
    }
    if (!value.sex) {
      Alert.alert('Add sex')
      return
    }
    await editProfile({...value, age: parseInt(value.age)})
    navigation.goBack()
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.center}>
        <Pressable onPress={()=>setPhotoShow(true)}>
          <Avatar source={value.avatar}/>
        </Pressable>
        <Input
          maxLength={50}
          placeholder={'Name...'}
          onChangeText={ name => setValue(value => ({...value, name}))}
          value={value.name}
        />
        <Input
          keyboardType='numeric'
          maxLength={2}
          placeholder={'Age...'}
          onChangeText={ age => setValue(value => ({...value, age}))}
          value={value.age?.toString() ?? ''}
        />
        <Input
          multiline
          maxLength={500}
          placeholder={'Bio...'}
          onChangeText={ bio => setValue(value => ({...value, bio}))}
          value={value.bio}
        />
        <Pressable
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          onPress={() => setValue( value => ({...value, sex: value.sex === 'Man' ? 'Woman' : 'Man'}))}
        >
          <Text>{value.sex ?? 'Sex'}</Text>
        </Pressable>

        <Button title={'SAVE'} onPress={onSubmit}/>
      </ScrollView>

      {/* Photo bottomsheet */}
      <BottomSheet show={photoShow} onOuterClick={()=>setPhotoShow(false)}>
        <View style={[styles.center, styles.row, {justifyContent: 'space-evenly'}]}>
          <Square
            onPress={async () => await launchPicker(true)}
            icon={<FontAwesome name="camera" size={60} color={colors.primary}/>}
          />
          <Square
            onPress={async () => await launchPicker(false)}
            icon={<MaterialIcons name="photo-size-select-actual" size={60} color={colors.primary}/>}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: m,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  input: {
    width: '100%',
    justifyContent: "center",
    marginTop: m,
    borderRadius: l,
    padding: m,
    minHeight: 60,
  },
});