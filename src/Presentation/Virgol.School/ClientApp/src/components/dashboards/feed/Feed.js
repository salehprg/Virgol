import React from "react";
import { withTranslation } from 'react-i18next';
import News from "./News";
import { connect } from "react-redux";
import protectedAdmin from "../../protectedRoutes/protectedAdmin";
import {getNews} from "../../../_actions/adminActions"
import ReactPaginate from 'react-paginate';

class Feed extends React.Component {

    handlePageClick = () =>{

    }

    render() {
        const { title, pos } = this.props

        return (
            <div className={`${pos} w-full h-85 overflow-auto px-6 py-4 text-right bg-dark-blue rounded-xl`}>
                <p className="text-white">{title}</p>
                {
                    (
                        this.props.news.length == 0 
                        ? 
                    <span className="text-2xl text-grayish block text-center">{this.props.t('noNews')}</span> 
                        :
                        this.props.news.map(x => {
                            return (
                                <News
                                    text={x.message}
                                    tags={x.tagsStr}
                                    time={new Date(x.createTime).toLocaleDateString('fa-IR')}
                                />
                            );
                        })
                    )
                }
            </div>
        );
    }

}

export default withTranslation()(Feed);