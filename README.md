# Twitter Dad Jokes Bot

This Twitter bot project posts daily dad jokes on Twitter using Node.js and the Twitter API v2. It retrieves jokes from the Dad Jokes API through RapidAPI and schedules the daily posting using Firebase Cloud Functions with Pub/Sub.

## Features

- Daily posting: The bot automatically tweets a new dad joke every day.
- Dad Jokes API integration: Jokes are fetched from the Dad Jokes API via RapidAPI.
- Firebase Cloud Functions: The bot uses Firebase Cloud Functions to handle the scheduling and execution of the daily tweet.
- Pub/Sub: The bot leverages Pub/Sub functionality to trigger the daily tweet at the scheduled time.

## Prerequisites

Before running the bot, make sure you have the following:

- Node.js installed on your machine.
- A RapidAPI account and an API key for the Dad Jokes API.
- A Twitter Developer account with API keys and access tokens.
- A Firebase project set up with Cloud Functions and Pub/Sub enabled.
- The necessary dependencies installed (listed in the project's `package.json` file).

## Setup

1. Clone the repository and navigate to the project directory.
2. Install the project dependencies by running `npm install`.
3. Set up your environment variables. Create a `.env` file and populate it with the necessary API keys, access tokens, and other configuration variables. Refer to the `.env.example` file for the required variables.
4. Configure the Firebase project. Ensure that you have the Firebase CLI installed, and use the CLI to set up your project and deploy the Cloud Functions.
5. Set up the Pub/Sub schedule. Use the Firebase CLI or the Firebase console to configure the Pub/Sub schedule to trigger the daily tweet function at the desired time.

## Usage

1. Run the bot locally: Use the command `firebase serve` to start the local development server. This will allow you to test and verify the bot's functionality.
2. Deploy the bot: Use the command `firebase deploy` to deploy the bot to Firebase and make it accessible online.
3. Monitor the bot: Check the Firebase logs and console for any errors or information related to the bot's execution and scheduling.
