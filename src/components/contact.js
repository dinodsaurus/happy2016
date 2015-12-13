import React from 'react';
class Contact extends React.Component {
  render() {
    return (
      <div className="content">
        <div className="block">
          <img src="img/lajna.svg"/>
          <p>All shapes and website designed by  by <a target="_blank" href="http://markohrastovec.com/">Marko Hrastovec</a> with contributions from <a target="_blank" href="http://www.typonine.com/">Nikola Djurek</a> (number 2) and <a target="_blank" href="http://www.hrvojezivcic.com/">Hrvoje Živčić</a> (number 1)</p>
          <p>Made possible by <a target="_blank" href="https://github.com/LettError/responsiveLettering">Erik van Blokland</a></p>
          <p>Implemented by <a target="_blank" href="https://twitter.com/dinodsaurus">Dino Trojak</a></p>
          <img className="second" src="img/lajna.svg"/>
          <a className="github" target="_blank" href="https://github.com/dinodsaurus/happy2016">
            <img src="img/gg.png"/>
          </a>
        </div>
      </div>
    );
  }
}

export default Contact;
