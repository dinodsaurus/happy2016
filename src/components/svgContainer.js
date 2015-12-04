import React from 'react';
import MathShape from '../common/mathshape';

class SvgComponent extends React.Component {
  getInitalState(){
    return {
      mathshape: ''
    }
  }
  componentDidMount(){
    this.renderSvg();
    const mathshape = new MathShape('#' + this.props.id, this.props.svg);
    this.setState({mathshape: mathshape});
    if(this.props.fill){
      mathshape.setFill(this.props.fill);
    }
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  handleResize(){
    this.state.mathshape.calculateFactors();
  }
  renderSvg(){
    // Until React fully supports svg we simply append the svg portion after
     // React has rendered the component.
     var e = this.refs.svg;
     e.innerHTML = '<svg id="' + this.props.id + '" title="' + this.props.title + '"' +
       'width="100%"' +
       'enable-background="0 0 1000 1000"' +
       'xmlns:xlink="http://www.w3.org/1999/xlink"' +
       'xml:space="preserve"' +
       'style="fill-rule:non-zero;clip-rule:nonzero;stroke-linejoin:round;stroke-miterlimit:1.41421;">' +
     '</svg>';
  }
  render() {
    return (
      <div className={this.props.classname} ref="svg"></div>
    );
  }
}

export default SvgComponent;
