import React from "react";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Bases from "./Bases";
import Courses from "./Courses";
import Teachers from "./Teachers";
import '../../../assets/main.css'
import Students from "./Students";

class AdminDashboard extends React.Component {

    state = { activePanel: 'home' , Category : null}
    

    toggleActive = (option) => {
        this.setState({ activePanel: option , Category : null});
    }

    callBackFunction = (categoryId , View) =>
    {
        this.setState({activePanel : View , Category : categoryId});
    }

    renderPanel = () => {
        switch (this.state.activePanel) {
            case "home": return <Home />;
            case "bases": return <Bases setInParent={this.callBackFunction}/>;
            case "courses": return <Courses Category={this.state.Category}/>;
            case "teachers": return <Teachers />;
            case "students": return <Students />;
            default: return null;
        }
    }

    render() {
        return (
            <div className="">
                <Sidebar
                    toggleActive={this.toggleActive}
                    activePanel={this.state.activePanel}
                />
                <div className="bg-lbg md:w-5/6 w-full min-h-screen">
                    <div className="flex flex-col md:flex-row justify-around items-center mb-12 py-4">
                        <span className="text-pri text-2xl">سامانه آموزش مجازی</span>
                        <input
                            className="rtl md:w-1/3 w-5/6 mt-8 md:mt-0 bg-transparent border-2 border-pri rounded-full pr-2 py-2 focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="جستجو..."
                        />
                    </div>
                    <div className="flex justify-center items-start w-full min-h-screen">
                        {this.renderPanel()}
                    </div>
                </div>
            </div>
        );
    }

}

export default AdminDashboard;