const Discord = require('discord.js');
const movies = require('./movies.json');
const client = new Discord.Client();

const fetch = require('node-fetch');

const question_count = 3;

client.once('ready', () => {
  console.log('Ready!');
});

// read message, look for !trivia
client.on('message', async (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const command = message.content.slice(process.env.PREFIX.length).trim();

  if (command === 'trivia') {
    message.channel.send("It's Trivia Time!");

    // get 4 random movies
    const random_numbers = [];
    while (random_numbers.length < 4) {
      n = Math.floor(Math.random() * Object.keys(movies).length) + 1;
      if (!random_numbers.includes(n)) random_numbers.push(n);
    }

    const random_movies = [];
    for (const n of random_numbers) random_movies.push(movies[n]);

    all_movie_data = [];
    for (const movie of random_movies) {
      const movie_data = await fetch(process.env.OMDB + movie).then((response) =>
        response.json()
      );
      all_movie_data.push(movie_data);
    }

    //choose a random question type
    question_type = Math.floor(Math.random() * question_count);
    const answers = [];
    let question = '';
    const genre = all_movie_data[0].Genre.split(',')[0];
    const title = all_movie_data[0].Title;
    const year = all_movie_data[0].Released.slice(-4);

    if (question_type === 0) {
      question = `In what year was ${title} released?\n\n`;
      for (const movie of all_movie_data)
        answers.push(`${movie.Released.slice(-4)}`);
    } else if (question_type === 1) {
      question = `Who directed the ${year} ${genre} film, ${title}?\n\n`;
      for (const movie of all_movie_data) answers.push(`${movie.Director}`);
    } else if (question_type === 2) {
      question = `Who were the stars of the ${year} ${genre} film, ${title}?\n\n`;
      for (const movie of all_movie_data) answers.push(`${movie.Actors}`);
    }

    // send question and multiple choice answers
    let formatted_question_answer = question;
    let correct_answer = -1;
    while (answers.length > 0) {
      n = Math.floor(Math.random() * answers.length);
      if (correct_answer === -1 && n === 0) correct_answer = 5 - answers.length;
      formatted_question_answer += `${(5 - answers.length).toString()} - ${
        answers[n]
      }\n`;
      answers.splice(n, 1);
    }

    // add reactions to prompt the user to vote on an answer
    message.channel.send(formatted_question_answer).then(async (message) => {
      await message.react('1️⃣');
      await message.react('2️⃣');
      await message.react('3️⃣');
      await message.react('4️⃣');

      // after 2 minutes, tally the votes and announce the answer
      setTimeout(() => {
        reaction_count = {
          1: message.reactions.cache.get('1️⃣').count - 1,
          2: message.reactions.cache.get('2️⃣').count - 1,
          3: message.reactions.cache.get('3️⃣').count - 1,
          4: message.reactions.cache.get('4️⃣').count - 1,
        };
        let total_votes = 0;
        for (r of Object.keys(reaction_count)) total_votes += reaction_count[r];

        message.channel.send(
          `The correct answer was option ${correct_answer}. ${reaction_count[correct_answer]} answered correctly out of ${total_votes} total guesses.`
        );
      }, 5000);
    });
  }
});

client.login(process.env.TOKEN);
