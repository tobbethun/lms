import React, {Component} from 'react';

export class CookieBar extends Component {
    state = {cookieAccepted: false};
    acceptCookies = () => {
        localStorage.setItem("eldstudio-cookie", true);
        this.setState({ cookieAccepted: true });
    };

    render() {
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn) return null;
        else {
            return (
                <div className={`cookie-bar ${this.state.cookieAccepted ? "cookie-bar-accepted" : ""}`}>
                    <span>ELD Studio använder cookies för att din upplevelse av webbplatsen ska bli så bra som möjligt.</span>
                    <span> Genom att använda vår webbplats accepterar du att cookies används.</span>
                    <button onClick={() => this.acceptCookies()}>Jag förstår</button>
                </div>
            );
        }
    }
}

