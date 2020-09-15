import React from "react";
import PlusTable from "../dashboards/tables/PlusTable";
import {edit, external_link, loading, trash} from "../../assets/icons";
import history from "../../history";
import {GetParticipantList , SetPresentStatus } from "../../_actions/meetingActions"
import { connect } from "react-redux";

class ParticipantList extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false , participants : []}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.GetParticipantList(this.props.match.params.id);
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
        console.log(id + " : " + status)
    }

    handleSubmit = async () => {
        await this.props.SetPresentStatus(this.state.participants)
    }

    render() {
        if(this.state.loading) return loading('w-10 text-grayish centerize')
        return (
            <div className="w-screen min-h-screen py-16 lg:px-10 px-1 relative bg-bold-blue flex lg:flex-row flex-col">
                <div className="lg:w-1/2 w-full h-85 text-center">
                    <img className="w-2/3 mx-auto" src="/time.svg" alt="time illustartion" />
                    <p className="md:w-2/3 w-5/6 mt-6 mx-auto text-white text-center">سیستم حضور غیاب بر اساس درصد حضور دانش آموز در کلاس درس این لیست را در اختیار شما معلم گرامی قرار داده است
                        شما میتوانید وضعیت حضور دانش آموزان را در لیست تغییر دهید
                    </p>
                    <p className="md:w-2/3 w-5/6 mb-6 mx-auto text-redish text-center">حتما یادتان باشد که دکمه ثبت را قبل از خروج بزنید</p>
                    <button onClick={(e) => this.handleSubmit(e)} className="px-12 py-2 rounded-lg bg-greenish text-white">
                        ثبت
                    </button>
                </div>

                <div className="lg:w-1/2 w-full h-85">
                    <div className="w-full flex flex-row-reverse justify-between items-center">
                        <p className="text-white">{this.state.participants[0] ? this.state.participants[0].meetingName : ''}</p>
                        <p className="text-white">مدت زمان کلاس: {this.state.participants[0] ? this.state.participants[0].checkCount * 5 : ''} دقیقه</p>
                    </div>
                    <div className="mt-2 overflow-auto h-full">
                        {(this.state.participants ?
                            <>
                                <PlusTable
                                    seachable={false}
                                    isPaginate={false}
                                    title="لیست حضور و غیاب افراد شرکت کننده کلاس درس"
                                    isLoading={this.state.loading}
                                    query={this.state.query}
                                    changeQuery={this.changeQuery}
                                    button={() => null}
                                    headers={['نام نام خانوادگی' , 'میانگین زمان حضور' ,'مدت زمان جلسه' , 'وضعیت']}
                                    body={() => {
                                        return (
                                            <React.Fragment>
                                                {
                                                    this.state.participants.map(x => {
                                                        return(
                                                            <tr key={x.id}>
                                                                <td className="py-4">{x.firstName} {x.lastName}</td>
                                                                <td className="py-4">{x.presentCount * 5} دقیقه</td>
                                                                <td className="py-4">{x.checkCount * 5} دقیقه</td>
                                                                <td className="py-4">{
                                                                    <div style={{direction : "rtl"}} className="text-white">
                                                                        <input
                                                                            type="radio"
                                                                            value="Present"
                                                                            name={x.id + ''}
                                                                            checked={x.isPresent}
                                                                            onChange={(e) => this.handleStatusChanged(x.id , true , e)}
                                                                        /> حاضر

                                                                        <input
                                                                            className="mr-4"
                                                                            checked={!x.isPresent}
                                                                            onChange={(e) => this.handleStatusChanged(x.id , false , e)}
                                                                            type="radio"
                                                                            value="Absent"
                                                                            name={x.id + ''}
                                                                        /> غایب
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
                {/*                                    <td className="py-4">{x.firstName} {x.lastName}</td>*/}
                {/*                                    <td className="py-4">{x.presentCount * 5} دقیقه</td>*/}
                {/*                                    <td className="py-4">{x.checkCount * 5} دقیقه</td>*/}
                {/*                                    <td className="py-4">{*/}
                {/*                                        <div style={{direction : "rtl"}} className="text-white">*/}
                {/*                                            <input */}
                {/*                                                type="radio" */}
                {/*                                                value="Present" */}
                {/*                                                name={x.id + ''}*/}
                {/*                                                checked={x.isPresent}*/}
                {/*                                                onChange={(e) => this.handleStatusChanged(x.id , true , e)}*/}
                {/*                                            /> حاضر*/}
                {/*                */}
                {/*                                            <input */}
                {/*                                                className="mr-4" */}
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

                {/*        <button onClick={(e) => this.handleSubmit(e)} className="text-white bg-greenish w-40 rounded-full">ثبت</button>*/}
                {/*    </>*/}
                {/*: null )}*/}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {participants : state.meetingData.participantsList}
}

export default connect(mapStateToProps, { GetParticipantList , SetPresentStatus})(ParticipantList);