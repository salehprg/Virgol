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

        console.log(newStatus);
        this.setState({participants : newStatus})
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
            <div className="w-screen min-h-screen py-16 lg:px-10 px-1 relative bg-bold-blue ">
                {(this.state.participants ? 
                    <>
                        <PlusTable
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
                        <button onClick={(e) => this.handleSubmit(e)} className="text-white bg-greenish w-40 rounded-full">ثبت</button>
                    </>
                : null )}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {participants : state.meetingData.participantsList}
}

export default connect(mapStateToProps, { GetParticipantList , SetPresentStatus})(ParticipantList);