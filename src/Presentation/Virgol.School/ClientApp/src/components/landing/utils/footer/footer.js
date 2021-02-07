import React from 'react';
import './footer.css'
import {MySpaceCadet} from '../../../../assets/colors'
const Footer = () => {
    return(
        <div className="footer" style={{backgroundColor : `${MySpaceCadet}`}}>
            <div className="row justify-content-center mt-5 py-5">
                
                <div className="align-self-center col-lg-3 col-sm-12 col-md-12">
                    <div className="link text-right mr-5">درباره ما</div>
                    <br/>
                    <div className="link text-right mr-5">تماس با ما</div>
                    <br/>
                    <div className="link text-right mr-5">مشارکت در فروش</div>
                    <br/>
                    <div className="link text-right mr-5">فرصت های شغلی</div>
                </div>
                <div className="align-self-center col-lg-3 col-sm-12 col-md-12">
                    <div className="link text-right mr-5 mt-4">وبلاگ</div>
                    <br/>
                    <div className="link text-right mr-5 mb-5">معرفی اجزای سامانه</div>
                </div>

                <div className="align-self-center col-lg-3 col-sm-12 col-md-12">
                    <img src="./logo.svg" width="30%" className="mx-auto mb-6"/>
                </div>
            
            </div>
        </div>
    )
}

export default Footer;