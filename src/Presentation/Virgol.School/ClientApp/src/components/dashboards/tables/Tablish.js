import React from "react";

const Tablish = ({ headers, body }) => {

    return (
        <div dir="rtl" className="w-full overflow-auto">
            <table dir="rtl" className="w-full table-auto text-white">
                <thead className="border-b-2 border-grayish">
                    <tr>
                    {headers.map(header => {
                        return <th key={header} className="text-right pb-4">{header}</th>
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