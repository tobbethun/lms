import React from 'react';
import ReactDOM from 'react-dom';
import Comments from "./Comments";

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
            uploadstatus: ''
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
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.setState({registerMessage: json.success, uploadstatus: 'success', comment: ''});
                    ReactDOM.findDOMNode(this.refs.form).value = '';
                }
                if (json.code === 500|| 401) {
                    this.setState({registerMessage: json.success, uploadstatus: 'success'});
                }
            })
            .then(() => {
            this.getUploads();
        })
    }
    render() {
        const { firstname, lastname, uploadstatus, uploadlist } = this.state;
        return (
            <div>
                <div className={`attachment ${uploadstatus}`}>
                    {firstname} {lastname}
                    <form onSubmit={this.handleSubmit}>
                        <input type="file" required ref="form" onChange={this.handleUpload} name="file" />
                        <input type="submit" value="Ladda upp fil" />
                    </form>
                </div>
                <div className="attachment-list">
                    {uploadlist &&
                        uploadlist.map((upload, index) => (
                            <div key={index} className="upload-block">
                                <p>{upload.name}</p>
                                <a href='p'>{upload.filename}</a>
                                <hr/>
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
