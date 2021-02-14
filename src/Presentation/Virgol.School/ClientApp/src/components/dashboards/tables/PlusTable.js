import React from "react";
import Searchish from "../../field/Searchish";
import Tablish from "./Tablish";
import {loading} from "../../../assets/icons";
import Pagination from "../pagination/Pagination";
import ReactTooltip from "react-tooltip";

class PlusTable extends React.Component {

    render() {
        const { isLoading, searchable, cardsPerPage, totalCards, paginate, currentPage, query, changeQuery, sample, sampleLink, button, excel, handleExcel, title, headers, body , isPaginate = true} = this.props
        return (
            <div className="tw-w-full">
                <div className="tw-flex sm:tw-flex-row-reverse tw-flex-col tw-justify-start sm:tw-items-start tw-items-end tw-mb-4">
                    {searchable ?
                        <Searchish
                            className="tw-w-full tw-max-w-250 tw-ml-4 sm:tw-mb-0 tw-mb-4"
                            query={query}
                            changeQuery={changeQuery}
                        />
                        :
                        null
                    }
                    {button()}
                    {excel ?
                        <>
                            <label htmlFor="excel" className="tw-px-6 tw-cursor-pointer tw-ml-4 tw-mb-4 tw-py-1 tw-border-2 tw-border-greenish tw-text-greenish tw-rounded-lg">{excel}</label>
                            <input
                                onChange={(e) => handleExcel(e.target.files[0])}
                                type="file"
                                id="excel"
                                className="tw-hidden"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            />
                        </>
                        :
                        null
                    }
                    {sample ? 
                         <a href={sampleLink} className="tw-px-6 tw-cursor-pointer tw-mb-4 tw-py-1 tw-border-2 tw-border-redish tw-text-redish tw-rounded-lg" download>
                             {sample}
                         </a>
                    : 
                    null
                    }
                </div>

                <div className="tw-w-full tw-relative tw-rounded-xl tw-bg-dark-blue tw-px-6 tw-py-2 tw-min-h-70">
                    <p className="tw-text-right tw-text-white tw-mt-2 tw-mb-6">{title}</p>
                    {isLoading ?
                        loading('tw-w-10 tw-text-grayish centerize')
                        :
                        <Tablish
                            headers={headers}
                            body={body}
                        />
                    }
                </div>
                {(isPaginate ? 
                    <Pagination
                        cardsPerPage={cardsPerPage}
                        totalCards={totalCards}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                : null)}
            </div>
        );
    }

}

export default PlusTable;