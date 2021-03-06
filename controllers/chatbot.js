const dialogflow = require('dialogflow');

const {
  googleProjectID: projectId,
  dialogFlowSessionID: sessionId,
  dialogFlowSessionLanguageCode: languageCode,
  chatbotCredentialPath: keyPath,
} = require('../config/vars');

// Create a new session
const sessionClient = new dialogflow.SessionsClient({keyFilename: keyPath});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

exports.createTextQuery = async (req, res, next) => {
  try {
    // We need to send some information that comes from the client to Dialogflow API
  // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
        // The query to send to the dialogflow agent
          text: req.body.text,
          // The language used by the client (en-US)
          languageCode: languageCode,
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    return res.send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.createEventQuery = async (req, res, next) => {
  try {
    // We need to send some information that comes from the client to Dialogflow API
  // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
        // The query to send to the dialogflow agent
          name: req.body.event,
          // The language used by the client (en-US)
          languageCode: languageCode,
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    return res.send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
