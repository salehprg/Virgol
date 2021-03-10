import React from "react";

const Tablish = ({ headers, body }) => {

    return (
        <div dir="rtl" className="tw-w-full tw-overflow-auto">
            <table dir="rtl" className="tw-w-full tw-table-auto tw-text-white">
                <thead className="tw-border-b-2 tw-border-grayish">
                    <tr>
                    {headers.map(header => {
                        return <th key={header} className="tw-text-right tw-pb-4 tw-px-4">{header}</th>
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

export default Tablish;