
// *******************************************************
//     Source code and visualization 
// may be used for non-commercial and non-profit purpose 
//     courtesy of "Boston University"
// *******************************************************

// global values
	var zOrder = 1;    				 		// z-order of the Sun and the planet
	
	var SUN_R_NORMAL = 45;
	var SUN_R_MAX = 60;
	var SUN_R_MIN = 25;
	
	var EARTH_R_NORMAL = 10;  // was 12.5
	var EARTH_R_MAX = 35;
	var EARTH_R_MIN = 5;
	
	var SUN_MASS_MIN = 0.156;
	var SUN_MASS_MAX = 6.312; 
	
	var EARTH_MASS_MIN = 0.5;
	var EARTH_MASS_MAX = 3000; 
	
	var DIST_NORMAL = 137.5; 
	var DIST_MAX = 175;
	var DIST_MIN = 112.5;
	
	var AMP_MIN = 20;
	var AMP_MAX = 75;
	var SAMP_MAX = 150;
	var amp_value = 0.09;
	var amp_text_pos = "0.09";
	var amp_text_neg = "-0.09";
	
	var center = {x: 200, y: 200 };  		// centre of mass
	var radius = {sun: SUN_R_NORMAL, earth: EARTH_R_NORMAL};	// initial radii of the sun and earth
	var vangle = 90;
	var Dist = 150;  // Distance between Earth and Sun (in pixels)
	var eDist = 148; // Distance from the center of the Earth to the center of the Mass (in pixels)
	var sDist = 2; // Distance from the center of the Sun to the center of the Mass (in pixels)

	var relDist = 1;  // Relative distance between the Sun and the Planet
	var relMassSun = 1; // Relative mass of the Sun
	var relMassEarth= 1; // Relative mass of the Planet
	var relRadSun = 1; // Relative radius of the Sun
	var relRadEarth= 1; // Relative radius of the Planet

	var speed = 3600;
	var nreps = 200;    //Number of repetitions in animation (Infinity);

	var smass_srad_timer_is_set = false;
	var smass_srad_update_timer;
	
	var ratio = 6.371 / 696  ; //ratio of palnet to star
	var dratio = 0.0  ;  // dip depth value
	var min_ratio = 6.371* 0.5 / (696 * 10) ;
	
	var amp = 50; // initial value for the amplitude
	var samp = 150; // initial value for the spectrum amplitude
	
	var glength = 280;
	var xstart = 50;
	var ystart = 470;
	var igraph1, igraph2, igraph3, igraph4, igraph5; 
	
	// Convert decimal to string
	function DecimalToString( decimal ){
	
		var tstring;
		if (decimal >= 1) {
			tstring = Number(decimal.toPrecision(3));
		} else if (decimal < 1 & decimal > 0.001) {
			tstring = Number(decimal.toFixed(3));
		} else {
			tstring = Number(decimal.toPrecision(3)).toExponential();
			tstring = tstring.replace(/e/g," &times; 10^");
			strarray = tstring.split("^");
			tstring = strarray[0] + (strarray[1]).sup();
		}
		return(String(tstring));
	}

	// Convert decimal to string
	function DecimalToSimpleString( decimal ){
	
		var tstring;
		if (decimal >= 1) {
			tstring = Number(decimal.toPrecision(3));
		} else if (decimal < 1 & decimal > 0.001) {
			tstring = Number(decimal.toFixed(3));
		} else if(decimal <= 0 ){
			tstring = 0.0;
		} else {
			tstring = Number(decimal.toPrecision(3)).toExponential();;
			
			tstring = tstring.replace(/e/g," * 10^");
			//strarray = tstring.split("^");
			//tstring = strarray[0] + (strarray[1]);
		}
		return(String(tstring));
	}
	
	// Create spectrum path
	function SpectrumPath(Dist) {
		var gr="M "  + (200 + Dist/2) + ",575 " + " "  + (200 - Dist/2) + ",575 "  + (200 + Dist/2) + ",575 " + "z";
		return(gr);
	}

	// Create orbit path for the planet
	function EarthOrbit(Dist, angle) {
		var eorbit="M" + (center.x) + "," + (center.y  - Dist ) + " R";
		for( var i=1; i < 72; i++ ){
			eorbit += center.x -  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin( Math.PI - i * Math.PI/36. );
			eorbit +=",";
			eorbit += center.y + Dist * Math.cos( Math.PI - i * Math.PI/36. );
			eorbit +=" ";
		}
		eorbit  +="z";
		return(eorbit);
	}

	// Create orbit path for the sun
	function SunOrbit(Dist, angle) {
		var sorbit="M" + (center.x) + "," + (center.y  + Dist ) + " R";
		for( var i=1; i < 36; i++ ){
			sorbit += center.x +  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin(  i * Math.PI/18 );
			sorbit +=",";
			sorbit += center.y + Dist * Math.cos(  i * Math.PI/18 );
			sorbit +=" ";
		}
		sorbit  +="z";
		return(sorbit);
	}



	function EarthHalf( half, Dist, angle) {
		var eorbit="M" + (center.x ) + "," + (center.y - Dist*half) + " R";
		for( var i=0; i <= 36; i++ ){
			eorbit += center.x -  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin( Math.PI + i * Math.PI/36 ) * half;
			eorbit +=",";
			eorbit += center.y + Dist * Math.cos(Math.PI + i * Math.PI/36 ) * half;
			eorbit +=" ";
		}
		return(eorbit);
	}
	
	 function GetCurve(){
	 		
		var graph_string= " M"     + String( xstart ) + ","  + String( ystart - amp ) + " R";
		for( var i = 1; i <= 72; i++ ){
			graph_string += xstart + glength/72.0 * i;
			graph_string +=",";
			graph_string += ystart - amp * Math.cos(Math.PI * 2 * i / 72);
			graph_string +=" ";
		}
						  
		return (graph_string);
	 
	 }
	 function GetCurve1(){
	 		
		
		var graph_string= " M"     + String( xstart ) + ","  + String( ystart - amp ) + " R";
		for( var i = 1; i <= 18; i++ ){
			graph_string += xstart + glength/72.0 * i;
			graph_string +=",";
			graph_string += ystart - amp * Math.cos(Math.PI * 2 * i / 72);
			graph_string +=" ";
		}
						  
		return (graph_string);
	 
	 }
	 
	 function GetCurve2(){
	 		
		
		var graph_string= " M"     + String( xstart + glength/72.0 * 72 / 4 * 1 ) + ","  + String( ystart  ) + " R";
		for( var i = 72 / 4 * 1 + 1; i <= 72 / 4 * 3; i++ ){
			graph_string += xstart + glength/72.0 * i;
			graph_string +=",";
			graph_string += ystart - amp * Math.cos(Math.PI * 2 * i / 72);
			graph_string +=" ";
		}
						  
		return (graph_string);
	 
	 }

	 function GetCurve3(){
	 		
		var graph_string= " M"     + String( xstart + glength/72.0 * 72 / 4 * 3 ) + ","  + String( ystart  ) + " R";
		for( var i = 72 / 4 * 3 + 1; i <= 72; i++ ){
			graph_string += xstart + glength/72.0 * i;
			graph_string +=",";
			graph_string += ystart - amp * Math.cos(Math.PI * 2 * i / 72);
			graph_string +=" ";
		}
		
		return (graph_string);
	 
	 }
	 function GetCurve4(){
	 		
		
		var graph_string= " M" + String( xstart + glength/2  ) + ","  + String( ystart  ) + " " + String( xstart + glength/2 ) + "," + String(ystart+amp);
		
		return (graph_string);
	 
	 }

	 function GetCurve5(){
	 		
		
		var graph_string= " M" + String( xstart + glength-1 ) + ","  + String( ystart  ) + " " + String(xstart + glength -1 ) + "," + String(ystart-amp);
		
		return (graph_string);
	 
	 }

	 
			     // Calculate graph
     function TransitGraph(eDist, sDist, angle){
	 
		var eposx, eposy, sposx, sposy;
		var cdist2;
		var gr;
				
		// move to the end of the line (first part) - temporary - remove when finished
		
		eposx = center.x ;
		eposy = center.y + eDist * Math.sin( angle * Math.PI / 180. ) ;
		sposx = center.x ;
		sposy = center.y - sDist * Math.sin( angle * Math.PI / 180. ) ;
		cdist2 = (eposx - sposx) * (eposx - sposx) + (eposy - sposy) * (eposy - sposy);

		gr= GetCurve();

        return(gr);
     }


	// Main Function
	jQuery(function () {

		// get handles to the controls
		var vslider = document.getElementById("viewAngle");
		var dslider = document.getElementById("distance");
		var smslider = document.getElementById("smass");
		var srslider = document.getElementById("srad");
		var pmslider = document.getElementById("pmass");
		var prslider = document.getElementById("prad");
		var reset_button = document.getElementById("reset");
		var canvas = document.getElementById("canvas_container");

		// flip z order
		function flip(){
			//console.log(zOrder);
			if( zOrder == 2) {planet.toBack(); path2.toBack();  zOrder=1;} else {planet.toFront(); zOrder=2;};
		}

        
		// Function to create an orbit for the Earth
		Raphael.el.animateSystem = function(pathE, pathS, pathG, pathR, duration, repetitions) {

			var gelement = ipoint;
			gelement.path = pathG;
			gelement.pathLen = gelement.path.getTotalLength();    
		
			var selement = sun;
			selement.path = pathS;
			selement.pathLen = selement.path.getTotalLength();    

			var relement = spectrum;
			relement.path = pathR;
			relement.pathLen = relement.path.getTotalLength();    

			var element = this;
			element.path = pathE;
			element.pathLen = element.path.getTotalLength();

			
			duration = (typeof duration === "undefined") ? speed : duration;
			repetitions = (typeof repetitions === "undefined") ? 1 : repetitions;

			paper.customAttributes.along = function(v) {
			var point = this.path.getPointAtLength(v * this.pathLen),
						attrs = { cx: point.x, cy: point.y };
			//this.rotateWith && (attrs.transform = 'r'+point.alpha) ;
			return attrs;
			};    

			selement.attr({along:0});
			var anim = Raphael.animation({along: 1}, duration);
			selement.animate(anim.repeat(repetitions)); 

			relement.attr({along:0});
			var animr = Raphael.animation({along: 1}, duration);
			relement.animateWith(sun,anim,animr.repeat(repetitions)); 

			gelement.attr({along:0});
			var animg = Raphael.animation({along: 1}, duration);
			gelement.animateWith(sun,anim,animg.repeat(repetitions)); 

			element.attr({along:0});
			var anim1 = Raphael.animation({along: 1}, duration);
			var anim2 = Raphael.animation({  transform: " "}, Math.round(speed/2), flip );
			element.animateWith(sun,anim,anim1.repeat(repetitions)).animate(anim2.repeat(repetitions)); 
		};

		// animation update function
		function animUpdate (){

			planet.stop();			// remove old animation		
			eorbit.remove(); path1.remove(); path2.remove();		
			zOrder = 1;				// reset z order
			eorbit = paper.path( EarthOrbit( eDist, vangle )).attr( { opacity: 0 });
			sorbit = paper.path( SunOrbit( sDist, vangle )).attr( { opacity: 0 });
			path1 = paper.path( EarthHalf(1, eDist, vangle)).attr( { stroke:  '#5b6469','stroke-dasharray':"--",  opacity: 0.5 }).insertAfter(planet);
			path2 = paper.path( EarthHalf(-1, eDist, vangle)).attr( { stroke:  '#5b6469', 'stroke-dasharray':"--", opacity: 0.5 }).toBack();
			planet.animateSystem(eorbit, sorbit, igraph, spgraph, speed, Infinity);
			planet.toBack();
			
		}


		function objUpdate (){
			planet.remove(); //sunglow.removeData(); 
			sun.remove(); 
			igraph.remove();
			ipoint.remove();

			igraph1.remove();
			igraph2.remove();
			igraph3.remove();
			igraph4.remove();
			igraph5.remove();

			spectrum.remove();
			spgraph.remove();

			minlabel.remove();
			maxlabel.remove();

			sun = paper.circle(200, 200, radius.sun).attr( { fill: "r(.35,.35) #FFFFAA-#DEAD49", stroke: '#DEAD49', 'stroke-width': 2, opacity: 1 });
			planet = paper.circle(200, 337.5, radius.earth).attr({ fill: "r(0.45,0.45) #618bA9-#215b69", "stroke": "#215b69", "stroke-width": "0.5", "stroke-linejoin": "round"});

			// update graph;
			igraph = paper.path(TransitGraph(eDist, sDist, vangle)).attr({ opacity: 0});
			ipoint = paper.circle(50, 450, 4).attr( { fill: '#EFBE5A', stroke: '#FFF' , 'fill-opacity':0.2});
			
			if (amp > 0.0001){
				igraph1 = paper.path(GetCurve1()).attr({ stroke: "#f11", "stroke-width": "2px"});
				igraph2 = paper.path(GetCurve2()).attr({ stroke: "#05f", "stroke-width": "2px"});
				igraph3 = paper.path(GetCurve3()).attr({ stroke: "#f11", "stroke-width": "2px"});
			} else {
				igraph1 = paper.path(GetCurve1()).attr({ stroke: "#fff", "stroke-width": "2px"});
				igraph2 = paper.path(GetCurve2()).attr({ stroke: "#fff", "stroke-width": "2px"});
				igraph3 = paper.path(GetCurve3()).attr({ stroke: "#fff", "stroke-width": "2px"});
			}
			
		   igraph4 = paper.path(GetCurve4()).attr({ stroke: "#fff", "stroke-dasharray":"--", opacity: 0.75});				 
		   igraph5 = paper.path(GetCurve5()).attr({ stroke: "#fff", "stroke-dasharray":"--", opacity: 0.75});				 

			spectrum = paper.circle(200,575,100,100).attr({fill: 'url(http://scv.bu.edu/katia/worlds/radial/img/spectrum.png)', 'stroke-width': 0})
			spgraph = paper.path(SpectrumPath(samp)).attr({ opacity: 0});

			if (amp < 48) {
				minlabel = paper.text(190,480+amp,amp_text_neg).attr({fill: '#05f', "font-size": 12});
				maxlabel = paper.text(330,460-amp,amp_text_pos).attr({fill: '#f11', "font-size": 12});
			} else {
				minlabel = paper.text(190,455+amp,amp_text_neg).attr({fill: '#05f', "font-size": 12});
				maxlabel = paper.text(330,460-amp,amp_text_pos).attr({fill: '#f11', "font-size": 12});
			}
			
		}

		// Calculate new value of period and force
		function updatePeriod(){
		
			var tstring;
			var strarray;
			var period = Math.round(365 * Math.sqrt( relDist * relDist *relDist * 330001/(330000*relMassSun + relMassEarth)));
			var yperiod;
			
			
			//convert the value to the string and update the field of Earth years
			if (period >=1 & period <= 999){
				tstring = (period).toPrecision(3);
				document.getElementById("period").innerHTML = tstring;
			} else if (period < 1 & period >= 0.001) {
				tstring = (period).toFixed(3);
				document.getElementById("period").innerHTML = tstring;
			} else {
				tstring = Number((period).toPrecision(3)).toExponential();
				tstring = tstring.replace(/e/g," &times; 10^");
				strarray = tstring.split("^");
				tstring = strarray[0] + (strarray[1]).sup();
				document.getElementById("period").innerHTML = tstring;
			}
			
			//convert the value to the string and update the field of Earth years
			yperiod = period/365.0;
			if (yperiod >=1 & yperiod <= 999){
				tstring = ( yperiod ).toPrecision(3);
				document.getElementById("years").innerHTML = tstring;
			} else if ( yperiod < 1 & yperiod >= 0.001){
				tstring = (yperiod).toFixed(3);
				document.getElementById("years").innerHTML = tstring;
			} else {
				tstring = Number((yperiod).toPrecision(3)).toExponential();
				tstring = tstring.replace(/e/g," &times; 10^");
				strarray = tstring.split("^");
				tstring = strarray[0] + (strarray[1]).sup();
				document.getElementById("years").innerHTML = tstring;
			}
			
			
			if (period <= 365){
				speed = Math.round(3600 - (365-period)*9);
			}else{
				speed = Math.round(3600 + (period - 365)*0.035);
			}
			
			//calculate the radii ratio
			ratio = 6.371* relRadEarth / (696 * relRadSun) ;
			//document.getElementById("ratio").innerHTML = DecimalToString( ratio );
			
			// calculate amplitude
			amp = AMP_MIN + 0.333 * (AMP_MAX - AMP_MIN) * (relMassEarth - EARTH_MASS_MIN) / (EARTH_MASS_MAX - EARTH_MASS_MIN) +
							0.333 * (AMP_MAX - AMP_MIN) *(1.0/relMassSun - 1.0/SUN_MASS_MAX ) / (1.0/SUN_MASS_MIN - 1.0/SUN_MASS_MAX)  +
							0.333 * (AMP_MAX - AMP_MIN) *(1.0/Math.pow(yperiod,1/3) - 1.0/Math.pow(2512,1/3) ) / (1.0/Math.pow(0.0137,1/3) - 1.0/Math.pow(2512,1/3));
			amp = amp * Math.sin(vangle * Math.PI/180.);
			samp = SAMP_MAX * amp / AMP_MAX;
			//console.log("Earth = " + relMassEarth);
			//console.log("Sun = " + relMassSun);
			//console.log("tamp = " + tamp);
			
			//recalculate the real amplitude:
			amp_value = 0.09 * Math.pow(yperiod, -1.0/3.0) * Math.pow(relMassSun, -2.0/3.0) * relMassEarth * Math.sin(vangle * Math.PI/180.);
			amp_text_pos = DecimalToSimpleString(amp_value);
			amp_text_neg = amp_text_pos;
			if (amp_value > 0) amp_text_neg = "-" + amp_text_neg;
		}

		function updateALL(){
			updatePeriod();
			objUpdate();  // recreate the planet and the star
			animUpdate();
		}

		// Create scene
		var paper = new Raphael(canvas, 400, 600);
		paper.id = 'IDcanvas';

		// create a planet and the sun
		var sun = paper.circle(200, 200 + sDist, radius.sun).attr( { fill: "r(.35,.35) #FFFFAA-#DEAD49", stroke: '#DEAD49', 'stroke-width': 2, opacity: 1 });
		sun.id = 'IDsun';
		var planet = paper.circle(200, 200 - eDist, radius.earth).attr({ fill: "r(0.45,0.45) #618bA9-#215b69", "stroke": "#215b69", "stroke-width": "0.5", "stroke-linejoin": "round"});
		planet.id = 'IDplanet';

		// create orbit object for the Earth
		var eorbit = paper.path(EarthOrbit(eDist, vangle)).attr( { opacity: 0 });
		var sorbit = paper.path(SunOrbit(sDist, vangle)).attr( { opacity: 0 });

		// front path
		var path1 = paper.path(EarthHalf(1, eDist, vangle)).attr( { stroke:  '#5b6469', 'stroke-dasharray':"--", opacity: 0.5 })  //.insertAfter(planet);
		path1.id = 'IDfrontpath';
		//planet.toFront();

		// back path
		var path2 = paper.path(EarthHalf(-1, eDist, vangle)).attr( { stroke:  '#5b6469','stroke-dasharray':"--",  opacity: 0.5 })  //.toBack();
		path2.id = 'IDbackpath';
		
		//Set the order:
		planet.toFront();
		path1.toBack();
		sun.toBack();
		path2.toBack();
		
		// Add an eye
		var eye = paper.image ('http://scv.bu.edu/katia/worlds/radial/img/eye.svg',-65,185,30,30);
		

		var xaxis = paper.path("M50,470l300,0,l-3,-2,l0,4,l3,-2").attr({ stroke: "#5b6469", opacity: 0.5});
		var yaxis = paper.path("M50,405l-2,3l4,0l-2,-3l0,130").attr({ stroke: "#5b6469", opacity: 0.5});

		// calculate amplitude
		amp = AMP_MIN + 0.333 * (AMP_MAX - AMP_MIN) * (relMassEarth - EARTH_MASS_MIN) / (EARTH_MASS_MAX - EARTH_MASS_MIN) +
							0.333 * (AMP_MAX - AMP_MIN) *(1.0/relMassSun - 1.0/SUN_MASS_MAX ) / (1.0/SUN_MASS_MIN - 1.0/SUN_MASS_MAX)  +
							0.333 * (AMP_MAX - AMP_MIN) *(1.0/Math.pow(1,1/3) - 1.0/Math.pow(2512,1/3) ) / (1.0/Math.pow(0.0137,1/3) - 1.0/Math.pow(2512,1/3));
			amp = amp * Math.sin(vangle * Math.PI/180.);
		samp = SAMP_MAX * amp / AMP_MAX;
		var igraph = paper.path(TransitGraph(eDist, sDist, vangle)).attr({ opacity: 0});
		
		if (amp > 0.0001){
		   igraph1 = paper.path(GetCurve1()).attr({ stroke: "#f11", "stroke-width": "2px"});
		   igraph2 = paper.path(GetCurve2()).attr({ stroke: "#05f", "stroke-width": "2px"});
		   igraph3 = paper.path(GetCurve3()).attr({ stroke: "#f11", "stroke-width": "2px"});
		} else {
		   igraph1 = paper.path(GetCurve1()).attr({ stroke: "#fff", "stroke-width": "2px"});
		   igraph2 = paper.path(GetCurve2()).attr({ stroke: "#fff", "stroke-width": "2px"});
		   igraph3 = paper.path(GetCurve3()).attr({ stroke: "#fff", "stroke-width": "2px"});
		}
		   igraph4 = paper.path(GetCurve4()).attr({ stroke: "#fff", "stroke-dasharray":"--", opacity: 0.75});				 
		   igraph5 = paper.path(GetCurve5()).attr({ stroke: "#fff", "stroke-dasharray":"--", opacity: 0.75});				 

		var ipoint = paper.circle(50, 450, 4).attr( { fill: '#EFBE5A', stroke: '#FFF' , 'fill-opacity':0.2});
		ipoint.id = 'IDpoint';
		
		
		// axes labels
		var xlabel = paper.text(340,487,"Time").attr({fill: '#09c'}).attr({ "font-size": 12});
		xlabel.id = 'IDxlabel';
		var ylabel = paper.text(30,475,"Radial Velocity (m/s)").attr({fill: '#09c', "font-size": 12}).transform("r-90");
		ylabel.id = 'IDxlabel';
		var zero = paper.text(45,475,"0").attr({fill: '#fff'});
		
		// Add spectrum
		var sline1 = paper.path("M153.5,550l0,12").attr({ stroke: "#46a"});
		var sline2 = paper.path("M169.5,550l0,12").attr({ stroke: "#46a"});
		var sline3 = paper.path("M205.5,550l0,12").attr({ stroke: "#46a"});
		var sline4 = paper.path("M207.5,550l0,12").attr({ stroke: "#46a"});
		var sline5 = paper.path("M242.5,550l0,12").attr({ stroke: "#46a"});

		var Ctxt = paper.text(243,545,"C").attr({fill: '#abf'});
		var Dtxt = paper.text(207,545,"D").attr({fill: '#abf'});
		var Etxt = paper.text(170,545,"E").attr({fill: '#abf'});
		var Ftxt = paper.text(154,545,"F").attr({fill: '#abf'});


		var spectrum = paper.circle(200,575,100,100).attr({fill: 'url(http://scv.bu.edu/katia/worlds/radial/img/spectrum.png)', 'stroke-width': 0})
		var spgraph = paper.path(SpectrumPath(samp)).attr({ opacity: 0});

		var minlabel = paper.text(190,510,amp_text_neg).attr({fill: '#05f', "font-size": 12});
		var maxlabel = paper.text(330,435,amp_text_pos).attr({fill: '#f11', "font-size": 12});

		
		// add animation 
		planet.animateSystem(eorbit, sorbit, igraph, spgraph, speed, Infinity);
		
		// restart animation if the window previously lost focus
		$(window).focus(function(){
			// update animation
			updateALL();
		});

		//---------- Handle Sliders and text boxes----------//

		// handle slider change of the viewing angle
		$("#viewAngle").change(function(){
			// get the value of the viewing angle
			vangle = parseFloat(vslider.value);

			// update text box
			$('#inputangle').val( vangle + '\u00B0' );

			// update animation
			updateALL();
		});


		// handle textbox change of the viewing angle
		$("#inputangle").change(function(){
			// get the value of the viewing angle
			vangle = parseInt($(this).val());

			// insure the valid value
			if( isNaN(vangle) || vangle > 90) {
				vangle= 90;
			} else if(vangle < 0) {
				vangle = 0;
			}

			// update slider value
			$("#viewAngle").val( vangle ).change();

			// add degree symbol at the end
			$(this).val( vangle + '\u00B0');

			// update animation
			updateALL();

		});


		// handle slider change of the distance
		$("#distance").change(function(){

		// get the value 
			var tdist= parseFloat(dslider.value);

			// convert this value into the relative value
			if (tdist < 0){
				relDist = (10. + tdist) / 10.;
				Dist = Math.round(DIST_NORMAL + (DIST_NORMAL - DIST_MIN) * tdist / 9.0);
			} else {
				relDist = 99.0 * tdist/9.0 + 1;
				Dist = Math.round(DIST_MAX + (DIST_MAX - DIST_NORMAL) * (tdist - 9) / 9.0);
			}	

			// update text box
			if(relDist < 10){
				document.getElementById("inputdist").value= String(relDist.toPrecision(2));
				document.getElementById("txtdist").innerHTML=  String(relDist.toPrecision(2))  ;
			} else {
				document.getElementById("inputdist").value= String(relDist.toPrecision(3));
				document.getElementById("txtdist").innerHTML=  String(relDist.toPrecision(3))  ;
			}

			// calculate new distances for the earth and sun
			if (sDist < 1){
				sDist = 0; 
				eDist = Dist;
			} else {
				var v = sDist/eDist;
				sDist = Math.round(Dist * v / ( 1 + v));
				eDist = Dist - sDist;
			}

			// update animation
			updateALL();

		});

		// handle textbox change of the distance
		$("#inputdist").change(function(){

			var tdist; 

			// get the value of the viewing angle
			relDist = parseFloat($(this).val());

			// insure the valid value
			if ( isNaN(relDist) ) relDist= 1;
			if (relDist < 0.1) relDist = 0.1;
			if (relDist > 100) relDist = 100;

			// From the relDist value get the value for the slider:
			if (relDist < 1){
				tdist = 10.0 * relDist - 10;
				Dist = Math.round(DIST_NORMAL + (DIST_NORMAL - DIST_MIN) * tdist / 9.0);
			} else {
				tdist =  (relDist - 1.) / 11.0;
				Dist = Math.round(DIST_MAX + (DIST_MAX - DIST_NORMAL) * (tdist - 9) / 9.0);
			}	


			// calculate new distances for the earth and sun
			if (sDist < 1){
				sDist = 0; 
				eDist = Dist;
			} else {
				var v = sDist/eDist;
				sDist = Math.round(Dist * v / ( 1 + v));
				eDist = Dist - sDist;
			}

			// update slider
			dslider.value = tdist;
			$(dslider).change();

			// update textbox with the valid value
			if(relDist < 10){
				document.getElementById("inputdist").value= String(relDist.toPrecision(2));
				document.getElementById("txtdist").innerHTML=  String(relDist.toPrecision(2))  ;
			} else {
				document.getElementById("inputdist").value= String(relDist.toPrecision(3));
				document.getElementById("txtdist").innerHTML=  String(relDist.toPrecision(3))  ;
			}

			// update animation
			updateALL();

		});

		$("#smass,#srad").change(function(){
			if( smass_srad_timer_is_set ){
				return false;
			}
			smass_srad_timer_is_set = true;
			clearTimeout( smass_srad_update_timer );
			smass_srad_update_timer = setTimeout( function(){
				$(smslider).trigger('change');
				$(srslider).trigger('change');
				smass_srad_timer_is_set = false;
			}, 100);
		});

		// handle slider change of the star mass
		$("#smass").change(function(){

			// get the value 
			var newv= parseFloat(smslider.value);
			var newe= parseFloat(pmslider.value);
			srslider.value = newv;


			if (newv < 0){
				relMassSun = Math.pow((10. + newv) / 10. ,0.8);
				relRadSun = (10. + newv) / 10. ;
				radius.sun = SUN_R_NORMAL + (SUN_R_NORMAL - SUN_R_MIN) * newv / 9.0;
			} else {
				relMassSun = Math.pow((1. + newv), 0.8) ;
				relRadSun = (1.0 + newv)  ;
				radius.sun = SUN_R_MAX - (SUN_R_MAX - SUN_R_NORMAL) * ( 9 - newv ) / 9.0;
			}	

			// update text box
			document.getElementById("inputsmass").value=  String( relMassSun.toPrecision(2) ) ;
			document.getElementById("txtsmass").innerHTML= String( relMassSun.toPrecision(2) ) ;
			document.getElementById("inputsrad").value=  String( relRadSun.toPrecision(2) ) ;
			document.getElementById("txtsrad").innerHTML= String( relRadSun.toPrecision(2) ) ;


			// calculate new distances of sun and earth from the center of masses
			var tmp = newe - newv;  // this value changes from -18 to +18
			if (tmp < -2) {
				sDist = 0;
			} else if (tmp < 1) {
				sDist = 1;
			} else {
				sDist = Math.round(tmp * 10/18);
			}
			eDist = Dist - sDist;

			// update animation
			updateALL();
		});

		// handle textbox change of star mass
		$("#inputsmass").change(function(){

                        var newv;
                        var newe= parseFloat(pmslider.value);

                        // get the value of the viewing angle
                        relMassSun = parseFloat($(this).val());

                        // insure the valid value
                        if ( isNaN(relMassSun) ) relMassSun= 1;
                        if (relMassSun < 0.16) relMassSun = 0.16;
                        if (relMassSun > 6.31) relMassSun = 6.31;

                        // From the relDist value get the value for the slider:
                        if (relMassSun < 1){
                                newv= Math.pow(relMassSun ,1.25) * 10.0 - 10.0 ;
                                relRadSun = (10.0 + newv) / 10.0 ;
                                radius.sun = SUN_R_NORMAL + (SUN_R_NORMAL - SUN_R_MIN) * newv / 9.0;
                        } else {
                                newv= Math.pow(relMassSun ,1.25) - 1 ;
                                relRadSun = (1.0 + newv)  ;
                                radius.sun = SUN_R_MAX - (SUN_R_MAX - SUN_R_NORMAL) * ( 9 - newv ) / 9.0;
                        }

                        // update slider
                        smslider.value = Math.round(newv);
                        $(smslider).change();

                        srslider.value = Math.round(newv);
                        $(srslider).change();

                        // update textbox with the valid value
                        // update text box
                        document.getElementById("inputsmass").value=  String( relMassSun.toPrecision(2) ) ;
                        document.getElementById("txtsmass").innerHTML= String( relMassSun.toPrecision(2) ) ;
                        document.getElementById("inputsrad").value=  String( relRadSun.toPrecision(2) ) ;
                        document.getElementById("txtsrad").innerHTML= String( relRadSun.toPrecision(2) ) ;


                        // calculate new distances of sun and earth from the center of masses
                        var tmp = newe - newv;  // this value changes from -18 to +18
                        if (tmp < -2) {
                                sDist = 0;
                        } else if (tmp < 1) {
                                sDist = 1;
                        } else {
                                sDist = Math.round(tmp * 10/18);
                        }
                        eDist = Dist - sDist;

                        // update animation
                        updateALL();

		});

		// handle slider change of the star radius
		$("#srad").change(function(){

			// get the value 
			var screenV;
			var newv= parseFloat(srslider.value);
			smslider.value = newv;

			if (newv < 0){
				screenV = (10. + newv) / 10.;
				radius.sun = Math.round(SUN_R_NORMAL + (SUN_R_NORMAL - SUN_R_MIN) * newv / 9.0);
			} else {
				screenV = (1. + newv) ;
				radius.sun = Math.round(SUN_R_MAX - (SUN_R_MAX - SUN_R_NORMAL) * ( 9 - newv ) / 9.0);
			}	
			relMassSun = Math.pow(screenV, 0.8) ;
			relRadSun = screenV;

			// update text box
			document.getElementById("inputsmass").value=  String( relMassSun.toPrecision(2) ) ;
			document.getElementById("txtsmass").innerHTML= String( relMassSun.toPrecision(2) ) ;
			document.getElementById("inputsrad").value=  String( relRadSun.toPrecision(2) ) ;
			document.getElementById("txtsrad").innerHTML= String( relRadSun.toPrecision(2) ) ;

			// update animation
			updateALL();
		});

		// handle textbox change of star radius
		$("#inputsrad").change(function(){

			var newv; 

			// get the value of the viewing angle
			relRadSun = parseFloat($(this).val());

			// insure the valid value
			if ( isNaN(relRadSun) ) relRadSun= 1;
			if (relRadSun < 0.1) relRadSun = 0.1;
			if (relRadSun > 10) relRadSun = 10;

			// From the relDist value get the value for the slider:
			if (relRadSun < 1){
				newv = (10.0 * relRadSun - 10.0);
				radius.sun = Math.round(SUN_R_NORMAL + (SUN_R_NORMAL - SUN_R_MIN) * newv / 9.0);
			} else {
				newv = relRadSun - 1;
				radius.sun = Math.round(SUN_R_MAX - (SUN_R_MAX - SUN_R_NORMAL) * ( 9 - newv ) / 9.0);
			}	
			relMassSun = Math.pow(relRadSun, 0.8) ;
			relRadSun = relRadSun;

			// update slider
			smslider.value = newv;
			$(smslider).change();

			srslider.value = newv;
			$(srslider).change();

			// update textbox with the valid value
			// update text box
			document.getElementById("inputsmass").value=  String( relMassSun.toPrecision(2) ) ;
			document.getElementById("txtsmass").innerHTML= String( relMassSun.toPrecision(2) ) ;
			document.getElementById("inputsrad").value=  String( relRadSun.toPrecision(2) ) ;
			document.getElementById("txtsrad").innerHTML= String( relRadSun.toPrecision(2) ) ;

			// update animation
			updateALL();

		});

        // handle slider change of the planet mass
                $("#pmass").change(function(){
                        //console.log("pmass change!");

                        // get the value
                        var newv= parseFloat(pmslider.value);
                        var news= parseFloat(smslider.value);
                        //console.log("new planet mass:" + newv);
                        if (newv < 0){
                                relMassEarth = 1. + newv*0.5 / 9.;
                        } else {
                                relMassEarth = 2999.0 * newv / 9.0 + 1.0 ;
                        }
                        //console.log("In pmass" + relMassEarth)

                        // update text box
                        if(relMassEarth < 10){
                                document.getElementById("inputpmass").value= String(relMassEarth.toPrecision(2));
                                document.getElementById("txtpmass").innerHTML=  String(relMassEarth.toPrecision(2))  ;
                        } else if(relMassEarth < 1000){
                                document.getElementById("inputpmass").value= String(relMassEarth.toPrecision(3));
                                document.getElementById("txtpmass").innerHTML=  String(relMassEarth.toPrecision(3))  ;
                        } else {
                                document.getElementById("inputpmass").value= String(relMassEarth.toPrecision(4));
                                document.getElementById("txtpmass").innerHTML=  String(relMassEarth.toPrecision(4))  ;
                        }


                                        // calculate new distances of sun and earth from the center of masses
                        var tmp = newv - news;  // this value changes from -18 to +18
                        if (tmp < -2) {
                                sDist = 0;
                        } else if (tmp < 1) {
                                sDist = 1;
                        } else {
                                sDist = Math.round(tmp * 10/18);
                        }
                        eDist = Dist - sDist;

                        // update animation
                        updateALL();
                });


                // handle textbox change of planet mass
                $("#inputpmass").change(function(){


                        var newv;
                        var news= parseFloat(smslider.value);

                        // get the value of the viewing angle
                        relMassEarth = parseFloat($(this).val());

                        // insure the valid value
                        if ( isNaN(relMassEarth) ) relMassEarth= 1;
                        if (relMassEarth < 0.5) relMassEarth = 0.5;
                        if (relMassEarth > 3000) relMassEarth = 3000;

                        // From the relDist value get the value for the slider:
                        if (relMassEarth <= 1){
                                newv = 18.0 * relMassEarth - 18;
                        } else {
                                newv = (relMassEarth  - 1.0) * 9.0 / 2999.0;
                        }


                        // update slider
                        pmslider.value = newv;
                        $(pmslider).change();

                        // update textbox with the valid value
                        // update textbox with the valid values
                        if(relMassEarth < 10){
                                document.getElementById("inputpmass").value= String(relMassEarth.toPrecision(2));
                                document.getElementById("txtpmass").innerHTML=  String(relMassEarth.toPrecision(2))  ;
                        } else if(relMassEarth < 1000){
                                document.getElementById("inputpmass").value= String(relMassEarth.toPrecision(3));
                                document.getElementById("txtpmass").innerHTML=  String(relMassEarth.toPrecision(3))  ;
                        } else {
                                document.getElementById("inputpmass").value= String(relMassEarth.toPrecision(4));
                                document.getElementById("txtpmass").innerHTML=  String(relMassEarth.toPrecision(4))  ;
                        }


                        // calculate new distances of sun and earth from the center of masses
                        var tmp = newv - news;  // this value changes from -18 to +18
                        if (tmp < -2) {
                                sDist = 0;
                        } else if (tmp < 1) {
                                sDist = 1;
                        } else {
                                sDist = Math.round(tmp * 10/18);
                        }
                        eDist = Dist - sDist;

                        // update animation
                        updateALL();

                });

				// handle slider change of the planet radius
		$("#prad").change(function(){

			// get the value 
			// get the value 
			var newv= parseFloat(prslider.value);
			if (newv < 0){
				screenV = 1.0 + newv * 0.5 / 9.0;
				radius.earth = Math.round(EARTH_R_NORMAL + (EARTH_R_NORMAL - EARTH_R_MIN) * newv / 9.0);
			} else {
				screenV = 49.0 * newv / 9.0 + 1.0 ;
				radius.earth = Math.round(EARTH_R_MAX - (EARTH_R_MAX - EARTH_R_NORMAL) * ( 9 - newv ) / 9.0);
			}	

			// update text box
			relRadEarth = screenV;
			// update textbox with the valid values
			if(relRadEarth < 10){
				document.getElementById("inputprad").value= String(relRadEarth.toPrecision(2));
				document.getElementById("txtprad").innerHTML=  String(relRadEarth.toPrecision(2))  ;
			} else {
				document.getElementById("inputprad").value= String(relRadEarth.toPrecision(3));
				document.getElementById("txtprad").innerHTML=  String(relRadEarth.toPrecision(3))  ;
			}


			// update animation
			updateALL();
		});

		$("#inputprad").change(function(){

			var newv; 

			// get the value of the viewing angle
			relRadEarth = parseFloat($(this).val());

			// insure the valid value
			if ( isNaN(relRadEarth) ) relRadEarth= 1;
			if (relRadEarth < 0.5) relRadSun = 0.5;
			if (relRadEarth > 50) relRadEarth = 50;

			// From the relDist value get the value for the slider:
			if (relRadEarth < 1){
				newv = (18 * relRadEarth - 18.0);
				radius.earth = Math.round(EARTH_R_NORMAL + (EARTH_R_NORMAL - EARTH_R_MIN) * newv / 9.0);
			} else {
				newv = (relRadEarth  - 1) * 9 / 49;
				radius.earth = Math.round(EARTH_R_MAX - (EARTH_R_MAX - EARTH_R_NORMAL)* ( 9 - newv ) / 9.0);
			}	

			// update slider
			prslider.value = Math.round(newv);
			$(prslider).change();

			// update textbox with the valid value
			if(relRadEarth < 10){
				document.getElementById("inputprad").value= String(relRadEarth.toPrecision(2));
				document.getElementById("txtprad").innerHTML=  String(relRadEarth.toPrecision(2))  ;
			} else {
				document.getElementById("inputprad").value= String(relRadEarth.toPrecision(3));
				document.getElementById("txtprad").innerHTML=  String(relRadEarth.toPrecision(3))  ;
			}


			// update animation
			updateALL();

		});


		// handle reset button click
		reset_button.onclick = function(){
		
			//vslider.value = 0;
			//$(vslider).change();
			dslider.value = 0;
			$(dslider).change();
			//smslider.value = 0;
			//$(smslider).change();
			srslider.value = 0;
			$(srslider).change();
			pmslider.value = 0;
			$(pmslider).change();
			prslider.value = 0;
			$(prslider).change();


			//console.log("reset");
			document.getElementById("distance").value= 0;
			document.getElementById("txtdist").innerHTML =  String(1);
			document.getElementById("inputdist").value=  String( 1 ) ;
			relDist = 1;

			document.getElementById("smass").value= 0;
			document.getElementById("txtsmass").innerHTML =  String(1);
			document.getElementById("inputsmass").value=  String( 1 ) ;
			relMassSun = 1;

			document.getElementById("srad").value= 0;
			document.getElementById("txtsrad").innerHTML =  String(1);
			document.getElementById("inputsrad").value=  String( 1 ) ;
			relRadSun = 1;

			document.getElementById("pmass").value= 0;
			document.getElementById("txtpmass").innerHTML =  String(1);
			document.getElementById("inputpmass").value=  String( 1 ) ;
			relMassEarth = 1;

			document.getElementById("prad").value= 0;
			document.getElementById("txtprad").innerHTML =  String(1);
			document.getElementById("inputprad").value=  String( 1 ) ;
			relRadEarth = 1;

			// update animation
			updateALL();
		}


	});
