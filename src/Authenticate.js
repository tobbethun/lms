import React from 'react';
import {Link} from 'react-router-dom';


export class Authenticate extends React.Component {
    state = {
        redirectToReferrer: false
    }

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.test = this.test.bind(this);
        this.state = {
            email: '',
            password: '',
            loginMessage: 'Please login',
            verified: false
        };
    }

    test() {
        this.props.loginFunction();
    }

    handleChange(key) {
        return (e => {
            const state = {};
            state[key] = e.target.value;
            this.setState(state);
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = {
            email: this.state.email,
            password: this.state.password
        }
        fetch("http://localhost:5000/login/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                email: data.email,
                password: data.password
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.setState({loginMessage: json.success})
                if (json.code === 200) {
                    this.test()
                }
            });
        // On submit of the form, send a POST request with the data to the server.
        // fetch('http://localhost:5000/users/', {
        //   method: 'GET'
        // }).then((response) => {
        //    // Convert to JSON
        //     return response.json();
        //   }).then((j) => {
        //      // Yay, `j` is a JavaScript object
        //   const newUser = j[1].firstname;
        //   this.setState({user: newUser});
        // });
    }

    render() {
        return (
            <div className="authenticate">
                <div className="authenticate-container">
                    <h3 className="authenticate-title">{this.state.loginMessage}</h3>
                    <form className="authenticate-form" onSubmit={this.handleSubmit}>
                        <input type="email" placeholder="email" value={this.state.email}
                               onChange={this.handleChange('email')} required/>
                        <input type="password" placeholder="password" value={this.state.password}
                               onChange={this.handleChange('password')} required/>
                        <input className='button' type="submit" value="LOGIN"/>
                    </form>
                    <Link to="/register">Register</Link>
                </div>
                {this.state.verified &&
                <div className="authenticate-intro">
                    <h1>HELLO!</h1>
                </div>
                }
            </div>
        );
    }
}

