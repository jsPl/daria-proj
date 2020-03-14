import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
            </Switch>
        </Router>
    );
}

export default App;
