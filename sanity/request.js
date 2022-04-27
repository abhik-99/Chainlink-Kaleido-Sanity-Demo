const sanityClient = require('@sanity/client')
const client = sanityClient({
  projectId: 'jo5awq67',
  dataset: 'production',
  apiVersion: '2021-04-27', // use current UTC date - see "specifying API version"!
  token: 'sk6LafQBoX1qWHZrp4IlomQgDL7c51WKk1hSbsXWaU2c8WpVnOYNXrZYF0IYP5LBz1mdD9vUz6HSTuaeefyPWTGVhQEpCZfArezyW6xj8lNVZW7G5f6Yf8LPvzmVZWQArCiH7bCC72tF913ldPLRFivTLvHMbzBU4WKJD7SQ4xeAcEqBvJav', // or leave blank for unauthenticated usage
  useCdn: false, // `false` if you want to ensure fresh data
})

//id of the document to fetch
client.getDocument('51c0cdd6-d2b7-4de1-9986-d4193583ef64').then((user) => {
    console.log("user fetched", user);
  })