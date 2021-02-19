import React from 'react';
import './menu-bar.css'
import {MyBabyPowder, MySeaGreen, MyViolet} from '../../../../assets/colors'
import { Link } from 'react-router-dom';

class MenuBar extends React.Component{
    constructor(props){
        super(props);

        this.listener = null

        this.state={
            status : "top" ,
            menu : null ,

            items:[
                {
                    id : 0 ,
                    title : "صفحه اصلی" ,
                    link : "#"
                } , 
                {
                    id : 1 ,
                    title : "اجزای سامانه" ,
                    link : `#${this.props.section}`
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
                } 
            ]
        }
    }

    componentDidMount(){
        this.setState({menu : document.getElementById('menu')})

        this.listener = document.addEventListener("scroll" , e => {
            var scrolled = window.scrollY;
            

            if(scrolled >= 300){
                if(this.state.status !== 'unTop'){
                    this.setState({status : 'unTop'})
                }
            }
            else{
                if(this.state.status !== 'top'){
                    this.setState({status : 'top'})
                }
            }


            // if(this.state.menu !== null){
                if(scrolled >= 800){
                    this.state.menu.classList.remove('fixed-top')
                }
                else{
                    this.state.menu.classList.add('fixed-top')
                }
            // }
        })
    }

    componentDidUpdate(){
        document.removeEventListener("scroll" , this.listener)
    }

    render(){
        
        return(
            <nav className="navbar fixed-top navbar-expand-lg navbar-light" id="menu" style={{
                backgroundColor: this.state.status === 'top' ? `${MyBabyPowder}` : `${MySeaGreen}` ,
                opacity : '0.9' ,
                transition : '0.5s'
                }}>
                <a className="navbar-brand" href="#">
                    <img src="./logo.svg" width="70" height="70" alt="logo"/>
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".toggling" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="toggling collapse w-100 navbar-collapse">
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

                <div className="toggling collapse navbar-collapse w-100 order-1 order-md-0 dual-collapse2">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/">
                                <button className="btn" style={{backgroundColor:`${MyViolet}` , color : 'white'}}>ورود</button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )

        
    }
}

export default MenuBar;