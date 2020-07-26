import React from 'react';
import {arrow, doubleArrow} from "../../../assets/icons";

const Pagination = ({ cardsPerPage, totalCards, paginate, currentPage }) => {

    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="w-full py-2 flex flex-row justify-center items-center">
            <div onClick={() => paginate(1)}>
                {doubleArrow("w-6 h-6 transform rotate-180 cursor-pointer text-dark-blue transition-all duration-200 hover:text-blueish")}
            </div>
            <div onClick={() => paginate(currentPage === 1 ? 1 : currentPage - 1)}>
                {arrow("w-6 h-6 transform rotate-180 cursor-pointer text-dark-blue transition-all duration-200 hover:text-blueish")}
            </div>
            {pageNumbers.map(num => (
                <span
                    onClick={() => paginate(num)}
                    className={`text-xl px-2 cursor-pointer transition-all duration-200 hover:text-blueish ${currentPage === num ? 'text-blueish' : 'text-dark-blue'}`}
                    key={num}
                >
                    {num}
                </span>
            ))}
            <div onClick={() => paginate(currentPage === pageNumbers.length ? pageNumbers.length : currentPage + 1)}>
                {arrow("w-6 h-6 cursor-pointer text-dark-blue transition-all duration-200 hover:text-blueish")}
            </div>
            <div onClick={() => paginate(pageNumbers.length)}>
                {doubleArrow("w-6 h-6 cursor-pointer text-dark-blue transition-all duration-200 hover:text-blueish")}
            </div>
        </div>
    );

}

export default Pagination;