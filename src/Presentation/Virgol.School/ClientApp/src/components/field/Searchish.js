import React from "react";
import {search} from "../../assets/icons";

const Searchish = ({ className, query, changeQuery }) => {

    return (
        <div className={`flex flex-row-reverse items-center px-2 py-1 rounded-lg border border-purplish ${className}`}>
            {search('w-8 text-purplish transform rotate-90')}
            <input
                className="w-full h-full bg-transparent px-2 text-white placeholder-purplish focus:outline-none"
                type="text"
                dir="rtl"
                placeholder="جست و جو"
                value={query}
                onChange={e => changeQuery(e.target.value)}
            />
        </div>
    );

}

export default Searchish;