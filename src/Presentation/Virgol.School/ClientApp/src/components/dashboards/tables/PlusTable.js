import React from "react";
import Searchish from "../../field/Searchish";
import Tablish from "./Tablish";
import {loading} from "../../../assets/icons";

class PlusTable extends React.Component {

    render() {
        const { isLoading, query, changeQuery, button, excel, handleExcel, title, headers, body } = this.props
        return (
            <div className="w-full">
                <div className="flex sm:flex-row-reverse flex-col justify-start sm:items-stretch items-end mb-4">
                    <Searchish
                        className="w-full max-w-250 ml-4 sm:mb-0 mb-4"
                        query={query}
                        changeQuery={changeQuery}
                    />
                    {button()}
                    {excel ?
                        <>
                            <label htmlFor="excel" className="px-6 cursor-pointer mx-4 py-1 border-2 border-greenish text-greenish rounded-lg">{excel}</label>
                            <input
                                onChange={(e) => handleExcel(e.target.files[0])}
                                type="file"
                                id="excel"
                                className="hidden"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            />
                        </>
                        :
                        null
                    }
                </div>

                <div className="w-full relative rounded-xl bg-dark-blue px-6 py-2 min-h-70">
                    <p className="text-right text-white mt-2 mb-6">{title}</p>
                    {isLoading ?
                        loading('w-10 text-grayish centerize')
                        :
                        <Tablish
                            headers={headers}
                            body={body}
                        />
                    }
                </div>
            </div>
        );
    }

}

export default PlusTable;