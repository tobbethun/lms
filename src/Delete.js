import React from "react";
import { handleErrors } from "./utils";

export class Delete extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: null };
    }

    checkTypeOfUser() {
        if (this.props.user) {
            const confirm = window.confirm(
                "Är du säker på att du vill ta bort inlägget?"
            );
            if (confirm) {
                this.removeFromDB();
            }
        } else {
            const pin = prompt("Verifiera med Pin kod");
            this.removeFromDB(pin);
        }
    }

    removeFromDB(pin) {
        fetch("/api/admin/delete/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: this.props.id,
                table: this.props.table,
                pin: pin
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState({ message: json.success });
                    this.props.updateList();
                } else {
                    this.setState({ message: json.success });
                }
            })
            .catch(() => {
                this.setState({
                    noNetworkMessage:
                        "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."
                });
            });
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <span className="delete" onClick={() => this.checkTypeOfUser()}>Ta bort</span>
                </div>
            </React.Fragment>
        );
    }
}

export default Delete;
