import React from 'react';
import {Link} from 'react-router-dom';


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
                    courseid: data.courseid
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


    render() {
        const { registerMessage, showRegistrationForm, courseid, firstname, lastname, email, password, noMatch, retypePassword, hascourseid } = this.state;
        return (
            <div className='register'>
                <h3>{registerMessage}</h3>
                { showRegistrationForm &&
                    <form className='register-form' onSubmit={this.handleSubmit}>
                        <input type="courseid" placeholder="Kurs-ID" value={courseid}
                               onChange={this.handleChange('courseid')} required disabled={hascourseid} />
                        <input type="firstname" placeholder="Förnamn" value={firstname}
                               onChange={this.handleChange('firstname')} required/>
                        <input type="lastname" placeholder="Efternamn" value={lastname}
                               onChange={this.handleChange('lastname')} required/>
                        <input type="email" placeholder="E-postadress" value={email}
                               onChange={this.handleChange('email')} required/>
                        <input type="password" placeholder="Välj lösenord" value={password}
                               onChange={this.handleChange('password')} required/>
                        <input className={`${noMatch && 'no-match'}`} type="password"
                               placeholder="Repetera lösenord" value={retypePassword}
                               onChange={this.handleChange('retypePassword')} required/>
                        <label>Jag godkänner att ELD Studio behandlar mina personuppgifter i enlighet med ELD Studios integritetspolicy.</label>
                        <input className="aprove" type="checkbox" required/>
                        <input className="button" type="submit" value="Slutför registrering"/>
                    </form>
                }
                {noMatch &&
                <h3>Skriv ditt lösenord igen</h3>
                }
                {!showRegistrationForm &&
                    <Link to="/login">Klicka här för att logga in på kursen</Link>
                }
            </div>
        )
    }
}
