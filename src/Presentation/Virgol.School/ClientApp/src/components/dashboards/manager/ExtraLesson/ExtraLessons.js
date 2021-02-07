import React from 'react';
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import { connect } from "react-redux";
import {edit, external_link, loading, trash} from "../../../../assets/icons";
import {GetExtraLessons , UnAssignUserFromLesson} from "../../../../_actions/managerActions";
import history from "../../../../history";
import DeleteConfirm from '../../../modals/DeleteConfirm';

class ExtraLessons extends React.Component {

    state = { 
        loading: false, 
        extraLessonId : null,
        showDeleteModal : false
    }

    componentDidMount = async () => {
        await this.props.GetExtraLessons(this.props.user.token);

    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , extraLessonId : id})
    }

    UnAssignUser = async () => {
        await this.props.UnAssignUserFromLesson(this.props.user.token , this.state.extraLessonId)
        this.componentDidMount()
    }

    render() {
        return (
            <div className="w-full mt-10">
                {this.state.showDeleteModal ? 
                    <DeleteConfirm
                        title={this.props.t('deleteConfirm')}
                        confirm={this.UnAssignUser}
                        cancel={() => this.setState({ showDeleteModal: false, extraLessonId : 0 })}
                    /> 
                    : 
                    null
                }
                <PlusTable
                    isPaginate={false}
                    title={this.props.t('extraLessonList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    //changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/addExtraLesson')} className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg"> {this.props.t('addExtraLesson')} </button>
                        );
                    }}
                    headers={[this.props.t('name'), this.props.t('className'), this.props.t('lesson'), '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                (this.props.extraLessons ?
                                    this.props.extraLessons.map(x => {
                                        return(
                                            <tr key={x.id}>
                                                <td>{`${x.firstName} ${x.lastName}`}</td>
                                                <td className="py-4">{x.className}</td>
                                                <td>{x.lessonName}</td>
                                                <td onClick={() => this.showDelete(x.id)} className="cursor-pointer">
                                                    {trash('w-6 text-white ')}
                                                </td>
                                            </tr>
                                            )
                                    })
                                : null)
                                }
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , 
            extraLessons : state.managerData.extraLesson}
}

const cwrapped = connect (mapStateToProps, { GetExtraLessons , UnAssignUserFromLesson})(ExtraLessons);

export default withTranslation()(cwrapped);