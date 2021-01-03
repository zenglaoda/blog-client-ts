import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { message } from 'antd';
import store from '@/redux';
import Main from '@/pages/main';
import './assets/style/app.less';

message.config({
  maxCount: 3
});

class App extends React.Component{
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" component={Main} />
            <Route render={()=>(<div>404</div>)} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
