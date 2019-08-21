import React from "react";
import AnswerComment from "./AnswerComment";
import Delete from "./Delete";
import { formatTime, delay, handleErrors } from "./utils";

export class Comments extends React.Component {
    constructor(props) {
        super(props);
        const object = JSON.parse(localStorage.getItem("loggedIn"));
        this.state = {
            firstname: object.user.firstname,
            lastname: object.user.lastname,
            email: object.user.email,
            role: object.user.role,
            commentlist: [],
            step: this.props.step,
            commentstatus: "",
            answer: false
        };
    }

    componentDidMount() {
        this.getComments();
    }

    handleChange = key => {
        return e => {
            const state = {};
            state[key] = e.target.value;
            this.setState(state);
        };
    };

    getComments = () => {
        fetch("/api/getcomments/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                step: this.state.step,
                course: this.props.courseID
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState({ commentlist: json.comments });
                } else {
                    this.setState({
                        registerMessage: json.success,
                        uploadstatus: "error"
                    });
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
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            role: this.state.role,
            comment: this.state.comment,
            course: this.props.courseID,
            step: this.state.step
        };
        fetch("/api/comment/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                role: data.role,
                course: data.course,
                comment: data.comment,
                step: data.step,
                documentOwner: this.props.documentOwner,
                url: document.location.href
            })
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState({
                        registerMessage: json.success,
                        commentstatus: "success",
                        comment: ""
                    });
                    this.btn.removeAttribute("disabled");
                }
                if (json.code === 400)
                    this.setState({
                        errorMessage: "Något gick fel, försök igen"
                    });
                this.btn.removeAttribute("disabled");
            });
        delay(250)
            .then(() => this.getComments())
            .catch(() => {
                this.setState({
                    noNetworkMessage:
                        "Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan."
                });
            });
    };
    render() {
        const {
            firstname,
            lastname,
            email,
            comment,
            commentstatus,
            commentlist,
            role,
            errorMessage,
            noNetworkMessage
        } = this.state;
        const { commentPlaceholder = "Skriv din kommentar här" } = this.props;
        const adminDelete = role === "admin";
        return (
            <div className="comments">
                {noNetworkMessage && (
                    <div className="info-box">{noNetworkMessage}</div>
                )}
                <form className="comment-form" onSubmit={this.handleSubmit}>
                    <div className="comment-text">
                        <textarea
                            type="text"
                            placeholder={commentPlaceholder}
                            className={`comment-field ${commentstatus}`}
                            value={comment}
                            onChange={this.handleChange("comment")}
                            required
                            autoComplete=""
                        />
                        <div className="comment-footer">
                            <span className="comment--error-message">
                                {errorMessage}
                            </span>
                            <button
                                ref={btn => {
                                    this.btn = btn;
                                }}
                                className="comment-button"
                                type="submit"
                                style={{
                                    backgroundColor: this.props.colorCode,
                                    borderColor: this.props.colorCode
                                }}
                            >
                                Skicka kommentar
                            </button>
                        </div>
                    </div>
                </form>
                {commentlist &&
                    commentlist.map(comment => (
                        <div key={comment.id} className="comment-block">
                            <span
                                className="comment-block__author"
                                style={{ color: this.props.colorCode }}
                            >
                                {comment.name}
                            </span>
                            <span className="comment-block__time">
                                {formatTime(comment.time)}
                            </span>
                            {comment.role === "admin" && (
                                <span
                                    className="comment-block__is-admin"
                                    style={{ color: this.props.colorCode }}
                                >
                                    Kursledare
                                </span>
                            )}
                            {adminDelete ? (
                                <Delete
                                    id={comment.id}
                                    table="comments"
                                    updateList={this.getComments.bind(this)}
                                />
                            ) : (
                                email === comment.email && (
                                    <Delete
                                        id={comment.id}
                                        table="comments"
                                        user
                                        updateList={this.getComments.bind(this)}
                                    />
                                )
                            )}
                            <p className="comment-block__text">
                                {comment.comment}
                            </p>
                            {!this.props.dontShowAnswers && (
                                <AnswerComment
                                    commentid={comment.id}
                                    commentName={comment.name}
                                    firstname={firstname}
                                    lastname={lastname}
                                    email={email}
                                    adminDelete={adminDelete}
                                    role={role}
                                    colorCode={this.props.colorCode}
                                />
                            )}
                        </div>
                    ))}
            </div>
        );
    }
}

export default Comments;
