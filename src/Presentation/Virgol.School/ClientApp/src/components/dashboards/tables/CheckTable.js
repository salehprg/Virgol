import React from "react";
import OptionBar from "./OptionBar";
import HeaderCheckbox from "./HeaderCheckbox";

const CheckTable = ({ headers, body, options, checkAll, clearItems, selected }) => {

    return (
        <div dir="rtl" className="w-full overflow-auto">
            {selected.length !== 0 ? <OptionBar options={options} clear={clearItems} selectedItems={selected} /> : null}
            <table dir="rtl" className="w-full table-auto text-white min-w-700">
                <thead className="border-b-2 border-grayish">
                <tr>
                    <th>
                        <div className="flex justify-center items-center">
                            <HeaderCheckbox
                                selected={selected}
                                selectAll={checkAll}
                                clear={clearItems}
                            />
                        </div>
                    </th>
                    {headers.map(header => {
                        return <th className="text-right pb-4">{header}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {body()}
                </tbody>
            </table>
        </div>
    );

}

export default CheckTable;