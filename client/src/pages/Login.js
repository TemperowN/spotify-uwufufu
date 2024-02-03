function Login() {
    let access_token = '';
    //await promise that fetches the token from the server

    fetch('http://localhost:4000/token').then(response => {
        return response.json();
    }).then(data => {
        access_token = data.access_token;
        console.log(access_token);
        if (access_token != null) {
            window.location.href = "./home";
        }
    }).catch(error => {
        console.log(error);
    });
    return (
        <div className="App">
            <header className="App-header">
                <button> <a href="http://localhost:4000/login">Login with Spotify</a></button>
            </header>
        </div>
    );
}

export default Login;