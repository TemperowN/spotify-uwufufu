//create express endpoint for the server

const exp = require('constants');
const express = require('express');
const querystring = require('querystring');

var client_id = '943afc88e39a4895bf2561c63d4fd5d6';
var redirect_uri = 'http://localhost:4000/callback';
var access_token;
var refresh_token;
var expires_date;

var app = express();

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

function getAccessToken() {
    if(expire_date < Date.now()) {
        refreshToken();
    } else {
        return access_token;
    }
}

function refreshToken(){
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        })
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        access_token = data.access_token;
        expires_date = data.expires_in + Date.now();
    }).catch(error => {
        console.log(error);
    });
};

app.get('/login', function (req, res) {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        //stringify the query parameters
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
        //send a post request to the spotify api
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
            //console.log(response);
            return response.json();
        }).then(data => {
            console.log(data);
            var access_token = data.access_token;
            var refresh_token = data.refresh_token;
            var expires_in = data.expires_in;
            res.redirect('/save/#' +
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

app.get('/save', function (req, res) {
    access_token = req.query.access_token;
    refresh_token = req.query.refresh_token;
    expires_date = req.query.expires_in + Date.now();
    res.redirect('http://localhost:3000/');
});


//create a server to serve the client
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});

