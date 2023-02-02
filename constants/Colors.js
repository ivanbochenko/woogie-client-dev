import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const platinum = '#ECE9EA'
export const primary = '#E0E7FF'
export const action = '#5C85FF'
export const white = '#FFFCF7'
export const black = '#071013'
export const space = '#222844'
export const eerie = '#191F24'

export const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: action,
    background: white,
    card: primary,
    text: black,
    border: platinum,
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: action,
    background: black,
    card: space,
    text: white,
    border: eerie,
  },
};