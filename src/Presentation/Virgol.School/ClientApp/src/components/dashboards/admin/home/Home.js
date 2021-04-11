import React from "react";
import { withTranslation } from 'react-i18next';
import Hero from "./Hero";
import CounterCard from "./CounterCard";
import {home, key, loading, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import { connect } from "react-redux";
import {getDashboardInfo} from "../../../../_actions/adminActions"
import {GetMyNews} from "../../../../_actions/newsActions"

class Home extends React.Component {

    state = {loading : false , userType : ''}

    componentDidMount = async () =>{
        if (this.props.history.action === 'POP' || this.props.dashboardInfo.length == 0 || this.props.myNews.length == 0 ) {

            this.setState({loading: true})
            await this.props.getDashboardInfo(this.props.user.token);
            // this.setState({userType : this.props.match.url.substring(1,2)})
            await this.props.GetMyNews(this.props.user.token);            
            this.setState({loading: false})

        }
    }
    
    render() {
        if(this.state.loading) return loading('tw-w-10 tw-text-grayish centerize')
        
        return (
            <div className="tw-grid sm:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4 tw-py-6">
                {(this.props.myNews.length === 0 ?
                        <Feed
                            news={[]}
                            title={this.props.t('adminNewsHeader')}
                            pos="sm:tw-row-start-1 tw-row-start-2"
                        />
                        :
                        <Feed
                            news={this.props.myNews}
                            title={this.props.t('adminNewsHeader')}
                            pos="sm:tw-row-start-1 tw-row-start-2"
                        />
                )}
                <div className="">
                    {(this.props.user
                            ?
                            <Hero userInfo={this.props.user.userInformation}
                                  adminTitle={`مسئول مدارس ${this.props.user.userDetail.schooltypeName} استان خراسان رضوی`} 
                                  ShowServiceType = {false}/>
                            :
                            <Hero userInfo={this.props.t('loading')}
                                  title={this.props.t('loading')} />
                    )}

<div className="tw-mt-8">
                                <CounterCard
                                    title={this.props.t('schools')}
                                    icon={home}
                                    number={this.props.dashboardInfo.schoolCount}
                                    bg="tw-bg-sky-blue"
                                    link="schools"
                                    userType={this.state.userType}
                                />

                                <CounterCard
                                    title={this.props.t('maxSchools')}
                                    icon={key}
                                    number={this.props.dashboardInfo.keyCount}
                                    bg="tw-bg-greenish"
                                    pos="tw-row-start-3"
                                />

                                <CounterCard
                                    title={this.props.t('teachers')}
                                    icon={user}
                                    number={this.props.dashboardInfo.teacherCount}
                                    bg="tw-bg-purplish"
                                    link="teachers"
                                    userType={this.state.userType}
                                />

                                <CounterCard
                                    title={this.props.t('students')}
                                    icon={users}
                                    number={this.props.dashboardInfo.studentsCount}
                                    bg="tw-bg-redish"
                                    pos="tw-row-start-3"
                                    link="students"
                                    userType={this.state.userType}
                                />
                            </div>

                        {/* {
                            this.state.userType ?

                            <div className="tw-mt-8">
                                <CounterCard
                                    title={this.props.t('schools')}
                                    icon={home}
                                    number={this.props.dashboardInfo.schoolCount}
                                    bg="tw-bg-sky-blue"
                                    link="schools"
                                    userType={this.state.userType}
                                />

                                <CounterCard
                                    title={this.props.t('maxSchools')}
                                    icon={key}
                                    number={this.props.dashboardInfo.keyCount}
                                    bg="tw-bg-greenish"
                                    pos="tw-row-start-3"
                                />

                                <CounterCard
                                    title={this.props.t('teachers')}
                                    icon={user}
                                    number={this.props.dashboardInfo.teacherCount}
                                    bg="tw-bg-purplish"
                                    link="teachers"
                                    userType={this.state.userType}
                                />

                                <CounterCard
                                    title={this.props.t('students')}
                                    icon={users}
                                    number={this.props.dashboardInfo.studentsCount}
                                    bg="tw-bg-redish"
                                    pos="tw-row-start-3"
                                    link="students"
                                    userType={this.state.userType}
                                />
                            </div>

                            :
                            loading('tw-w-12 tw-ml-40 tw-text-grayish')
                        } */}
                    
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , dashboardInfo: state.adminData.dashboardInfo , myNews : state.newsData.myNews}
}

const cwrapped = connect(mapStateToProps, { getDashboardInfo , GetMyNews })(Home);

export default withTranslation()(cwrapped);