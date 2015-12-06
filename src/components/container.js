require('normalize.css');
require('styles/App.scss');

import React from 'react';
import SvgContainer from './svgContainer';
import Contact from './contact';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="container">
        <SvgContainer fill="#d84141" id="pan1" svg="svg/pan1" classname="pan1 res" title="Pan"></SvgContainer>
        <SvgContainer fill="#1d332f" id="happy" svg="svg/happy" classname="happy res" title="Happy"></SvgContainer>
        <SvgContainer fill="#e0ddc0" id="holidays" svg="svg/holidays" classname="holidays res" title="Holidays"></SvgContainer>
        <SvgContainer fill="#d84141" id="and" svg="svg/&" classname="and res" title="And"></SvgContainer>
        <SvgContainer fill="#e0ddc0" id="two" svg="svg/two" classname="two res number" title="Two"></SvgContainer>
        <SvgContainer fill="#d84141" id="zero" svg="svg/zero" classname="zero res number" title="Zero"></SvgContainer>
        <SvgContainer fill="#4c3356" id="one" svg="svg/one" classname="one res number" title="One"></SvgContainer>
        <SvgContainer fill="#d84141" id="six" svg="svg/six" classname="six res number" title="Six"></SvgContainer>
        <Contact/>
      </div>
    );
  }
}

export default AppComponent;
