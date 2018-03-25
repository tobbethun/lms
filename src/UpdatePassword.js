import React from 'react';


export class UpdatePassword extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            oldpassword: '',
            password: '',
            retypepassword: '',
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
            oldpassword: this.state.oldpassword,
            password: this.state.password,
            retypepassword: this.state.retypepassword
        };
        if (data.password !== data.retypepassword) {
            this.setState({noMatch: true});
        } else {
            this.setState({noMatch: false});
            fetch("http://localhost:5000/updatePassword/", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    email: this.props.userEmail,
                    oldpassword: data.oldpassword,
                    newpassword: data.password,
                })
            })
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    this.setState({updateMessage: json.success})
                    // if (json.code === 200) {
                    //     this.test()
                    // }
                });
        }
    }
    render() {
        const { oldpassword, password, retypepassword, noMatch, updateMessage } = this.state;
        return (
            <div>
                <h3>{updateMessage}</h3>
                <form className='register-form' onSubmit={this.handleSubmit}>
                    <input type="password" placeholder="old password" value={oldpassword}
                           onChange={this.handleChange('oldpassword')} required/>
                    <input type="password" placeholder="password" value={password}
                           onChange={this.handleChange('password')} required/>
                    <input className={`${noMatch && 'no-match'}`} type="password"
                           placeholder="retypepassword" value={retypepassword}
                           onChange={this.handleChange('retypepassword')} required/>
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