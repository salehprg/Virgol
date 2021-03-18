import React from "react";
import { withTranslation } from 'react-i18next';
import PlusTable from "../dashboards/tables/PlusTable";
import {edit, external_link, loading, trash} from "../../assets/icons";
import history from "../../history";
import {GetParticipantList , SetPresentStatus } from "../../_actions/meetingActions"
import { connect } from "react-redux";

class ParticipantList extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false , participants : []}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.GetParticipantList(this.props.user.token , this.props.match.params.id);
        this.setState({ loading: false })

        var newStatus = this.props.participants.map(x => {
            if((x.presentCount / x.checkCount) * 100 >= 70)
            {
                x.isPresent = true;
            }
            else
            {
                x.isPresent = false;
            }
            return x
        })

        this.setState({participants : this.props.participants})

        window.onbeforeunload = function(){
            return 'Are you sure you want to leave?';
        };
    }

    handleStatusChanged = (id , status , e)  => {

        this.setState(prevState => ({

            participants: prevState.participants.map(
                el => el.id === id ? { ...el, isPresent: status } : el
            )

        }))
    }

    handleSubmit = async () => {
        await this.props.SetPresentStatus(this.props.user.token , this.state.participants)
    }

    render() {
        if(this.state.loading) return loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-screen tw-min-h-screen tw-py-16 lg:tw-px-10 tw-px-1 tw-relative tw-bg-bold-blue tw-flex lg:tw-flex-row tw-flex-col">
                <div className="lg:tw-w-1/2 tw-w-full tw-h-85 tw-text-center">
                    <img className="w-2/3 tw-mx-auto" src="/time.svg" alt="time illustartion" />
                    <p className="md:w-2/3 tw-w-5/6 tw-mt-6 tw-mx-auto tw-text-white tw-text-center"> {this.props.t('participantsListInfo')} </p>
                    <p className="md:w-2/3 tw-w-5/6 tw-mb-6 tw-mx-auto tw-text-redish tw-text-center"> {this.props.t('submitParticipantsWarning')} </p>
                    <button onClick={(e) => this.handleSubmit(e)} className="tw-px-12 tw-py-2 tw-rounded-lg tw-bg-greenish tw-text-white">
                        ثبت
                    </button>
                </div>

                <div className="lg:tw-w-1/2 tw-w-full tw-h-85">
                    <div className="tw-w-full tw-flex tw-flex-row-reverse tw-justify-between tw-items-center">
                        <p className="tw-text-white">{this.state.participants[0] ? this.state.participants[0].meetingName : ''}</p>
                        <p className="tw-text-white"> {this.props.t('classDuration')} {this.state.participants[0] ? this.state.participants[0].checkCount * 5 : ''} {this.props.t('minute')} </p>
                    </div>
                    <div className="tw-mt-2 tw-overflow-auto tw-h-full">
                        {(this.state.participants ?
                            <>
                                <PlusTable
                                    seachable={false}
                                    isPaginate={false}
                                    title={this.props.t('participantsListTitle')}
                                    isLoading={this.state.loading}
                                    query={this.state.query}
                                    changeQuery={this.changeQuery}
                                    button={() => null}
                                    headers={[`${this.props.t('firstName')} ${this.props.t('lastName')}`, this.props.t('participationAvg'), this.props.t('condition')]}
                                    body={() => {
                                        return (
                                            <React.Fragment>
                                                {
                                                    this.state.participants.map(x => {
                                                        return(
                                                            <tr key={x.id}>
                                                                <td className="tw-py-4 tw-text-right tw-px-4">{x.firstName} {x.lastName}</td>
                                                                <td className="tw-py-4 tw-text-right tw-px-4">{x.presentCount * 5} {this.props.t('minute')} </td>
                                                                {/* <td className="tw-py-4">{x.checkCount * 5} دقیقه</td> */}
                                                                <td className="tw-py-4 tw-text-right tw-px-4">{
                                                                    <div style={{direction : "rtl"}} className="tw-text-white">
                                                                        <input
                                                                            type="radio"
                                                                            value="Present"
                                                                            name={x.id + ''}
                                                                            checked={x.isPresent}
                                                                            onChange={(e) => this.handleStatusChanged(x.id , true , e)}
                                                                        /> {this.props.t('present')}

                                                                        <input
                                                                            className="tw-mr-4"
                                                                            checked={!x.isPresent}
                                                                            onChange={(e) => this.handleStatusChanged(x.id , false , e)}
                                                                            type="radio"
                                                                            value="Absent"
                                                                            name={x.id + ''}
                                                                        /> {this.props.t('absent')}
                                                                    </div>
                                                                }</td>
                                                            </tr>
                                                        )
                                                    })

                                                }
                                            </React.Fragment>
                                        );
                                    }}
                                />
                                </>
                            : null )}
                    </div>

                </div>
                {/*{(this.state.participants ? */}
                {/*    <>*/}
                {/*        <PlusTable*/}
                {/*            isPaginate={false}*/}
                {/*            title="لیست حضور و غیاب افراد شرکت کننده کلاس درس"*/}
                {/*            isLoading={this.state.loading}*/}
                {/*            query={this.state.query}*/}
                {/*            changeQuery={this.changeQuery}*/}
                {/*            button={() => null}*/}
                {/*            headers={['نام نام خانوادگی' , 'میانگین زمان حضور' ,'مدت زمان جلسه' , 'وضعیت']}*/}
                {/*            body={() => {*/}
                {/*                return (*/}
                {/*                    <React.Fragment>*/}
                {/*                        {*/}
                {/*                            this.state.participants.map(x => {*/}
                {/*                                return(*/}
                {/*                                <tr key={x.id}>*/}
                {/*                                    <td className="tw-py-4">{x.firstName} {x.lastName}</td>*/}
                {/*                                    <td className="tw-py-4">{x.presentCount * 5} دقیقه</td>*/}
                {/*                                    <td className="tw-py-4">{x.checkCount * 5} دقیقه</td>*/}
                {/*                                    <td className="tw-py-4">{*/}
                {/*                                        <div style={{direction : "rtl"}} className="tw-text-white">*/}
                {/*                                            <input */}
                {/*                                                type="radio" */}
                {/*                                                value="Present" */}
                {/*                                                name={x.id + ''}*/}
                {/*                                                checked={x.isPresent}*/}
                {/*                                                onChange={(e) => this.handleStatusChanged(x.id , true , e)}*/}
                {/*                                            /> حاضر*/}
                {/*                */}
                {/*                                            <input */}
                {/*                                                className="tw-mr-4" */}
                {/*                                                checked={!x.isPresent}*/}
                {/*                                                onChange={(e) => this.handleStatusChanged(x.id , false , e)} */}
                {/*                                                type="radio" */}
                {/*                                                value="Absent" */}
                {/*                                                name={x.id + ''} */}
                {/*                                            /> غایب*/}
                {/*                                        </div>*/}
                {/*                                    }</td>*/}
                {/*                                </tr>*/}
                {/*                                )*/}
                {/*                            })*/}
                {/*                            */}
                {/*                        }*/}
                {/*                    </React.Fragment>*/}
                {/*                );*/}
                {/*            }}*/}
                {/*        />*/}

                {/*        <button onClick={(e) => this.handleSubmit(e)} className="tw-text-white tw-bg-greenish tw-w-40 tw-rounded-full">ثبت</button>*/}
                {/*    </>*/}
                {/*: null )}*/}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo  , participants : state.meetingData.participantsList}
}

const cwrapped = connect(mapStateToProps, { GetParticipantList , SetPresentStatus})(ParticipantList);

export default withTranslation()(cwrapped);