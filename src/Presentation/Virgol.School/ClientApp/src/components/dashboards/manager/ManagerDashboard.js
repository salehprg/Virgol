import React from "react";
import { withTranslation } from 'react-i18next';
import {Switch, Route, Redirect} from 'react-router-dom';
import history from "../../../history";
import protectedManager from "../../protectedRoutes/protectedManager";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout, loading, open_book , users , user , bell, video, layers, grid, plus_square, airplay, message, briefcase, working} from "../../../assets/icons";
import Header from "../header/Header";
import Home from './home/Home'
import Teachers from "./teachers/Teachers";
import Students from "./students/Students";
import Grades from "./grades/Grades";
import News from "./News/News";
import { connect } from "react-redux";
import Tracker from "./tracker/Tracker";
import Groups from "./groups/Groups";
import StreamInfo from "../stream/StreamInfo";
import Payments from "../../payments/AllPayments"
import ExtraLessons from "./ExtraLesson/ExtraLessons"
import Sessions from './sessions/Sessions'
import {GetSchoolInfo} from '../../../_actions/schoolActions'
import CoManagers from "./CoManagers/CoManagers"

class ManagerDashboard extends React.Component {

    state = {
        loading : false, 
        sidebar: true, 
        active: 'dashboard', 
        showLang: false ,
        justSchool : false ,
        justCompany : false
    }

    componentDidMount = async () => {
        this.setState({ active: this.props.location.pathname.split('/')[2] })
        if (window.innerWidth < 1024) this.setState({ sidebar: false })

        // window.$crisp = [];
        // window.CRISP_WEBSITE_ID = "4ede6290-1f82-45d7-81ff-1ea74b2afc00";

        // (function() {
        //     var d = document;
        //     var s = d.createElement("script");

        //     s.src = "https://client.crisp.chat/l.js";
        //     s.async = 1;
        //     d.getElementsByTagName("head")[0].appendChild(s);
        // })();

        this.setState({loading : true})
        await this.props.GetSchoolInfo(this.props.user.token)
        this.setState({loading : false})
        // console.log(this.props);

        if(this.props.schoolLessonInfo.bases.length === 1 && this.props.schoolLessonInfo.bases[0].baseName === 'جلسات'){
            this.setState({justCompany : true})
        }
        const meet = this.props.schoolLessonInfo.bases.filter(base => base.baseName === 'جلسات')
        
        if(meet.length === 0){
            this.setState({justSchool : true})
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active !== this.props.location.pathname.split('/')[2]) {
            this.setState({ active: this.props.location.pathname.split('/')[2] })
            if (window.innerWidth < 1024) {
                this.setState({ sidebar: false })
            }
            
        }

        window.onresize = () => {
            if(window.innerWidth >= 1024){
                this.setState({sidebar : true})
            }
        }
    }

    toggleSidebar = () => {
        this.setState({ sidebar: !this.state.sidebar})
    }

    changeActive = panel => {
        history.push(this.props.match.url + '/' + panel)
    }

    setShowLang = show => {
        this.setState({ showLang: show })
    }

    render() {
        if (this.state.loading) return (<div className="tw-text-center tw-bg-dark-blue tw-w-full tw-h-screen">{working('centerize tw-w-12')}</div>)
        return (
            <div onClick={() => this.setState({ showLang: false })} className="tw-w-screen tw-min-h-screen">
                <Sidebar
                    show={this.state.sidebar}
                    toggle={this.toggleSidebar}
                    active={this.state.active}
                    logoTitle={this.props.dashboardInfo.school  ? this.props.dashboardInfo.school.schoolType : -1}
                    title={(this.props.dashboardInfo && this.props.dashboardInfo.school && this.props.user.userDetail ? 
                        `${this.props.t('school')} ${this.props.user.userDetail.schooltypeName} 
                        ${this.props.dashboardInfo.school.sexuality == 0 ? this.props.t('masculine') : this.props.t('feminine')}  
                        ${this.props.dashboardInfo.school.schoolName}`
                    : null)}
                >
                    
                    <SidebarCard
                        active={this.state.active}
                        code="dashboard"
                        title={this.props.t('dashboard')}
                        icon={layout}
                        changeActive={this.changeActive}
                    />
                    {
                        (this.state.justSchool || !this.state.justCompany) ?
                        <SidebarCard
                        active={this.state.active}
                        code="bases"
                        title={this.props.t('manageClasses')}
                        icon={layers}
                        changeActive={this.changeActive}
                        />
                        :
                        null
                    }

                    {this.state.justCompany || (!this.state.justCompany && !this.state.justSchool) ?
                        <SidebarCard
                        active={this.state.active}
                        code="sessions"
                        title={this.props.t('manageSessions')}
                        icon={bell}
                        changeActive={this.changeActive}
                        />
                        :
                        null
                    }
                    {
                        (this.state.justSchool || !this.state.justCompany) ?
                            <SidebarCard
                            active={this.state.active}
                            code="groups"
                            title={this.props.t('manageGroups')}
                            icon={grid}
                            changeActive={this.changeActive}
                            />
                        :
                            null
                    }
                    
                    {
                        (this.state.justSchool || !this.state.justCompany) ?
                            <SidebarCard
                            active={this.state.active}
                            code="extraLesson"
                            title={this.props.t('additionallessons')}
                            icon={plus_square}
                            changeActive={this.changeActive}
                            />
                        :
                        null
                    }

                    {
                        (this.state.justSchool || !this.state.justCompany)?
                            <SidebarCard
                            active={this.state.active}
                            code="tracker"
                            title={this.props.t('virtualClasses')}
                            icon={video}
                            changeActive={this.changeActive}
                            />
                        :
                        null
                    }
                    
                    
                    <SidebarCard
                        active={this.state.active}
                        code="conference"
                        title={this.props.t('conference')}
                        icon={airplay}
                        changeActive={this.changeActive}
                    />

                    <SidebarCard
                        active={this.state.active}
                        code="teachers"
                        title={this.state.justCompany ? this.props.t('hosts') : this.props.t('teachers')}
                        icon={user}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="coManagers"
                        title="معاونین"
                        icon={user}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="students"
                        title={this.state.justCompany ? this.props.t('participants') : this.props.t('students')}
                        icon={users}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="news"
                        title={this.props.t('news')}
                        icon={message}
                        changeActive={this.changeActive}
                    />
                    {!window.location.href.includes('dei') ? 
                    <SidebarCard
                    active={this.state.active}
                    code="payments"
                    title={this.props.t('payments')}
                    icon={briefcase}
                    changeActive={this.changeActive}
                /> 
                    : 
                    null
                    }
                </Sidebar>

                <div className="lg:tw-w-5/6 tw-px-6 tw-w-full tw-min-h-screen tw-bg-bold-blue">
                    <Header showLang={this.state.showLang} setShowLang={this.setShowLang} />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home}/>
                        <Route path={this.props.match.url + "/teachers"} component={Teachers}/>
                        <Route path={this.props.match.url + "/coManagers"} component={CoManagers}/>
                        <Route path={this.props.match.url + "/bases"} component={Grades}/>
                        <Route path={this.props.match.url + "/sessions"} component={Sessions}/>
                        <Route path={this.props.match.url + "/groups"} component={Groups}/>
                        <Route path={this.props.match.url + "/students"} component={Students}/>
                        <Route path={this.props.match.url + "/conference"} component={StreamInfo}/>
                        <Route path={this.props.match.url + "/news"} component={News}/>
                        <Route path={this.props.match.url + "/tracker"} component={Tracker}/>
                        <Route path={this.props.match.url + "/payments"} component={Payments}/>
                        <Route path={this.props.match.url + "/extraLesson"} component={ExtraLessons}/>

                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , dashboardInfo : state.managerData.dashboardInfo ,
        schoolLessonInfo: state.schoolData.schoolLessonInfo}
}

const cwrapped = connect(mapStateToProps , {GetSchoolInfo})(protectedManager(ManagerDashboard))

export default withTranslation()(cwrapped);