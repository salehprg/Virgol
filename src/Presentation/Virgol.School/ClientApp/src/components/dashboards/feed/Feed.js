import React from "react";
import News from "./News";
import { connect } from "react-redux";
import protectedAdmin from "../../protectedRoutes/protectedAdmin";
import {getNews} from "../../../_actions/adminActions"

class Feed extends React.Component {


    render() {
        const { title, pos } = this.props

        return (
            <div className={`${pos} w-full h-full px-6 py-4 text-right bg-dark-blue rounded-xl`}>
                <p className="text-white">{title}</p>
                {
                    (
                        this.props.news.length == 0 
                        ? 
                        <span className="text-2xl text-grayish block text-center">هیچ اخباری وجود ندارد</span> 
                        :
                        this.props.news.map(x => {
                            return (
                                <News
                                    text={x.message}
                                    tags={x.tagsStr}
                                    time={x.createTime}
                                />
                            );
                        })
                    )
                }
            
            </div>
        );
    }

}

export default Feed