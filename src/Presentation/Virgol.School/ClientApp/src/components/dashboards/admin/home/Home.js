import React from "react";
import Hero from "./Hero";
import CounterCard from "./CounterCard";
import {home, key, loading, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import { connect } from "react-redux";
import {getDashboardInfo} from "../../../../_actions/adminActions"
import {GetMyNews} from "../../../../_actions/newsActions"

class Home extends React.Component {

    state = {loading : false}

    componentDidMount = async () =>{
        if (this.props.history.action === 'POP' || this.props.dashboardInfo.length == 0 || this.props.myNews.length == 0 ) {

            this.setState({loading: true})
            await this.props.getDashboardInfo(this.props.user.token);
            await this.props.GetMyNews(this.props.user.token);
            this.setState({loading: false})

        }
    }
    
    render() {
        if(this.state.loading) return loading('w-10 text-grayish centerize')
        
        return (
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 py-6">
                {(this.props.myNews.length === 0 ?
                        <Feed
                            news={[]}
                            title="آخرین خبرهای منتشر شده از سمت شما"
                            pos="sm:row-start-1 row-start-2"
                        />
                        :
                        <Feed
                            news={this.props.myNews}
                            title="آخرین خبرهای منتشر شده از سمت شما"
                            pos="sm:row-start-1 row-start-2"
                        />
                )}
                <div className="">
                    {(this.props.user
                            ?
                            <Hero userInfo={this.props.user.userInformation}
                                  adminTitle={`مسئول مدارس ${this.props.user.userDetail.schooltypeName} استان خراسان رضوی`} />
                            :
                            <Hero userInfo="درحال بارگذاری ..."
                                  title="درحال بارگذاری ..." />
                    )}
                    <div className="mt-8">
                        <CounterCard
                            title="مدارس"
                            icon={home}
                            number={this.props.dashboardInfo.schoolCount}
                            bg="bg-sky-blue"
                        />

                        <CounterCard
                            title="حداکثر مدارس"
                            icon={key}
                            number={this.props.dashboardInfo.keyCount}
                            bg="bg-greenish"
                            pos="row-start-3"
                        />

                        <CounterCard
                            title="معلمان"
                            icon={user}
                            number={this.props.dashboardInfo.teacherCount}
                            bg="bg-purplish"
                        />

                        <CounterCard
                            title="دانش آموزان"
                            icon={users}
                            number={this.props.dashboardInfo.studentsCount}
                            bg="bg-redish"
                            pos="row-start-3"
                        />
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , dashboardInfo: state.adminData.dashboardInfo , myNews : state.newsData.myNews}
}

export default connect(mapStateToProps, { getDashboardInfo , GetMyNews })(Home);