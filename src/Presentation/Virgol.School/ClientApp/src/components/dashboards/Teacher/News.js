import React from "react";
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
        if(this.state.loading) loading('w-10 text-grayish centerize')
        return (
            <div style={{direction : "rtl"}} className="grid sm:grid-cols-4 grid-cols-4 gap-4 py-6">
                <Feed
                    news={this.props.inNews}
                    title="آخرین اخبار برای شما"
                    pos="row-start-4 sm:row-start-auto col-span-3 row-span-3"
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , inNews : state.newsData.incomeNews }
}

export default connect(mapStateToProps, { GetIncommingNews })(News);