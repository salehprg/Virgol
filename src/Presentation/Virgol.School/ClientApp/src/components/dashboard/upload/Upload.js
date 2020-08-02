import React from 'react';
import {excel} from "../../../assets/icons";

class Upload extends React.Component {

    render() {
        return (
            <div className="w-full flex flex-col items-center">
                {excel("w-1/4 text-green")}
                <span className="text-grayish my-2">فایل را کشیده و رها کنید</span>
                <label className="px-10 cursor-pointer py-1 rounded-full text-white bg-dark-green" htmlFor="area">جست و جو</label>
                <input
                    className="hidden"
                    type="file"
                    id="area"
                />
            </div>
        );
    }

}

export default Upload;