import { ReactSession } from 'react-client-session';
import querystring from 'query-string';
ReactSession.setStoreType("localStorage");

function refreshTokenIfExpired(){
    let expires_date = ReactSession.get("expires_date");
    if(expires_date < Date.now()){
        fetch('http://localhost:4000/refreshToken?' +
        querystring.stringify({
            refresh_token: ReactSession.get("refresh_token"),
        })).then(response => {
            return response.json();
        }).then(data => {
            ReactSession.set("access_token", data.access_token);
            //ReactSession.set("refresh_token", data.refresh_token);
            //teoricamente il refresh token rimane lo stesso
            ReactSession.set("expires_date", parseInt(data.expires_in) + Date.now());
            console.log("Ho cambiato il token!");
        }).catch(error => {
            console.log(error);
        });
    };
};

export default refreshTokenIfExpired;