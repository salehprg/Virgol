import React from "react";
import Particles from "react-particles-js";

const particles = {
    particles: {
        "number": {
            "value": 300,
            "density": {
                "enable": false
            }
        },
        "size": {
            "value": 5,
            "random": true,
            "anim": {
                "speed": 4,
                "size_min": 0.3
            }
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "random": true,
            "speed": 1,
            "direction": "top",
            "out_mode": "out"
        }
    },
}

const Hero = (props) => {

    return (
        <div className="relative w-full text-right rounded-xl bg-pinkish py-4 px-6">
            <Particles className="absolute top-0 bottom-0 right-0 left-0" params={particles} />
            <p className="text-3xl text-white my-2">{props.userInfo.firstName} {props.userInfo.lastName}</p>
            {(props.adminTitle ?
                <p className="text-white my-2">{props.adminTitle}</p>
            : ""
            )}

            {(props.managerTitle ?
                <p className="text-white my-2">{props.managerTitle}</p> : "")}
                
            
        </div>
    );

}

export default Hero;