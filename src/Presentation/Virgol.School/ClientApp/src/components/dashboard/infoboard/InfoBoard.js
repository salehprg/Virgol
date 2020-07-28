import React from 'react';
import Particles from "react-particles-js";

const InfoBoard = (props) => {

    const particles = {
        particles: {
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 400
                }
            }
        }
    }

    const { userInformation, category, isManager } = props.user
    return (
        <div className="w-full relative text-center py-12 px-2 rounded-lg bg-blueish">
            <Particles className="absolute top-0 bottom-0 right-0 left-0" params={particles} />
            <span className="block text-white text-xl">{userInformation.firstName + " " + userInformation.lastName}</span>
            <span className="block text-white text-sm">{props.isManager ? 'مدیر' : category.name}</span>
            <span className="block text-golden mt-8 text-lg">شهید هاشمی نژاد 1</span>
        </div>
    );

}

export default InfoBoard;