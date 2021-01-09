import React from "react";
import { Route } from "react-router-dom";
import "./App.css";
import CharEditor from "./CharEditor";
import CharSheet from "./CharSheet";

function App() {
    return (
        <div className="App">
            <header>
                <img
                    className="logo"
                    src="./cyberPLogo_Yellow.svg"
                    alt="logo"
                />
            </header>
            <Route exact path="/">
                <CharEditor />
            </Route>
            <Route
                exact
                path="/character"
                render={(props) => <CharSheet {...props} />}
            ></Route>
        </div>
    );
}

export default App;
