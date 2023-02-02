module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            assets: './assets',
            screens: './screens',
            components: './components',
            constants: './constants',
            lib: './lib',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
