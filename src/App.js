import React from 'react'
import {Authenticate} from './Authenticate.js'
import {Dashboard} from './Dashboard.js'
import {UserSection} from './UserSection.js'
import {Register} from './Register.js'
import {getUser, isLoggedIn} from "./utils";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter
} from 'react-router-dom'



export const Auth = {
    isAuthenticated: false,
    authenticate(user, cb) {
        this.isAuthenticated = true;
        const object = {valid: true, timestamp: new Date().getTime(), user: user};
        localStorage.setItem("loggedIn", JSON.stringify(object));
        setTimeout(cb, 100);
    },
    signout(cb) {
        this.isAuthenticated = false;
        localStorage.removeItem('loggedIn');
        setTimeout(cb, 100);
    }
};

const Public = () => <h3>Om LMS</h3>;


class Login extends React.Component {
    state = {
        redirectToReferrer: false,
        showRegisterForm: false,
        user: getUser()
    };
    login = (user) => {
        Auth.authenticate(user, () => {
            this.setState(() => ({
                redirectToReferrer: true
            }))
        })
    };
    render() {
        const {from} = this.props.location.state || {from: {pathname: '/dashboard'}};
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer === true) {
            return (
                <Redirect to={from}/>
            )
        }
        const AuthenticateComponent = () => {
            return (
                <Authenticate loginFunction={this.login} />
            );
        };
        return (
            <div>
                <Router>
                    <div>
                        <div className="top-bar">
                            <Link to="/" className="logo">LMS</Link>
                        </div>

                        <Switch>
                            <Route path='/login' component={AuthenticateComponent} />
                            <Route path='/register' component={Register} />
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }
}

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        Auth.isAuthenticated === true || isLoggedIn()
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
            }}/>
    )}/>
);

export const AuthButton = withRouter(({history}) => (
    Auth.isAuthenticated || localStorage.loggedIn
        ?
        <div className="logout" onClick={() => {Auth.signout(() => history.push('/'))}}>Logout</div>
        :
        <div />
));

export default function App() {
    return (
        <Router>
            <div className="main-wrapper">
                <div className="start-page">
                <AuthButton />
                <Switch>
                    <Redirect exact from='/' to='/login'/>
                    <Route path='/login' component={Login} />
                </Switch>
                </div>
                <Route path="/public" component={Public}/>
                <Route path="/register" component={Register} />
                <PrivateRoute path='/dashboard' component={Dashboard} />
                <PrivateRoute path='/user' component={UserSection} />
            </div>
        </Router>
    )
}
