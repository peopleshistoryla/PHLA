import React from 'react';
import Page from './components/Page'
export default class SubmitStory extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Page>
                <h1 className="headerBox">Submit Your Story</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, ipsum eos. Totam fugit dolor laborum! Eaque expedita earum aliquam ex, nisi, quae deserunt explicabo eveniet perferendis id maxime alias ea.</p>
            </Page>            
        )
    }
}