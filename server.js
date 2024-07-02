//import alpaca sdk and google generative ai sdk
const Alpaca=require("@alpacahq/alpaca-trade-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");
//to work with env files we imported this 
require('dotenv').config();

//initialising alpaca instance
const alpaca = new Alpaca({
    keyId: process.env.KEY,
    secretKey: process.env.PASSWORD,
    paper: true,
  })
const webSocket=require('ws');
//connect web socket to url
const wss=new webSocket("wss://stream.data.alpaca.markets/v1beta1/news");
//instantiate gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

//function to ask gemini opinion about the stock's headline news
async function run(message) {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    //setting up the context for gemini
    const prompt =`I will tell you a news headling regarding a comapny and your job is to tell me  the impact of that news on company's share.give me a score from 1 to 100 depending upon the impact where 1 highest likelihood  to sell the stock and 100 means highest likelihood to buy the stock. headline is: ${message} , reply only with a number`;
    //getting response
    const result = await model.generateContent(prompt);
    //filtering out the content we need from response 
    const response = await result.response;
    //converting the string to integer
    const text = parseInt(response.text());
    //impact of the current heading over company's share price
    console.log("impact score is : "+text);
    return text;
        
  }

//websocket.on(event,callback)
wss.on('open',()=>{
    console.log("web socket connected");
    //log in to the data source
    const authMessage={
        action :'auth',
        key:process.env.KEY,
        secret:process.env.PASSWORD
    }
    try{
        wss.send(JSON.stringify(authMessage));
    }
    catch(e){
        console.log("error authentication of our web socket", e);
    }
    //subscribe to all news feed
    
    const subscribeMsg={
        action:'subscribe',
        news: ['*']
    }
    wss.send(JSON.stringify(subscribeMsg)); // connected to the live data news source


})
//what happens when we recieve a message from web socket itself
wss.on('message',async(message)=>{
    console.log("web Socket send msg -> "+message);
    const currentEvent=JSON.parse(message)[0];
    if(currentEvent.T==="n"){
        //we have a news event
        console.log("new news event occuerred  ");
        let tickerSymbol=currentEvent.symbols[0];
        // console.log("headline and summary are ",currentEvent.headline)
        console.log("headline "+currentEvent.headline);
        const prompt=`${currentEvent.headline}`
        
        //ask gemini about its thought upon the headline
        const impact= await run(prompt);
        //make trades based upon output
        console.log("impact score is : ",impact);
        console.log("data type of impact is : ",typeof(impact))
        console.log('symbol for the stock is '+tickerSymbol);
        // if score>=70 buy the stock
        if(impact>=70){
            try{
                //wont buy crypto
                const order=await alpaca.createOrder({
                    symbol:tickerSymbol,
                    qty:1,
                    side:'buy',
                    type:'market',
                    time_in_force: 'day' //if day ends it wont trade
                });
                console.log(`bought the stock of ${tickerSymbol}`);
            }
            catch(e){
                console.log("error while buying stock, buy failed",e);
            }
            
        }
        else if(impact<30){
            try{
                const closedPosition=alpaca.closedPosition(symbol);
                console.log("closed the stock for ",tickerSymbol);
            }
            catch(e){
                console.log("error while selling stock, buy failed",e);
            }
            
        }
    }
})