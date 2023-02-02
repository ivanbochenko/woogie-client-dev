import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
import { Title } from 'components/Typography'
import {Review} from 'components/Review'

export default ({route}) => {
  const { reviews } = route.params
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={[styles.center, {padding: 12}]}>
        {reviews.length
          ? reviews.map( review  => <Review key={review.id} data={review}/>)
          : <View style={styles.center}><Title>No reviews</Title></View>
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
});