# Making API Calls

Next, let's try upgrading our basic bot to do some more interesting things. In this part of the tutorial, we will be making a movie trivia bot to demonstrate making API calls,
add reactions to messages, and send messages. I will also be starting this tutorial with the assumption that you already have a working bot. If you are starting from scratch
here, visit the [first part](../basic_bot) of my tutorial to get up to speed.

# Part 1

## Getting Started

For this tutorial, we will be using the [OMDB API](http://www.omdbapi.com/), which requires a key. Sign up for a free key [here](http://www.omdbapi.com/apikey.aspx), then
activate it through your email. This free key will let us hit the API 1000 times a day. This should be plenty for our uses, but if we pass that limit, we will be unable to
use our bot for the rest of the day, so avoid making more calls than necessary. I will also be using a [curated list](https://www.imdb.com/list/ls091294718/) of popular
movies, so our trivia bot gives us a good pool of questions from movies people are more likely to know. I have a version of this list already formatted for use 
[here](./example-movies.json). *** Add info here about updating permissions, including which permissions we need, and link to update

We will need 2 new environment variables for this tutorial, so we will need to either update our config file if we are building this locally, or update our heroku 
environment variables if we are deploying this. The two new variables we will need are `PREFIX` which we will set to `!` and `OMDB`, which we will set to 
`http://www.omdbapi.com/?apikey=<YOUR-API-KEY>&i=`.

*** Set pic here of heroku env vars

*** Add another section here about installing fetch

## Command Handling

Discord can handle a variety of prompts to begin commands. For this bot, we want our bot to react only when we call it with a specific prompt. To do this, we need our bot
to read all messages, and have it look for a specific message. To do this, we can use the message command handler, which looks like this: 

```javascript
  client.on('message', message => {
  
  })
``` 

The `'message'` in quotes tells our bot to do the next part whenever a message is sent, and the `message => {}` is an
anonymous javascript function, where we can perform a custom action based on the message that was sent. The next part we write will be in the curly brackets. Now we want
to use a special character to signal our bot that we are talking to it. This will be `!`, which we have already labeled as `prefix` in our environment variables.
If our message does not begin with this prefix, we don't want the bot to respond to us, but if it does begin with that, we can give it a variety of commands based on what follows.
We also want our bot to only respond to humans, and not to other bots. To capture both of these, we will add a line to our handler 

```javascript
  client.on('message', message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
  })
```

Now, let's add an actual command for our bot to respond to. When a user types `!trivia` into our Discord server, we want our bot to respond with a trivia question.
Let's parce the command from the message, and if it is the proper command, instruct the bot to respond. To do this, we will update our handler to the following:

```javascript
  client.on('message', (message) => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const command = message.content.slice(process.env.PREFIX.length).trim();

    if (command === 'trivia') {
      message.channel.send("It's Trivia Time!");
    }
  });
```

Now is a good time to test whether our bot is working. If we send a message that says `!trivia`, our bot should respond in the same channel, but for all other messages, it
should do nothing.

## Calling an API

Next, we want to use the OMDB API to get information about a movie that we can use to test the users on our discord. our `movies.json` file here is a list of IMDB keys
that we can use to access specific movies from the API. To keep our trivia bot fresh, let's use a random number generator to pick a movie to request information about.
Let's write some logic to get a random IMDB key from our `movies.json`, the log it to the console to check it:

```javascript
  const random_number = Math.floor(Math.random() * Object.keys(movies).length) + 1
  const random_movie = movies[random_number]
  
  console.log(random_number, random_movie)
```

With this we now have everything we need to use the API. We have the first part of the URL in our environment variables, and the second part in our `random_movie` variable. Let's write our response to the console first to see what we are working with:

```javascript
  const movie_data = await fetch(process.env.OMDB + random_movie).then((response) =>
    response.json()
  );
  console.log(movie_data)
```

With this under our random movie generation, we should now see a bunch of movie data in our console. We can use any of this to write our trivia questions. For this example,
I am going to give the users the movie title, and ask them the year it was released. I'll also add spoiler text to the answer, so users can make their guesses before
seeing the answer

```javascript
  const answer = `||${movie_data.Released.slice(-4)}||`;
  const question = 'In what year was ${movie_data.Title} released?\n`;
  
  message.channel.send(question + answer);
```

Our bot can now ask basic trivia questions! This concludes part 1.

[completed part 1 code](./completed-part-1-index.js)

# Part 2

## Adding Reactions

For this next part, we are going to turn our trivia game into a multiple choice question. Let's start by pulling 4 random movies from the API instead of just 1, so we can
have 1 correct answer and data for 3 incorrect answers.

```javascript
  const random_numbers = [];
  while (random_numbers.length < 4) {
    n = Math.floor(Math.random() * Object.keys(movies).length) + 1;
    if (!random_numbers.includes(n)) random_numbers.push(n);
  }

  const random_movies = [];
  for (const n of random_numbers) random_movies.push(movies[n]);

  all_movie_data = [];
  for (const movie of random_movies) {
    const movie_data = await fetch(omdb + movie).then((response) =>
      response.json()
    );
    all_movie_data.push(movie_data);
  }
```

I have also added some additional questions, and an array for holding each of the potential answers. The correct answer here will always be the first item in the array.
A lot of this is just formatting, so you are free to take some liberties with the way you want your trivia output here.

```javascript
  const question_count = 3;
  
  question_type = Math.floor(Math.random() * question_count)
  const answers = []
  let question = ''
  const genre = all_movie_data[0].Genre.split(',')[0]
  const title = all_movie_data[0].Title
  const year = all_movie_data[0].Released.slice(-4)

  if (question_type === 0) {
    question = `In what year was ${title} released?\n`;
    for (const movie of all_movie_data) answers.push(`${movie.Released.slice(-4)}`);
  } else if (question_type === 1) {
    question = `Who directed the ${year} ${genre} film, ${title}\n?`
    for (const movie of all_movie_data) answers.push(`${movie.Director}`)
  } else if (question_type === 2){
    question = `Who were the stars of the ${year} ${genre} film, ${title}\n?`
    for (const movie of all_movie_data) answers.push(`${movie.Actors}`)
  }
  
  let formatted_question_answer = question;
  while (answers.length > 0) {
    n = Math.floor(Math.random() * answers.length);
    formatted_question_answer += `${(5 - answers.length).toString()}: ${
      answers[n]
    }\n`;
    answers.splice(n, 1);
  }

  message.channel.send(formatted_question_answer);
```

Our multiple choices that we just added are labeled 1-4, so let's add reactions 1️⃣ 2️⃣ 3️⃣ 4️⃣ to prompt users to vote on an answer. Reacting is a promise, so we want
to await before each react to ensure we get these in order.

```javascript
      message.channel.send(formatted_question_answer).then(async (message) => {
      await message.react('1️⃣');
      await message.react('2️⃣');
      await message.react('3️⃣');
      await message.react('4️⃣');
    });
```

*** somehow i have to count the reactions on this message after 2 minutes lol
*** send another message based on reaction count
*** embed -- use posters (part 3)



