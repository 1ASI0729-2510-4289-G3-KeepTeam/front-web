export const environment = {
  production: true,
  apiBaseUrl: 'https://back-end-6f02.onrender.com/api/v1',
  fakeAPIBaseUrl: 'https://db-json-server-keeplo-10di.onrender.com/api/v1',

  endpoints: {
    auth: {
      signIn: '/authentication/sign-in',
      signUp: '/authentication/sign-up'
    },
    users: '/users',
    changePassword: (userId: number) => `/users/${userId}/change-password`,
    paymentCards: '/payment-cards',
    collections: '/collections',
    items: '/items'
  }
};

