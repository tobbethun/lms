import React from 'react';
import slugify from 'slugify';
import Course from './Course';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';



export class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            courses: []
        };
    }
    componentWillMount() {
        fetch('http://localhost:5000/course/', {
            method: 'GET',
        }).then((response) => {
            // Convert to JSON
            return response.json();
        }).then((response) => {
            // Yay, `j` is a JavaScript object
            this.setState({courses: response});
        });
    }

    render() {
        if(!this.state.courses.length) return null;
        return (
            <div>
                <Router>
                    <div>
                        <div className="course-menu">
                            <ul>
                            {/*<Route path="/public" component={Public}/>*/}
                            { this.state.courses &&
                            this.state.courses.map((course, index) => (
                                    <li key={index}>
                                        <Link to={`/dashboard/${slugify(course.title)}`}>{course.title}</Link>
                                    </li>
                            ))
                            }
                            </ul>
                        </div>
                        { this.state.courses &&
                        this.state.courses.map((course, index) => (
                            <Route key={index} path={`/dashboard/${slugify(course.title)}`} component={()=><Course course={course} lessons={course.lessons}/>}/>
                        ))
                        }
                    </div>
                </Router>

            </div>
        )
    }
}
