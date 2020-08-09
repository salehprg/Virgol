import React from 'react';
import GridLayout from 'react-grid-layout';
import '../../../../../node_modules/react-grid-layout/css/styles.css'
import '../../../../../node_modules/react-resizable/css/styles.css'

class Schedule extends React.Component {

    state = { layout: [
        {i: "a", name: "شنبه", x: 0, y: 1, w: 2, h: 1, static: true},
        {i: "b", name: "یکشنبه", x: 0, y: 2, w: 2, h: 1, static: true},
        {i: "c", name: "دوشنبه", x: 0, y: 3, w: 2, h: 1, static: true},
        {i: "d", name: "سه شنبه", x: 0, y: 4, w: 2, h: 1, static: true},
        {i: "e", name: "چهار شنبه", x: 0, y: 5, w: 2, h: 1, static: true},
        {i: "f", name: "پنج شنبه", x: 0, y: 6, w: 2, h: 1, static: true},
        {i: "g", name: "جمعه", x: 0, y: 7, w: 2, h: 1, static: true},
        {i: "t1", name: "08:00", x: 2, y: 0, w: 2, h: 1, static: true},
        {i: "t2", name: "09:00", x: 4, y: 0, w: 2, h: 1, static: true},
        {i: "t3", name: "10:00", x: 6, y: 0, w: 2, h: 1, static: true},
        {i: "t4", name: "11:00", x: 8, y: 0, w: 2, h: 1, static: true},
        {i: "t5", name: "12:00", x: 10, y: 0, w: 2, h: 1, static: true},
        {i: "t6", name: "13:00", x: 12, y: 0, w: 2, h: 1, static: true},
        {i: "t7", name: "14:00", x: 14, y: 0, w: 2, h: 1, static: true},
        {i: "t8", name: "15:00", x: 16, y: 0, w: 2, h: 1, static: true},
        {i: "t9", name: "16:00", x: 18, y: 0, w: 2, h: 1, static: true},
        {i: "t10", name: "17:00", x: 20, y: 0, w: 2, h: 1, static: true},
        {i: "t11", name: "18:00", x: 22, y: 0, w: 2, h: 1, static: true},
        {i: "t12", name: "19:00", x: 24, y: 0, w: 2, h: 1, static: true},
        {i: "t13", name: "20:00", x: 26, y: 0, w: 2, h: 1, static: true},
        {i: "t14", name: "21:00", x: 28, y: 0, w: 2, h: 1, static: true},
        {i: "t15", name: "22:00", x: 30, y: 0, w: 2, h: 1, static: true},
    ]}

    lessons = [
        {i: "1", name: "حسابان 1", c: "bg-redish text-white", x: 2, y: 1, w: 3, h: 1, static: true},
        {i: "2", name: "هندسه 1", c: "bg-purplish text-white", x: 6, y: 2, w: 3, h: 1, static: true},
    ]

    componentDidMount() {
        this.setState({ layout: this.state.layout.concat(this.lessons) })
    }

    render() {
        return (
            <div className="w-11/12 centerize h-64 overflow-auto border-2 border-dark-blue">
                <GridLayout className="layout" layout={this.state.layout} cols={32} rowHeight={50} width={1800}>
                    {this.state.layout.map(x => {
                        return <div className={`border border-grayish ${x.c}`} key={x.i}><p className="centerize">{x.name}</p></div>
                    })}
                </GridLayout>
            </div>
        );
    }

}

export default Schedule;