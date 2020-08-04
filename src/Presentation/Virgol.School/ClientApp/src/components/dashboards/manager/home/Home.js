import React from "react";
import Hero from "../../admin/home/Hero";
import CounterCard from "../../admin/home/CounterCard";
import {home, key, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";
import { connect } from "react-redux";
import {getDashboardInfo , getNews} from "../../../../_actions/adminActions"

class Home extends React.Component {

    state = {loading : false}

    // componentDidMount = async () =>{
    //     if (this.props.history.action === 'POP' || this.props.dashboardInfo.length == 0 || this.props.news.length == 0 ) {

    //         this.setState({loading: true})
    //         await this.props.getDashboardInfo(this.props.user.token);
    //         await this.props.getNews(this.props.user.token);
    //         this.setState({loading: false})

    //     }
    // }
    
    render() {
        if(this.state.loading) return "درحال بارگداری اطلاعات ..."
        return (
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 py-6">
                {/* <Hero userInfo={this.props.user.userInformation}
                        userDetail={this.props.user.userDetail}/> */}
                <Hero />
                <CounterCard
                    title="کل کلاس ها"
                    icon={home}
                    number={32}
                    border="border-sky-blue"
                />

                <CounterCard
                    title="کلاس های آنلاین"
                    icon={user}
                    number={12}
                    border="border-purplish"
                />

                <CounterCard
                    title="کل دانش آموزان"
                    icon={key}
                    number={255}
                    border="border-greenish"
                    pos="row-start-3"
                />

                <CounterCard
                    title="معلمان"
                    icon={users}
                    number={4}
                    border="border-redish"
                    pos="row-start-3"
                />

                <Feed
                    news={[{message: 'من یه پرندم آرزو دارم', tagsStr:[], createTime:"1399/5/1"}]}
                    title="آخرین خبرهای منتشر شده از سمت شما"
                    pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo}
}

export default connect(mapStateToProps, { getDashboardInfo , getNews })(Home);