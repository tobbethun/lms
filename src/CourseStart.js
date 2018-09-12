import React from'react';
import Markup from './Markup';
import { Link } from 'react-router-dom';


export class CourseStart extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const {text, firstStep, colorCode} = this.props;
        return (
            <div className="lesson-container">
                <span className="breadcrumb">Startsida för kursen</span>
                <Markup text={text} />
                <Link to={firstStep} className="button course-start--button" style={{backgroundColor: colorCode}}>Starta kursen</Link>
            </div>
        )
    };
}

