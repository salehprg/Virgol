import React from "react";
import PlusTable from "../dashboards/tables/PlusTable";
import {edit, external_link, loading, trash} from "../../assets/icons";
import history from "../../history";
import {GetParticipantList , SetPresentStatus } from "../../_actions/meetingActions"
import { connect } from "react-redux";

class ParticipantList extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.GetParticipantList(this.props.match.params.id);
        this.setState({ loading: false })
    }

    render() {
        if(this.state.loading) return loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                {(this.props.participants ? 
                    <PlusTable
                        title="لیست حضور و غیاب کلاس درس"
                        isLoading={this.state.loading}
                        query={this.state.query}
                        changeQuery={this.changeQuery}
                        button={() => {
                            return (
                                <button onClick={() => history.push('/addNewsManager')} className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">خبر جدید</button>
                            );
                        }}
                        headers={['نام نام خانوادگی' , 'میانگین زمان حضور' ,'مدت زمان جلسه' , 'وضعیت']}
                        body={() => {
                            return (
                                <React.Fragment>
                                    {
                                        this.props.participants.map(x => {
                                            return(
                                            <tr key={x.id}>
                                                <td className="py-4">{x.firstName} {x.lastName}</td>
                                                <td className="py-4">{x.presentCount * 5} دقیقه</td>
                                                <td className="py-4">{x.checkCount * 5} دقیقه</td>
                                                <td className="py-4">{((x.presentCount / x.checkCount) * 100 > 70 ? "حاضر" : "غایب")}</td>
                                            </tr>
                                            )
                                        })
                                        
                                    }
                                </React.Fragment>
                            );
                        }}
                    />
                : null )}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {participants : state.meetingData.participantsList}
}

export default connect(mapStateToProps, { GetParticipantList , SetPresentStatus})(ParticipantList);