import React from 'react';
import {MyViolet} from '../../../assets/colors'
import Fade from 'react-reveal/Fade'

const SchoolManagement = () => {

    return(
        <div className="row tw-my-5">

            <Fade right cascade>
                <div className="col-lg-6 col-sm-12 col-md-12">
                    <div className="text-right tw-my-4" style={{fontWeight : 'bold' , fontSize : '25px'}}>سیستم مدیریت مدرسه</div>
                    <div className="text-right tw-my-4">این بخش از سامانه به منظور مدیریت مدارس و کلاس‌های آنلاین طراحی شده است.
                        مدیر مدرسه در این بخش از سامانه به تدوین و زمان بندی کلاس‌ها میپردازد. دانش آموزان و دبیران زمان کلاس‌های خود را
                        مشاهده می‌کنند و می‌توانند مستقیما وارد کلاس مجازی شوند.
                    </div>
                    <br/>
                    <button className="btn tw-my-4" style={{backgroundColor : `${MyViolet}` ,color : 'white' ,borderRadius:20}}>ادامه</button>
                    <div className="text-right tw-my-4" style={{fontWeight : 'bold' , fontSize : '25px'}}>سیستم مدیریت دروس</div>
                    <div className="text-right tw-my-4">
                        فعالیت‌های درسی دانش آموزان نیازمند زمان بندی و نظارت دبیران است.
                        بنابراین دانش آموزان پس از ثبت نام، مسیر مشخصی را طی می‌کنند.
                        دبیران اهداف آموزشی خود را پیاده می‌کنند. این بخش دارای امکاناتی از جمله بارگذاری فایل درسی،
                        ایجاد تکلیف، برگزاری آزمون، اعطای نمره و شایستگی، تالار اعلانات، تقویم آموزشی و... است.
                    </div>
                </div>
            </Fade>

            <Fade left>
                <div className="col-lg-6 col-sm-12 col-md-12 tw-my-5 text-center">
                    <img src="./pic/schoolManaging.png" width="90%" alt="مدیریت مدارس"/>
                </div>
            </Fade>
        </div>
    )
}

export default SchoolManagement;