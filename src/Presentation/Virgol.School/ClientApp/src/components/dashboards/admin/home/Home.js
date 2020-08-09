import React from "react";
import Hero from "./Hero";
import CounterCard from "./CounterCard";
import {home, key, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import { connect } from "react-redux";
import {getDashboardInfo , getNews} from "../../../../_actions/adminActions"

class Home extends React.Component {

    state = {loading : false}

    componentDidMount = async () =>{
        if (this.props.history.action === 'POP' || this.props.dashboardInfo.length == 0 || this.props.news.length == 0 ) {

            this.setState({loading: true})
            await this.props.getDashboardInfo(this.props.user.token);
            await this.props.getNews(this.props.user.token);
            this.setState({loading: false})

        }
    }
    
    render() {
        console.log("test")

        if(this.state.loading) return "درحال بارگداری اطلاعات ..."
        
        return (
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 py-6">
                {(this.props.user 
                ?
                <Hero userInfo={this.props.user.userInformation}
                        title={`مدیر مدارس ${this.props.user.userDetail.schooltypeName} استان خراسان رضوی`} />
                :
                <Hero userInfo="درحال بارگذاری ..."
                    title="درحال بارگذاری ..." />
                )}
                <CounterCard
                    title="مدارس"
                    icon={home}
                    number={this.props.dashboardInfo.schoolCount}
                    border="border-sky-blue"
                />

                <CounterCard
                    title="معلمان"
                    icon={user}
                    number={this.props.dashboardInfo.teacherCount}
                    border="border-purplish"
                />

                <CounterCard
                    title="کلید"
                    icon={key}
                    number={this.props.dashboardInfo.keyCount}
                    border="border-greenish"
                    pos="row-start-3"
                />

                <CounterCard
                    title="دانش آموزان"
                    icon={users}
                    number={this.props.dashboardInfo.studentsCount}
                    border="border-redish"
                    pos="row-start-3"
                />

                <Feed
                    news={this.props.news}
                    title="آخرین خبرهای منتشر شده از سمت شما"
                    pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , dashboardInfo: state.adminData.dashboardInfo , news : state.adminData.news}
}

export default connect(mapStateToProps, { getDashboardInfo , getNews })(Home);