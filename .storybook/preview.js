export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: 'linear-gradient(160deg, #191a24, #283247)',
      },
      {
        name: 'white',
        value: '#FFFFFF',
      },
    ],
  },
};
