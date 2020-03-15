import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { Button } from 'antd';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/dashboard/:page?'>
                    <Dashboard />
                </Route>
                <Route path='/button'>
                    <Button type='primary'>Hello world</Button>
                </Route>
                <Route>
                    <Redirect to='/dashboard' />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
