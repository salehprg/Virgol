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
        <div className="relative sm:col-span-4 col-span-2 w-full text-right rounded-xl bg-pinkish py-4 px-6">
            <p className="text-3xl text-white my-2">{props.userInfo.firstName} {props.userInfo.lastName}</p>
            {(props.userDetail ?
                <p className="text-white my-2">مدیر مدارس {props.userDetail.schooltypeName} استان خراسان رضوی</p>
                : ""
                )}
            <Particles className="absolute top-0 bottom-0 right-0 left-0" params={particles} />
        </div>
    );

}

export default Hero;