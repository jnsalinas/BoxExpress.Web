export const environment = {
  production: false,
  //apiUrl: 'https://boxexpress-api.onrender.com/api',
  //apiUrl: 'https://boxexpress-service.azurewebsites.net/api',
  //apiUrl: 'http://localhost:5143/api', //run
  apiUrl: 'https://localhost:7001/api', //debug
  auth: '/Auth/login',
  defaultValues: {
    cityId: 1,
    countryId: 1,
    balance: 0,
    pickupAddress: 'BodegajeBoxExpress',
  },
};
