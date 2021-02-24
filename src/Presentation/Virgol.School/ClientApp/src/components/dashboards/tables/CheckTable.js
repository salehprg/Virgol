import React from "react";
import OptionBar from "./OptionBar";
import HeaderCheckbox from "./HeaderCheckbox";

const CheckTable = ({ headers, body, options, checkAll, clearItems, selected }) => {

    return (
        <div dir="rtl" className="tw-w-full tw-overflow-auto">
            {selected.length !== 0 ? <OptionBar options={options} clear={clearItems} selectedItems={selected} /> : null}
            <table dir="rtl" className="tw-w-full tw-table-auto tw-text-white tw-min-w-700">
                <thead className="tw-border-b-2 tw-border-grayish">
                <tr>
                    <th>
                        <div className="tw-flex tw-justify-center tw-items-center">
                            <HeaderCheckbox
                                selected={selected}
                                selectAll={checkAll}
                                clear={clearItems}
                            />
                        </div>
                    </th>
                    {headers.map(header => {
                        return <th className="tw-text-right tw-px-4 tw-pb-4">{header}</th>
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