import React from 'react'

export default class Timeline extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedIndex: this.props.startingIndex,
            values: this.props.values
        }
    }



    render(){
        return(
            <div className="timeline">
                {this.state.values.map((val, idx) => {
                    let classId = "timeline-date";
                    if(idx === this.state.selectedIndex){
                        classId += " timeline-selected";
                    }
                    return <div className={classId} onClick={()=> {
                        this.setState({ selectedIndex: idx})
                        this.props.onTimelineSelect(idx)}
                    }>{val}</div>
                })}
            </div>
        )
    }
}