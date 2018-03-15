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
            retypepassword: '',
            firstname: '',
            lastname: '',
            courseid: ''
        };
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
            retypepassword: this.retypepassword
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
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="firstname" placeholder="Firstname" value={this.state.firstname} onChange={this.handleChange('firstname')} required />
                    <input type="lastname" placeholder="lastname" value={this.state.lastname} onChange={this.handleChange('lastname')} required />
                    <input type="email" placeholder="email" value={this.state.email} onChange={this.handleChange('email')} required />
                    <input type="password" placeholder="password" value={this.state.password} onChange={this.handleChange('password')} required />
                    <input type="retypepassword" placeholder="retypepassword" value={this.state.retypepassword} onChange={this.handleChange('retypepassword')} required />
                    <input type="submit" value="Register" />
                </form>
                <Link to="/login">Back to login</Link>
            </div>
        )
    }
}
