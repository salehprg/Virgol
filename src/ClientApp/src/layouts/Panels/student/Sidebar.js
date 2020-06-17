import React from "react";
import {bases, courses, headline, home, logout, students, teachers} from '../../../icons';
import Card from "../../../components/Card";
import {authenticationService} from '../../../_Services/AuthenticationService'
import {userService} from '../../../_Services/UserServices'

class Sidebar extends React.Component {
    constructor (props){
        super(props);
        this.state = {CategoryNames : null , sidebar: true};
      }
    
    async componentDidMount(){
        try
        {
            const Categories = await userService.GetUserCategory();
            if(Categories != false)
            {
            console.log(Categories);
            this.setState({CategoryNames : Categories});
            }
            else
            {
            console.log("false happen")
            }
        }
        catch(e)
        {
            console.log(e);
        } 
    }

    logout = () =>{
        authenticationService.logout();
    }
    
    toggleSidebar = () => {
        this.setState({ sidebar: !this.state.sidebar });
    }

    render() {
        return (
            <div className={`bg-mbg border-l-4 border-pri md:w-1/6 fixed right-0 min-h-screen  ${(this.state.sidebar ? 'w-200' : 'w-0')}`}>
                <div className="flex flex-col justify-between h-screen">
                    <div className="relative">
                        <svg
                            className="absolute left-next md:hidden block"
                            onClick={this.toggleSidebar}
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#000">
                            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"/>
                        </svg>
                        <div className={`flex flex-col items-center ${(this.state.sidebar ? 'block' : 'hidden')}`}>
                            <span className="text-2xl font-vb mt-8 mb-24 text-pri">صالح ابراهیمیان</span>
                            <div className="w-5/6 h-200">
                                {this.state.CategoryNames ? 
                                    this.state.CategoryNames.map((cat) => {
                                        return (
                                            <Card>
                                                <div className="h-full w-full flex flex-col justify-center" onClick={this.props.setCategory(cat.id)}>
                                                    <span className="my-2">مقطع: {cat.name}</span>
                                                    <span className="my-2">معدل:  {cat.Avverage ? '-' : cat.avverage}</span>
                                                </div>
                                            </Card>
                                        )                                 
                                        })
                                    :
                                            <Card>
                                                <div className="h-full w-full flex flex-col justify-center">
                                                    <span className="my-2">شما هنوز در هیچ مقطعی ثبت نام نکرده اید</span>
                                                </div>
                                            </Card>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={`flex justify-center pb-4 w-full ${(this.state.sidebar ? 'block' : 'hidden')}`}>
                        <a href="#" onClick={() => this.logout()}>{logout('8', '8', '#000')}</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;