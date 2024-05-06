var speed = 100; // speed of wobbling, lower is faster
var height = 3; // height of wobbling in pixels

var wobtxt,
  wobble,
  wobcnt = 0;

window.onload = function () {
  if (document.getElementById) {
    var i, wobli;
    wobble = document.getElementById("wobble");
    wobtxt = wobble.firstChild.nodeValue;
    while (wobble.childNodes.length) wobble.removeChild(wobble.childNodes[0]);
    for (i = 0; i < wobtxt.length; i++) {
      wobli = document.createElement("span");
      wobli.setAttribute("id", "wobb" + i);
      wobli.style.position = "relative";
      wobli.appendChild(document.createTextNode(wobtxt.charAt(i)));
      wobble.appendChild(wobli);
    }
    setInterval("wobbler()", speed);
  }
};

function wobbler() {
  for (var i = 0; i < wobtxt.length; i++)
    document.getElementById("wobb" + i).style.top =
      Math.round(height * Math.sin(i + wobcnt)) + "px";
  wobcnt++;
}
