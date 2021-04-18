import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { message } from 'antd';
import store from '@/redux';
import Main from '@/pages/main';
import './assets/style/app.less';

// TODO: 优化moment语言包

message.config({
  maxCount: 3
});

class App extends React.Component{
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Main></Main>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#blog-app'));
