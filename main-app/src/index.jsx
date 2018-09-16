import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import About from './About';
import Contributors from './Contributors';
import SubmitStory from './SubmitStory';
import NeighborhoodTimeline from './NeighborhoodTimeline';
import StoryDetail from './StoryDetail';
import Page from './components/Page';
import Scan from './Scan';

const Page404 = ({location}) => {
    return(
        <Page>
        <h1>404</h1>
        </Page>
    )
}

const PageError = ({location}) => {
    return(

        <Page>
            <h1>Sorry, we couldn't fulfill that request right now!</h1>
        </Page>
    )
}

class Main extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <HashRouter>
                <div>
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route exact path="/neighborhood/:id" component={NeighborhoodTimeline} />
                        <Route exact path="/story/:id" component={StoryDetail} />
                        <Route path="/about" component={About} />
                        <Route path="/submit" component={SubmitStory} />
                        <Route path="/contributors" component={Contributors} />
                        <Route path="/error" component={PageError} />
                        <Route path="/scan" component={Scan} />
                        <Route component={Page404} />
                    </Switch>
                </div>
            </HashRouter>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
