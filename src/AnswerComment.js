import React from'react';


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

        fetch("http://localhost:5000/getanswers/", {
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
        fetch("http://localhost:5000/answers/", {
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
        const { firstname, lastname, answer, answerList, showAnswerForm, answerstatus } = this.state;
        return (
            <div className='answer'>
                {answerList &&
                answerList.map((answer, index) => (
                    <div key={index} className="comment-block">
                        <p className="comment-block__author">{answer.name}</p>
                        <p className="comment-block__text">{answer.answer}</p>
                    </div>
                ))}
                <button onClick={() => {this.setState({showAnswerForm: !showAnswerForm, answerstatus: ''})}}>Svara</button>
                {showAnswerForm &&
                <form className='answer-form' onSubmit={this.handleSubmit}>
                    <span>{firstname} {lastname}</span>
                    <textarea type="text" placeholder="Skriv ditt svar här"
                              className={`answer-field ${answerstatus}`} value={answer}
                              onChange={this.handleChange('answer')} required/>
                    <input className='button' type="submit" value="Skicka"/>
                </form>
                }
            </div>
        )
    }
}


export default AnswerComment;
