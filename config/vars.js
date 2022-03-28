const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../.env'),
  example: path.join(__dirname, '../.env.example'),
  allowEmptyValues: true,
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.NODE_ENV === 'test' ?
         process.env.MONGO_URI_TESTS :
         process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  base: process.env.BASE_PATH_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  sessionSecret: process.env.SESSION_SECRET,
  googleProjectID: process.env.GOOGLE_PROJECT_ID,
  dialogFlowSessionID: process.env.DIALOGFLOW_SESSION_ID,
  dialogFlowSessionLanguageCode: process.env.DIALOGFLOW_LANGUAGE_CODE,
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,
  chatbotCredentialPath: process.env.GOOGLE_CHATBOT_CREDENTIAL_PATH,
  mongoURI: process.env.MONGO_URI,
};
