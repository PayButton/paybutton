!function(r,x){"use strict";for(var F="length",m=[null,[[10,7,17,13],[1,1,1,1],[]],[[16,10,28,22],[1,1,1,1],[4,16]],[[26,15,22,18],[1,1,2,2],[4,20]],[[18,20,16,26],[2,1,4,2],[4,24]],[[24,26,22,18],[2,1,4,4],[4,28]],[[16,18,28,24],[4,2,4,4],[4,32]],[[18,20,26,18],[4,2,5,6],[4,20,36]],[[22,24,26,22],[4,2,6,6],[4,22,40]],[[22,30,24,20],[5,2,8,8],[4,24,44]],[[26,18,28,24],[5,4,8,8],[4,26,48]],[[30,20,24,28],[5,4,11,8],[4,28,52]],[[22,24,28,26],[8,4,11,10],[4,30,56]],[[22,26,22,24],[9,4,16,12],[4,32,60]],[[24,30,24,20],[9,4,16,16],[4,24,44,64]],[[24,22,24,30],[10,6,18,12],[4,24,46,68]],[[28,24,30,24],[10,6,16,17],[4,24,48,72]],[[28,28,28,28],[11,6,19,16],[4,28,52,76]],[[26,30,28,28],[13,6,21,18],[4,28,54,80]],[[26,28,26,26],[14,7,25,21],[4,28,56,84]],[[26,28,28,30],[16,8,25,20],[4,32,60,88]],[[26,28,30,28],[17,8,25,23],[4,26,48,70,92]],[[28,28,24,30],[17,9,34,23],[4,24,48,72,96]],[[28,30,30,30],[18,9,30,25],[4,28,52,76,100]],[[28,30,30,30],[20,10,32,27],[4,26,52,78,104]],[[28,26,30,30],[21,12,35,29],[4,30,56,82,108]],[[28,28,30,28],[23,12,37,34],[4,28,56,84,112]],[[28,30,30,30],[25,12,40,34],[4,32,60,88,116]],[[28,30,30,30],[26,13,42,35],[4,24,48,72,96,120]],[[28,30,30,30],[28,14,45,38],[4,28,52,76,100,124]],[[28,30,30,30],[29,15,48,40],[4,24,50,76,102,128]],[[28,30,30,30],[31,16,51,43],[4,28,54,80,106,132]],[[28,30,30,30],[33,17,54,45],[4,32,58,84,110,136]],[[28,30,30,30],[35,18,57,48],[4,28,56,84,112,140]],[[28,30,30,30],[37,19,60,51],[4,32,60,88,116,144]],[[28,30,30,30],[38,19,63,53],[4,28,52,76,100,124,148]],[[28,30,30,30],[40,20,66,56],[4,22,48,74,100,126,152]],[[28,30,30,30],[43,21,70,59],[4,26,52,78,104,130,156]],[[28,30,30,30],[45,22,74,62],[4,30,56,82,108,134,160]],[[28,30,30,30],[47,24,77,65],[4,24,52,80,108,136,164]],[[28,30,30,30],[49,25,81,68],[4,28,56,84,112,140,168]]],l=/^\d*$/,c=/^[A-Za-z0-9 $%*+\-./:] * $ /,s=/^[A-Z0-9 $%*+\-./:] * $ /,v=[],h=[-1],t=0,e=1;t<255;++t)v.push(e),h[e]=t,e=2*e^(128<=e?285:0);for(var p=[[]],a=0;a<30;++a){for(var n=p[a],o=[],u=0;u<=a;++u){var f=u<a?v[n[u]]:0,i=v[(a+(n[u-1]||0))%255];o.push(h[f^i])}p.push(o)}for(var d={},g=0;g<45;++g)d["0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(g)]=g;var w=[function(r,t){return(r+t)%2==0},function(r){return r%2==0},function(r,t){return t%3==0},function(r,t){return(r+t)%3==0},function(r,t){return((r/2|0)+(t/3|0))%2==0},function(r,t){return r*t%2+r*t%3==0},function(r,t){return(r*t%2+r*t%3)%2==0},function(r,t){return((r+t)%2+r*t%3)%2==0}],b=function(r){return 6<r},C=function(r,t){var e,a,n,o=-8&(a=m[e=r],n=16*e*e+128*e+64,b(e)&&(n-=36),a[2][F]&&(n-=25*a[2][F]*a[2][F]-10*a[2][F]-55),n),u=m[r];return o-=8*u[0][t]*u[1][t]},y=function(r,t){switch(t){case 1:return r<10?10:r<27?12:14;case 2:return r<10?9:r<27?11:13;case 4:return r<10?8:16;case 8:return r<10?8:r<27?10:12}},M=function(r,t,e){var a=C(r,e)-4-y(r,t);switch(t){case 1:return 3*(a/10|0)+(a%10<4?0:a%10<7?1:2);case 2:return 2*(a/11|0)+(a%11<6?0:1);case 4:return a/8|0;case 8:return a/13|0}},A=function(r,t){for(var e=r.slice(0),a=r[F],n=t[F],o=0;o<n;++o)e.push(0);for(var u=0;u<a;){var f=h[e[u++]];if(0<=f)for(var i=0;i<n;++i)e[u+i]^=v[(f+t[i])%255]}return e.slice(a)},N=function(r,t,e,a){for(var n=r<<a,o=t-1;0<=o;--o)n>>a+o&1&&(n^=e<<o);return r<<a|n},k=function(r,t,e){for(var a=w[e],n=r[F],o=0;o<n;++o)for(var u=0;u<n;++u)t[o][u]||(r[o][u]^=a(o,u));return r},L=function(r,t,e,a){for(var n=r[F],o=21522^N(e<<3|a,5,1335,10),u=0;u<15;++u){var f=[n-1,n-2,n-3,n-4,n-5,n-6,n-7,n-8,7,5,4,3,2,1,0][u];r[[0,1,2,3,4,5,7,8,n-7,n-6,n-5,n-4,n-3,n-2,n-1][u]][8]=r[8][f]=o>>u&1}return r},R=function(r){for(var t=function(r){for(var t=0,e=0;e<r[F];++e)5<=r[e]&&(t+=r[e]-5+3);for(var a=5;a<r[F];a+=2){var n=r[a];r[a-1]===n&&r[a-2]===3*n&&r[a-3]===n&&r[a-4]===n&&(r[a-5]>=4*n||r[a+1]>=4*n)&&(t+=40)}return t},e=r[F],a=0,n=0,o=0;o<e;++o){var u,f=r[o];u=[0];for(var i=0;i<e;){var l;for(l=0;i<e&&f[i];++l)++i;for(u.push(l),l=0;i<e&&!f[i];++l)++i;u.push(l)}a+=t(u),u=[0];for(var c=0;c<e;){var s;for(s=0;c<e&&r[c][o];++s)++c;for(u.push(s),s=0;c<e&&!r[c][o];++s)++c;u.push(s)}a+=t(u);var v=r[o+1]||[];n+=f[0];for(var h=1;h<e;++h){var p=f[h];n+=p,f[h-1]===p&&v[h]===p&&v[h-1]===p&&(a+=3)}}return a+=10*(Math.abs(n/e/e-.5)/.05|0)},S=function(r,t,e,a,n){var o=m[t],u=function(r,t,e,a){var n=[],o=0,u=8,f=e[F],i=function(r,t){if(u<=t){for(n.push(o|r>>(t-=u));8<=t;)n.push(r>>(t-=8)&255);o=0,u=8}0<t&&(o|=(r&(1<<t)-1)<<(u-=t))},l=y(r,t);switch(i(t,4),i(f,l),t){case 1:for(var c=2;c<f;c+=3)i(parseInt(e.substring(c-2,c+1),10),10);i(parseInt(e.substring(c-2),10),[0,4,7][f%3]);break;case 2:for(var s=1;s<f;s+=2)i(45*d[e.charAt(s-1)]+d[e.charAt(s)],11);f%2==1&&i(d[e.charAt(s-1)],6);break;case 4:for(var v=0;v<f;++v)i(e[v],8)}for(i(0,4),u<8&&n.push(o);n[F]+1<a;)n.push(236,17);return n[F]<a&&n.push(236),n}(t,e,r,C(t,a)>>3);u=function(r,t,e){for(var a=[],n=r[F]/t|0,o=0,u=t-r[F]%t,f=0;f<u;++f)a.push(o),o+=n;for(var i=u;i<t;++i)a.push(o),o+=n+1;a.push(o);for(var l=[],c=0;c<t;++c)l.push(A(r.slice(a[c],a[c+1]),e));for(var s=[],v=r[F]/t|0,h=0;h<v;++h)for(var p=0;p<t;++p)s.push(r[a[p]+h]);for(var d=u;d<t;++d)s.push(r[a[d+1]-1]);for(var g=0;g<e[F];++g)for(var m=0;m<t;++m)s.push(l[m][g]);return s}(u,o[1][a],p[o[0][a]]);var f=function(r){for(var t=m[r],e=4*r+17,f=[],i=[],a=0;a<e;++a)f.push([]),i.push([]);var n=function(r,t,e,a,n){for(var o=0;o<e;++o)for(var u=0;u<a;++u)f[r+o][t+u]=n[o]>>u&1,i[r+o][t+u]=1};n(0,0,9,9,[127,65,93,93,93,65,383,0,64]),n(e-8,0,8,9,[256,127,65,93,93,93,65,127]),n(0,e-8,9,8,[254,130,186,186,186,130,254,0,0]);for(var o=9;o<e-8;++o)f[6][o]=f[o][6]=1&~o,i[6][o]=i[o][6]=1;for(var u=t[2],l=u[F],c=0;c<l;++c)for(var s=0===c?l-1:l,v=0===c||c===l-1?1:0;v<s;++v)n(u[c],u[v],5,5,[31,17,21,17,31]);if(b(r))for(var h=N(r,6,7973,12),p=0,d=0;d<6;++d)for(var g=0;g<3;++g)f[d][e-11+g]=f[e-11+g][d]=h>>p++&1,i[d][e-11+g]=i[e-11+g][d]=1;return{matrix:f,reserved:i}}(t),i=f.matrix,l=f.reserved;if(function(r,t,e){for(var a=r[F],n=0,o=-1,u=a-1;0<=u;u-=2){6===u&&--u;for(var f=o<0?a-1:0,i=0;i<a;++i){for(var l=u;u-2<l;--l)t[f][l]||(r[f][l]=e[n>>3]>>(7&~n)&1,++n);f+=o}o=-o}}(i,l,u),n<0){k(i,l,0),L(i,0,a,0);var c=0,s=R(i);for(k(i,l,0),n=1;n<8;++n){k(i,l,n),L(i,0,a,n);var v=R(i);v<s&&(s=v,c=n),k(i,l,n)}n=c}return k(i,l,n),L(i,0,a,n),i},$="appendChild",E="createElement",z="createElementNS",D="setAttributeNS",G={generate:function(r,t){var e=t||{},a={numeric:1,alphanumeric:2,octet:4},n={L:1,M:0,Q:3,H:2},o=e.version||-1,u=n[(e.ecclevel||"L").toUpperCase()],f=e.mode?a[e.mode.toLowerCase()]:-1,i="mask"in e?e.mask:-1;if(f<0)f="string"==typeof r?r.match(l)?1:r.match(s)?2:4:4;else if(1!==f&&2!==f&&4!==f)throw"invalid or unsupported mode";if(null===(r=function(r,t){switch(r){case 1:return t.match(l)?t:null;case 2:return t.match(c)?t.toUpperCase():null;case 4:if("string"!=typeof t)return t;for(var e=[],a=0;a<t[F];++a){var n=t.charCodeAt(a);n<128?e.push(n):n<2048?e.push(192|n>>6,128|63&n):n<65536?e.push(224|n>>12,128|n>>6&63,128|63&n):e.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n)}return e}}(f,r)))throw"invalid data format";if(u<0||3<u)throw"invalid ECC level";if(o<0){for(o=1;o<=40&&!(r[F]<=M(o,f,u));++o);if(40<o)throw"too large data"}else if(o<1||40<o)throw"invalid version";if(-1!==i&&(i<0||8<i))throw"invalid mask";return S(r,o,f,u,i)},generateHTML:function(r,t){for(var e=t||{},a=e.fillcolor?e.fillcolor:"#FFFFFF",n=e.textcolor?e.textcolor:"#000000",o=G.generate(r,e),u=Math.max(e.modulesize||5,.5),f=Math.max(null!==e.margin?e.margin:4,0),i=x[E]("div"),l=o[F],c=['<table border="0" cellspacing="0" cellpadding="0" style="border:'+u*f+"px solid "+a+";background:"+a+'">'],s=0;s<l;++s){c.push("<tr>");for(var v=0;v<l;++v)c.push('<td style="width:'+u+"px;height:"+u+"px"+(o[s][v]?";background:"+n:"")+'"></td>');c.push("</tr>")}i.className="qrcode";var h=x.createRange();h.selectNodeContents(i);var p=h.createContextualFragment(c.join("")+"</table>");return i[$](p),i},generateSVG:function(r,t){var e=t||{},a=e.fillcolor?e.fillcolor:"#FFFFFF",n=e.textcolor?e.textcolor:"#000000",o=G.generate(r,e),u=o[F],f=Math.max(e.modulesize||5,.5),i=Math.max(e.margin?e.margin:4,0),l=f*(u+2*i),c=x[z]("http://www.w3.org/2000/svg","svg");c[D](null,"viewBox","0 0 "+l+" "+l),c[D](null,"style","shape-rendering:crispEdges");var s="qrcode"+Date.now();c[D](null,"id",s);var v=x.createDocumentFragment(),h=x[z]("http://www.w3.org/2000/svg","style");h[$](x.createTextNode("#"+s+" .bg{fill:"+a+"}#"+s+" .fg{fill:"+n+"}")),v[$](h);var p=function(r,t,e,a,n){var o=x[z]("http://www.w3.org/2000/svg","rect")||"";return o[D](null,"class",r),o[D](null,"fill",t),o[D](null,"x",e),o[D](null,"y",a),o[D](null,"width",n),o[D](null,"height",n),o};v[$](p("bg","none",0,0,l));for(var d=i*f,g=0;g<u;++g){for(var m=i*f,w=0;w<u;++w)o[g][w]&&v[$](p("fg","none",m,d,f)),m+=f;d+=f}return c[$](v),c},generatePNG:function(r,t){var e,a=t||{},n=a.fillcolor||"#FFFFFF",o=a.textcolor||"#000000",u=G.generate(r,a),f=Math.max(a.modulesize||5,.5),i=Math.max(null!==a.margin&&void 0!==a.margin?a.margin:4,0),l=u[F],c=f*(l+2*i),s=x[E]("canvas");if(s.width=s.height=c,!(e=s.getContext("2d")))throw"canvas support is needed for PNG output";e.fillStyle=n,e.fillRect(0,0,c,c),e.fillStyle=o;for(var v=0;v<l;++v)for(var h=0;h<l;++h)u[v][h]&&e.fillRect(f*(i+h),f*(i+v),f,f);return s.toDataURL()}};r.QRCode=G}("undefined"!=typeof window?window:this,document);
//# sourceMappingURL=qrjs2.min.js.map

// Create an immediately invoked functional expression to wrap our code
(function() {

// Define our constructor 
this.Modal = function() {

// Create global element references
this.closeButton = null;
this.modal = null;
this.overlay = null;

// Determine proper prefix
this.transitionEnd = transitionSelect();

// Define option defaults 
var defaults = {
autoOpen: false,
className: 'fade-and-drop',
content: "",
maxWidth: 270,
minWidth: 264,
overlay: true
}

// Create options by extending defaults with the passed in arugments
if (arguments[0] && typeof arguments[0] === "object") {
this.options = extendDefaults(defaults, arguments[0]);
}

if(this.options.autoOpen === true) this.open();

}

// Public Methods

Modal.prototype.close = function() {
var _ = this;
this.modal.className = this.modal.className.replace(" paybutton-open", "");
this.overlay.className = this.overlay.className.replace(" paybutton-open",
"");
this.modal.addEventListener(this.transitionEnd, function() {
_.modal.parentNode.removeChild(_.modal);
});
this.overlay.addEventListener(this.transitionEnd, function() {
if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
});
}

Modal.prototype.open = function() {
buildOut.call(this);
initializeEvents.call(this);
window.getComputedStyle(this.modal).height;
this.modal.className = this.modal.className +
(this.modal.offsetHeight > window.innerHeight ?
" paybutton-open paybutton-anchored" : " paybutton-open");
this.overlay.className = this.overlay.className + " paybutton-open";
}

// Private Methods

function buildOut() {

var content, contentHolder, docFrag, resultHolder, inp;

/*
 * If content is an HTML string, append the HTML string.
 * If content is a domNode, append its content.
 */

if (typeof this.options.content === "string") {
content = this.options.content;
} else {
content = this.options.content.innerHTML;
}

// Create a DocumentFragment to build with
docFrag = document.createDocumentFragment();

// Create modal element
this.modal = document.createElement("div");
this.modal.className = "paybutton-modal " + this.options.className;
this.modal.style.minWidth = this.options.minWidth + "px";
this.modal.style.maxWidth = this.options.maxWidth + "px";


// If overlay is true, add one
if (this.options.overlay === true) {
this.overlay = document.createElement("div");
this.overlay.className = "paybutton-overlay " + this.options.className;
docFrag.appendChild(this.overlay);
}

// Create content area and append to modal
contentHolder = document.createElement("div");
contentHolder.className = "paybutton-content";
contentHolder.id = "modal-content";
contentHolder.innerHTML = content;
this.modal.appendChild(contentHolder);


//resultHolder = document.createElement("div");
//resultHolder.className = "paybutton-content";
//resultHolder.innerHTML = this.options.amountMessage;
//this.modal.appendChild(resultHolder);
 

//// Create content area and append to modal
//resultHolder = document.createElement("div");
//resultHolder.className = "paybutton-content";
//resultHolder.id = "result";
//resultHolder.innerHTML = this.options.amountMessage;
//this.modal.appendChild(resultHolder);


// Append modal to DocumentFragment
docFrag.appendChild(this.modal);

// Append DocumentFragment to body
document.body.appendChild(docFrag);

}

function extendDefaults(source, properties) {
var property;
for (property in properties) {
if (properties.hasOwnProperty(property)) {
source[property] = properties[property];
}
}
return source;
}

function initializeEvents() {

if (this.closeButton) {
this.closeButton.addEventListener('click', this.close.bind(this));
}

if (this.overlay) {
this.overlay.addEventListener('click', this.close.bind(this));
}

}

 function transitionSelect() {
var el = document.createElement("div");
if (el.style.WebkitTransition) return "webkitTransitionEnd";
if (el.style.OTransition) return "oTransitionEnd";
return 'transitionend';
}

}());



// * begin function detect and send data to badger wallet
function sendToBadger (toAddress, bchAmount, successField, successMsg, successCallback, amountMessage) {

bchAmount = bchAmount * 100000000;

if (typeof web4bch !== "undefined") {
web4bch = new Web4Bch(web4bch.currentProvider);

// detect if wallet is locked
if (!web4bch.bch.defaultAccount){
alert("Please unlock Badger Wallet before continuing.");

} else {

var txParams = {
to: toAddress,
from: web4bch.bch.defaultAccount,
value: bchAmount

};

// check for errors else proceed with success messages
web4bch.bch.sendTransaction(txParams, (err, res) => {
if (err) {
console.log("Error", err);
} else {
console.log("Confirmed. Transaction ID:", res);

var successFieldExists = document.getElementById(successField);

if (!successMsg) {
successMsg = "Transaction Successful!";
}


if (!successFieldExists) {
var success = document.getElementById("modal-content");
success.innerHTML =

' <div> ' +
' <div> ' +
' <div> ' +
' <div class="amountdiv"><span>'+successMsg+'</span></div> ' +
' </div> ' +
' <div> ' +
' <div class="amountdiv"><span>View: </span><a href="https://explorer.bitcoin.com/bch/tx/'+res+'" target="_blank" style="color: orangeRed; text-decoration: none;">Transaction</a></div>' +
' </div> ' +
' </div> ' +
' </div> ';

} else {
document.getElementById(successField).innerText = successMsg;
}


//}

if (successCallback) {
//alert("hi");
window[successCallback](res);
}

}
});
}

} else {

// notify user of wallet
//window.open('https://badgerwallet.cash')
alert("To use Badger Wallet for this transaction, Please visit:\n\nhttps://badger.bitcoin.com for installation instructions.");
}

}
// * end function detect and send data to badger wallet


function copy(that){
var inp = document.createElement('input');
inp.value = that
document.body.appendChild(inp)
inp.select();
document.execCommand('copy', false);
inp.remove();
alert("Bitcoin Cash address copied!");
}



function openModal (toAddress, bchAmount, successField, successMsg, successCallback, amountMessage, anyAmount) {

// qr code generation
if (!anyAmount) {
qrData = toAddress + "?amount=" + bchAmount;
URI = toAddress + "?amount=" + bchAmount;
} else {
qrData = toAddress;
URI = toAddress;
}
var qrParams = {
ecclevel: "Q",
fillcolor: "#FFFFFF",
textcolor: "#000000",
margin: "0.5",
modulesize: 12
};

//if (document.implementation.hasFeature("http://www.w3.org/2000/svg","1.1")) {
//genQR = QRCode.generateSVG(qrData, qrParams);
//var XMLS = new XMLSerializer();
//genQR = XMLS.serializeToString(genQR);
//genQR = "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(genQR)));
//qrImage = genQR;
	
//} else {
genQR = QRCode.generatePNG(qrData, qrParams);
qrImage = genQR;
//}

var pbContent =

'<div>' +
'<div>' +
'<div>' +
'<div class="qrparent" onclick=copy(\''+URI+'\')>' +
'<img class="qrcode" src="'+qrImage+'"  width="256" />' +
'<img class="qricon" src="https://i.imgur.com/fpxx8mp.png" width="70" />' +
'<div class="qrctc">Click to Copy</div>'+
'</div>' +
'</div>' +
'<div>' +
'<div class="amountdiv"><span>'+amountMessage+'</span></div> ' +
'</div>' +
'<div>' +
'<div><a href="'+URI+'"><button class="pbmodal-button"><span>Send with BitcoinCash Wallet</span></button></a></div>' +
'</div>' +
'<div>' +
'<div><button class = "pbmodal-button" onclick="sendToBadger(\''+toAddress+'\', \''+bchAmount+'\', \''+successField+'\', \''+successMsg+'\', \''+successCallback+'\')"><span>Send with Badger Wallet</span></button></div> ' +
'</div>' +
'</div>' +
'</div>';


var pbModal = new Modal({
content: pbContent,
amountMessage: ""
});

pbModal.open();

}


// * begin function query to obtain bch price
function getBCHPrice (buttonAmount, amountType, toAddress, successField, successMsg, successCallback, bchAmount, amountMessage) {

var fiatRequest = new XMLHttpRequest();
fiatRequest.open('GET', 'https://index-api.bitcoin.com/api/v0/cash/price/' + amountType, true);

fiatRequest.onload = function() {
if (fiatRequest.readyState == 4 && fiatRequest.status == 200) {

var fiatData = JSON.parse(fiatRequest.responseText);

if (fiatData.price != "") {

// determine amount of satoshi based on button value
var addDecimal = fiatData.price / 100;
bchAmount = (1 / addDecimal) * buttonAmount;
bchAmount = bchAmount.toFixed(8);


amountMessage = (buttonAmount + " " + amountType + " = " + bchAmount + " BCH");

openModal(toAddress, bchAmount, successField, successMsg, successCallback, amountMessage);


} else {
console.log("Error Price Not Found");
}

} else {
console.log("Found Server But There Is An Error");
}
};

fiatRequest.onerror = function() {
console.log("Could Not Connect To Server");
};

fiatRequest.send();

}
// * end function query to obtain bch price


// insert info into button on mouseover
function mouseOver() {
buttonText2 = this.getAttribute("button-text-2") || ""; buttonText2 = buttonText2.trim();
if (!buttonText2) {
showAmount = this.getAttribute('amount') || ""; showAmount = Number(showAmount.trim());
showType = this.getAttribute('amount-type') || ""; showType = showType.trim().toUpperCase();
buttonText2 = showAmount + " " + showType;
if (!showAmount || !showType) {
buttonText2 = "Click to send BCH";
}
}
this.innerHTML = ("<span>"+buttonText2+"</span>");
if (!('ontouchend' in window))this.addEventListener('mouseout', mouseOut, false);
if ('ontouchend' in window)this.addEventListener('touchend', mouseOut, false);
}


// insert info into button on mouseout
function mouseOut() {
buttonText = this.getAttribute("button-text") || ""; buttonText = buttonText.trim();
if (!buttonText) {
showAmount = this.getAttribute('amount') || ""; showAmount = Number(showAmount.trim());
showType = this.getAttribute('amount-type') || ""; showType = showType.trim().toUpperCase();
buttonText = "Pay with Bitcoin Cash";
if (!showAmount || !showType) {
buttonText = "Pay with Bitcoin Cash";
}
}
this.innerHTML = ("<span>" + buttonText + "</span>");
}


// DOM listen
document.addEventListener("DOMContentLoaded", function(){

// pull in buttons found
var payButton = document.getElementsByClassName("pay-button");

for (var i = 0; i < payButton.length; i++) {

var payButtons = payButton[i];
var buttonText = payButtons.getAttribute("button-text") || ""; buttonText = buttonText.trim();
buttonAmount = payButtons.getAttribute("amount") || ""; buttonAmount = Number(buttonAmount.trim());
amountType = payButtons.getAttribute("amountType") || ""; amountType = amountType.trim().toUpperCase();

//console.log(buttonText, buttonAmount, amountType);

if (!buttonText){
buttonText = "Pay with Bitcoin Cash";
if (!buttonAmount || !amountType) {
buttonText = "Pay with Bitcoin Cash";
}
}
payButtons.innerHTML = "<span>"+buttonText+"</span>";

if (!('ontouchstart' in window))payButtons.addEventListener('mouseover', mouseOver.bind(payButtons), false);
if ('ontouchstart' in window)payButtons.addEventListener('touchstart', mouseOver.bind(payButtons), false);

// pull in attribute info from button when clicked
payButtons.addEventListener("click", function(pbEvent) {
var buttonAmount = this.getAttribute("amount") || ""; buttonAmount = Number(buttonAmount.trim());
var amountType = this.getAttribute("amount-type") || ""; amountType = amountType.trim().toUpperCase();
var toAddress = this.getAttribute("address") || ""; toAddress = toAddress.trim();
var successField = this.getAttribute("success-field") || ""; successField = successField.trim();
var successMsg = this.getAttribute("success-msg") || ""; successMsg = successMsg.trim();
var successCallback = this.getAttribute("success-callback") || ""; successCallback = successCallback.trim();

var bchAmount; var amountMessage; var anyAmount;

// bch address attribute missing
if (!toAddress) {
alert("PayButton Error:\n\nBelow are the minimum button requirements\n\n1. address (Bitcoin Cash address)");
return;
}

// missing one of two amount attributes, alert
if (buttonAmount || amountType) {
if (!buttonAmount || !amountType) {
alert ("PayButton Error:\n\nFor specific PayButton amounts, BOTH of the following MUST be set:\n\n1. amount (Must be a number)\n2. amount-type (Can be BCH, Satoshi, USD, AUD etc)\n\nTo allow \"Any\" amount, BOTH must be blank.");
return;
}
} else {
anyAmount = true;
amountMessage = "Send any amount of Bitcoin Cash";
//amountMessage = "";
bchAmount = null;
}

// check for any amount else convert
if (!anyAmount) {

// check if amount type is set to bch or fiat
if (amountType == "BCH" || amountType == "SATOSHI") {
bchAmount = buttonAmount;

if (amountType == "SATOSHI") {
bchAmount = bchAmount / 100000000;
}
bchAmount = bchAmount.toFixed(8);

// display bch amount in modal
amountMessage = (bchAmount + " BCH");

// send bch tx data to modal
openModal(toAddress, bchAmount, successField, successMsg, successCallback, amountMessage, anyAmount);

} else {
// send fiat tx data to fiat/bch conversion
getBCHPrice (buttonAmount, amountType, toAddress, successField, successMsg, successCallback, bchAmount, amountMessage);
}

} else {
openModal(toAddress, bchAmount, successField, successMsg, successCallback, amountMessage, anyAmount);
}

});
}

});

var cssId = 'pbCSS';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://paybutton.cash/modal-test/modal-test.css';
    link.media = 'all';
    head.appendChild(link);
}
