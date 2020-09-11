import React from "react";
import { Link } from "react-router-dom";
import getColor from "../../../../assets/colors";

const ClassCard = ({ id, title, school, nameOfClass }) => {

    return (
        <div className={`py-8 mx-4 rounded-lg bg-${getColor(id)}`}>
            <p className="text-center text-white text-2xl font-vb">{title}</p>
            <p className="text-white text-center">{school + " - " + nameOfClass}</p>
            <div className="flex flex-row justify-evenly mt-6">
                <Link className="w-5/12 py-1 text-center text-white" to={`/session/${id}`}>دفتر نمره</Link>
                <Link className="w-5/12 py-1 text-center text-white" to={`/recordedSession/${id}`}>لیست جلسات</Link>
            </div>
        </div>
    );

}

export default ClassCard;