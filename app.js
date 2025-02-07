// Wyatt Ford
// ENGL 413
// 2/3/2025
// This script generates a mashup of two quotes from famous individuals,
// and then posts the resulting quote to Bluesky Social. The quote is generated
// with the Llama3.2 model from Meta.

import { AtpAgent } from "@atproto/api";
import dotenv from 'dotenv';
import fetch from "node-fetch";
import fs from 'fs';

// Loads the quotes and authors from the quotes.json file
const quotes = JSON.parse(fs.readFileSync('./quotes.json', 'utf-8'));
// Loads the login details from the .env file
dotenv.config();

/*
Connects to the ATP API and logs in using the login details from the .env file
*/
const agent = new AtpAgent({ service: "https://bsky.social" });
await agent.login({
  identifier: process.env.identifier,
  password: process.env.password,
});

generateMashup();

// Generates a random index to select a random quote from the quotes array
function genRanQuote() {
  return Math.floor(Math.random() * quotes.length);
}


// Gets two random quotes from the existing quotes
// and passes them to the modifyQuote function
async function generateMashup() {
  const index1 = genRanQuote();
  var index2 = index1;
  // Ensures that the two quotes are not the same
  while (index2 == index1) {
    index2 = genRanQuote();
  }
  await modifyQuote(quotes[index1], quotes[index2]);
}

// Sends the two quotes to the LLM running on my computer with instructions on
// how to combine the two quotes. The resulting quote is then passed to the postQuote function
async function modifyQuote(quote1, quote2) {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: `
        Please mash the following two quotes together. Find a creative way to combine them while maintaining the theme of both of them. Do not provide any explanation for why or how you combined the quotes, only provide the final resulting quote. The final quote must not be more than 250 characters in length due to posting limitations. Limit the length of the new quote to 250 characters or less. Ensure that the final quote actually makes sense and is not inherently nonsensical. The quote should be inspirational and uplifting, providing hope and encouragement.\n
        Quote one: ${quote1[0]}\n
        Quote two: ${quote2[0]}
      `,
      "stream": false
    }),
  })
  .then((res) => res.json())
  //.then((json) => console.log(json.response));
  .then((json) => postQuote(json.response, quote1[1], quote2[1]));
}

// Checks whether the combined quote is too long, and then posts it to the ATP API
function postQuote(quote, author1, author2) {
  if (!quote.startsWith('"')) {
    quote = '"' + quote;
  }
  if (!quote.endsWith('"')) {
    quote = quote + '"';
  }
  const mashedQuote = `${quote} - ${author1} and ${author2}`;
  // Ensures that the quote is not too long and generates a new one if so
  if (mashedQuote.length > 300) { 
    console.log("Mashed quote is too long. Trying again.");
    generateMashup();
    return;
  }
  agent.post({ text: mashedQuote, createdAt: new Date().toISOString()})
}