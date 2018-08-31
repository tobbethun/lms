import React from'react';
import AnswerComment from "./AnswerComment";


export class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const object = JSON.parse(localStorage.getItem("loggedIn"));
        this.state = {
            firstname: object.user.firstname,
            lastname: object.user.lastname,
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
                    this.setState({commentlist: json.comments})
                }
            })
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
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
                if (json.code === 204) {
                    this.setState({registerMessage: json.success, commentstatus: 'success'});
                }
            });
        this.getComments();
    }
    render() {
        const { firstname, lastname, comment, commentstatus, commentlist } = this.state;
        return (
            <div className='comments'>
                <h2>Kommentarer</h2>
                {commentlist &&
                    commentlist.map((comment, index) => (
                    <div key={index} className="comment-block">
                        <p className="comment-block__author">{comment.name}</p>
                        <p className="comment-block__text">{comment.comment}</p>
                        <AnswerComment commentid={comment.id} firstname={firstname} lastname={lastname} />
                    </div>
                ))}
                <form className='comment-form' onSubmit={this.handleSubmit}>
                    <span>{firstname} {lastname}</span>
                    <textarea type="text" placeholder="Skriv din kommentar här" className={`comment-field ${commentstatus}`} value={comment}
                           onChange={this.handleChange('comment')} required/>
                    <input className='button' type="submit" value="Kommentera"/>
                </form>
            </div>
        )
    }
}


export default Comments;
