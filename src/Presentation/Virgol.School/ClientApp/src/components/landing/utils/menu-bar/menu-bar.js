import React from 'react';
import './menu-bar.css'
import {MyBabyPowder} from '../../../../assets/colors'

class MenuBar extends React.Component{
    state={
        items:[
            {
                id : 0 ,
                title : "صفحه اصلی" ,
                link : "#"
            } , 
            {
                id : 1 ,
                title : "اجزای سامانه" ,
                link : "#"
            } , 
            {
                id : 2 ,
                title : "درباره ما" ,
                link : "#"
            } , 
            {
                id : 3 ,
                title : "همکاری با ما" ,
                link : "#"
            } , 
            {
                id : 4 ,
                title : "وبلاگ" ,
                link : "#"
            }
        ]
    }

    render(){
        return(
            <nav className="navbar fixed-top navbar-expand-lg navbar-light" style={{backgroundColor: `${MyBabyPowder}`}}>
                <a className="navbar-brand" href="#">
                    <img src="./logo.svg" width="40" height="40" alt="logo"/>
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        {
                            this.state.items.map((item) => (
                                <li className="nav-item" key={item.id}>
                                    <a className="nav-link my-link mx-3" href={item.link}>{item.title}</a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </nav>
        )
    }
}

export default MenuBar;