# Basic Bot
This is intended as an introduction for building your first bot. This will have step by step instructions, so you should be able to follow along with no background required.
I will more or less be following the documentation [here](https://discordjs.guide/). The final code for this bot will be a bot that reads any message on your server and writes
that message to your console.

# Getting Started
The first thing you will need to do is create a workspace to place your code. Open up a terminal, and create a new folder. If you are unfamiliar with the terminal,
you can type `mkdir <new folder name>` to create a new folder, and `cd <folder name>` to step into that folder. With `&&` in the middle, you can do both in a single command.
![terminal commands sample](https://github.com/danielprue/discord_bot_tutorial/blob/main/basic_bot/photos/mkdir.PNG?raw=true)

Once you are in the directory you want to be in, start a new project by typing `npm init`. This will create a new project with a `package.json` file. You can also type `code .` 
into your terminal at this point to open up your code in Visual Studio Code. Run `npm install discord.js` in your terminal to install the package we need (ignore any warnings you
get here), which will conclude setup.

# Discord dashboard
Next we need to go to the discord end of things and set up our bot there. Start by going to the [Discord Developer Dashboard](https://discord.com/developers/applications)
and create a new application.
![Create new application sample](https://github.com/danielprue/discord_bot_tutorial/blob/main/basic_bot/photos/discord_new_app.PNG?raw=true)

Now that we have an application, we can go to its `Bot` tab on the left, and click `Add Bot`
![Add bot sample](https://github.com/danielprue/discord_bot_tutorial/blob/main/basic_bot/photos/add_bot.PNG?raw=true)

We now have a bot that we can invite to the server. To do this go to the [permissions calculator](https://discordapi.com/permissions.html#0), select the necessary permissions 
for your bot (for this tutorial, we can check `Read Messages` and nothing else, although you may want other permissions if you plan on expanding this bot), 
and paste your client ID into the box at the bottom. This will generate an invite link for your bot. If this works, you should be able to now see your bot under 
the users of your discord server.
![permission calculator sample](https://github.com/danielprue/discord_bot_tutorial/blob/main/basic_bot/photos/permissions.PNG?raw=true)

![client ID sample](https://github.com/danielprue/discord_bot_tutorial/blob/main/basic_bot/photos/client_id.PNG?raw=true)

# Coding our bot
Now that we have everything ready with our packages and discord environment, we are ready to start coding. The first step is going to be adding 2 files to our main directory.
We need an `index.js` for the main body of our code, and `config.json` for some environment variables that we don't want in the open if this gets pushed to a public repository.

Let's start with the `config.json`. This entire file is going to be a single JavaScript object with a single key/value pairs.
```javascript
{
  "token": "<your-token-here>"
}
```
I've left the token blank here, because that will be specific to your bot. To get your token, go back to your discord dashboard, and copy it from the `Bot` tab
![bot token sample](https://github.com/danielprue/discord_bot_tutorial/blob/main/basic_bot/photos/bot_token.PNG?raw=true)

And that's all there is to the file. It is extremely simple, but there is an important reason we put it here. Anyone who has the token to our bot has full access to it, 
and that can be pretty dangerous depending on the scope of our bot. Our config file will be ignored by a standard push up to Github, so this is a safe place for us to 
put it so that our bot can see it locally, but no one else will be able to use it. If you do accidentally upload a token up to github, you may get a friendly message
from the discord team to regenerate your token, as the security of your bot may now be compromised. For larger projects, we may also use this `config.json` file for 
other sensitive variables, or global variables (such as `prefix`) that will be widely used in our bot.

Next we are ready to work on our `index.js`. We are going to start with the `discord.js` that we installed earlier, and `config.json` that we just wrote. To bring
those in to our current file, write this
```javascript
const Discord = require('discord.js');
const { token } = require('./config.json');
```

Now we have what we need to start a server that our bot runs on. We need to create an instance of our client, then use our token to login
```javascript
const Discord = require('discord.js');
const { token } = require('./config.json');
const client = new Discord.Client();

client.login(token);
```

We can now run our bot by typing `node index.js` into our terminal. It will look like nothing is happening here, but if you go into your discord client, you should now see
your bot is online, rather than offline. However, this bot doesn't actually do anything. Let's give it a message that notifies you in the console that it is online, and 
that responds to a message typed in the discord client.
```javascript
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', (message) => {
  console.log(message.content);
});

client.login(token);
```

Now when we run `node index.js`, we will get a message in the console when it is online. The other block we added is triggered whenever a message is typed anywhere in the
discord server, and responds by echoing that same message into the console.

# Conclusion
And now you have your first bot! While this is an extremely simple example, you now have the tools to write more complex examples. Feel free to explore more of the tools
in the [discord documentation](https://discordjs.guide/), or by checking out my other examples here as I add them.

