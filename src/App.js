import React from "react";
import { Authenticate } from "./Authenticate.js";
import { Dashboard } from "./Dashboard.js";
import { Register } from "./Register.js";
import { getUser, isLoggedIn } from "./utils";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter
} from "react-router-dom";
import ResetPassword from "./ResetPassword";

export const Auth = {
    isAuthenticated: false,
    authenticate(user, cb) {
        this.isAuthenticated = true;
        const object = {
            valid: true,
            timestamp: new Date().getTime(),
            user: user
        };
        localStorage.setItem("loggedIn", JSON.stringify(object));
        setTimeout(cb, 100);
    },
    signout(cb) {
        this.isAuthenticated = false;
        localStorage.removeItem("loggedIn");
        setTimeout(cb, 100);
    }
};

class Login extends React.Component {
    state = {
        redirectToReferrer: false,
        showRegisterForm: false,
        user: getUser()
    };
    login = user => {
        Auth.authenticate(user, () => {
            this.setState(() => ({
                redirectToReferrer: true
            }));
        });
    };
    render() {
        const { from } = this.props.location.state || {
            from: { pathname: "/kurs" }
        };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to={from} />;
        }
        const AuthenticateComponent = () => {
            return <Authenticate loginFunction={this.login} />;
        };
        if (getUser()) {
            return <Redirect exact from="/login" to="/kurs" />;
        } else
            return (
                <div>
                    <div className="top-bar">
                        <Link to="/login" className="logo">
                            ELD Studio
                        </Link>
                    </div>
                    <Route path="/login" component={AuthenticateComponent} />
                </div>
            );
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            Auth.isAuthenticated === true || isLoggedIn() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

export const AuthButton = withRouter(({ history }) =>
    Auth.isAuthenticated || localStorage.loggedIn ? (
        <div className="user-logout">
            <Link to="/kurs/user" className="user-section">
                Min sida
            </Link>
            <div
                className="logout"
                onClick={() => {
                    Auth.signout(() => history.push("/"));
                }}
            >
                Logga ut
            </div>
        </div>
    ) : (
        <div />
    )
);

export default function App() {
    return (
        <Router>
            <div className="main-wrapper">
                <div className="start-page">
                    <Switch>
                        <Redirect exact from="/" to="/login" />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route
                            path="/reset-password"
                            component={ResetPassword}
                        />
                    </Switch>
                </div>
                <PrivateRoute path="/kurs" component={Dashboard} />
            </div>
        </Router>
    );
}
