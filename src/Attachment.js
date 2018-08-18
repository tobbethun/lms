import React from 'react';

export class Attachment extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const object = JSON.parse(localStorage.getItem("loggedIn"));
        const ref = Math.random().toString(36).substr(2, 16);
        this.state = {
            firstname: object.user.firstname,
            lastname: object.user.lastname,
            email: object.user.email,
            attachment: '',
            attachmentRef: ref
        };

    }
    handleUpload = (e) => {
        this.setState({ attachment: e.target.files[0] });
    };


    handleSubmit(e) {
        e.preventDefault();
        console.log('this.state.attachment', this.state.attachment);
        let formData  = new FormData();
        formData.append('file', this.state.attachment);
        formData.append('user', this.state.firstname + ' ' + this.state.lastname);
        formData.append('useremail', this.state.email);
        formData.append('ref', this.state.attachmentRef);
        fetch("http://localhost:5000/fileupload/", {
            method: "post",
            body: formData
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.setState({registerMessage: json.success, commentstatus: 'success', comment: ''});
                }
                if (json.code === 204) {
                    this.setState({registerMessage: json.success, commentstatus: 'success'});
                }
            });
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="file" required onChange={this.handleUpload} name="file" />
                    <input type="submit" value="Ladda upp fil" />
                </form>
            </div>


        )
    }
}

export default Attachment;
