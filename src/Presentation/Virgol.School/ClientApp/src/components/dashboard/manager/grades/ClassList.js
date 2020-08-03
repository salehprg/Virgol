import React from 'react';
import { connect } from 'react-redux';
import { getClassInGrades , addNewClass , editClass , deleteClass } from "../../../../_actions/managerActions";
import SearchBar from "../../SearchBar";
import {loading} from "../../../../assets/icons";
import CategoryCard from "../category/CategoryCard";
import protectedManager from "../../../protectedRoutes/protectedManager";
import AddClass from './AddClass';


class ClassList extends React.Component {

    state = { loading: false, showAddClass: false, searchQuery: '' }

    async componentDidMount() {
        if (this.props.history.action === 'POP' || !this.props.grades) {
            this.setState({loading: true})
            await this.props.getClassInGrades(this.props.user.token , parseInt(this.props.match.params.id));
            this.setState({loading: false})
        }
    }

    search = (query) => {
        this.setState({ searchQuery: query })
    }

    renderCards = () => {
        if (!this.props.classes)
            return (
            <span className="text-2xl text-grayish block text-center">هیچ کلاسی وجود ندارد</span>
        );
        return this.props.classes.map((classs, index) => {
            // if (classs.className.includes(this.state.searchQuery)) {
                return (
                    <CategoryCard
                        key={classs.id}
                        title={classs.className}
                        id={classs.id}
                        code={index}
                    />
                );
            // }
        })
    }

    cancelAdd = () => {
        this.setState({ showAddClass: false })
    }

    render() {
        if (this.state.loading) return <div className="flex justify-center items-center">{loading("w-16 text-grayish")}</div>
        return (
            <div className="w-full">
                {this.state.showAddClass ? <AddClass onAddCancel={this.cancelAdd} gradeId={parseInt(this.props.match.params.id)}/> : null}
                <div className="w-full flex xl:flex-row-reverse flex-col justify-start items-center">
                    <SearchBar
                        value={this.state.searchQuery}
                        search={this.search}
                    />
                    <button onClick={() => this.setState({ showAddClass: true })} className="py-1 px-8 xl:my-0 my-4 mx-4 bg-green rounded-full text-white focus:outline-none focus:shadow-outline">مقطع جدید</button>
                </div>

                <div className="w-full grid grid-categories mt-12">
                    {this.renderCards()}
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { user: state.auth.userInfo, classes: state.managerData.classes }
}

const authWrapped = protectedManager(ClassList)
export default connect(mapStateToProps, { getClassInGrades })(authWrapped);