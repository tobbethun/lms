import React from "react";
import { formatTime } from "./utils.js";
import Delete from "./Delete";
import { handleErrors } from "./utils";

export class AnswerComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            email: this.props.email,
            role: this.props.role,
            answerstatus: "",
            answerList: [],
            answer: "",
            commentid: this.props.commentid,
            showAnswerForm: false
        };
    }

    componentDidMount() {
        this.getAnswers();
    }

    handleChange = key => {
        return e => {
            const state = {};
            state[key] = e.target.value;
            this.setState(state);
        };
    };

    getAnswers = () => {
        fetch("/api/getanswers/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                commentid: this.state.commentid
            })
        })
            .then(handleErrors)
            .then(response => {
                return response.json();
            })
            .then(json => {
                // this.setState({loginMessage: json.success});
                if (json.code === 200) {
                    this.setState({ answerList: json.answers });
                }
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
            answer: this.state.answer,
            commentid: this.state.commentid
        };
        fetch("/api/answers/", {
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
                answer: data.answer,
                commentid: data.commentid
            })
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    this.setState({
                        registerMessage: json.success,
                        answerstatus: "success",
                        answer: "",
                        showAnswerForm: false
                    });
                }
                if (json.code === 204) {
                    this.setState({
                        registerMessage: json.success,
                        answerstatus: "success"
                    });
                }
            });
        this.getAnswers();
    };
    render() {
        const {
            answer,
            answerList,
            showAnswerForm,
            answerstatus,
            email
        } = this.state;
        const { commentName, colorCode, adminDelete } = this.props;
        const hasAnswers = answerList.length > 0;
        return (
            <div className="answer">
                {answerList &&
                    answerList.map(answer => (
                        <div key={answer.id} className="answer-block">
                            <span
                                className="comment-block__author"
                                style={{ color: colorCode }}
                            >
                                {answer.name}
                            </span>
                            <span className="comment-block__time">
                                {formatTime(answer.time)}
                            </span>
                            {answer.role === "admin" && (
                                <span
                                    className="comment-block__is-admin"
                                    style={{ color: this.props.colorCode }}
                                >
                                    Kursledare
                                </span>
                            )}
                            {adminDelete ? (
                                <Delete
                                    id={answer.id}
                                    table="answers"
                                    updateList={this.getAnswers.bind(this)}
                                />
                            ) : (
                                email === answer.email && (
                                    <Delete
                                        id={answer.id}
                                        table="answers"
                                        user
                                        updateList={this.getAnswers.bind(this)}
                                    />
                                )
                            )}
                            <p className="comment-block__text">
                                {answer.answer}
                            </p>
                        </div>
                    ))}
                <span
                    onClick={() => {
                        this.setState({
                            showAnswerForm: !showAnswerForm,
                            answerstatus: ""
                        });
                    }}
                    className={`show-answer-form ${
                        hasAnswers ? "show-answer-form__hasAnswers" : ""
                    }`}
                >
                    Svara {commentName.split(" ", 1)}
                </span>
                {showAnswerForm && (
                    <form
                        className="comment-form answer-form"
                        onSubmit={this.handleSubmit}
                    >
                        <div className="comment-text">
                            <textarea
                                type="text"
                                placeholder="Delta i diskussionen..."
                                className={`comment-field ${answerstatus}`}
                                value={answer}
                                onChange={this.handleChange("answer")}
                                required
                                autoComplete=""
                            />
                            <div className="comment-footer">
                                <button
                                    ref={btn => {
                                        this.btn = btn;
                                    }}
                                    className="comment-button"
                                    type="submit"
                                    style={{
                                        backgroundColor: colorCode,
                                        borderColor: colorCode
                                    }}
                                >
                                    Skicka svar
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        );
    }
}

export default AnswerComment;
