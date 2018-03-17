import React from 'react';
import logo from './img/gearGreen.svg';
import {Link} from 'react-router-dom';


export class Register extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            email: '',
            password: '',
            retypepassword: '',
            firstname: '',
            lastname: '',
            courseid: '',
            registerMessage: 'Fyll i uppgifterna för att registrera dig!',
            noMatch: false,
            showRegistrationForm: true
        };
    }
    componentDidMount() {
        const courseID = window.location.href.split('?')[1];
        courseID && this.setState({courseid: courseID});
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
            retypepassword: this.state.retypepassword
        };
        if (data.password !== data.retypepassword) {
            this.setState({noMatch: true});
        } else {
            this.setState({noMatch: false});
            fetch("http://localhost:5000/register/", {
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
                    this.setState({registerMessage: json.success, showRegistrationForm: false})
                    // if (json.code === 200) {
                    //     this.test()
                    // }
                });
        }

    }


    render() {
        return (
            <div className='register'>
                <img src={logo} className="register-logo" alt="logo"/>
                <h3>{this.state.registerMessage}</h3>
                { this.state.showRegistrationForm &&
                    <form className='register-form' onSubmit={this.handleSubmit}>
                        <input type="courseid" placeholder="CourseID" value={this.state.courseid}
                               onChange={this.handleChange('courseid')} required/>
                        <input type="firstname" placeholder="Firstname" value={this.state.firstname}
                               onChange={this.handleChange('firstname')} required/>
                        <input type="lastname" placeholder="lastname" value={this.state.lastname}
                               onChange={this.handleChange('lastname')} required/>
                        <input type="email" placeholder="email" value={this.state.email}
                               onChange={this.handleChange('email')} required/>
                        <input type="password" placeholder="password" value={this.state.password}
                               onChange={this.handleChange('password')} required/>
                        <input className={`${this.state.noMatch && 'no-match'}`} type="password"
                               placeholder="retypepassword" value={this.state.retypepassword}
                               onChange={this.handleChange('retypepassword')} required/>
                        <input className='button' type="submit" value="Register"/>
                    </form>
                }
                {this.state.noMatch &&
                <h3>Type the same password twice</h3>
                }
                <Link to="/login">Back to login</Link>
            </div>
        )
    }
}
