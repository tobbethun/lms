import React from'react';
import { handleErrors } from "./utils";


export class Delete extends React.Component {
    removeFromDB() {
        fetch("/api/delete/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.props.id,
                table: this.props.table,
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.setState({commentlist: json.comments});
                } else {
                    this.setState({registerMessage: json.success, uploadstatus: 'error'});
                }
            })
            .catch(() => {
                this.setState({noNetworkMessage: "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."});
            });
    }

    render() {

        const {id, table} = this.props;
        return (
            <span className="delete" onClick={() => this.removeFromDB()}>Ta bort</span>
        )
    };
}

export default Delete;
