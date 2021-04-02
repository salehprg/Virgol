import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactPlayer from 'react-player'
import { arrow_left, loading } from '../../../assets/icons';
import {connect} from 'react-redux'
import {getLinks} from '../../../_actions/guideActions'
import history from '../../../history';
class PrincipalGuide extends React.Component{ 

    state={
        loading : false
    }
    
    async componentDidMount(){
        this.setState({loading : true})
        await this.props.getLinks('Manager')
        this.setState({loading : false})

    }

    render(){    
        if(this.state.loading) return loading('tw-w-12 centerize tw-text-grayish')
        return(
            <div className="tw-w-screen tw-px-4 tw-min-h-screen tw-bg-black-blue tw-flex md:tw-flex-row tw-flex-col-reverse tw-justify-evenly tw-items-center">
                <div onClick={() => this.props.history.goBack()} className="tw-w-10 tw-h-10 tw-cursor-pointer tw-absolute tw-top-0 tw-left-0 tw-mt-6 tw-ml-6 tw-rounded-lg tw-border-2 tw-border-purplish">
                    {arrow_left('tw-w-6 centerize tw-text-purplish')}
                </div>
                <div className="tw-w-full tw-max-w-800">
                    <ReactPlayer width="100%" height="100%" url={this.props.link[0]} controls={true}/>
                </div>
                <div className="tw-text-center">
                    <img className="tw-w-24 tw-mx-auto tw-mb-8" src={"/logo.svg"} alt="logo" />
                    <p className="tw-text-white tw-text-2xl">{this.props.t('virgoolVirtualLearning')}</p>
                    <p className="tw-text-white tw-py-6 tw-text-lg">{this.props.t('principalsGuideVideo')}</p>
                    <form method="get" action={this.props.link[1]} className="tw-text-center">
                        <input className="tw-px-6 tw-cursor-pointer tw-bg-transparent tw-py-1 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg tw-mx-auto" value={this.props.t('download')} type="submit"/>
                    </form>
                </div>
            </div>
            // <div className="tw-w-full tw-h-screen tw-bg-vst row">
            //     <div className="col-lg-6 col-md-12 col-xl-6 col-sm-12">
            //         <div className="tw-m-4" onClick={()=> history.push('/video/guide-pr')}>{arrow_left('tw-w-12 tw-border-2 tw-text-purplish tw-border-purplish tw-rounded-lg tw-cursor-pointer tw-mx-2 tw-p-2')}</div>
            //         <div className="tw-text-white tw-mx-auto tw-w-1/2 tw-text-center tw-py-4 tw-border-4 tw-text-sm lg:tw-text-lg tw-border-purplish tw-rounded-lg">راهنمای سامانه ویرگول مخصوص مدیران</div>  
            //     </div>
            //     <div className="col-lg-6 col-md-12 col-xl-6 col-sm-12">
            //         <ReactPlayer className="tw-mx-auto lg:tw-mt-24 tw-mb-4" url={url} width='90%' controls={true}/>
            //         <form method="get" action="https://goldenstarc.arvanvod.com/0WobRajx6K/pZq3EW9vdj/origin_FjJsk5SRrvgYje8m395IVK6hkEQOJWiI3iSBTTrM.mp4" className="tw-text-center">
            //             <input className="tw-px-6 tw-cursor-pointer tw-bg-transparent tw-py-1 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg tw-mx-auto" value={this.props.t('download')} type="submit"/>
            //         </form>
            //     </div>
            // </div>
        )
    }    
}

const mapStateToProps = state =>{
    return{
        link:state.guide.principalLinks
    }
}

const cwrapped = connect(mapStateToProps , {getLinks})(PrincipalGuide)

export default withTranslation()(cwrapped)