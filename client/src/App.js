import './App.css';
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Redirect from './pages/Redirect';


function App() {

	return (
        <Router>
            <Routes>
				<Route path="/" element={<Redirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );

}

export default App;
