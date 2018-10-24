import React from 'react';
import {Link} from 'react-router-dom';
import {handleErrors} from "./utils";


export class Authenticate extends React.Component {
    state = {
        redirectToReferrer: false
    };

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.test = this.test.bind(this);
        this.state = {
            email: '',
            password: '',
            loginMessage: 'Logga in på din webbkurs här',
            verified: false,
            currentTime: new Date().toLocaleString()
        };
    }

    test(user) {
        this.props.loginFunction(user);
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
        this.btn.setAttribute("disabled", "disabled");
        const data = {
            email: this.state.email,
            password: this.state.password
        };
        fetch("/api/login/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                currentTime: this.state.currentTime
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.setState({loginMessage: json.success});
                if (json.code === 200) {
                    this.test(json.user);
                }
                if (json.code === 204) {
                    this.btn.removeAttribute("disabled", "disabled");
                }
            })
            .catch(() => {
                this.setState({loginMessage: "Ingen kontakt med servern. Kontrollera din internetuppkoppling och ladda sedan om sidan."});
                this.btn.removeAttribute("disabled", "disabled");
            });

    }

    render() {
        const { loginMessage, email, password, verified} = this.state;
        return (
            <div className="authenticate">
                <div className="authenticate-container">
                    <h3 className="authenticate-title">{loginMessage}</h3>
                    <form className="authenticate-form" onSubmit={this.handleSubmit}>
                        <input type="email" placeholder="e-post" value={email}
                               onChange={this.handleChange('email')} required autoComplete=""/>
                        <input type="password" placeholder="lösenord" value={password}
                               onChange={this.handleChange('password')} required autoComplete=""/>
                        <input ref={btn => { this.btn = btn; }} className='button' type="submit" value="Logga in"/>
                    </form>
                    <Link to="/register">Registrera dig</Link>
                </div>
                {verified &&
                <div className="authenticate-intro">
                    <h1>HELLO!</h1>
                </div>
                }
            </div>
        );
    }
}

