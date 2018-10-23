import React from'react';
import { handleErrors } from "./utils";


export class Delete extends React.Component {
    componentWillMount() {
        this.setState({message: null})
    }

    removeFromDB() {
        const pin = prompt('Verifiera med Pin kod');
        fetch("/api/admin/delete/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.props.id,
                table: this.props.table,
                pin: pin,
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.setState({message: json.success});
                } else {
                    this.setState({message: json.success});
                }
            })
            .catch(() => {
                this.setState({noNetworkMessage: "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."});
            });
    }

    render() {
        return (
            <React.Fragment>
                <span className="delete" onClick={() => this.removeFromDB()}>Ta bort</span>
                {this.state.message && <span className="delete-message"> {this.state.message}</span>}
            </React.Fragment>
        )
    };
}

export default Delete;
