import React from 'react';
import Comments from "./Comments";
import Download from "./Download";
import {formatTime, handleErrors} from "./utils";

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
            uploadlist: [],
            attachment: '',
            attachmentRef: ref,
            uploadsuccess: '',
            uploaderror: '',
            uploaded: false
        };
    }

    componentDidMount() {
        this.getUploads();
    }

    handleUpload = (e) => {
        this.setState({ attachment: e.target.files[0] });
    };

    getUploads() {
        function handleErrors(response){
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }

        fetch("/api/getuploads/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                step: this.props.step,
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.setState({uploadlist: json.uploads})
                }
            })
    }

    handleSubmit(e) {
        e.preventDefault();
        let formData  = new FormData();
        formData.append('file', this.state.attachment);
        formData.append('user', this.state.firstname + ' ' + this.state.lastname);
        formData.append('useremail', this.state.email);
        formData.append('ref', this.state.attachmentRef);
        formData.append('step', this.props.step);

        fetch("/api/fileupload/", {
            method: "post",
            body: formData
        }).then(handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log('json', json);
                if (json.code === 200) {
                    this.setState({registerMessage: json.success, uploadsuccess: 'Din fil har blivit uppladdad', uploaded: true, uploaderror: ''})
                    this.getUploads();
                } else {
                        this.setState({registerMessage: json.success, uploaderror: 'Oj nåt gick fel. Vänligen försök igen!'});
                }
            }).catch((error) =>  {
                console.log('error', error);
                this.setState({uploaderror: 'Oj nåt gick knas. Vänligen försök igen!'})
        })
    }
    render() {
        const { uploadsuccess, uploadlist, uploaderror, uploaded } = this.state;
        return (
            <div>
                <div className="attachment">
                    {!uploaded ?
                        <form onSubmit={this.handleSubmit}>
                            <input type="file" required ref="form" onChange={this.handleUpload} name="file" />
                            <button type="submit">Ladda upp din fil</button>
                        </form> :
                        <h3>{uploadsuccess}</h3>
                    }
                    <span className="error-message">{uploaderror}</span>
                </div>
                <div className="attachment-list">
                    {uploadlist &&
                        uploadlist.map((upload) => (
                            <div key={upload.id} className="upload-block">
                                <div className="uploaded-info">
                                    <div className="uploaded__name-time">
                                        <span>{upload.name}</span>
                                        <span>{formatTime(upload.time)}</span>
                                    </div>
                                    <Download path={upload.path} fileName={upload.filename} />
                                </div>
                                <Comments step={upload.id} />
                            </div>
                        ))
                    }
                </div>

            </div>


        )
    }
}

export default Attachment;
