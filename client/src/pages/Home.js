import React from 'react';
import { ReactSession } from 'react-client-session';
import RefreshToken from '../support/Support';
ReactSession.setStoreType("localStorage");

function getPlaylists(){
    RefreshToken();
    fetch('http://localhost:4000/playlists?' +
    new URLSearchParams({
        access_token: ReactSession.get("access_token"),
    })).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    });
}

function Home() {
    var url = window.location.href;
    var arr=url.split('?');
    if (arr.length !== 1) {
        var arr2=arr[1].split('&');
        var access_token=arr2[0].split('=')[1];
        var refresh_token=arr2[1].split('=')[1];
        var expires_date=arr2[2].split('=')[1];
        expires_date=parseInt(expires_date) + Date.now();
        ReactSession.set("access_token", access_token);
        ReactSession.set("refresh_token", refresh_token);
        ReactSession.set("expires_date", expires_date);
        //da togliere se crea problemi
        window.location.replace("http://localhost:3000/home");
        //
    }

    return (
        <div className="App">
            <header className="App-header">
                <button> <a>Ciao</a></button>
            </header>
        </div>
    );
}

export default Home;