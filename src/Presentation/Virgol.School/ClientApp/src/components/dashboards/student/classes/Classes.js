import React from 'react';
import Schedule from '../../manager/class/Schedule'

class Classes extends React.Component {

    render() {
        return (
            <div>
                <Schedule
                    editable={false}
                    // lessons={this.props.schedules}
                    lessons={[
                        {i: "1", name: "حسابان 1", teachername: "احمدی", c: "bg-redish cursor-pointer", x: 8, y: 1, w: 2, h: 1, static: true},
                        {i: "2", name: "هندسه 1", teachername: "باقری", c: "bg-purplish cursor-pointer", x: 6, y: 2, w: 3, h: 1, static: true},
                    ]}                  
                />
            </div>
        );
    }

}

export default Classes;