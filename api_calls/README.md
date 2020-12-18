# Making API Calls

Next, let's try upgrading our basic bot to do some more interesting things. In this part of the tutorial, we will be making a movie trivia bot to demonstrate making API calls,
add reactions to messages, and send messages. I will also be starting this tutorial with the assumption that you already have a working bot. If you are starting from scratch
here, visit the [first part](../basic_bot) of my tutorial to get up to speed.

# Getting Started

For this tutorial, we will be using the [OMDB API](http://www.omdbapi.com/), which requires a key. Sign up for a free key [here](http://www.omdbapi.com/apikey.aspx), then
activate it through your email. This free key will let us hit the API 1000 times a day. This should be plenty for our uses, but if we pass that limit, we will be unable to
use our bot for the rest of the day, so avoid making more calls than necessary. I will also be using a [curated list](https://www.imdb.com/list/ls091294718/) of popular
movies, so our trivia bot gives us a good pool of questions from movies people are more likely to know. I have a version of this list already formatted for use 
[here](./example-movies.json). *** Add info here about updating permissions, including which permissions we need, and link to update

We will need 2 new environment variables for this tutorial, so we will need to either update our config file if we are building this locally, or update our heroku 
environment variables if we are deploying this. The two new variables we will need are `PREFIX` which we will set to `!` and `OMDB`, which we will set to 
`http://www.omdbapi.com/?apikey=<YOUR-API-KEY>&i=`.

*** Set pic here of heroku env vars

# Command Handling

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
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const command = message.content.slice(prefix.length).trim();

    if (command === 'trivia') {
      message.channel.send("It's Trivia Time!");
    }
  });
```

Now is a good time to test whether our bot is working. If we send a message that says `!trivia`, our bot should respond in the same channel, but for all other messages, it
should do nothing.

- Look up a good API to call -> OMDB?
- Update bot permissions?
- Send messages
- Some other advanced functionality idk
