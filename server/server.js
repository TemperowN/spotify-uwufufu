//create express endpoint for the server

const exp = require('constants');
const express = require('express');
const querystring = require('querystring');
const cors = require('cors');
const url = require('url');
//const session = require('express-session');

var client_id = '943afc88e39a4895bf2561c63d4fd5d6';
var redirect_uri = 'http://localhost:4000/callback';
//make access_token refresh_token and expires_date session variables

var app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

app.get('/refreshToken', function (req, res) {
    const data = fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + process.env.SPOTIFY_SECRET).toString('base64')),
            'Access-Control-Allow-Origin': '*'
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: req.query.refresh_token,
            client_id: client_id
        }
    )}).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        res.send(data);
    }).catch(error => {
        console.log(error);
    });
});

app.get('/login', function (req, res) {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', function (req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
            },
            body: querystring.stringify({
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            var access_token = data.access_token;
            var refresh_token = data.refresh_token;
            var expires_in = data.expires_in;

            res.redirect('http://localhost:3000/home?' +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    expires_in: expires_in
                }));
        }).catch(error => {
            console.log(error);
        });
    }
});

app.get('/me', function (req, res) {
    fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + getAccessToken() }
    }).then(response => {
        return response.json();
    }).then(data => {
        res.send(data);
    }).catch(error => {
        console.log(error);
    });
});

app.get('/playlists', function (req, res) {
    fetch('https://api.spotify.com/v1/users/temperrrrrrrr/playlists', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + getAccessToken() } 
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        res.send(data);
    }).catch(error => {
        console.log(error);
    });  
});

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});

