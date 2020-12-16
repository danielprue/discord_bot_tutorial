# Bot Hosting

Now that we have a functioning bot, we want to be able to be able to deploy it remotely, so it isn't dependant on our computer to run.
There are a lot of options for deployment, but I'll be walking through how to deploy on Heroku. This can be done completely on the free level of Heroku,
so this is a really nice introductory option for most hobby level bots.

## Getting Started

Before we begin, we will need an account with Heroku, and your bot's code in a repository on Github.

## Deploying your App

First thing we want to do is get onto our Heroku account. Once we are logged in, we will have the option to create a new app.
Click the button, and create a unique name for your bot. The name is not too important, as we won't really be using it anywhere.
*** image 1

Now we need to connect this new app to the code we have written. The `Deploy` tab will give us a few different options for this, but for this tutorial, we are going to use GitHub.
Select Github as the deployment method, connect to your account, and select the repository with your bot's code. After you connect, you can also choose to Enable Automatic Deploys.
This is not required, but it is a nice feature that will re-deploy your bot anytime you update the code in your repository. Make sure `main` is the selected branch, and hit that
`Deploy Branch` button.
*** image 2
*** image 3

At this point, the build phase will begin, and if everything is in order, we will get a bunch of checkmarks and success messages. Unfortunately our bot is not actually online
when we check Discord. If you go to the `Overview` tab, you might notice the Dyno formation with something that says `web npm start`. This is the worker, and for the extent
that we care for this example, it essentially just runs the command line code that we would normally put in our terminal to start our bot.
The default worker is intended for webpages built in React, which isn't especially useful for us. The command line code we need to run for our bot is `node index.js`.
We can fix this by adding a new file to our GitHub repository. The new file should be called `Procfile` (spelling and case are important here!) and should have a single
line of code `worker: node index.js`. Committing this to our repository will give us a new option in the Dyno formation box (may take a few minutes and refreshes).
Click Configure Dynos so we can turn off the old worker and turn the new one on.
*** image 4

Now we have an appropriate worker, we can rerun the dynos from the `More` menu, and view the logs from the same menu to monitor the deployment. Checking those logs
will reveal that we no longer have the `config.json` variables from our local version.
*** image 5

We can access the config variables under the `Settings` tab. In the `Key` text box, type `token`, and in the value box, copy the token from your `config.json` local file.
Click the `Add` button on this variable, ** take config out of code, then restart dynos, continue later
*** image 6
