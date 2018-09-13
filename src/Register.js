import React from 'react';
import {Link} from 'react-router-dom';
import Integritetspolicy from './Doc/Integritetspolicy_ELD_Studio.pdf';
import {formatTime} from "./utils";


export class Register extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            email: '',
            password: '',
            retypePassword: '',
            firstname: '',
            lastname: '',
            courseid: '',
            currentTime: formatTime(new Date().toLocaleString()),
            registerMessage: 'Fyll i uppgifterna för att registrera dig!',
            noMatch: false,
            showRegistrationForm: true,
            hascourseid: false
        };
    }
    componentDidMount() {
        const courseID = window.location.href.split('?')[1];
        courseID && this.setState({courseid: courseID, hascourseid: true});
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
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password,
            courseid: this.state.courseid,
            retypePassword: this.state.retypePassword
        };
        if (data.password !== data.retypePassword) {
            this.setState({noMatch: true});
        } else {
            this.setState({noMatch: false});
            fetch("/api/register/", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    password: data.password,
                    courseid: data.courseid,
                    currentTime: this.state.currentTime
                })
            })
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    if (json.code === 200) {
                        this.setState({registerMessage: json.success, showRegistrationForm: false});
                    }
                    if (json.code === 204) {
                        this.setState({registerMessage: json.success});
                    }
                });
        }

    }
    openInNewTab = () => {
        var win = window.open(Integritetspolicy, '_blank');
        win.focus();
    };
    render() {
        const { registerMessage, showRegistrationForm, courseid, firstname, lastname, email, password, noMatch, retypePassword, hascourseid } = this.state;
        return (
            <div>
                <div className="top-bar">
                    <Link to="/login" className="logo">ELD Studio</Link>
                </div>
                <div className='register'>
                    <h3>{registerMessage}</h3>
                    { showRegistrationForm &&
                        <form className='register-form' onSubmit={this.handleSubmit}>
                            <input type="courseid" placeholder="Kurs-ID" value={courseid}
                                   onChange={this.handleChange('courseid')} required autoComplete="" disabled={hascourseid} />
                            <input type="firstname" placeholder="Förnamn" value={firstname}
                                   onChange={this.handleChange('firstname')} required autoComplete=""/>
                            <input type="lastname" placeholder="Efternamn" value={lastname}
                                   onChange={this.handleChange('lastname')} required autoComplete=""/>
                            <input type="email" placeholder="E-postadress" value={email}
                                   onChange={this.handleChange('email')} required autoComplete=""/>
                            <input type="password" placeholder="Välj lösenord" value={password}
                                   onChange={this.handleChange('password')} required autoComplete=""/>
                            <input className={`${noMatch && 'no-match'}`} type="password"
                                   placeholder="Repetera lösenord" value={retypePassword}
                                   onChange={this.handleChange('retypePassword')} required autoComplete=""/>
                            <input className="aprove" type="checkbox" required autoComplete=""/>
                            <label>Jag godkänner att ELD Studio behandlar mina personuppgifter i enlighet med <span className="policy-link" onClick={this.openInNewTab}>ELD Studios integritetspolicy.</span>
                            </label>
                            <input className="button" type="submit" value="Slutför registrering"/>
                        </form>
                    }
                    {noMatch &&
                    <h3>Skriv ditt lösenord igen</h3>
                    }
                    {!showRegistrationForm &&
                        <Link to="/login" className="login-after-register">Logga in på kursen</Link>
                    }
                </div>
            </div>
        )
    }
}
