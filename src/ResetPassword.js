import React, { Component } from "react";
import { handleErrors } from "./utils";
import { Link } from "react-router-dom";
import Loader from "./Loader";

class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            loader: false,
            success: false,
            email: "",
            password: "",
            message: "Ange e-post för att återställa ditt lösenord",
            verified: false,
            currentTime: new Date().toLocaleString()
        };
    }

    handleChange = key => {
        return e => {
            const state = {};
            state[key] = e.target.value;
            this.setState(state);
        };
    };

    handleSubmit = e => {
        e.preventDefault();
        this.btn.setAttribute("disabled", "disabled");
        this.setState({ loader: true });
        const data = {
            email: this.state.email
        };
        fetch("/api/resetPassword/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.email,
                currentTime: this.state.currentTime
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState({
                        message: json.message,
                        loader: false,
                        success: true
                    });
                }
                if (json.code === 204) {
                    this.setState({ message: json.message, loader: false });
                }
            })
            .catch((error) => {
                console.log('error', error);
                this.setState({
                    message: "Ingen kontakt med servern. Kontrollera din internetuppkoppling och ladda sedan om sidan.",
                    loader: false
                });
                this.btn.removeAttribute("disabled", "disabled");
            });
    };

    render() {
        const { message, email, verified, loader, success } = this.state;
        return (
            <React.Fragment>
                <div className="top-bar">
                    <Link to="/login" className="logo">
                        ELD Studio
                    </Link>
                </div>
                <div className="authenticate">
                    <div className="authenticate-container">
                        <h3 className="authenticate-title">{message}</h3>
                        {!loader ? (
                            !success && (
                                <form
                                    className="authenticate-form"
                                    onSubmit={this.handleSubmit}
                                >
                                    <input
                                        type="email"
                                        placeholder="e-post"
                                        value={email}
                                        onChange={this.handleChange("email")}
                                        required
                                        autoComplete=""
                                    />
                                    <input
                                        ref={btn => {
                                            this.btn = btn;
                                        }}
                                        className="button"
                                        type="submit"
                                        value="Återställ lösenord"
                                    />
                                </form>
                            )
                        ) : (
                            <Loader />
                        )}

                        <div className="authenticate-links">
                            <Link to="/register">Registrera dig</Link>
                            <Link to="/login">Logga in</Link>
                        </div>
                    </div>
                    {verified && (
                        <div className="authenticate-intro">
                            <h1>Välkommen</h1>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default ResetPassword;
