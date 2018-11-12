const functions = require('firebase-functions');
const express = require('express');
const simpleOauth = require('simple-oauth2');
const randomstring = require('randomstring');

const oauth = functions.config().oauth;
const webApp = express();

const oauth2 = simpleOauth.create({
  client: {
    id: oauth.client_id,
    secret: oauth.client_secret
  },
  auth: {
    tokenHost: 'https://unsplash.com/',
    tokenPath: oauth.token_path || '/oauth/token',
    authorizePath: oauth.authorize_path || '/oauth/authorize'
  }
})

webApp.get('/auth', (req, res) => {
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: oauth.redirect_uri,
    scope: oauth.scopes || 'public',
    state: randomstring.generate(32)
  })

  res.redirect(authorizationUri)
})

webApp.get('/callback', (req, res) => {
  console.log( req.query );

  var options = {
    code: req.query.code,
    scope: oauth.scopes || 'public',
    redirect_uri: oauth.redirect_uri
  }

  return oauth2.authorizationCode.getToken(options).then((result) => {
    const token = oauth2.accessToken.create(result)

    // We could also ask unplash about the user profile here if we wanted
    // to setup a firebase user for this authorization
    return res.redirect( oauth.static_site_url + "?access_token=" +token.token.access_token );
  }).catch((error) => {
    console.error('Access Token Error', error.messsage)
    res.send( error )
  })
})

exports.oauth = functions.https.onRequest( webApp )
