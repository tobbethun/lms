import React, {Component} from 'react';

class UpdateUserInfo extends Component {
    state = {
        showUserInfo: false
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const pin = prompt("Verifiera med Pin kod");
        const updatedUserInfo = {
            email: this.props.user.email,
            firstName: e.target.firstName.value ? e.target.firstName.value : this.props.user.first_name,
            lastName: e.target.lastName.value ? e.target.lastName.value : this.props.user.last_name,
            newpassword: e.target.password.value ? e.target.password.value : this.props.user.password,
            pin: pin
        };

        fetch("/api/admin/updateUserInfo/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(updatedUserInfo)
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState({ message: json.success });
                    setTimeout(() => this.setState({ message: null, showUserInfo: false }), 2500);
                }
                if (json.code === 204) {
                    this.setState({ message: json.success });
                    setTimeout(() => this.setState({ message: null }), 2500);
                }
            })
            .catch(e => {
                console.log("error", e);
                this.setState({
                    message:
                        "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."
                });
            });
    };

    render() {
        const {showUserInfo, message} = this.state;
        return (
            <div>
                <span onClick={()=> this.setState({showUserInfo: !showUserInfo})}>Ändra</span>
                {showUserInfo &&
                <form
                    className="admin-update-userInfo"
                    onSubmit={this.handleSubmit}
                >
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Förnamn"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Efternamn"
                    />
                    <input
                        type="text"
                        name="password"
                        placeholder="Nytt lösenord"
                    />
                    <button className="admin-update-button">
                        Uppdatera
                    </button>
                </form>
                }
                {message}
            </div>
        );
    }
}

export default UpdateUserInfo;
