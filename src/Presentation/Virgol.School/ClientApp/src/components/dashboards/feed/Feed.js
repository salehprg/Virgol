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
            <div className={`${pos} tw-w-full tw-h-85 tw-overflow-auto tw-px-6 tw-py-4 tw-text-right tw-bg-dark-blue tw-rounded-xl`}>
                <p className="tw-text-white">{title}</p>
                {
                    (
                        this.props.news.length == 0 
                        ? 
                    <span className="tw-text-2xl tw-text-grayish tw-block tw-text-center">{this.props.t('noNews')}</span> 
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