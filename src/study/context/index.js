import React from 'react';
import ReactDOM from 'react-dom';

const ThemeContext = React.createContext('light');

class Theme extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return (
      <button>
        {this.context}
      </button>
    );
  }
}
ThemedButton.contextType = ThemeContext;
export default Theme;