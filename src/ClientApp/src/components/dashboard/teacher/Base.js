import React from "react";
import ReactTooltip from "react-tooltip";
import Select from 'react-select';
import { getAllCategory } from "../../../actions";
import {book, edit, remove, loading, errorOutline} from "../../../assets/icons";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";

class Base extends React.Component {

    state = { selectedCourses: null, query: '' }

    componentDidMount() {
        this.props.getAllCategory(this.props.auth.token);
    }

    renderBases = () => {
        const { categories } = this.props;

        if (categories !== null) {
            const bases = categories.map((category) => {
                if (category.name.includes(this.state.query)) {
                    return (
                        <tr key={category.id}>
                            <td className="py-2">{category.name}</td>
                            <td className="flex flex-row justify-center py-2">
                                <div data-tip="حذف">
                                    {remove("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")}
                                </div>
                                <div data-tip="ویرایش">
                                    {edit("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")}
                                </div>
                                <div data-tip="نمایش دروس">
                                    {book("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")}
                                </div>
                            </td>
                        </tr>
                    );
                }
            })

            if (!bases[0]) {
                return (
                    <div className="w-full flex-grow flex flex-col justify-center items-center">
                        {errorOutline("w-24 h-24 text-blueish")}
                        <span className="text-xl mt-4 text-dark-blue">هیچ مقطعی وجود ندارد</span>
                    </div>
                );
            } else {


                return (
                    <table dir="rtl" className="table-auto w-5/6 text-center">
                        <thead>
                        <tr className="border-b-2 border-blueish">
                            <th className="px-8 py-2">نام مقطع</th>
                            <th className="px-8"> </th>
                        </tr>
                        </thead>
                        <tbody>
                            {bases}
                        </tbody>
                    </table>
                );
            }
        }

        return loading("w-16 h-16 text-blueish")
    }

    renderFormInputs = ({ input, meta, placeholder }) => {
        return (
            <div className={`flex px-1 flex-row py-3 my-6 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
                <input
                    {...input}
                    dir="rtl"
                    className="w-full px-2 placeholder-grayish focus:outline-none"
                    type="text"
                    placeholder={placeholder}
                />
            </div>
        );
    }

    onAddBase = () => {

    }

    renderCourses = () => {
        return [
            { value: 'riazi', label: 'ریاضی' },
            { value: 'oloom', label: 'علوم' },
            { value: 'dini', label: 'هدیه های آسمان' },
            { value: 'varzesh', label: 'ورزش' },
        ];
    }

    handleChange = selectedCourses => {
        this.setState({ selectedCourses });
    };

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center justify-evenly">
                <ReactTooltip />
                <div className="md:w-1/4 w-5/6 md:order-1 order-2 flex flex-col items-end">
                    <input
                        type="text"
                        className="md:w-1/3 w-1/2 invisible mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">افزودن مقطع</span>
                        <form className="w-3/4 flex flex-col text-center" onSubmit={this.props.handleSubmit(this.onAddBase)}>
                            <Field
                                name="baseName"
                                placeholder="نام مقطع"
                                component={this.renderFormInputs}
                            />
                            <Select
                                value={this.state.selectedCourses}
                                onChange={this.handleChange}
                                options={this.renderCourses()}
                                isMulti={true}
                                isSearchabel={true}
                                placeholder="دروس"
                            />
                            <button className="bg-golden my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg">افزودن</button>
                        </form>
                    </div>
                </div>
                <div className="md:w-1/2 w-5/6 max-h-screen mb-12 md:order-12 order-1 flex flex-col items-end">
                    <input
                        value={this.state.query}
                        onChange={(e) => this.setState({ query: e.target.value })}
                        className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full min-h-75 flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">مقاطع تحصیلی</span>
                        {this.renderBases()}
                    </div>
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.baseName) errors.baseName = true;

    return errors;
}

const formWrapped = reduxForm({
    form: 'addBase',
    validate
})(Base);

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        categories: state.adminData.categories,
    }
}

export default connect(mapStateToProps, { getAllCategory })(formWrapped);