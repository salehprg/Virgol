import React, { useState } from "react";

const Hero = (props) => {

    const [service, setService] = useState("connect")

    const changeService = (service) => {
        setService(service);
    }

    return (
        <div className="relative w-full text-center rounded-xl py-4 px-6">
            {/*<Particles className="absolute top-0 bottom-0 right-0 left-0" params={particles} />*/}
            <p className="text-3xl text-white my-2">{props.userInfo.firstName} {props.userInfo.lastName}</p>
            <a href="https://webmail.legace.ir/" className="text-md text-white my-2" style={{color : "#60b5ff"}}>{props.userInfo.email}</a>
            {(props.adminTitle ?
                <p className="text-white my-2">{props.adminTitle}</p>
            : ""
            )}

            {(props.managerTitle ?
                <p className="text-white my-2">{props.managerTitle}</p> : "")}

            {(props.userTitle ?
                <>
                    <p className="text-white my-2">{` مدرسه ${props.userTitle} ${props.userDetail.userDetail.school.schoolName}`}</p> 
                </>
                : "")}
                
            { props.isTeacher && 
            <div className="flex flex-row items-center my-2 w-full justify-center">
            <span onClick={() => changeService('bbb')} className={`mx-2 cursor-pointer px-3 py-1 border-2 rounded-md ${service === 'bbb' ? 'border-blue-500 text-blue-500' : 'border-grayish text-grayish'}`}>BigBlueButton</span>
            <span onClick={() => changeService('connect')} className={`mx-2 cursor-pointer px-3 py-1 border-2 rounded-md ${service === 'connect' ? 'border-greenish text-greenish' : 'border-grayish text-grayish'}`}>Adobe Connect</span>
        </div>}
        </div>
    );

}

export default Hero;