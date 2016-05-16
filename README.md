# Inshallahapp

An app for Refugees and Volunteers to find and help each other. The app is built using Node.js for the backend, jquery mobile on the frontend, Firebase for the database with the app hosted on Heroku. We've used to Twilio for the text messaging service and a google form for the contact link. 

To run the app locally the most recent version of Node.js must be installed. Then clone the repository and run npm i once you've navigated into the folder. 

The environment variables can be exported onto your local machine by typing the command:

```
export NAME_OF_VARIABLE=1234VARIABLEKEY
```

The name of the variable must be exactly as it appears in the heroku config vars (settings, click reveal) - https://dashboard.heroku.com/apps/inshallah/settings. It must also be exported into the terminal you're using to run the app. 
Then run the command npm serve and visit `localhost:8000`. Changes to the app locally will appear on the live app when merged with master. Changes to the database will appear on the live app even when the code is run locally.

As we're using jquery mobile, the majority of the app is run from one page with links giving the impression of different pages. This is why all the javascript and css files are connected to index.html. 
