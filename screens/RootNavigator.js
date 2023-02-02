import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { Header } from 'components/Header'
import { Settings } from './Settings';
import { NotFound } from './NotFound';
import { Test } from './Test';
import Profile from './Profile';
import ProfileDelete from './ProfileDelete';
import ProfileEdit from './ProfileEdit';
import Feed from './FeedScreen';
import MyEvent from './EventScreen';
import Chats from './ChatsScreen';
import Chat from './Chat';
import Event from './Event';
import User from './User';
import Review from './Review';
import Reviews from './Reviews';

const Stack = createNativeStackNavigator()

export const RootNavigator = () => {
  const { colors } = useTheme()
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}}/>
      <Stack.Screen name="NotFound" component={NotFound} options={{ title: 'Oops!' }} />
      <Stack.Screen name="Test" component={Test} options={{ title: 'Test' }} />
      <Stack.Group 
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: { color: 'gray', fontFamily: 'Lato_700Bold' },
        }}
      >
        <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }}/>
        <Stack.Screen name="Edit" component={ProfileEdit} options={{ title: 'Edit Profile' }}/>
        <Stack.Screen name="Delete" component={ProfileDelete} options={{ title: 'Delete Profile' }}/>
        <Stack.Screen name="Reviews" component={Reviews} options={{ title: 'Reviews' }}/>
        <Stack.Screen name="Review" component={Review} options={{ title: 'Review' }}/>
        <Stack.Screen name="User" component={User} options={{ title: 'User' }}/>
        <Stack.Screen name="Event" component={Event} options={{ title: 'Event' }}/>
        <Stack.Screen name="Chat" component={Chat} options={{}}/>
      </Stack.Group>
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const { colors } = useTheme();
  return (
    <>
      <StatusBar/>
      <Header/>
      <Tab.Navigator
        initialRouteName="Feed"
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.background, },
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={() => ({
            tabBarIcon: ({ color }) => <FontAwesome size={30} name="search" color={color} />,
          })}
        />
        <Tab.Screen
          name="MyEvent"
          component={MyEvent}
          options={() => ({
            tabBarIcon: ({ color }) => <FontAwesome size={30} name="ticket" color={color} />,
          })}
        />
        <Tab.Screen
          name="Chats"
          component={Chats}
          options={() => ({
            tabBarIcon: ({ color }) => <Ionicons size={30} name="chatbubble" color={color} />,
          })}
        />
      </Tab.Navigator>
    </>
  );
}