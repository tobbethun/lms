import React from 'react'
import { Authenticate } from './Authenticate.js'
import { Dashboard } from './Dashboard.js'
// import { Login } from './loginTest.js'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

const Auth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    localStorage.setItem('loggedIn', true);
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
  if (localStorage.loggedIn) {
    return true
  } else {
      return false
  }
}

const Public = () => <h3>Public</h3>


class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    Auth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer === true) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <div>
        <Authenticate parentFunction={this.login} />
        <p>You must log in to view the page</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    Auth.isAuthenticated === true || isLoggedIn()
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

const AuthButton = withRouter(({ history }) => (
  Auth.isAuthenticated || localStorage.loggedIn ? (
    <p>
      Welcome! <button onClick={() => {
        Auth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

export default function App () {
  return (
    <Router>
      <div className="main-wrapper">
        <Route path="/login" component={Login}/>
        <AuthButton/>
        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/dashboard">Dashboard Page</Link></li>
        </ul>
        <Route path="/public" component={Public}/>
        <PrivateRoute path='/dashboard' component={Dashboard} />
      </div>
    </Router>
  )
}
