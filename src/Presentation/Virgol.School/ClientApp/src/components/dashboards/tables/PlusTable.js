import React from "react";
import Searchish from "../../field/Searchish";
import Tablish from "./Tablish";
import {loading} from "../../../assets/icons";
import Pagination from "../pagination/Pagination";

class PlusTable extends React.Component {

    render() {
        const { isLoading, cardsPerPage, totalCards, paginate, currentPage, query, changeQuery, sample, sampleLink, button, excel, handleExcel, title, headers, body } = this.props
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
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            />
                        </>
                        :
                        null
                    }
                    {sample ? 
                         <a href={sampleLink} className="px-6 cursor-pointer py-1 border-2 border-redish text-redish rounded-lg" download>
                             {sample}
                         </a>
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
                <Pagination
                    cardsPerPage={cardsPerPage}
                    totalCards={totalCards}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        );
    }

}

export default PlusTable;