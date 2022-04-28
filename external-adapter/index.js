const { Requester, Validator } = require('@chainlink/external-adapter');
const sanityClient = require('@sanity/client')

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  userId: ["userId"],
  endpoint: false
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const userId = validator.validated.data.userId;


  const client = sanityClient({
    projectId: process.env.PROJECT_ID , //'jo5awq67',
    dataset: 'production',
    apiVersion: '2021-04-27', // use current UTC date - see "specifying API version"!
    token: process.env.API_TOKEN, //'sk6LafQBoX1qWHZrp4IlomQgDL7c51WKk1hSbsXWaU2c8WpVnOYNXrZYF0IYP5LBz1mdD9vUz6HSTuaeefyPWTGVhQEpCZfArezyW6xj8lNVZW7G5f6Yf8LPvzmVZWQArCiH7bCC72tF913ldPLRFivTLvHMbzBU4WKJD7SQ4xeAcEqBvJav', // or leave blank for unauthenticated usage
    useCdn: false, // `false` if you want to ensure fresh data
  })

  //id of the document to fetch
  client.getDocument(userId)
  .then((user) => {
    const {isTrue, name} = user;
    const response = { data: { name, isTrue } };
    callback(200, Requester.success(jobRunID, response))
  })
  .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
