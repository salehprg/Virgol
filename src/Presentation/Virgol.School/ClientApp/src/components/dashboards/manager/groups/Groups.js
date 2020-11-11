import React from 'react';
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import {edit, external_link, loading, trash} from "../../../../assets/icons";
import history from "../../../../history";

class Groups extends React.Component {

    state = { 
        loading: false, 
        query: '', 
        groups: [{ id: 1, classes: ['الف', 'ب', 'جیم'], lesson: 'حسابان 2', teacher: 'مصطفی', time: 'سه شنبه 8 - 10' }]
    }

    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        return (
            <div className="w-full mt-10">
                {/* {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title={this.props.t('deleteConfirm')}
                    confirm={this.delteNews}
                    cancel={() => this.setState({ showDeleteModal: false, deleteFieldId: null, deleteCatId: null })}
                /> 
                : 
                null
                } */}
                <PlusTable
                    isPaginate={false}
                    title={this.props.t('groupsList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/newGroup')} className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg"> {this.props.t('newGroup')} </button>
                        );
                    }}
                    headers={[this.props.t('classes'), this.props.t('lesson'), this.props.t('teacher'), this.props.t('time'), '', '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.state.groups.map(x => {
                                        return(
                                            <tr key={x.id}>
                                                <td className="py-4">{x.classes.reduce((acc, val) => acc + " - " + val)}</td>
                                                <td>{x.lesson}</td>
                                                <td>{x.teacher}</td>
                                                <td>{x.time}</td>
                                                <td className="cursor-pointer" onClick={() => history.push(`/managerNews/${x.id}`)}>
                                                    {edit('w-6 text-white')}
                                                </td>
                                                <td onClick={() => this.showDelete(x.id)} className="cursor-pointer">
                                                    {trash('w-6 text-white ')}
                                                </td>
                                            </tr>
                                            )
                                    })
                                    
                                }
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

export default withTranslation()(Groups);