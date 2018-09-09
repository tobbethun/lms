import React from'react';
import {formatTime} from './utils.js'


export class AnswerComment extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            answerstatus: '',
            answerList: [],
            answer: '',
            commentid: this.props.commentid,
            showAnswerForm: false
        };

    }

    componentDidMount() {
        this.getAnswers();
    }

    handleChange(key) {
        return (e => {
            const state = {};
            state[key] = e.target.value;
            this.setState(state);
        });
    }

    getAnswers() {
        function handleErrors(response){
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }

        fetch("/api/getanswers/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commentid: this.state.commentid,
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                // this.setState({loginMessage: json.success});
                if (json.code === 200) {
                    this.setState({answerList: json.answers})
                }
            })
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            answer: this.state.answer,
            commentid: this.state.commentid,
        };
        fetch("/api/answers/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                firstname: data.firstname,
                lastname: data.lastname,
                answer: data.answer,
                commentid: data.commentid
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.code === 200) {
                    this.setState({registerMessage: json.success, answerstatus: 'success', answer: '', showAnswerForm: false});
                }
                if (json.code === 204) {
                    this.setState({registerMessage: json.success, answerstatus: 'success'});
                }
            });
        this.getAnswers();
    }
    render() {
        const { answer, answerList, showAnswerForm, answerstatus } = this.state;
        const { commentName, colorCode } = this.props;
        return (
            <div className='answer'>
                <span onClick={() => {this.setState({showAnswerForm: !showAnswerForm, answerstatus: ''})}} className="show-answer-form">Svara {commentName.split(' ', 1)}</span>
                {showAnswerForm &&
                <form className='comment-form answer-form' onSubmit={this.handleSubmit}>
                    <div className="comment-text">
                    <textarea type="text"
                    placeholder="Delta i diskussionen..."
                    className={`comment-field ${answerstatus}`}
                    value={answer}
                    onChange={this.handleChange('answer')}
                    required
                    />
                    <div className="comment-footer">
                    <button className="comment-button" type="submit" style={{backgroundColor: colorCode, borderColor: colorCode}}>Skicka svar</button>
                    </div>
                    </div>
                </form>
                }
                {answerList &&
                answerList.map((answer, index) => (
                    <div key={index} className="answer-block">
                        <span className="comment-block__author" style={{color: colorCode}}>{answer.name}</span>
                        <span className="comment-block__time">{formatTime(answer.time)}</span>
                        <p className="comment-block__text">{answer.answer}</p>
                    </div>
                ))}
            </div>
        )
    }
}


export default AnswerComment;
