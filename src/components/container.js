require('normalize.css');
require('styles/App.scss');

import React from 'react';
import SvgContainer from './svgContainer';
import Contact from './contact';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="container">
        <SvgContainer fill="#d84141" id="pen3" svg="svg/pen3" classname="pen3 res" title="Pen3"></SvgContainer>
        <SvgContainer fill="#1d332f" id="happy" svg="svg/happy" classname="happy res" title="Happy"></SvgContainer>
        <SvgContainer fill="#e0ddc0" id="holidays" svg="svg/holidays" classname="holidays res" title="Holidays"></SvgContainer>
        <SvgContainer fill="#1d332f" id="pen2" svg="svg/pen2" classname="pen2 res" title="Pen1"></SvgContainer>
        <SvgContainer fill="#d84141" id="and" svg="svg/&" classname="and res" title="And"></SvgContainer>
        <SvgContainer fill="#e0ddc0" id="two" svg="svg/two" classname="two res number" title="Two"></SvgContainer>
        <SvgContainer fill="#d84141" id="zero" svg="svg/zero" classname="zero res number" title="Zero"></SvgContainer>
        <SvgContainer fill="#4c3356" id="one" svg="svg/one" classname="one res number" title="One"></SvgContainer>
        <SvgContainer fill="#d84141" id="six" svg="svg/six" classname="six res number" title="Six"></SvgContainer>
        <SvgContainer fill="#4c3356" id="pen1" svg="svg/pen1" classname="pen1 res" title="Pan"></SvgContainer>
        <Contact/>
      </div>
    );
  }
}

export default AppComponent;
