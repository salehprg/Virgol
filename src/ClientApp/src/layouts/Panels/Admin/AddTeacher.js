import React from "react";
import Select from 'react-select';
import Card from "../../../components/Card";

const options = [
    { value: 'ریاضی', label: 'ریاضی' },
    { value: 'علوم', label: 'علوم' },
    { value: 'زبان', label: 'زبان' },
];

class AddTeacher extends React.Component {

    state = {
        selectedOption: null,
    };

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    render() {
        const { selectedOption } = this.state;

        return (
            <div className="md:w-1/5 w-5/6 h-500 md:order-1 order-2 md:mt-0 mt-6">
                <Card title="افزودن معلم">
                    <form className="flex flex-col h-full items-center">
                        <input
                            className="border-box border-b my-4 focus:outline-none"
                            type="text"
                            placeholder="نام"
                        />
                        <input
                            className="border-box border-b my-4 focus:outline-none"
                            type="text"
                            placeholder="نام خانوادگی"
                        />
                        <input
                            className="border-box border-b my-4 focus:outline-none"
                            type="number"
                            placeholder="کد ملی"
                        />
                        <input
                            className="border-box border-b my-4 focus:outline-none"
                            type="tel"
                            placeholder="شماره همراه"
                        />
                        <div className="w-5/6 m-auto mt-4">
                            <Select
                                value={selectedOption}
                                onChange={this.handleChange}
                                options={options}
                                isMulti="True"
                                isSearchable="True"
                                placeholder="دروس..."
                            />
                        </div>
                        <input
                            className="bg-pri px-12 py-1 mb-6 text-white rounded-lg focus:outline-none focus:shadow-outline"
                            type="submit"
                            value="افزودن"
                        />
                    </form>
                </Card>
            </div>
        );
    }

}

export default AddTeacher;