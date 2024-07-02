
# Trading Bot using Node.js, Alpaca API, and Google Generative AI


Overview : 
This project is a trading bot developed in Node.js that leverages the Alpaca trading API for stock trading and Google Generative AI for analyzing news headlines. The bot listens to real-time news events, evaluates the impact on stocks using AI, and makes buy or sell decisions accordingly.

## Demo

Insert gif or link to demo


## Features

- Real-time News Analysis: Connects to Alpaca's news stream to receive real-time news updates.
- AI-driven Decision Making: Uses Google Generative AI to analyze the impact of news headlines on stock prices.
- Automated Trading: Automatically buys or sells stocks based on the AI's analysis.
- Paper Trading: Operates in a safe paper trading environment for testing without real money.


## Run Locally

Prerequisites
Node.js installed on your machine
An Alpaca account with API keys
Google Cloud account with access to Google Generative AI



```bash
  git clone https://github.com/anuragatwork/stock-trading-automation.git
```

Go to the project directory

```bash
  cd stock-trading-automation
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js
```


## Tech Stack

**Server:** Node, Express , Javascript , Websockets


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`APCA__API_BASE_URL`="https://paper-api.alpaca.markets"

`ALPACA_KEY`="your key from alpaca"

`ALPACA_PASSWORD`='your password from alpaca'

`GEMINI_KEY`="your api key for gemini"


## Upcoming Features
 This project is work in progress
#### Front end 
showcase profit/ loss and current stock holding that changes realtime 


#### Cron Job 
Make your server work only during market ours

#### limit buys 
Buy only best option in a specific time span instead of every stock that is evaluated above impact score of 75 


