import React from "react";
import SidebarCard from "./SidebarCard";
import {base, book, home, logoutIcon, students, teachers} from "../../assets/icons";

class Sidebar extends React.Component {

    onCardClick = (card) => {
        this.props.onOptionChange(card);
    }

    render() {
        return (
            <div className="md:mt-0 mt-12 md:mb-0 mb-6 md:bg-transparent bg-dark-blue md:w-full md:h-full w-screen h-90 flex flex-col overflow-x-auto justify-start items-center items-auto">
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