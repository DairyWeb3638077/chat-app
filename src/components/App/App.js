import { Route, Switch } from 'react-router-dom';
import { Login, Signup, Chat, Error } from 'components';
import { AuthProvider } from 'context/AuthContext.js';
import { BrowserRouter as Router } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import {fb} from "service/index";

export const App = () => {

    const [mainComponent, setMainComponent] = useState("login")
    useEffect(() => {
    // This hook needs to be here because  GH Pages doesn't allow subdirectories on default,
    // making app unable to refresh on subdomain. So normally there is no need for conditional routes rendering
    if(fb && fb.auth){
        fb.auth.onAuthStateChanged((user) => {
            if (user && user.displayName == null) {
                setMainComponent("chat")
            } else if (user && user.displayName !== null) {
                setMainComponent("chat")
            } else {
                setMainComponent("login")
            }
        })
    } else {
      setMainComponent("error")
    }

    }, []);

    return (
        <div className="app">
            <Router>
                <AuthProvider>
                    <Switch>
                        {(mainComponent === "login") ?
                            <Route path="/" component={Login} /> :
                            <Route exact path="/" component={Chat} />}
                        <Route path="/" component={Signup} />
  {(mainComponent === "error") ? <Route path="/" component={Error} /> : null}
                    </Switch>
                </AuthProvider>
            </Router>
        </div>
    )
}