import React, { createRef } from 'react';
import { withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { motion } from 'framer-motion'
import GridLayout from 'react-grid-layout';
import '../../../../../node_modules/react-grid-layout/css/styles.css'
import '../../../../../node_modules/react-resizable/css/styles.css'
import LessonInfoModal from './LessonInfoModal';
import {colors} from "@material-ui/core";
import getColor from "../../../../assets/colors";

class Schedule extends React.Component {

    state = { layout: [
        {i: "a", name: 'saturday', x: 33, y: 1, w: 2, h: 1, static: true},
        {i: "b", name: 'sunday', x: 33, y: 2, w: 2, h: 1, static: true},
        {i: "c", name: 'monsday', x: 33, y: 3, w: 2, h: 1, static: true},
        {i: "d", name: 'tuesday', x: 33, y: 4, w: 2, h: 1, static: true},
        {i: "e", name: 'wednesday', x: 33, y: 5, w: 2, h: 1, static: true},
        {i: "f", name: 'thursday', x: 33, y: 6, w: 2, h: 1, static: true},
        {i: "g", name: 'friday', x: 33, y: 7, w: 2, h: 1, static: true},
        {i: "t1", name: "07:00", x: 30, y: 0, w: 2, h: 1, static: true},
        {i: "t2", name: "08:00", x: 28, y: 0, w: 2, h: 1, static: true},
        {i: "t3", name: "09:00", x: 26, y: 0, w: 2, h: 1, static: true},
        {i: "t4", name: "10:00", x: 24, y: 0, w: 2, h: 1, static: true},
        {i: "t5", name: "11:00", x: 22, y: 0, w: 2, h: 1, static: true},
        {i: "t6", name: "12:00", x: 20, y: 0, w: 2, h: 1, static: true},
        {i: "t7", name: "13:00", x: 18, y: 0, w: 2, h: 1, static: true},
        {i: "t8", name: "14:00", x: 16, y: 0, w: 2, h: 1, static: true},
        {i: "t9", name: "15:00", x: 14, y: 0, w: 2, h: 1, static: true},
        {i: "t10", name: "16:00", x: 12, y: 0, w: 2, h: 1, static: true},
        {i: "t11", name: "17:00", x: 10, y: 0, w: 2, h: 1, static: true},
        {i: "t12", name: "18:00", x: 8, y: 0, w: 2, h: 1, static: true},
        {i: "t13", name: "19:00", x: 6, y: 0, w: 2, h: 1, static: true},
        {i: "t14", name: "20:00", x: 4, y: 0, w: 2, h: 1, static: true},
        {i: "t15", name: "21:00", x: 2, y: 0, w: 2, h: 1, static: true},
        {i: "t16", name: "22:00", x: 0, y: 0, w: 2, h: 1, static: true}
    ],
    lessonInfo: null , showLessonInfo : false , lessons : []
    }

    sc = createRef()

    handleLessonLayout() {
        const lessons = [];

        // console.log(this.props);

        this.props.lessons.map(day => {
            if(day && day.length > 0)
            {
                (day.map(lesson => {
                    var lessonY = lesson.dayType;

                    if(lessons.find(ls => ls.lessonDetail.dayType == lesson.dayType && //Check same day
                        ((ls.lessonDetail.startHour >= lesson.startHour && ls.lessonDetail.startHour < lesson.endHour) || // Check oldClass Start time between new class Time
                            (ls.lessonDetail.startHour <= lesson.startHour && ls.lessonDetail.endHour > lesson.startHour))))
                    {
                        lessonY += 0.5;
                    }   

                    lessons.push({i: lesson.id + '', name: lesson.orgLessonName, 
                    c: `tw-bg-${getColor(lesson.lessonId)} tw-border-none tw-cursor-pointer`, x: 32 - ((lesson.endHour - 7) * 2), y: lessonY, w: (lesson.endHour - lesson.startHour) * 2,
                    h: (lesson.weekly != 0 ? 0.5 : 1) , lessonDetail : lesson , static: true})
                }))
            }
        })

        this.setState({lessons : lessons})
        
    }

    componentDidMount() {
        this.handleLessonLayout()
        
    }   

    componentWillReceiveProps(){
        this.handleLessonLayout()
    }


    showLessonInfo = (id) => {
        if (!this.state.lessons.find(el => el.i === id)) return;
        this.setState({ lessonInfo: this.state.lessons.find(el => el.i === id) , showLessonInfo : true})
    }

    onCancel = () => {
        this.setState({ lessonInfo: null , showLessonInfo : false})
        
    }

    deleteLesson () {
        this.props.deleteSchedule(parseInt(this.state.lessonInfo.i))
        this.setState({showLessonInfo : false})
    }

    cancelIt = () => {
        this.onCancel();
        this.props.rerenderIt()
    }

    render() {
        const layout = this.state.layout.concat(this.state.lessons);
        return (
            <>
                {this.state.showLessonInfo ? 
                <LessonInfoModal
                    isManager={this.props.isManager}
                    isTeacher={this.props.isTeacher}
                    lessonInfo={this.state.lessonInfo}
                    cancel={() => this.onCancel()}
                    canEdit={this.props.editable}
                    onDelete={() => this.deleteLesson()}
                    rerenderIt={() => this.cancelIt()}
                /> 
                : 
                null
                }
                <GridLayout className="layout" layout={layout} cols={34} rowHeight={50} width={1800}>
                    {layout.map(x => {
                        return (
                            <div ref={this.sc} onClick={() => this.showLessonInfo(x.i)} className={`pointer border tw-border-white tw-text-center tw-text-white ${x.c}`} key={x.i}>
                                {
                                    x.x === 33 ?
                                    <p className="tw-text-center" style={{textOverflow : "ellipsis" , overflow : "hidden" , whiteSpace : "nowrap"}}>{this.props.t(`${x.name}`)}</p>
                                    :
                                    <p className="tw-text-center" style={{textOverflow : "ellipsis" , overflow : "hidden" , whiteSpace : "nowrap"}}>{x.name}</p>

                                }
                            </div>
                        );
                    })}
                </GridLayout>
            </>
        );
    }

}

export default withTranslation()(Schedule);