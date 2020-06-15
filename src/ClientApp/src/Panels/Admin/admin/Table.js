import React from "react";

class Table extends React.Component {

    render() {
        return (
            <div className="flex flex-col w-full h-full text-right">
                <div className="flex flex-row-reverse justify-between items-center">
                    <span className="text-pri text-2xl mb-2">{this.props.title}</span>
                    {this.props.options}
                </div>
                <div className="w-full text-center h-500 bg-white rtl rounded-lg pt-4 overflow-auto">
                    <table className="w-5/6 m-auto" style={{minWidth: this.props.minWidth}}>
                        {this.props.table()}
                    </table>
                </div>
            </div>
        );
    }

}

export default Table;