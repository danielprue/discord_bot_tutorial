const Discord = require('discord.js');
const movies = require('./movies.json');
const client = new Discord.Client();

const fetch = require('node-fetch');

client.once('ready', () => {
  console.log('Ready!');
});

// read message, look for !trivia
client.on('message', async (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const command = message.content.slice(process.env.PREFIX.length).trim();

  if (command === 'trivia') {
    message.channel.send("It's Trivia Time!");

    // choose a random movie from our list
    const random_number =
      Math.floor(Math.random() * Object.keys(movies).length) + 1;
    const random_movie = movies[random_number];

    // fetch movie info from the API
    const movie_data = await fetch(process.env.OMDB + random_movie).then((response) =>
      response.json()
    );

    // format question and answer
    const answer = `||${movie_data.Released.slice(-4)}||`;
    const question = `In what year was ${movie_data.Title} released?\n`;

    // send message to discord server
    message.channel.send(question + answer);
  }
});

client.login(process.env.TOKEN);
