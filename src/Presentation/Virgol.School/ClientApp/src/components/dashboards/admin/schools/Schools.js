import React from "react";
import PlusTable from "../../tables/PlusTable";
import {edit, external_link, loading, trash} from "../../../../assets/icons";
import history from "../../../../history";
import {getSchools , RemoveSchool , AddBulkSchool} from "../../../../_actions/schoolActions"
import {RedirectAdmin } from "../../../../_actions/adminActions"
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import { connect } from "react-redux";
import DeleteConfirm from "../../../modals/DeleteConfirm";

class Schools extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, itemsPerPage: 20, currentPage: 1 , totalCard : 0}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getSchools(this.props.user.token);
        this.setState({ loading: false })

        this.setState({totalCard : this.props.schools.length})
    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , schoolId : id})
    }

    redirect = async (schoolId) => {
        await this.props.RedirectAdmin(this.props.user.token , parseInt(schoolId))
    }

    deleteSchool = async () => {
        await this.props.RemoveSchool(this.props.user.token , this.state.schoolId)
        this.setState({showDeleteModal : false , schoolId : 0})
    }

    changeQuery = query => {
        this.setState({ query })
    }

    submitExcel = async excel => {
        await this.props.AddBulkSchool(this.props.user.token , excel)
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
    }

    render() {
        if(this.state.loading) return loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title="آیا از عمل حذف مطمئن هستید؟ این عمل قابلیت بازگشت ندارد!"
                    confirm={this.deleteSchool}
                    cancel={() => this.setState({ showDeleteModal: false, deleteFieldId: null, deleteCatId: null })}
                /> 
                : 
                null
                }
                <PlusTable
                    title="لیست مدارس تحت پوشش"
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    excel="بارگذاری اکسل مدارس"
                    sample="دانلود نمونه اکسل مدارس"
                    sampleLink="/samples/SchoolTemplate.xlsx"
                    handleExcel={this.submitExcel}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/newSchool')} className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">مدرسه جدید</button>
                        );
                    }}
                    headers={['نام مدرسه', 'کد', 'نوع', 'مدیر', '' , '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.props.schools.slice((this.state.currentPage - 1) * this.state.itemsPerPage , this.state.currentPage  * this.state.itemsPerPage).map(x => {
                                        if(x.schoolName.includes(this.state.query))
                                        {
                                            return(
                                            <tr key={x.id}>
                                                <td className="py-4">{x.schoolName}</td>
                                                <td>{x.schoolIdNumber}</td>
                                                <td>{x.schoolTypeName}</td>
                                                <td>{x.firstName} {x.lastName}</td>
                                                <td onClick={() => this.redirect(x.id)} className="cursor-pointer">
                                                    {external_link('w-6 text-white ')}
                                                </td>
                                                <td className="cursor-pointer" onClick={() => history.push(`/school/${x.id}`)}>
                                                    {edit('w-6 text-white')}
                                                </td>
                                                <td onClick={() => this.showDelete(x.id)} className="cursor-pointer">
                                                    {trash('w-6 text-white ')}
                                                </td>
                                            </tr>
                                            )
                                        }
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

const mapStateToProps = state => {
    return {user: state.auth.userInfo , schools: state.schoolData.schools}
}

export default connect(mapStateToProps, { getSchools , RemoveSchool , RedirectAdmin , AddBulkSchool })(Schools);