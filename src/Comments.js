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
            lesson: this.props.lesson,
            commentstatus: '',
            answer: false,
            attachment: false
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

        fetch("http://localhost:5000/getcomments/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lesson: this.state.lesson,
            })
        }).then(handleErrors)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                // this.setState({loginMessage: json.success});
                if (json.code === 200) {
                    console.log('comments', json);
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
            lesson: this.state.lesson,
        };
        fetch("http://localhost:5000/comment/", {
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
                lesson: data.lesson
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
        const { firstname, lastname, comment, commentstatus, commentlist, attachment } = this.state;
        return (
            <div className='comment'>
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
                    <span onClick={() => {this.setState({attachment: !attachment})}}>Bifoga fil</span>
                    {attachment &&
                    <Attachment />
                    }
                    <input className='button' type="submit" value="Kommentera"/>
                </form>
            </div>
        )
    }
}


export default Comments;
