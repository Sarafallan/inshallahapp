# Inshallahapp

An app for Refugees and Volunteers to find and help each other. The app is built using:
 * Node.js for the backend
 * jquery mobile on the frontend
 * Firebase for the database
 * Heroku to host
 * Twilio for the text messaging service
 * google form for the contact link.

As we're using jquery mobile, the majority of the app is run from one page with links 
giving the impression of different pages. This is why all the javascript and css files are connected to index.html. 

## To Run Locally

Currently to run the app locally you need to setup a firebase account 
and facebook app and configure them both. See below for notes on how to
setup firebase and facebook.

This assumes you have up-to-date node, npm and git installed:

```shell
# (if you've forked the app, replace the clone domain)
git clone git@github.com:Sarafallan/inshallahapp.git
cd inshallahapp
npm install
export FIREBASE_ACCOUNT=<your firebase project name>
export FIREBASESECRET=<your firebase secret>
node server.js
```

With that the app should be running on `localhost:8000`.

## Notes on firebase and facebook

Currently inshallahapp only works with legacy firebase accounts. To aquire such an account:
 * sign up for a standard firebase account: https://www.firebase.com/signup/
 * log into the legacy console: https://www.firebase.com/login/
 * you should have a project created for you, from there you can copy the project name and project secret

For authentication the app requires you to have an active facebook app connected to the firebase account.

To setup a facebook app follow [these](https://www.firebase.com/docs/web/guide/login/facebook.html) instructions.
