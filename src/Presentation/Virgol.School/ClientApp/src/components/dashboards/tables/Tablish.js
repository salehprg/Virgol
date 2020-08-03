import React from "react";

const Tablish = ({ headers, body }) => {

    return (
        <div dir="rtl" className="w-full overflow-auto">
            <table dir="rtl" className="w-full table-auto text-white min-w-700">
                <thead className="border-b-2 border-grayish">
                    {headers.map(header => {
                        return <th className="text-right pb-4">{header}</th>
                    })}
                </thead>
                <tbody>
                    {body()}
                </tbody>
            </table>
        </div>
    );

}

export default Tablish;