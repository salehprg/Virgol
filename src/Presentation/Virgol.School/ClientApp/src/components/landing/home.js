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
import { MyBabyPowder, MySeaGreen } from '../../assets/colors';
import {arrowUp} from '../../assets/icons'
import ReactTooltip from 'react-tooltip'
import Fade from 'react-reveal/Fade'

const LandingHome = () => {

    // var button = document.getElementById('goToTop')

    // window.onscroll = function(){scrollFunction()};

    // const scrollFunction = () => {
    //         if(window.scrollY > 800){
    //             document.getElementById('goToTop').style.display = 'block'
    //         }
    //         else{
    //             document.getElementById('goToTop').style.display = 'none'
    //         }
    //     // }
    // }

    const style = {
        display : 'block' ,
        position : 'fixed' ,
        bottom : '20px' ,
        right : '30px' ,
        zIndex : '99' ,
        backgroundColor : `${MySeaGreen}` ,
        color : 'white' ,
    }
    

    return(
        <div dir="rtl" style={{backgroundColor : `${MyBabyPowder}`}} className="px-3 my-4">
            <div>
                
                <MenuBar section="ajza"/>
                <br/><br/>

                <button 
                    data-tip="بالای صفحه"
                    data-for="top"
                    className="btn w-12 h-12 rounded-full" 
                    style={style}
                    onClick={() => {document.documentElement.scrollTop=0}} 
                    id="goToTop">
                    {arrowUp('w-6 centerize')}
                </button>

                <ReactTooltip id="top" place='top' effect='float' type='dark'/>

                <div className="row my-4 mx-4">
                    <Fade right>
                        <div className = "col-lg-6 col-sm-12 col-md-12">
                            <LandingEntry/>
                        </div>
                    </Fade>

                    <Fade left>
                        <div className="col-lg-6 col-sm-12 col-md-12">
                            <img src="./pic/vector.png" width="100%" alt="virgool"/>
                        </div>
                    </Fade>
                </div>
                <br/>
                <Fade top>
                    <div className="row my-5">
                        <div id="ajza" className="col-12 text-center" style={{fontWeight:'bold' , fontSize:'30px'}}>اجزای سامانه ویرگول</div>
                    </div>
                </Fade>
            
                
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