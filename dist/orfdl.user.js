// ==UserScript==
// @name         ORF DL
// @namespace    https://github.com/lemon3/
// @version      0.5.3
// @description  orf tvthek video download helper
// @author       lemon3
// @match        https://*.tvthek.orf.at/*
// @icon         https://raw.githubusercontent.com/lemon3/orfdl/main/_assets/dl.svg
// @grant        none
// @run-at       document-end
// @license      MIT
// @copyright    lemon3
// @homepage     https://github.com/lemon3/orfdl
// @updateURL    https://raw.githubusercontent.com/lemon3/orfdl/main/dist/orfdl.meta.js
// @downloadURL  https://raw.githubusercontent.com/lemon3/orfdl/main/dist/orfdl.user.js
// ==/UserScript==

!function(){"use strict";var n={406:function(n,e,t){var o=t(815),r=t.n(o),i=t(383),a=t.n(i),l=t(277),c=t.n(l),s=new URL(t(297),t.b),u=new URL(t(446),t.b),d=new URL(t(554),t.b),p=a()(r()),f=c()(s),g=c()(u),y=c()(d);p.push([n.id,"#l3-4776 {\n  --color-1: #000;\n  --color-2: #222;\n  --color-3: #90a8c2;\n  --color-4: #c9c9c9;\n  --color-5: #222222;\n  --font-small: 12px;\n  --font-tiny: 10px;\n}\n\n#l3-4776 {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 99999;\n  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;\n  color: var(--color-4);\n}\n\n#l3-4776 .l3-4776-info {\n  font-size: var(--font-small);\n}\n\n#l3-4776-body .l3-4776-info {\n  padding: 15px;\n}\n\n#l3-4776-clear {\n  color: var(--color-1);\n  background-color: var(--color-3);\n  width: 32px;\n  height: 38px;\n  text-align: center;\n  box-sizing: border-box;\n  padding: 0;\n  flex: none;\n  text-align: center;\n  justify-content: center;\n  padding: 0.5em;\n  cursor: pointer;\n}\n\n#l3-4776-header {\n  width: 100%;\n  padding: 15px;\n}\n\n#l3-4776-filter {\n  display: flex;\n  align-items: stretch;\n  margin-top: 0.5em;\n}\n\n#l3-4776-content {\n  max-height: 260px;\n  overflow: scroll;\n}\n\n#l3-4776-close {\n  z-index: 999999;\n  position: absolute;\n  top: 19px;\n  left: 15px;\n  padding: 0;\n  background-image: url("+f+");\n  background-repeat: no-repeat;\n  width: 38px;\n  height: 38px;\n  background-size: 20px;\n  background-color: var(--color-1);\n  border-radius: 50%;\n  background-position: center center;\n  box-shadow: 0 2px 12px -3px rgba(255, 255, 255, 0.8);\n  cursor: pointer;\n}\n\n#l3-4776-close.open {\n  background-image: url("+g+");\n}\n\n#l3-4776-field {\n  font-size: 16px;\n  touch-action: none;\n  padding: 8px;\n  height: 38px;\n  border: 0;\n  border-radius: 0;\n  color: var(--color-2);\n  width: 100%;\n}\n\n#l3-4776-field:focus {\n  outline: none;\n}\n\n#l3-4776-box {\n  z-index: 999999;\n  box-sizing: border-box;\n  margin: 0px;\n  top: 64px;\n  max-width: 280px;\n  width: 280px;\n  background-color: var(--color-1);\n  transform: translateX(-100%);\n  position: relative;\n  transition: transform 0.1s ease-out;\n  /* box-shadow: 0 8px 15px -6px rgba(255, 255, 255, 0.3); */\n  border: 1px solid var(--color-5);\n}\n\n#l3-4776-box.open {\n  transform: translateX(0);\n  transition: transform 0.2s ease-out;\n}\n\n#l3-4776 .l3-4776-shareBtn {\n  background-image: url("+y+");\n  width: 32px;\n  height: 32px;\n  background-color: var(--color-3);\n  display: flex;\n  background-size: 80%;\n  background-repeat: no-repeat;\n  background-position: center center;\n  flex: none;\n  border: none;\n}\n\n#l3-4776 .l3-4776-result {\n  display: flex;\n  flex-flow: row wrap;\n  padding: 1em;\n}\n\n#l3-4776 .l3-4776-result:nth-child(odd) {\n  background-color: var(--color-5);\n}\n\n#l3-4776 .l3-4776-bar {\n  width: 100%;\n  flex: 1 1 100%;\n  font-size: var(--font-small);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.5em;\n}\n\n#l3-4776 .l3-4776-title {\n  display: flex;\n  padding: 0.5em 0.5em 0.5em 0;\n  line-height: 1.4em;\n}\n\n/* textarea */\n/* #l3-4776 .l3-4776-ta {\n  border: none;\n  border-radius: 0;\n  padding: 0.5em;\n  font-size: 12px;\n  line-height: 1.1em;\n  box-sizing: border-box;\n  flex: 0 1 40% !important;\n  resize: none;\n  touch-action: none;\n} */\n\n#l3-4776 .l3-4776-copy {\n  font-size: 30px;\n}\n\n#l3-4776 .l3-4776-imgWrap {\n  width: 100%;\n  display: flex;\n  position: relative;\n}\n\n#l3-4776 .l3-4776-copy {\n  position: absolute;\n  text-align: center;\n  width: 100%;\n  left: 0;\n  top: 35%;\n  background-color: rgba(0,0,0,0.4);\n  padding: 10px;\n  opacity: 0;\n  transition: opacity ease-out 0.2s;\n}\n\n#l3-4776 .success .l3-4776-copy {\n  opacity: 1;\n}\n\n#l3-4776 .active {\n  box-shadow: 0 0 0 2px rgb(255, 255, 84);\n  filter: brightness(1.2);\n}\n\n#l3-4776-footer {\n  font-size: var(--font-tiny);\n  text-align: right;\n}\n",""]),e.Z=p},383:function(n){n.exports=function(n){var e=[];return e.toString=function(){return this.map((function(e){var t="",o=void 0!==e[5];return e[4]&&(t+="@supports (".concat(e[4],") {")),e[2]&&(t+="@media ".concat(e[2]," {")),o&&(t+="@layer".concat(e[5].length>0?" ".concat(e[5]):""," {")),t+=n(e),o&&(t+="}"),e[2]&&(t+="}"),e[4]&&(t+="}"),t})).join("")},e.i=function(n,t,o,r,i){"string"==typeof n&&(n=[[null,n,void 0]]);var a={};if(o)for(var l=0;l<this.length;l++){var c=this[l][0];null!=c&&(a[c]=!0)}for(var s=0;s<n.length;s++){var u=[].concat(n[s]);o&&a[u[0]]||(void 0!==i&&(void 0===u[5]||(u[1]="@layer".concat(u[5].length>0?" ".concat(u[5]):""," {").concat(u[1],"}")),u[5]=i),t&&(u[2]?(u[1]="@media ".concat(u[2]," {").concat(u[1],"}"),u[2]=t):u[2]=t),r&&(u[4]?(u[1]="@supports (".concat(u[4],") {").concat(u[1],"}"),u[4]=r):u[4]="".concat(r)),e.push(u))}},e}},277:function(n){n.exports=function(n,e){return e||(e={}),n?(n=String(n.__esModule?n.default:n),/^['"].*['"]$/.test(n)&&(n=n.slice(1,-1)),e.hash&&(n+=e.hash),/["'() \t\n]|(%20)/.test(n)||e.needQuotes?'"'.concat(n.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):n):n}},815:function(n){n.exports=function(n){return n[1]}},554:function(n){n.exports="data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNTYgMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMWQxZDFiIj48cGF0aCBkPSJtMjA0LjMgMjQyLjdoLTE1Mi42Yy00LjEgMC03LjUtMy40LTcuNS03LjV2LTEyOC4xYzAtNC4xIDMuNC03LjUgNy41LTcuNWg1MC4xYzQuMSAwIDcuNSAzLjQgNy41IDcuNXMtMy40IDcuNS03LjUgNy41aC00Mi42djExMy4yaDEzNy42di0xMTMuMmgtNDIuNmMtNC4xIDAtNy41LTMuNC03LjUtNy41czMuNC03LjUgNy41LTcuNWg1MC4xYzQuMSAwIDcuNSAzLjQgNy41IDcuNXYxMjguMmMwIDQuMS0zLjQgNy40LTcuNSA3LjR6Ii8+PHBhdGggZD0ibTEyOCAxNzguM2MtNC4xIDAtNy41LTMuNC03LjUtNy41di0xMzIuN2wtMzUuMiAzNS4yYy0yLjkgMi45LTcuNyAyLjktMTAuNiAwcy0yLjktNy43IDAtMTAuNmw0Ny45LTQ3LjljLjEtLjEuMy0uMy40LS40IDEuMi0xIDIuNi0xLjYgNC0xLjguNS0uMSAxLS4xIDEuNCAwIDEuNy4xIDMuNS44IDQuOCAyLjJsNDggNDhjMS41IDEuNSAyLjIgMy40IDIuMiA1LjNzLS43IDMuOC0yLjIgNS4zYy0yLjkgMi45LTcuNyAyLjktMTAuNiAwbC0zNS4yLTM1LjJ2MTMyLjdjLjEgNC0zLjMgNy40LTcuNCA3LjR6Ii8+PC9nPjwvc3ZnPg=="},297:function(n){n.exports="data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNTYgMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIj48cGF0aCBkPSJtMjQzLjIgMTE5LjZ2MTYuOGgtMjMwLjR2LTE2Ljh6Ii8+PHBhdGggZD0ibTI0My4yIDE3NC42djE2LjhoLTIzMC40di0xNi44eiIvPjxwYXRoIGQ9Im0yNDMuMiA2NC42djE2LjhoLTIzMC40di0xNi44eiIvPjwvZz48L3N2Zz4="},446:function(n){n.exports="data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNTYgMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMjQ2LjUgMjM0LjctMTA2LjctMTA2LjcgMTA2LjctMTA2LjctMTEuOC0xMS45LTEwNi43IDEwNi43LTEwNi43LTEwNi42LTExLjggMTEuOSAxMDYuNiAxMDYuNi0xMDYuNiAxMDYuNiAxMS44IDExLjkgMTA2LjctMTA2LjYgMTA2LjcgMTA2Ljd6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"}},e={};function t(o){var r=e[o];if(void 0!==r)return r.exports;var i=e[o]={id:o,exports:{}};return n[o](i,i.exports,t),i.exports}t.m=n,t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,{a:e}),e},t.d=function(n,e){for(var o in e)t.o(e,o)&&!t.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:e[o]})},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},t.b=document.baseURI||self.location.href,function(){var n=t(406);function e(n){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},e(n)}function o(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,o)}return t}function r(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?o(Object(t),!0).forEach((function(e){i(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function i(n,e,t){return(e=l(e))in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function a(n,e){for(var t=0;t<e.length;t++){var o=e[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(n,l(o.key),o)}}function l(n){var t=function(n,t){if("object"!==e(n)||null===n)return n;var o=n[Symbol.toPrimitive];if(void 0!==o){var r=o.call(n,t||"default");if("object"!==e(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(n)}(n,"string");return"symbol"===e(t)?t:String(t)}var c,s=function(n,e,t){return function(n,e,t){if(e)for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&n.setAttribute(o,e[o]);if(t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n.style[r]=t[r]);return n}(document.createElement(n),e,t)},u=function(){function n(){!function(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n)}var e,t,o;return e=n,(t=[{key:"get",value:function(n,e){var t=localStorage.getItem(n);if(!t)return!1;var o=JSON.parse(t);return e?o[e]:o}},{key:"set",value:function(n,e){var t=r(r({},this.get(n)||{}),e),o=JSON.stringify(t);localStorage.setItem(n,o)}}])&&a(e.prototype,t),o&&a(e,o),Object.defineProperty(e,"prototype",{writable:!1}),n}(),d=((c=document.createElement("iframe")).src="about:blank",c.style.display="none",document.body.appendChild(c),c.contentWindow.console);window.cons=d;var p,f,g,y,v,m,b,x,L,h,j,M="dl-app",w=!0,I="",N=n.Z.toString(),T=[],A="",D=function(n){var e=n.filter((function(n){return"Q8C"===n.quality&&"hls"===n.delivery}));return 0===e.length?null:e[0].src},S=function(){var n,e,t=[];window.jsb&&window.jsb.last_event_values&&window.jsb.last_event_values["VideoPlaylist::INITIALIZED"]?n=window.jsb.last_event_values["VideoPlaylist::INITIALIZED"]:document.querySelectorAll(".player_viewport [data-jsb]").forEach((function(e){if(e.dataset&&e.dataset.jsb){var t=JSON.parse(e.dataset.jsb);if(t.playlist)return void(n=t)}}));if(!n)return t;e=n.playlist;var o,r,i,a=n.drm;r=e.preview_image_url,i=e.title;var l=e.gapless_video;if(l){var c=D(l.sources);c&&(o=c)}else{for(var s=e.videos,u=[],d=0;d<s.length;d++){var p=s[d],f=D(p.sources);f&&(o=f,u.push(o))}o="",u.forEach((function(n,e){o+="yt-dlp "+n+' -o "'+i+"_"+(e+1)+'.mp4" && '})),o&&(o=o.slice(0,-4))}var g=function(n){if(!n)return new Date;var e=n.match(/(\d{4})[_-](\d\d)[_-](\d\d)[_-](\d{4})/);if(!e)return new Date;var t=e[1],o=e[2],r=e[3],i=e[4].slice(0,-2)+":"+e[4].slice(2);return new Date("".concat(t,"-").concat(o,"-").concat(r," ").concat(i))}(e.videos[0].sources[0].src);return t.push({type:"all",title:i,drm:a,date:g,link:o,img:r}),o="",e.videos.forEach((function(n){var e=D(n.sources);e&&(o=e),t.push({type:"single",title:n.title,drm:a,date:g,link:o,img:n.preview_image_url})})),t},E=function(n){return("0"+n).slice(-(arguments.length>1&&void 0!==arguments[1]?arguments[1]:2))},k=function(n){var e=n.target;if(j&&(j.classList.remove("active"),j.querySelector(".l3-4776-copy").style.display="none"),"img"===e.nodeName.toLocaleLowerCase()&&e.dataset.drm&&"false"===e.dataset.drm){if(z(n)){var t=e.parentElement,o=t.querySelector(".l3-4776-copy");clearTimeout(f),o.style.display="block",f=setTimeout((function(){t.classList.add("active"),t.classList.add("success"),f=setTimeout((function(){t.classList.remove("success"),f=setTimeout((function(){o.style.display="none"}),200)}),500)}),1),j=t}}else"button"===e.nodeName.toLocaleLowerCase()&&void 0!==e.dataset.share&&C(n)},z=function(n){var e=n.target.parentElement.nextElementSibling;if(e.select(),navigator.clipboard){var t=e.innerHTML;return navigator.clipboard.writeText(t).then((function(){return console.log("successful")}),(function(n){return console.log("error",n)}))}return document.execCommand("copy")},C=function(n){if(!navigator.share)return!1;var e=n.target,t=e.dataset.sharetitle,o=e.dataset.shareurl;navigator.share({title:t,url:o}).then((function(){return console.log("successful share")})).catch((function(n){return console.log("error sharing:",n)}))},P=function(n){if(!n.length)return null;for(var e=new DocumentFragment,t=n.length-1;t>=0;t--){var o=n[t],r=s("div",{class:"l3-4776-result"}),i=s("div",{class:"l3-4776-bar"}),a=s("div",{class:"l3-4776-title"});a.innerHTML=o.title,i.append(a);var l=s("textarea",{class:"l3-4776-ta",disabled:"true"},{position:"absolute",left:"-999em",opacity:0}),c=s("div",{class:"l3-4776-imgWrap"}),u=s("div",{class:"l3-4776-copy"},{display:"none"});u.innerHTML="copied";var d=s("img",{src:o.img,width:"150"},{flex:"auto"});d.dataset.drm=null!==o.drm&&o.drm,c.append(d),c.append(u);var p=void 0;if(!o.drm){var f=o.date.getFullYear(),g=E(+o.date.getMonth()+1),y=E(o.date.getDate()),v=E(o.date.getHours()),b=E(o.date.getMinutes()),x="".concat(f,"-").concat(g,"-").concat(y),L="".concat(v).concat(b),h=o.title.toLowerCase().replaceAll('"',"");h.replaceAll("'","");var j="".concat(x,"_").concat(L,"_").concat(h,".mp4");p="yt-dlp ".concat(o.link," -o '").concat(j,"'");var M=s("button",{class:"l3-4776-shareBtn"});M.dataset.share=!0,M.dataset.shareurl=o.link,i.append(M)}l.innerHTML=p,r.append(i),r.append(c),r.append(l),e.append(r)}m.append(e)},O=function(){w?(v.classList.remove("open"),L.classList.remove("open"),f=setTimeout((function(){v.style.display="none",w=!1,p.set(M,{open:w}),clearTimeout(f)}),100)):(v.style.display="block",f=setTimeout((function(){v.classList.add("open"),L.classList.add("open"),x&&x.focus(),w=!0,p.set(M,{open:w}),clearTimeout(f)}),1))},Z=function(n){if(A!==n){var e=""===n?[]:function(n){if(""===n)return T;var e="*"===n?"all":"single";return T.filter((function(t){return t.type===e&&("*"===n||t.title.toLowerCase().match(n.replaceAll("*",".*").toLowerCase()))}))}(n);m.innerHTML="",b.style.display=e.length?"block":"none",P(e),p.set(M,{search:n}),A=n}},_=function(){x.value="",x.dispatchEvent(new Event("input")),x.focus()},H=function(n){if(n)return h.style.display="none",void(y=!1);y||(h.style.display="flex",y=!0)},Y=function(n){var e=n.currentTarget.value;Z(e),H(""===e)};!function(){if(g)return!1;var n=(p=new u).get(M);if(n&&(void 0!==n.search&&(I=n.search),void 0!==n.open&&(w=n.open)),g=!0,(T=S()).length)if(function(){var n=T.length-1,e=1===n,t=s("div",{id:"l3-4776"}),o=s("div",{id:"l3-4776-body"});if(v=s("div",{id:"l3-4776-box"}),!e){var r=s("div",{id:"l3-4776-header"}),i=s("div",{class:"l3-4776-info"});i.innerHTML="Number of Videos: ".concat(n),r.append(i);var a=s("div",{id:"l3-4776-filter"});x=s("input",{type:"text",id:"l3-4776-field",name:"fake_user[name]",value:"",autocomplete:"new-password",spellcheck:"false","aria-autocomplete":"none",placeholder:"filter videos by name ..."});var l=s("div",{class:"l3-4776-info"});l.innerHTML="Type * to see the full episode/broadcast",(h=document.createElement("div")).id="l3-4776-clear",h.innerHTML="X",H(!0),a.append(x),a.append(h),r.append(a),r.append(l),h.addEventListener("click",_,!1),x.addEventListener("input",Y,!1),v.append(r)}(L=s("div",{id:"l3-4776-close"})).addEventListener("click",O),m=s("div",{id:"l3-4776-content"}),(b=s("div",{class:"l3-4776-info"})).style.display="none",b.innerHTML="Click on the image to copy the video-link to the clipboard";var c=s("div",{id:"l3-4776-footer"});c.innerHTML="v-".concat("0.5.3"),o.append(b),o.append(m),v.append(o),v.append(c),t.append(v),t.append(L);var u=s("style");u.innerHTML=N,document.body.append(u),document.body.append(t),t.addEventListener("click",k)}(),w&&(v.classList.add("open"),v.style.display="block",L.classList.add("open")),T&&2===T.length){var e=T.filter((function(n){return"single"===n.type}));P(e)}else""!==I?(x.value=I,x.dispatchEvent(new Event("input")),Z(I)):x.focus()}()}()}();