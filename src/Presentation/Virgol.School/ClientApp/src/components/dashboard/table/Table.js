import React from 'react';
import HeaderCheckbox from "./HeaderCheckbox";
import OptionBar from "./OptionBar";

class Table extends React.Component {

    renderHeaders = () => {
        return this.props.headers.map((header, i) => {
            return <th key={i}>{header}</th>
        })
    }

    render() {
        return (
            <div className="w-full py-4 bg-white overflow-auto">
                {this.props.selected.length !== 0 ? <OptionBar options={this.props.options} clear={this.props.clearItems} selectedItems={this.props.selected} /> : null}
                <table dir="rtl" className="table-auto w-full min-w-700">
                    <thead>
                        <tr>
                            <th>
                                <div className="flex justify-center items-center">
                                    <HeaderCheckbox
                                        selected={this.props.selected}
                                        selectAll={this.props.checkAll}
                                        clear={this.props.clearItems}
                                    />
                                </div>
                            </th>
                            {this.renderHeaders()}
                        </tr>
                    </thead>

                    <tbody>
                        {this.props.children}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default Table;