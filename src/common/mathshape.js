// edits 20151204

// mathImage object
// takes 4 names of svg files
// loads them with snap
// then makes 2 axis interpolation
// that fill the parent box.
// factor 1: width
// factor 2: play

// With thanks to Jérémie Hornus, Nina Stössinger, Nick Sherman, Andrew Johnson, Petr van Blokland and Gerrit Noordzij.

// For the time being, for practical reasons, this is (c) erik van blokland 2015
// Assume this code is a proof of concept and a nice demo. No guarantee for how this code
// holds up under greater loads, heavy files, production or otherwise demanding environments.

import Snap from 'snapsvg';
import $ from 'jquery';

class MathShape {
  constructor(elementId, miURL) {
    this.shapeVersion = '0.4';
  	this.elementId = elementId;
  	this.reporterElementId = '#mathShapeReporter';
  	this.masterPaths = [];
  	this.root = miURL;
  	this.mastersLoaded = [];	// the order in which the masters have actually loaded
  	this.masterBounds = [];		// min max bounds of the masters (we get wrong results from snap)
  	this.sizeFactor = 0.5;			// factor1 width/height ratio
  	this.playFactor = 1.0;			// factor2
  	this.currentLoadIndex = 0;	// keep track of the number of files we loaded
  	this.svgLoaded = false;		// are we done?
  	this.masterData = [];		// all the loaded svg data
  	this.extrapolateMin = 0;	// extrapolate minimum
  	this.extrapolateMax = 1.25;		// extrapolate maximum
  	this.boundsRatio = 0			// ratio of the current bounds
  	this.parentRatio = 0			// ratio of the parent bounds
  	this.shapeFill = 'white';			// default fill color
  	this.shapeStroke = '#000';		// default stroke color
  	this.shapeFillOpacity = 1;		// default fill opacity
  	this.fitHeight = true;			// fit the height of the parent vertically
  	this.alignment = 'right';
  	this.strokeWidth = 2		// default stroke width
  	this.parentWidth = 0;		// whatever the latest width we know of the parent
  	this.parentHeight = 0;		// whatever the latest height we know of the parent
    this.loadFromWeb();
  }
  roundToTwo(num) {
    return +(Math.round(num + 'e+2')  + 'e-2');
  }
  value(v){
    return '<span class="value">'+v+'</span>'
  }
  andomIntFromInterval(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
  }
  loadLocal(data){
    // load the data for this mathShape from the stuff available in this page.
    this.snap = Snap(this.elementId);
    this.masterPaths = data['files'];
    this.masterBounds = data['sizebounds'];
    this.extrapolateMin = data['extrapolatemin'];
    this.extrapolateMax = data['extrapolatemax'];
    this.designspace = 'twobyone';	//data['designspace'];
    this.onLoadedLocal(Snap('#narrow-thin'));
    this.onLoadedLocal(Snap('#wide-thin'));
    this.onLoadedLocal(Snap('#narrow-bold'));
    this.onLoadedLocal(Snap('#wide-bold'));
    this.svgLoaded = true;
    this.calculateFactors();
  }
  loadFromWeb(){
    // load the data for this mathshape from the url
    this.snap = Snap(this.elementId);
    var self = this;	// http://stackoverflow.com/questions/2325866/assigning-scope-amongst-jquery-getjson-and-a-js-class
    var miPath = this.root + '/files.json';
    $.getJSON(miPath, {}, function(data){
      self.masterPaths = data['files'];
      self.masterBounds = data['sizebounds'];
      self.extrapolateMin = data['extrapolatemin'];
      self.extrapolateMax = data['extrapolatemax'];
      self.designspace = 'twobyone';	//data['designspace'];
      if(self.designspace == undefined){
        // if we have no designspace values, then assume it is two by two
        self.designspace = 'twobyone';	//'twobytwo';
      }
      self.loadNextMaster();
    });

    $(this.elementId).click(() =>{
      $(this.elementId).attr('height', '100%')
      self.breathe(0);
    });
  }
  breathe(factor){
    //  redraw with the current size
    // animate the other factor
    this.playFactor = factor;
    if(this.svgLoaded==true){
      this.calculateFactors();
    }
  }
  setFill(color, opacity){
    // set the preferred color and opacity
    this.shapeFill = color;
    if(opacity != undefined ){
      self.shapeFillOpacity = opacity;
    }
  }
  setAligment(alignment) {
    this.alignment = alignment;
  }
  ip(a, b, f){
    return a + f * (b-a);
  }
  fc(a, b, c){
    return (c-a)/(b-a);
  }
  getParentSize(){
    return [$(this.elementId).parent().width(), $(this.elementId).parent().height()];
  }
  loadNextMaster(){
    // load the svg masters, in sequence.
    if(this.currentLoadIndex<this.masterPaths.length){
      Snap.load(this.masterPaths[this.currentLoadIndex], this.onLoaded, this);	// add the !@#$ scope!
    } else {
      this.calculateFactors();
    }
  }
  calculateSize(){
    // calculate the size according to the current factors.
  	// we want to calculate the size based on the masterBounds
  	// because those might be different from the actual bounds
  	// of the shape. (So that the shape can have some margin to
  	// to the edge of the;box.)
  	var currentWidth = 0;
  	var currentHeight = 0;
  	// interpolate the horizontal component fo the masterbounds
  	// the vertical is the same, right?
  	currentWidth = this.ip(this.masterBounds[0][0], this.masterBounds[1][0], this.sizeFactor);
  	currentHeight = this.masterBounds[0][1]
  	return [currentWidth, currentHeight];
  }
  calculateShapeTwoByTwo(){
  	var resultPath = [];
  	// when all masters are loaded
  	if(this.masterData[0]==null){
  		// still loading it seems
  		return;
  	}
  	var ptLength = this.masterData[0].length;
  	for (var i = 0; i < ptLength; i++) {
  		var newCommand = [this.masterData[0][i][0]]; // add the command
  		// iterate through the command args
  		switch(this.masterData[0][i][0]){
  			case 'H':
  				// handle horizontal segment
  				var x1 = this.ip(this.masterData[0][i][1], this.masterData[1][i][1], this.sizeFactor);
  				var x2 = this.ip(this.masterData[2][i][1], this.masterData[3][i][1], this.sizeFactor);
  				var x = this.ip(x1, x2, this.playFactor);
  				newCommand.push(x);
  				break;
  			case 'V':
  				// handle vertical segment
  				var y1 = this.ip(this.masterData[0][i][1], this.masterData[1][i][1], this.sizeFactor);
  				var y2 = this.ip(this.masterData[2][i][1], this.masterData[3][i][1], this.sizeFactor);
  				var y = this.ip(y1, y2, this.playFactor);
  				newCommand.push(y);
  				break;
  			case 'L':
  			default:
  				// handle all the other segments
  				for (var args=1; args<this.masterData[0][i].length-1; args+=2){
  					var x1 = this.ip(this.masterData[0][i][args], this.masterData[1][i][args], this.sizeFactor);
  					var y1 = this.ip(this.masterData[0][i][args+1], this.masterData[1][i][args+1], this.sizeFactor);
  					var x2 = this.ip(this.masterData[2][i][args], this.masterData[3][i][args], this.sizeFactor);
  					var y2 = this.ip(this.masterData[2][i][args+1], this.masterData[3][i][args+1], this.sizeFactor);
  					var x = this.ip(x1, x2, this.playFactor);
  					var y = this.ip(y1, y2, this.playFactor);
  					newCommand.push(x);
  					newCommand.push(y);
  				}
  				break;
  		}
  		// // show the calculated instruction on the page
  		// // show the contributing masters on the page
  		resultPath.push(newCommand);
  	}
  	this.snap.clear()
  	var newPath = this.snap.path(resultPath);
  	var bounds = Snap.path.getBBox(newPath);
  	// paint instructions
  	newPath.attr({'fill': this.shapeFill, 'opacity': this.shapeFillOpacity});
  	this.snap.append(newPath);
  	this.boundsRatio = bounds.width / bounds.height;
  	if(this.boundsRatio<0.99*this.parentRatio){
  		switch(this.alignment){
  			// don't bother calculating the offset, just let our parent know the alignment
  			case 'center':
  				$(this.elementId).parent().attr('align', 'center');
  				break;
  			case 'right':
  				$(this.elementId).parent().attr('align', 'right');
  				break;
  		}
  	}
  	// if the bounds of the resulting shape are not enough to fit the box,
  	// center the image in the box
  	if(this.fitHeight){
  		var currentSize = this.calculateSize();
  		this.snap.attr({ viewBox: '0 0 '+currentSize[0]+' '+currentSize[1]+' ' });
  	}
  }
  onLoadedLocal(data){
    // when an svg is loaded locally
    let outline = data.select('path')
    outline = Snap.parsePathString(outline);
    Snap.path.toAbsolute(outline);
    if(this.masterData==null){
      this.masterData = [];
    }
    this.masterData.push(outline);
    this.currentLoadIndex++;
  }
  onLoaded(data){
    // when a svg is loaded, interpret the data.
    // when everything is loaded, calculate the image.
    let outline = data.select('path')
    outline = Snap.parsePathString(outline);
    Snap.path.toAbsolute(outline);
    if(this.masterData==null){
      this.masterData = [];
    }
    this.masterData.push(outline);
    this.currentLoadIndex++;
    if(this.currentLoadIndex<this.masterPaths.length){
      this.loadNextMaster();
    } else {
      // we're done loading.
      // now make sure this.masterBounds has 2 elements
      // in case all masters share 1 bounds rect,
      // the .json will contain 1 set of values.
      if(this.masterBounds.length==1){
        this.masterBounds.push(this.masterBounds[0]);
      }
      this.svgLoaded = true;
    }
    if (this.svgLoaded){
      this.calculateFactors();
    }
  }
  calculateFactors(){
    //	The svg image height is set to 100%.
    //	Therefor yhe window will scale the image to the right height.
    //	That means that we only have to calculate the appropriate width to fill the box.
    //	Take the width / height ration from the parent, then calculate
    //	the factors needed for the image to get the same ratio.
    var width = $( this.elementId ).parent().outerWidth();
    var height = $( this.elementId ).parent().outerHeight();
    this.parentWidth = width;
    this.parentHeight = height;
    this.parentRatio = width/height; // we need to match this
    // check if we can calculate the factors based on the bounds
    // assume bounds are the same
    var minWidth = this.masterBounds[0][0];
    var maxWidth = this.masterBounds[0][0];
    var minHeight = this.masterBounds[0][1];
    var maxHeight = this.masterBounds[0][1];
    for(var i=1; i<this.masterBounds.length; i+=2){
      minWidth = Math.min(minWidth, this.masterBounds[i][0]);
      maxWidth = Math.max(maxWidth, this.masterBounds[i][0]);
      minHeight = Math.min(minHeight, this.masterBounds[i][1]);
      maxHeight = Math.max(maxHeight, this.masterBounds[i][1]);
    }
    this.sizeFactor = this.fc(minWidth, maxWidth, this.parentRatio*minHeight);
    // keep the factors within 0 and 1
    // factor 2 is controlled by other events.
    this.sizeFactor = Math.min(this.extrapolateMax, Math.max(this.extrapolateMin, this.sizeFactor));
    this.calculateShapeTwoByTwo();
  }
}
export default MathShape;
