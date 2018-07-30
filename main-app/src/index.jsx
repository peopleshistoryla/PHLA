import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import About from './About';
import Contributors from './Contributors';
import SubmitStory from './SubmitStory';

const Page404 = ({location}) => {
    return(
        <h1>404</h1>
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
                        <Route path="/about" component={About} />
                        <Route path="/submit" component={SubmitStory} />
                        <Route path="/contributors" component={Contributors} />
                        <Route component={Page404} />
                    </Switch>
                </div>
            </HashRouter>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
