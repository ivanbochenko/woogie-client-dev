import React, { useState, useContext } from 'react';
import { Alert, Pressable, StyleSheet, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import MapView from 'react-native-maps';
import { useMutation } from 'urql';
import { height, width } from 'constants/Layout';
import { s, m, l, xl } from 'constants/Spaces';
import { AppContext } from 'lib/AppContext'
import {getUploadedPhotoUrl} from 'lib/getUploadedPhotoUrl'
import {Button, Square} from 'components/Button';
import BottomSheet from 'components/BottomSheet';
import { Title, Text, Input } from 'components/Typography'
import DateTimePickerModal from "react-native-modal-datetime-picker";

const CreateEvent = `
  mutation newEvent($author_id: ID!, $title: String!, $text: String!, $photo: String!, $slots: Int!, $time: DateTime!, $latitude: Float!, $longitude: Float!) {
    postEvent(author_id: $author_id, title: $title, text: $text, photo: $photo, slots: $slots, time: $time, latitude: $latitude, longitude: $longitude) {
      id
    }
  }
`

const MAX_SLOTS = 20

export default ({refresh}) => {
  const { colors } = useTheme()
  const combinedInputStyles = [styles.input, { backgroundColor: colors.card }]

  const [showPhotoSheet, setShowPhotoSheet] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [showLocationSheet, setShowLocationSheet] = useState(false)
  
  const { api } = useContext(AppContext)
  const { id, location } = useContext(AppContext).getState()

  const initialState = {
    author_id: id,
    photo: null,
    title: null,
    text: null,
    time: new Date(),
    slots: 1,
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
  }

  const [state, setState] = useState(initialState)

  const [postEventResult, postEvent] = useMutation(CreateEvent)

  const onSubmit = async () => {
    if (!state.photo || !state.title || !state.text) {
      Alert.alert('Pick photo, title and text')
      return
    }
    const photo = await getUploadedPhotoUrl({
      photo: state.photo, 
      width: 576,
      heigth: 864,
      url: (await api.get(`s3url`)).data
    })
    const result = await postEvent({...state, photo})
    if (result.error) console.error('Oh no!', result.error)
    refresh()
  }

  const launchPicker = async (pickFromCamera) => {
    const photoOptions = {
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    }
    const photo = pickFromCamera
      ? (await ImagePicker.launchCameraAsync(photoOptions))
      : (await ImagePicker.launchImageLibraryAsync(photoOptions))

    setShowPhotoSheet(false)
    if (!photo.canceled) setState(state => ({...state, photo: photo.assets[0]}))
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.center, {padding: m}]}
      >

        {/* Add photo */}
        <View style={[styles.heading, {marginBottom: s}]}>
          <Title>Picture</Title>
          <Text style={styles.text}>Select the best picture for your event</Text>
        </View>
        <Pressable
          style={[styles.addImg, {backgroundColor: colors.card}]}
          onPress={() => setShowPhotoSheet(true)}
        >
          {state.photo
            ? <Image style={styles.addImg} source={state.photo}/>
            : <FontAwesome name="camera" size={60} color={colors.primary}/>
          }
        </Pressable>

        {/* Title and text */}
        <View style={styles.heading}>
          <Title>Title & Text</Title>
          <Text style={styles.text}>Write fun and clear intro</Text>
        </View>
        <Input
          maxLength={50}
          placeholder={'Title...'}
          onChangeText={ title => setState(state => ({...state, title}))}
          value={state.title}
        />
        <Input
          multiline
          numberOfLines={3}
          maxLength={300}
          placeholder={'Text...'}
          onChangeText={ text => setState(state => ({...state, text}))}
          value={state.text}
        />

        {/* Pick time */}
        <View style={styles.heading}>
          <Title>Time & Location</Title>
          <Text style={styles.text}>When and where event starts</Text>
        </View>
        <Pressable
          style={[combinedInputStyles, styles.row, {justifyContent: 'space-between'}]}
          onPress={() => setShowTime(true)}
        >
          <FontAwesome name="clock-o" size={24} color={colors.primary}/>
          <Title>{state.time.toLocaleTimeString().replace(/(:\d{2}| [AP]M)$/, "")}</Title>
          <View style={{width: l}}/>
        </Pressable>
        <DateTimePickerModal
          mode="time"
          isVisible={showTime}
          onConfirm={ time => {
            setShowTime(false)
            setState(state => ({...state, time}))
          }}
          onCancel={() => setShowTime(false)}
        />

        {/* Set location */}
        <Pressable
          style={[combinedInputStyles, styles.row, {justifyContent: 'space-between'}]}
          onPress={() => setShowLocationSheet(true)}
        >
          <FontAwesome style={{paddingLeft: s}} name="map-marker" size={l} color={colors.primary}/>
          <Title>Location</Title>
          <View style={{width: m}}/>
        </Pressable>

        {/* Set slots */}
        <View style={styles.heading}>
          <Title>Slots</Title>
          <Text style={styles.text}>How many people you expect</Text>
        </View>
        <View style={[combinedInputStyles, styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <Pressable
            onPress={() => {
              if (state.slots > 1) setState(state => ({...state, slots: --state.slots}))
            }}
            style={[styles.add, {backgroundColor: colors.background}]}
          >
            <FontAwesome name="minus" size={l} color={colors.primary} />
          </Pressable>
          <Title>{state.slots}</Title>
          <Pressable
            onPress={() => {
              if (state.slots < MAX_SLOTS) setState(state => ({...state, slots: ++state.slots}))
            }}
            style={[styles.add, {backgroundColor: colors.background}]}
          >
            <FontAwesome name="plus" size={l} color={colors.primary}/>
          </Pressable>
        </View>

        <Button title={'CREATE'} onPress={onSubmit}/>
      </ScrollView>

      {/* Location bottomsheet */}
      <BottomSheet show={showLocationSheet} height={height}>
        <View style={{flex: 1}}>
          <MapView
            style={{flex: 1}}
            initialRegion={{
              latitude: state.latitude ?? 0,
              longitude: state.longitude ?? 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onRegionChangeComplete={(region) => {
              const { latitude, longitude } = region
              setState(state => ({ ...state, latitude, longitude }))
            }}
          />
          <FontAwesome
            size={30}
            name="map-pin"
            style={styles.marker}
            color={colors.primary}
          />
          <Pressable
            style={[styles.footer, styles.center, { backgroundColor: colors.card, width: width - l*2 }]}
            onPress={()=>setShowLocationSheet(false)}
          >
            <Title style={{color: colors.primary}}>Ok</Title>
          </Pressable>
        </View>
      </BottomSheet>

      {/* Photo bottom sheet */}
      <BottomSheet show={showPhotoSheet} onOuterClick={() => setShowPhotoSheet(false)}>
        <View style={[styles.row, {padding: m, justifyContent: 'space-around'}]}>
          <Square
            onPress={async () => await launchPicker(true)}
            icon={<FontAwesome name="camera" size={60} color={colors.primary}/>}
          />
          <Square
            onPress={async () => await launchPicker(false)}
            icon={<FontAwesome name="photo" size={60} color={colors.primary}/>}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    color: 'gray',
    marginTop: s,
  },
  heading: {
    marginTop: m,
    width: '100%'
  },
  addImg: {
    width: '100%',
    height: m*10,
    borderRadius: l,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: '100%',
    padding: m,
    borderRadius: l,
    marginTop: m,
  },
  add: {
    width: xl,
    height: xl,
    borderRadius: l,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  marker: {
    left: '50%',
    marginLeft: -m,
    marginTop: -m,
    position: 'absolute',
    top: '50%'
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    margin: l,
    padding: m,
    borderRadius: l,
  },
});
