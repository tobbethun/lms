import React from'react';
import Markup from './Markup';


export class CourseStart extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const {title, text} = this.props;
        return (
            <div>
                {title}
                <Markup text={text} />
            </div>
        )
    };
}

