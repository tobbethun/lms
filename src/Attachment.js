import React from "react";
import Comments from "./Comments";
import Download from "./Download";
import { formatTime, handleErrors } from "./utils";
import Delete from "./Delete";

export class Attachment extends React.Component {
    constructor(props) {
        super(props);
        const object = JSON.parse(localStorage.getItem("loggedIn"));
        const ref = Math.random()
            .toString(36)
            .substr(2, 16);
        this.state = {
            firstname: object.user.firstname,
            lastname: object.user.lastname,
            email: object.user.email,
            role: object.user.role,
            uploadlist: [],
            attachment: "",
            attachmentRef: ref,
            uploadsuccess: "",
            uploaderror: "",
            uploaded: false
        };
    }

    componentDidMount() {
        this.getUploads();
    }

    handleUpload = e => {
        this.setState({ attachment: e.target.files[0] });
    };

    getUploads = () => {
        fetch("/api/getuploads/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                course: this.props.courseID,
                step: this.props.step
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState({ uploadlist: json.uploads });
                }
            })
            .catch(() => {
                this.setState({
                    noNetworkMessage:
                        "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."
                });
            });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.btn.setAttribute("disabled", "disabled");
        let formData = new FormData();
        formData.append("file", this.state.attachment);
        formData.append(
            "user",
            this.state.firstname + " " + this.state.lastname
        );
        formData.append("useremail", this.state.email);
        formData.append("ref", this.state.attachmentRef);
        formData.append("course", this.props.courseID);
        formData.append("step", this.props.step);

        fetch("/api/fileupload/", {
            method: "post",
            body: formData
        })
            .then(handleErrors)
            .then(response => {
                if (response.status === 413) {
                    this.setState({
                        noNetworkMessage:
                            "Filen är för stor. Max tillåtet är 25MB."
                    });
                }
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState({
                        registerMessage: json.success,
                        uploadsuccess: "Din fil har blivit uppladdad",
                        uploaded: true,
                        uploaderror: ""
                    });
                }
                if (json.code === 400 || json.code === 500) {
                    this.setState({
                        registerMessage: json.success,
                        uploaderror: "Oj nåt gick fel. Vänligen försök igen!"
                    });
                }
            })
            .then(() => this.getUploads())
            .catch(() => {
                this.setState({
                    noNetworkMessage:
                        "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."
                });
                this.btn.removeAttribute("disabled", "disabled");
            });
    };
    render() {
        const {
            uploadsuccess,
            uploadlist,
            uploaderror,
            uploaded,
            noNetworkMessage,
            role,
            email
        } = this.state;
        const adminDelete = role === "admin";
        return (
            <div>
                {noNetworkMessage && (
                    <div className="info-box">{noNetworkMessage}</div>
                )}
                <div className="attachment">
                    {!uploaded ? (
                        <form onSubmit={this.handleSubmit}>
                            <input
                                type="file"
                                required
                                ref="form"
                                onChange={this.handleUpload}
                                name="file"
                            />
                            <button
                                ref={btn => {
                                    this.btn = btn;
                                }}
                                type="submit"
                                style={{
                                    backgroundColor: this.props.colorCode,
                                    borderColor: this.props.colorCode
                                }}
                            >
                                Ladda upp
                            </button>
                        </form>
                    ) : (
                        <h3>{uploadsuccess}</h3>
                    )}
                    <span className="error-message">{uploaderror}</span>
                </div>
                <div className="attachment-list">
                    {uploadlist &&
                        uploadlist.map(upload => (
                            <div key={upload.id} className="upload-block">
                                <div className="uploaded-info">
                                    <div className="uploaded__name-time">
                                        <span>{upload.name}</span>
                                        <span className="comment-block__time">
                                            Inlämnat {formatTime(upload.time)}
                                        </span>
                                        {adminDelete ? (
                                            <Delete
                                                id={upload.id}
                                                table="uploads"
                                                updateList={this.getUploads.bind(
                                                    this
                                                )}
                                            />
                                        ) : (
                                            email === upload.email && (
                                                <Delete
                                                    id={upload.id}
                                                    table="uploads"
                                                    user
                                                    updateList={this.getUploads.bind(
                                                        this
                                                    )}
                                                />
                                            )
                                        )}
                                    </div>
                                    <Download
                                        path={upload.path}
                                        fileName={upload.filename}
                                        colorCode={this.props.colorCode}
                                    />
                                </div>
                                <Comments
                                    courseID={this.props.courseID}
                                    step={upload.filename}
                                    documentOwner={upload.email}
                                    colorCode={this.props.colorCode}
                                    dontShowAnswers
                                    commentPlaceholder="Ge din feedback här"
                                />
                            </div>
                        ))}
                </div>
            </div>
        );
    }
}

export default Attachment;
