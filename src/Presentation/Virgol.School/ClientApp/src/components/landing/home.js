import React from 'react';
import MenuBar from './utils/menu-bar/menu-bar'
import LandingEntry from './utils/landing-entry'
import SchoolManagement from './utils/school-management'
import OnlineSessions from './utils/online-sessions'
import DistanceLearning from './utils/distance-learning'
import VirgoolAdvantages from './utils/virgool-advantages'
import Useful from './utils/useful-for-organs'
import Sponsers from './utils/sponsers'
import SalesCooperation from './utils/sales-cooperations'
import Footer from './utils/footer/footer'
import { MyBabyPowder } from '../../assets/colors';

const LandingHome = () => {
    return(
        <div dir="rtl" style={{backgroundColor : `${MyBabyPowder}`}} className="App mx-3 my-3">
            <div>
                <MenuBar/>
                <br/><br/>
                <div className="row my-4 mx-4">
                <div className = "col-lg-6 col-sm-12 col-md-12">
                    <LandingEntry/>
                </div>
                <div className="col-lg-6 col-sm-12 col-md-12">
                    <img src="./pic/vector.png" width="100%" alt="virgool"/>
                </div>
                </div>
                <br/>
                <div className="row my-5">
                <h2 className="col-12 text-center" style={{fontWeight:'bold' , fontSize:'30px'}}>اجزای سامانه ویرگول</h2>
                </div>

                <SchoolManagement/>
                <OnlineSessions/>
                <DistanceLearning/>
                <br/><br/><br/>
                <VirgoolAdvantages/>

                <Useful/>
                <Sponsers/>
                <SalesCooperation/>
                <Footer/>
            </div>
        </div>  
    )
}

export default LandingHome;