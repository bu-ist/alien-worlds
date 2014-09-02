
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
	
	var DIST_NORMAL = 137.5; 
	var DIST_MAX = 175;
	var DIST_MIN = 112.5;
	
	var center = {x: 200, y: 200 };  		// centre of mass
	var radius = {sun: SUN_R_NORMAL, earth: EARTH_R_NORMAL};	// initial radii of the sun and earth
	var vangle = 0;
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
	
	// Create orbit path for the planet
	function EarthOrbit(Dist, angle) {
		var eorbit="M" + (center.x - Dist) + "," + (center.y ) + " R";
		for( var i=1; i < 72; i++ ){
			eorbit += center.x + Dist * Math.cos( Math.PI + i * Math.PI/36. );
			eorbit +=",";
			eorbit += center.y -  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin( Math.PI + i * Math.PI/36. );
			eorbit +=" ";
		}
		eorbit  +="z";
		return(eorbit);
	}

	// Create orbit path for the sun
	function SunOrbit(Dist, angle) {
		var sorbit="M" + (center.x + Dist) + "," + (center.y ) + " R";
		for( var i=1; i < 36; i++ ){
			sorbit += center.x + Dist * Math.cos(  i * Math.PI/18 );
			sorbit +=",";
			sorbit += center.y -  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin(  i * Math.PI/18 );
			sorbit +=" ";
		}
		sorbit  +="z";
		return(sorbit);
	}



	function EarthHalf( half, Dist, angle) {
		var eorbit="M" + (center.x - Dist*half) + "," + (center.y ) + " R";
		for( var i=0; i <= 36; i++ ){
			eorbit += center.x + Dist * Math.cos(Math.PI + i * Math.PI/36 ) * half;
			eorbit +=",";
			eorbit += center.y -  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin( Math.PI + i * Math.PI/36 ) * half;
			eorbit +=" ";
		}
		return(eorbit);
	}
	
	 function GetCurve(){
	 
		// recalculate the ratio between sun and earth radii and calculate the minimum value of the graph
		ratio = 6.371* relRadEarth / (696 * relRadSun) ;
		var gr_ratio = Math.min(ratio, 1);
		dratio = gr_ratio * gr_ratio;    // save value to display depth of the graph
		// console.log("dratio=" + dratio);

		var gr_up = 450;  // position of the maximum value of the graph
		var gr_r = 5; // number of pixels for smoothing
		var gr_xleft = 50; // x coordinate of the start of the graph
		var gr_length = 300; // length of the graph in pixels
		var gr_xright = gr_xleft + gr_length;  // x coordinate of the right point
		
		var tangle = (radius.sun + radius.earth) / eDist; 
		var rangle = Math.PI * vangle / 180.; 

		var GR_DEL_MAX = 20;  // maximum depth of the graph
		var GR_DEL_MIN = 2;  // minimum depth of the graph
						
		if ( Math.sin(rangle) <= Math.max(0,(radius.sun - radius.earth) / eDist )){
			dratio = dratio;
		} else if ( Math.sin(rangle) > (radius.sun + radius.earth) / eDist ){
			dratio = 0;
		} else {
			dratio = dratio * (  - Math.sin(rangle) * eDist + (radius.sun + radius.earth  ) ) / ( 2 * radius.earth ) ;
		}
			
		// calculate the depth of the graph	
		var tgr_ratio = (rangle - tangle) * (gr_ratio) / (0.0 - tangle);
		

		//console.log("gr_ratio="+gr_ratio);
		//console.log("tgr_ratio="+tgr_ratio);
		var gr_del = GR_DEL_MIN + (tgr_ratio - min_ratio) * (GR_DEL_MAX - GR_DEL_MIN) / (1.0 - min_ratio);  // number of pixels between max and min value of the graph


		// approximate the width of the cavity
		//var gr_pwidth = 2 * radius.sun * (gr_mid - gr_center) / eDist;    // width of the cavity;
		var gr_pwidth = (radius.sun + radius.earth) * (gr_length/4 - gr_del/2) / eDist;    // width of the cavity;
		// adjust based on the view angle
		gr_pwidth = 3 + (rangle - tangle) * ( gr_pwidth - 3) / (0.0 - tangle);

		// calculate
		if (gr_del > 8) {
			gr_r = Math.min(gr_del/2 - 1, gr_pwidth/2 - 2);
		} else if (gr_del > 5) { 
			gr_r = gr_del - 3;
		} else if (gr_del > 3) { 
			gr_r = gr_del - 2;
		} else  { 
			gr_r = 1;
		}
		
		// aproximate the mid-point and the center of the bottom of the graph
		var gr_mid = gr_xright - ( gr_del * 2  - 2* gr_r +   gr_length ) /2;  // mid point
		var gr_center = gr_xleft + (gr_mid - gr_xleft)/2;  // mid point of the bottom
		
		var gr_lwall = gr_center - gr_pwidth/2;  // x coordinate of the left wall
		var gr_rwall = gr_center + gr_pwidth/2;  // x coordinate of the right wall
		
		var graph_string= " L"     + String(gr_lwall - 2 * gr_r ) + ","  + String(gr_up) +  // point before the left wall
						  " C"     + String(gr_lwall - gr_r ) + ","  + String(gr_up) +                     // upper left curve
						  " "      + String(gr_lwall ) + ","  + String(gr_up) + 
						  " "      + String(gr_lwall ) + ","  + String(gr_up + gr_r) +  
						  " L"     + String(gr_lwall  ) + "," + String(gr_up + gr_del - gr_r ) +  // point before lower left corner
						  " C"     + String(gr_lwall ) + "," + String(gr_up + gr_del - gr_r ) +  // lower left corner
						  " "      + String(gr_lwall) + ","  + String(gr_up + gr_del) +          //
						  " "      + String(gr_lwall + gr_r ) + "," + String(gr_up + gr_del) + 
						  " L"     + String(gr_rwall - gr_r ) + "," + String(gr_up + gr_del) +          // point before lower right corner
						  " C"     + String(gr_rwall - gr_r ) + "," + String(gr_up + gr_del ) + 		   // lower right corner
						  " "      + String(gr_rwall) + "," + String(gr_up + gr_del) + 
						  " "      + String(gr_rwall) + "," + String(gr_up + gr_del - gr_r ) + 
						  " L"     + String(gr_rwall ) + "," + String(gr_up + gr_r) +            // point before upper right corner
						  " C"     + String(gr_rwall ) + "," + String(gr_up + gr_r) +            // right upper corner
						  " "      + String(gr_rwall) + "," + String(gr_up) + 
						  " "      + String(gr_rwall + gr_r) + "," + String(gr_up) +   
						  " L"     + String(gr_xright) + "," + String(gr_up);    // right point
						  
						  //console.log(graph_string);
						  
		return (graph_string);
	 
	 }

			     // Calculate graph
     function TransitGraph(eDist, sDist, angle){
	 
		var eposx, eposy, sposx, sposy;
		var cdist2;
		var gr="M50,450 ";
		
		
		// the total length of each part of the line should be 150px; 
		
		// move to the end of the line (first part) - temporary - remove when finished
		
		eposx = center.x ;
		eposy = center.y + eDist * Math.sin( angle * Math.PI / 180. ) ;
		sposx = center.x ;
		sposy = center.y - sDist * Math.sin( angle * Math.PI / 180. ) ;
		cdist2 = (eposx - sposx) * (eposx - sposx) + (eposy - sposy) * (eposy - sposy);

		if( cdist2 >= (radius.sun + radius.earth) * (radius.sun + radius.earth) ){
			gr += "l";
			gr += 300;
			gr += ",0 ";
			dratio = 0;
		} else {
			gr += GetCurve();
		}

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
			if( zOrder == 1) {planet.toBack(); path2.toBack();  zOrder=2;} else {planet.toFront(); zOrder=1;};
		}

        
		// Function to create an orbit for the Earth
		Raphael.el.animateSystem = function(pathE, pathS, pathG, duration, repetitions) {

			var gelement = ipoint;
			gelement.path = pathG;
			gelement.pathLen = gelement.path.getTotalLength();    
		
			var selement = sun;
			selement.path = pathS;
			selement.pathLen = selement.path.getTotalLength();    

			var element = this;
			element.path = pathE;
			element.pathLen = element.path.getTotalLength();    
			duration = (typeof duration === "undefined") ? speed : duration;
			repetitions = (typeof repetitions === "undefined") ? 1 : repetitions;

			paper.customAttributes.along = function(v) {
			var point = this.path.getPointAtLength(v * this.pathLen),
						attrs = { cx: point.x, cy: point.y };
			this.rotateWith && (attrs.transform = 'r'+point.alpha) ;
			return attrs;
			};    

			selement.attr({along:0});
			var anim = Raphael.animation({along: 1}, duration);
			selement.animate(anim.repeat(repetitions)); 

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
			path1 = paper.path( EarthHalf(1, eDist, vangle)).attr( { stroke:  '#5b6469','stroke-dasharray':"--",  opacity: 0.3 }).insertAfter(planet);
			planet.toFront();
			path2 = paper.path( EarthHalf(-1, eDist, vangle)).attr( { stroke:  '#5b6469', 'stroke-dasharray':"--", opacity: 0.3 }).toBack();
			planet.animateSystem(eorbit, sorbit, igraph, speed, Infinity);
			
		}


		function objUpdate (){
			planet.remove(); //sunglow.removeData(); 
			sun.remove(); 
			igraph.remove();
			ipoint.remove();
			dipvalue.remove();

			sun = paper.circle(200, 200, radius.sun).attr( { fill: "r(.35,.35) #FFFFAA-#DEAD49", stroke: '#DEAD49', 'stroke-width': 2, opacity: 1 });
			planet = paper.circle(337.5, 200, radius.earth).attr({ fill: "r(0.45,0.45) #618bA9-#215b69", "stroke": "#215b69", "stroke-width": "0.5", "stroke-linejoin": "round"});

			// update graph;
			igraph = paper.path(TransitGraph(eDist, sDist, vangle)).attr({ stroke: "#ffffff"});
			ipoint = paper.circle(50, 450, 3).attr( { fill: '#EFBE5A', stroke: '#FFF' });

			dipvalue = paper.text(125, 425, DecimalToSimpleString( dratio )).attr({fill: '#fff'});
			dipvalue.id = 'IDdipValue';
			
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
			document.getElementById("ratio").innerHTML = DecimalToString( ratio );
			
			
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
		var path1 = paper.path(EarthHalf(1, eDist, vangle)).attr( { stroke:  '#5b6469', 'stroke-dasharray':"--", opacity: 0.3 })  //.insertAfter(planet);
		path1.id = 'IDfrontpath';
		//planet.toFront();

		// back path
		var path2 = paper.path(EarthHalf(-1, eDist, vangle)).attr( { stroke:  '#5b6469','stroke-dasharray':"--",  opacity: 0.3 })  //.toBack();
		path2.id = 'IDbackpath';
		
		//Set the order:
		planet.toFront();
		path1.toBack();
		sun.toBack();
		path2.toBack();
		

		var xaxis = paper.path("M50,470l300,0,l-3,-2,l0,4,l3,-2").attr({ stroke: "#5b6469", opacity: 0.5});
		var yaxis = paper.path("M50,425l-2,3l4,0l-2,-3l0,50").attr({ stroke: "#5b6469", opacity: 0.5});
		var igraph = paper.path(TransitGraph(eDist, sDist, vangle)).attr({ stroke: "#ffffff"});
		
		var ipoint = paper.circle(50, 450, 3).attr( { fill: '#EFBE5A', stroke: '#FFF' });
		ipoint.id = 'IDpoint';
		
		var diptext = paper.text(125, 410, "Transit Depth").attr({fill: '#09c'});
		diptext.id = 'IDdipTitle';
		
		var dipvalue = paper.text(125, 425, DecimalToSimpleString( dratio )).attr({fill: '#fff'});
		dipvalue.id = 'IDdipValue';
		
		// axes labels
		var xlabel = paper.text(340,487,"Time").attr({fill: '#09c'});
		xlabel.id = 'IDxlabel';
		var ylabel = paper.text(30,450,"Brightness").attr({fill: '#09c'}).transform("r-90");
		ylabel.id = 'IDxlabel';
		var one = paper.text(45,445,"1").attr({fill: '#fff'});
		var zero = paper.text(45,475,"0").attr({fill: '#fff'});
		
		// add animation 
		planet.animateSystem(eorbit, sorbit, igraph, speed, Infinity);
		
		//calculate the radii ratio
		var tstring = Number(ratio.toPrecision(3)).toExponential();
		tstring = tstring.replace(/e/g," &times; 10^");
		var strarray = tstring.split("^");
		tstring = strarray[0] + (strarray[1]).sup();
		document.getElementById("ratio").innerHTML= tstring;

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
				tdist = Math.round(10.0 * relDist - 10);
				Dist = Math.round(DIST_NORMAL + (DIST_NORMAL - DIST_MIN) * tdist / 9.0);
			} else {
				tdist = Math.round( (relDist - 1.) / 11.0);
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