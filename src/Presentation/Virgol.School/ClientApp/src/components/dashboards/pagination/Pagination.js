import React from 'react';
import ReactPaginate from 'react-paginate';
import { chevron, chevrons } from "../../../assets/icons";

const Pagination = ({ cardsPerPage, totalCards, paginate, currentPage }) => {

    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="tw-w-full tw-py-2 tw-flex tw-flex-row tw-justify-center tw-items-center">
            <div onClick={() => paginate(1)}>
                {chevrons("tw-w-6 h-6 tw-cursor-pointer tw-text-white tw-transition-all tw-duration-200 hover:tw-text-blueish")}
            </div>
            <ReactPaginate
                forcePage={currentPage - 1}
                pageCount={pageNumbers.length}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                previousLabel={chevron("tw-w-6 h-6 tw-cursor-pointer tw-text-white tw-transition-all tw-duration-200 hover:tw-text-blueish")}
                nextLabel={chevron("tw-w-6 h-6 tw-transform tw-rotate-180 tw-cursor-pointer tw-text-white tw-transition-all tw-duration-200 hover:tw-text-blueish")}
                onPageChange={({ selected }) => paginate(selected + 1)}
                containerClassName="tw-flex tw-flex-row"
                pageClassName="tw-mx-2 tw-text-white"
                activeClassName="tw-text-purplish"
            />
            <div onClick={() => paginate(pageNumbers.length)}>
                {chevrons("tw-w-6 h-6 tw-transform tw-rotate-180 tw-cursor-pointer tw-text-white tw-transition-all tw-duration-200 hover:tw-text-blueish")}
            </div>
        </div>
    );

}

export default Pagination;