import React from 'react'
import {Authenticate} from './Authenticate.js'
import {Dashboard} from './Dashboard.js'
import {Register} from './Register.js'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter
} from 'react-router-dom'

// remove localstorage after one day
const checkLS = () => {
    const object = JSON.parse(localStorage.getItem("loggedIn")),
        dateString = object.timestamp,
        now = new Date().getTime();
    if ((now - dateString) > 86400000) {
        localStorage.removeItem('loggedIn');
        return false
    } else {
        return true
    }
}


const Auth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        const object = {valid: true, timestamp: new Date().getTime()};
        localStorage.setItem("loggedIn", JSON.stringify(object));
        setTimeout(cb, 100);
    },
    signout(cb) {
        this.isAuthenticated = false;
        localStorage.removeItem('loggedIn');
        setTimeout(cb, 100);
    }
}
const isLoggedIn = () => {
    console.log('isLoggedIn', localStorage.loggedIn);
    if (localStorage.loggedIn && checkLS()) {
        return true
    } else {
        return false
    }
}

const Public = () => <h3>Public</h3>


class Login extends React.Component {
    state = {
        redirectToReferrer: false,
        showRegisterForm: false
    };
    login = () => {
        Auth.authenticate(() => {
            this.setState(() => ({
                redirectToReferrer: true
            }))
        })
    };
    componentDidUpdate() {
        const currentLocation = this.props.location.pathname;
        console.log(currentLocation);
    }


    render() {
        const {from} = this.props.location.state || {from: {pathname: '/'}}
        const {redirectToReferrer} = this.state

        if (redirectToReferrer === true) {
            return (
                <Redirect to={from}/>
            )
        }
        const AuthenticateComponent = () => {
            return (
                <Authenticate parentFunction={this.login} />
            );
        };
        return (
            <div>
                <p>You must log in to view the page</p>
                <Router>
                    <div>
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

const AuthButton = withRouter(({history}) => (
    Auth.isAuthenticated || localStorage.loggedIn
        ? <button onClick={() => {
            Auth.signout(() => history.push('/'))
        }}>Sign out</button>
        : <p>You are not logged in.</p>
));

export default function App() {
    return (
        <Router>
            <div className="main-wrapper">
                <AuthButton/>
                <ul>
                    <li><Link to="/public">Public Page</Link></li>
                    <li><Link to="/dashboard">Dashboard Page</Link></li>
                </ul>
                <Route path="/public" component={Public}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register} />
                <PrivateRoute path='/dashboard' component={Dashboard}/>
            </div>
        </Router>
    )
}
