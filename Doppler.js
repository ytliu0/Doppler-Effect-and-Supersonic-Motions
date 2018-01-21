"use strict";

var t; // global time for linear motion simulation
var dt; // time between two frames in ms
var tend; // time to stop the linear motion simulation
var animate_id, animateCir_id;
var initPos; // initial position of the wave source (0='far left', 1='center')
var c=1; // wave speed
var v,f, tend;
// circular motion parameters
var tCir; // global time for circular motion simulation
var tendCir // time to stop the circilar motion simulation
var vc, fc, r, L, omg, tCir;

function init() {
  v = 0.5; // speed of the source
  t = 0; 
  tCir = 0;
  dt = 20; 
  f = 3; // wave frequency (# of peaks per second)
    
  // linear motion
  initPos = 0; // initial position of the source set to 'far left'
  document.getElementById("v").value = v;
  document.getElementById("f").value = f;
  document.getElementById("initPos0").checked = true;
  document.getElementById("initPos1").checked = false;
  //document.getElementById("timeLinear").innerHTML = "t = "+t.toPrecision(3)+" s";
  var xmax = 10;
  var xmin = 0;
  var ymin = -5;
  var ymax = 5;
  // Draw a sample figure on the Canvas
  draw_init_linear(xmax,xmin,ymax,ymin);
    
  // circular motion
  L = 6;
  r = 1;
  vc = 0.5;
  fc = 3;
  var xmaxCir = L/2;
  var xminCir = -L/2;
  var ymaxCir = L/2;
  var yminCir = -L/2;
  document.getElementById("circularV").value = vc;
  document.getElementById("circularF").value = fc;
  document.getElementById("circularL").value = L;
  document.getElementById("circularR").value = r;
    
  // Draw a sample figure on the Canvas
  draw_init_circular(xmaxCir,xminCir,ymaxCir,yminCir);
}

// control the initial position of wave source radio button
function initPosition(val) {
    if (val==0) {
        document.getElementById("initPos0").checked = true;
        document.getElementById("initPos1").checked = false;
    } else {
        document.getElementById("initPos0").checked = false;
        document.getElementById("initPos1").checked = true;
    }
}

// Play animation for wave source in linear motion
function play_animate_linear() {
  clearInterval(animate_id);
  t = 0;
  var paras = document.forms["linearParameters"];
  v = parseFloat(paras["v"].value);
  f = parseFloat(paras["f"].value);
    
  // validate inputs
  var text, err = false;
  if (isNaN(v)) {
        text = "Invalid input! You entered a non-numerical value for v<sub>s</sub>!"
        err = true;
  }
  if (isNaN(f)) {
        if (!err) {
            text = "Invalid input! You entered a non-numerical value for f!";
            err = true;
        } else {
            text += "<br />Invalid input! You entered a non-numerical value for f!";
        }
   }
   if (v < 0 || v > 10) {
       if (!err) {
            text = "Please enter a value of v<sub>s</sub> between 0 and 10.";
            err = true;
        } else {
            text += "<br />Please enter a value of v<sub>s</sub> between 0 and 10.";
        }
   }
   if (f < 1 || f > 10) {
       if (!err) {
            text = "Please enter a value of f between 1 and 10.";
            err = true;
        } else {
            text += "<br />Please enter a value of f between 1 and 10.";
        }
   }
   if (err) {
       document.getElementById("linearError").style.color="red";
       document.getElementById("linearError").innerHTML = text;
       clearCanvas('animation');
   } else {
       document.getElementById("linearPause").value = "Pause";
       document.getElementById("linearStart").style.display = "none";
       document.getElementById("linearPlaying").style.display = "inline";
       document.getElementById("linearError").innerHTML = "";
       document.getElementById("notesLinear").style.display = "inline";
       var xmax = 10*Math.max(c,v); // maximum x
       var xmin = 0;
       initPos = 0;
       if (paras["initPos1"].checked) {
          initPos = 1;
          xmax = 5*Math.max(c,v);
          xmin = -xmax;
        }
        if (v > c) {
            document.getElementById("linearBoxSize").innerHTML = 
                "Size of the box = 10 s<sup>-1</sup>/v";
        } else {
            document.getElementById("linearBoxSize").innerHTML = 
                "Size of the box = 10 s<sup>-1</sup>/c";
        }
        tend = (xmax-xmin)/(v+1e-5);// time to stop the animation
        var ymax = (xmax-xmin)/2;
        var ymin = -ymax;
        var Canvas = document.getElementById('animation');
        var Width = Canvas.width;
        var Height = Canvas.height;
        var scale = Height/(2*ymax);
        var rangeX = xmax-xmin;
        var rangeY = 2*ymax;
        var graph_parameters = {"xmax":xmax, "xmin":xmin, "ymin":ymin, "ymax":ymax, 
                              "w":Width, "h":Height, "scale":scale, "rangeX":rangeX,
                             "rangeY":rangeY}
        animate_id = setInterval(function() {animate_linear(graph_parameters)},dt);
   }
}

// Pause and Resume animation for linear motion
function linearPauseResume() {
    var action = document.getElementById("linearPause").value;
    if (action=="Pause") {
        clearInterval(animate_id);
        document.getElementById("linearPause").value = "Resume";
    } else {
        // Can't change the parameters upon resume
        // reset the parameters to the old values
        document.getElementById("v").value = v;
        document.getElementById("f").value = f;
        var xmax,xmin,ymax,ymin;
        if (initPos ==0) {
            document.getElementById("initPos0").checked = true;
            document.getElementById("initPos1").checked = false; 
            xmax = 10*Math.max(c,v);
            xmin = 0;
        } else {
            document.getElementById("initPos0").checked = false;
            document.getElementById("initPos1").checked = true; 
            xmax = 5*Math.max(c,v);
            xmin = -xmax;
        }
        ymax = (xmax-xmin)/2;
        ymin = -ymax;
        document.getElementById("linearPause").value = "Pause";
        var Canvas = document.getElementById('animation');
        var Width = Canvas.width;
        var Height = Canvas.height;
        var scale = Height/(2*ymax);
        var rangeX = xmax-xmin;
        var rangeY = 2*ymax;
        var graph_parameters = {"xmax":xmax, "xmin":xmin, "ymin":ymin, "ymax":ymax, 
                          "w":Width, "h":Height, "scale":scale, "rangeX":rangeX,
                         "rangeY":rangeY}
        animate_id = setInterval(function() {animate_linear(graph_parameters)},dt); 
    }
}

// Animate Doppler Effect for linear motion
function animate_linear(gpar) {
    t += dt*1e-3;
    if (t > tend || t*v > gpar.xmax) {
        clearInterval(animate_id);
        document.getElementById("linearStartPlayButton").value = "Replay";
        document.getElementById("linearPlaying").style.display = "none";
        document.getElementById("linearStart").style.display = "inline";
    }
    document.getElementById("timeLinear").innerHTML = "t = "+t.toPrecision(3)+" s";
    var nwaves = Math.floor(t*f)+1; // Number of wavefronts emitted so far
    var Canvas = document.getElementById('animation');
    var Ctx = Canvas.getContext('2d');
    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    var i,xemit,rwave,temit,xg;
    var yg = -gpar.ymin/gpar.rangeY * gpar.h;
    // wavefronts definitely outside the plot range if c(t-temit) > rangeX
    // temit = i/f ==> i > f(t - rangeX/c)
    var imin = Math.floor(f*(t-gpar.rangeX/c)-1); // -1 added to be safe
    imin = Math.max(imin,0);
    // draw wavefronts
    for (i=imin; i<nwaves; i++) {
        temit = i/f; // emission time
        xemit = temit*v; // emission x-position
        rwave = (t-temit)*c; // radius of the wavefront
        xg = (xemit - gpar.xmin)/gpar.rangeX * gpar.w;
        Ctx.beginPath();
        Ctx.arc(xg, yg, rwave*gpar.scale, 0, 2*Math.PI);
        Ctx.strokeStyle = "red";
        Ctx.stroke();
    }
    // Draw the wave-emitting source
    var x = t*v;
    xg = (x-gpar.xmin)/gpar.rangeX * gpar.w;
    Ctx.beginPath();
    Ctx.arc(xg, yg, 3, 0, 2*Math.PI);
    Ctx.fillStyle = "black"
    Ctx.fill();
}

// Draw a sample figure on the canvas for linear motion when the page is loaded
function draw_init_linear(xmax,xmin,ymax,ymin) {
    var tdraw = 11.6;
    document.getElementById("timeLinear").innerHTML = "t = "+tdraw.toPrecision(3)+" s";
    var nwaves = Math.floor(tdraw*f)+1; // Number of wavefronts emitted so far
    var Canvas = document.getElementById('animation');
    var Ctx = Canvas.getContext('2d');
    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    var rangeX = xmax-xmin, rangeY = ymax-ymin;
    var scale = Canvas.height/rangeY;
    var i,xemit,rwave,temit,xg;
    var yg = 0.5 * Canvas.height;
    // wavefronts definitely outside the plot range if c(t-temit) > rangeX
    // temit = i/f ==> i > f(t - rangeX/c)
    var imin = Math.floor(f*(tdraw-rangeX/c)-1); // -1 added to be safe
    imin = Math.max(imin,0);
    // draw wavefronts
    for (i=imin; i<nwaves; i++) {
        temit = i/f; // emission time
        xemit = temit*v; // emission x-position
        rwave = (tdraw-temit)*c; // radius of the wavefront
        xg = (xemit - xmin)/rangeX * Canvas.width;
        Ctx.beginPath();
        Ctx.arc(xg, yg, rwave*scale, 0, 2*Math.PI);
        Ctx.strokeStyle = "red";
        Ctx.stroke();
    }
    // Draw the wave-emitting source
    var x = tdraw*v;
    xg = (x-xmin)/rangeX * Canvas.width;
    Ctx.beginPath();
    Ctx.arc(xg, yg, 3, 0, 2*Math.PI);
    Ctx.fillStyle = "black"
    Ctx.fill();
}

// Clear canvas
function clearCanvas(canvas_name) {
  var Canvas = document.getElementById(canvas_name);
  var Ctx = Canvas.getContext('2d');
  Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
}

// Play animation for wave source in circular motion
function play_animate_circular() {
  clearInterval(animateCir_id);
  tCir = 0;
  var paras = document.forms["circularParameters"];
  vc = parseFloat(paras["circularV"].value);
  fc = parseFloat(paras["circularF"].value);
  L  = parseFloat(paras["circularL"].value);
  r  = parseFloat(paras["circularR"].value);
    
  // validate inputs
  var text, err = false;
  if (isNaN(vc)) {
        text = "Invalid input! You entered a non-numerical value for v<sub>s</sub>!"
        err = true;
  }
  if (isNaN(fc)) {
        if (!err) {
            text = "Invalid input! You entered a non-numerical value for f!";
            err = true;
        } else {
            text += "<br />Invalid input! You entered a non-numerical value for f!";
        }
   }
   if (isNaN(L)) {
        if (!err) {
            text = "Invalid input! You entered a non-numerical value for L!";
            err = true;
        } else {
            text += "<br />Invalid input! You entered a non-numerical value for L!";
        }
   }
  if (isNaN(r)) {
        if (!err) {
            text = "Invalid input! You entered a non-numerical value for r<sub>s</sub>!";
            err = true;
        } else {
            text += "<br />Invalid input! You entered a non-numerical value for r<sub>s</sub>!";
        }
   }
   if (vc < 0 || vc > 10) {
       if (!err) {
            text = "Please enter a value of v<sub>s</sub> between 0 and 10.";
            err = true;
        } else {
            text += "<br />Please enter a value of v<sub>s</sub> between 0 and 10.";
        }
   }
   if (fc < 1 || fc > 10) {
       if (!err) {
            text = "Please enter a value of f between 1 and 10.";
            err = true;
        } else {
            text += "<br />Please enter a value of f between 1 and 10.";
        }
   }
   if (L <= 0) {
      if (!err) {
            text = "Please enter a positive value for L.";
            err = true;
        } else {
            text += "<br />Please enter a positive value for L.";
        } 
   }
   if (r <= 0) {
      if (!err) {
            text = "Please enter a positive value for r<sub>s</sub>.";
            err = true;
        } else {
            text += "<br />Please enter a positive value for r<sub>s</sub>.";
        } 
   }
   if (err) {
       document.getElementById("circularError").style.color="red";
       document.getElementById("circularError").innerHTML = text;
       clearCanvas('circularAnimation');
   } else {
       document.getElementById("circularPause").value = "Pause";
       document.getElementById("circularStart").style.display = "none";
       document.getElementById("circularPlaying").style.display = "inline";
       document.getElementById("circularError").innerHTML = "";
       document.getElementById("notesCircular").style.display = "inline";
       var xmaxCir = 0.5*L; // maximum x
       var xminCir = -xmaxCir;
       var ymaxCir = xmaxCir;
       var yminCir = -ymaxCir;
       tendCir = Math.max(1.2*L/c,10,6*Math.PI*r/vc);// time to stop the animation
       omg = vc/r;
       var CanvasCir = document.getElementById('circularAnimation');
       var Width = CanvasCir.width;
       var Height = CanvasCir.height;
       var scale = Height/L;
       var rangeX = L;
       var rangeY = L;
       var graph_parameters = {"xmax":xmaxCir, "xmin":xminCir, "ymin":yminCir, "ymax":ymaxCir, 
                              "w":Width, "h":Height, "scale":scale, "rangeX":rangeX,
                             "rangeY":rangeY}
        animateCir_id = setInterval(function() {animate_circular(graph_parameters)},dt);
   }
}

// Pause and Resume animation for circular motion
function circularPauseResume() {
    var action = document.getElementById("circularPause").value;
    if (action=="Pause") {
        clearInterval(animateCir_id);
        document.getElementById("circularPause").value = "Resume";
    } else {
        // Can't change the parameters upon resume
        // reset the parameters to the old values
        document.getElementById("circularV").value = vc;
        document.getElementById("circularF").value = fc;
        document.getElementById("circularL").value = L;
        document.getElementById("circularR").value = r;
        document.getElementById("circularPause").value = "Pause";
        var xmax = 0.5*L;
        var xmin = -xmax;
        var ymax = xmax, ymin = xmin;
        var CanvasCir = document.getElementById('circularAnimation');
        var Width = CanvasCir.width;
        var Height = CanvasCir.height;
        var scale = Height/L;
        var rangeX = L;
        var rangeY = L;
        var graph_parameters = {"xmax":xmax, "xmin":xmin, "ymin":ymin, "ymax":ymax, 
                          "w":Width, "h":Height, "scale":scale, "rangeX":rangeX,
                         "rangeY":rangeY}
        animateCir_id = setInterval(function() {animate_circular(graph_parameters)},dt); 
    }
}

// Animate Doppler Effect for circular motion
function animate_circular(gpar) {
    tCir += dt*1e-3;
    if (tCir > tendCir) {
        clearInterval(animateCir_id);
        document.getElementById("circularStartPlayButton").value = "Replay";
        document.getElementById("circularPlaying").style.display = "none";
        document.getElementById("circularStart").style.display = "inline";
    }
    document.getElementById("timeCircular").innerHTML = "t = "+tCir.toPrecision(3)+" s";
    var nwaves = Math.floor(tCir*fc)+1; // Number of wavefronts emitted so far
    var CanvasCir = document.getElementById('circularAnimation');
    var CtxCir = CanvasCir.getContext('2d');
    CtxCir.clearRect(0, 0, CanvasCir.width, CanvasCir.height);
    var i,phi_emit,xemit,yemit,rwave,temit,xg,yg;
    // wavefronts definitely outside the plot range if c(t-temit) > rangeX
    // temit = i/f ==> i > f(t - rangeX/c)
    var imin = Math.floor(fc*(tCir-gpar.rangeX/c)-1); // -1 added to be safe
    imin = Math.max(imin,0);
    // draw wavefronts
    for (i=imin; i<nwaves; i++) {
        temit = i/fc; // emission time
        phi_emit = omg*temit; // phase at emission
        xemit = r*Math.cos(phi_emit); // emission x-position
        yemit = r*Math.sin(phi_emit); // emission y-position
        rwave = (tCir-temit)*c; // radius of the wavefront
        xg = (xemit - gpar.xmin)/gpar.rangeX * gpar.w;
        yg = (gpar.ymax - yemit)/gpar.rangeY * gpar.h;
        CtxCir.beginPath();
        CtxCir.arc(xg, yg, rwave*gpar.scale, 0, 2*Math.PI);
        CtxCir.strokeStyle = "red";
        CtxCir.stroke();
    }
    
    // Draw the shock surface parametrized by lambda (see documentation)
    if (vc >= c && tCir>0) {
        var sqrtb2_1 = Math.sqrt(vc*vc-1); //sqrt(beta^2-1)
        // Find the minimum value of lambda where the radius of the shock 
        // is < rangeX/sqrt(2) so it is possible to be inside the simulation box
        var lam_min = tCir - (0.5*gpar.rangeX*gpar.rangeX - r*r)/
                                  (Math.sqrt(0.5*gpar.rangeX*gpar.rangeX - r*r/vc/vc) + 
                                   r/vc*sqrtb2_1);
        lam_min = Math.max(lam_min,0);
        // np: number of points to draw the curve: set between 100 and 50*omg*(t-lam_min)/(2*pi)
        var np = Math.max(100,Math.floor(8*omg*(tCir-lam_min))); 
        var dlam = (tCir-lam_min)/np;
        CtxCir.beginPath();
        for (i=0; i<np; i++) {
            var lam = tCir - i*dlam; // set lambda from t to lam_min+dlam
            var comg = Math.cos(omg*lam), somg = Math.sin(omg*lam);
            var u1 = c*(tCir-lam)/vc;
            var u2 = u1*sqrtb2_1;
            // (x,y) location of one shock surface on x-y plane
            var xs1 = (r+u2)*comg - u1*somg;
            var ys1 = (r+u2)*somg + u1*comg;
            xg = (xs1-gpar.xmin)/gpar.rangeX * gpar.w;
            yg = (gpar.ymax - ys1)/gpar.rangeY * gpar.h;
            if (i==0) {
                CtxCir.moveTo(xg,yg);
            } else {
                CtxCir.lineTo(xg,yg);
            }
        }
        CtxCir.strokeStyle = "blue";
        CtxCir.stroke();
        CtxCir.beginPath();
        
        lam_min = tCir - (r/vc*sqrtb2_1 + 
                                   Math.sqrt(0.5*gpar.rangeX*gpar.rangeX - r*r/vc/vc));
        lam_min = Math.max(lam_min,0);
        // np: number of points to draw the curve: set between 100 and 50*omg*(t-lam_min)/(2*pi)
        np = Math.max(100,Math.floor(8*omg*(tCir-lam_min))); 
        dlam = (tCir-lam_min)/np;
        for (i=0; i<np; i++) {
            var lam = tCir - i*dlam;
            var comg = Math.cos(omg*lam), somg = Math.sin(omg*lam);
            var u1 = c*(tCir-lam)/vc;
            var u2 = u1*sqrtb2_1;
            // (x,y) location of another shock surface on x-y plane
            var xs1 = (r-u2)*comg - u1*somg;
            var ys1 = (r-u2)*somg + u1*comg;
            xg = (xs1-gpar.xmin)/gpar.rangeX * gpar.w;
            yg = (gpar.ymax - ys1)/gpar.rangeY * gpar.h;
            if (i==0) {
                CtxCir.moveTo(xg,yg);
            } else {
                CtxCir.lineTo(xg,yg);
            }
        }
        CtxCir.stroke();
    }
    
    // Draw the wave-emitting source
    var phi = omg*tCir;
    var x = r*Math.cos(phi);
    var y = r*Math.sin(phi);
    xg = (x-gpar.xmin)/gpar.rangeX * gpar.w;
    yg = (gpar.ymax - y)/gpar.rangeY * gpar.h;
    CtxCir.beginPath();
    CtxCir.arc(xg, yg, 3, 0, 2*Math.PI);
    CtxCir.fillStyle = "black"
    CtxCir.fill();
     // Draw center with an o
    CtxCir.font="16px Serif";
    CtxCir.fillText("o", 0.5*gpar.w, 0.5*gpar.h);
}

// Draw a sample figure for the circular motion when the page loads.
function draw_init_circular(xmax,xmin,ymax,ymin) {
    var tdraw = 37.5;
    document.getElementById("timeCircular").innerHTML = "t = "+tdraw.toPrecision(3)+" s";
    var nwaves = Math.floor(tdraw*fc)+1; // Number of wavefronts emitted so far
    var CanvasCir = document.getElementById('circularAnimation');
    var CtxCir = CanvasCir.getContext('2d');
    CtxCir.clearRect(0, 0, CanvasCir.width, CanvasCir.height);
    var rangeX = xmax-xmin, rangeY = ymax-ymin;
    var scale = CanvasCir.height/rangeY;
    var i,phi_emit,xemit,yemit,rwave,temit,xg,yg;
    omg = vc/r;
    // wavefronts definitely outside the plot range if c(t-temit) > rangeX
    // temit = i/f ==> i > f(t - rangeX/c)
    var imin = Math.floor(fc*(tdraw-rangeX/c)-1); // -1 added to be safe
    imin = Math.max(imin,0);
    // draw wavefronts
    for (i=imin; i<nwaves; i++) {
        temit = i/fc; // emission time
        phi_emit = omg*temit; // phase at emission
        xemit = r*Math.cos(phi_emit); // emission x-position
        yemit = r*Math.sin(phi_emit); // emission y-position
        rwave = (tdraw-temit)*c; // radius of the wavefront
        xg = (xemit - xmin)/rangeX * CanvasCir.width;
        yg = (ymax - yemit)/rangeY * CanvasCir.height;
        CtxCir.beginPath();
        CtxCir.arc(xg, yg, rwave*scale, 0, 2*Math.PI);
        CtxCir.strokeStyle = "red";
        CtxCir.stroke();
    }
    // Draw the wave-emitting source
    var phi = omg*tdraw;
    var x = r*Math.cos(phi);
    var y = r*Math.sin(phi);
    xg = (x-xmin)/rangeX * CanvasCir.width;
    yg = (ymax - y)/rangeY * CanvasCir.height;
    CtxCir.beginPath();
    CtxCir.arc(xg, yg, 3, 0, 2*Math.PI);
    CtxCir.fillStyle = "black"
    CtxCir.fill();
     // Draw center with an o
    CtxCir.font="16px Serif";
    CtxCir.fillText("o", 0.5*CanvasCir.width, 0.5*CanvasCir.height);
}