import React from'react';
import AnswerComment from "./AnswerComment";
import {formatTime} from "./utils";


export class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const object = JSON.parse(localStorage.getItem("loggedIn"));
        this.state = {
            firstname: object.user.firstname,
            lastname: object.user.lastname,
            role: object.user.role,
            commentlist: [],
            step: this.props.step,
            commentstatus: '',
            answer: false
        };

    }

    componentDidMount() {
        this.getComments();
    }

    handleChange(key) {
        return (e => {
            const state = {};
            state[key] = e.target.value;
            this.setState(state);
        });
    }

    getComments() {
        function handleErrors(response){
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }

        fetch("/api/getcomments/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                step: this.state.step,
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
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            role: this.state.role,
            comment: this.state.comment,
            step: this.state.step,
        };
        fetch("/api/comment/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role,
                comment: data.comment,
                step: data.step
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.setState({registerMessage: json.success, commentstatus: 'success', comment: ''});
                }
            })
            .then(this.getComments())
    }
    render() {
        const { firstname, lastname, comment, commentstatus, commentlist, role } = this.state;
        const { commentPlaceholder="Skriv din kommentar här" } = this.props;
        return (
            <div className='comments'>
                <form className='comment-form' onSubmit={this.handleSubmit}>
                    <div className="comment-text">
                        <textarea type="text"
                                  placeholder={commentPlaceholder}
                                  className={`comment-field ${commentstatus}`}
                                  value={comment}
                                  onChange={this.handleChange('comment')}
                                  required
                                  autoComplete=""
                        />
                        <div className="comment-footer">
                            <button className="comment-button" type="submit" style={{backgroundColor: this.props.colorCode, borderColor: this.props.colorCode}}>Skicka kommentar</button>
                        </div>
                    </div>
                </form>
                {commentlist &&
                commentlist.map((comment) => (
                    <div key={comment.id} className="comment-block">
                        <span className="comment-block__author" style={{color: this.props.colorCode}}>{comment.name}</span>
                        <span className="comment-block__time">{formatTime(comment.time)}</span>
                        {comment.role === "admin" && <span className="comment-block__is-admin" style={{backgroundColor: this.props.colorCode}}>Kursledare</span>}
                        <p className="comment-block__text">{comment.comment}</p>
                        {!this.props.dontShowAnswers &&
                            <AnswerComment commentid={comment.id}
                                           commentName={comment.name}
                                           firstname={firstname}
                                           lastname={lastname}
                                           role={role}
                                           colorCode={this.props.colorCode}
                            />
                        }
                    </div>
                ))}
            </div>
        )
    }
}


export default Comments;
