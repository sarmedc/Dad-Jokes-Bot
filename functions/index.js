const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Database reference
const dbRef = admin.firestore().doc("tokens/demo");

// Twitter API init
const TwitterApi = require("twitter-api-v2").default;
const twitterClient = new TwitterApi({
  clientId: "CLIENT_ID",
  clientSecret: "CLIENT_SECRET",
});

// Dad Jokes API setup
const options = {
  method: "GET",
  url: "https://dad-jokes.p.rapidapi.com/random/joke",
  headers: {
    "X-RapidAPI-Key": "API_KEY",
    "X-RapidAPI-Host": "dad-jokes.p.rapidapi.com",
  },
};

// Callback URL after authentication
const callbackURL = "http://127.0.0.1:5000/tweet-bot-6b138/us-central1/callback";

// autherize user
exports.auth = functions.https.onRequest(async (request, response) => {
  const {url, codeVerifier, state} = twitterClient.generateOAuth2AuthLink(
      callbackURL,
      {scope: ["tweet.read", "tweet.write", "users.read", "offline.access"]},
  );

  // store verifier
  await dbRef.set({codeVerifier, state});

  response.redirect(url);
});

// callback after authentication
exports.callback = functions.https.onRequest(async (request, response) => {
  const {state, code} = request.query;

  const dbSnapshot = await dbRef.get();
  const {codeVerifier, state: storedState} = dbSnapshot.data();

  if (state !== storedState) {
    return response.status(400).send("Stored tokens do not match!");
  }

  const {
    client: loggedClient,
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: callbackURL,
  });

  await dbRef.set({accessToken, refreshToken});

  const {data} = await loggedClient.v2.me();

  response.send(data);
});

// tweet function
exports.tweet = functions.https.onRequest(async (request, response) => {
  const {refreshToken} = (await dbRef.get()).data();

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(refreshToken);

  await dbRef.set({accessToken, refreshToken: newRefreshToken});

  try {
    const apiResponse = await axios.request(options);
    const {setup, punchline} = apiResponse.data.body[0];
    // eslint-disable-next-line max-len
    const joke = `😄 Joke of the Day 😄\n\n${setup}\n\n${punchline}\n\n#DadJokes #Humor`;

    const {data} = await refreshedClient.v2.tweet(joke);
    response.send(data);
  } catch (error) {
    console.error(error);
    response.send(undefined);
  }
});

// schedule daily tweet function
exports.tweetDaily = functions.pubsub
    .schedule("0 10 * * *")
    .onRun(async (context) => {
      exports.tweet();
    });
