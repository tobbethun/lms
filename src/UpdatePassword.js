import React from 'react';


export class UpdatePassword extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            oldPassword: '',
            password: '',
            retypePassword: '',
            noMatch: false
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
            oldPassword: this.state.oldPassword,
            password: this.state.password,
            retypePassword: this.state.retypePassword
        };
        if (data.password !== data.retypePassword) {
            this.setState({noMatch: true});
        } else {
            this.setState({noMatch: false});
            fetch("/api/updatePassword/", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    email: this.props.userEmail,
                    oldpassword: data.oldPassword,
                    newpassword: data.password,
                })
            })
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    if (json.code === 200 || 204) {
                        this.setState({updateMessage: json.success})
                    }
                });
        }
    }
    render() {
        const { oldPassword, password, retypePassword, noMatch, updateMessage } = this.state;
        return (
            <div>
                <h3>{updateMessage}</h3>
                <form className='register-form' onSubmit={this.handleSubmit}>
                    <input type="password" placeholder="old password" value={oldPassword}
                           onChange={this.handleChange('oldPassword')} required/>
                    <input type="password" placeholder="password" value={password}
                           onChange={this.handleChange('password')} required/>
                    <input className={`${noMatch && 'no-match'}`} type="password"
                           placeholder="retypePassword" value={retypePassword}
                           onChange={this.handleChange('retypePassword')} required/>
                    <input className='button' type="submit" value="Update"/>
                </form>
                {noMatch &&
                <h3>Type the same password twice</h3>
                }
            </div>
        )
    }
}


export default UpdatePassword;
