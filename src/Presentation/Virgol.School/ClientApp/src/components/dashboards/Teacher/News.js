import React from "react";
import { withTranslation } from 'react-i18next';
import Hero from "../admin/home/Hero";
import CounterCard from "../admin/home/CounterCard";
import {home, key, loading, user, users} from "../../../assets/icons";
import Feed from "../feed/Feed";
import { connect } from "react-redux";
import {getManagerDashboardInfo} from "../../../_actions/managerActions"
import {GetIncommingNews , GetMyNews} from "../../../_actions/newsActions"

class News extends React.Component {

    state = {loading : false}

    componentDidMount = async () =>{
        this.setState({loading: true})
        await this.props.GetIncommingNews(this.props.user.token);
        this.setState({loading: false})
    }
    
    render() {
        if(this.state.loading) loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div style={{direction : "rtl"}} className="tw-grid sm:tw-grid-cols-4 tw-grid-cols-4 tw-gap-4 tw-py-6">
                <Feed
                    news={this.props.inNews}
                    title={this.props.t('studentsNews')}
                    pos="tw-row-start-4 sm:tw-row-start-auto tw-col-span-3 tw-row-span-3"
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , inNews : state.newsData.incomeNews }
}
const cwrapped = connect(mapStateToProps, { GetIncommingNews })(News);

export default withTranslation()(cwrapped);