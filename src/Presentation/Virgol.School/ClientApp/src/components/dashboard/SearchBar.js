import React from 'react';
import {glass} from "../../assets/icons";

const SearchBar = (props) => {

    const changeQuery = query => {
        props.search(query);
    }

    return (
        <div className={`border border-grayish px-2 rounded-full flex flex-row-reverse items-center ${props.className}`}>
            {glass("w-8 text-grayish transform rotate-90")}
            <input
                className="w-full h-full px-2 bg-transparent focus:outline-none"
                dir="rtl"
                type="text"
                onChange={e => changeQuery(e.target.value)}
                value={props.query}
                placeholder="جست و جو..."
            />
        </div>
    );

}

export default SearchBar;