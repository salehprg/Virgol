import React from "react";
import SidebarCard from "./SidebarCard";
import {base, book, home, students, teachers} from "../../assets/icons";

class Sidebar extends React.Component {

    onCardClick = (card) => {
        this.props.onOptionChange(card);
    }

    render() {
        return (
            <div className="md:mt-0 mt-12 md:bg-transparent bg-dark-blue w-full h-full flex md:flex-col flex-row overflow-x-auto md:justify-start md:items-center items-auto">
                <SidebarCard
                    id="home"
                    title="خانه"
                    icon={home}
                    onClick={this.onCardClick}
                    isActive={this.props.active === 'home'}
                />

                <SidebarCard
                    id="base"
                    title="مقاطع تحصیلی"
                    icon={base}
                    onClick={this.onCardClick}
                    isActive={this.props.active === 'base'}
                />

                <SidebarCard
                    id="course"
                    title="دروس"
                    icon={book}
                    onClick={this.onCardClick}
                    isActive={this.props.active === 'course'}
                />

                <SidebarCard
                    id="teacher"
                    title="معلمان"
                    icon={teachers}
                    onClick={this.onCardClick}
                    isActive={this.props.active === 'teacher'}
                />

                <SidebarCard
                    id="student"
                    title="دانش آموزان"
                    icon={students}
                    onClick={this.onCardClick}
                    isActive={this.props.active === 'student'}
                />
            </div>
        );
    }

}

export default Sidebar;