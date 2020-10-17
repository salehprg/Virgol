import React from 'react';
import ReactPaginate from 'react-paginate';
import { chevron, chevrons } from "../../../assets/icons";

const Pagination = ({ cardsPerPage, totalCards, paginate, currentPage }) => {

    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="w-full py-2 flex flex-row justify-center items-center">
            <div onClick={() => paginate(1)}>
                {chevrons("w-6 h-6 cursor-pointer text-white transition-all duration-200 hover:text-blueish")}
            </div>
            <ReactPaginate
                forcePage={currentPage - 1}
                pageCount={pageNumbers.length}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                previousLabel={chevron("w-6 h-6 cursor-pointer text-white transition-all duration-200 hover:text-blueish")}
                nextLabel={chevron("w-6 h-6 transform rotate-180 cursor-pointer text-white transition-all duration-200 hover:text-blueish")}
                onPageChange={({ selected }) => paginate(selected + 1)}
                containerClassName="flex flex-row"
                pageClassName="mx-2 text-white"
                activeClassName="text-purplish"
            />
            <div onClick={() => paginate(pageNumbers.length)}>
                {chevrons("w-6 h-6 transform rotate-180 cursor-pointer text-white transition-all duration-200 hover:text-blueish")}
            </div>
        </div>
    );

}

export default Pagination;