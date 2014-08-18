// global values
	var zOrder = 1;    				 		// z-order of the Sun and the planet
	
	var SUN_R_NORMAL = 45;
	var SUN_R_MAX = 60;
	var SUN_R_MIN = 25;
	
	var EARTH_R_NORMAL = 10;  // was 12.5
	var EARTH_R_MAX = 35;
	var EARTH_R_MIN = 5;
	
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
	
	// Create orbit path for the planet
	function EarthOrbit(Dist, angle) {
		var eorbit="M" + (center.x + Dist) + ",200 R";
		for( var i=0; i < 72; i++ ){
			eorbit += center.x + Dist * Math.cos( i * Math.PI/36 );
			eorbit +=",";
			eorbit += center.y +  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin( i * Math.PI/36 );
			eorbit +=" ";
		}
		eorbit  +="z";
		return(eorbit);
	}

	// Create orbit path for the sun
	function SunOrbit(Dist, angle) {
		var sorbit="M" + (center.x - Dist) + ",200 R";
		for( var i=0; i < 36; i++ ){
			sorbit += center.x - Dist * Math.cos( i * Math.PI/18 );
			sorbit +=",";
			sorbit += center.y -  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin( i * Math.PI/18 );
			sorbit +=" ";
		}
		sorbit  +="z";
		return(sorbit);
	}



	function EarthHalf( half, Dist, angle) {
		var eorbit="M" + (center.x + Dist * half) + ",200 R";
		for( var i=0; i <= 36; i++ ){
			eorbit += center.x + Dist * Math.cos( i * Math.PI/36 ) * half;
			eorbit +=",";
			eorbit += center.y +  Dist * Math.sin( angle * Math.PI / 180. ) * Math.sin( i * Math.PI/36 ) * half;
			eorbit +=" ";
		}
		return(eorbit);
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
			if( zOrder ==1) { planet.toBack(); path2.toBack();  zOrder=2;} else { planet.toFront(); zOrder=1;};
		}

        

		// Function to create an orbit for the Earth
		Raphael.el.animateSystem = function(pathE, pathS, duration, repetitions) {

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

			element.attr({along:0});
			var anim1 = Raphael.animation({along: 1}, duration);
			var anim2 = Raphael.animation({transform:"" }, Math.round(speed/2), flip );
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
			planet.animateSystem(eorbit, sorbit, speed, nreps);
		}



		function objUpdate (){
			planet.remove(); //sunglow.removeData(); 
			sun.remove(); 
			//sunglow.remove(); 

			sun = paper.circle(200, 200, radius.sun).attr( { fill: "r(.35,.35) #FFFFAA-#DEAD49", stroke: '#DEAD49', 'stroke-width': 2, opacity: 1 });

			planet = paper.circle(337.5, 200, radius.earth).attr({ fill: "r(0.45,0.45) #618bA9-#215b69", "stroke": "#215b69", "stroke-width": "0.5", "stroke-linejoin": "round"});
		}

		// Calculate new value of period and force
		function updatePeriod(){

			var tstring;
			var strarray;
			var period = Math.round(365 * Math.sqrt( relDist * relDist *relDist * 330001/(330000*relMassSun + relMassEarth)));


			//convert the value to the string and update the field of Earth years
			if (period >=1 & period <= 999){
				tstring = (period).toPrecision(3);
				document.getElementById("period").innerHTML = tstring;
			} else {
				tstring = Number((period).toPrecision(3)).toExponential();
				tstring = tstring.replace(/e/g," &times; 10^");
				strarray = tstring.split("^");
				tstring = strarray[0] + (strarray[1]).sup();
				document.getElementById("period").innerHTML = tstring;
			}

			//convert the value to the string and update the field of Earth years
			if (period >=365 & period <= 364635){
				tstring = (period / 365.0).toPrecision(3);
				document.getElementById("years").innerHTML = tstring;
			} else {
				tstring = Number((period/365.0).toPrecision(3)).toExponential();
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

			//convert the value to the string and update the field of Earth years
			var force = ( relMassSun * relMassEarth / (relDist * relDist) );
			if (force >=1 & force <= 999){
				tstring = force.toPrecision(3);
				document.getElementById("force").innerHTML= tstring;
			} else {
				tstring = Number(force.toPrecision(3)).toExponential();
				tstring = tstring.replace(/e/g," &times; 10^");
				strarray = tstring.split("^");
				tstring = strarray[0] + (strarray[1]).sup();
				document.getElementById("force").innerHTML= tstring;
			}
		}

		function updateALL(){
			updatePeriod();
			objUpdate();  // recreate the planet and the star
			animUpdate();
		}

		// Create scene
		var paper = new Raphael(canvas, 400, 400);
		paper.id = 'IDcanvas';

		// create a planet and the sun
		var sun = paper.circle(200+sDist, 200, radius.sun).attr( { fill: "r(.35,.35) #FFFFAA-#DEAD49", stroke: '#DEAD49', 'stroke-width': 2, opacity: 1 });
		sun.id = 'IDsun';
		var planet = paper.circle(200+eDist, 200, radius.earth).attr({ fill: "r(0.45,0.45) #618bA9-#215b69", "stroke": "#215b69", "stroke-width": "0.5", "stroke-linejoin": "round"});
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
		

		// add animation 
		planet.animateSystem(eorbit, sorbit, speed, nreps);

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
				Dist = Math.round(137.5 + 25 * tdist / 9.0);
			} else {
				relDist = 11.0 * tdist + 1;
				Dist = Math.round(175 + 37.5 * (tdist - 9) / 9.0);
			}	

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
				Dist = Math.round(137.5 + 25 * tdist / 9.0);
			} else {
				tdist =  (relDist - 1.) / 11.0;
				Dist = Math.round(175 + 37.5 * (tdist - 9) / 9.0);
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
			
			// update textbox with the valid value
			if(relDist < 10){
				document.getElementById("inputdist").value= String(relDist.toPrecision(2));
				document.getElementById("txtdist").innerHTML=  String(relDist.toPrecision(2))  ;
			} else {
				document.getElementById("inputdist").value= String(relDist.toPrecision(3));
				document.getElementById("txtdist").innerHTML=  String(relDist.toPrecision(3))  ;
			}

			// update slider
			dslider.value = tdist;
			$(dslider).change();


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
				radius.sun = Math.round(SUN_R_NORMAL + (SUN_R_NORMAL - SUN_R_MIN) * newv / 9.0);
			} else {
				relMassSun = Math.pow((1. + newv), 0.8) ;
				relRadSun = (1.0 + newv)  ;
				radius.sun = Math.round(SUN_R_MAX - (SUN_R_MAX - SUN_R_NORMAL) * ( 9 - newv ) / 9.0);
			}	

			// update text box
			document.getElementById("inputsmass").value=  String( relMassSun.toPrecision(2) ) ;
			document.getElementById("inputsrad").value=  String( relRadSun.toPrecision(2) ) ;
			document.getElementById("txtsmass").innerHTML= String( relMassSun.toPrecision(2) ) ;
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
				radius.sun = Math.round(SUN_R_NORMAL + (SUN_R_NORMAL - SUN_R_MIN) * newv / 9.0);
			} else {
				newv= Math.pow(relMassSun ,1.25) - 1 ;
				relRadSun = (1.0 + newv)  ;
				radius.sun = Math.round(SUN_R_MAX - (SUN_R_MAX - SUN_R_NORMAL) * ( 9 - newv ) / 9.0);
			}	

			// update slider
			smslider.value = newv;
			$(smslider).change();

			srslider.value = newv;
			$(srslider).change();

			// update textbox with the valid value
			// update text box
			document.getElementById("inputsmass").value=  String( relMassSun.toPrecision(2) ) ;
			document.getElementById("inputsrad").value=  String( relRadSun.toPrecision(2) ) ;
			document.getElementById("txtsmass").innerHTML= String( relMassSun.toPrecision(2) ) ;
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
			document.getElementById("inputsrad").value=  String( relRadSun.toPrecision(2) ) ;
			document.getElementById("txtsmass").innerHTML= String( relMassSun.toPrecision(2) ) ;
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
			document.getElementById("inputsrad").value=  String( relRadSun.toPrecision(2) ) ;
			document.getElementById("txtsmass").innerHTML= String( relMassSun.toPrecision(2) ) ;
			document.getElementById("txtsrad").innerHTML= String( relRadSun.toPrecision(2) ) ;

			// update animation
			updateALL();

		});

		// handle slider change of the planet mass
		$("#pmass").change(function(){

			// get the value 
			var newv= parseFloat(pmslider.value);
			var news= parseFloat(smslider.value);
			
			console.log("slider planet mass:" + newv);
			if (newv < 0){
				relMassEarth = 1.0 + newv*0.5 / 9.0;
			} else {
				relMassEarth = 2999.0 * newv / 9.0 + 1.0 ;
			}	

			console.log("slider relMassEarth:" + relMassEarth);
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


		// handle textbox change of planet mass
		$("#inputpmass").change(function(){


 			var newv;
			var news= parseFloat(smslider.value);

			// get the value of the viewing angle
			relMassEarth = parseFloat($(this).val());
			console.log("text input relMassEarth:" + relMassEarth);

			// insure the valid value
			if ( isNaN(relMassEarth) ) relMassEarth= 1;
			if (relMassEarth < 0.5) relMassEarth = 0.5;
			if (relMassEarth > 3000) relMassEarth = 3000;

			// From the relDist value get the value for the slider:
			if (relMassEarth <= 1){
				newv = 18.0 * relMassEarth - 18.0;
			} else {
				newv = (relMassEarth  - 1.0) * 9.0 / 2999.0;
			}	

			console.log("text slider value:" + newv);
			// update slider
			pmslider.value = newv;
			$(pmslider).change();

			console.log("text relMassEarth:" + relMassEarth);
			
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
				newv = (18.0 * relRadEarth - 18.0);
				radius.earth = Math.round(EARTH_R_NORMAL + (EARTH_R_NORMAL - EARTH_R_MIN) * newv / 9.0);
			} else {
				newv = (relRadEarth  - 1.0) * 9.0 / 49.0;
				radius.earth = Math.round(EARTH_R_MAX - (EARTH_R_MAX - EARTH_R_NORMAL)* ( 9 - newv ) / 9.0);
			}	

			// update slider
			prslider.value = newv;
			$(prslider).change();

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


		// handle reset button click
		reset_button.onclick = function(){

			//console.log("reset");


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