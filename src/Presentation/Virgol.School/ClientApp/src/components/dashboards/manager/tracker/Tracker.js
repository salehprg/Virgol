import React, {createRef} from "react";
import GridLayout from "react-grid-layout";

class Tracker extends React.Component {

    state = {layout: [
            {i: "t1", name: "07:00", x: 26, y: 0, w: 2, h: 1, static: true},
            {i: "t2", name: "08:00", x: 24, y: 0, w: 2, h: 1, static: true},
            {i: "t3", name: "09:00", x: 22, y: 0, w: 2, h: 1, static: true},
            {i: "t4", name: "10:00", x: 20, y: 0, w: 2, h: 1, static: true},
            {i: "t5", name: "11:00", x: 18, y: 0, w: 2, h: 1, static: true},
            {i: "t6", name: "12:00", x: 16, y: 0, w: 2, h: 1, static: true},
            {i: "t7", name: "13:00", x: 14, y: 0, w: 2, h: 1, static: true},
            {i: "t8", name: "14:00", x: 12, y: 0, w: 2, h: 1, static: true},
            {i: "t9", name: "15:00", x: 10, y: 0, w: 2, h: 1, static: true},
            {i: "t10", name: "16:00", x: 8, y: 0, w: 2, h: 1, static: true},
            {i: "t11", name: "17:00", x: 6, y: 0, w: 2, h: 1, static: true},
            {i: "t12", name: "18:00", x: 4, y: 0, w: 2, h: 1, static: true},
            {i: "t13", name: "19:00", x: 2, y: 0, w: 2, h: 1, static: true},
            {i: "t14", name: "20:00", x: 0, y: 0, w: 2, h: 1, static: true},
            {i: "c1", name: "کلاس 701", x: 28, y: 1, w: 2, h: 1, static: true},
            {i: "c2", name: "کلاس 702", x: 28, y: 2, w: 2, h: 1, static: true},
            {i: "l1", name: "ریاضی", x: 26, y:1 , w: 2, h: 1, static: true}
    ]}
    sc = createRef()

    componentDidMount() {
        this.sc.current.scrollLeft = this.sc.current.clientWidth
    }

    render() {
        const layout = this.state.layout.concat([]);
        return (
            <div className="w-full mt-10">
                <div ref={this.sc} className="w-11/12 p-4 mx-auto rounded-lg min-h-70 border-2 border-dark-blue overflow-auto">
                    <GridLayout className="layout" layout={layout} cols={30} rowHeight={50} width={1800}>
                        {layout.map(x => {
                            return (
                                <div className={`pointer border border-white text-center text-white ${x.c}`} key={x.i}>
                                    <p className="centerize">{x.name}</p>
                                </div>
                            );
                        })}
                    </GridLayout>
                </div>
            </div>
        );
    }

}

export default Tracker;