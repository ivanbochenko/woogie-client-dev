import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, FlatList, ImageBackground } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { s, m, l, xl } from 'constants/Spaces';
import { height, width } from 'constants/Layout';
import { Text, Title } from 'components/Typography'
import User from 'components/User';
import { FontAwesome } from '@expo/vector-icons';

export default ({ event }) => {
  const { colors } = useTheme()
  const { title, text, time, photo, author, matches, distance, latitude, longitude } = event
  const users = matches.map(item => item.user)
  const image = photo ? {uri: photo} : require('assets/placeholder.png')
  return (
    <SafeAreaView style={[styles.card, {width: width-m, height: height-120-l}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode={'never'}
        bounces={false}
      >
        <ImageBackground source={image} style={{height: height-120-l, justifyContent: 'flex-end'}}>
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            start={{x: 0.5, y: 1}}
            end={{x: 0.5, y: 0}}
          >
            <View style={styles.headRow}>
              <Title style={{ fontSize: l, color: 'white', maxWidth: width-xl*3 }}>{title}</Title>
              {distance >=0 ?
                <View style={[styles.distance, styles.row, {backgroundColor: colors.border}]}>
                  <FontAwesome style={{marginRight: s}} name="map-marker" size={24} color={colors.text} />
                  <Text>{distance} km</Text>
                </View>
                : null
              }
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={{paddingHorizontal: 18, backgroundColor: colors.card}}>
          <View style={{paddingTop: 18}}/>
          <Title>{new Date(time).toLocaleString().replace(/(:\d{2}| [AP]M)$/, "")}</Title>
          <View style={{paddingTop: 18}}/>
          <Text>{text}</Text>
          <View style={{paddingTop: 18}}/>
          <FlatList
            showsHorizontalScrollIndicator={false}
            overScrollMode={'never'}
            horizontal={true}
            data={[author, ...users]}
            renderItem={({item}) => <User user={item} />}
          />
          <View style={{paddingTop: 18}}/>
          <MapView
            style={styles.map}
            scrollEnabled={false}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude, longitude }} >
              <FontAwesome name="map-pin" size={24} color={colors.primary} />
            </Marker>
          </MapView>
          <View style={{paddingTop: 18}}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: 'flex-end',
  },
  headRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    minHeight: xl*2,
  },
  card: {
    borderRadius: l,
    overflow: 'hidden',
  },
  distance: {
    borderRadius: l,
    padding: m,
  },
  map: {
    borderRadius: l,
    width: '100%',
    height: 240,
  },
});
