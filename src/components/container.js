require('normalize.css');
require('styles/App.css');

import React from 'react';
import SvgContainer from './svgContainer';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="container">
        <SvgContainer fill="#1d332f" id="happy" svg="svg/happy" classname="happy" title="Happy"></SvgContainer>
        <SvgContainer fill="#e0ddc0" id="holidays" svg="svg/holidays" classname="holidays" title="Holidays"></SvgContainer>
      </div>
    );
  }
}

export default AppComponent;
