"use strict";(()=>{var Dr="https://desainr.vercel.app";var iu={apiKey:"AIzaSyDb3FPl9-DA_RiY_m8flV-gePeLFnXYVoA",authDomain:"desainr.firebaseapp.com",projectId:"desainr",storageBucket:"desainr.firebasestorage.app",messagingSenderId:"897610202784",appId:"1:897610202784:web:b6a38c0fdf6b07bfe5d3c5"};var su=()=>{};var cu=function(n){let e=[],t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},qd=function(n){let e=[],t=0,r=0;for(;t<n.length;){let s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){let o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){let o=n[t++],c=n[t++],l=n[t++],h=((s&7)<<18|(o&63)<<12|(c&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{let o=n[t++],c=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|c&63)}}return e.join("")},uu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();let t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){let o=n[s],c=s+1<n.length,l=c?n[s+1]:0,h=s+2<n.length,f=h?n[s+2]:0,y=o>>2,T=(o&3)<<4|l>>4,b=(l&15)<<2|f>>6,C=f&63;h||(C=64,c||(b=64)),r.push(t[y],t[T],t[b],t[C])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(cu(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):qd(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();let t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){let o=t[n.charAt(s++)],l=s<n.length?t[n.charAt(s)]:0;++s;let f=s<n.length?t[n.charAt(s)]:64;++s;let T=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||l==null||f==null||T==null)throw new Es;let b=o<<2|l>>4;if(r.push(b),f!==64){let C=l<<4&240|f>>2;if(r.push(C),T!==64){let k=f<<6&192|T;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}},Es=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},jd=function(n){let e=cu(n);return uu.encodeByteArray(e,!0)},bn=function(n){return jd(n).replace(/\./g,"")},Or=function(n){try{return uu.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function lu(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var zd=()=>lu().__FIREBASE_DEFAULTS__,Gd=()=>{if(typeof process>"u"||typeof process.env>"u")return;let n=process.env.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},$d=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=n&&Or(n[1]);return e&&JSON.parse(e)},Vr=()=>{try{return su()||zd()||Gd()||$d()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},As=n=>{var e,t;return(t=(e=Vr())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},hu=n=>{let e=As(n);if(!e)return;let t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},bs=()=>{var n;return(n=Vr())===null||n===void 0?void 0:n.config},Ss=n=>{var e;return(e=Vr())===null||e===void 0?void 0:e[`_${n}`]};var Nr=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}};function Xe(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function xr(n){return(await fetch(n,{credentials:"include"})).ok}function du(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let c=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},n);return[bn(JSON.stringify(t)),bn(JSON.stringify(c)),""].join(".")}var An={};function Wd(){let n={prod:[],emulator:[]};for(let e of Object.keys(An))An[e]?n.emulator.push(e):n.prod.push(e);return n}function Kd(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}var ou=!1;function Lr(n,e){if(typeof window>"u"||typeof document>"u"||!Xe(window.location.host)||An[n]===e||An[n]||ou)return;An[n]=e;function t(b){return`__firebase__banner__${b}`}let r="__firebase__banner",o=Wd().prod.length>0;function c(){let b=document.getElementById(r);b&&b.remove()}function l(b){b.style.display="flex",b.style.background="#7faaf0",b.style.position="fixed",b.style.bottom="5px",b.style.left="5px",b.style.padding=".5em",b.style.borderRadius="5px",b.style.alignItems="center"}function h(b,C){b.setAttribute("width","24"),b.setAttribute("id",C),b.setAttribute("height","24"),b.setAttribute("viewBox","0 0 24 24"),b.setAttribute("fill","none"),b.style.marginLeft="-6px"}function f(){let b=document.createElement("span");return b.style.cursor="pointer",b.style.marginLeft="16px",b.style.fontSize="24px",b.innerHTML=" &times;",b.onclick=()=>{ou=!0,c()},b}function y(b,C){b.setAttribute("id",C),b.innerText="Learn more",b.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",b.setAttribute("target","__blank"),b.style.paddingLeft="5px",b.style.textDecoration="underline"}function T(){let b=Kd(r),C=t("text"),k=document.getElementById(C)||document.createElement("span"),L=t("learnmore"),O=document.getElementById(L)||document.createElement("a"),H=t("preprendIcon"),j=document.getElementById(H)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(b.created){let G=b.element;l(G),y(O,L);let K=f();h(j,H),G.append(j,k,O,K),document.body.appendChild(G)}o?(k.innerText="Preview backend disconnected.",j.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(j.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,k.innerText="Preview backend running in this workspace."),k.setAttribute("id",C)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",T):T()}function te(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function fu(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(te())}function Hd(){var n;let e=(n=Vr())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function pu(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function mu(){let n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function gu(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function _u(){let n=te();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function yu(){return!Hd()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Rs(){try{return typeof indexedDB=="object"}catch{return!1}}function vu(){return new Promise((n,e)=>{try{let t=!0,r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var o;e(((o=s.error)===null||o===void 0?void 0:o.message)||"")}}catch(t){e(t)}})}var Qd="FirebaseError",Ie=class n extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Qd,Object.setPrototypeOf(this,n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,je.prototype.create)}},je=class{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],c=o?Jd(o,r):"Error",l=`${this.serviceName}: ${c} (${s}).`;return new Ie(s,l,r)}};function Jd(n,e){return n.replace(Yd,(t,r)=>{let s=e[r];return s!=null?String(s):`<${r}?>`})}var Yd=/\{\$([^}]+)}/g;function Iu(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function ke(n,e){if(n===e)return!0;let t=Object.keys(n),r=Object.keys(e);for(let s of t){if(!r.includes(s))return!1;let o=n[s],c=e[s];if(au(o)&&au(c)){if(!ke(o,c))return!1}else if(o!==c)return!1}for(let s of r)if(!t.includes(s))return!1;return!0}function au(n){return n!==null&&typeof n=="object"}function Nt(n){let e=[];for(let[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ot(n){let e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){let[s,o]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(o)}}),e}function Vt(n){let e=n.indexOf("?");if(!e)return"";let t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function wu(n,e){let t=new Ts(n,e);return t.subscribe.bind(t)}var Ts=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Xd(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=ws),s.error===void 0&&(s.error=ws),s.complete===void 0&&(s.complete=ws);let o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function Xd(n,e){if(typeof n!="object"||n===null)return!1;for(let t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function ws(){}var w_=4*60*60*1e3;function De(n){return n&&n._delegate?n._delegate:n}var Ee=class{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var ft="[DEFAULT]";var Ps=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let r=new Nr;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{let s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let r=this.normalizeInstanceIdentifier(e?.identifier),s=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ef(e))try{this.getOrInitializeService({instanceIdentifier:ft})}catch{}for(let[t,r]of this.instancesDeferred.entries()){let s=this.normalizeInstanceIdentifier(t);try{let o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=ft){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ft){return this.instances.has(e)}getOptions(e=ft){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[o,c]of this.instancesDeferred.entries()){let l=this.normalizeInstanceIdentifier(o);r===l&&c.resolve(s)}return s}onInit(e,t){var r;let s=this.normalizeInstanceIdentifier(t),o=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;o.add(e),this.onInitCallbacks.set(s,o);let c=this.instances.get(s);return c&&e(c,s),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Zd(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=ft){return this.component?this.component.multipleInstances?e:ft:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function Zd(n){return n===ft?void 0:n}function ef(n){return n.instantiationMode==="EAGER"}var Mr=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Ps(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};var tf=[],x;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(x||(x={}));var nf={debug:x.DEBUG,verbose:x.VERBOSE,info:x.INFO,warn:x.WARN,error:x.ERROR,silent:x.SILENT},rf=x.INFO,sf={[x.DEBUG]:"log",[x.VERBOSE]:"log",[x.INFO]:"info",[x.WARN]:"warn",[x.ERROR]:"error"},of=(n,e,...t)=>{if(e<n.logLevel)return;let r=new Date().toISOString(),s=sf[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},Ze=class{constructor(e){this.name=e,this._logLevel=rf,this._logHandler=of,this._userLogHandler=null,tf.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in x))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?nf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,x.DEBUG,...e),this._logHandler(this,x.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,x.VERBOSE,...e),this._logHandler(this,x.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,x.INFO,...e),this._logHandler(this,x.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,x.WARN,...e),this._logHandler(this,x.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,x.ERROR,...e),this._logHandler(this,x.ERROR,...e)}};var af=(n,e)=>e.some(t=>n instanceof t),Eu,Tu;function cf(){return Eu||(Eu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function uf(){return Tu||(Tu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Au=new WeakMap,ks=new WeakMap,bu=new WeakMap,Cs=new WeakMap,Ns=new WeakMap;function lf(n){let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",c)},o=()=>{t(Ne(n.result)),s()},c=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",c)});return e.then(t=>{t instanceof IDBCursor&&Au.set(t,n)}).catch(()=>{}),Ns.set(e,n),e}function hf(n){if(ks.has(n))return;let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",c),n.removeEventListener("abort",c)},o=()=>{t(),s()},c=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",c),n.addEventListener("abort",c)});ks.set(n,e)}var Ds={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return ks.get(n);if(e==="objectStoreNames")return n.objectStoreNames||bu.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Ne(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Su(n){Ds=n(Ds)}function df(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){let r=n.call(Fr(this),e,...t);return bu.set(r,e.sort?e.sort():[e]),Ne(r)}:uf().includes(n)?function(...e){return n.apply(Fr(this),e),Ne(Au.get(this))}:function(...e){return Ne(n.apply(Fr(this),e))}}function ff(n){return typeof n=="function"?df(n):(n instanceof IDBTransaction&&hf(n),af(n,cf())?new Proxy(n,Ds):n)}function Ne(n){if(n instanceof IDBRequest)return lf(n);if(Cs.has(n))return Cs.get(n);let e=ff(n);return e!==n&&(Cs.set(n,e),Ns.set(e,n)),e}var Fr=n=>Ns.get(n);function Pu(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){let c=indexedDB.open(n,e),l=Ne(c);return r&&c.addEventListener("upgradeneeded",h=>{r(Ne(c.result),h.oldVersion,h.newVersion,Ne(c.transaction),h)}),t&&c.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),l.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",f=>s(f.oldVersion,f.newVersion,f))}).catch(()=>{}),l}var pf=["get","getKey","getAll","getAllKeys","count"],mf=["put","add","delete","clear"],Os=new Map;function Ru(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Os.get(e))return Os.get(e);let t=e.replace(/FromIndex$/,""),r=e!==t,s=mf.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||pf.includes(t)))return;let o=async function(c,...l){let h=this.transaction(c,s?"readwrite":"readonly"),f=h.store;return r&&(f=f.index(l.shift())),(await Promise.all([f[t](...l),s&&h.done]))[0]};return Os.set(e,o),o}Su(n=>({...n,get:(e,t,r)=>Ru(e,t)||n.get(e,t,r),has:(e,t)=>!!Ru(e,t)||n.has(e,t)}));var xs=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(gf(t)){let r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}};function gf(n){let e=n.getComponent();return e?.type==="VERSION"}var Ls="@firebase/app",Cu="0.13.2";var ze=new Ze("@firebase/app"),_f="@firebase/app-compat",yf="@firebase/analytics-compat",vf="@firebase/analytics",If="@firebase/app-check-compat",wf="@firebase/app-check",Ef="@firebase/auth",Tf="@firebase/auth-compat",Af="@firebase/database",bf="@firebase/data-connect",Sf="@firebase/database-compat",Rf="@firebase/functions",Pf="@firebase/functions-compat",Cf="@firebase/installations",kf="@firebase/installations-compat",Df="@firebase/messaging",Nf="@firebase/messaging-compat",Of="@firebase/performance",Vf="@firebase/performance-compat",xf="@firebase/remote-config",Lf="@firebase/remote-config-compat",Mf="@firebase/storage",Ff="@firebase/storage-compat",Uf="@firebase/firestore",Bf="@firebase/ai",qf="@firebase/firestore-compat",jf="firebase",zf="11.10.0";var Ms="[DEFAULT]",Gf={[Ls]:"fire-core",[_f]:"fire-core-compat",[vf]:"fire-analytics",[yf]:"fire-analytics-compat",[wf]:"fire-app-check",[If]:"fire-app-check-compat",[Ef]:"fire-auth",[Tf]:"fire-auth-compat",[Af]:"fire-rtdb",[bf]:"fire-data-connect",[Sf]:"fire-rtdb-compat",[Rf]:"fire-fn",[Pf]:"fire-fn-compat",[Cf]:"fire-iid",[kf]:"fire-iid-compat",[Df]:"fire-fcm",[Nf]:"fire-fcm-compat",[Of]:"fire-perf",[Vf]:"fire-perf-compat",[xf]:"fire-rc",[Lf]:"fire-rc-compat",[Mf]:"fire-gcs",[Ff]:"fire-gcs-compat",[Uf]:"fire-fst",[qf]:"fire-fst-compat",[Bf]:"fire-vertex","fire-js":"fire-js",[jf]:"fire-js-all"};var Sn=new Map,$f=new Map,Fs=new Map;function ku(n,e){try{n.container.addComponent(e)}catch(t){ze.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function tt(n){let e=n.name;if(Fs.has(e))return ze.debug(`There were multiple attempts to register component ${e}.`),!1;Fs.set(e,n);for(let t of Sn.values())ku(t,n);for(let t of $f.values())ku(t,n);return!0}function Pn(n,e){let t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Te(n){return n==null?!1:n.settings!==void 0}var Wf={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},et=new je("app","Firebase",Wf);var Us=class{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Ee("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw et.create("app-deleted",{appName:this._name})}};var nt=zf;function js(n,e={}){let t=n;typeof e!="object"&&(e={name:e});let r=Object.assign({name:Ms,automaticDataCollectionEnabled:!0},e),s=r.name;if(typeof s!="string"||!s)throw et.create("bad-app-name",{appName:String(s)});if(t||(t=bs()),!t)throw et.create("no-options");let o=Sn.get(s);if(o){if(ke(t,o.options)&&ke(r,o.config))return o;throw et.create("duplicate-app",{appName:s})}let c=new Mr(s);for(let h of Fs.values())c.addComponent(h);let l=new Us(t,r,c);return Sn.set(s,l),l}function Ur(n=Ms){let e=Sn.get(n);if(!e&&n===Ms&&bs())return js();if(!e)throw et.create("no-app",{appName:n});return e}function zs(){return Array.from(Sn.values())}function Se(n,e,t){var r;let s=(r=Gf[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);let o=s.match(/\s|\//),c=e.match(/\s|\//);if(o||c){let l=[`Unable to register library "${s}" with version "${e}":`];o&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&c&&l.push("and"),c&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ze.warn(l.join(" "));return}tt(new Ee(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}var Kf="firebase-heartbeat-database",Hf=1,Rn="firebase-heartbeat-store",Vs=null;function Vu(){return Vs||(Vs=Pu(Kf,Hf,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Rn)}catch(t){console.warn(t)}}}}).catch(n=>{throw et.create("idb-open",{originalErrorMessage:n.message})})),Vs}async function Qf(n){try{let t=(await Vu()).transaction(Rn),r=await t.objectStore(Rn).get(xu(n));return await t.done,r}catch(e){if(e instanceof Ie)ze.warn(e.message);else{let t=et.create("idb-get",{originalErrorMessage:e?.message});ze.warn(t.message)}}}async function Du(n,e){try{let r=(await Vu()).transaction(Rn,"readwrite");await r.objectStore(Rn).put(e,xu(n)),await r.done}catch(t){if(t instanceof Ie)ze.warn(t.message);else{let r=et.create("idb-set",{originalErrorMessage:t?.message});ze.warn(r.message)}}}function xu(n){return`${n.name}!${n.options.appId}`}var Jf=1024,Yf=30,Bs=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new qs(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{let s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Nu();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(c=>c.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats.length>Yf){let c=Zf(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(c,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){ze.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";let t=Nu(),{heartbeatsToSend:r,unsentEntries:s}=Xf(this._heartbeatsCache.heartbeats),o=bn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return ze.warn(t),""}}};function Nu(){return new Date().toISOString().substring(0,10)}function Xf(n,e=Jf){let t=[],r=n.slice();for(let s of n){let o=t.find(c=>c.agent===s.agent);if(o){if(o.dates.push(s.date),Ou(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Ou(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}var qs=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Rs()?vu().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let t=await Qf(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){let s=await this.read();return Du(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){let s=await this.read();return Du(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}};function Ou(n){return bn(JSON.stringify({version:2,heartbeats:n})).length}function Zf(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}function ep(n){tt(new Ee("platform-logger",e=>new xs(e),"PRIVATE")),tt(new Ee("heartbeat",e=>new Bs(e),"PRIVATE")),Se(Ls,Cu,n),Se(Ls,Cu,"esm2017"),Se("fire-js","")}ep("");function Br(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function el(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var tl=el,nl=new je("auth","Firebase",el());var Kr=new Ze("@firebase/auth");function tp(n,...e){Kr.logLevel<=x.WARN&&Kr.warn(`Auth (${nt}): ${n}`,...e)}function jr(n,...e){Kr.logLevel<=x.ERROR&&Kr.error(`Auth (${nt}): ${n}`,...e)}function Re(n,...e){throw mo(n,...e)}function Ve(n,...e){return mo(n,...e)}function rl(n,e,t){let r=Object.assign(Object.assign({},tl()),{[e]:t});return new je("auth","Firebase",r).create(e,{appName:n.name})}function pt(n){return rl(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function mo(n,...e){if(typeof n!="string"){let t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return nl.create(n,...e)}function D(n,e,...t){if(!n)throw mo(e,...t)}function Oe(n){let e="INTERNAL ASSERTION FAILED: "+n;throw jr(e),new Error(e)}function $e(n,e){n||Oe(e)}function Qs(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function np(){return Lu()==="http:"||Lu()==="https:"}function Lu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}function rp(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(np()||mu()||"connection"in navigator)?navigator.onLine:!0}function ip(){if(typeof navigator>"u")return null;let n=navigator;return n.languages&&n.languages[0]||n.language||null}var mt=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,$e(t>e,"Short delay should be less than long delay!"),this.isMobile=fu()||gu()}get(){return rp()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};function go(n,e){$e(n.emulator,"Emulator should always be set here");let{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}var Hr=class{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Oe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Oe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Oe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};var sp={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};var op=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],ap=new mt(3e4,6e4);function ne(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function le(n,e,t,r,s={}){return il(n,s,async()=>{let o={},c={};r&&(e==="GET"?c=r:o={body:JSON.stringify(r)});let l=Nt(Object.assign({key:n.config.apiKey},c)).slice(1),h=await n._getAdditionalHeaders();h["Content-Type"]="application/json",n.languageCode&&(h["X-Firebase-Locale"]=n.languageCode);let f=Object.assign({method:e,headers:h},o);return pu()||(f.referrerPolicy="no-referrer"),n.emulatorConfig&&Xe(n.emulatorConfig.host)&&(f.credentials="include"),Hr.fetch()(await sl(n,n.config.apiHost,t,l),f)})}async function il(n,e,t){n._canInitEmulator=!1;let r=Object.assign(Object.assign({},sp),e);try{let s=new Js(n),o=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();let c=await o.json();if("needConfirmation"in c)throw kn(n,"account-exists-with-different-credential",c);if(o.ok&&!("errorMessage"in c))return c;{let l=o.ok?c.errorMessage:c.error.message,[h,f]=l.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw kn(n,"credential-already-in-use",c);if(h==="EMAIL_EXISTS")throw kn(n,"email-already-in-use",c);if(h==="USER_DISABLED")throw kn(n,"user-disabled",c);let y=r[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(f)throw rl(n,y,f);Re(n,y)}}catch(s){if(s instanceof Ie)throw s;Re(n,"network-request-failed",{message:String(s)})}}async function It(n,e,t,r,s={}){let o=await le(n,e,t,r,s);return"mfaPendingCredential"in o&&Re(n,"multi-factor-auth-required",{_serverResponse:o}),o}async function sl(n,e,t,r){let s=`${e}${t}?${r}`,o=n,c=o.config.emulator?go(n.config,s):`${n.config.apiScheme}://${s}`;return op.includes(t)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(c).toString():c}function cp(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}var Js=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Ve(this.auth,"network-request-failed")),ap.get())})}};function kn(n,e,t){let r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);let s=Ve(n,e,r);return s.customData._tokenResponse=t,s}function Mu(n){return n!==void 0&&n.enterprise!==void 0}var Qr=class{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return cp(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};async function ol(n,e){return le(n,"GET","/v2/recaptchaConfig",ne(n,e))}async function up(n,e){return le(n,"POST","/v1/accounts:delete",e)}async function Jr(n,e){return le(n,"POST","/v1/accounts:lookup",e)}function Dn(n){if(n)try{let e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function al(n,e=!1){let t=De(n),r=await t.getIdToken(e),s=_o(r);D(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");let o=typeof s.firebase=="object"?s.firebase:void 0,c=o?.sign_in_provider;return{claims:s,token:r,authTime:Dn(Gs(s.auth_time)),issuedAtTime:Dn(Gs(s.iat)),expirationTime:Dn(Gs(s.exp)),signInProvider:c||null,signInSecondFactor:o?.sign_in_second_factor||null}}function Gs(n){return Number(n)*1e3}function _o(n){let[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return jr("JWT malformed, contained fewer than 3 sections"),null;try{let s=Or(t);return s?JSON.parse(s):(jr("Failed to decode base64 JWT payload"),null)}catch(s){return jr("Caught error parsing JWT payload as JSON",s?.toString()),null}}function Fu(n){let e=_o(n);return D(e,"internal-error"),D(typeof e.exp<"u","internal-error"),D(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}async function xn(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Ie&&lp(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function lp({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}var Ys=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){let r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;let s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};var Ln=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Dn(this.lastLoginAt),this.creationTime=Dn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};async function Yr(n){var e;let t=n.auth,r=await n.getIdToken(),s=await xn(n,Jr(t,{idToken:r}));D(s?.users.length,t,"internal-error");let o=s.users[0];n._notifyReloadListener(o);let c=!((e=o.providerUserInfo)===null||e===void 0)&&e.length?ul(o.providerUserInfo):[],l=hp(n.providerData,c),h=n.isAnonymous,f=!(n.email&&o.passwordHash)&&!l?.length,y=h?f:!1,T={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new Ln(o.createdAt,o.lastLoginAt),isAnonymous:y};Object.assign(n,T)}async function cl(n){let e=De(n);await Yr(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function hp(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function ul(n){return n.map(e=>{var{providerId:t}=e,r=Br(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}async function dp(n,e){let t=await il(n,{},async()=>{let r=Nt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:o}=n.config,c=await sl(n,s,"/v1/token",`key=${o}`),l=await n._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";let h={method:"POST",headers:l,body:r};return n.emulatorConfig&&Xe(n.emulatorConfig.host)&&(h.credentials="include"),Hr.fetch()(c,h)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function fp(n,e){return le(n,"POST","/v2/accounts:revokeToken",ne(n,e))}var Nn=class n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){D(e.idToken,"internal-error"),D(typeof e.idToken<"u","internal-error"),D(typeof e.refreshToken<"u","internal-error");let t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Fu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){D(e.length!==0,"internal-error");let t=Fu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(D(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:s,expiresIn:o}=await dp(e,t);this.updateTokensAndExpiration(r,s,Number(o))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){let{refreshToken:r,accessToken:s,expirationTime:o}=t,c=new n;return r&&(D(typeof r=="string","internal-error",{appName:e}),c.refreshToken=r),s&&(D(typeof s=="string","internal-error",{appName:e}),c.accessToken=s),o&&(D(typeof o=="number","internal-error",{appName:e}),c.expirationTime=o),c}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new n,this.toJSON())}_performRefresh(){return Oe("not implemented")}};function rt(n,e){D(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}var it=class n{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,o=Br(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Ys(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new Ln(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){let t=await xn(this,this.stsTokenManager.getToken(this.auth,e));return D(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return al(this,e)}reload(){return cl(this)}_assign(e){this!==e&&(D(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new n(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){D(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Yr(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Te(this.auth.app))return Promise.reject(pt(this.auth));let e=await this.getIdToken();return await xn(this,up(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,o,c,l,h,f,y;let T=(r=t.displayName)!==null&&r!==void 0?r:void 0,b=(s=t.email)!==null&&s!==void 0?s:void 0,C=(o=t.phoneNumber)!==null&&o!==void 0?o:void 0,k=(c=t.photoURL)!==null&&c!==void 0?c:void 0,L=(l=t.tenantId)!==null&&l!==void 0?l:void 0,O=(h=t._redirectEventId)!==null&&h!==void 0?h:void 0,H=(f=t.createdAt)!==null&&f!==void 0?f:void 0,j=(y=t.lastLoginAt)!==null&&y!==void 0?y:void 0,{uid:G,emailVerified:K,isAnonymous:Ce,providerData:ee,stsTokenManager:I}=t;D(G&&I,e,"internal-error");let p=Nn.fromJSON(this.name,I);D(typeof G=="string",e,"internal-error"),rt(T,e.name),rt(b,e.name),D(typeof K=="boolean",e,"internal-error"),D(typeof Ce=="boolean",e,"internal-error"),rt(C,e.name),rt(k,e.name),rt(L,e.name),rt(O,e.name),rt(H,e.name),rt(j,e.name);let g=new n({uid:G,auth:e,email:b,emailVerified:K,displayName:T,isAnonymous:Ce,photoURL:k,phoneNumber:C,tenantId:L,stsTokenManager:p,createdAt:H,lastLoginAt:j});return ee&&Array.isArray(ee)&&(g.providerData=ee.map(_=>Object.assign({},_))),O&&(g._redirectEventId=O),g}static async _fromIdTokenResponse(e,t,r=!1){let s=new Nn;s.updateFromServerResponse(t);let o=new n({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Yr(o),o}static async _fromGetAccountInfoResponse(e,t,r){let s=t.users[0];D(s.localId!==void 0,"internal-error");let o=s.providerUserInfo!==void 0?ul(s.providerUserInfo):[],c=!(s.email&&s.passwordHash)&&!o?.length,l=new Nn;l.updateFromIdToken(r);let h=new n({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:c}),f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Ln(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!o?.length};return Object.assign(h,f),h}};var Uu=new Map;function Ge(n){$e(n instanceof Function,"Expected a class definition");let e=Uu.get(n);return e?($e(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Uu.set(n,e),e)}var Xr=class{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};Xr.type="NONE";var Xs=Xr;function zr(n,e,t){return`firebase:${n}:${e}:${t}`}var Zr=class n{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:s,name:o}=this.auth;this.fullUserKey=zr(this.userKey,s.apiKey,o),this.fullPersistenceKey=zr("persistence",s.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){let t=await Jr(this.auth,{idToken:e}).catch(()=>{});return t?it._fromGetAccountInfoResponse(this.auth,t,e):null}return it._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new n(Ge(Xs),e,r);let s=(await Promise.all(t.map(async f=>{if(await f._isAvailable())return f}))).filter(f=>f),o=s[0]||Ge(Xs),c=zr(r,e.config.apiKey,e.name),l=null;for(let f of t)try{let y=await f._get(c);if(y){let T;if(typeof y=="string"){let b=await Jr(e,{idToken:y}).catch(()=>{});if(!b)break;T=await it._fromGetAccountInfoResponse(e,b,y)}else T=it._fromJSON(e,y);f!==o&&(l=T),o=f;break}}catch{}let h=s.filter(f=>f._shouldAllowMigration);return!o._shouldAllowMigration||!h.length?new n(o,e,r):(o=h[0],l&&await o._set(c,l.toJSON()),await Promise.all(t.map(async f=>{if(f!==o)try{await f._remove(c)}catch{}})),new n(o,e,r))}};function Bu(n){let e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(fl(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(ll(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ml(e))return"Blackberry";if(gl(e))return"Webos";if(hl(e))return"Safari";if((e.includes("chrome/")||dl(e))&&!e.includes("edge/"))return"Chrome";if(pl(e))return"Android";{let t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function ll(n=te()){return/firefox\//i.test(n)}function hl(n=te()){let e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function dl(n=te()){return/crios\//i.test(n)}function fl(n=te()){return/iemobile/i.test(n)}function pl(n=te()){return/android/i.test(n)}function ml(n=te()){return/blackberry/i.test(n)}function gl(n=te()){return/webos/i.test(n)}function yo(n=te()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function pp(n=te()){var e;return yo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function mp(){return _u()&&document.documentMode===10}function _l(n=te()){return yo(n)||pl(n)||gl(n)||ml(n)||/windows phone/i.test(n)||fl(n)}function yl(n,e=[]){let t;switch(n){case"Browser":t=Bu(te());break;case"Worker":t=`${Bu(te())}-${n}`;break;default:t=n}let r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${nt}/${r}`}var Zs=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let r=o=>new Promise((c,l)=>{try{let h=e(o);c(h)}catch(h){l(h)}});r.onAbort=t,this.queue.push(r);let s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(let s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}};async function gp(n,e={}){return le(n,"GET","/v2/passwordPolicy",ne(n,e))}var _p=6,eo=class{constructor(e){var t,r,s,o;let c=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=c.minPasswordLength)!==null&&t!==void 0?t:_p,c.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=c.maxPasswordLength),c.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=c.containsLowercaseCharacter),c.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=c.containsUppercaseCharacter),c.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=c.containsNumericCharacter),c.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=c.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(o=e.forceUpgradeOnSignin)!==null&&o!==void 0?o:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,s,o,c,l;let h={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,h),this.validatePasswordCharacterOptions(e,h),h.isValid&&(h.isValid=(t=h.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),h.isValid&&(h.isValid=(r=h.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),h.isValid&&(h.isValid=(s=h.containsLowercaseLetter)!==null&&s!==void 0?s:!0),h.isValid&&(h.isValid=(o=h.containsUppercaseLetter)!==null&&o!==void 0?o:!0),h.isValid&&(h.isValid=(c=h.containsNumericCharacter)!==null&&c!==void 0?c:!0),h.isValid&&(h.isValid=(l=h.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),h}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}};var to=class{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ei(this),this.idTokenSubscription=new ei(this),this.beforeStateQueue=new Zs(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=nl,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ge(t)),this._initializationPromise=this.queue(async()=>{var r,s,o;if(!this._deleted&&(this.persistenceManager=await Zr.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((o=this.currentUser)===null||o===void 0?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await Jr(this,{idToken:e}),r=await it._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Te(this.app)){let c=this.app.settings.authIdToken;return c?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(c).then(l,l))}):this.directlySetCurrentUser(null)}let r=await this.assertedPersistence.getCurrentUser(),s=r,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let c=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=s?._redirectEventId,h=await this.tryRedirectSignIn(e);(!c||c===l)&&h?.user&&(s=h.user,o=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(s)}catch(c){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(c))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return D(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Yr(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ip()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Te(this.app))return Promise.reject(pt(this));let t=e?De(e):null;return t&&D(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&D(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Te(this.app)?Promise.reject(pt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Te(this.app)?Promise.reject(pt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ge(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await gp(this),t=new eo(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new je("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await fp(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&Ge(e)||this._popupRedirectResolver;D(t,this,"argument-error"),this.redirectPersistenceManager=await Zr.create(this,[Ge(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};let o=typeof t=="function"?t:t.next.bind(t),c=!1,l=this._isInitialized?Promise.resolve():this._initializationPromise;if(D(l,this,"internal-error"),l.then(()=>{c||o(this.currentUser)}),typeof t=="function"){let h=e.addObserver(t,r,s);return()=>{c=!0,h()}}else{let h=e.addObserver(t);return()=>{c=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return D(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=yl(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;let t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);let r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);let s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;if(Te(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&tp(`Error while retrieving App Check token: ${t.error}`),t?.token}};function Mt(n){return De(n)}var ei=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=wu(t=>this.observer=t)}get next(){return D(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};var yi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function yp(n){yi=n}function vl(n){return yi.loadJS(n)}function vp(){return yi.recaptchaEnterpriseScript}function Ip(){return yi.gapiScript}function Il(n){return`__${n}${Math.floor(Math.random()*1e6)}`}var no=class{constructor(){this.enterprise=new ro}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}},ro=class{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};var wp="recaptcha-enterprise",On="NO_RECAPTCHA",ti=class{constructor(e){this.type=wp,this.auth=Mt(e)}async verify(e="verify",t=!1){async function r(o){if(!t){if(o.tenantId==null&&o._agentRecaptchaConfig!=null)return o._agentRecaptchaConfig.siteKey;if(o.tenantId!=null&&o._tenantRecaptchaConfigs[o.tenantId]!==void 0)return o._tenantRecaptchaConfigs[o.tenantId].siteKey}return new Promise(async(c,l)=>{ol(o,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(h=>{if(h.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{let f=new Qr(h);return o.tenantId==null?o._agentRecaptchaConfig=f:o._tenantRecaptchaConfigs[o.tenantId]=f,c(f.siteKey)}}).catch(h=>{l(h)})})}function s(o,c,l){let h=window.grecaptcha;Mu(h)?h.enterprise.ready(()=>{h.enterprise.execute(o,{action:e}).then(f=>{c(f)}).catch(()=>{c(On)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new no().execute("siteKey",{action:"verify"}):new Promise((o,c)=>{r(this.auth).then(l=>{if(!t&&Mu(window.grecaptcha))s(l,o,c);else{if(typeof window>"u"){c(new Error("RecaptchaVerifier is only supported in browser"));return}let h=vp();h.length!==0&&(h+=l),vl(h).then(()=>{s(l,o,c)}).catch(f=>{c(f)})}}).catch(l=>{c(l)})})}};async function Cn(n,e,t,r=!1,s=!1){let o=new ti(n),c;if(s)c=On;else try{c=await o.verify(t)}catch{c=await o.verify(t,!0)}let l=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in l){let h=l.phoneEnrollmentInfo.phoneNumber,f=l.phoneEnrollmentInfo.recaptchaToken;Object.assign(l,{phoneEnrollmentInfo:{phoneNumber:h,recaptchaToken:f,captchaResponse:c,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in l){let h=l.phoneSignInInfo.recaptchaToken;Object.assign(l,{phoneSignInInfo:{recaptchaToken:h,captchaResponse:c,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return l}return r?Object.assign(l,{captchaResp:c}):Object.assign(l,{captchaResponse:c}),Object.assign(l,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(l,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),l}async function Vn(n,e,t,r,s){var o,c;if(s==="EMAIL_PASSWORD_PROVIDER")if(!((o=n._getRecaptchaConfig())===null||o===void 0)&&o.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let l=await Cn(n,e,t,t==="getOobCode");return r(n,l)}else return r(n,e).catch(async l=>{if(l.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let h=await Cn(n,e,t,t==="getOobCode");return r(n,h)}else return Promise.reject(l)});else if(s==="PHONE_PROVIDER")if(!((c=n._getRecaptchaConfig())===null||c===void 0)&&c.isProviderEnabled("PHONE_PROVIDER")){let l=await Cn(n,e,t);return r(n,l).catch(async h=>{var f;if(((f=n._getRecaptchaConfig())===null||f===void 0?void 0:f.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(h.code==="auth/missing-recaptcha-token"||h.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);let y=await Cn(n,e,t,!1,!0);return r(n,y)}return Promise.reject(h)})}else{let l=await Cn(n,e,t,!1,!0);return r(n,l)}else return Promise.reject(s+" provider is not supported.")}async function Ep(n){let e=Mt(n),t=await ol(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new Qr(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new ti(e).verify()}function wl(n,e){let t=Pn(n,"auth");if(t.isInitialized()){let s=t.getImmediate(),o=t.getOptions();if(ke(o,e??{}))return s;Re(s,"already-initialized")}return t.initialize({options:e})}function Tp(n,e){let t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(Ge);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function El(n,e,t){let r=Mt(n);D(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");let s=!!t?.disableWarnings,o=Tl(e),{host:c,port:l}=Ap(e),h=l===null?"":`:${l}`,f={url:`${o}//${c}${h}/`},y=Object.freeze({host:c,port:l,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){D(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),D(ke(f,r.config.emulator)&&ke(y,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=f,r.emulatorConfig=y,r.settings.appVerificationDisabledForTesting=!0,Xe(c)?(xr(`${o}//${c}${h}`),Lr("Auth",!0)):s||bp()}function Tl(n){let e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Ap(n){let e=Tl(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};let r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){let o=s[1];return{host:o,port:qu(r.substr(o.length+1))}}else{let[o,c]=r.split(":");return{host:o,port:qu(c)}}}function qu(n){if(!n)return null;let e=Number(n);return isNaN(e)?null:e}function bp(){function n(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}var gt=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Oe("not implemented")}_getIdTokenResponse(e){return Oe("not implemented")}_linkToIdToken(e,t){return Oe("not implemented")}_getReauthenticationResolver(e){return Oe("not implemented")}};async function Sp(n,e){return le(n,"POST","/v1/accounts:signUp",e)}async function Rp(n,e){return It(n,"POST","/v1/accounts:signInWithPassword",ne(n,e))}async function Pp(n,e){return It(n,"POST","/v1/accounts:signInWithEmailLink",ne(n,e))}async function Cp(n,e){return It(n,"POST","/v1/accounts:signInWithEmailLink",ne(n,e))}var Mn=class n extends gt{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new n(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new n(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Vn(e,t,"signInWithPassword",Rp,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Pp(e,{email:this._email,oobCode:this._password});default:Re(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Vn(e,r,"signUpPassword",Sp,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Cp(e,{idToken:t,email:this._email,oobCode:this._password});default:Re(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};async function xt(n,e){return It(n,"POST","/v1/accounts:signInWithIdp",ne(n,e))}var kp="http://localhost",_t=class n extends gt{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Re("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,o=Br(t,["providerId","signInMethod"]);if(!r||!s)return null;let c=new n(r,s);return c.idToken=o.idToken||void 0,c.accessToken=o.accessToken||void 0,c.secret=o.secret,c.nonce=o.nonce,c.pendingToken=o.pendingToken||null,c}_getIdTokenResponse(e){let t=this.buildRequest();return xt(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,xt(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,xt(e,t)}buildRequest(){let e={requestUri:kp,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Nt(t)}return e}};async function ju(n,e){return le(n,"POST","/v1/accounts:sendVerificationCode",ne(n,e))}async function Dp(n,e){return It(n,"POST","/v1/accounts:signInWithPhoneNumber",ne(n,e))}async function Np(n,e){let t=await It(n,"POST","/v1/accounts:signInWithPhoneNumber",ne(n,e));if(t.temporaryProof)throw kn(n,"account-exists-with-different-credential",t);return t}var Op={USER_NOT_FOUND:"user-not-found"};async function Vp(n,e){let t=Object.assign(Object.assign({},e),{operation:"REAUTH"});return It(n,"POST","/v1/accounts:signInWithPhoneNumber",ne(n,t),Op)}var Fn=class n extends gt{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new n({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new n({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return Dp(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return Np(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return Vp(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:s}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:o}=e;return!r&&!t&&!s&&!o?null:new n({verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:o})}};function xp(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Lp(n){let e=Ot(Vt(n)).link,t=e?Ot(Vt(e)).deep_link_id:null,r=Ot(Vt(n)).deep_link_id;return(r?Ot(Vt(r)).link:null)||r||t||e||n}var ni=class n{constructor(e){var t,r,s,o,c,l;let h=Ot(Vt(e)),f=(t=h.apiKey)!==null&&t!==void 0?t:null,y=(r=h.oobCode)!==null&&r!==void 0?r:null,T=xp((s=h.mode)!==null&&s!==void 0?s:null);D(f&&y&&T,"argument-error"),this.apiKey=f,this.operation=T,this.code=y,this.continueUrl=(o=h.continueUrl)!==null&&o!==void 0?o:null,this.languageCode=(c=h.lang)!==null&&c!==void 0?c:null,this.tenantId=(l=h.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){let t=Lp(e);try{return new n(t)}catch{return null}}};var Lt=class n{constructor(){this.providerId=n.PROVIDER_ID}static credential(e,t){return Mn._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=ni.parseLink(t);return D(r,"argument-error"),Mn._fromEmailAndCode(e,r.code,r.tenantId)}};Lt.PROVIDER_ID="password";Lt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Lt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";var ri=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};var yt=class extends ri{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};var Un=class n extends yt{constructor(){super("facebook.com")}static credential(e){return _t._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};Un.FACEBOOK_SIGN_IN_METHOD="facebook.com";Un.PROVIDER_ID="facebook.com";var Bn=class n extends yt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return _t._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return n.credential(t,r)}catch{return null}}};Bn.GOOGLE_SIGN_IN_METHOD="google.com";Bn.PROVIDER_ID="google.com";var qn=class n extends yt{constructor(){super("github.com")}static credential(e){return _t._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};qn.GITHUB_SIGN_IN_METHOD="github.com";qn.PROVIDER_ID="github.com";var jn=class n extends yt{constructor(){super("twitter.com")}static credential(e,t){return _t._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return n.credential(t,r)}catch{return null}}};jn.TWITTER_SIGN_IN_METHOD="twitter.com";jn.PROVIDER_ID="twitter.com";var zn=class n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){let o=await it._fromIdTokenResponse(e,r,s),c=zu(r);return new n({user:o,providerId:c,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let s=zu(r);return new n({user:e,providerId:s,_tokenResponse:r,operationType:t})}};function zu(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}var io=class n extends Ie{constructor(e,t,r,s){var o;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,n.prototype),this.customData={appName:e.name,tenantId:(o=e.tenantId)!==null&&o!==void 0?o:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new n(e,t,r,s)}};function Al(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?io._fromErrorAndOperation(n,o,e,r):o})}async function Mp(n,e,t=!1){let r=await xn(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return zn._forOperation(n,"link",r)}async function Fp(n,e,t=!1){let{auth:r}=n;if(Te(r.app))return Promise.reject(pt(r));let s="reauthenticate";try{let o=await xn(n,Al(r,s,e,n),t);D(o.idToken,r,"internal-error");let c=_o(o.idToken);D(c,r,"internal-error");let{sub:l}=c;return D(n.uid===l,r,"user-mismatch"),zn._forOperation(n,s,o)}catch(o){throw o?.code==="auth/user-not-found"&&Re(r,"user-mismatch"),o}}async function Up(n,e,t=!1){if(Te(n.app))return Promise.reject(pt(n));let r="signIn",s=await Al(n,r,e),o=await zn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(o.user),o}function bl(n,e,t,r){return De(n).onIdTokenChanged(e,t,r)}function Sl(n,e,t){return De(n).beforeAuthStateChanged(e,t)}function vo(n,e,t,r){return De(n).onAuthStateChanged(e,t,r)}function Gu(n,e){return le(n,"POST","/v2/accounts/mfaEnrollment:start",ne(n,e))}function Bp(n,e){return le(n,"POST","/v2/accounts/mfaEnrollment:finalize",ne(n,e))}function qp(n,e){return le(n,"POST","/v2/accounts/mfaEnrollment:start",ne(n,e))}function jp(n,e){return le(n,"POST","/v2/accounts/mfaEnrollment:finalize",ne(n,e))}var ii="__sak";var si=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ii,"1"),this.storage.removeItem(ii),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};var zp=1e3,Gp=10,oi=class extends si{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=_l(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((c,l,h)=>{this.notifyListeners(c,h)});return}let r=e.key;t?this.detachListener():this.stopPolling();let s=()=>{let c=this.storage.getItem(r);!t&&this.localCache[r]===c||this.notifyListeners(r,c)},o=this.storage.getItem(r);mp()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Gp):s()}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},zp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};oi.type="LOCAL";var Rl=oi;var $p=1e3;function $s(n){var e,t;let r=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),s=RegExp(`${r}=([^;]+)`);return(t=(e=document.cookie.match(s))===null||e===void 0?void 0:e[1])!==null&&t!==void 0?t:null}function Ws(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}var so=class{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;let t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){var e;return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:(e=navigator.cookieEnabled)!==null&&e!==void 0?e:!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;let t=Ws(e);if(window.cookieStore){let r=await window.cookieStore.get(t);return r?.value}return $s(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;let r=Ws(e);document.cookie=`${r}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;let r=Ws(e);if(window.cookieStore){let l=f=>{let y=f.changed.find(b=>b.name===r);y&&t(y.value),f.deleted.find(b=>b.name===r)&&t(null)},h=()=>window.cookieStore.removeEventListener("change",l);return this.listenerUnsubscribes.set(t,h),window.cookieStore.addEventListener("change",l)}let s=$s(r),o=setInterval(()=>{let l=$s(r);l!==s&&(t(l),s=l)},$p),c=()=>clearInterval(o);this.listenerUnsubscribes.set(t,c)}_removeListener(e,t){let r=this.listenerUnsubscribes.get(t);r&&(r(),this.listenerUnsubscribes.delete(t))}};so.type="COOKIE";var ai=class extends si{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};ai.type="SESSION";var Io=ai;function Wp(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}var ci=class n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;let r=new n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:r,eventType:s,data:o}=t.data,c=this.handlersMap[s];if(!c?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});let l=Array.from(c).map(async f=>f(t.origin,o)),h=await Wp(l);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:h})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};ci.receivers=[];function wo(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}var oo=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,c;return new Promise((l,h)=>{let f=wo("",20);s.port1.start();let y=setTimeout(()=>{h(new Error("unsupported_event"))},r);c={messageChannel:s,onMessage(T){let b=T;if(b.data.eventId===f)switch(b.data.status){case"ack":clearTimeout(y),o=setTimeout(()=>{h(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),l(b.data.response);break;default:clearTimeout(y),clearTimeout(o),h(new Error("invalid_response"));break}}},this.handlers.add(c),s.port1.addEventListener("message",c.onMessage),this.target.postMessage({eventType:e,eventId:f,data:t},[s.port2])}).finally(()=>{c&&this.removeMessageHandler(c)})}};function xe(){return window}function Kp(n){xe().location.href=n}function Pl(){return typeof xe().WorkerGlobalScope<"u"&&typeof xe().importScripts=="function"}async function Hp(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Qp(){var n;return((n=navigator?.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Jp(){return Pl()?self:null}var Cl="firebaseLocalStorageDb",Yp=1,ui="firebaseLocalStorage",kl="fbase_key",vt=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function vi(n,e){return n.transaction([ui],e?"readwrite":"readonly").objectStore(ui)}function Xp(){let n=indexedDB.deleteDatabase(Cl);return new vt(n).toPromise()}function ao(){let n=indexedDB.open(Cl,Yp);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{let r=n.result;try{r.createObjectStore(ui,{keyPath:kl})}catch(s){t(s)}}),n.addEventListener("success",async()=>{let r=n.result;r.objectStoreNames.contains(ui)?e(r):(r.close(),await Xp(),e(await ao()))})})}async function $u(n,e,t){let r=vi(n,!0).put({[kl]:e,value:t});return new vt(r).toPromise()}async function Zp(n,e){let t=vi(n,!1).get(e),r=await new vt(t).toPromise();return r===void 0?null:r.value}function Wu(n,e){let t=vi(n,!0).delete(e);return new vt(t).toPromise()}var em=800,tm=3,li=class{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ao(),this.db)}async _withRetries(e){let t=0;for(;;)try{let r=await this._openDb();return await e(r)}catch(r){if(t++>tm)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Pl()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ci._getInstance(Jp()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Hp(),!this.activeServiceWorker)return;this.sender=new oo(this.activeServiceWorker);let r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Qp()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;let e=await ao();return await $u(e,ii,"1"),await Wu(e,ii),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>$u(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(r=>Zp(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Wu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){let e=await this._withRetries(s=>{let o=vi(s,!1).getAll();return new vt(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];let t=[],r=new Set;if(e.length!==0)for(let{fbase_key:s,value:o}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),t.push(s));for(let s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),em)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}};li.type="LOCAL";var Dl=li;function Ku(n,e){return le(n,"POST","/v2/accounts/mfaSignIn:start",ne(n,e))}function nm(n,e){return le(n,"POST","/v2/accounts/mfaSignIn:finalize",ne(n,e))}function rm(n,e){return le(n,"POST","/v2/accounts/mfaSignIn:finalize",ne(n,e))}var W_=Il("rcb"),K_=new mt(3e4,6e4);var Gr="recaptcha";async function im(n,e,t){var r;if(!n._getRecaptchaConfig())try{await Ep(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let s;if(typeof e=="string"?s={phoneNumber:e}:s=e,"session"in s){let o=s.session;if("phoneNumber"in s){D(o.type==="enroll",n,"internal-error");let c={idToken:o.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Vn(n,c,"mfaSmsEnrollment",async(y,T)=>{if(T.phoneEnrollmentInfo.captchaResponse===On){D(t?.type===Gr,y,"argument-error");let b=await Ks(y,T,t);return Gu(y,b)}return Gu(y,T)},"PHONE_PROVIDER").catch(y=>Promise.reject(y))).phoneSessionInfo.sessionInfo}else{D(o.type==="signin",n,"internal-error");let c=((r=s.multiFactorHint)===null||r===void 0?void 0:r.uid)||s.multiFactorUid;D(c,n,"missing-multi-factor-info");let l={mfaPendingCredential:o.credential,mfaEnrollmentId:c,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Vn(n,l,"mfaSmsSignIn",async(T,b)=>{if(b.phoneSignInInfo.captchaResponse===On){D(t?.type===Gr,T,"argument-error");let C=await Ks(T,b,t);return Ku(T,C)}return Ku(T,b)},"PHONE_PROVIDER").catch(T=>Promise.reject(T))).phoneResponseInfo.sessionInfo}}else{let o={phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Vn(n,o,"sendVerificationCode",async(f,y)=>{if(y.captchaResponse===On){D(t?.type===Gr,f,"argument-error");let T=await Ks(f,y,t);return ju(f,T)}return ju(f,y)},"PHONE_PROVIDER").catch(f=>Promise.reject(f))).sessionInfo}}finally{t?._reset()}}async function Ks(n,e,t){D(t.type===Gr,n,"argument-error");let r=await t.verify();D(typeof r=="string",n,"argument-error");let s=Object.assign({},e);if("phoneEnrollmentInfo"in s){let o=s.phoneEnrollmentInfo.phoneNumber,c=s.phoneEnrollmentInfo.captchaResponse,l=s.phoneEnrollmentInfo.clientType,h=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:o,recaptchaToken:r,captchaResponse:c,clientType:l,recaptchaVersion:h}}),s}else if("phoneSignInInfo"in s){let o=s.phoneSignInInfo.captchaResponse,c=s.phoneSignInInfo.clientType,l=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:o,clientType:c,recaptchaVersion:l}}),s}else return Object.assign(s,{recaptchaToken:r}),s}var Gn=class n{constructor(e){this.providerId=n.PROVIDER_ID,this.auth=Mt(e)}verifyPhoneNumber(e,t){return im(this.auth,e,De(t))}static credential(e,t){return Fn._fromVerification(e,t)}static credentialFromResult(e){let t=e;return n.credentialFromTaggedObject(t)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:r}=e;return t&&r?Fn._fromTokenResponse(t,r):null}};Gn.PROVIDER_ID="phone";Gn.PHONE_SIGN_IN_METHOD="phone";function sm(n,e){return e?Ge(e):(D(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}var $n=class extends gt{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return xt(e,this._buildIdpRequest())}_linkToIdToken(e,t){return xt(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return xt(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function om(n){return Up(n.auth,new $n(n),n.bypassAuthState)}function am(n){let{auth:e,user:t}=n;return D(t,e,"internal-error"),Fp(t,new $n(n),n.bypassAuthState)}async function cm(n){let{auth:e,user:t}=n;return D(t,e,"internal-error"),Mp(t,new $n(n),n.bypassAuthState)}var hi=class{constructor(e,t,r,s,o=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:r,postBody:s,tenantId:o,error:c,type:l}=e;if(c){this.reject(c);return}let h={auth:this.auth,requestUri:t,sessionId:r,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(h))}catch(f){this.reject(f)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return om;case"linkViaPopup":case"linkViaRedirect":return cm;case"reauthViaPopup":case"reauthViaRedirect":return am;default:Re(this.auth,"internal-error")}}resolve(e){$e(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){$e(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};var um=new mt(2e3,1e4);var co=class n extends hi{constructor(e,t,r,s,o){super(e,t,s,o),this.provider=r,this.authWindow=null,this.pollId=null,n.currentPopupAction&&n.currentPopupAction.cancel(),n.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return D(e,this.auth,"internal-error"),e}async onExecution(){$e(this.filter.length===1,"Popup operations only handle one event");let e=wo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Ve(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ve(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,n.currentPopupAction=null}pollUserCancellation(){let e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ve(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,um.get())};e()}};co.currentPopupAction=null;var lm="pendingRedirect",$r=new Map,uo=class extends hi{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=$r.get(this.auth._key());if(!e){try{let r=await hm(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}$r.set(this.auth._key(),e)}return this.bypassAuthState||$r.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function hm(n,e){let t=pm(e),r=fm(n);if(!await r._isAvailable())return!1;let s=await r._get(t)==="true";return await r._remove(t),s}function dm(n,e){$r.set(n._key(),e)}function fm(n){return Ge(n._redirectPersistence)}function pm(n){return zr(lm,n.config.apiKey,n.name)}async function mm(n,e,t=!1){if(Te(n.app))return Promise.reject(pt(n));let r=Mt(n),s=sm(r,e),c=await new uo(r,s,t).execute();return c&&!t&&(delete c.user._redirectEventId,await r._persistUserIfCurrent(c.user),await r._setRedirectUser(null,e)),c}var gm=10*60*1e3,lo=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!_m(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Nl(e)){let s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(Ve(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=gm&&this.cachedEventUids.clear(),this.cachedEventUids.has(Hu(e))}saveEventToCache(e){this.cachedEventUids.add(Hu(e)),this.lastProcessedEventTime=Date.now()}};function Hu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Nl({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function _m(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Nl(n);default:return!1}}async function ym(n,e={}){return le(n,"GET","/v1/projects",e)}var vm=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Im=/^https?/;async function wm(n){if(n.config.emulator)return;let{authorizedDomains:e}=await ym(n);for(let t of e)try{if(Em(t))return}catch{}Re(n,"unauthorized-domain")}function Em(n){let e=Qs(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){let c=new URL(n);return c.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&c.hostname===r}if(!Im.test(t))return!1;if(vm.test(n))return r===n;let s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}var Tm=new mt(3e4,6e4);function Qu(){let n=xe().___jsl;if(n?.H){for(let e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Am(n){return new Promise((e,t)=>{var r,s,o;function c(){Qu(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Qu(),t(Ve(n,"network-request-failed"))},timeout:Tm.get()})}if(!((s=(r=xe().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((o=xe().gapi)===null||o===void 0)&&o.load)c();else{let l=Il("iframefcb");return xe()[l]=()=>{gapi.load?c():t(Ve(n,"network-request-failed"))},vl(`${Ip()}?onload=${l}`).catch(h=>t(h))}}).catch(e=>{throw Wr=null,e})}var Wr=null;function bm(n){return Wr=Wr||Am(n),Wr}var Sm=new mt(5e3,15e3),Rm="__/auth/iframe",Pm="emulator/auth/iframe",Cm={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},km=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Dm(n){let e=n.config;D(e.authDomain,n,"auth-domain-config-required");let t=e.emulator?go(e,Pm):`https://${n.config.authDomain}/${Rm}`,r={apiKey:e.apiKey,appName:n.name,v:nt},s=km.get(n.config.apiHost);s&&(r.eid=s);let o=n._getFrameworks();return o.length&&(r.fw=o.join(",")),`${t}?${Nt(r).slice(1)}`}async function Nm(n){let e=await bm(n),t=xe().gapi;return D(t,n,"internal-error"),e.open({where:document.body,url:Dm(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Cm,dontclear:!0},r=>new Promise(async(s,o)=>{await r.restyle({setHideOnLeave:!1});let c=Ve(n,"network-request-failed"),l=xe().setTimeout(()=>{o(c)},Sm.get());function h(){xe().clearTimeout(l),s(r)}r.ping(h).then(h,()=>{o(c)})}))}var Om={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Vm=500,xm=600,Lm="_blank",Mm="http://localhost",di=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function Fm(n,e,t,r=Vm,s=xm){let o=Math.max((window.screen.availHeight-s)/2,0).toString(),c=Math.max((window.screen.availWidth-r)/2,0).toString(),l="",h=Object.assign(Object.assign({},Om),{width:r.toString(),height:s.toString(),top:o,left:c}),f=te().toLowerCase();t&&(l=dl(f)?Lm:t),ll(f)&&(e=e||Mm,h.scrollbars="yes");let y=Object.entries(h).reduce((b,[C,k])=>`${b}${C}=${k},`,"");if(pp(f)&&l!=="_self")return Um(e||"",l),new di(null);let T=window.open(e||"",l,y);D(T,n,"popup-blocked");try{T.focus()}catch{}return new di(T)}function Um(n,e){let t=document.createElement("a");t.href=n,t.target=e;let r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}var Bm="__/auth/handler",qm="emulator/auth/handler",jm=encodeURIComponent("fac");async function Ju(n,e,t,r,s,o){D(n.config.authDomain,n,"auth-domain-config-required"),D(n.config.apiKey,n,"invalid-api-key");let c={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:nt,eventId:s};if(e instanceof ri){e.setDefaultLanguage(n.languageCode),c.providerId=e.providerId||"",Iu(e.getCustomParameters())||(c.customParameters=JSON.stringify(e.getCustomParameters()));for(let[y,T]of Object.entries(o||{}))c[y]=T}if(e instanceof yt){let y=e.getScopes().filter(T=>T!=="");y.length>0&&(c.scopes=y.join(","))}n.tenantId&&(c.tid=n.tenantId);let l=c;for(let y of Object.keys(l))l[y]===void 0&&delete l[y];let h=await n._getAppCheckToken(),f=h?`#${jm}=${encodeURIComponent(h)}`:"";return`${zm(n)}?${Nt(l).slice(1)}${f}`}function zm({config:n}){return n.emulator?go(n,qm):`https://${n.authDomain}/${Bm}`}var Hs="webStorageSupport",ho=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Io,this._completeRedirectFn=mm,this._overrideRedirectResult=dm}async _openPopup(e,t,r,s){var o;$e((o=this.eventManagers[e._key()])===null||o===void 0?void 0:o.manager,"_initialize() not called before _openPopup()");let c=await Ju(e,t,r,Qs(),s);return Fm(e,c,wo())}async _openRedirect(e,t,r,s){await this._originValidation(e);let o=await Ju(e,t,r,Qs(),s);return Kp(o),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:s,promise:o}=this.eventManagers[t];return s?Promise.resolve(s):($e(o,"If manager is not set, promise should be"),o)}let r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){let t=await Nm(e),r=new lo(e);return t.register("authEvent",s=>(D(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Hs,{type:Hs},s=>{var o;let c=(o=s?.[0])===null||o===void 0?void 0:o[Hs];c!==void 0&&t(!!c),Re(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=wm(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _l()||hl()||yo()}},Ol=ho,fi=class{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return Oe("unexpected MultiFactorSessionType")}}},fo=class n extends fi{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new n(e)}_finalizeEnroll(e,t,r){return Bp(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return nm(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},pi=class{constructor(){}static assertion(e){return fo._fromCredential(e)}};pi.FACTOR_ID="phone";var mi=class{static assertionForEnrollment(e,t){return gi._fromSecret(e,t)}static assertionForSignIn(e,t){return gi._fromEnrollmentId(e,t)}static async generateSecret(e){var t;let r=e;D(typeof((t=r.user)===null||t===void 0?void 0:t.auth)<"u","internal-error");let s=await qp(r.user.auth,{idToken:r.credential,totpEnrollmentInfo:{}});return _i._fromStartTotpMfaEnrollmentResponse(s,r.user.auth)}};mi.FACTOR_ID="totp";var gi=class n extends fi{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new n(t,void 0,e)}static _fromEnrollmentId(e,t){return new n(t,e)}async _finalizeEnroll(e,t,r){return D(typeof this.secret<"u",e,"argument-error"),jp(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){D(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");let r={verificationCode:this.otp};return rm(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}},_i=class n{constructor(e,t,r,s,o,c,l){this.sessionInfo=c,this.auth=l,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=o}static _fromStartTotpMfaEnrollmentResponse(e,t){return new n(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var r;let s=!1;return(qr(e)||qr(t))&&(s=!0),s&&(qr(e)&&(e=((r=this.auth.currentUser)===null||r===void 0?void 0:r.email)||"unknownuser"),qr(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function qr(n){return typeof n>"u"||n?.length===0}var Yu="@firebase/auth",Xu="1.10.8";var po=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){D(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};function Gm(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function $m(n){tt(new Ee("auth",(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:c,authDomain:l}=r.options;D(c&&!c.includes(":"),"invalid-api-key",{appName:r.name});let h={apiKey:c,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:yl(n)},f=new to(r,s,o,h);return Tp(f,t),f},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),tt(new Ee("auth-internal",e=>{let t=Mt(e.getProvider("auth").getImmediate());return(r=>new po(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Se(Yu,Xu,Gm(n)),Se(Yu,Xu,"esm2017")}var Wm=5*60,Km=Ss("authIdTokenMaxAge")||Wm,Zu=null,Hm=n=>async e=>{let t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Km)return;let s=t?.token;Zu!==s&&(Zu=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Eo(n=Ur()){let e=Pn(n,"auth");if(e.isInitialized())return e.getImmediate();let t=wl(n,{popupRedirectResolver:Ol,persistence:[Dl,Rl,Io]}),r=Ss("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){let o=new URL(r,location.origin);if(location.origin===o.origin){let c=Hm(o.toString());Sl(t,c,()=>c(t.currentUser)),bl(t,l=>c(l))}}let s=As("auth");return s&&El(t,`http://${s}`),t}function Qm(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}yp({loadJS(n){return new Promise((e,t)=>{let r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{let o=Ve("internal-error");o.customData=s,t(o)},r.type="text/javascript",r.charset="UTF-8",Qm().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});$m("Browser");var Jm="firebase",Ym="11.10.0";Se(Jm,Ym,"app");var Vl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},xl={};var Ii,Ll;(function(){var n;function e(I,p){function g(){}g.prototype=p.prototype,I.D=p.prototype,I.prototype=new g,I.prototype.constructor=I,I.C=function(_,v,E){for(var m=Array(arguments.length-2),Ue=2;Ue<arguments.length;Ue++)m[Ue-2]=arguments[Ue];return p.prototype[v].apply(_,m)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,p,g){g||(g=0);var _=Array(16);if(typeof p=="string")for(var v=0;16>v;++v)_[v]=p.charCodeAt(g++)|p.charCodeAt(g++)<<8|p.charCodeAt(g++)<<16|p.charCodeAt(g++)<<24;else for(v=0;16>v;++v)_[v]=p[g++]|p[g++]<<8|p[g++]<<16|p[g++]<<24;p=I.g[0],g=I.g[1],v=I.g[2];var E=I.g[3],m=p+(E^g&(v^E))+_[0]+3614090360&4294967295;p=g+(m<<7&4294967295|m>>>25),m=E+(v^p&(g^v))+_[1]+3905402710&4294967295,E=p+(m<<12&4294967295|m>>>20),m=v+(g^E&(p^g))+_[2]+606105819&4294967295,v=E+(m<<17&4294967295|m>>>15),m=g+(p^v&(E^p))+_[3]+3250441966&4294967295,g=v+(m<<22&4294967295|m>>>10),m=p+(E^g&(v^E))+_[4]+4118548399&4294967295,p=g+(m<<7&4294967295|m>>>25),m=E+(v^p&(g^v))+_[5]+1200080426&4294967295,E=p+(m<<12&4294967295|m>>>20),m=v+(g^E&(p^g))+_[6]+2821735955&4294967295,v=E+(m<<17&4294967295|m>>>15),m=g+(p^v&(E^p))+_[7]+4249261313&4294967295,g=v+(m<<22&4294967295|m>>>10),m=p+(E^g&(v^E))+_[8]+1770035416&4294967295,p=g+(m<<7&4294967295|m>>>25),m=E+(v^p&(g^v))+_[9]+2336552879&4294967295,E=p+(m<<12&4294967295|m>>>20),m=v+(g^E&(p^g))+_[10]+4294925233&4294967295,v=E+(m<<17&4294967295|m>>>15),m=g+(p^v&(E^p))+_[11]+2304563134&4294967295,g=v+(m<<22&4294967295|m>>>10),m=p+(E^g&(v^E))+_[12]+1804603682&4294967295,p=g+(m<<7&4294967295|m>>>25),m=E+(v^p&(g^v))+_[13]+4254626195&4294967295,E=p+(m<<12&4294967295|m>>>20),m=v+(g^E&(p^g))+_[14]+2792965006&4294967295,v=E+(m<<17&4294967295|m>>>15),m=g+(p^v&(E^p))+_[15]+1236535329&4294967295,g=v+(m<<22&4294967295|m>>>10),m=p+(v^E&(g^v))+_[1]+4129170786&4294967295,p=g+(m<<5&4294967295|m>>>27),m=E+(g^v&(p^g))+_[6]+3225465664&4294967295,E=p+(m<<9&4294967295|m>>>23),m=v+(p^g&(E^p))+_[11]+643717713&4294967295,v=E+(m<<14&4294967295|m>>>18),m=g+(E^p&(v^E))+_[0]+3921069994&4294967295,g=v+(m<<20&4294967295|m>>>12),m=p+(v^E&(g^v))+_[5]+3593408605&4294967295,p=g+(m<<5&4294967295|m>>>27),m=E+(g^v&(p^g))+_[10]+38016083&4294967295,E=p+(m<<9&4294967295|m>>>23),m=v+(p^g&(E^p))+_[15]+3634488961&4294967295,v=E+(m<<14&4294967295|m>>>18),m=g+(E^p&(v^E))+_[4]+3889429448&4294967295,g=v+(m<<20&4294967295|m>>>12),m=p+(v^E&(g^v))+_[9]+568446438&4294967295,p=g+(m<<5&4294967295|m>>>27),m=E+(g^v&(p^g))+_[14]+3275163606&4294967295,E=p+(m<<9&4294967295|m>>>23),m=v+(p^g&(E^p))+_[3]+4107603335&4294967295,v=E+(m<<14&4294967295|m>>>18),m=g+(E^p&(v^E))+_[8]+1163531501&4294967295,g=v+(m<<20&4294967295|m>>>12),m=p+(v^E&(g^v))+_[13]+2850285829&4294967295,p=g+(m<<5&4294967295|m>>>27),m=E+(g^v&(p^g))+_[2]+4243563512&4294967295,E=p+(m<<9&4294967295|m>>>23),m=v+(p^g&(E^p))+_[7]+1735328473&4294967295,v=E+(m<<14&4294967295|m>>>18),m=g+(E^p&(v^E))+_[12]+2368359562&4294967295,g=v+(m<<20&4294967295|m>>>12),m=p+(g^v^E)+_[5]+4294588738&4294967295,p=g+(m<<4&4294967295|m>>>28),m=E+(p^g^v)+_[8]+2272392833&4294967295,E=p+(m<<11&4294967295|m>>>21),m=v+(E^p^g)+_[11]+1839030562&4294967295,v=E+(m<<16&4294967295|m>>>16),m=g+(v^E^p)+_[14]+4259657740&4294967295,g=v+(m<<23&4294967295|m>>>9),m=p+(g^v^E)+_[1]+2763975236&4294967295,p=g+(m<<4&4294967295|m>>>28),m=E+(p^g^v)+_[4]+1272893353&4294967295,E=p+(m<<11&4294967295|m>>>21),m=v+(E^p^g)+_[7]+4139469664&4294967295,v=E+(m<<16&4294967295|m>>>16),m=g+(v^E^p)+_[10]+3200236656&4294967295,g=v+(m<<23&4294967295|m>>>9),m=p+(g^v^E)+_[13]+681279174&4294967295,p=g+(m<<4&4294967295|m>>>28),m=E+(p^g^v)+_[0]+3936430074&4294967295,E=p+(m<<11&4294967295|m>>>21),m=v+(E^p^g)+_[3]+3572445317&4294967295,v=E+(m<<16&4294967295|m>>>16),m=g+(v^E^p)+_[6]+76029189&4294967295,g=v+(m<<23&4294967295|m>>>9),m=p+(g^v^E)+_[9]+3654602809&4294967295,p=g+(m<<4&4294967295|m>>>28),m=E+(p^g^v)+_[12]+3873151461&4294967295,E=p+(m<<11&4294967295|m>>>21),m=v+(E^p^g)+_[15]+530742520&4294967295,v=E+(m<<16&4294967295|m>>>16),m=g+(v^E^p)+_[2]+3299628645&4294967295,g=v+(m<<23&4294967295|m>>>9),m=p+(v^(g|~E))+_[0]+4096336452&4294967295,p=g+(m<<6&4294967295|m>>>26),m=E+(g^(p|~v))+_[7]+1126891415&4294967295,E=p+(m<<10&4294967295|m>>>22),m=v+(p^(E|~g))+_[14]+2878612391&4294967295,v=E+(m<<15&4294967295|m>>>17),m=g+(E^(v|~p))+_[5]+4237533241&4294967295,g=v+(m<<21&4294967295|m>>>11),m=p+(v^(g|~E))+_[12]+1700485571&4294967295,p=g+(m<<6&4294967295|m>>>26),m=E+(g^(p|~v))+_[3]+2399980690&4294967295,E=p+(m<<10&4294967295|m>>>22),m=v+(p^(E|~g))+_[10]+4293915773&4294967295,v=E+(m<<15&4294967295|m>>>17),m=g+(E^(v|~p))+_[1]+2240044497&4294967295,g=v+(m<<21&4294967295|m>>>11),m=p+(v^(g|~E))+_[8]+1873313359&4294967295,p=g+(m<<6&4294967295|m>>>26),m=E+(g^(p|~v))+_[15]+4264355552&4294967295,E=p+(m<<10&4294967295|m>>>22),m=v+(p^(E|~g))+_[6]+2734768916&4294967295,v=E+(m<<15&4294967295|m>>>17),m=g+(E^(v|~p))+_[13]+1309151649&4294967295,g=v+(m<<21&4294967295|m>>>11),m=p+(v^(g|~E))+_[4]+4149444226&4294967295,p=g+(m<<6&4294967295|m>>>26),m=E+(g^(p|~v))+_[11]+3174756917&4294967295,E=p+(m<<10&4294967295|m>>>22),m=v+(p^(E|~g))+_[2]+718787259&4294967295,v=E+(m<<15&4294967295|m>>>17),m=g+(E^(v|~p))+_[9]+3951481745&4294967295,I.g[0]=I.g[0]+p&4294967295,I.g[1]=I.g[1]+(v+(m<<21&4294967295|m>>>11))&4294967295,I.g[2]=I.g[2]+v&4294967295,I.g[3]=I.g[3]+E&4294967295}r.prototype.u=function(I,p){p===void 0&&(p=I.length);for(var g=p-this.blockSize,_=this.B,v=this.h,E=0;E<p;){if(v==0)for(;E<=g;)s(this,I,E),E+=this.blockSize;if(typeof I=="string"){for(;E<p;)if(_[v++]=I.charCodeAt(E++),v==this.blockSize){s(this,_),v=0;break}}else for(;E<p;)if(_[v++]=I[E++],v==this.blockSize){s(this,_),v=0;break}}this.h=v,this.o+=p},r.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var p=1;p<I.length-8;++p)I[p]=0;var g=8*this.o;for(p=I.length-8;p<I.length;++p)I[p]=g&255,g/=256;for(this.u(I),I=Array(16),p=g=0;4>p;++p)for(var _=0;32>_;_+=8)I[g++]=this.g[p]>>>_&255;return I};function o(I,p){var g=l;return Object.prototype.hasOwnProperty.call(g,I)?g[I]:g[I]=p(I)}function c(I,p){this.h=p;for(var g=[],_=!0,v=I.length-1;0<=v;v--){var E=I[v]|0;_&&E==p||(g[v]=E,_=!1)}this.g=g}var l={};function h(I){return-128<=I&&128>I?o(I,function(p){return new c([p|0],0>p?-1:0)}):new c([I|0],0>I?-1:0)}function f(I){if(isNaN(I)||!isFinite(I))return T;if(0>I)return O(f(-I));for(var p=[],g=1,_=0;I>=g;_++)p[_]=I/g|0,g*=4294967296;return new c(p,0)}function y(I,p){if(I.length==0)throw Error("number format error: empty string");if(p=p||10,2>p||36<p)throw Error("radix out of range: "+p);if(I.charAt(0)=="-")return O(y(I.substring(1),p));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var g=f(Math.pow(p,8)),_=T,v=0;v<I.length;v+=8){var E=Math.min(8,I.length-v),m=parseInt(I.substring(v,v+E),p);8>E?(E=f(Math.pow(p,E)),_=_.j(E).add(f(m))):(_=_.j(g),_=_.add(f(m)))}return _}var T=h(0),b=h(1),C=h(16777216);n=c.prototype,n.m=function(){if(L(this))return-O(this).m();for(var I=0,p=1,g=0;g<this.g.length;g++){var _=this.i(g);I+=(0<=_?_:4294967296+_)*p,p*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(k(this))return"0";if(L(this))return"-"+O(this).toString(I);for(var p=f(Math.pow(I,6)),g=this,_="";;){var v=K(g,p).g;g=H(g,v.j(p));var E=((0<g.g.length?g.g[0]:g.h)>>>0).toString(I);if(g=v,k(g))return E+_;for(;6>E.length;)E="0"+E;_=E+_}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function k(I){if(I.h!=0)return!1;for(var p=0;p<I.g.length;p++)if(I.g[p]!=0)return!1;return!0}function L(I){return I.h==-1}n.l=function(I){return I=H(this,I),L(I)?-1:k(I)?0:1};function O(I){for(var p=I.g.length,g=[],_=0;_<p;_++)g[_]=~I.g[_];return new c(g,~I.h).add(b)}n.abs=function(){return L(this)?O(this):this},n.add=function(I){for(var p=Math.max(this.g.length,I.g.length),g=[],_=0,v=0;v<=p;v++){var E=_+(this.i(v)&65535)+(I.i(v)&65535),m=(E>>>16)+(this.i(v)>>>16)+(I.i(v)>>>16);_=m>>>16,E&=65535,m&=65535,g[v]=m<<16|E}return new c(g,g[g.length-1]&-2147483648?-1:0)};function H(I,p){return I.add(O(p))}n.j=function(I){if(k(this)||k(I))return T;if(L(this))return L(I)?O(this).j(O(I)):O(O(this).j(I));if(L(I))return O(this.j(O(I)));if(0>this.l(C)&&0>I.l(C))return f(this.m()*I.m());for(var p=this.g.length+I.g.length,g=[],_=0;_<2*p;_++)g[_]=0;for(_=0;_<this.g.length;_++)for(var v=0;v<I.g.length;v++){var E=this.i(_)>>>16,m=this.i(_)&65535,Ue=I.i(v)>>>16,sn=I.i(v)&65535;g[2*_+2*v]+=m*sn,j(g,2*_+2*v),g[2*_+2*v+1]+=E*sn,j(g,2*_+2*v+1),g[2*_+2*v+1]+=m*Ue,j(g,2*_+2*v+1),g[2*_+2*v+2]+=E*Ue,j(g,2*_+2*v+2)}for(_=0;_<p;_++)g[_]=g[2*_+1]<<16|g[2*_];for(_=p;_<2*p;_++)g[_]=0;return new c(g,0)};function j(I,p){for(;(I[p]&65535)!=I[p];)I[p+1]+=I[p]>>>16,I[p]&=65535,p++}function G(I,p){this.g=I,this.h=p}function K(I,p){if(k(p))throw Error("division by zero");if(k(I))return new G(T,T);if(L(I))return p=K(O(I),p),new G(O(p.g),O(p.h));if(L(p))return p=K(I,O(p)),new G(O(p.g),p.h);if(30<I.g.length){if(L(I)||L(p))throw Error("slowDivide_ only works with positive integers.");for(var g=b,_=p;0>=_.l(I);)g=Ce(g),_=Ce(_);var v=ee(g,1),E=ee(_,1);for(_=ee(_,2),g=ee(g,2);!k(_);){var m=E.add(_);0>=m.l(I)&&(v=v.add(g),E=m),_=ee(_,1),g=ee(g,1)}return p=H(I,v.j(p)),new G(v,p)}for(v=T;0<=I.l(p);){for(g=Math.max(1,Math.floor(I.m()/p.m())),_=Math.ceil(Math.log(g)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),E=f(g),m=E.j(p);L(m)||0<m.l(I);)g-=_,E=f(g),m=E.j(p);k(E)&&(E=b),v=v.add(E),I=H(I,m)}return new G(v,I)}n.A=function(I){return K(this,I).h},n.and=function(I){for(var p=Math.max(this.g.length,I.g.length),g=[],_=0;_<p;_++)g[_]=this.i(_)&I.i(_);return new c(g,this.h&I.h)},n.or=function(I){for(var p=Math.max(this.g.length,I.g.length),g=[],_=0;_<p;_++)g[_]=this.i(_)|I.i(_);return new c(g,this.h|I.h)},n.xor=function(I){for(var p=Math.max(this.g.length,I.g.length),g=[],_=0;_<p;_++)g[_]=this.i(_)^I.i(_);return new c(g,this.h^I.h)};function Ce(I){for(var p=I.g.length+1,g=[],_=0;_<p;_++)g[_]=I.i(_)<<1|I.i(_-1)>>>31;return new c(g,I.h)}function ee(I,p){var g=p>>5;p%=32;for(var _=I.g.length-g,v=[],E=0;E<_;E++)v[E]=0<p?I.i(E+g)>>>p|I.i(E+g+1)<<32-p:I.i(E+g);return new c(v,I.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Ll=xl.Md5=r,c.prototype.add=c.prototype.add,c.prototype.multiply=c.prototype.j,c.prototype.modulo=c.prototype.A,c.prototype.compare=c.prototype.l,c.prototype.toNumber=c.prototype.m,c.prototype.toString=c.prototype.toString,c.prototype.getBits=c.prototype.i,c.fromNumber=f,c.fromString=y,Ii=xl.Integer=c}).apply(typeof Vl<"u"?Vl:typeof self<"u"?self:typeof window<"u"?window:{});var wi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},We={};var To,Xm,Ft,Ao,Wn,Ei,bo,So,Ro;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,a,u){return i==Array.prototype||i==Object.prototype||(i[a]=u.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof wi=="object"&&wi];for(var a=0;a<i.length;++a){var u=i[a];if(u&&u.Math==Math)return u}throw Error("Cannot find global object")}var r=t(this);function s(i,a){if(a)e:{var u=r;i=i.split(".");for(var d=0;d<i.length-1;d++){var w=i[d];if(!(w in u))break e;u=u[w]}i=i[i.length-1],d=u[i],a=a(d),a!=d&&a!=null&&e(u,i,{configurable:!0,writable:!0,value:a})}}function o(i,a){i instanceof String&&(i+="");var u=0,d=!1,w={next:function(){if(!d&&u<i.length){var A=u++;return{value:a(A,i[A]),done:!1}}return d=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}s("Array.prototype.values",function(i){return i||function(){return o(this,function(a,u){return u})}});var c=c||{},l=this||self;function h(i){var a=typeof i;return a=a!="object"?a:i?Array.isArray(i)?"array":a:"null",a=="array"||a=="object"&&typeof i.length=="number"}function f(i){var a=typeof i;return a=="object"&&i!=null||a=="function"}function y(i,a,u){return i.call.apply(i.bind,arguments)}function T(i,a,u){if(!i)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,d),i.apply(a,w)}}return function(){return i.apply(a,arguments)}}function b(i,a,u){return b=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?y:T,b.apply(null,arguments)}function C(i,a){var u=Array.prototype.slice.call(arguments,1);return function(){var d=u.slice();return d.push.apply(d,arguments),i.apply(this,d)}}function k(i,a){function u(){}u.prototype=a.prototype,i.aa=a.prototype,i.prototype=new u,i.prototype.constructor=i,i.Qb=function(d,w,A){for(var R=Array(arguments.length-2),z=2;z<arguments.length;z++)R[z-2]=arguments[z];return a.prototype[w].apply(d,R)}}function L(i){let a=i.length;if(0<a){let u=Array(a);for(let d=0;d<a;d++)u[d]=i[d];return u}return[]}function O(i,a){for(let u=1;u<arguments.length;u++){let d=arguments[u];if(h(d)){let w=i.length||0,A=d.length||0;i.length=w+A;for(let R=0;R<A;R++)i[w+R]=d[R]}else i.push(d)}}class H{constructor(a,u){this.i=a,this.j=u,this.h=0,this.g=null}get(){let a;return 0<this.h?(this.h--,a=this.g,this.g=a.next,a.next=null):a=this.i(),a}}function j(i){return/^[\s\xa0]*$/.test(i)}function G(){var i=l.navigator;return i&&(i=i.userAgent)?i:""}function K(i){return K[" "](i),i}K[" "]=function(){};var Ce=G().indexOf("Gecko")!=-1&&!(G().toLowerCase().indexOf("webkit")!=-1&&G().indexOf("Edge")==-1)&&!(G().indexOf("Trident")!=-1||G().indexOf("MSIE")!=-1)&&G().indexOf("Edge")==-1;function ee(i,a,u){for(let d in i)a.call(u,i[d],d,i)}function I(i,a){for(let u in i)a.call(void 0,i[u],u,i)}function p(i){let a={};for(let u in i)a[u]=i[u];return a}let g="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(i,a){let u,d;for(let w=1;w<arguments.length;w++){d=arguments[w];for(u in d)i[u]=d[u];for(let A=0;A<g.length;A++)u=g[A],Object.prototype.hasOwnProperty.call(d,u)&&(i[u]=d[u])}}function v(i){var a=1;i=i.split(":");let u=[];for(;0<a&&i.length;)u.push(i.shift()),a--;return i.length&&u.push(i.join(":")),u}function E(i){l.setTimeout(()=>{throw i},0)}function m(){var i=Ji;let a=null;return i.g&&(a=i.g,i.g=i.g.next,i.g||(i.h=null),a.next=null),a}class Ue{constructor(){this.h=this.g=null}add(a,u){let d=sn.get();d.set(a,u),this.h?this.h.next=d:this.g=d,this.h=d}}var sn=new H(()=>new ad,i=>i.reset());class ad{constructor(){this.next=this.g=this.h=null}set(a,u){this.h=a,this.g=u,this.next=null}reset(){this.next=this.g=this.h=null}}let on,an=!1,Ji=new Ue,rc=()=>{let i=l.Promise.resolve(void 0);on=()=>{i.then(cd)}};var cd=()=>{for(var i;i=m();){try{i.h.call(i.g)}catch(u){E(u)}var a=sn;a.j(i),100>a.h&&(a.h++,i.next=a.g,a.g=i)}an=!1};function He(){this.s=this.s,this.C=this.C}He.prototype.s=!1,He.prototype.ma=function(){this.s||(this.s=!0,this.N())},He.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function oe(i,a){this.type=i,this.g=this.target=a,this.defaultPrevented=!1}oe.prototype.h=function(){this.defaultPrevented=!0};var ud=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var i=!1,a=Object.defineProperty({},"passive",{get:function(){i=!0}});try{let u=()=>{};l.addEventListener("test",u,a),l.removeEventListener("test",u,a)}catch{}return i}();function cn(i,a){if(oe.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var u=this.type=i.type,d=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=a,a=i.relatedTarget){if(Ce){e:{try{K(a.nodeName);var w=!0;break e}catch{}w=!1}w||(a=null)}}else u=="mouseover"?a=i.fromElement:u=="mouseout"&&(a=i.toElement);this.relatedTarget=a,d?(this.clientX=d.clientX!==void 0?d.clientX:d.pageX,this.clientY=d.clientY!==void 0?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:ld[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&cn.aa.h.call(this)}}k(cn,oe);var ld={2:"touch",3:"pen",4:"mouse"};cn.prototype.h=function(){cn.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var un="closure_listenable_"+(1e6*Math.random()|0),hd=0;function dd(i,a,u,d,w){this.listener=i,this.proxy=null,this.src=a,this.type=u,this.capture=!!d,this.ha=w,this.key=++hd,this.da=this.fa=!1}function pr(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function mr(i){this.src=i,this.g={},this.h=0}mr.prototype.add=function(i,a,u,d,w){var A=i.toString();i=this.g[A],i||(i=this.g[A]=[],this.h++);var R=Xi(i,a,d,w);return-1<R?(a=i[R],u||(a.fa=!1)):(a=new dd(a,this.src,A,!!d,w),a.fa=u,i.push(a)),a};function Yi(i,a){var u=a.type;if(u in i.g){var d=i.g[u],w=Array.prototype.indexOf.call(d,a,void 0),A;(A=0<=w)&&Array.prototype.splice.call(d,w,1),A&&(pr(a),i.g[u].length==0&&(delete i.g[u],i.h--))}}function Xi(i,a,u,d){for(var w=0;w<i.length;++w){var A=i[w];if(!A.da&&A.listener==a&&A.capture==!!u&&A.ha==d)return w}return-1}var Zi="closure_lm_"+(1e6*Math.random()|0),es={};function ic(i,a,u,d,w){if(d&&d.once)return oc(i,a,u,d,w);if(Array.isArray(a)){for(var A=0;A<a.length;A++)ic(i,a[A],u,d,w);return null}return u=is(u),i&&i[un]?i.K(a,u,f(d)?!!d.capture:!!d,w):sc(i,a,u,!1,d,w)}function sc(i,a,u,d,w,A){if(!a)throw Error("Invalid event type");var R=f(w)?!!w.capture:!!w,z=ns(i);if(z||(i[Zi]=z=new mr(i)),u=z.add(a,u,d,R,A),u.proxy)return u;if(d=fd(),u.proxy=d,d.src=i,d.listener=u,i.addEventListener)ud||(w=R),w===void 0&&(w=!1),i.addEventListener(a.toString(),d,w);else if(i.attachEvent)i.attachEvent(cc(a.toString()),d);else if(i.addListener&&i.removeListener)i.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");return u}function fd(){function i(u){return a.call(i.src,i.listener,u)}let a=pd;return i}function oc(i,a,u,d,w){if(Array.isArray(a)){for(var A=0;A<a.length;A++)oc(i,a[A],u,d,w);return null}return u=is(u),i&&i[un]?i.L(a,u,f(d)?!!d.capture:!!d,w):sc(i,a,u,!0,d,w)}function ac(i,a,u,d,w){if(Array.isArray(a))for(var A=0;A<a.length;A++)ac(i,a[A],u,d,w);else d=f(d)?!!d.capture:!!d,u=is(u),i&&i[un]?(i=i.i,a=String(a).toString(),a in i.g&&(A=i.g[a],u=Xi(A,u,d,w),-1<u&&(pr(A[u]),Array.prototype.splice.call(A,u,1),A.length==0&&(delete i.g[a],i.h--)))):i&&(i=ns(i))&&(a=i.g[a.toString()],i=-1,a&&(i=Xi(a,u,d,w)),(u=-1<i?a[i]:null)&&ts(u))}function ts(i){if(typeof i!="number"&&i&&!i.da){var a=i.src;if(a&&a[un])Yi(a.i,i);else{var u=i.type,d=i.proxy;a.removeEventListener?a.removeEventListener(u,d,i.capture):a.detachEvent?a.detachEvent(cc(u),d):a.addListener&&a.removeListener&&a.removeListener(d),(u=ns(a))?(Yi(u,i),u.h==0&&(u.src=null,a[Zi]=null)):pr(i)}}}function cc(i){return i in es?es[i]:es[i]="on"+i}function pd(i,a){if(i.da)i=!0;else{a=new cn(a,this);var u=i.listener,d=i.ha||i.src;i.fa&&ts(i),i=u.call(d,a)}return i}function ns(i){return i=i[Zi],i instanceof mr?i:null}var rs="__closure_events_fn_"+(1e9*Math.random()>>>0);function is(i){return typeof i=="function"?i:(i[rs]||(i[rs]=function(a){return i.handleEvent(a)}),i[rs])}function ae(){He.call(this),this.i=new mr(this),this.M=this,this.F=null}k(ae,He),ae.prototype[un]=!0,ae.prototype.removeEventListener=function(i,a,u,d){ac(this,i,a,u,d)};function fe(i,a){var u,d=i.F;if(d)for(u=[];d;d=d.F)u.push(d);if(i=i.M,d=a.type||a,typeof a=="string")a=new oe(a,i);else if(a instanceof oe)a.target=a.target||i;else{var w=a;a=new oe(d,i),_(a,w)}if(w=!0,u)for(var A=u.length-1;0<=A;A--){var R=a.g=u[A];w=gr(R,d,!0,a)&&w}if(R=a.g=i,w=gr(R,d,!0,a)&&w,w=gr(R,d,!1,a)&&w,u)for(A=0;A<u.length;A++)R=a.g=u[A],w=gr(R,d,!1,a)&&w}ae.prototype.N=function(){if(ae.aa.N.call(this),this.i){var i=this.i,a;for(a in i.g){for(var u=i.g[a],d=0;d<u.length;d++)pr(u[d]);delete i.g[a],i.h--}}this.F=null},ae.prototype.K=function(i,a,u,d){return this.i.add(String(i),a,!1,u,d)},ae.prototype.L=function(i,a,u,d){return this.i.add(String(i),a,!0,u,d)};function gr(i,a,u,d){if(a=i.i.g[String(a)],!a)return!0;a=a.concat();for(var w=!0,A=0;A<a.length;++A){var R=a[A];if(R&&!R.da&&R.capture==u){var z=R.listener,ie=R.ha||R.src;R.fa&&Yi(i.i,R),w=z.call(ie,d)!==!1&&w}}return w&&!d.defaultPrevented}function uc(i,a,u){if(typeof i=="function")u&&(i=b(i,u));else if(i&&typeof i.handleEvent=="function")i=b(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(a)?-1:l.setTimeout(i,a||0)}function lc(i){i.g=uc(()=>{i.g=null,i.i&&(i.i=!1,lc(i))},i.l);let a=i.h;i.h=null,i.m.apply(null,a)}class md extends He{constructor(a,u){super(),this.m=a,this.l=u,this.h=null,this.i=!1,this.g=null}j(a){this.h=arguments,this.g?this.i=!0:lc(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ln(i){He.call(this),this.h=i,this.g={}}k(ln,He);var hc=[];function dc(i){ee(i.g,function(a,u){this.g.hasOwnProperty(u)&&ts(a)},i),i.g={}}ln.prototype.N=function(){ln.aa.N.call(this),dc(this)},ln.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ss=l.JSON.stringify,gd=l.JSON.parse,_d=class{stringify(i){return l.JSON.stringify(i,void 0)}parse(i){return l.JSON.parse(i,void 0)}};function os(){}os.prototype.h=null;function fc(i){return i.h||(i.h=i.i())}function pc(){}var hn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function as(){oe.call(this,"d")}k(as,oe);function cs(){oe.call(this,"c")}k(cs,oe);var ut={},mc=null;function _r(){return mc=mc||new ae}ut.La="serverreachability";function gc(i){oe.call(this,ut.La,i)}k(gc,oe);function dn(i){let a=_r();fe(a,new gc(a))}ut.STAT_EVENT="statevent";function _c(i,a){oe.call(this,ut.STAT_EVENT,i),this.stat=a}k(_c,oe);function pe(i){let a=_r();fe(a,new _c(a,i))}ut.Ma="timingevent";function yc(i,a){oe.call(this,ut.Ma,i),this.size=a}k(yc,oe);function fn(i,a){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){i()},a)}function pn(){this.g=!0}pn.prototype.xa=function(){this.g=!1};function yd(i,a,u,d,w,A){i.info(function(){if(i.g)if(A)for(var R="",z=A.split("&"),ie=0;ie<z.length;ie++){var B=z[ie].split("=");if(1<B.length){var ce=B[0];B=B[1];var ue=ce.split("_");R=2<=ue.length&&ue[1]=="type"?R+(ce+"="+B+"&"):R+(ce+"=redacted&")}}else R=null;else R=A;return"XMLHTTP REQ ("+d+") [attempt "+w+"]: "+a+`
`+u+`
`+R})}function vd(i,a,u,d,w,A,R){i.info(function(){return"XMLHTTP RESP ("+d+") [ attempt "+w+"]: "+a+`
`+u+`
`+A+" "+R})}function Pt(i,a,u,d){i.info(function(){return"XMLHTTP TEXT ("+a+"): "+wd(i,u)+(d?" "+d:"")})}function Id(i,a){i.info(function(){return"TIMEOUT: "+a})}pn.prototype.info=function(){};function wd(i,a){if(!i.g)return a;if(!a)return null;try{var u=JSON.parse(a);if(u){for(i=0;i<u.length;i++)if(Array.isArray(u[i])){var d=u[i];if(!(2>d.length)){var w=d[1];if(Array.isArray(w)&&!(1>w.length)){var A=w[0];if(A!="noop"&&A!="stop"&&A!="close")for(var R=1;R<w.length;R++)w[R]=""}}}}return ss(u)}catch{return a}}var yr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},vc={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},us;function vr(){}k(vr,os),vr.prototype.g=function(){return new XMLHttpRequest},vr.prototype.i=function(){return{}},us=new vr;function Qe(i,a,u,d){this.j=i,this.i=a,this.l=u,this.R=d||1,this.U=new ln(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ic}function Ic(){this.i=null,this.g="",this.h=!1}var wc={},ls={};function hs(i,a,u){i.L=1,i.v=Tr(Be(a)),i.m=u,i.P=!0,Ec(i,null)}function Ec(i,a){i.F=Date.now(),Ir(i),i.A=Be(i.v);var u=i.A,d=i.R;Array.isArray(d)||(d=[String(d)]),Lc(u.i,"t",d),i.C=0,u=i.j.J,i.h=new Ic,i.g=eu(i.j,u?a:null,!i.m),0<i.O&&(i.M=new md(b(i.Y,i,i.g),i.O)),a=i.U,u=i.g,d=i.ca;var w="readystatechange";Array.isArray(w)||(w&&(hc[0]=w.toString()),w=hc);for(var A=0;A<w.length;A++){var R=ic(u,w[A],d||a.handleEvent,!1,a.h||a);if(!R)break;a.g[R.key]=R}a=i.H?p(i.H):{},i.m?(i.u||(i.u="POST"),a["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,a)):(i.u="GET",i.g.ea(i.A,i.u,null,a)),dn(),yd(i.i,i.u,i.A,i.l,i.R,i.m)}Qe.prototype.ca=function(i){i=i.target;let a=this.M;a&&qe(i)==3?a.j():this.Y(i)},Qe.prototype.Y=function(i){try{if(i==this.g)e:{let ue=qe(this.g);var a=this.g.Ba();let Dt=this.g.Z();if(!(3>ue)&&(ue!=3||this.g&&(this.h.h||this.g.oa()||zc(this.g)))){this.J||ue!=4||a==7||(a==8||0>=Dt?dn(3):dn(2)),ds(this);var u=this.g.Z();this.X=u;t:if(Tc(this)){var d=zc(this.g);i="";var w=d.length,A=qe(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){lt(this),mn(this);var R="";break t}this.h.i=new l.TextDecoder}for(a=0;a<w;a++)this.h.h=!0,i+=this.h.i.decode(d[a],{stream:!(A&&a==w-1)});d.length=0,this.h.g+=i,this.C=0,R=this.h.g}else R=this.g.oa();if(this.o=u==200,vd(this.i,this.u,this.A,this.l,this.R,ue,u),this.o){if(this.T&&!this.K){t:{if(this.g){var z,ie=this.g;if((z=ie.g?ie.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!j(z)){var B=z;break t}}B=null}if(u=B)Pt(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,fs(this,u);else{this.o=!1,this.s=3,pe(12),lt(this),mn(this);break e}}if(this.P){u=!0;let be;for(;!this.J&&this.C<R.length;)if(be=Ed(this,R),be==ls){ue==4&&(this.s=4,pe(14),u=!1),Pt(this.i,this.l,null,"[Incomplete Response]");break}else if(be==wc){this.s=4,pe(15),Pt(this.i,this.l,R,"[Invalid Chunk]"),u=!1;break}else Pt(this.i,this.l,be,null),fs(this,be);if(Tc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ue!=4||R.length!=0||this.h.h||(this.s=1,pe(16),u=!1),this.o=this.o&&u,!u)Pt(this.i,this.l,R,"[Invalid Chunked Response]"),lt(this),mn(this);else if(0<R.length&&!this.W){this.W=!0;var ce=this.j;ce.g==this&&ce.ba&&!ce.M&&(ce.j.info("Great, no buffering proxy detected. Bytes received: "+R.length),vs(ce),ce.M=!0,pe(11))}}else Pt(this.i,this.l,R,null),fs(this,R);ue==4&&lt(this),this.o&&!this.J&&(ue==4?Jc(this.j,this):(this.o=!1,Ir(this)))}else Ud(this.g),u==400&&0<R.indexOf("Unknown SID")?(this.s=3,pe(12)):(this.s=0,pe(13)),lt(this),mn(this)}}}catch{}finally{}};function Tc(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function Ed(i,a){var u=i.C,d=a.indexOf(`
`,u);return d==-1?ls:(u=Number(a.substring(u,d)),isNaN(u)?wc:(d+=1,d+u>a.length?ls:(a=a.slice(d,d+u),i.C=d+u,a)))}Qe.prototype.cancel=function(){this.J=!0,lt(this)};function Ir(i){i.S=Date.now()+i.I,Ac(i,i.I)}function Ac(i,a){if(i.B!=null)throw Error("WatchDog timer not null");i.B=fn(b(i.ba,i),a)}function ds(i){i.B&&(l.clearTimeout(i.B),i.B=null)}Qe.prototype.ba=function(){this.B=null;let i=Date.now();0<=i-this.S?(Id(this.i,this.A),this.L!=2&&(dn(),pe(17)),lt(this),this.s=2,mn(this)):Ac(this,this.S-i)};function mn(i){i.j.G==0||i.J||Jc(i.j,i)}function lt(i){ds(i);var a=i.M;a&&typeof a.ma=="function"&&a.ma(),i.M=null,dc(i.U),i.g&&(a=i.g,i.g=null,a.abort(),a.ma())}function fs(i,a){try{var u=i.j;if(u.G!=0&&(u.g==i||ps(u.h,i))){if(!i.K&&ps(u.h,i)&&u.G==3){try{var d=u.Da.g.parse(a)}catch{d=null}if(Array.isArray(d)&&d.length==3){var w=d;if(w[0]==0){e:if(!u.u){if(u.g)if(u.g.F+3e3<i.F)Pr(u),Sr(u);else break e;ys(u),pe(18)}}else u.za=w[1],0<u.za-u.T&&37500>w[2]&&u.F&&u.v==0&&!u.C&&(u.C=fn(b(u.Za,u),6e3));if(1>=Rc(u.h)&&u.ca){try{u.ca()}catch{}u.ca=void 0}}else dt(u,11)}else if((i.K||u.g==i)&&Pr(u),!j(a))for(w=u.Da.g.parse(a),a=0;a<w.length;a++){let B=w[a];if(u.T=B[0],B=B[1],u.G==2)if(B[0]=="c"){u.K=B[1],u.ia=B[2];let ce=B[3];ce!=null&&(u.la=ce,u.j.info("VER="+u.la));let ue=B[4];ue!=null&&(u.Aa=ue,u.j.info("SVER="+u.Aa));let Dt=B[5];Dt!=null&&typeof Dt=="number"&&0<Dt&&(d=1.5*Dt,u.L=d,u.j.info("backChannelRequestTimeoutMs_="+d)),d=u;let be=i.g;if(be){let kr=be.g?be.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(kr){var A=d.h;A.g||kr.indexOf("spdy")==-1&&kr.indexOf("quic")==-1&&kr.indexOf("h2")==-1||(A.j=A.l,A.g=new Set,A.h&&(ms(A,A.h),A.h=null))}if(d.D){let Is=be.g?be.g.getResponseHeader("X-HTTP-Session-Id"):null;Is&&(d.ya=Is,$(d.I,d.D,Is))}}u.G=3,u.l&&u.l.ua(),u.ba&&(u.R=Date.now()-i.F,u.j.info("Handshake RTT: "+u.R+"ms")),d=u;var R=i;if(d.qa=Zc(d,d.J?d.ia:null,d.W),R.K){Pc(d.h,R);var z=R,ie=d.L;ie&&(z.I=ie),z.B&&(ds(z),Ir(z)),d.g=R}else Hc(d);0<u.i.length&&Rr(u)}else B[0]!="stop"&&B[0]!="close"||dt(u,7);else u.G==3&&(B[0]=="stop"||B[0]=="close"?B[0]=="stop"?dt(u,7):_s(u):B[0]!="noop"&&u.l&&u.l.ta(B),u.v=0)}}dn(4)}catch{}}var Td=class{constructor(i,a){this.g=i,this.map=a}};function bc(i){this.l=i||10,l.PerformanceNavigationTiming?(i=l.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Sc(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Rc(i){return i.h?1:i.g?i.g.size:0}function ps(i,a){return i.h?i.h==a:i.g?i.g.has(a):!1}function ms(i,a){i.g?i.g.add(a):i.h=a}function Pc(i,a){i.h&&i.h==a?i.h=null:i.g&&i.g.has(a)&&i.g.delete(a)}bc.prototype.cancel=function(){if(this.i=Cc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(let i of this.g.values())i.cancel();this.g.clear()}};function Cc(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let a=i.i;for(let u of i.g.values())a=a.concat(u.D);return a}return L(i.i)}function Ad(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(h(i)){for(var a=[],u=i.length,d=0;d<u;d++)a.push(i[d]);return a}a=[],u=0;for(d in i)a[u++]=i[d];return a}function bd(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(h(i)||typeof i=="string"){var a=[];i=i.length;for(var u=0;u<i;u++)a.push(u);return a}a=[],u=0;for(let d in i)a[u++]=d;return a}}}function kc(i,a){if(i.forEach&&typeof i.forEach=="function")i.forEach(a,void 0);else if(h(i)||typeof i=="string")Array.prototype.forEach.call(i,a,void 0);else for(var u=bd(i),d=Ad(i),w=d.length,A=0;A<w;A++)a.call(void 0,d[A],u&&u[A],i)}var Dc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Sd(i,a){if(i){i=i.split("&");for(var u=0;u<i.length;u++){var d=i[u].indexOf("="),w=null;if(0<=d){var A=i[u].substring(0,d);w=i[u].substring(d+1)}else A=i[u];a(A,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function ht(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof ht){this.h=i.h,wr(this,i.j),this.o=i.o,this.g=i.g,Er(this,i.s),this.l=i.l;var a=i.i,u=new yn;u.i=a.i,a.g&&(u.g=new Map(a.g),u.h=a.h),Nc(this,u),this.m=i.m}else i&&(a=String(i).match(Dc))?(this.h=!1,wr(this,a[1]||"",!0),this.o=gn(a[2]||""),this.g=gn(a[3]||"",!0),Er(this,a[4]),this.l=gn(a[5]||"",!0),Nc(this,a[6]||"",!0),this.m=gn(a[7]||"")):(this.h=!1,this.i=new yn(null,this.h))}ht.prototype.toString=function(){var i=[],a=this.j;a&&i.push(_n(a,Oc,!0),":");var u=this.g;return(u||a=="file")&&(i.push("//"),(a=this.o)&&i.push(_n(a,Oc,!0),"@"),i.push(encodeURIComponent(String(u)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u=this.s,u!=null&&i.push(":",String(u))),(u=this.l)&&(this.g&&u.charAt(0)!="/"&&i.push("/"),i.push(_n(u,u.charAt(0)=="/"?Cd:Pd,!0))),(u=this.i.toString())&&i.push("?",u),(u=this.m)&&i.push("#",_n(u,Dd)),i.join("")};function Be(i){return new ht(i)}function wr(i,a,u){i.j=u?gn(a,!0):a,i.j&&(i.j=i.j.replace(/:$/,""))}function Er(i,a){if(a){if(a=Number(a),isNaN(a)||0>a)throw Error("Bad port number "+a);i.s=a}else i.s=null}function Nc(i,a,u){a instanceof yn?(i.i=a,Nd(i.i,i.h)):(u||(a=_n(a,kd)),i.i=new yn(a,i.h))}function $(i,a,u){i.i.set(a,u)}function Tr(i){return $(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function gn(i,a){return i?a?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function _n(i,a,u){return typeof i=="string"?(i=encodeURI(i).replace(a,Rd),u&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function Rd(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Oc=/[#\/\?@]/g,Pd=/[#\?:]/g,Cd=/[#\?]/g,kd=/[#\?@]/g,Dd=/#/g;function yn(i,a){this.h=this.g=null,this.i=i||null,this.j=!!a}function Je(i){i.g||(i.g=new Map,i.h=0,i.i&&Sd(i.i,function(a,u){i.add(decodeURIComponent(a.replace(/\+/g," ")),u)}))}n=yn.prototype,n.add=function(i,a){Je(this),this.i=null,i=Ct(this,i);var u=this.g.get(i);return u||this.g.set(i,u=[]),u.push(a),this.h+=1,this};function Vc(i,a){Je(i),a=Ct(i,a),i.g.has(a)&&(i.i=null,i.h-=i.g.get(a).length,i.g.delete(a))}function xc(i,a){return Je(i),a=Ct(i,a),i.g.has(a)}n.forEach=function(i,a){Je(this),this.g.forEach(function(u,d){u.forEach(function(w){i.call(a,w,d,this)},this)},this)},n.na=function(){Je(this);let i=Array.from(this.g.values()),a=Array.from(this.g.keys()),u=[];for(let d=0;d<a.length;d++){let w=i[d];for(let A=0;A<w.length;A++)u.push(a[d])}return u},n.V=function(i){Je(this);let a=[];if(typeof i=="string")xc(this,i)&&(a=a.concat(this.g.get(Ct(this,i))));else{i=Array.from(this.g.values());for(let u=0;u<i.length;u++)a=a.concat(i[u])}return a},n.set=function(i,a){return Je(this),this.i=null,i=Ct(this,i),xc(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[a]),this.h+=1,this},n.get=function(i,a){return i?(i=this.V(i),0<i.length?String(i[0]):a):a};function Lc(i,a,u){Vc(i,a),0<u.length&&(i.i=null,i.g.set(Ct(i,a),L(u)),i.h+=u.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";let i=[],a=Array.from(this.g.keys());for(var u=0;u<a.length;u++){var d=a[u];let A=encodeURIComponent(String(d)),R=this.V(d);for(d=0;d<R.length;d++){var w=A;R[d]!==""&&(w+="="+encodeURIComponent(String(R[d]))),i.push(w)}}return this.i=i.join("&")};function Ct(i,a){return a=String(a),i.j&&(a=a.toLowerCase()),a}function Nd(i,a){a&&!i.j&&(Je(i),i.i=null,i.g.forEach(function(u,d){var w=d.toLowerCase();d!=w&&(Vc(this,d),Lc(this,w,u))},i)),i.j=a}function Od(i,a){let u=new pn;if(l.Image){let d=new Image;d.onload=C(Ye,u,"TestLoadImage: loaded",!0,a,d),d.onerror=C(Ye,u,"TestLoadImage: error",!1,a,d),d.onabort=C(Ye,u,"TestLoadImage: abort",!1,a,d),d.ontimeout=C(Ye,u,"TestLoadImage: timeout",!1,a,d),l.setTimeout(function(){d.ontimeout&&d.ontimeout()},1e4),d.src=i}else a(!1)}function Vd(i,a){let u=new pn,d=new AbortController,w=setTimeout(()=>{d.abort(),Ye(u,"TestPingServer: timeout",!1,a)},1e4);fetch(i,{signal:d.signal}).then(A=>{clearTimeout(w),A.ok?Ye(u,"TestPingServer: ok",!0,a):Ye(u,"TestPingServer: server error",!1,a)}).catch(()=>{clearTimeout(w),Ye(u,"TestPingServer: error",!1,a)})}function Ye(i,a,u,d,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),d(u)}catch{}}function xd(){this.g=new _d}function Ld(i,a,u){let d=u||"";try{kc(i,function(w,A){let R=w;f(w)&&(R=ss(w)),a.push(d+A+"="+encodeURIComponent(R))})}catch(w){throw a.push(d+"type="+encodeURIComponent("_badmap")),w}}function vn(i){this.l=i.Ub||null,this.j=i.eb||!1}k(vn,os),vn.prototype.g=function(){return new Ar(this.l,this.j)},vn.prototype.i=function(i){return function(){return i}}({});function Ar(i,a){ae.call(this),this.D=i,this.o=a,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}k(Ar,ae),n=Ar.prototype,n.open=function(i,a){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=a,this.readyState=1,wn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;let a={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(a.body=i),(this.D||l).fetch(new Request(this.A,a)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,In(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,wn(this)),this.g&&(this.readyState=3,wn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Mc(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function Mc(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var a=i.value?i.value:new Uint8Array(0);(a=this.v.decode(a,{stream:!i.done}))&&(this.response=this.responseText+=a)}i.done?In(this):wn(this),this.readyState==3&&Mc(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,In(this))},n.Qa=function(i){this.g&&(this.response=i,In(this))},n.ga=function(){this.g&&In(this)};function In(i){i.readyState=4,i.l=null,i.j=null,i.v=null,wn(i)}n.setRequestHeader=function(i,a){this.u.append(i,a)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";let i=[],a=this.h.entries();for(var u=a.next();!u.done;)u=u.value,i.push(u[0]+": "+u[1]),u=a.next();return i.join(`\r
`)};function wn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(Ar.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Fc(i){let a="";return ee(i,function(u,d){a+=d,a+=":",a+=u,a+=`\r
`}),a}function gs(i,a,u){e:{for(d in u){var d=!1;break e}d=!0}d||(u=Fc(u),typeof i=="string"?u!=null&&encodeURIComponent(String(u)):$(i,a,u))}function W(i){ae.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}k(W,ae);var Md=/^https?$/i,Fd=["POST","PUT"];n=W.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,a,u,d){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);a=a?a.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():us.g(),this.v=this.o?fc(this.o):fc(us),this.g.onreadystatechange=b(this.Ea,this);try{this.B=!0,this.g.open(a,String(i),!0),this.B=!1}catch(A){Uc(this,A);return}if(i=u||"",u=new Map(this.headers),d)if(Object.getPrototypeOf(d)===Object.prototype)for(var w in d)u.set(w,d[w]);else if(typeof d.keys=="function"&&typeof d.get=="function")for(let A of d.keys())u.set(A,d.get(A));else throw Error("Unknown input type for opt_headers: "+String(d));d=Array.from(u.keys()).find(A=>A.toLowerCase()=="content-type"),w=l.FormData&&i instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Fd,a,void 0))||d||w||u.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(let[A,R]of u)this.g.setRequestHeader(A,R);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{jc(this),this.u=!0,this.g.send(i),this.u=!1}catch(A){Uc(this,A)}};function Uc(i,a){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=a,i.m=5,Bc(i),br(i)}function Bc(i){i.A||(i.A=!0,fe(i,"complete"),fe(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,fe(this,"complete"),fe(this,"abort"),br(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),br(this,!0)),W.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?qc(this):this.bb())},n.bb=function(){qc(this)};function qc(i){if(i.h&&typeof c<"u"&&(!i.v[1]||qe(i)!=4||i.Z()!=2)){if(i.u&&qe(i)==4)uc(i.Ea,0,i);else if(fe(i,"readystatechange"),qe(i)==4){i.h=!1;try{let R=i.Z();e:switch(R){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var a=!0;break e;default:a=!1}var u;if(!(u=a)){var d;if(d=R===0){var w=String(i.D).match(Dc)[1]||null;!w&&l.self&&l.self.location&&(w=l.self.location.protocol.slice(0,-1)),d=!Md.test(w?w.toLowerCase():"")}u=d}if(u)fe(i,"complete"),fe(i,"success");else{i.m=6;try{var A=2<qe(i)?i.g.statusText:""}catch{A=""}i.l=A+" ["+i.Z()+"]",Bc(i)}}finally{br(i)}}}}function br(i,a){if(i.g){jc(i);let u=i.g,d=i.v[0]?()=>{}:null;i.g=null,i.v=null,a||fe(i,"ready");try{u.onreadystatechange=d}catch{}}}function jc(i){i.I&&(l.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function qe(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<qe(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var a=this.g.responseText;return i&&a.indexOf(i)==0&&(a=a.substring(i.length)),gd(a)}};function zc(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Ud(i){let a={};i=(i.g&&2<=qe(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let d=0;d<i.length;d++){if(j(i[d]))continue;var u=v(i[d]);let w=u[0];if(u=u[1],typeof u!="string")continue;u=u.trim();let A=a[w]||[];a[w]=A,A.push(u)}I(a,function(d){return d.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function En(i,a,u){return u&&u.internalChannelParams&&u.internalChannelParams[i]||a}function Gc(i){this.Aa=0,this.i=[],this.j=new pn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=En("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=En("baseRetryDelayMs",5e3,i),this.cb=En("retryDelaySeedMs",1e4,i),this.Wa=En("forwardChannelMaxRetries",2,i),this.wa=En("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new bc(i&&i.concurrentRequestLimit),this.Da=new xd,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Gc.prototype,n.la=8,n.G=1,n.connect=function(i,a,u,d){pe(0),this.W=i,this.H=a||{},u&&d!==void 0&&(this.H.OSID=u,this.H.OAID=d),this.F=this.X,this.I=Zc(this,null,this.W),Rr(this)};function _s(i){if($c(i),i.G==3){var a=i.U++,u=Be(i.I);if($(u,"SID",i.K),$(u,"RID",a),$(u,"TYPE","terminate"),Tn(i,u),a=new Qe(i,i.j,a),a.L=2,a.v=Tr(Be(u)),u=!1,l.navigator&&l.navigator.sendBeacon)try{u=l.navigator.sendBeacon(a.v.toString(),"")}catch{}!u&&l.Image&&(new Image().src=a.v,u=!0),u||(a.g=eu(a.j,null),a.g.ea(a.v)),a.F=Date.now(),Ir(a)}Xc(i)}function Sr(i){i.g&&(vs(i),i.g.cancel(),i.g=null)}function $c(i){Sr(i),i.u&&(l.clearTimeout(i.u),i.u=null),Pr(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&l.clearTimeout(i.s),i.s=null)}function Rr(i){if(!Sc(i.h)&&!i.s){i.s=!0;var a=i.Ga;on||rc(),an||(on(),an=!0),Ji.add(a,i),i.B=0}}function Bd(i,a){return Rc(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=a.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=fn(b(i.Ga,i,a),Yc(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;let w=new Qe(this,this.j,i),A=this.o;if(this.S&&(A?(A=p(A),_(A,this.S)):A=this.S),this.m!==null||this.O||(w.H=A,A=null),this.P)e:{for(var a=0,u=0;u<this.i.length;u++){t:{var d=this.i[u];if("__data__"in d.map&&(d=d.map.__data__,typeof d=="string")){d=d.length;break t}d=void 0}if(d===void 0)break;if(a+=d,4096<a){a=u;break e}if(a===4096||u===this.i.length-1){a=u+1;break e}}a=1e3}else a=1e3;a=Kc(this,w,a),u=Be(this.I),$(u,"RID",i),$(u,"CVER",22),this.D&&$(u,"X-HTTP-Session-Id",this.D),Tn(this,u),A&&(this.O?a="headers="+encodeURIComponent(String(Fc(A)))+"&"+a:this.m&&gs(u,this.m,A)),ms(this.h,w),this.Ua&&$(u,"TYPE","init"),this.P?($(u,"$req",a),$(u,"SID","null"),w.T=!0,hs(w,u,null)):hs(w,u,a),this.G=2}}else this.G==3&&(i?Wc(this,i):this.i.length==0||Sc(this.h)||Wc(this))};function Wc(i,a){var u;a?u=a.l:u=i.U++;let d=Be(i.I);$(d,"SID",i.K),$(d,"RID",u),$(d,"AID",i.T),Tn(i,d),i.m&&i.o&&gs(d,i.m,i.o),u=new Qe(i,i.j,u,i.B+1),i.m===null&&(u.H=i.o),a&&(i.i=a.D.concat(i.i)),a=Kc(i,u,1e3),u.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),ms(i.h,u),hs(u,d,a)}function Tn(i,a){i.H&&ee(i.H,function(u,d){$(a,d,u)}),i.l&&kc({},function(u,d){$(a,d,u)})}function Kc(i,a,u){u=Math.min(i.i.length,u);var d=i.l?b(i.l.Na,i.l,i):null;e:{var w=i.i;let A=-1;for(;;){let R=["count="+u];A==-1?0<u?(A=w[0].g,R.push("ofs="+A)):A=0:R.push("ofs="+A);let z=!0;for(let ie=0;ie<u;ie++){let B=w[ie].g,ce=w[ie].map;if(B-=A,0>B)A=Math.max(0,w[ie].g-100),z=!1;else try{Ld(ce,R,"req"+B+"_")}catch{d&&d(ce)}}if(z){d=R.join("&");break e}}}return i=i.i.splice(0,u),a.D=i,d}function Hc(i){if(!i.g&&!i.u){i.Y=1;var a=i.Fa;on||rc(),an||(on(),an=!0),Ji.add(a,i),i.v=0}}function ys(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=fn(b(i.Fa,i),Yc(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,Qc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=fn(b(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,pe(10),Sr(this),Qc(this))};function vs(i){i.A!=null&&(l.clearTimeout(i.A),i.A=null)}function Qc(i){i.g=new Qe(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var a=Be(i.qa);$(a,"RID","rpc"),$(a,"SID",i.K),$(a,"AID",i.T),$(a,"CI",i.F?"0":"1"),!i.F&&i.ja&&$(a,"TO",i.ja),$(a,"TYPE","xmlhttp"),Tn(i,a),i.m&&i.o&&gs(a,i.m,i.o),i.L&&(i.g.I=i.L);var u=i.g;i=i.ia,u.L=1,u.v=Tr(Be(a)),u.m=null,u.P=!0,Ec(u,i)}n.Za=function(){this.C!=null&&(this.C=null,Sr(this),ys(this),pe(19))};function Pr(i){i.C!=null&&(l.clearTimeout(i.C),i.C=null)}function Jc(i,a){var u=null;if(i.g==a){Pr(i),vs(i),i.g=null;var d=2}else if(ps(i.h,a))u=a.D,Pc(i.h,a),d=1;else return;if(i.G!=0){if(a.o)if(d==1){u=a.m?a.m.length:0,a=Date.now()-a.F;var w=i.B;d=_r(),fe(d,new yc(d,u)),Rr(i)}else Hc(i);else if(w=a.s,w==3||w==0&&0<a.X||!(d==1&&Bd(i,a)||d==2&&ys(i)))switch(u&&0<u.length&&(a=i.h,a.i=a.i.concat(u)),w){case 1:dt(i,5);break;case 4:dt(i,10);break;case 3:dt(i,6);break;default:dt(i,2)}}}function Yc(i,a){let u=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(u*=2),u*a}function dt(i,a){if(i.j.info("Error code "+a),a==2){var u=b(i.fb,i),d=i.Xa;let w=!d;d=new ht(d||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||wr(d,"https"),Tr(d),w?Od(d.toString(),u):Vd(d.toString(),u)}else pe(2);i.G=0,i.l&&i.l.sa(a),Xc(i),$c(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),pe(2)):(this.j.info("Failed to ping google.com"),pe(1))};function Xc(i){if(i.G=0,i.ka=[],i.l){let a=Cc(i.h);(a.length!=0||i.i.length!=0)&&(O(i.ka,a),O(i.ka,i.i),i.h.i.length=0,L(i.i),i.i.length=0),i.l.ra()}}function Zc(i,a,u){var d=u instanceof ht?Be(u):new ht(u);if(d.g!="")a&&(d.g=a+"."+d.g),Er(d,d.s);else{var w=l.location;d=w.protocol,a=a?a+"."+w.hostname:w.hostname,w=+w.port;var A=new ht(null);d&&wr(A,d),a&&(A.g=a),w&&Er(A,w),u&&(A.l=u),d=A}return u=i.D,a=i.ya,u&&a&&$(d,u,a),$(d,"VER",i.la),Tn(i,d),d}function eu(i,a,u){if(a&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return a=i.Ca&&!i.pa?new W(new vn({eb:u})):new W(i.pa),a.Ha(i.J),a}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function tu(){}n=tu.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Cr(){}Cr.prototype.g=function(i,a){return new ve(i,a)};function ve(i,a){ae.call(this),this.g=new Gc(a),this.l=i,this.h=a&&a.messageUrlParams||null,i=a&&a.messageHeaders||null,a&&a.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=a&&a.initMessageHeaders||null,a&&a.messageContentType&&(i?i["X-WebChannel-Content-Type"]=a.messageContentType:i={"X-WebChannel-Content-Type":a.messageContentType}),a&&a.va&&(i?i["X-WebChannel-Client-Profile"]=a.va:i={"X-WebChannel-Client-Profile":a.va}),this.g.S=i,(i=a&&a.Sb)&&!j(i)&&(this.g.m=i),this.v=a&&a.supportsCrossDomainXhr||!1,this.u=a&&a.sendRawJson||!1,(a=a&&a.httpSessionIdParam)&&!j(a)&&(this.g.D=a,i=this.h,i!==null&&a in i&&(i=this.h,a in i&&delete i[a])),this.j=new kt(this)}k(ve,ae),ve.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ve.prototype.close=function(){_s(this.g)},ve.prototype.o=function(i){var a=this.g;if(typeof i=="string"){var u={};u.__data__=i,i=u}else this.u&&(u={},u.__data__=ss(i),i=u);a.i.push(new Td(a.Ya++,i)),a.G==3&&Rr(a)},ve.prototype.N=function(){this.g.l=null,delete this.j,_s(this.g),delete this.g,ve.aa.N.call(this)};function nu(i){as.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var a=i.__sm__;if(a){e:{for(let u in a){i=u;break e}i=void 0}(this.i=i)&&(i=this.i,a=a!==null&&i in a?a[i]:void 0),this.data=a}else this.data=i}k(nu,as);function ru(){cs.call(this),this.status=1}k(ru,cs);function kt(i){this.g=i}k(kt,tu),kt.prototype.ua=function(){fe(this.g,"a")},kt.prototype.ta=function(i){fe(this.g,new nu(i))},kt.prototype.sa=function(i){fe(this.g,new ru)},kt.prototype.ra=function(){fe(this.g,"b")},Cr.prototype.createWebChannel=Cr.prototype.g,ve.prototype.send=ve.prototype.o,ve.prototype.open=ve.prototype.m,ve.prototype.close=ve.prototype.close,Ro=We.createWebChannelTransport=function(){return new Cr},So=We.getStatEventTarget=function(){return _r()},bo=We.Event=ut,Ei=We.Stat={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},yr.NO_ERROR=0,yr.TIMEOUT=8,yr.HTTP_ERROR=6,Wn=We.ErrorCode=yr,vc.COMPLETE="complete",Ao=We.EventType=vc,pc.EventType=hn,hn.OPEN="a",hn.CLOSE="b",hn.ERROR="c",hn.MESSAGE="d",ae.prototype.listen=ae.prototype.K,Ft=We.WebChannel=pc,Xm=We.FetchXmlHttpFactory=vn,W.prototype.listenOnce=W.prototype.L,W.prototype.getLastError=W.prototype.Ka,W.prototype.getLastErrorCode=W.prototype.Ba,W.prototype.getStatus=W.prototype.Z,W.prototype.getResponseJson=W.prototype.Oa,W.prototype.getResponseText=W.prototype.oa,W.prototype.send=W.prototype.ea,W.prototype.setWithCredentials=W.prototype.Ha,To=We.XhrIo=W}).apply(typeof wi<"u"?wi:typeof self<"u"?self:typeof window<"u"?window:{});var Ml="@firebase/firestore",Fl="4.8.0";var se=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};se.UNAUTHENTICATED=new se(null),se.GOOGLE_CREDENTIALS=new se("google-credentials-uid"),se.FIRST_PARTY=new se("first-party-uid"),se.MOCK_USER=new se("mock-user");var rn="11.10.0";var St=new Ze("@firebase/firestore");function Kn(){return St.logLevel}function V(n,...e){if(St.logLevel<=x.DEBUG){let t=e.map($a);St.debug(`Firestore (${rn}): ${n}`,...t)}}function Ki(n,...e){if(St.logLevel<=x.ERROR){let t=e.map($a);St.error(`Firestore (${rn}): ${n}`,...t)}}function Ga(n,...e){if(St.logLevel<=x.WARN){let t=e.map($a);St.warn(`Firestore (${rn}): ${n}`,...t)}}function $a(n){if(typeof n=="string")return n;try{return function(t){return JSON.stringify(t)}(n)}catch{return n}}function U(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,dh(n,r,t)}function dh(n,e,t){let r=`FIRESTORE (${rn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Ki(r),new Error(r)}function ge(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||dh(e,s,r)}function ye(n,e){return n}var P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},N=class extends Ie{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};var Tt=class{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}};var Ri=class{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},Do=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(se.UNAUTHENTICATED))}shutdown(){}},No=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}},Oo=class{constructor(e){this.t=e,this.currentUser=se.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ge(this.o===void 0,42304);let r=this.i,s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve(),o=new Tt;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new Tt,e.enqueueRetryable(()=>s(this.currentUser))};let c=()=>{let h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},l=h=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),c())};this.t.onInit(h=>l(h)),setTimeout(()=>{if(!this.auth){let h=this.t.getImmediate({optional:!0});h?l(h):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new Tt)}},0),c()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(ge(typeof r.accessToken=="string",31837,{l:r}),new Ri(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){let e=this.auth&&this.auth.getUid();return ge(e===null||typeof e=="string",2055,{h:e}),new se(e)}},Vo=class{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=se.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);let e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}},xo=class{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new Vo(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(se.FIRST_PARTY))}shutdown(){}invalidateToken(){}},Pi=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},Lo=class{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Te(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){ge(this.o===void 0,3512);let r=o=>{o.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);let c=o.token!==this.m;return this.m=o.token,V("FirebaseAppCheckTokenProvider",`Received ${c?"new":"existing"} token.`),c?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>r(o))};let s=o=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){let o=this.V.getImmediate({optional:!0});o?s(o):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new Pi(this.p));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(ge(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Pi(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}};function Zm(n){let e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}function eg(){return new TextEncoder}var Mo=class{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516),r="";for(;r.length<20;){let s=Zm(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%62))}return r}};function q(n,e){return n<e?-1:n>e?1:0}function Fo(n,e){let t=0;for(;t<n.length&&t<e.length;){let r=n.codePointAt(t),s=e.codePointAt(t);if(r!==s){if(r<128&&s<128)return q(r,s);{let o=eg(),c=tg(o.encode(Ul(n,t)),o.encode(Ul(e,t)));return c!==0?c:q(r,s)}}t+=r>65535?2:1}return q(n.length,e.length)}function Ul(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function tg(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return q(n[t],e[t]);return q(n.length,e.length)}function Gt(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}var Bl="__name__",Ci=class n{constructor(e,t,r){t===void 0?t=0:t>e.length&&U(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&U(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return n.comparator(this,e)===0}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof n?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let s=0;s<r;s++){let o=n.compareSegments(e.get(s),t.get(s));if(o!==0)return o}return q(e.length,t.length)}static compareSegments(e,t){let r=n.isNumericId(e),s=n.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?n.extractNumericId(e).compare(n.extractNumericId(t)):Fo(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Ii.fromString(e.substring(4,e.length-2))}},de=class n extends Ci{construct(e,t,r){return new n(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new N(P.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new n(t)}static emptyPath(){return new n([])}},ng=/^[_a-zA-Z][_a-zA-Z0-9]*$/,Pe=class n extends Ci{construct(e,t,r){return new n(e,t,r)}static isValidIdentifier(e){return ng.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),n.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Bl}static keyField(){return new n([Bl])}static fromServerFormat(e){let t=[],r="",s=0,o=()=>{if(r.length===0)throw new N(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},c=!1;for(;s<e.length;){let l=e[s];if(l==="\\"){if(s+1===e.length)throw new N(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new N(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else l==="`"?(c=!c,s++):l!=="."||c?(r+=l,s++):(o(),s++)}if(o(),c)throw new N(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new n(t)}static emptyPath(){return new n([])}};var M=class n{constructor(e){this.path=e}static fromPath(e){return new n(de.fromString(e))}static fromName(e){return new n(de.fromString(e).popFirst(5))}static empty(){return new n(de.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&de.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return de.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new n(new de(e.slice()))}};function rg(n,e,t,r){if(e===!0&&r===!0)throw new N(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function ig(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function sg(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{let e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":U(12329,{type:typeof n})}function og(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new N(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let t=sg(n);throw new N(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function Z(n,e){let t={typeString:n};return e&&(t.value=e),t}function dr(n,e){if(!ig(n))throw new N(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(let r in e)if(e[r]){let s=e[r].typeString,o="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}let c=n[r];if(s&&typeof c!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&c!==o.value){t=`Expected '${r}' field to equal '${o.value}'`;break}}if(t)throw new N(P.INVALID_ARGUMENT,t);return!0}var ql=-62135596800,jl=1e6,_e=class n{static now(){return n.fromMillis(Date.now())}static fromDate(e){return n.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*jl);return new n(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<ql)throw new N(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/jl}_compareTo(e){return this.seconds===e.seconds?q(this.nanoseconds,e.nanoseconds):q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:n._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(dr(e,n._jsonSchema))return new n(e.seconds,e.nanoseconds)}valueOf(){let e=this.seconds-ql;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};_e._jsonSchemaVersion="firestore/timestamp/1.0",_e._jsonSchema={type:Z("string",_e._jsonSchemaVersion),seconds:Z("number"),nanoseconds:Z("number")};var J=class n{static fromTimestamp(e){return new n(e)}static min(){return new n(new _e(0,0))}static max(){return new n(new _e(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};var ir=-1,Uo=class{constructor(e,t,r,s){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=s}};Uo.UNKNOWN_ID=-1;function ag(n,e){let t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=J.fromTimestamp(r===1e9?new _e(t+1,0):new _e(t,r));return new Rt(s,M.empty(),e)}function cg(n){return new Rt(n.readTime,n.key,ir)}var Rt=class n{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new n(J.min(),M.empty(),ir)}static max(){return new n(J.max(),M.empty(),ir)}};function ug(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=M.comparator(n.documentKey,e.documentKey),t!==0?t:q(n.largestBatchId,e.largestBatchId))}var Bo=class{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}};var S=class n{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&U(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new n((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{let t=e();return t instanceof n?t:n.resolve(t)}catch(t){return n.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):n.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):n.reject(t)}static resolve(e){return new n((t,r)=>{t(e)})}static reject(e){return new n((t,r)=>{r(e)})}static waitFor(e){return new n((t,r)=>{let s=0,o=0,c=!1;e.forEach(l=>{++s,l.next(()=>{++o,c&&o===s&&t()},h=>r(h))}),c=!0,o===s&&t()})}static or(e){let t=n.resolve(!1);for(let r of e)t=t.next(s=>s?n.resolve(s):r());return t}static forEach(e,t){let r=[];return e.forEach((s,o)=>{r.push(t.call(this,s,o))}),this.waitFor(r)}static mapArray(e,t){return new n((r,s)=>{let o=e.length,c=new Array(o),l=0;for(let h=0;h<o;h++){let f=h;t(e[f]).next(y=>{c[f]=y,++l,l===o&&r(c)},y=>s(y))}})}static doWhile(e,t){return new n((r,s)=>{let o=()=>{e()===!0?t().next(()=>{o()},s):r()};o()})}};function lg(n){let e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function fh(n){return n.name==="IndexedDbTransactionError"}var ki=class{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this._e(r),this.ae=r=>t.writeSequenceNumber(r))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.ae&&this.ae(e),e}};ki.ue=-1;var hg=-1;function Wa(n){return n==null}function Di(n){return n===0&&1/n==-1/0}var dg="remoteDocuments",ph="owner";var mh="mutationQueues";var gh="mutations";var _h="documentMutations",fg="remoteDocumentsV14";var yh="remoteDocumentGlobal";var vh="targets";var Ih="targetDocuments";var wh="targetGlobal",Eh="collectionParents";var Th="clientMetadata";var Ah="bundles";var bh="namedQueries";var pg="indexConfiguration";var mg="indexState";var gg="indexEntries";var Sh="documentOverlays";var _g="globals";var yg=[mh,gh,_h,dg,vh,ph,wh,Ih,Th,yh,Eh,Ah,bh],wv=[...yg,Sh],vg=[mh,gh,_h,fg,vh,ph,wh,Ih,Th,yh,Eh,Ah,bh,Sh],Ig=vg,wg=[...Ig,pg,mg,gg];var Ev=[...wg,_g];function zl(n){let e=0;for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Ka(n,e){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Eg(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}var Ae=class n{constructor(e,t){this.comparator=e,this.root=t||Me.EMPTY}insert(e,t){return new n(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Me.BLACK,null,null))}remove(e){return new n(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Me.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){let e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Bt(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Bt(this.root,e,this.comparator,!1)}getReverseIterator(){return new Bt(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Bt(this.root,e,this.comparator,!0)}},Bt=class{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},Me=class n{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??n.RED,this.left=s??n.EMPTY,this.right=o??n.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new n(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this,o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return n.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return n.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw U(43730,{key:this.key,value:this.value});if(this.right.isRed())throw U(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw U(27949);return e+(this.isRed()?0:1)}};Me.EMPTY=null,Me.RED=!0,Me.BLACK=!1;Me.EMPTY=new class{constructor(){this.size=0}get key(){throw U(57766)}get value(){throw U(16141)}get color(){throw U(16727)}get left(){throw U(29726)}get right(){throw U(36894)}copy(e,t,r,s,o){return this}insert(e,t,r){return new Me(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};var me=class n{constructor(e){this.comparator=e,this.data=new Ae(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ni(this.data.getIterator())}getIteratorFrom(e){return new Ni(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new n(this.comparator);return t.data=e,t}},Ni=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};var wt=class n{constructor(e){this.fields=e,e.sort(Pe.comparator)}static empty(){return new n([])}unionWith(e){let t=new me(Pe.comparator);for(let r of this.fields)t=t.add(r);for(let r of e)t=t.add(r);return new n(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Gt(this.fields,e.fields,(t,r)=>t.isEqual(r))}};var qo=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};var Ke=class n{constructor(e){this.binaryString=e}static fromBase64String(e){let t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new qo("Invalid base64 string: "+o):o}}(e);return new n(t)}static fromUint8Array(e){let t=function(s){let o="";for(let c=0;c<s.length;++c)o+=String.fromCharCode(s[c]);return o}(e);return new n(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){let r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};Ke.EMPTY_BYTE_STRING=new Ke("");var Tg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ot(n){if(ge(!!n,39018),typeof n=="string"){let e=0,t=Tg.exec(n);if(ge(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}let r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:X(n.seconds),nanos:X(n.nanos)}}function X(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function $t(n){return typeof n=="string"?Ke.fromBase64String(n):Ke.fromUint8Array(n)}var Rh="server_timestamp",Ph="__type__",Ch="__previous_value__",kh="__local_write_time__";function Ha(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{})[Ph])===null||t===void 0?void 0:t.stringValue)===Rh}function Dh(n){let e=n.mapValue.fields[Ch];return Ha(e)?Dh(e):e}function Oi(n){let e=ot(n.mapValue.fields[kh].timestampValue);return new _e(e.seconds,e.nanos)}var Vi="(default)",jo=class n{constructor(e,t){this.projectId=e,this.database=t||Vi}static empty(){return new n("","")}get isDefaultDatabase(){return this.database===Vi}isEqual(e){return e instanceof n&&e.projectId===this.projectId&&e.database===this.database}};var Nh="__type__",Oh="__max__",Ti={mapValue:{fields:{__type__:{stringValue:Oh}}}},Vh="__vector__",xi="value";function Wt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Ha(n)?4:Lh(n)?9007199254740991:xh(n)?10:11:U(28295,{value:n})}function Fe(n,e){if(n===e)return!0;let t=Wt(n);if(t!==Wt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Oi(n).isEqual(Oi(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;let c=ot(s.timestampValue),l=ot(o.timestampValue);return c.seconds===l.seconds&&c.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,o){return $t(s.bytesValue).isEqual($t(o.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,o){return X(s.geoPointValue.latitude)===X(o.geoPointValue.latitude)&&X(s.geoPointValue.longitude)===X(o.geoPointValue.longitude)}(n,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return X(s.integerValue)===X(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){let c=X(s.doubleValue),l=X(o.doubleValue);return c===l?Di(c)===Di(l):isNaN(c)&&isNaN(l)}return!1}(n,e);case 9:return Gt(n.arrayValue.values||[],e.arrayValue.values||[],Fe);case 10:case 11:return function(s,o){let c=s.mapValue.fields||{},l=o.mapValue.fields||{};if(zl(c)!==zl(l))return!1;for(let h in c)if(c.hasOwnProperty(h)&&(l[h]===void 0||!Fe(c[h],l[h])))return!1;return!0}(n,e);default:return U(52216,{left:n})}}function sr(n,e){return(n.values||[]).find(t=>Fe(t,e))!==void 0}function Kt(n,e){if(n===e)return 0;let t=Wt(n),r=Wt(e);if(t!==r)return q(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return q(n.booleanValue,e.booleanValue);case 2:return function(o,c){let l=X(o.integerValue||o.doubleValue),h=X(c.integerValue||c.doubleValue);return l<h?-1:l>h?1:l===h?0:isNaN(l)?isNaN(h)?0:-1:1}(n,e);case 3:return Gl(n.timestampValue,e.timestampValue);case 4:return Gl(Oi(n),Oi(e));case 5:return Fo(n.stringValue,e.stringValue);case 6:return function(o,c){let l=$t(o),h=$t(c);return l.compareTo(h)}(n.bytesValue,e.bytesValue);case 7:return function(o,c){let l=o.split("/"),h=c.split("/");for(let f=0;f<l.length&&f<h.length;f++){let y=q(l[f],h[f]);if(y!==0)return y}return q(l.length,h.length)}(n.referenceValue,e.referenceValue);case 8:return function(o,c){let l=q(X(o.latitude),X(c.latitude));return l!==0?l:q(X(o.longitude),X(c.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return $l(n.arrayValue,e.arrayValue);case 10:return function(o,c){var l,h,f,y;let T=o.fields||{},b=c.fields||{},C=(l=T[xi])===null||l===void 0?void 0:l.arrayValue,k=(h=b[xi])===null||h===void 0?void 0:h.arrayValue,L=q(((f=C?.values)===null||f===void 0?void 0:f.length)||0,((y=k?.values)===null||y===void 0?void 0:y.length)||0);return L!==0?L:$l(C,k)}(n.mapValue,e.mapValue);case 11:return function(o,c){if(o===Ti.mapValue&&c===Ti.mapValue)return 0;if(o===Ti.mapValue)return 1;if(c===Ti.mapValue)return-1;let l=o.fields||{},h=Object.keys(l),f=c.fields||{},y=Object.keys(f);h.sort(),y.sort();for(let T=0;T<h.length&&T<y.length;++T){let b=Fo(h[T],y[T]);if(b!==0)return b;let C=Kt(l[h[T]],f[y[T]]);if(C!==0)return C}return q(h.length,y.length)}(n.mapValue,e.mapValue);default:throw U(23264,{le:t})}}function Gl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return q(n,e);let t=ot(n),r=ot(e),s=q(t.seconds,r.seconds);return s!==0?s:q(t.nanos,r.nanos)}function $l(n,e){let t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){let o=Kt(t[s],r[s]);if(o)return o}return q(t.length,r.length)}function Ht(n){return zo(n)}function zo(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){let r=ot(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return $t(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return M.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(let o of t.values||[])s?s=!1:r+=",",r+=zo(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){let r=Object.keys(t.fields||{}).sort(),s="{",o=!0;for(let c of r)o?o=!1:s+=",",s+=`${c}:${zo(t.fields[c])}`;return s+"}"}(n.mapValue):U(61005,{value:n})}function Go(n){return!!n&&"integerValue"in n}function Qa(n){return!!n&&"arrayValue"in n}function Po(n){return!!n&&"mapValue"in n}function xh(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{})[Nh])===null||t===void 0?void 0:t.stringValue)===Vh}function Qn(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){let e={mapValue:{fields:{}}};return Ka(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Qn(r)),e}if(n.arrayValue){let e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Qn(n.arrayValue.values[t]);return e}return Object.assign({},n)}function Lh(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Oh}var Av={mapValue:{fields:{[Nh]:{stringValue:Vh},[xi]:{arrayValue:{}}}}};var st=class n{constructor(e){this.value=e}static empty(){return new n({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Po(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Qn(t)}setAll(e){let t=Pe.emptyPath(),r={},s=[];e.forEach((c,l)=>{if(!t.isImmediateParentOf(l)){let h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=l.popLast()}c?r[l.lastSegment()]=Qn(c):s.push(l.lastSegment())});let o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){let t=this.field(e.popLast());Po(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Fe(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Po(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Ka(t,(s,o)=>e[s]=o);for(let s of r)delete e[s]}clone(){return new n(Qn(this.value))}};var Qt=class n{constructor(e,t,r,s,o,c,l){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=c,this.documentState=l}static newInvalidDocument(e){return new n(e,0,J.min(),J.min(),J.min(),st.empty(),0)}static newFoundDocument(e,t,r,s){return new n(e,1,t,J.min(),r,s,0)}static newNoDocument(e,t){return new n(e,2,t,J.min(),J.min(),st.empty(),0)}static newUnknownDocument(e,t){return new n(e,3,t,J.min(),J.min(),st.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(J.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=st.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=st.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=J.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof n&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new n(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};var Jt=class{constructor(e,t){this.position=e,this.inclusive=t}};function Wl(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){let o=e[s],c=n.position[s];if(o.field.isKeyField()?r=M.comparator(M.fromName(c.referenceValue),t.key):r=Kt(c,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Kl(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Fe(n.position[t],e.position[t]))return!1;return!0}var Yt=class{constructor(e,t="asc"){this.field=e,this.dir=t}};function Ag(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}var Li=class{},re=class n extends Li{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Wo(e,t,r):t==="array-contains"?new Qo(e,r):t==="in"?new Jo(e,r):t==="not-in"?new Yo(e,r):t==="array-contains-any"?new Xo(e,r):new n(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Ko(e,r):new Ho(e,r)}matches(e){let t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Kt(t,this.value)):t!==null&&Wt(this.value)===Wt(t)&&this.matchesComparison(Kt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return U(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},at=class n extends Li{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new n(e,t)}matches(e){return Mh(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}};function Mh(n){return n.op==="and"}function Fh(n){return bg(n)&&Mh(n)}function bg(n){for(let e of n.filters)if(e instanceof at)return!1;return!0}function $o(n){if(n instanceof re)return n.field.canonicalString()+n.op.toString()+Ht(n.value);if(Fh(n))return n.filters.map(e=>$o(e)).join(",");{let e=n.filters.map(t=>$o(t)).join(",");return`${n.op}(${e})`}}function Uh(n,e){return n instanceof re?function(r,s){return s instanceof re&&r.op===s.op&&r.field.isEqual(s.field)&&Fe(r.value,s.value)}(n,e):n instanceof at?function(r,s){return s instanceof at&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,c,l)=>o&&Uh(c,s.filters[l]),!0):!1}(n,e):void U(19439)}function Bh(n){return n instanceof re?function(t){return`${t.field.canonicalString()} ${t.op} ${Ht(t.value)}`}(n):n instanceof at?function(t){return t.op.toString()+" {"+t.getFilters().map(Bh).join(" ,")+"}"}(n):"Filter"}var Wo=class extends re{constructor(e,t,r){super(e,t,r),this.key=M.fromName(r.referenceValue)}matches(e){let t=M.comparator(e.key,this.key);return this.matchesComparison(t)}},Ko=class extends re{constructor(e,t){super(e,"in",t),this.keys=qh("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}},Ho=class extends re{constructor(e,t){super(e,"not-in",t),this.keys=qh("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}};function qh(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>M.fromName(r.referenceValue))}var Qo=class extends re{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return Qa(t)&&sr(t.arrayValue,this.value)}},Jo=class extends re{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return t!==null&&sr(this.value.arrayValue,t)}},Yo=class extends re{constructor(e,t){super(e,"not-in",t)}matches(e){if(sr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!sr(this.value.arrayValue,t)}},Xo=class extends re{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!Qa(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>sr(this.value.arrayValue,r))}};var Zo=class{constructor(e,t=null,r=[],s=[],o=null,c=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=c,this.endAt=l,this.Pe=null}};function Hl(n,e=null,t=[],r=[],s=null,o=null,c=null){return new Zo(n,e,t,r,s,o,c)}function Ja(n){let e=ye(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>$o(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Wa(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Ht(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Ht(r)).join(",")),e.Pe=t}return e.Pe}function Ya(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!Ag(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Uh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Kl(n.startAt,e.startAt)&&Kl(n.endAt,e.endAt)}var Xt=class{constructor(e,t=null,r=[],s=[],o=null,c="F",l=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=c,this.startAt=l,this.endAt=h,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}};function Sg(n,e,t,r,s,o,c,l){return new Xt(n,e,t,r,s,o,c,l)}function Rg(n){return new Xt(n)}function Ql(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Pg(n){return n.collectionGroup!==null}function Jn(n){let e=ye(n);if(e.Te===null){e.Te=[];let t=new Set;for(let o of e.explicitOrderBy)e.Te.push(o),t.add(o.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(c){let l=new me(Pe.comparator);return c.filters.forEach(h=>{h.getFlattenedFilters().forEach(f=>{f.isInequality()&&(l=l.add(f.field))})}),l})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.Te.push(new Yt(o,r))}),t.has(Pe.keyField().canonicalString())||e.Te.push(new Yt(Pe.keyField(),r))}return e.Te}function At(n){let e=ye(n);return e.Ie||(e.Ie=Cg(e,Jn(n))),e.Ie}function Cg(n,e){if(n.limitType==="F")return Hl(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{let o=s.dir==="desc"?"asc":"desc";return new Yt(s.field,o)});let t=n.endAt?new Jt(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Jt(n.startAt.position,n.startAt.inclusive):null;return Hl(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function ea(n,e,t){return new Xt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function jh(n,e){return Ya(At(n),At(e))&&n.limitType===e.limitType}function zh(n){return`${Ja(At(n))}|lt:${n.limitType}`}function Hn(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>Bh(s)).join(", ")}]`),Wa(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(c){return`${c.field.canonicalString()} (${c.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Ht(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Ht(s)).join(",")),`Target(${r})`}(At(n))}; limitType=${n.limitType})`}function Xa(n,e){return e.isFoundDocument()&&function(r,s){let o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):M.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,e)&&function(r,s){for(let o of Jn(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,e)&&function(r,s){for(let o of r.filters)if(!o.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(c,l,h){let f=Wl(c,l,h);return c.inclusive?f<=0:f<0}(r.startAt,Jn(r),s)||r.endAt&&!function(c,l,h){let f=Wl(c,l,h);return c.inclusive?f>=0:f>0}(r.endAt,Jn(r),s))}(n,e)}function kg(n){return(e,t)=>{let r=!1;for(let s of Jn(n)){let o=Dg(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function Dg(n,e,t){let r=n.field.isKeyField()?M.comparator(e.key,t.key):function(o,c,l){let h=c.data.field(o),f=l.data.field(o);return h!==null&&f!==null?Kt(h,f):U(42886)}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return U(19790,{direction:n.dir})}}var ct=class{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(let[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){let r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Ka(this.inner,(t,r)=>{for(let[s,o]of r)e(s,o)})}isEmpty(){return Eg(this.inner)}size(){return this.innerSize}};var Ng=new Ae(M.comparator);function ta(){return Ng}var Gh=new Ae(M.comparator);function Ai(...n){let e=Gh;for(let t of n)e=e.insert(t.key,t);return e}function Og(n){let e=Gh;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function Et(){return Yn()}function $h(){return Yn()}function Yn(){return new ct(n=>n.toString(),(n,e)=>n.isEqual(e))}var bv=new Ae(M.comparator),Vg=new me(M.comparator);function we(...n){let e=Vg;for(let t of n)e=e.add(t);return e}var xg=new me(q);function Lg(){return xg}function Mg(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Di(e)?"-0":e}}function Fg(n){return{integerValue:""+n}}var Zt=class{constructor(){this._=void 0}};function Ug(n,e,t){return n instanceof or?function(s,o){let c={fields:{[Ph]:{stringValue:Rh},[kh]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Ha(o)&&(o=Dh(o)),o&&(c.fields[Ch]=o),{mapValue:c}}(t,e):n instanceof en?Wh(n,e):n instanceof tn?Kh(n,e):function(s,o){let c=qg(s,o),l=Jl(c)+Jl(s.Ee);return Go(c)&&Go(s.Ee)?Fg(l):Mg(s.serializer,l)}(n,e)}function Bg(n,e,t){return n instanceof en?Wh(n,e):n instanceof tn?Kh(n,e):t}function qg(n,e){return n instanceof ar?function(r){return Go(r)||function(o){return!!o&&"doubleValue"in o}(r)}(e)?e:{integerValue:0}:null}var or=class extends Zt{},en=class extends Zt{constructor(e){super(),this.elements=e}};function Wh(n,e){let t=Hh(e);for(let r of n.elements)t.some(s=>Fe(s,r))||t.push(r);return{arrayValue:{values:t}}}var tn=class extends Zt{constructor(e){super(),this.elements=e}};function Kh(n,e){let t=Hh(e);for(let r of n.elements)t=t.filter(s=>!Fe(s,r));return{arrayValue:{values:t}}}var ar=class extends Zt{constructor(e,t){super(),this.serializer=e,this.Ee=t}};function Jl(n){return X(n.integerValue||n.doubleValue)}function Hh(n){return Qa(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function jg(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof en&&s instanceof en||r instanceof tn&&s instanceof tn?Gt(r.elements,s.elements,Fe):r instanceof ar&&s instanceof ar?Fe(r.Ee,s.Ee):r instanceof or&&s instanceof or}(n.transform,e.transform)}var Xn=class n{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new n}static exists(e){return new n(void 0,e)}static updateTime(e){return new n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}};function Si(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}var cr=class{};function Qh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new na(n.key,Xn.none()):new ur(n.key,n.data,Xn.none());{let t=n.data,r=st.empty(),s=new me(Pe.comparator);for(let o of e.fields)if(!s.has(o)){let c=t.field(o);c===null&&o.length>1&&(o=o.popLast(),c=t.field(o)),c===null?r.delete(o):r.set(o,c),s=s.add(o)}return new nn(n.key,r,new wt(s.toArray()),Xn.none())}}function zg(n,e,t){n instanceof ur?function(s,o,c){let l=s.value.clone(),h=Xl(s.fieldTransforms,o,c.transformResults);l.setAll(h),o.convertToFoundDocument(c.version,l).setHasCommittedMutations()}(n,e,t):n instanceof nn?function(s,o,c){if(!Si(s.precondition,o))return void o.convertToUnknownDocument(c.version);let l=Xl(s.fieldTransforms,o,c.transformResults),h=o.data;h.setAll(Jh(s)),h.setAll(l),o.convertToFoundDocument(c.version,h).setHasCommittedMutations()}(n,e,t):function(s,o,c){o.convertToNoDocument(c.version).setHasCommittedMutations()}(0,e,t)}function Zn(n,e,t,r){return n instanceof ur?function(o,c,l,h){if(!Si(o.precondition,c))return l;let f=o.value.clone(),y=Zl(o.fieldTransforms,h,c);return f.setAll(y),c.convertToFoundDocument(c.version,f).setHasLocalMutations(),null}(n,e,t,r):n instanceof nn?function(o,c,l,h){if(!Si(o.precondition,c))return l;let f=Zl(o.fieldTransforms,h,c),y=c.data;return y.setAll(Jh(o)),y.setAll(f),c.convertToFoundDocument(c.version,y).setHasLocalMutations(),l===null?null:l.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(T=>T.field))}(n,e,t,r):function(o,c,l){return Si(o.precondition,c)?(c.convertToNoDocument(c.version).setHasLocalMutations(),null):l}(n,e,t)}function Yl(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Gt(r,s,(o,c)=>jg(o,c))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}var ur=class extends cr{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}},nn=class extends cr{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}};function Jh(n){let e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){let r=n.data.field(t);e.set(t,r)}}),e}function Xl(n,e,t){let r=new Map;ge(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let s=0;s<t.length;s++){let o=n[s],c=o.transform,l=e.data.field(o.field);r.set(o.field,Bg(c,l,t[s]))}return r}function Zl(n,e,t){let r=new Map;for(let s of n){let o=s.transform,c=t.data.field(s.field);r.set(s.field,Ug(o,c,e))}return r}var na=class extends cr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}};var ra=class{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){let r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){let o=this.mutations[s];o.key.isEqual(e.key)&&zg(o,e,r[s])}}applyToLocalView(e,t){for(let r of this.baseMutations)r.key.isEqual(e.key)&&(t=Zn(r,e,t,this.localWriteTime));for(let r of this.mutations)r.key.isEqual(e.key)&&(t=Zn(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let r=$h();return this.mutations.forEach(s=>{let o=e.get(s.key),c=o.overlayedDocument,l=this.applyToLocalView(c,o.mutatedFields);l=t.has(s.key)?null:l;let h=Qh(c,l);h!==null&&r.set(s.key,h),c.isValidDocument()||c.convertToNoDocument(J.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),we())}isEqual(e){return this.batchId===e.batchId&&Gt(this.mutations,e.mutations,(t,r)=>Yl(t,r))&&Gt(this.baseMutations,e.baseMutations,(t,r)=>Yl(t,r))}};var ia=class{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}};var Q,F;function Gg(n){if(n===void 0)return Ki("GRPC error has no .code"),P.UNKNOWN;switch(n){case Q.OK:return P.OK;case Q.CANCELLED:return P.CANCELLED;case Q.UNKNOWN:return P.UNKNOWN;case Q.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case Q.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case Q.INTERNAL:return P.INTERNAL;case Q.UNAVAILABLE:return P.UNAVAILABLE;case Q.UNAUTHENTICATED:return P.UNAUTHENTICATED;case Q.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case Q.NOT_FOUND:return P.NOT_FOUND;case Q.ALREADY_EXISTS:return P.ALREADY_EXISTS;case Q.PERMISSION_DENIED:return P.PERMISSION_DENIED;case Q.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case Q.ABORTED:return P.ABORTED;case Q.OUT_OF_RANGE:return P.OUT_OF_RANGE;case Q.UNIMPLEMENTED:return P.UNIMPLEMENTED;case Q.DATA_LOSS:return P.DATA_LOSS;default:return U(39323,{code:n})}}(F=Q||(Q={}))[F.OK=0]="OK",F[F.CANCELLED=1]="CANCELLED",F[F.UNKNOWN=2]="UNKNOWN",F[F.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",F[F.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",F[F.NOT_FOUND=5]="NOT_FOUND",F[F.ALREADY_EXISTS=6]="ALREADY_EXISTS",F[F.PERMISSION_DENIED=7]="PERMISSION_DENIED",F[F.UNAUTHENTICATED=16]="UNAUTHENTICATED",F[F.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",F[F.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",F[F.ABORTED=10]="ABORTED",F[F.OUT_OF_RANGE=11]="OUT_OF_RANGE",F[F.UNIMPLEMENTED=12]="UNIMPLEMENTED",F[F.INTERNAL=13]="INTERNAL",F[F.UNAVAILABLE=14]="UNAVAILABLE",F[F.DATA_LOSS=15]="DATA_LOSS";var Sv=new Ii([4294967295,4294967295],0);var sa=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function eh(n){return ge(!!n,49232),J.fromTimestamp(function(t){let r=ot(t);return new _e(r.seconds,r.nanos)}(n))}function th(n,e){let t=function(s){return new de(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function $g(n){let e=de.fromString(n);return ge(Qg(e),10190,{key:e.toString()}),e}function Wg(n){let e=$g(n);return e.length===4?de.emptyPath():Kg(e)}function Kg(n){return ge(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Hg(n){let e=Wg(n.parent),t=n.structuredQuery,r=t.from?t.from.length:0,s=null;if(r>0){ge(r===1,65062);let y=t.from[0];y.allDescendants?s=y.collectionId:e=e.child(y.collectionId)}let o=[];t.where&&(o=function(T){let b=Yh(T);return b instanceof at&&Fh(b)?b.getFilters():[b]}(t.where));let c=[];t.orderBy&&(c=function(T){return T.map(b=>function(k){return new Yt(Ut(k.field),function(O){switch(O){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(k.direction))}(b))}(t.orderBy));let l=null;t.limit&&(l=function(T){let b;return b=typeof T=="object"?T.value:T,Wa(b)?null:b}(t.limit));let h=null;t.startAt&&(h=function(T){let b=!!T.before,C=T.values||[];return new Jt(C,b)}(t.startAt));let f=null;return t.endAt&&(f=function(T){let b=!T.before,C=T.values||[];return new Jt(C,b)}(t.endAt)),Sg(e,s,c,o,l,"F",h,f)}function Yh(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":let r=Ut(t.unaryFilter.field);return re.create(r,"==",{doubleValue:NaN});case"IS_NULL":let s=Ut(t.unaryFilter.field);return re.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let o=Ut(t.unaryFilter.field);return re.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let c=Ut(t.unaryFilter.field);return re.create(c,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return U(61313);default:return U(60726)}}(n):n.fieldFilter!==void 0?function(t){return re.create(Ut(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return U(58110);default:return U(50506)}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return at.create(t.compositeFilter.filters.map(r=>Yh(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return U(1026)}}(t.compositeFilter.op))}(n):U(30097,{filter:n})}function Ut(n){return Pe.fromServerFormat(n.fieldPath)}function Qg(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}var oa=class{constructor(e){this.gt=e}};function Jg(n){let e=Hg({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?ea(e,e.limit,"L"):e}var Mi=class{constructor(){}bt(e,t){this.Dt(e,t),t.vt()}Dt(e,t){if("nullValue"in e)this.Ct(t,5);else if("booleanValue"in e)this.Ct(t,10),t.Ft(e.booleanValue?1:0);else if("integerValue"in e)this.Ct(t,15),t.Ft(X(e.integerValue));else if("doubleValue"in e){let r=X(e.doubleValue);isNaN(r)?this.Ct(t,13):(this.Ct(t,15),Di(r)?t.Ft(0):t.Ft(r))}else if("timestampValue"in e){let r=e.timestampValue;this.Ct(t,20),typeof r=="string"&&(r=ot(r)),t.Mt(`${r.seconds||""}`),t.Ft(r.nanos||0)}else if("stringValue"in e)this.xt(e.stringValue,t),this.Ot(t);else if("bytesValue"in e)this.Ct(t,30),t.Nt($t(e.bytesValue)),this.Ot(t);else if("referenceValue"in e)this.Bt(e.referenceValue,t);else if("geoPointValue"in e){let r=e.geoPointValue;this.Ct(t,45),t.Ft(r.latitude||0),t.Ft(r.longitude||0)}else"mapValue"in e?Lh(e)?this.Ct(t,Number.MAX_SAFE_INTEGER):xh(e)?this.Lt(e.mapValue,t):(this.kt(e.mapValue,t),this.Ot(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Ot(t)):U(19022,{Qt:e})}xt(e,t){this.Ct(t,25),this.$t(e,t)}$t(e,t){t.Mt(e)}kt(e,t){let r=e.fields||{};this.Ct(t,55);for(let s of Object.keys(r))this.xt(s,t),this.Dt(r[s],t)}Lt(e,t){var r,s;let o=e.fields||{};this.Ct(t,53);let c=xi,l=((s=(r=o[c].arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.length)||0;this.Ct(t,15),t.Ft(X(l)),this.xt(c,t),this.Dt(o[c],t)}qt(e,t){let r=e.values||[];this.Ct(t,50);for(let s of r)this.Dt(s,t)}Bt(e,t){this.Ct(t,37),M.fromName(e).path.forEach(r=>{this.Ct(t,60),this.$t(r,t)})}Ct(e,t){e.Ft(t)}Ot(e){e.Ft(2)}};Mi.Ut=new Mi;var aa=class{constructor(){this.Dn=new ca}addToCollectionParentIndex(e,t){return this.Dn.add(t),S.resolve()}getCollectionParents(e,t){return S.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return S.resolve()}deleteFieldIndex(e,t){return S.resolve()}deleteAllFieldIndexes(e){return S.resolve()}createTargetIndexes(e,t){return S.resolve()}getDocumentsMatchingTarget(e,t){return S.resolve(null)}getIndexType(e,t){return S.resolve(0)}getFieldIndexes(e,t){return S.resolve([])}getNextCollectionGroupToUpdate(e){return S.resolve(null)}getMinOffset(e,t){return S.resolve(Rt.min())}getMinOffsetFromCollectionGroup(e,t){return S.resolve(Rt.min())}updateCollectionGroup(e,t,r){return S.resolve()}updateIndexEntries(e,t){return S.resolve()}},ca=class{constructor(){this.index={}}add(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new me(de.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new me(de.comparator)).toArray()}};var Rv=new Uint8Array(0);var Xh=41943040,Le=class n{static withCacheSize(e){return new n(e,n.DEFAULT_COLLECTION_PERCENTILE,n.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}};Le.DEFAULT_COLLECTION_PERCENTILE=10,Le.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Le.DEFAULT=new Le(Xh,Le.DEFAULT_COLLECTION_PERCENTILE,Le.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Le.DISABLED=new Le(-1,0,0);var lr=class n{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new n(0)}static ur(){return new n(-1)}};var Yg=1048576;var ua=class{constructor(){this.changes=new ct(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Qt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let r=this.changes.get(t);return r!==void 0?S.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}};var la=class{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}};var ha=class{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Zn(r.mutation,s,wt.empty(),_e.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,we()).next(()=>r))}getLocalViewOfDocuments(e,t,r=we()){let s=Et();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(o=>{let c=Ai();return o.forEach((l,h)=>{c=c.insert(l,h.overlayedDocument)}),c}))}getOverlayedDocuments(e,t){let r=Et();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,we()))}populateOverlays(e,t,r){let s=[];return r.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((c,l)=>{t.set(c,l)})})}computeViews(e,t,r,s){let o=ta(),c=Yn(),l=function(){return Yn()}();return t.forEach((h,f)=>{let y=r.get(f.key);s.has(f.key)&&(y===void 0||y.mutation instanceof nn)?o=o.insert(f.key,f):y!==void 0?(c.set(f.key,y.mutation.getFieldMask()),Zn(y.mutation,f,y.mutation.getFieldMask(),_e.now())):c.set(f.key,wt.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((f,y)=>c.set(f,y)),t.forEach((f,y)=>{var T;return l.set(f,new la(y,(T=c.get(f))!==null&&T!==void 0?T:null))}),l))}recalculateAndSaveOverlays(e,t){let r=Yn(),s=new Ae((c,l)=>c-l),o=we();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(c=>{for(let l of c)l.keys().forEach(h=>{let f=t.get(h);if(f===null)return;let y=r.get(h)||wt.empty();y=l.applyToLocalView(f,y),r.set(h,y);let T=(s.get(l.batchId)||we()).add(h);s=s.insert(l.batchId,T)})}).next(()=>{let c=[],l=s.getReverseIterator();for(;l.hasNext();){let h=l.getNext(),f=h.key,y=h.value,T=$h();y.forEach(b=>{if(!o.has(b)){let C=Qh(t.get(b),r.get(b));C!==null&&T.set(b,C),o=o.add(b)}}),c.push(this.documentOverlayCache.saveOverlays(e,f,T))}return S.waitFor(c)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(c){return M.isDocumentKey(c.path)&&c.collectionGroup===null&&c.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Pg(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(o=>{let c=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):S.resolve(Et()),l=ir,h=o;return c.next(f=>S.forEach(f,(y,T)=>(l<T.largestBatchId&&(l=T.largestBatchId),o.get(y)?S.resolve():this.remoteDocumentCache.getEntry(e,y).next(b=>{h=h.insert(y,b)}))).next(()=>this.populateOverlays(e,f,o)).next(()=>this.computeViews(e,h,f,we())).next(y=>({batchId:l,changes:Og(y)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new M(t)).next(r=>{let s=Ai();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){let o=t.collectionGroup,c=Ai();return this.indexManager.getCollectionParents(e,o).next(l=>S.forEach(l,h=>{let f=function(T,b){return new Xt(b,null,T.explicitOrderBy.slice(),T.filters.slice(),T.limit,T.limitType,T.startAt,T.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,f,r,s).next(y=>{y.forEach((T,b)=>{c=c.insert(T,b)})})}).next(()=>c))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(c=>(o=c,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s))).next(c=>{o.forEach((h,f)=>{let y=f.getKey();c.get(y)===null&&(c=c.insert(y,Qt.newInvalidDocument(y)))});let l=Ai();return c.forEach((h,f)=>{let y=o.get(h);y!==void 0&&Zn(y.mutation,f,wt.empty(),_e.now()),Xa(t,f)&&(l=l.insert(h,f))}),l})}};var da=class{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return S.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,function(s){return{id:s.id,version:s.version,createTime:eh(s.createTime)}}(t)),S.resolve()}getNamedQuery(e,t){return S.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,function(s){return{name:s.name,query:Jg(s.bundledQuery),readTime:eh(s.readTime)}}(t)),S.resolve()}};var fa=class{constructor(){this.overlays=new Ae(M.comparator),this.kr=new Map}getOverlay(e,t){return S.resolve(this.overlays.get(t))}getOverlays(e,t){let r=Et();return S.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,o)=>{this.wt(e,t,o)}),S.resolve()}removeOverlaysForBatchId(e,t,r){let s=this.kr.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.kr.delete(r)),S.resolve()}getOverlaysForCollection(e,t,r){let s=Et(),o=t.length+1,c=new M(t.child("")),l=this.overlays.getIteratorFrom(c);for(;l.hasNext();){let h=l.getNext().value,f=h.getKey();if(!t.isPrefixOf(f.path))break;f.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return S.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new Ae((f,y)=>f-y),c=this.overlays.getIterator();for(;c.hasNext();){let f=c.getNext().value;if(f.getKey().getCollectionGroup()===t&&f.largestBatchId>r){let y=o.get(f.largestBatchId);y===null&&(y=Et(),o=o.insert(f.largestBatchId,y)),y.set(f.getKey(),f)}}let l=Et(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((f,y)=>l.set(f,y)),!(l.size()>=s)););return S.resolve(l)}wt(e,t,r){let s=this.overlays.get(r.key);if(s!==null){let c=this.kr.get(s.largestBatchId).delete(r.key);this.kr.set(s.largestBatchId,c)}this.overlays=this.overlays.insert(r.key,new ia(t,r));let o=this.kr.get(t);o===void 0&&(o=we(),this.kr.set(t,o)),this.kr.set(t,o.add(r.key))}};var pa=class{constructor(){this.sessionToken=Ke.EMPTY_BYTE_STRING}getSessionToken(e){return S.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,S.resolve()}};var hr=class{constructor(){this.qr=new me(Y.Qr),this.$r=new me(Y.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){let r=new Y(e,t);this.qr=this.qr.add(r),this.$r=this.$r.add(r)}Kr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Wr(new Y(e,t))}Gr(e,t){e.forEach(r=>this.removeReference(r,t))}zr(e){let t=new M(new de([])),r=new Y(t,e),s=new Y(t,e+1),o=[];return this.$r.forEachInRange([r,s],c=>{this.Wr(c),o.push(c.key)}),o}jr(){this.qr.forEach(e=>this.Wr(e))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){let t=new M(new de([])),r=new Y(t,e),s=new Y(t,e+1),o=we();return this.$r.forEachInRange([r,s],c=>{o=o.add(c.key)}),o}containsKey(e){let t=new Y(e,0),r=this.qr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}},Y=class{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return M.comparator(e.key,t.key)||q(e.Hr,t.Hr)}static Ur(e,t){return q(e.Hr,t.Hr)||M.comparator(e.key,t.key)}};var ma=class{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new me(Y.Qr)}checkEmpty(e){return S.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){let o=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let c=new ra(o,t,r,s);this.mutationQueue.push(c);for(let l of s)this.Yr=this.Yr.add(new Y(l.key,o)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return S.resolve(c)}lookupMutationBatch(e,t){return S.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){let r=t+1,s=this.Xr(r),o=s<0?0:s;return S.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return S.resolve(this.mutationQueue.length===0?hg:this.er-1)}getAllMutationBatches(e){return S.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let r=new Y(t,0),s=new Y(t,Number.POSITIVE_INFINITY),o=[];return this.Yr.forEachInRange([r,s],c=>{let l=this.Zr(c.Hr);o.push(l)}),S.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new me(q);return t.forEach(s=>{let o=new Y(s,0),c=new Y(s,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([o,c],l=>{r=r.add(l.Hr)})}),S.resolve(this.ei(r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,s=r.length+1,o=r;M.isDocumentKey(o)||(o=o.child(""));let c=new Y(new M(o),0),l=new me(q);return this.Yr.forEachWhile(h=>{let f=h.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(l=l.add(h.Hr)),!0)},c),S.resolve(this.ei(l))}ei(e){let t=[];return e.forEach(r=>{let s=this.Zr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){ge(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Yr;return S.forEach(t.mutations,s=>{let o=new Y(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.Yr=r})}rr(e){}containsKey(e,t){let r=new Y(t,0),s=this.Yr.firstAfterOrEqual(r);return S.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,S.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){let t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}};var ga=class{constructor(e){this.ni=e,this.docs=function(){return new Ae(M.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let r=t.key,s=this.docs.get(r),o=s?s.size:0,c=this.ni(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:c}),this.size+=c-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let r=this.docs.get(t);return S.resolve(r?r.document.mutableCopy():Qt.newInvalidDocument(t))}getEntries(e,t){let r=ta();return t.forEach(s=>{let o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():Qt.newInvalidDocument(s))}),S.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=ta(),c=t.path,l=new M(c.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(l);for(;h.hasNext();){let{key:f,value:{document:y}}=h.getNext();if(!c.isPrefixOf(f.path))break;f.path.length>c.length+1||ug(cg(y),r)<=0||(s.has(y.key)||Xa(t,y))&&(o=o.insert(y.key,y.mutableCopy()))}return S.resolve(o)}getAllFromCollectionGroup(e,t,r,s){U(9500)}ri(e,t){return S.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new _a(this)}getSize(e){return S.resolve(this.size)}},_a=class extends ua{constructor(e){super(),this.Or=e}applyChanges(e){let t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.Or.addEntry(e,s)):this.Or.removeEntry(r)}),S.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}};var ya=class{constructor(e){this.persistence=e,this.ii=new ct(t=>Ja(t),Ya),this.lastRemoteSnapshotVersion=J.min(),this.highestTargetId=0,this.si=0,this.oi=new hr,this.targetCount=0,this._i=lr.ar()}forEachTarget(e,t){return this.ii.forEach((r,s)=>t(s)),S.resolve()}getLastRemoteSnapshotVersion(e){return S.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return S.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),S.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.si&&(this.si=t),S.resolve()}hr(e){this.ii.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this._i=new lr(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,S.resolve()}updateTargetData(e,t){return this.hr(t),S.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,S.resolve()}removeTargets(e,t,r){let s=0,o=[];return this.ii.forEach((c,l)=>{l.sequenceNumber<=t&&r.get(l.targetId)===null&&(this.ii.delete(c),o.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)}),S.waitFor(o).next(()=>s)}getTargetCount(e){return S.resolve(this.targetCount)}getTargetData(e,t){let r=this.ii.get(t)||null;return S.resolve(r)}addMatchingKeys(e,t,r){return this.oi.Kr(t,r),S.resolve()}removeMatchingKeys(e,t,r){this.oi.Gr(t,r);let s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(c=>{o.push(s.markPotentiallyOrphaned(e,c))}),S.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),S.resolve()}getMatchingKeysForTargetId(e,t){let r=this.oi.Jr(t);return S.resolve(r)}containsKey(e,t){return S.resolve(this.oi.containsKey(t))}};var va=class{constructor(e,t){this.ai={},this.overlays={},this.ui=new ki(0),this.ci=!1,this.ci=!0,this.li=new pa,this.referenceDelegate=e(this),this.hi=new ya(this),this.indexManager=new aa,this.remoteDocumentCache=function(s){return new ga(s)}(r=>this.referenceDelegate.Pi(r)),this.serializer=new oa(t),this.Ti=new da(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new fa,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.ai[e.toKey()];return r||(r=new ma(t,this.referenceDelegate),this.ai[e.toKey()]=r),r}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,r){V("MemoryPersistence","Starting transaction:",e);let s=new Ia(this.ui.next());return this.referenceDelegate.Ii(),r(s).next(o=>this.referenceDelegate.di(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Ei(e,t){return S.or(Object.values(this.ai).map(r=>()=>r.containsKey(e,t)))}},Ia=class extends Bo{constructor(e){super(),this.currentSequenceNumber=e}},wa=class n{constructor(e){this.persistence=e,this.Ai=new hr,this.Ri=null}static Vi(e){return new n(e)}get mi(){if(this.Ri)return this.Ri;throw U(60996)}addReference(e,t,r){return this.Ai.addReference(r,t),this.mi.delete(r.toString()),S.resolve()}removeReference(e,t,r){return this.Ai.removeReference(r,t),this.mi.add(r.toString()),S.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),S.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach(s=>this.mi.add(s.toString()));let r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.mi.add(o.toString()))}).next(()=>r.removeTargetData(e,t))}Ii(){this.Ri=new Set}di(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return S.forEach(this.mi,r=>{let s=M.fromPath(r);return this.fi(e,s).next(o=>{o||t.removeEntry(s,J.min())})}).next(()=>(this.Ri=null,t.apply(e)))}updateLimboDocument(e,t){return this.fi(e,t).next(r=>{r?this.mi.delete(t.toString()):this.mi.add(t.toString())})}Pi(e){return 0}fi(e,t){return S.or([()=>S.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}};var Ea=class n{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Is=r,this.ds=s}static Es(e,t){let r=we(),s=we();for(let o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new n(e,t.fromCache,r,s)}};var Ta=class{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}};var Aa=class{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=function(){return yu()?8:lg(te())>0?6:4}()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,r,s){let o={result:null};return this.ps(e,t).next(c=>{o.result=c}).next(()=>{if(!o.result)return this.ys(e,t,s,r).next(c=>{o.result=c})}).next(()=>{if(o.result)return;let c=new Ta;return this.ws(e,t,c).next(l=>{if(o.result=l,this.Rs)return this.Ss(e,t,c,l.size)})}).next(()=>o.result)}Ss(e,t,r,s){return r.documentReadCount<this.Vs?(Kn()<=x.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",Hn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),S.resolve()):(Kn()<=x.DEBUG&&V("QueryEngine","Query:",Hn(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.fs*s?(Kn()<=x.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",Hn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,At(t))):S.resolve())}ps(e,t){if(Ql(t))return S.resolve(null);let r=At(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=ea(t,null,"F"),r=At(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(o=>{let c=we(...o);return this.gs.getDocuments(e,c).next(l=>this.indexManager.getMinOffset(e,r).next(h=>{let f=this.bs(t,l);return this.Ds(t,f,c,h.readTime)?this.ps(e,ea(t,null,"F")):this.vs(e,f,t,h)}))})))}ys(e,t,r,s){return Ql(t)||s.isEqual(J.min())?S.resolve(null):this.gs.getDocuments(e,r).next(o=>{let c=this.bs(t,o);return this.Ds(t,c,r,s)?S.resolve(null):(Kn()<=x.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Hn(t)),this.vs(e,c,t,ag(s,ir)).next(l=>l))})}bs(e,t){let r=new me(kg(e));return t.forEach((s,o)=>{Xa(e,o)&&(r=r.add(o))}),r}Ds(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;let o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}ws(e,t,r){return Kn()<=x.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",Hn(t)),this.gs.getDocumentsMatchingQuery(e,t,Rt.min(),r)}vs(e,t,r,s){return this.gs.getDocumentsMatchingQuery(e,r,s).next(o=>(t.forEach(c=>{o=o.insert(c.key,c)}),o))}};var Xg="LocalStore";var ba=class{constructor(e,t,r,s){this.persistence=e,this.Cs=t,this.serializer=s,this.Fs=new Ae(q),this.Ms=new ct(o=>Ja(o),Ya),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(r)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ha(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Fs))}};function Zg(n,e,t,r){return new ba(n,e,t,r)}async function e_(n,e){let t=ye(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,t.Ns(e),t.mutationQueue.getAllMutationBatches(r))).next(o=>{let c=[],l=[],h=we();for(let f of s){c.push(f.batchId);for(let y of f.mutations)h=h.add(y.key)}for(let f of o){l.push(f.batchId);for(let y of f.mutations)h=h.add(y.key)}return t.localDocuments.getDocuments(r,h).next(f=>({Bs:f,removedBatchIds:c,addedBatchIds:l}))})})}var Fi=class{constructor(){this.activeTargetIds=Lg()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}};var Sa=class{constructor(){this.Fo=new Fi,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,r){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Fi,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}};var Ra=class{xo(e){}shutdown(){}};var nh="ConnectivityMonitor",Ui=class{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){V(nh,"Network connectivity changed: AVAILABLE");for(let e of this.ko)e(0)}Lo(){V(nh,"Network connectivity changed: UNAVAILABLE");for(let e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}};var bi=null;function Pa(){return bi===null?bi=function(){return 268435456+Math.round(2147483648*Math.random())}():bi++,"0x"+bi.toString(16)}var Co="RestConnection",t_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"},Ca=class{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${r}/databases/${s}`,this.Ko=this.databaseId.database===Vi?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Wo(e,t,r,s,o){let c=Pa(),l=this.Go(e,t.toUriEncodedString());V(Co,`Sending RPC '${e}' ${c}:`,l,r);let h={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(h,s,o);let{host:f}=new URL(l),y=Xe(f);return this.jo(e,l,h,r,y).then(T=>(V(Co,`Received RPC '${e}' ${c}: `,T),T),T=>{throw Ga(Co,`RPC '${e}' ${c} failed with error: `,T,"url: ",l,"request:",r),T})}Jo(e,t,r,s,o,c){return this.Wo(e,t,r,s,o)}zo(e,t,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+rn}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((s,o)=>e[o]=s),r&&r.headers.forEach((s,o)=>e[o]=s)}Go(e,t){let r=t_[e];return`${this.$o}/v1/${t}:${r}`}terminate(){}};var ka=class{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}};var he="WebChannelConnection",Da=class extends Ca{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,r,s,o){let c=Pa();return new Promise((l,h)=>{let f=new To;f.setWithCredentials(!0),f.listenOnce(Ao.COMPLETE,()=>{try{switch(f.getLastErrorCode()){case Wn.NO_ERROR:let T=f.getResponseJson();V(he,`XHR for RPC '${e}' ${c} received:`,JSON.stringify(T)),l(T);break;case Wn.TIMEOUT:V(he,`RPC '${e}' ${c} timed out`),h(new N(P.DEADLINE_EXCEEDED,"Request time out"));break;case Wn.HTTP_ERROR:let b=f.getStatus();if(V(he,`RPC '${e}' ${c} failed with status:`,b,"response text:",f.getResponseText()),b>0){let C=f.getResponseJson();Array.isArray(C)&&(C=C[0]);let k=C?.error;if(k&&k.status&&k.message){let L=function(H){let j=H.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(j)>=0?j:P.UNKNOWN}(k.status);h(new N(L,k.message))}else h(new N(P.UNKNOWN,"Server responded with status "+f.getStatus()))}else h(new N(P.UNAVAILABLE,"Connection failed."));break;default:U(9055,{c_:e,streamId:c,l_:f.getLastErrorCode(),h_:f.getLastError()})}}finally{V(he,`RPC '${e}' ${c} completed.`)}});let y=JSON.stringify(s);V(he,`RPC '${e}' ${c} sending request:`,s),f.send(t,"POST",y,r,15)})}P_(e,t,r){let s=Pa(),o=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],c=Ro(),l=So(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},f=this.longPollingOptions.timeoutSeconds;f!==void 0&&(h.longPollingTimeout=Math.round(1e3*f)),this.useFetchStreams&&(h.useFetchStreams=!0),this.zo(h.initMessageHeaders,t,r),h.encodeInitMessageHeaders=!0;let y=o.join("");V(he,`Creating RPC '${e}' stream ${s}: ${y}`,h);let T=c.createWebChannel(y,h);this.T_(T);let b=!1,C=!1,k=new ka({Ho:O=>{C?V(he,`Not sending because RPC '${e}' stream ${s} is closed:`,O):(b||(V(he,`Opening RPC '${e}' stream ${s} transport.`),T.open(),b=!0),V(he,`RPC '${e}' stream ${s} sending:`,O),T.send(O))},Yo:()=>T.close()}),L=(O,H,j)=>{O.listen(H,G=>{try{j(G)}catch(K){setTimeout(()=>{throw K},0)}})};return L(T,Ft.EventType.OPEN,()=>{C||(V(he,`RPC '${e}' stream ${s} transport opened.`),k.s_())}),L(T,Ft.EventType.CLOSE,()=>{C||(C=!0,V(he,`RPC '${e}' stream ${s} transport closed`),k.__(),this.I_(T))}),L(T,Ft.EventType.ERROR,O=>{C||(C=!0,Ga(he,`RPC '${e}' stream ${s} transport errored. Name:`,O.name,"Message:",O.message),k.__(new N(P.UNAVAILABLE,"The operation could not be completed")))}),L(T,Ft.EventType.MESSAGE,O=>{var H;if(!C){let j=O.data[0];ge(!!j,16349);let G=j,K=G?.error||((H=G[0])===null||H===void 0?void 0:H.error);if(K){V(he,`RPC '${e}' stream ${s} received error:`,K);let Ce=K.status,ee=function(g){let _=Q[g];if(_!==void 0)return Gg(_)}(Ce),I=K.message;ee===void 0&&(ee=P.INTERNAL,I="Unknown error status: "+Ce+" with message "+K.message),C=!0,k.__(new N(ee,I)),T.close()}else V(he,`RPC '${e}' stream ${s} received:`,j),k.a_(j)}}),L(l,bo.STAT_EVENT,O=>{O.stat===Ei.PROXY?V(he,`RPC '${e}' stream ${s} detected buffering proxy`):O.stat===Ei.NOPROXY&&V(he,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{k.o_()},0),k}terminate(){this.u_.forEach(e=>e.close()),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter(t=>t===e)}};function ko(){return typeof document<"u"?document:null}function Zh(n){return new sa(n,!0)}var Na=class{constructor(e,t,r=1e3,s=1.5,o=6e4){this.Fi=e,this.timerId=t,this.d_=r,this.E_=s,this.A_=o,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();let t=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),s=Math.max(0,t-r);s>0&&V("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,s,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}};var Oa=class{},Va=class extends Oa{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.ra=!1}ia(){if(this.ra)throw new N(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,r,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,c])=>this.connection.Wo(e,th(t,r),s,o,c)).catch(o=>{throw o.name==="FirebaseError"?(o.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(P.UNKNOWN,o.toString())})}Jo(e,t,r,s,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([c,l])=>this.connection.Jo(e,th(t,r),s,c,l,o)).catch(c=>{throw c.name==="FirebaseError"?(c.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),c):new N(P.UNKNOWN,c.toString())})}terminate(){this.ra=!0,this.connection.terminate()}},xa=class{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Ki(t),this._a=!1):V("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}};var ed="RemoteStore",La=class{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=o,this.Ea.xo(c=>{r.enqueueAndForget(async()=>{nd(this)&&(V(ed,"Restarting streams for network reachability change."),await async function(h){let f=ye(h);f.Ia.add(4),await Za(f),f.Aa.set("Unknown"),f.Ia.delete(4),await td(f)}(this))})}),this.Aa=new xa(r,s)}};async function td(n){if(nd(n))for(let e of n.da)await e(!0)}async function Za(n){for(let e of n.da)await e(!1)}function nd(n){return ye(n).Ia.size===0}async function n_(n,e){let t=ye(n);e?(t.Ia.delete(2),await td(t)):e||(t.Ia.add(2),await Za(t),t.Aa.set("Unknown"))}var Ma=class n{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new Tt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(c=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){let c=Date.now()+r,l=new n(e,t,c,s,o);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};var Fa=class{constructor(){this.queries=rh(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,r){let s=ye(t),o=s.queries;s.queries=rh(),o.forEach((c,l)=>{for(let h of l.wa)h.onError(r)})})(this,new N(P.ABORTED,"Firestore shutting down"))}};function rh(){return new ct(n=>zh(n),jh)}function r_(n){n.Da.forEach(e=>{e.next()})}var ih,sh;(sh=ih||(ih={})).Fa="default",sh.Cache="cache";var i_="SyncEngine";var Ua=class{constructor(e,t,r,s,o,c){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=c,this.hu={},this.Pu=new ct(l=>zh(l),jh),this.Tu=new Map,this.Iu=new Set,this.du=new Ae(M.comparator),this.Eu=new Map,this.Au=new hr,this.Ru={},this.Vu=new Map,this.mu=lr.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}};function oh(n,e,t){let r=ye(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){let s=[];r.Pu.forEach((o,c)=>{let l=c.view.va(e);l.snapshot&&s.push(l.snapshot)}),function(c,l){let h=ye(c);h.onlineState=l;let f=!1;h.queries.forEach((y,T)=>{for(let b of T.wa)b.va(l)&&(f=!0)}),f&&r_(h)}(r.eventManager,e),s.length&&r.hu.J_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function s_(n,e,t){let r=ye(n),s=[],o=[],c=[];r.Pu.isEmpty()||(r.Pu.forEach((l,h)=>{c.push(r.gu(h,e,t).then(f=>{var y;if((f||t)&&r.isPrimaryClient){let T=f?!f.fromCache:(y=t?.targetChanges.get(h.targetId))===null||y===void 0?void 0:y.current;r.sharedClientState.updateQueryState(h.targetId,T?"current":"not-current")}if(f){s.push(f);let T=Ea.Es(h.targetId,f);o.push(T)}}))}),await Promise.all(c),r.hu.J_(s),await async function(h,f){let y=ye(h);try{await y.persistence.runTransaction("notifyLocalViewChanges","readwrite",T=>S.forEach(f,b=>S.forEach(b.Is,C=>y.persistence.referenceDelegate.addReference(T,b.targetId,C)).next(()=>S.forEach(b.ds,C=>y.persistence.referenceDelegate.removeReference(T,b.targetId,C)))))}catch(T){if(!fh(T))throw T;V(Xg,"Failed to update sequence numbers: "+T)}for(let T of f){let b=T.targetId;if(!T.fromCache){let C=y.Fs.get(b),k=C.snapshotVersion,L=C.withLastLimboFreeSnapshotVersion(k);y.Fs=y.Fs.insert(b,L)}}}(r.localStore,o))}async function o_(n,e){let t=ye(n);if(!t.currentUser.isEqual(e)){V(i_,"User change. New user:",e.toKey());let r=await e_(t.localStore,e);t.currentUser=e,function(o,c){o.Vu.forEach(l=>{l.forEach(h=>{h.reject(new N(P.CANCELLED,c))})}),o.Vu.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await s_(t,r.Bs)}}var Bi=class{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Zh(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return Zg(this.persistence,new Aa,e.initialUser,this.serializer)}Du(e){return new va(wa.Vi,this.serializer)}bu(e){return new Sa}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}};Bi.provider={build:()=>new Bi};var qi=class{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>oh(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=o_.bind(null,this.syncEngine),await n_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Fa}()}createDatastore(e){let t=Zh(e.databaseInfo.databaseId),r=function(o){return new Da(o)}(e.databaseInfo);return function(o,c,l,h){return new Va(o,c,l,h)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,o,c,l){return new La(r,s,o,c,l)}(this.localStore,this.datastore,e.asyncQueue,t=>oh(this.syncEngine,t,0),function(){return Ui.C()?new Ui:new Ra}())}createSyncEngine(e,t){return function(s,o,c,l,h,f,y){let T=new Ua(s,o,c,l,h,f);return y&&(T.fu=!0),T}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){let o=ye(s);V(ed,"RemoteStore shutting down."),o.Ia.add(5),await Za(o),o.Ea.shutdown(),o.Aa.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}};qi.provider={build:()=>new qi};function a_(n){let e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}var ah=new Map;var rd="firestore.googleapis.com",ch=!0,ji=class{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new N(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=rd,this.ssl=ch}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:ch;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Xh;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Yg)throw new N(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}rg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=a_((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}},zi=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ji({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ji(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Do;switch(r.type){case"firstParty":return new xo(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){let r=ah.get(t);r&&(V("ComponentProvider","Removing Datastore"),ah.delete(t),r.terminate())}(this),Promise.resolve()}};function c_(n,e,t,r={}){var s;n=og(n,zi);let o=Xe(e),c=n._getSettings(),l=Object.assign(Object.assign({},c),{emulatorOptions:n._getEmulatorOptions()}),h=`${e}:${t}`;o&&(xr(`https://${h}`),Lr("Firestore",!0)),c.host!==rd&&c.host!==h&&Ga("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let f=Object.assign(Object.assign({},c),{host:h,ssl:o,emulatorOptions:r});if(!ke(f,l)&&(n._setSettings(f),r.mockUserToken)){let y,T;if(typeof r.mockUserToken=="string")y=r.mockUserToken,T=se.MOCK_USER;else{y=du(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);let b=r.mockUserToken.sub||r.mockUserToken.user_id;if(!b)throw new N(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");T=new se(b)}n._authCredentials=new No(new Ri(y,T))}}var Ba=class n{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new n(this.firestore,e,this._query)}},bt=class n{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new qa(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new n(this.firestore,e,this._key)}toJSON(){return{type:n._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(dr(t,n._jsonSchema))return new n(e,r||null,new M(de.fromString(t.referencePath)))}};bt._jsonSchemaVersion="firestore/documentReference/1.0",bt._jsonSchema={type:Z("string",bt._jsonSchemaVersion),referencePath:Z("string")};var qa=class n extends Ba{constructor(e,t,r){super(e,t,Rg(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new bt(this.firestore,null,new M(e))}withConverter(e){return new n(this.firestore,e,this._path)}};var uh="AsyncQueue",Gi=class{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Na(this,"async_queue_retry"),this.oc=()=>{let r=ko();r&&V(uh,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;let t=ko();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;let t=ko();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});let t=new Tt;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!fh(e))throw e;V(uh,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){let t=this._c.then(()=>(this.nc=!0,e().catch(r=>{throw this.tc=r,this.nc=!1,Ki("INTERNAL UNHANDLED ERROR: ",lh(r)),r}).then(r=>(this.nc=!1,r))));return this._c=t,t}enqueueAfterDelay(e,t,r){this.ac(),this.sc.indexOf(e)>-1&&(t=0);let s=Ma.createAndSchedule(this,e,t,r,o=>this.lc(o));return this.ec.push(s),s}ac(){this.tc&&U(47125,{hc:lh(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(let t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(let t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){let t=this.ec.indexOf(e);this.ec.splice(t,1)}};function lh(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}var ja=class extends zi{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new Gi,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new Gi(e),this._firestoreClient=void 0,await e}}};function id(n,e){let t=typeof n=="object"?n:Ur(),r=typeof n=="string"?n:e||Vi,s=Pn(t,"firestore").getImmediate({identifier:r});if(!s._initialized){let o=hu("firestore");o&&c_(s,...o)}return s}var er=class n{constructor(e){this._byteString=e}static fromBase64String(e){try{return new n(Ke.fromBase64String(e))}catch(t){throw new N(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new n(Ke.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:n._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(dr(e,n._jsonSchema))return n.fromBase64String(e.bytes)}};er._jsonSchemaVersion="firestore/bytes/1.0",er._jsonSchema={type:Z("string",er._jsonSchemaVersion),bytes:Z("string")};var $i=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Pe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};var tr=class n{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return q(this._lat,e._lat)||q(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:n._jsonSchemaVersion}}static fromJSON(e){if(dr(e,n._jsonSchema))return new n(e.latitude,e.longitude)}};tr._jsonSchemaVersion="firestore/geoPoint/1.0",tr._jsonSchema={type:Z("string",tr._jsonSchemaVersion),latitude:Z("number"),longitude:Z("number")};var nr=class n{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,e._values)}toJSON(){return{type:n._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(dr(e,n._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new n(e.vectorValues);throw new N(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}};nr._jsonSchemaVersion="firestore/vectorValue/1.0",nr._jsonSchema={type:Z("string",nr._jsonSchemaVersion),vectorValues:Z("object")};var u_=new RegExp("[~\\*/\\[\\]]");function l_(n,e,t){if(e.search(u_)>=0)throw hh(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new $i(...e.split("."))._internalPath}catch{throw hh(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function hh(n,e,t,r,s){let o=r&&!r.isEmpty(),c=s!==void 0,l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let h="";return(o||c)&&(h+=" (found",o&&(h+=` in field ${r}`),c&&(h+=` in document ${s}`),h+=")"),new N(P.INVALID_ARGUMENT,l+n+h)}var Wi=class{constructor(e,t,r,s,o){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new bt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new za(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let t=this._document.data.field(sd("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},za=class extends Wi{data(){return super.data()}};function sd(n,e){return typeof e=="string"?l_(n,e):e instanceof $i?e._internalPath:e._delegate._internalPath}var qt=class{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}},jt=class n extends Wi{constructor(e,t,r,s,o,c){super(e,t,r,s,c),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new zt(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let r=this._document.data.field(sd("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e=this._document,t={};return t.type=n._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}};jt._jsonSchemaVersion="firestore/documentSnapshot/1.0",jt._jsonSchema={type:Z("string",jt._jsonSchemaVersion),bundleSource:Z("string","DocumentSnapshot"),bundleName:Z("string"),bundle:Z("string")};var zt=class extends jt{data(e={}){return super.data(e)}},rr=class n{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new qt(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){let e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new zt(this._firestore,this._userDataWriter,r.key,r,new qt(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let c=0;return s._snapshot.docChanges.map(l=>{let h=new zt(s._firestore,s._userDataWriter,l.doc.key,l.doc,new qt(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:h,oldIndex:-1,newIndex:c++}})}{let c=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>o||l.type!==3).map(l=>{let h=new zt(s._firestore,s._userDataWriter,l.doc.key,l.doc,new qt(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter),f=-1,y=-1;return l.type!==0&&(f=c.indexOf(l.doc.key),c=c.delete(l.doc.key)),l.type!==1&&(c=c.add(l.doc),y=c.indexOf(l.doc.key)),{type:h_(l.type),doc:h,oldIndex:f,newIndex:y}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e={};e.type=n._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Mo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;let t=[],r=[],s=[];return this.docs.forEach(o=>{o._document!==null&&(t.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}};function h_(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return U(61501,{type:n})}}rr._jsonSchemaVersion="firestore/querySnapshot/1.0",rr._jsonSchema={type:Z("string",rr._jsonSchemaVersion),bundleSource:Z("string","QuerySnapshot"),bundleName:Z("string"),bundle:Z("string")};(function(e,t=!0){(function(s){rn=s})(nt),tt(new Ee("firestore",(r,{instanceIdentifier:s,options:o})=>{let c=r.getProvider("app").getImmediate(),l=new ja(new Oo(r.getProvider("auth-internal")),new Lo(c,r.getProvider("app-check-internal")),function(f,y){if(!Object.prototype.hasOwnProperty.apply(f.options,["projectId"]))throw new N(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new jo(f.options.projectId,y)}(c,s),c);return o=Object.assign({useFetchStreams:t},o),l._setSettings(o),l},"PUBLIC").setMultipleInstances(!0)),Se(Ml,Fl,e),Se(Ml,Fl,"esm2017")})();var d_=iu,Hi;zs().length?Hi=zs()[0]:Hi=js(d_);var ec=Eo(Hi),Lv=id(Hi);function od(){try{vo(ec,async n=>{try{if(n){let e=await n.getIdToken();await chrome.storage?.local.set?.({"desainr.idToken":e})}else try{await chrome.storage?.local.remove?.(["desainr.idToken"])}catch{}}catch{}})}catch{}}async function Qi(n){try{let e=ec.currentUser;if(!e)return;let t=await e.getIdToken(!!n);await chrome.storage?.local.set?.({"desainr.idToken":t})}catch{}}var fr=null,tc=0;async function f_(){return await new Promise(n=>{try{chrome.storage?.local.get(["DESAINR_BASE_URL"],e=>{n(e&&e.DESAINR_BASE_URL||null)})}catch{n(null)}})}async function p_(n){try{await chrome.storage?.local.set({DESAINR_BASE_URL:n})}catch{}}async function m_(n){try{let e=await fetch(`${n}/api/extension/rewrite`,{method:"OPTIONS",headers:{"Content-Type":"application/json"}});return e.ok||e.status===204}catch{return!1}}async function g_(){let n=Date.now();if(fr&&n-tc<6e4)return fr;let e=[],t=await f_();t&&e.push(t),Dr&&e.push(Dr);let r=[...e],s=new Set;for(let o of r)if(!(!o||s.has(o))&&(s.add(o),await m_(o)))return fr=o,tc=n,await p_(o),o;return fr=e[0]||Dr,tc=n,fr}async function __(n){try{return await chrome.scripting.executeScript({target:{tabId:n},files:["contentScript.js"]}),!0}catch(e){return console.warn("[DesAInR] Failed to inject contentScript.js:",e),!1}}async function nc(n,e){return await new Promise(s=>{try{chrome.tabs.sendMessage(n,e,()=>{if(chrome.runtime.lastError?.message)return s(!1);s(!0)})}catch{s(!1)}})?!0:await __(n)?await new Promise(s=>{try{chrome.tabs.sendMessage(n,e,()=>{let o=chrome.runtime.lastError?.message;s(!o)})}catch{s(!1)}}):!1}chrome.runtime.onInstalled.addListener(()=>{chrome.contextMenus.create({id:"desainr-refine",title:"DesAInR: Refine Selection",contexts:["selection"]}),chrome.contextMenus.create({id:"desainr-translate",title:"DesAInR: Translate Selection",contexts:["selection"]}),chrome.contextMenus.create({id:"desainr-save-memo",title:"DesAInR: Save to Memo",contexts:["selection"]}),chrome.contextMenus.create({id:"desainr-analyze",title:"DesAInR: Analyze Page",contexts:["page"]}),chrome.contextMenus.create({id:"desainr-translate-page",title:"DesAInR: Translate Page",contexts:["page"]}),chrome.contextMenus.create({id:"desainr-toggle-parallel",title:"DesAInR: Toggle Parallel Translate",contexts:["page"]}),chrome.alarms.create("desainr_refresh_token",{periodInMinutes:45})});od();setTimeout(()=>{Qi(!0).catch(()=>{})},5e3);chrome.runtime.onStartup.addListener(()=>{chrome.alarms.create("desainr_refresh_token",{periodInMinutes:45}),Qi(!0).catch(()=>{})});chrome.alarms.onAlarm.addListener(n=>{n.name==="desainr_refresh_token"&&Qi(!0).catch(()=>{})});chrome.contextMenus.onClicked.addListener((n,e)=>{e?.id&&nc(e.id,{type:"CONTEXT_MENU",id:n.menuItemId,info:n}).then(t=>{t||console.warn("[DesAInR] Could not deliver CONTEXT_MENU message (no receiver).")})});chrome.commands.onCommand.addListener(n=>{n==="toggle-overlay"&&chrome.tabs.query({active:!0,currentWindow:!0},e=>{let t=e[0];t?.id&&nc(t.id,{type:"TOGGLE_OVERLAY"}).then(r=>{r||console.warn("[DesAInR] Could not deliver TOGGLE_OVERLAY message (no receiver).")})})});chrome.runtime.onMessage.addListener((n,e,t)=>{if(n?.type==="API_CALL")return(async()=>{try{let s=`${await g_()}/api/extension/${n.path}`,o=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n.token}`},body:JSON.stringify(n.body??{})}),c,l;try{c=await o.json()}catch{try{l=await o.text()}catch{}}if(!o.ok&&(!c||typeof c!="object")){t({ok:!1,status:o.status,error:l||"HTTP error"});return}t({ok:o.ok,status:o.status,json:c??{}})}catch(r){t({ok:!1,status:0,error:r?.message||String(r)})}})(),!0;if(n?.type==="SAVE_PINNED_ACTIONS")return(async()=>{try{let r=Array.isArray(n.actions)?n.actions:[];await chrome.storage?.sync?.set({"desainr.pinnedActions":r});try{chrome.tabs.query({},s=>{for(let o of s)o?.id&&nc(o.id,{type:"SAVE_PINNED_ACTIONS",actions:r}).catch(()=>{})})}catch{}t({ok:!0})}catch(r){t({ok:!1,status:0,error:r?.message||String(r)})}})(),!0});})();
/*! Bundled license information:

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-35c79a8a.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law | agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
