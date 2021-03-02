const Bell = require('@hapi/bell');
const Cookie = require('@hapi/cookie');

const isSecure = process.env.NODE_ENV === 'production';

exports.plugin = {
  name: 'auth',
  version: '1.0.0',
  register: async (server) => {
    const location = isSecure
      ? 'https://thekpitracker.herokuapp.com'
      : server.info.uri;
    const redirect = isSecure
      ? 'https://thekpitracker.herokuapp.com/authorization-code/callback'
      : '/authorization-code/callback';
    await server.register([Cookie, Bell]);

    server.auth.strategy('session', 'cookie', {
      cookie: {
        name: 'sid-okta',
        path: '/',
        password: process.env.COOKIE_PWD,
        isSecure,
      },
      // redirectTo: '/authorization-code/callback',
      redirect,
    });
    // OKTA configuration
    server.auth.strategy('okta', 'bell', {
      provider: 'okta',
      config: { uri: process.env.OKTA_ORG_URL },
      password: process.env.COOKIE_PWD,
      isSecure,
      location,
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
    });
    server.auth.default('session');
  },
};
