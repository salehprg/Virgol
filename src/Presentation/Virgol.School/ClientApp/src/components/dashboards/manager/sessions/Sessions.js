import React from 'react';

class Sessions extends React.Component{
    state={loading : false}

    async componentDidMount(){
        this.setState({loading : true})
        await setTimeout(console.log("s") , 1000)
        this.setState({loading : false})
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}