var tN=Object.defineProperty;var nN=(hi,Bn,As)=>Bn in hi?tN(hi,Bn,{enumerable:!0,configurable:!0,writable:!0,value:As}):hi[Bn]=As;var ua=(hi,Bn,As)=>nN(hi,typeof Bn!="symbol"?Bn+"":Bn,As);(function(){"use strict";var iE,sE;const hi="modulepreload",Bn=function(t){return"/"+t},As={},ue=function(e,n,r){let i=Promise.resolve();function s(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return i.then(o=>{for(const l of o||[])l.status==="rejected"&&s(l.reason);return e().catch(s)})},Zu="desainr-overlay-root",ec=document.getElementById(Zu);if(ec)try{ec.style.display="none",ec.textContent=""}catch{}function Dr(){let t=document.getElementById(Zu);return t||(t=document.createElement("div"),t.id=Zu,Object.assign(t.style,{position:"fixed",top:"20px",right:"20px",zIndex:999999,background:"white",color:"#111",border:"1px solid #ddd",borderRadius:"8px",padding:"8px 12px",boxShadow:"0 6px 20px rgba(0,0,0,0.15)",display:"none",maxWidth:"420px",fontFamily:"Segoe UI, Arial, sans-serif"}),document.documentElement.appendChild(t)),t}function s1(t){const e=Dr();e.textContent=t,e.style.display="block"}function $n(){const t=Dr();t.style.display="none"}function tc(t,e,n=6e3){const r=document.createElement("button");r.textContent="Undo",Object.assign(r.style,{marginLeft:"8px",padding:"4px 8px",border:"1px solid #ccc",borderRadius:"6px",cursor:"pointer"});const i=()=>{try{const s=e();t.textContent=s?"Undone ✓":"Undo failed"}catch{t.textContent="Undo failed"}finally{r.remove(),setTimeout(()=>$n(),800)}};r.addEventListener("click",i,{once:!0}),t.appendChild(r),setTimeout(()=>{try{r.remove()}catch{}},n)}function o1(t,e,n=12e3){const r=document.createElement("button");r.textContent="Copy",Object.assign(r.style,{marginLeft:"8px",padding:"4px 8px",border:"1px solid #ccc",borderRadius:"6px",cursor:"pointer"});const i=async()=>{try{await navigator.clipboard.writeText(e),t.textContent="Copied ✓"}catch{t.textContent="Copy failed"}finally{r.remove(),setTimeout(()=>$n(),800)}};r.addEventListener("click",i,{once:!0}),t.appendChild(r),setTimeout(()=>{try{r.remove()}catch{}},n)}function ca(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function a1(t,e){const n=ca(String(e.summary||"Analysis complete")),r=Array.isArray(e.keyPoints)?e.keyPoints:[],i=Array.isArray(e.links)?e.links:[],s=r.length?`<ul style="margin:6px 0 8px 18px; padding:0;">${r.map(u=>`<li style="margin:2px 0;">${ca(u)}</li>`).join("")}</ul>`:"",o=i.length?`<div style="margin-top:6px; max-height:160px; overflow:auto;"><div style="font-weight:600; margin-bottom:4px;">Top links</div>${i.slice(0,10).map(u=>`<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><a href="${ca(u)}" target="_blank" rel="noopener noreferrer">${ca(u)}</a></div>`).join("")}</div>`:"";t.innerHTML=`<div style="font-size:13px; line-height:1.35;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-weight:700;">Analysis</div>
        <button id="desainr-close-overlay" style="border:1px solid #ddd; border-radius:6px; padding:2px 6px; background:#f7f7f7; cursor:pointer;">Close</button>
      </div>
      <div style="margin-top:6px;">${n}</div>
      ${s}
      ${o}
    </div>`;const l=t.querySelector("#desainr-close-overlay");l&&(l.onclick=()=>{t.style.display="none"})}let ha=null,Ut=null;async function l1(){if(Ut){try{Ut.detach()}catch{}Ut=null,ha=null;return}const t=document.createElement("div");t.id="desainr-overlay-react-root",Object.assign(t.style,{position:"fixed",top:"20px",right:"20px",zIndex:1e6}),document.documentElement.appendChild(t);try{Ut=(await ue(()=>Promise.resolve().then(()=>$I),void 0)).mountOverlay(t,()=>{try{Ut==null||Ut.detach()}catch{}Ut=null,ha=null}),ha=t}catch(e){const n=Dr();n.style.display="block",n.textContent=`Overlay failed: ${(e==null?void 0:e.message)||e}`,setTimeout(()=>$n(),1500)}}let We=null,zt=null,da="",oe=null,fa=0,Oe=["refine","translate","rephrase","summarize"];(sE=(iE=chrome.storage)==null?void 0:iE.sync)==null||sE.get(["desainr.pinnedActions"],t=>{t&&t["desainr.pinnedActions"]&&(Oe=t["desainr.pinnedActions"])});function di(t){var n;const e=da||((n=window.getSelection())==null?void 0:n.toString())||"";e.trim()&&t(e)}const nc="desainr.customActions";let Hn={};async function u1(){var t,e,n;try{const r=await((n=(e=(t=chrome.storage)==null?void 0:t.sync)==null?void 0:e.get)==null?void 0:n.call(e,[nc]).catch(()=>({}))),i=r&&r[nc]||[],s={};if(Array.isArray(i))for(const o of i)o&&typeof o.id=="string"&&o.title&&o.instruction&&(s[String(o.id)]={title:String(o.title),instruction:String(o.instruction)});return s}catch{return{}}}async function mp(t){var n,r,i;const e=Object.entries(t).map(([s,o])=>({id:s,title:o.title,instruction:o.instruction}));try{await((i=(r=(n=chrome.storage)==null?void 0:n.sync)==null?void 0:r.set)==null?void 0:i.call(r,{[nc]:e}))}catch{}}function gp(){try{We&&(We.remove(),We=null,zt=null,ma())}catch{}}async function c1(){Hn=await u1();try{const{firebaseAuth:t,firebaseDb:e}=await ue(async()=>{const{firebaseAuth:m,firebaseDb:p}=await Promise.resolve().then(()=>$w);return{firebaseAuth:m,firebaseDb:p}},void 0),n=t.currentUser;if(!n)return;const{getDocs:r,collection:i,orderBy:s,query:o}=await ue(async()=>{const{getDocs:m,collection:p,orderBy:k,query:R}=await Promise.resolve().then(()=>jw);return{getDocs:m,collection:p,orderBy:k,query:R}},void 0),l=i(e,"users",n.uid,"customActions"),u=o(l,s("createdAt","desc")),h=await r(u),f={};h.forEach(m=>{const p=m.data();if(p&&p.name&&p.instruction){const k=`custom:${m.id}`;f[k]={title:String(p.name),instruction:String(p.instruction)}}}),Hn=f,await mp(Hn),gp()}catch{}}c1();let fi=null,pa=null;function h1(){if(fi)return fi;const t=document.createElement("div");t.id="desainr-result-popup",Object.assign(t.style,{position:"fixed",zIndex:1e6,top:"0px",left:"0px",display:"none"}),pa=t.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=`
      :host { all: initial; }
      .popup { 
        min-width: 420px; width: 580px; max-width: 90vw;
        min-height: 300px; height: 460px; max-height: 80vh;
        background: #fff; color: #111; 
        border: 1px solid #e1e5e9; border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        resize: both; overflow: auto;
        backdrop-filter: blur(10px);
        animation: popupSlideIn 0.25s cubic-bezier(0.2, 0.8, 0.3, 1);
        transition: width 0.15s ease, height 0.15s ease, box-shadow 0.2s ease, transform 0.1s ease;
        position: relative;
      }
      .popup:hover { 
        box-shadow: 0 24px 70px rgba(0,0,0,0.18), 0 10px 25px rgba(0,0,0,0.1); 
        transform: translateY(-1px);
      }
      @keyframes popupSlideIn {
        from { opacity: 0; transform: translateY(8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .resize-handle { 
        position: absolute; bottom: 0; right: 0; width: 16px; height: 16px;
        background: linear-gradient(-45deg, transparent 30%, #cdd1d5 30%, #cdd1d5 40%, transparent 40%, transparent 60%, #cdd1d5 60%, #cdd1d5 70%, transparent 70%);
        cursor: nw-resize; border-radius: 0 0 16px 0;
      }
      /* Responsive grid layout */
      .body { padding: 12px 16px 8px; font-size: 13.5px; line-height: 1.5; flex: 1; overflow: auto; }
      .cols { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 16px; 
        align-items: start;
        min-height: 200px;
      }
      @media (max-width: 600px) {
        .cols { grid-template-columns: 1fr; gap: 12px; }
      }
      .orig, .res { 
        min-height: 120px; border-radius: 12px; padding: 12px; 
        white-space: pre-wrap; font-size: 13px; line-height: 1.6;
        transition: all 0.2s ease;
      }
      .orig { 
        color: #4a5568; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); 
        border: 1px solid #e2e8f0;
      }
      .res { 
        background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%); 
        border: 1px solid #e1e7ed;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .orig:hover, .res:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
      .col-title { 
        font-size: 11px; color: #718096; margin: 0 0 8px 4px; 
        font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
      }
      .ftr { 
        display: flex; align-items: center; justify-content: space-between; 
        gap: 12px; padding: 12px 16px; 
        border-top: 1px solid #f0f4f7; background: #fafbfc;
        border-radius: 0 0 16px 16px;
      }
      .ftr-left { font-size: 12px; color: #718096; font-weight: 500; }
      .btns { display: flex; gap: 8px; }
      button { 
        border: 1px solid #e2e8f0; border-radius: 8px; 
        padding: 6px 12px; background: #ffffff; cursor: pointer; 
        font-size: 12px; font-weight: 500; color: #4a5568;
        transition: all 0.15s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      }
      button:hover { 
        background: #f7fafc; border-color: #cbd5e0; 
        transform: translateY(-0.5px); box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      }
      button.primary { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: #fff; border-color: #667eea;
      }
      button.primary:hover { 
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        border-color: #5a6fd8;
      }
      
      /* Modern scrollbar styles */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
        border-radius: 10px;
        transition: all 0.3s ease;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
      }
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
      
      /* Firefox scrollbar */
      .orig, .res, .body {
        scrollbar-width: thin;
        scrollbar-color: rgba(102, 126, 234, 0.2) transparent;
      }
      
      /* Add smooth scrolling */
      .orig, .res {
        scroll-behavior: smooth;
        overflow-y: auto;
      }
    `,pa.appendChild(e);const n=document.createElement("div");return n.className="popup",n.innerHTML=`
      <div class="body">
        <div class="cols">
          <div>
            <div class="col-title">Original</div>
            <div class="orig" id="orig"></div>
          </div>
          <div>
            <div class="col-title" id="resTitle">Result</div>
            <div class="res" id="res"></div>
          </div>
        </div>
      </div>
      <div class="ftr">
        <div class="ftr-left" id="footerTitle">Result</div>
        <div class="btns">
          <button id="regen" title="Regenerate">↻</button>
          <button id="copy" title="Copy">Copy</button>
          <button id="cancel" title="Cancel">Cancel</button>
          <button id="replace" class="primary" title="Replace">Replace</button>
        </div>
      </div>
      <div class="resize-handle" title="Drag to resize"></div>`,pa.appendChild(n),document.documentElement.appendChild(t),fi=t,t}async function ce(t,e,n,r){const i=h1(),s=pa,o={textContent:""},l=s.getElementById("orig"),u=s.getElementById("res"),h=s.getElementById("resTitle"),f=s.getElementById("footerTitle"),m=s.getElementById("cancel"),p=s.getElementById("copy"),k=s.getElementById("replace"),R=s.getElementById("regen"),x=s.querySelector(".popup");s.querySelector(".body");const P=t;f&&(f.textContent=P),o.textContent=P,h&&(h.textContent=t==="Translate"?"Translated":"Result"),l.textContent=e,u.textContent=n;const w=()=>{if(!x)return;const v=window.innerWidth,E=window.innerHeight,A=420,C=300,I=Math.floor(v*.9),Ae=Math.floor(E*.8);x.style.maxWidth=`${I}px`,x.style.maxHeight=`${Ae}px`,x.style.width="auto",x.style.height="auto";let st=Math.min(I,Math.max(A,Math.ceil(x.scrollWidth))),he=Math.min(Ae,Math.max(C,Math.ceil(x.scrollHeight)));if(v>=1200&&he<Math.floor(E*.35)){const Y=Math.max(A,Math.min(I,Math.ceil(he*1.6)));Y<st&&(st=Y)}x.style.width=`${st}px`,x.style.height=`${he}px`;try{M()}catch{}},_=()=>requestAnimationFrame(w),S=new MutationObserver(()=>_());try{S.observe(l,{childList:!0,subtree:!0,characterData:!0}),S.observe(u,{childList:!0,subtree:!0,characterData:!0})}catch{}const D=()=>_();try{window.addEventListener("resize",D,{passive:!0})}catch{}function b(){const v=(he,Y=!1)=>Y?he.split(new RegExp("(?<=[।।.!?])\\s*")).filter(U=>U.trim().length>0).map(U=>U.trim()):he.split(new RegExp("(?<=[.!?])\\s+")).filter(U=>U.trim().length>0).map(U=>U.trim()),E=v(e,!1),A=v(n,!0);l.innerHTML="",u.innerHTML="";let C=null;const I=(he,Y,U)=>{const H=document.createElement("span");return H.textContent=he,H.style.cssText=`
          cursor: pointer; 
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline;
          padding: 0;
          border-radius: 0;
        `,H.dataset.sentIdx=String(Y),H.className="sentence-span",U.appendChild(H),(Y<E.length-1||Y<A.length-1)&&U.appendChild(document.createTextNode(" ")),H};E.forEach((he,Y)=>{I(he,Y,l)}),A.forEach((he,Y)=>{Y<E.length&&I(he,Y,u)});const Ae=(he,Y)=>{s.querySelectorAll(`span[data-sent-idx="${he}"]`).forEach(H=>{const q=H;Y?(q.style.background="linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.1) 100%)",q.style.borderRadius="6px",q.style.padding="3px 6px",q.style.boxShadow="0 2px 4px rgba(99,102,241,0.1)",q.style.transform="scale(1.02)"):(q.style.background="",q.style.borderRadius="",q.style.padding="0",q.style.boxShadow="",q.style.transform="")})};s.querySelectorAll(".sentence-span").forEach(he=>{const Y=he;Y.addEventListener("mouseenter",()=>{const U=Y.dataset.sentIdx;C!==U&&(C&&Ae(C,!1),Ae(U,!0),C=U)}),Y.addEventListener("click",()=>{const U=Y.dataset.sentIdx,H=E[parseInt(U)],q=A[parseInt(U)];H&&q&&(Y.style.transform="scale(0.98)",setTimeout(()=>{Y.style.transform="scale(1.02)"},100))})}),[l,u].forEach(he=>{he.addEventListener("mouseleave",()=>{C&&(Ae(C,!1),C=null)})})}if(t==="Translate")try{b()}catch{}_();function M(){let v=0,E=0;const A=10,C=r||new DOMRect(window.innerWidth/2-200,80,400,0),I=fi.getBoundingClientRect();v=Math.min(Math.max(A,C.left),window.innerWidth-I.width-A),E=Math.min(Math.max(A,C.top+C.height+A),window.innerHeight-I.height-A),i.style.left=`${Math.round(v)}px`,i.style.top=`${Math.round(E)}px`}i.style.display="block",requestAnimationFrame(()=>M());const T=v=>{var E;try{(((E=v.composedPath)==null?void 0:E.call(v))||[]).includes(i)||y()}catch{i.contains(v.target)||y()}};function y(){i.style.display="none";try{document.removeEventListener("pointerdown",T,!0)}catch{}try{window.removeEventListener("resize",D)}catch{}try{S.disconnect()}catch{}}try{document.addEventListener("pointerdown",T,!0)}catch{}m.onclick=()=>y(),p.onclick=async()=>{try{await navigator.clipboard.writeText(n)}catch{}},k.onclick=async()=>{const{applyReplacementOrCopyWithUndo:v}=await ue(async()=>{const{applyReplacementOrCopyWithUndo:I}=await Promise.resolve().then(()=>qw);return{applyReplacementOrCopyWithUndo:I}},void 0),{outcome:E,undo:A}=await v(n),C=Dr();E==="replaced"?(C.textContent="Replaced ✓",A&&tc(C,A)):E==="copied"?(C.textContent="Copied ✓",o1(C,n)):C.textContent="Done",C.style.display="block",setTimeout(()=>$n(),900),y()},R&&(R.style.display=t==="Translate"?"":"none"),R.onclick=async()=>{var v,E,A;try{if(o.textContent==="Translate"){u.textContent="Working…";const C=await((A=(v=chrome.storage)==null?void 0:(E=v.local).get)==null?void 0:A.call(E,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),I=(C==null?void 0:C["desainr.settings.targetLang"])||(await ue(async()=>{const{DEFAULT_TARGET_LANG:le}=await Promise.resolve().then(()=>ps);return{DEFAULT_TARGET_LANG:le}},void 0)).DEFAULT_TARGET_LANG,Ae=C==null?void 0:C["desainr.settings.modelId"],st=(C==null?void 0:C["desainr.settings.thinkingMode"])||"none",{translateChunks:he}=await ue(async()=>{const{translateChunks:le}=await Promise.resolve().then(()=>Ft);return{translateChunks:le}},void 0),{ok:Y,status:U,json:H,error:q}=await he({selection:e,url:location.href,targetLang:I,modelId:Ae,thinkingMode:st});if(Y&&(H!=null&&H.result))u.textContent=H.result,_();else{const le=(H==null?void 0:H.error)||q||"unknown";u.textContent=`Failed (${U}): ${le}`,_()}}else{const C=Dr();C.textContent="Regenerate is available for Translate results only.",C.style.display="block",setTimeout(()=>$n(),1e3)}}catch(C){u.textContent=`Error: ${(C==null?void 0:C.message)||C}`,_()}}}function ma(){if(We)return We;const t=document.createElement("div");t.id="desainr-mini-toolbar",Object.assign(t.style,{position:"fixed",zIndex:"999999",top:"0px",left:"0px",display:"none"}),zt=t.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=`
      .wrap { 
        display: flex; align-items: center; gap: 4px; padding: 4px; 
        background: #ffffff; border: 1px solid rgba(0,0,0,0.08); 
        border-radius: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        backdrop-filter: blur(12px); background: rgba(255,255,255,0.95);
      }
      .btn-wrap {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
      }
      .btn { 
        position: relative; border: none; background: transparent; 
        width: 36px; height: 36px; border-radius: 50%; 
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: all 0.2s ease; font-size: 12px;
      }
      .btn:hover { background: rgba(99,102,241,0.1); transform: scale(1.05); }
      .btn:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
      .btn.active { background: rgba(99,102,241,0.15); }
      .btn svg.ico { 
        color: #4a5568; 
        transition: all 0.2s ease;
      }
      .btn:hover svg.ico { 
        color: #6366f1; 
        transform: scale(1.1);
      }
      .btn span:not(.ico) { display: none; }
      /* toolbar pin button removed; pin/unpin controls live only in More menu */
      
      /* Monica-style tooltip */
      .btn::after {
        content: attr(title); position: absolute; bottom: -28px; left: 50%;
        transform: translateX(-50%) scale(0.8); opacity: 0;
        background: rgba(0,0,0,0.8); color: white; padding: 4px 8px;
        border-radius: 6px; font-size: 11px; white-space: nowrap;
        pointer-events: none; transition: all 0.2s ease;
      }
      .btn:hover::after { opacity: 1; transform: translateX(-50%) scale(1); }
      
      .divider { width: 1px; height: 20px; background: rgba(0,0,0,0.08); margin: 0 4px; }
      .more { position: relative; }
      .menu { 
        position: absolute; top: 44px; right: 0; 
        background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
        border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; 
        box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
        padding: 4px; min-width: 220px; display: none;
        animation: menuSlide 0.2s ease;
      }
      @keyframes menuSlide {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .menu.open { display: block; }
      .mi { 
        display: flex; align-items: center; gap: 10px; 
        padding: 8px 12px; border-radius: 8px; cursor: pointer;
        transition: all 0.15s ease; font-size: 13px; color: #4a5568;
      }
      .mi:hover { background: rgba(99,102,241,0.08); color: #6366f1; transform: translateX(2px); }
      .mi:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; background: rgba(99,102,241,0.08); }
      .mi .mi-icon { 
        width: 16px; height: 16px; opacity: 0.6; margin-right: 2px;
        transition: all 0.2s ease;
      }
      .mi:hover .mi-icon { opacity: 1; color: #6366f1; }
      .mi .mi-pin {
        margin-left: auto; border: none; background: transparent; cursor: pointer;
        width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      }
      .mi .mi-pin:hover { background: rgba(99,102,241,0.08); }
      .mi .mi-pin:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
      .mi .mi-pin svg { width: 16px; height: 16px; color: #6b7280; }
      .mi .mi-pin.pinned svg { color: #6366f1; }
    `;let n={refine:{title:"Refine",svg:'<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/></svg>'},translate:{title:"Translate",svg:'<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"/></svg>'},rephrase:{title:"Rephrase",svg:'<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg>'},summarize:{title:"Summarize",svg:'<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>'},"add-details":{title:"Add Details",svg:'<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>'},"more-informative":{title:"More Informative",svg:'<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/></svg>'},explain:{title:"Explain",svg:'<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/></svg>'},simplify:{title:"Simplify",svg:'<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"/></svg>'}};const r='<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 7.5 12 3l2.187 4.5L18.75 9 14.25 11.25 12 15.75 9.75 11.25 5.25 9l4.563-1.5Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 18l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/></svg>';for(const[P,w]of Object.entries(Hn))n[P]={title:w.title,svg:r};const i=document.createElement("div");i.className="wrap",i.setAttribute("role","toolbar"),i.setAttribute("aria-label","DesAInR toolbar");const s='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"/></svg>',o='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd"/></svg>';let l="";Oe.forEach(P=>{const w=n[P];w&&(l+=`
          <div class="btn-wrap" data-action-id="${P}">
            <button id="btn-${P}" class="btn" title="${w.title}" aria-label="${w.title}" tabindex="0">${w.svg}</button>
          </div>`)});const h=Object.keys(n).map(P=>{const w=n[P];if(!w)return"";const _=w.svg.replace('class="ico"','class="mi-icon"').replace('width="20"','width="16"').replace('height="20"','height="16"'),S=Oe.includes(P),D=`<button class="mi-pin ${S?"pinned":""}" data-action-id="${P}" title="${S?"Unpin from toolbar":"Pin to toolbar"}" aria-label="${S?"Unpin from toolbar":"Pin to toolbar"}: ${w.title}" aria-pressed="${S?"true":"false"}" tabindex="0">${S?o:s}</button>`;return`<div class="mi" data-action-id="${P}" title="${w.title}" role="menuitem" tabindex="-1">${_}${w.title}${D}</div>`}).join("");i.innerHTML=l+'<div class="divider"></div><div class="more"><button id="btn-more" class="btn" title="More Actions" aria-label="More Actions" aria-haspopup="true" aria-expanded="false" aria-controls="menu" tabindex="0"><svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg></button><div id="menu" class="menu" role="menu" aria-label="All actions">'+h+'<div style="height:4px; border-top: 1px solid rgba(0,0,0,0.06); margin: 4px 8px;"></div><div class="mi" data-act="Analyze" role="menuitem" tabindex="-1"><svg class="mi-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5L12 12m8.25-4.5v9L12 21m0-9L3.75 7.5M12 12v9" /></svg>Analyze</div><div class="mi" data-act="Custom" role="menuitem" tabindex="-1"><svg class="mi-icon" viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>Custom...</div></div></div>',zt.appendChild(e),zt.appendChild(i),document.documentElement.appendChild(t),We=t,i.addEventListener("click",P=>{const w=P.target.closest(".btn-pin");if(!w)return;P.stopPropagation();const _=w.getAttribute("data-action-id")||"";_&&(Oe=Oe.filter(S=>S!==_),chrome.runtime.sendMessage({type:"SAVE_PINNED_ACTIONS",actions:Oe}))}),t.addEventListener("mousedown",()=>{fa=Date.now()+350},!0);async function f(){di(async P=>{var _,S,D;const{rewrite:w}=await ue(async()=>{const{rewrite:b}=await Promise.resolve().then(()=>Ft);return{rewrite:b}},void 0);try{await ce("Rewrite",P,"Working…",oe||void 0);const b=await((D=(_=chrome.storage)==null?void 0:(S=_.local).get)==null?void 0:D.call(S,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),M=b==null?void 0:b["desainr.settings.modelId"],T=(b==null?void 0:b["desainr.settings.thinkingMode"])||"none",{ok:y,status:v,json:E,error:A}=await w({selection:P,url:location.href,task:"clarify",modelId:M,thinkingMode:T});if(y&&(E!=null&&E.result))await ce("Rewrite",P,E.result,oe||void 0);else{const C=(E==null?void 0:E.error)||A||"unknown";await ce("Rewrite",P,`Failed (${v}): ${C}`,oe||void 0)}}catch(b){await ce("Rewrite",P,`Error: ${(b==null?void 0:b.message)||b}`,oe||void 0)}finally{jt()}})}const m=zt.getElementById("btn-more"),p=zt.getElementById("menu");function k(P){if(fa=Date.now()+350,P){p.classList.add("open"),m.setAttribute("aria-expanded","true");const w=p.querySelector(".mi");w&&w.focus()}else p.classList.remove("open"),m.setAttribute("aria-expanded","false"),m.focus()}m.addEventListener("click",()=>{k(!p.classList.contains("open"))}),m.addEventListener("keydown",P=>{(P.key==="Enter"||P.key===" "||P.key==="ArrowDown")&&(P.preventDefault(),k(!0))});async function R(P){di(async w=>{var S,D,b;const{actions:_}=await ue(async()=>{const{actions:M}=await Promise.resolve().then(()=>Ft);return{actions:M}},void 0);try{await ce(P,w,"Working…",oe||void 0);const M=await((b=(S=chrome.storage)==null?void 0:(D=S.local).get)==null?void 0:b.call(D,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),T=M==null?void 0:M["desainr.settings.modelId"],y=(M==null?void 0:M["desainr.settings.thinkingMode"])||"none",{ok:v,status:E,json:A,error:C}=await _({selection:w,clientMessage:w,customInstruction:P,modelId:T,thinkingMode:y});if(v&&(A!=null&&A.result))await ce(P,w,A.result,oe||void 0);else{const I=(A==null?void 0:A.error)||C||"unknown";await ce(P,w,`Failed (${E}): ${I}`,oe||void 0)}}catch(M){await ce(P,w,`Error: ${(M==null?void 0:M.message)||M}`,oe||void 0)}finally{jt()}})}async function x(){di(async P=>{var _,S,D;const{translate:w}=await ue(async()=>{const{translate:b}=await Promise.resolve().then(()=>Ft);return{translate:b}},void 0);try{await ce("Translate",P,"Working…",oe||void 0);const b=await((D=(_=chrome.storage)==null?void 0:(S=_.local).get)==null?void 0:D.call(S,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),M=b==null?void 0:b["desainr.settings.modelId"],T=(b==null?void 0:b["desainr.settings.thinkingMode"])||"none",{ok:y,status:v,json:E,error:A}=await w({text:P,modelId:M,thinkingMode:T});if(y&&(E!=null&&E.result))await ce("Translate",P,E.result,oe||void 0);else{const C=(E==null?void 0:E.error)||A||"unknown";await ce("Translate",P,`Failed (${v}): ${C}`,oe||void 0)}}catch(b){await ce("Translate",P,`Error: ${(b==null?void 0:b.message)||b}`,oe||void 0)}finally{jt()}})}return Oe.forEach(P=>{const w=zt.getElementById(`btn-${P}`);w&&w.addEventListener("click",async()=>{if(P==="refine")await f();else if(P==="translate")await x();else if(P==="rephrase")await R("Rephrase it");else if(P==="summarize")await R("Summarize");else if(P==="add-details")await R("Add details");else if(P==="more-informative")await R("More informative");else if(P==="explain")await R("Explain");else if(P==="simplify")await R("Simplify");else if(P.startsWith("custom:")){const _=Hn[P];_&&await yp(_.title,_.instruction)}})}),i.addEventListener("keydown",P=>{var _;const w=P.target;if(w.classList.contains("btn")&&(P.key==="ArrowRight"||P.key==="ArrowLeft")){P.preventDefault();const S=Array.from(i.querySelectorAll(".btn")),D=S.indexOf(w);if(D>=0){const b=P.key==="ArrowRight"?(D+1)%S.length:(D-1+S.length)%S.length;(_=S[b])==null||_.focus()}}}),p.addEventListener("keydown",P=>{var b,M,T,y,v;const w=Array.from(p.querySelectorAll(".mi")),_=zt.activeElement||document.activeElement,S=(b=_==null?void 0:_.closest)==null?void 0:b.call(_,".mi");let D=S?w.indexOf(S):-1;if(P.key==="Escape"){P.preventDefault(),k(!1);return}P.key==="ArrowDown"?(P.preventDefault(),D=(D+1+w.length)%w.length,(M=w[D])==null||M.focus()):P.key==="ArrowUp"?(P.preventDefault(),D=(D-1+w.length)%w.length,(T=w[D])==null||T.focus()):P.key==="Home"?(P.preventDefault(),(y=w[0])==null||y.focus()):P.key==="End"?(P.preventDefault(),(v=w[w.length-1])==null||v.focus()):(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),S&&S.click())}),p.addEventListener("click",async P=>{var M;fa=Date.now()+350;const w=P.target,_=w.closest(".mi-pin");if(_){P.stopPropagation();const T=_.getAttribute("data-action-id")||"";if(!T)return;if(Oe.includes(T))Oe=Oe.filter(v=>v!==T);else{if(Oe.length>=9){const v=Dr();v.textContent="You can only pin up to 9 actions",v.style.display="block",setTimeout(()=>$n(),1200);return}Oe=[...Oe,T]}chrome.runtime.sendMessage({type:"SAVE_PINNED_ACTIONS",actions:Oe});return}const S=w.closest(".mi");if(!S)return;p.classList.remove("open"),m.setAttribute("aria-expanded","false");const D=S.getAttribute("data-action-id")||"";if(D){di(async()=>{if(D==="refine")await f();else if(D==="translate")await x();else if(D==="rephrase")await R("Rephrase it");else if(D==="summarize")await R("Summarize");else if(D==="add-details")await R("Add details");else if(D==="more-informative")await R("More informative");else if(D==="explain")await R("Explain");else if(D==="simplify")await R("Simplify");else if(D.startsWith("custom:")){const T=Hn[D];T&&await yp(T.title,T.instruction)}jt()});return}const b=S.getAttribute("data-act")||"";if(b){if(b==="Custom…"||b==="Custom"){d1();return}if(b==="Analyze"){const{analyzePage:T}=await ue(async()=>{const{analyzePage:v}=await Promise.resolve().then(()=>Ft);return{analyzePage:v}},void 0),y=da||((M=window.getSelection())==null?void 0:M.toString())||"";try{await ce("Analyze",y,"Working…",oe||void 0);const{ok:v,status:E,json:A,error:C}=await T({url:location.href,title:document.title});if(v)await ce("Analyze",y,(A==null?void 0:A.summary)||"",oe||void 0);else{const I=(A==null?void 0:A.error)||C||"unknown";await ce("Analyze",y,`Failed (${E}): ${I}`,oe||void 0)}}catch(v){await ce("Analyze",y,`Error: ${(v==null?void 0:v.message)||v}`,oe||void 0)}finally{jt()}return}di(async T=>{var v,E,A;const{actions:y}=await ue(async()=>{const{actions:C}=await Promise.resolve().then(()=>Ft);return{actions:C}},void 0);try{await ce(b,T,"Working…",oe||void 0);const C=await((A=(v=chrome.storage)==null?void 0:(E=v.local).get)==null?void 0:A.call(E,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),I=C==null?void 0:C["desainr.settings.modelId"],Ae=(C==null?void 0:C["desainr.settings.thinkingMode"])||"none",{ok:st,status:he,json:Y,error:U}=await y({selection:T,clientMessage:T,customInstruction:b,modelId:I,thinkingMode:Ae});if(st&&(Y!=null&&Y.result))await ce(b,T,Y.result,oe||void 0);else{const H=(Y==null?void 0:Y.error)||U||"unknown";await ce(b,T,`Failed (${he}): ${H}`,oe||void 0)}}catch(C){await ce(b,T,`Error: ${(C==null?void 0:C.message)||C}`,oe||void 0)}finally{jt()}})}}),zt.getElementById("btn-translate").addEventListener("click",async()=>{di(async P=>{var _,S,D;const{translateChunks:w}=await ue(async()=>{const{translateChunks:b}=await Promise.resolve().then(()=>Ft);return{translateChunks:b}},void 0);try{await ce("Translate",P,"Working…",oe||void 0);const b=await((D=(_=chrome.storage)==null?void 0:(S=_.local).get)==null?void 0:D.call(S,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),M=(b==null?void 0:b["desainr.settings.targetLang"])||(await ue(async()=>{const{DEFAULT_TARGET_LANG:I}=await Promise.resolve().then(()=>ps);return{DEFAULT_TARGET_LANG:I}},void 0)).DEFAULT_TARGET_LANG,T=b==null?void 0:b["desainr.settings.modelId"],y=(b==null?void 0:b["desainr.settings.thinkingMode"])||"none",{ok:v,status:E,json:A,error:C}=await w({selection:P,url:location.href,targetLang:M,modelId:T,thinkingMode:y});if(v&&(A!=null&&A.result))await ce("Translate",P,A.result,oe||void 0);else{const I=(A==null?void 0:A.error)||C||"unknown";await ce("Translate",P,`Failed (${E}): ${I}`,oe||void 0)}}catch(b){await ce("Translate",P,`Error: ${(b==null?void 0:b.message)||b}`,oe||void 0)}finally{jt()}})}),t}async function yp(t,e){var i,s,o,l;const{actions:n}=await ue(async()=>{const{actions:u}=await Promise.resolve().then(()=>Ft);return{actions:u}},void 0),r=da||((i=window.getSelection())==null?void 0:i.toString())||"";try{await ce(t,r,"Working…",oe||void 0);const u=await((l=(s=chrome.storage)==null?void 0:(o=s.local).get)==null?void 0:l.call(o,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),h=u==null?void 0:u["desainr.settings.modelId"],f=(u==null?void 0:u["desainr.settings.thinkingMode"])||"none",{ok:m,status:p,json:k,error:R}=await n({selection:r,clientMessage:r,customInstruction:e,modelId:h,thinkingMode:f});if(m&&(k!=null&&k.result))await ce(t,r,k.result,oe||void 0);else{const x=(k==null?void 0:k.error)||R||"unknown";await ce(t,r,`Failed (${p}): ${x}`,oe||void 0)}}catch(u){await ce(t,r,`Error: ${(u==null?void 0:u.message)||u}`,oe||void 0)}finally{}}function d1(){const t=document.createElement("div");t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.style.position="fixed",t.style.inset="0",t.style.zIndex="1000001",t.style.background="rgba(0,0,0,0.35)",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center";const e=document.createElement("div");e.style.width="520px",e.style.maxWidth="92vw",e.style.background="#fff",e.style.border="1px solid #e1e5e9",e.style.borderRadius="16px",e.style.boxShadow="0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)",e.style.padding="16px",e.style.fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",e.innerHTML=`
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px;">
        <div style="font-weight:700; font-size:15px; display:flex; align-items:center; gap:8px;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 7.5 12 3l2.187 4.5L18.75 9 14.25 11.25 12 15.75 9.75 11.25 5.25 9l4.563-1.5Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 18l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/></svg>
          New Custom Action
        </div>
        <button id="ca-close" style="border:1px solid #e2e8f0; border-radius:8px; padding:6px 12px; background:#ffffff; cursor:pointer; font-size:12px; font-weight:500; color:#4a5568; box-shadow:0 1px 3px rgba(0,0,0,0.04);">Close</button>
      </div>
      <label style="display:block; font-size:12px; color:#6b7280; margin:8px 0 4px;">Button name</label>
      <input id="ca-name" type="text" placeholder="e.g., Polite reply" style="width:100%; padding:10px 12px; border:1px solid #e2e8f0; border-radius:12px; font-size:13px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);" />
      <label style="display:block; font-size:12px; color:#6b7280; margin:10px 0 4px;">API prompt / instruction</label>
      <textarea id="ca-instruction" rows="5" placeholder="Describe what to do with the selected text..." style="width:100%; padding:10px 12px; border:1px solid #e2e8f0; border-radius:12px; font-size:13px; resize:vertical; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);"></textarea>
      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
        <button id="ca-save" style="border:1px solid #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#fff; border-radius:8px; padding:6px 12px; cursor:pointer; font-size:12px; font-weight:600;">Save</button>
      </div>
    `,t.appendChild(e),document.documentElement.appendChild(t);const n=()=>{try{t.remove()}catch{}};e.querySelector("#ca-close").onclick=n,t.onclick=s=>{s.target===t&&n()},t.addEventListener("keydown",s=>{var o;s.key==="Escape"&&(s.preventDefault(),n()),s.key==="Enter"&&(s.ctrlKey||s.metaKey)&&(s.preventDefault(),(o=e.querySelector("#ca-save"))==null||o.click())});const r=e.querySelector("#ca-save");r.onclick=async()=>{const s=String(e.querySelector("#ca-name").value||"").trim(),o=String(e.querySelector("#ca-instruction").value||"").trim();if(!s||!o){r.disabled=!1;return}r.disabled=!0;try{let l="";try{const{firebaseAuth:u,firebaseDb:h}=await ue(async()=>{const{firebaseAuth:m,firebaseDb:p}=await Promise.resolve().then(()=>$w);return{firebaseAuth:m,firebaseDb:p}},void 0),f=u.currentUser;if(f){const{addDoc:m,collection:p,serverTimestamp:k}=await ue(async()=>{const{addDoc:x,collection:P,serverTimestamp:w}=await Promise.resolve().then(()=>jw);return{addDoc:x,collection:P,serverTimestamp:w}},void 0);l=`custom:${(await m(p(h,"users",f.uid,"customActions"),{name:s,instruction:o,createdAt:k()})).id}`}}catch{}l||(l=`custom:local-${Date.now()}`),Hn[l]={title:s,instruction:o},await mp(Hn),n(),s1("Custom action saved ✓"),setTimeout(()=>$n(),1e3),gp()}finally{r.disabled=!1}};const i=e.querySelector("#ca-name");setTimeout(()=>i==null?void 0:i.focus(),10)}async function f1(){const e=(await ue(()=>Promise.resolve().then(()=>lx),void 0)).getSelectionInfo();if(!e){jt();return}da=e.text,oe=e.rect;const n=ma();if(!n)return;n.style.display="block";const r=8,i=e.rect;let s=i.left,o=i.top-44;const l=n.getBoundingClientRect(),u=window.innerWidth,h=window.innerHeight;s+l.width+r>u&&(s=Math.max(r,u-l.width-r)),s<r&&(s=r),o<r&&(o=Math.min(h-l.height-r,i.bottom+r)),n.style.left=`${Math.round(s)}px`,n.style.top=`${Math.round(o)}px`}function jt(){fi&&fi.style.display!=="none"||We&&(We.style.display="none")}document.addEventListener("keydown",t=>{if(t.key==="Escape"&&(jt(),Ut)){try{Ut.detach()}catch{}Ut=null,ha=null}}),document.addEventListener("selectionchange",()=>{var e;if(Date.now()<fa)return;(((e=window.getSelection())==null?void 0:e.toString())||"").trim()||jt()}),document.addEventListener("mousedown",t=>{var r;if(!We)return;const e=(r=t.composedPath)==null?void 0:r.call(t);(e?e.includes(We):We.contains(t.target))||jt()},!0),chrome.runtime.onMessage.addListener(t=>{var e,n;(t==null?void 0:t.type)==="TOGGLE_OVERLAY"&&l1(),(t==null?void 0:t.type)==="CONTEXT_MENU"&&p1(t.id,t.info),(t==null?void 0:t.type)==="SAVE_PINNED_ACTIONS"&&(Oe=t.actions,(n=(e=chrome.storage)==null?void 0:e.sync)==null||n.set({"desainr.pinnedActions":Oe}),We&&(We.remove(),We=null,zt=null),ma())}),window.addEventListener("message",t=>{var n,r;const e=t==null?void 0:t.data;if(!(!e||e.source!=="desainr"||e.type!=="SAVE_PINNED_ACTIONS"))try{Oe=Array.isArray(e.actions)?e.actions:[],(r=(n=chrome.storage)==null?void 0:n.sync)==null||r.set({"desainr.pinnedActions":Oe}),We&&(We.remove(),We=null,zt=null),ma();try{chrome.runtime.sendMessage({type:"SAVE_PINNED_ACTIONS",actions:Oe})}catch{}}catch{}},!1),document.addEventListener("mouseup",()=>{f1().catch(()=>{})});async function p1(t,e){var h,f,m;const{rewrite:n,translateChunks:r,analyzePage:i,saveMemo:s}=await ue(async()=>{const{rewrite:p,translateChunks:k,analyzePage:R,saveMemo:x}=await Promise.resolve().then(()=>Ft);return{rewrite:p,translateChunks:k,analyzePage:R,saveMemo:x}},void 0),{DEFAULT_TARGET_LANG:o}=await ue(async()=>{const{DEFAULT_TARGET_LANG:p}=await Promise.resolve().then(()=>ps);return{DEFAULT_TARGET_LANG:p}},void 0),{applyReplacementOrCopyWithUndo:l}=await ue(async()=>{const{applyReplacementOrCopyWithUndo:p}=await Promise.resolve().then(()=>qw);return{applyReplacementOrCopyWithUndo:p}},void 0),u=Dr();u.style.display="block";try{if(t==="desainr-refine"){u.textContent="Refining selection...";const p=((h=window.getSelection())==null?void 0:h.toString())||"",{ok:k,status:R,json:x,error:P}=await n({selection:p,url:location.href,task:"clarify"});if(k&&(x!=null&&x.result)){const{outcome:w,undo:_}=await l(x.result);w==="replaced"?(u.textContent="Refined ✓ (replaced selection)",_&&tc(u,_)):w==="copied"?u.textContent="Refined ✓ (copied)":u.textContent="Refined ✓"}else u.textContent=`Refine failed (${R}): ${P||"unknown"}`}else if(t==="desainr-translate"){u.textContent="Translating selection...";const p=((f=window.getSelection())==null?void 0:f.toString())||"",{ok:k,status:R,json:x,error:P}=await r({selection:p,url:location.href,targetLang:o});if(k&&(x!=null&&x.result)){const{outcome:w,undo:_}=await l(x.result);w==="replaced"?(u.textContent="Translated ✓ (replaced selection)",_&&tc(u,_)):w==="copied"?u.textContent="Translated ✓ (copied)":u.textContent="Translated ✓"}else u.textContent=`Translate failed (${R}): ${P||"unknown"}`}else if(t==="desainr-save-memo"){u.textContent="Saving to memo...";const p=((m=window.getSelection())==null?void 0:m.toString())||"";if(!p)u.textContent="No text selected";else{const k={title:`Selection from ${document.title||location.hostname}`,content:p,url:location.href,type:"selection",metadata:{pageTitle:document.title,timestamp:new Date().toISOString()},tags:["selection","extension"]},{ok:R,json:x,error:P}=await s(k);R&&x?u.textContent=`✓ Saved to memo (ID: ${x.memoId})`:u.textContent=`Save to memo failed: ${P||"unknown"}`}}else if(t==="desainr-analyze"){u.textContent="Analyzing page...";const{ok:p,status:k,json:R,error:x}=await i({url:location.href,title:document.title});p?a1(u,{summary:R==null?void 0:R.summary,keyPoints:R==null?void 0:R.keyPoints,links:R==null?void 0:R.links}):u.textContent=`Analyze failed (${k}): ${x||"unknown"}`}else if(t==="desainr-translate-page"){u.textContent="Translating page...";const{translatePageAll:p}=await ue(async()=>{const{translatePageAll:R}=await Promise.resolve().then(()=>_x);return{translatePageAll:R}},void 0),{DEFAULT_TARGET_LANG:k}=await ue(async()=>{const{DEFAULT_TARGET_LANG:R}=await Promise.resolve().then(()=>ps);return{DEFAULT_TARGET_LANG:R}},void 0);try{const R=await p(k);u.textContent=`Translated page ✓ (${R.translated}/${R.totalNodes} nodes, skipped ${R.skipped})`}catch(R){u.textContent=`Translate page error: ${(R==null?void 0:R.message)||R}`}}else if(t==="desainr-toggle-parallel"){const{isParallelModeEnabled:p,enableParallelMode:k,disableParallelMode:R}=await ue(async()=>{const{isParallelModeEnabled:P,enableParallelMode:w,disableParallelMode:_}=await Promise.resolve().then(()=>Ix);return{isParallelModeEnabled:P,enableParallelMode:w,disableParallelMode:_}},void 0),{DEFAULT_TARGET_LANG:x}=await ue(async()=>{const{DEFAULT_TARGET_LANG:P}=await Promise.resolve().then(()=>ps);return{DEFAULT_TARGET_LANG:P}},void 0);try{p()?(u.textContent="Disabling parallel translate...",R(),u.textContent="Parallel translate OFF"):(u.textContent="Enabling parallel translate...",await k(x),u.textContent="Parallel translate ON")}catch(P){u.textContent=`Parallel toggle error: ${(P==null?void 0:P.message)||P}`}}else u.textContent=`Unknown action: ${t}`}catch(p){u.textContent=`Error: ${(p==null?void 0:p.message)||p}`}finally{setTimeout(()=>{try{$n()}catch{}},800)}}var _p={exports:{}},ga={},vp={exports:{}},Z={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ks=Symbol.for("react.element"),m1=Symbol.for("react.portal"),g1=Symbol.for("react.fragment"),y1=Symbol.for("react.strict_mode"),_1=Symbol.for("react.profiler"),v1=Symbol.for("react.provider"),w1=Symbol.for("react.context"),E1=Symbol.for("react.forward_ref"),T1=Symbol.for("react.suspense"),I1=Symbol.for("react.memo"),S1=Symbol.for("react.lazy"),wp=Symbol.iterator;function A1(t){return t===null||typeof t!="object"?null:(t=wp&&t[wp]||t["@@iterator"],typeof t=="function"?t:null)}var Ep={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Tp=Object.assign,Ip={};function pi(t,e,n){this.props=t,this.context=e,this.refs=Ip,this.updater=n||Ep}pi.prototype.isReactComponent={},pi.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")},pi.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Sp(){}Sp.prototype=pi.prototype;function rc(t,e,n){this.props=t,this.context=e,this.refs=Ip,this.updater=n||Ep}var ic=rc.prototype=new Sp;ic.constructor=rc,Tp(ic,pi.prototype),ic.isPureReactComponent=!0;var Ap=Array.isArray,kp=Object.prototype.hasOwnProperty,sc={current:null},Cp={key:!0,ref:!0,__self:!0,__source:!0};function Rp(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)kp.call(e,r)&&!Cp.hasOwnProperty(r)&&(i[r]=e[r]);var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){for(var u=Array(l),h=0;h<l;h++)u[h]=arguments[h+2];i.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)i[r]===void 0&&(i[r]=l[r]);return{$$typeof:ks,type:t,key:s,ref:o,props:i,_owner:sc.current}}function k1(t,e){return{$$typeof:ks,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function oc(t){return typeof t=="object"&&t!==null&&t.$$typeof===ks}function C1(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Pp=/\/+/g;function ac(t,e){return typeof t=="object"&&t!==null&&t.key!=null?C1(""+t.key):e.toString(36)}function ya(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case ks:case m1:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+ac(o,0):r,Ap(i)?(n="",t!=null&&(n=t.replace(Pp,"$&/")+"/"),ya(i,e,n,"",function(h){return h})):i!=null&&(oc(i)&&(i=k1(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(Pp,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Ap(t))for(var l=0;l<t.length;l++){s=t[l];var u=r+ac(s,l);o+=ya(s,e,n,u,i)}else if(u=A1(t),typeof u=="function")for(t=u.call(t),l=0;!(s=t.next()).done;)s=s.value,u=r+ac(s,l++),o+=ya(s,e,n,u,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function _a(t,e,n){if(t==null)return t;var r=[],i=0;return ya(t,r,"","",function(s){return e.call(n,s,i++)}),r}function R1(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var ut={current:null},va={transition:null},P1={ReactCurrentDispatcher:ut,ReactCurrentBatchConfig:va,ReactCurrentOwner:sc};function xp(){throw Error("act(...) is not supported in production builds of React.")}Z.Children={map:_a,forEach:function(t,e,n){_a(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return _a(t,function(){e++}),e},toArray:function(t){return _a(t,function(e){return e})||[]},only:function(t){if(!oc(t))throw Error("React.Children.only expected to receive a single React element child.");return t}},Z.Component=pi,Z.Fragment=g1,Z.Profiler=_1,Z.PureComponent=rc,Z.StrictMode=y1,Z.Suspense=T1,Z.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=P1,Z.act=xp,Z.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=Tp({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=sc.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)kp.call(e,u)&&!Cp.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var h=0;h<u;h++)l[h]=arguments[h+2];r.children=l}return{$$typeof:ks,type:t.type,key:i,ref:s,props:r,_owner:o}},Z.createContext=function(t){return t={$$typeof:w1,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:v1,_context:t},t.Consumer=t},Z.createElement=Rp,Z.createFactory=function(t){var e=Rp.bind(null,t);return e.type=t,e},Z.createRef=function(){return{current:null}},Z.forwardRef=function(t){return{$$typeof:E1,render:t}},Z.isValidElement=oc,Z.lazy=function(t){return{$$typeof:S1,_payload:{_status:-1,_result:t},_init:R1}},Z.memo=function(t,e){return{$$typeof:I1,type:t,compare:e===void 0?null:e}},Z.startTransition=function(t){var e=va.transition;va.transition={};try{t()}finally{va.transition=e}},Z.unstable_act=xp,Z.useCallback=function(t,e){return ut.current.useCallback(t,e)},Z.useContext=function(t){return ut.current.useContext(t)},Z.useDebugValue=function(){},Z.useDeferredValue=function(t){return ut.current.useDeferredValue(t)},Z.useEffect=function(t,e){return ut.current.useEffect(t,e)},Z.useId=function(){return ut.current.useId()},Z.useImperativeHandle=function(t,e,n){return ut.current.useImperativeHandle(t,e,n)},Z.useInsertionEffect=function(t,e){return ut.current.useInsertionEffect(t,e)},Z.useLayoutEffect=function(t,e){return ut.current.useLayoutEffect(t,e)},Z.useMemo=function(t,e){return ut.current.useMemo(t,e)},Z.useReducer=function(t,e,n){return ut.current.useReducer(t,e,n)},Z.useRef=function(t){return ut.current.useRef(t)},Z.useState=function(t){return ut.current.useState(t)},Z.useSyncExternalStore=function(t,e,n){return ut.current.useSyncExternalStore(t,e,n)},Z.useTransition=function(){return ut.current.useTransition()},Z.version="18.3.1",vp.exports=Z;var wa=vp.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x1=wa,N1=Symbol.for("react.element"),D1=Symbol.for("react.fragment"),b1=Object.prototype.hasOwnProperty,V1=x1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,O1={key:!0,ref:!0,__self:!0,__source:!0};function Np(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)b1.call(e,r)&&!O1.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:N1,type:t,key:s,ref:o,props:i,_owner:V1.current}}ga.Fragment=D1,ga.jsx=Np,ga.jsxs=Np,_p.exports=ga;var mt=_p.exports,lc={},Dp={exports:{}},Tt={},bp={exports:{}},Vp={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(U,H){var q=U.length;U.push(H);e:for(;0<q;){var le=q-1>>>1,de=U[le];if(0<i(de,H))U[le]=H,U[q]=de,q=le;else break e}}function n(U){return U.length===0?null:U[0]}function r(U){if(U.length===0)return null;var H=U[0],q=U.pop();if(q!==H){U[0]=q;e:for(var le=0,de=U.length,xe=de>>>1;le<xe;){var Ln=2*(le+1)-1,Mn=U[Ln],Fn=Ln+1,Un=U[Fn];if(0>i(Mn,q))Fn<de&&0>i(Un,Mn)?(U[le]=Un,U[Fn]=q,le=Fn):(U[le]=Mn,U[Ln]=q,le=Ln);else if(Fn<de&&0>i(Un,q))U[le]=Un,U[Fn]=q,le=Fn;else break e}}return H}function i(U,H){var q=U.sortIndex-H.sortIndex;return q!==0?q:U.id-H.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var u=[],h=[],f=1,m=null,p=3,k=!1,R=!1,x=!1,P=typeof setTimeout=="function"?setTimeout:null,w=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function S(U){for(var H=n(h);H!==null;){if(H.callback===null)r(h);else if(H.startTime<=U)r(h),H.sortIndex=H.expirationTime,e(u,H);else break;H=n(h)}}function D(U){if(x=!1,S(U),!R)if(n(u)!==null)R=!0,he(b);else{var H=n(h);H!==null&&Y(D,H.startTime-U)}}function b(U,H){R=!1,x&&(x=!1,w(y),y=-1),k=!0;var q=p;try{for(S(H),m=n(u);m!==null&&(!(m.expirationTime>H)||U&&!A());){var le=m.callback;if(typeof le=="function"){m.callback=null,p=m.priorityLevel;var de=le(m.expirationTime<=H);H=t.unstable_now(),typeof de=="function"?m.callback=de:m===n(u)&&r(u),S(H)}else r(u);m=n(u)}if(m!==null)var xe=!0;else{var Ln=n(h);Ln!==null&&Y(D,Ln.startTime-H),xe=!1}return xe}finally{m=null,p=q,k=!1}}var M=!1,T=null,y=-1,v=5,E=-1;function A(){return!(t.unstable_now()-E<v)}function C(){if(T!==null){var U=t.unstable_now();E=U;var H=!0;try{H=T(!0,U)}finally{H?I():(M=!1,T=null)}}else M=!1}var I;if(typeof _=="function")I=function(){_(C)};else if(typeof MessageChannel<"u"){var Ae=new MessageChannel,st=Ae.port2;Ae.port1.onmessage=C,I=function(){st.postMessage(null)}}else I=function(){P(C,0)};function he(U){T=U,M||(M=!0,I())}function Y(U,H){y=P(function(){U(t.unstable_now())},H)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(U){U.callback=null},t.unstable_continueExecution=function(){R||k||(R=!0,he(b))},t.unstable_forceFrameRate=function(U){0>U||125<U?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):v=0<U?Math.floor(1e3/U):5},t.unstable_getCurrentPriorityLevel=function(){return p},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(U){switch(p){case 1:case 2:case 3:var H=3;break;default:H=p}var q=p;p=H;try{return U()}finally{p=q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(U,H){switch(U){case 1:case 2:case 3:case 4:case 5:break;default:U=3}var q=p;p=U;try{return H()}finally{p=q}},t.unstable_scheduleCallback=function(U,H,q){var le=t.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?le+q:le):q=le,U){case 1:var de=-1;break;case 2:de=250;break;case 5:de=1073741823;break;case 4:de=1e4;break;default:de=5e3}return de=q+de,U={id:f++,callback:H,priorityLevel:U,startTime:q,expirationTime:de,sortIndex:-1},q>le?(U.sortIndex=q,e(h,U),n(u)===null&&U===n(h)&&(x?(w(y),y=-1):x=!0,Y(D,q-le))):(U.sortIndex=de,e(u,U),R||k||(R=!0,he(b))),U},t.unstable_shouldYield=A,t.unstable_wrapCallback=function(U){var H=p;return function(){var q=p;p=H;try{return U.apply(this,arguments)}finally{p=q}}}})(Vp),bp.exports=Vp;var L1=bp.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var M1=wa,It=L1;function F(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Op=new Set,Cs={};function br(t,e){mi(t,e),mi(t+"Capture",e)}function mi(t,e){for(Cs[t]=e,t=0;t<e.length;t++)Op.add(e[t])}var pn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),uc=Object.prototype.hasOwnProperty,F1=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Lp={},Mp={};function U1(t){return uc.call(Mp,t)?!0:uc.call(Lp,t)?!1:F1.test(t)?Mp[t]=!0:(Lp[t]=!0,!1)}function z1(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function j1(t,e,n,r){if(e===null||typeof e>"u"||z1(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function ct(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var qe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){qe[t]=new ct(t,0,!1,t,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];qe[e]=new ct(e,1,!1,t[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(t){qe[t]=new ct(t,2,!1,t.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){qe[t]=new ct(t,2,!1,t,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){qe[t]=new ct(t,3,!1,t.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(t){qe[t]=new ct(t,3,!0,t,null,!1,!1)}),["capture","download"].forEach(function(t){qe[t]=new ct(t,4,!1,t,null,!1,!1)}),["cols","rows","size","span"].forEach(function(t){qe[t]=new ct(t,6,!1,t,null,!1,!1)}),["rowSpan","start"].forEach(function(t){qe[t]=new ct(t,5,!1,t.toLowerCase(),null,!1,!1)});var cc=/[\-:]([a-z])/g;function hc(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(cc,hc);qe[e]=new ct(e,1,!1,t,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(cc,hc);qe[e]=new ct(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(cc,hc);qe[e]=new ct(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(t){qe[t]=new ct(t,1,!1,t.toLowerCase(),null,!1,!1)}),qe.xlinkHref=new ct("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(t){qe[t]=new ct(t,1,!1,t.toLowerCase(),null,!0,!0)});function dc(t,e,n,r){var i=qe.hasOwnProperty(e)?qe[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(j1(e,n,i,r)&&(n=null),r||i===null?U1(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var mn=M1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ea=Symbol.for("react.element"),gi=Symbol.for("react.portal"),yi=Symbol.for("react.fragment"),fc=Symbol.for("react.strict_mode"),pc=Symbol.for("react.profiler"),Fp=Symbol.for("react.provider"),Up=Symbol.for("react.context"),mc=Symbol.for("react.forward_ref"),gc=Symbol.for("react.suspense"),yc=Symbol.for("react.suspense_list"),_c=Symbol.for("react.memo"),Wn=Symbol.for("react.lazy"),zp=Symbol.for("react.offscreen"),jp=Symbol.iterator;function Rs(t){return t===null||typeof t!="object"?null:(t=jp&&t[jp]||t["@@iterator"],typeof t=="function"?t:null)}var Ee=Object.assign,vc;function Ps(t){if(vc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);vc=e&&e[1]||""}return`
`+vc+t}var wc=!1;function Ec(t,e){if(!t||wc)return"";wc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(h){var r=h}Reflect.construct(t,[],e)}else{try{e.call()}catch(h){r=h}t.call(e.prototype)}else{try{throw Error()}catch(h){r=h}t()}}catch(h){if(h&&r&&typeof h.stack=="string"){for(var i=h.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,l=s.length-1;1<=o&&0<=l&&i[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(i[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||i[o]!==s[l]){var u=`
`+i[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=l);break}}}finally{wc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Ps(t):""}function B1(t){switch(t.tag){case 5:return Ps(t.type);case 16:return Ps("Lazy");case 13:return Ps("Suspense");case 19:return Ps("SuspenseList");case 0:case 2:case 15:return t=Ec(t.type,!1),t;case 11:return t=Ec(t.type.render,!1),t;case 1:return t=Ec(t.type,!0),t;default:return""}}function Tc(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case yi:return"Fragment";case gi:return"Portal";case pc:return"Profiler";case fc:return"StrictMode";case gc:return"Suspense";case yc:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Up:return(t.displayName||"Context")+".Consumer";case Fp:return(t._context.displayName||"Context")+".Provider";case mc:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case _c:return e=t.displayName||null,e!==null?e:Tc(t.type)||"Memo";case Wn:e=t._payload,t=t._init;try{return Tc(t(e))}catch{}}return null}function $1(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Tc(e);case 8:return e===fc?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function qn(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Bp(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function H1(t){var e=Bp(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ta(t){t._valueTracker||(t._valueTracker=H1(t))}function $p(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=Bp(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function Ia(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Ic(t,e){var n=e.checked;return Ee({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Hp(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=qn(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Wp(t,e){e=e.checked,e!=null&&dc(t,"checked",e,!1)}function Sc(t,e){Wp(t,e);var n=qn(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Ac(t,e.type,n):e.hasOwnProperty("defaultValue")&&Ac(t,e.type,qn(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function qp(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Ac(t,e,n){(e!=="number"||Ia(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var xs=Array.isArray;function _i(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+qn(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function kc(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(F(91));return Ee({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Gp(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(F(92));if(xs(n)){if(1<n.length)throw Error(F(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:qn(n)}}function Kp(t,e){var n=qn(e.value),r=qn(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function Qp(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Xp(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Cc(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Xp(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Sa,Yp=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Sa=Sa||document.createElement("div"),Sa.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Sa.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Ns(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ds={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},W1=["Webkit","ms","Moz","O"];Object.keys(Ds).forEach(function(t){W1.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ds[e]=Ds[t]})});function Jp(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ds.hasOwnProperty(t)&&Ds[t]?(""+e).trim():e+"px"}function Zp(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Jp(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var q1=Ee({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Rc(t,e){if(e){if(q1[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(F(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(F(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(F(61))}if(e.style!=null&&typeof e.style!="object")throw Error(F(62))}}function Pc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var xc=null;function Nc(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Dc=null,vi=null,wi=null;function em(t){if(t=eo(t)){if(typeof Dc!="function")throw Error(F(280));var e=t.stateNode;e&&(e=Ga(e),Dc(t.stateNode,t.type,e))}}function tm(t){vi?wi?wi.push(t):wi=[t]:vi=t}function nm(){if(vi){var t=vi,e=wi;if(wi=vi=null,em(t),e)for(t=0;t<e.length;t++)em(e[t])}}function rm(t,e){return t(e)}function im(){}var bc=!1;function sm(t,e,n){if(bc)return t(e,n);bc=!0;try{return rm(t,e,n)}finally{bc=!1,(vi!==null||wi!==null)&&(im(),nm())}}function bs(t,e){var n=t.stateNode;if(n===null)return null;var r=Ga(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(F(231,e,typeof n));return n}var Vc=!1;if(pn)try{var Vs={};Object.defineProperty(Vs,"passive",{get:function(){Vc=!0}}),window.addEventListener("test",Vs,Vs),window.removeEventListener("test",Vs,Vs)}catch{Vc=!1}function G1(t,e,n,r,i,s,o,l,u){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(f){this.onError(f)}}var Os=!1,Aa=null,ka=!1,Oc=null,K1={onError:function(t){Os=!0,Aa=t}};function Q1(t,e,n,r,i,s,o,l,u){Os=!1,Aa=null,G1.apply(K1,arguments)}function X1(t,e,n,r,i,s,o,l,u){if(Q1.apply(this,arguments),Os){if(Os){var h=Aa;Os=!1,Aa=null}else throw Error(F(198));ka||(ka=!0,Oc=h)}}function Vr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function om(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function am(t){if(Vr(t)!==t)throw Error(F(188))}function Y1(t){var e=t.alternate;if(!e){if(e=Vr(t),e===null)throw Error(F(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return am(i),t;if(s===r)return am(i),e;s=s.sibling}throw Error(F(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o)throw Error(F(189))}}if(n.alternate!==r)throw Error(F(190))}if(n.tag!==3)throw Error(F(188));return n.stateNode.current===n?t:e}function lm(t){return t=Y1(t),t!==null?um(t):null}function um(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=um(t);if(e!==null)return e;t=t.sibling}return null}var cm=It.unstable_scheduleCallback,hm=It.unstable_cancelCallback,J1=It.unstable_shouldYield,Z1=It.unstable_requestPaint,Re=It.unstable_now,eT=It.unstable_getCurrentPriorityLevel,Lc=It.unstable_ImmediatePriority,dm=It.unstable_UserBlockingPriority,Ca=It.unstable_NormalPriority,tT=It.unstable_LowPriority,fm=It.unstable_IdlePriority,Ra=null,tn=null;function nT(t){if(tn&&typeof tn.onCommitFiberRoot=="function")try{tn.onCommitFiberRoot(Ra,t,void 0,(t.current.flags&128)===128)}catch{}}var Bt=Math.clz32?Math.clz32:sT,rT=Math.log,iT=Math.LN2;function sT(t){return t>>>=0,t===0?32:31-(rT(t)/iT|0)|0}var Pa=64,xa=4194304;function Ls(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Na(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~i;l!==0?r=Ls(l):(s&=o,s!==0&&(r=Ls(s)))}else o=n&~i,o!==0?r=Ls(o):s!==0&&(r=Ls(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-Bt(e),i=1<<n,r|=t[n],e&=~i;return r}function oT(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function aT(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-Bt(s),l=1<<o,u=i[o];u===-1?(!(l&n)||l&r)&&(i[o]=oT(l,e)):u<=e&&(t.expiredLanes|=l),s&=~l}}function Mc(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function pm(){var t=Pa;return Pa<<=1,!(Pa&4194240)&&(Pa=64),t}function Fc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ms(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Bt(e),t[e]=n}function lT(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-Bt(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function Uc(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-Bt(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var ae=0;function mm(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var gm,zc,ym,_m,vm,jc=!1,Da=[],Gn=null,Kn=null,Qn=null,Fs=new Map,Us=new Map,Xn=[],uT="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function wm(t,e){switch(t){case"focusin":case"focusout":Gn=null;break;case"dragenter":case"dragleave":Kn=null;break;case"mouseover":case"mouseout":Qn=null;break;case"pointerover":case"pointerout":Fs.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Us.delete(e.pointerId)}}function zs(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=eo(e),e!==null&&zc(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function cT(t,e,n,r,i){switch(e){case"focusin":return Gn=zs(Gn,t,e,n,r,i),!0;case"dragenter":return Kn=zs(Kn,t,e,n,r,i),!0;case"mouseover":return Qn=zs(Qn,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return Fs.set(s,zs(Fs.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Us.set(s,zs(Us.get(s)||null,t,e,n,r,i)),!0}return!1}function Em(t){var e=Or(t.target);if(e!==null){var n=Vr(e);if(n!==null){if(e=n.tag,e===13){if(e=om(n),e!==null){t.blockedOn=e,vm(t.priority,function(){ym(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function ba(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=$c(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);xc=r,n.target.dispatchEvent(r),xc=null}else return e=eo(n),e!==null&&zc(e),t.blockedOn=n,!1;e.shift()}return!0}function Tm(t,e,n){ba(t)&&n.delete(e)}function hT(){jc=!1,Gn!==null&&ba(Gn)&&(Gn=null),Kn!==null&&ba(Kn)&&(Kn=null),Qn!==null&&ba(Qn)&&(Qn=null),Fs.forEach(Tm),Us.forEach(Tm)}function js(t,e){t.blockedOn===e&&(t.blockedOn=null,jc||(jc=!0,It.unstable_scheduleCallback(It.unstable_NormalPriority,hT)))}function Bs(t){function e(i){return js(i,t)}if(0<Da.length){js(Da[0],t);for(var n=1;n<Da.length;n++){var r=Da[n];r.blockedOn===t&&(r.blockedOn=null)}}for(Gn!==null&&js(Gn,t),Kn!==null&&js(Kn,t),Qn!==null&&js(Qn,t),Fs.forEach(e),Us.forEach(e),n=0;n<Xn.length;n++)r=Xn[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<Xn.length&&(n=Xn[0],n.blockedOn===null);)Em(n),n.blockedOn===null&&Xn.shift()}var Ei=mn.ReactCurrentBatchConfig,Va=!0;function dT(t,e,n,r){var i=ae,s=Ei.transition;Ei.transition=null;try{ae=1,Bc(t,e,n,r)}finally{ae=i,Ei.transition=s}}function fT(t,e,n,r){var i=ae,s=Ei.transition;Ei.transition=null;try{ae=4,Bc(t,e,n,r)}finally{ae=i,Ei.transition=s}}function Bc(t,e,n,r){if(Va){var i=$c(t,e,n,r);if(i===null)oh(t,e,r,Oa,n),wm(t,r);else if(cT(i,t,e,n,r))r.stopPropagation();else if(wm(t,r),e&4&&-1<uT.indexOf(t)){for(;i!==null;){var s=eo(i);if(s!==null&&gm(s),s=$c(t,e,n,r),s===null&&oh(t,e,r,Oa,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else oh(t,e,r,null,n)}}var Oa=null;function $c(t,e,n,r){if(Oa=null,t=Nc(r),t=Or(t),t!==null)if(e=Vr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=om(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Oa=t,null}function Im(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(eT()){case Lc:return 1;case dm:return 4;case Ca:case tT:return 16;case fm:return 536870912;default:return 16}default:return 16}}var Yn=null,Hc=null,La=null;function Sm(){if(La)return La;var t,e=Hc,n=e.length,r,i="value"in Yn?Yn.value:Yn.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return La=i.slice(t,1<r?1-r:void 0)}function Ma(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Fa(){return!0}function Am(){return!1}function St(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Fa:Am,this.isPropagationStopped=Am,this}return Ee(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Fa)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Fa)},persist:function(){},isPersistent:Fa}),e}var Ti={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Wc=St(Ti),$s=Ee({},Ti,{view:0,detail:0}),pT=St($s),qc,Gc,Hs,Ua=Ee({},$s,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Qc,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Hs&&(Hs&&t.type==="mousemove"?(qc=t.screenX-Hs.screenX,Gc=t.screenY-Hs.screenY):Gc=qc=0,Hs=t),qc)},movementY:function(t){return"movementY"in t?t.movementY:Gc}}),km=St(Ua),mT=Ee({},Ua,{dataTransfer:0}),gT=St(mT),yT=Ee({},$s,{relatedTarget:0}),Kc=St(yT),_T=Ee({},Ti,{animationName:0,elapsedTime:0,pseudoElement:0}),vT=St(_T),wT=Ee({},Ti,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),ET=St(wT),TT=Ee({},Ti,{data:0}),Cm=St(TT),IT={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ST={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},AT={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function kT(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=AT[t])?!!e[t]:!1}function Qc(){return kT}var CT=Ee({},$s,{key:function(t){if(t.key){var e=IT[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Ma(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?ST[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Qc,charCode:function(t){return t.type==="keypress"?Ma(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Ma(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),RT=St(CT),PT=Ee({},Ua,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Rm=St(PT),xT=Ee({},$s,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Qc}),NT=St(xT),DT=Ee({},Ti,{propertyName:0,elapsedTime:0,pseudoElement:0}),bT=St(DT),VT=Ee({},Ua,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),OT=St(VT),LT=[9,13,27,32],Xc=pn&&"CompositionEvent"in window,Ws=null;pn&&"documentMode"in document&&(Ws=document.documentMode);var MT=pn&&"TextEvent"in window&&!Ws,Pm=pn&&(!Xc||Ws&&8<Ws&&11>=Ws),xm=" ",Nm=!1;function Dm(t,e){switch(t){case"keyup":return LT.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function bm(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ii=!1;function FT(t,e){switch(t){case"compositionend":return bm(e);case"keypress":return e.which!==32?null:(Nm=!0,xm);case"textInput":return t=e.data,t===xm&&Nm?null:t;default:return null}}function UT(t,e){if(Ii)return t==="compositionend"||!Xc&&Dm(t,e)?(t=Sm(),La=Hc=Yn=null,Ii=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Pm&&e.locale!=="ko"?null:e.data;default:return null}}var zT={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Vm(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!zT[t.type]:e==="textarea"}function Om(t,e,n,r){tm(r),e=Ha(e,"onChange"),0<e.length&&(n=new Wc("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var qs=null,Gs=null;function jT(t){Zm(t,0)}function za(t){var e=Ri(t);if($p(e))return t}function BT(t,e){if(t==="change")return e}var Lm=!1;if(pn){var Yc;if(pn){var Jc="oninput"in document;if(!Jc){var Mm=document.createElement("div");Mm.setAttribute("oninput","return;"),Jc=typeof Mm.oninput=="function"}Yc=Jc}else Yc=!1;Lm=Yc&&(!document.documentMode||9<document.documentMode)}function Fm(){qs&&(qs.detachEvent("onpropertychange",Um),Gs=qs=null)}function Um(t){if(t.propertyName==="value"&&za(Gs)){var e=[];Om(e,Gs,t,Nc(t)),sm(jT,e)}}function $T(t,e,n){t==="focusin"?(Fm(),qs=e,Gs=n,qs.attachEvent("onpropertychange",Um)):t==="focusout"&&Fm()}function HT(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return za(Gs)}function WT(t,e){if(t==="click")return za(e)}function qT(t,e){if(t==="input"||t==="change")return za(e)}function GT(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var $t=typeof Object.is=="function"?Object.is:GT;function Ks(t,e){if($t(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!uc.call(e,i)||!$t(t[i],e[i]))return!1}return!0}function zm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function jm(t,e){var n=zm(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=zm(n)}}function Bm(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Bm(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function $m(){for(var t=window,e=Ia();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Ia(t.document)}return e}function Zc(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function KT(t){var e=$m(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Bm(n.ownerDocument.documentElement,n)){if(r!==null&&Zc(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=jm(n,s);var o=jm(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var QT=pn&&"documentMode"in document&&11>=document.documentMode,Si=null,eh=null,Qs=null,th=!1;function Hm(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;th||Si==null||Si!==Ia(r)||(r=Si,"selectionStart"in r&&Zc(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Qs&&Ks(Qs,r)||(Qs=r,r=Ha(eh,"onSelect"),0<r.length&&(e=new Wc("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=Si)))}function ja(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ai={animationend:ja("Animation","AnimationEnd"),animationiteration:ja("Animation","AnimationIteration"),animationstart:ja("Animation","AnimationStart"),transitionend:ja("Transition","TransitionEnd")},nh={},Wm={};pn&&(Wm=document.createElement("div").style,"AnimationEvent"in window||(delete Ai.animationend.animation,delete Ai.animationiteration.animation,delete Ai.animationstart.animation),"TransitionEvent"in window||delete Ai.transitionend.transition);function Ba(t){if(nh[t])return nh[t];if(!Ai[t])return t;var e=Ai[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Wm)return nh[t]=e[n];return t}var qm=Ba("animationend"),Gm=Ba("animationiteration"),Km=Ba("animationstart"),Qm=Ba("transitionend"),Xm=new Map,Ym="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Jn(t,e){Xm.set(t,e),br(e,[t])}for(var rh=0;rh<Ym.length;rh++){var ih=Ym[rh],XT=ih.toLowerCase(),YT=ih[0].toUpperCase()+ih.slice(1);Jn(XT,"on"+YT)}Jn(qm,"onAnimationEnd"),Jn(Gm,"onAnimationIteration"),Jn(Km,"onAnimationStart"),Jn("dblclick","onDoubleClick"),Jn("focusin","onFocus"),Jn("focusout","onBlur"),Jn(Qm,"onTransitionEnd"),mi("onMouseEnter",["mouseout","mouseover"]),mi("onMouseLeave",["mouseout","mouseover"]),mi("onPointerEnter",["pointerout","pointerover"]),mi("onPointerLeave",["pointerout","pointerover"]),br("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),br("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),br("onBeforeInput",["compositionend","keypress","textInput","paste"]),br("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),br("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),br("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xs="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),JT=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xs));function Jm(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,X1(r,e,void 0,t),t.currentTarget=null}function Zm(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],u=l.instance,h=l.currentTarget;if(l=l.listener,u!==s&&i.isPropagationStopped())break e;Jm(i,l,h),s=u}else for(o=0;o<r.length;o++){if(l=r[o],u=l.instance,h=l.currentTarget,l=l.listener,u!==s&&i.isPropagationStopped())break e;Jm(i,l,h),s=u}}}if(ka)throw t=Oc,ka=!1,Oc=null,t}function ye(t,e){var n=e[dh];n===void 0&&(n=e[dh]=new Set);var r=t+"__bubble";n.has(r)||(eg(e,t,2,!1),n.add(r))}function sh(t,e,n){var r=0;e&&(r|=4),eg(n,t,r,e)}var $a="_reactListening"+Math.random().toString(36).slice(2);function Ys(t){if(!t[$a]){t[$a]=!0,Op.forEach(function(n){n!=="selectionchange"&&(JT.has(n)||sh(n,!1,t),sh(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[$a]||(e[$a]=!0,sh("selectionchange",!1,e))}}function eg(t,e,n,r){switch(Im(e)){case 1:var i=dT;break;case 4:i=fT;break;default:i=Bc}n=i.bind(null,e,n,t),i=void 0,!Vc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function oh(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;l!==null;){if(o=Or(l),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}l=l.parentNode}}r=r.return}sm(function(){var h=s,f=Nc(n),m=[];e:{var p=Xm.get(t);if(p!==void 0){var k=Wc,R=t;switch(t){case"keypress":if(Ma(n)===0)break e;case"keydown":case"keyup":k=RT;break;case"focusin":R="focus",k=Kc;break;case"focusout":R="blur",k=Kc;break;case"beforeblur":case"afterblur":k=Kc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=km;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=gT;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=NT;break;case qm:case Gm:case Km:k=vT;break;case Qm:k=bT;break;case"scroll":k=pT;break;case"wheel":k=OT;break;case"copy":case"cut":case"paste":k=ET;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=Rm}var x=(e&4)!==0,P=!x&&t==="scroll",w=x?p!==null?p+"Capture":null:p;x=[];for(var _=h,S;_!==null;){S=_;var D=S.stateNode;if(S.tag===5&&D!==null&&(S=D,w!==null&&(D=bs(_,w),D!=null&&x.push(Js(_,D,S)))),P)break;_=_.return}0<x.length&&(p=new k(p,R,null,n,f),m.push({event:p,listeners:x}))}}if(!(e&7)){e:{if(p=t==="mouseover"||t==="pointerover",k=t==="mouseout"||t==="pointerout",p&&n!==xc&&(R=n.relatedTarget||n.fromElement)&&(Or(R)||R[gn]))break e;if((k||p)&&(p=f.window===f?f:(p=f.ownerDocument)?p.defaultView||p.parentWindow:window,k?(R=n.relatedTarget||n.toElement,k=h,R=R?Or(R):null,R!==null&&(P=Vr(R),R!==P||R.tag!==5&&R.tag!==6)&&(R=null)):(k=null,R=h),k!==R)){if(x=km,D="onMouseLeave",w="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(x=Rm,D="onPointerLeave",w="onPointerEnter",_="pointer"),P=k==null?p:Ri(k),S=R==null?p:Ri(R),p=new x(D,_+"leave",k,n,f),p.target=P,p.relatedTarget=S,D=null,Or(f)===h&&(x=new x(w,_+"enter",R,n,f),x.target=S,x.relatedTarget=P,D=x),P=D,k&&R)t:{for(x=k,w=R,_=0,S=x;S;S=ki(S))_++;for(S=0,D=w;D;D=ki(D))S++;for(;0<_-S;)x=ki(x),_--;for(;0<S-_;)w=ki(w),S--;for(;_--;){if(x===w||w!==null&&x===w.alternate)break t;x=ki(x),w=ki(w)}x=null}else x=null;k!==null&&tg(m,p,k,x,!1),R!==null&&P!==null&&tg(m,P,R,x,!0)}}e:{if(p=h?Ri(h):window,k=p.nodeName&&p.nodeName.toLowerCase(),k==="select"||k==="input"&&p.type==="file")var b=BT;else if(Vm(p))if(Lm)b=qT;else{b=HT;var M=$T}else(k=p.nodeName)&&k.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(b=WT);if(b&&(b=b(t,h))){Om(m,b,n,f);break e}M&&M(t,p,h),t==="focusout"&&(M=p._wrapperState)&&M.controlled&&p.type==="number"&&Ac(p,"number",p.value)}switch(M=h?Ri(h):window,t){case"focusin":(Vm(M)||M.contentEditable==="true")&&(Si=M,eh=h,Qs=null);break;case"focusout":Qs=eh=Si=null;break;case"mousedown":th=!0;break;case"contextmenu":case"mouseup":case"dragend":th=!1,Hm(m,n,f);break;case"selectionchange":if(QT)break;case"keydown":case"keyup":Hm(m,n,f)}var T;if(Xc)e:{switch(t){case"compositionstart":var y="onCompositionStart";break e;case"compositionend":y="onCompositionEnd";break e;case"compositionupdate":y="onCompositionUpdate";break e}y=void 0}else Ii?Dm(t,n)&&(y="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(y="onCompositionStart");y&&(Pm&&n.locale!=="ko"&&(Ii||y!=="onCompositionStart"?y==="onCompositionEnd"&&Ii&&(T=Sm()):(Yn=f,Hc="value"in Yn?Yn.value:Yn.textContent,Ii=!0)),M=Ha(h,y),0<M.length&&(y=new Cm(y,t,null,n,f),m.push({event:y,listeners:M}),T?y.data=T:(T=bm(n),T!==null&&(y.data=T)))),(T=MT?FT(t,n):UT(t,n))&&(h=Ha(h,"onBeforeInput"),0<h.length&&(f=new Cm("onBeforeInput","beforeinput",null,n,f),m.push({event:f,listeners:h}),f.data=T))}Zm(m,e)})}function Js(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Ha(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=bs(t,n),s!=null&&r.unshift(Js(t,s,i)),s=bs(t,e),s!=null&&r.push(Js(t,s,i))),t=t.return}return r}function ki(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function tg(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var l=n,u=l.alternate,h=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&h!==null&&(l=h,i?(u=bs(n,s),u!=null&&o.unshift(Js(n,u,l))):i||(u=bs(n,s),u!=null&&o.push(Js(n,u,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var ZT=/\r\n?/g,eI=/\u0000|\uFFFD/g;function ng(t){return(typeof t=="string"?t:""+t).replace(ZT,`
`).replace(eI,"")}function Wa(t,e,n){if(e=ng(e),ng(t)!==e&&n)throw Error(F(425))}function qa(){}var ah=null,lh=null;function uh(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var ch=typeof setTimeout=="function"?setTimeout:void 0,tI=typeof clearTimeout=="function"?clearTimeout:void 0,rg=typeof Promise=="function"?Promise:void 0,nI=typeof queueMicrotask=="function"?queueMicrotask:typeof rg<"u"?function(t){return rg.resolve(null).then(t).catch(rI)}:ch;function rI(t){setTimeout(function(){throw t})}function hh(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),Bs(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Bs(e)}function Zn(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function ig(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Ci=Math.random().toString(36).slice(2),nn="__reactFiber$"+Ci,Zs="__reactProps$"+Ci,gn="__reactContainer$"+Ci,dh="__reactEvents$"+Ci,iI="__reactListeners$"+Ci,sI="__reactHandles$"+Ci;function Or(t){var e=t[nn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[gn]||n[nn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=ig(t);t!==null;){if(n=t[nn])return n;t=ig(t)}return e}t=n,n=t.parentNode}return null}function eo(t){return t=t[nn]||t[gn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Ri(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(F(33))}function Ga(t){return t[Zs]||null}var fh=[],Pi=-1;function er(t){return{current:t}}function _e(t){0>Pi||(t.current=fh[Pi],fh[Pi]=null,Pi--)}function pe(t,e){Pi++,fh[Pi]=t.current,t.current=e}var tr={},Ye=er(tr),gt=er(!1),Lr=tr;function xi(t,e){var n=t.type.contextTypes;if(!n)return tr;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function yt(t){return t=t.childContextTypes,t!=null}function Ka(){_e(gt),_e(Ye)}function sg(t,e,n){if(Ye.current!==tr)throw Error(F(168));pe(Ye,e),pe(gt,n)}function og(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(F(108,$1(t)||"Unknown",i));return Ee({},n,r)}function Qa(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||tr,Lr=Ye.current,pe(Ye,t),pe(gt,gt.current),!0}function ag(t,e,n){var r=t.stateNode;if(!r)throw Error(F(169));n?(t=og(t,e,Lr),r.__reactInternalMemoizedMergedChildContext=t,_e(gt),_e(Ye),pe(Ye,t)):_e(gt),pe(gt,n)}var yn=null,Xa=!1,ph=!1;function lg(t){yn===null?yn=[t]:yn.push(t)}function oI(t){Xa=!0,lg(t)}function nr(){if(!ph&&yn!==null){ph=!0;var t=0,e=ae;try{var n=yn;for(ae=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}yn=null,Xa=!1}catch(i){throw yn!==null&&(yn=yn.slice(t+1)),cm(Lc,nr),i}finally{ae=e,ph=!1}}return null}var Ni=[],Di=0,Ya=null,Ja=0,xt=[],Nt=0,Mr=null,_n=1,vn="";function Fr(t,e){Ni[Di++]=Ja,Ni[Di++]=Ya,Ya=t,Ja=e}function ug(t,e,n){xt[Nt++]=_n,xt[Nt++]=vn,xt[Nt++]=Mr,Mr=t;var r=_n;t=vn;var i=32-Bt(r)-1;r&=~(1<<i),n+=1;var s=32-Bt(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,_n=1<<32-Bt(e)+i|n<<i|r,vn=s+t}else _n=1<<s|n<<i|r,vn=t}function mh(t){t.return!==null&&(Fr(t,1),ug(t,1,0))}function gh(t){for(;t===Ya;)Ya=Ni[--Di],Ni[Di]=null,Ja=Ni[--Di],Ni[Di]=null;for(;t===Mr;)Mr=xt[--Nt],xt[Nt]=null,vn=xt[--Nt],xt[Nt]=null,_n=xt[--Nt],xt[Nt]=null}var At=null,kt=null,we=!1,Ht=null;function cg(t,e){var n=Ot(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function hg(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,At=t,kt=Zn(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,At=t,kt=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Mr!==null?{id:_n,overflow:vn}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Ot(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,At=t,kt=null,!0):!1;default:return!1}}function yh(t){return(t.mode&1)!==0&&(t.flags&128)===0}function _h(t){if(we){var e=kt;if(e){var n=e;if(!hg(t,e)){if(yh(t))throw Error(F(418));e=Zn(n.nextSibling);var r=At;e&&hg(t,e)?cg(r,n):(t.flags=t.flags&-4097|2,we=!1,At=t)}}else{if(yh(t))throw Error(F(418));t.flags=t.flags&-4097|2,we=!1,At=t}}}function dg(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;At=t}function Za(t){if(t!==At)return!1;if(!we)return dg(t),we=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!uh(t.type,t.memoizedProps)),e&&(e=kt)){if(yh(t))throw fg(),Error(F(418));for(;e;)cg(t,e),e=Zn(e.nextSibling)}if(dg(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(F(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){kt=Zn(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}kt=null}}else kt=At?Zn(t.stateNode.nextSibling):null;return!0}function fg(){for(var t=kt;t;)t=Zn(t.nextSibling)}function bi(){kt=At=null,we=!1}function vh(t){Ht===null?Ht=[t]:Ht.push(t)}var aI=mn.ReactCurrentBatchConfig;function to(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(F(309));var r=n.stateNode}if(!r)throw Error(F(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var l=i.refs;o===null?delete l[s]:l[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(F(284));if(!n._owner)throw Error(F(290,t))}return t}function el(t,e){throw t=Object.prototype.toString.call(e),Error(F(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function pg(t){var e=t._init;return e(t._payload)}function mg(t){function e(w,_){if(t){var S=w.deletions;S===null?(w.deletions=[_],w.flags|=16):S.push(_)}}function n(w,_){if(!t)return null;for(;_!==null;)e(w,_),_=_.sibling;return null}function r(w,_){for(w=new Map;_!==null;)_.key!==null?w.set(_.key,_):w.set(_.index,_),_=_.sibling;return w}function i(w,_){return w=cr(w,_),w.index=0,w.sibling=null,w}function s(w,_,S){return w.index=S,t?(S=w.alternate,S!==null?(S=S.index,S<_?(w.flags|=2,_):S):(w.flags|=2,_)):(w.flags|=1048576,_)}function o(w){return t&&w.alternate===null&&(w.flags|=2),w}function l(w,_,S,D){return _===null||_.tag!==6?(_=cd(S,w.mode,D),_.return=w,_):(_=i(_,S),_.return=w,_)}function u(w,_,S,D){var b=S.type;return b===yi?f(w,_,S.props.children,D,S.key):_!==null&&(_.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Wn&&pg(b)===_.type)?(D=i(_,S.props),D.ref=to(w,_,S),D.return=w,D):(D=Sl(S.type,S.key,S.props,null,w.mode,D),D.ref=to(w,_,S),D.return=w,D)}function h(w,_,S,D){return _===null||_.tag!==4||_.stateNode.containerInfo!==S.containerInfo||_.stateNode.implementation!==S.implementation?(_=hd(S,w.mode,D),_.return=w,_):(_=i(_,S.children||[]),_.return=w,_)}function f(w,_,S,D,b){return _===null||_.tag!==7?(_=qr(S,w.mode,D,b),_.return=w,_):(_=i(_,S),_.return=w,_)}function m(w,_,S){if(typeof _=="string"&&_!==""||typeof _=="number")return _=cd(""+_,w.mode,S),_.return=w,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Ea:return S=Sl(_.type,_.key,_.props,null,w.mode,S),S.ref=to(w,null,_),S.return=w,S;case gi:return _=hd(_,w.mode,S),_.return=w,_;case Wn:var D=_._init;return m(w,D(_._payload),S)}if(xs(_)||Rs(_))return _=qr(_,w.mode,S,null),_.return=w,_;el(w,_)}return null}function p(w,_,S,D){var b=_!==null?_.key:null;if(typeof S=="string"&&S!==""||typeof S=="number")return b!==null?null:l(w,_,""+S,D);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Ea:return S.key===b?u(w,_,S,D):null;case gi:return S.key===b?h(w,_,S,D):null;case Wn:return b=S._init,p(w,_,b(S._payload),D)}if(xs(S)||Rs(S))return b!==null?null:f(w,_,S,D,null);el(w,S)}return null}function k(w,_,S,D,b){if(typeof D=="string"&&D!==""||typeof D=="number")return w=w.get(S)||null,l(_,w,""+D,b);if(typeof D=="object"&&D!==null){switch(D.$$typeof){case Ea:return w=w.get(D.key===null?S:D.key)||null,u(_,w,D,b);case gi:return w=w.get(D.key===null?S:D.key)||null,h(_,w,D,b);case Wn:var M=D._init;return k(w,_,S,M(D._payload),b)}if(xs(D)||Rs(D))return w=w.get(S)||null,f(_,w,D,b,null);el(_,D)}return null}function R(w,_,S,D){for(var b=null,M=null,T=_,y=_=0,v=null;T!==null&&y<S.length;y++){T.index>y?(v=T,T=null):v=T.sibling;var E=p(w,T,S[y],D);if(E===null){T===null&&(T=v);break}t&&T&&E.alternate===null&&e(w,T),_=s(E,_,y),M===null?b=E:M.sibling=E,M=E,T=v}if(y===S.length)return n(w,T),we&&Fr(w,y),b;if(T===null){for(;y<S.length;y++)T=m(w,S[y],D),T!==null&&(_=s(T,_,y),M===null?b=T:M.sibling=T,M=T);return we&&Fr(w,y),b}for(T=r(w,T);y<S.length;y++)v=k(T,w,y,S[y],D),v!==null&&(t&&v.alternate!==null&&T.delete(v.key===null?y:v.key),_=s(v,_,y),M===null?b=v:M.sibling=v,M=v);return t&&T.forEach(function(A){return e(w,A)}),we&&Fr(w,y),b}function x(w,_,S,D){var b=Rs(S);if(typeof b!="function")throw Error(F(150));if(S=b.call(S),S==null)throw Error(F(151));for(var M=b=null,T=_,y=_=0,v=null,E=S.next();T!==null&&!E.done;y++,E=S.next()){T.index>y?(v=T,T=null):v=T.sibling;var A=p(w,T,E.value,D);if(A===null){T===null&&(T=v);break}t&&T&&A.alternate===null&&e(w,T),_=s(A,_,y),M===null?b=A:M.sibling=A,M=A,T=v}if(E.done)return n(w,T),we&&Fr(w,y),b;if(T===null){for(;!E.done;y++,E=S.next())E=m(w,E.value,D),E!==null&&(_=s(E,_,y),M===null?b=E:M.sibling=E,M=E);return we&&Fr(w,y),b}for(T=r(w,T);!E.done;y++,E=S.next())E=k(T,w,y,E.value,D),E!==null&&(t&&E.alternate!==null&&T.delete(E.key===null?y:E.key),_=s(E,_,y),M===null?b=E:M.sibling=E,M=E);return t&&T.forEach(function(C){return e(w,C)}),we&&Fr(w,y),b}function P(w,_,S,D){if(typeof S=="object"&&S!==null&&S.type===yi&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case Ea:e:{for(var b=S.key,M=_;M!==null;){if(M.key===b){if(b=S.type,b===yi){if(M.tag===7){n(w,M.sibling),_=i(M,S.props.children),_.return=w,w=_;break e}}else if(M.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Wn&&pg(b)===M.type){n(w,M.sibling),_=i(M,S.props),_.ref=to(w,M,S),_.return=w,w=_;break e}n(w,M);break}else e(w,M);M=M.sibling}S.type===yi?(_=qr(S.props.children,w.mode,D,S.key),_.return=w,w=_):(D=Sl(S.type,S.key,S.props,null,w.mode,D),D.ref=to(w,_,S),D.return=w,w=D)}return o(w);case gi:e:{for(M=S.key;_!==null;){if(_.key===M)if(_.tag===4&&_.stateNode.containerInfo===S.containerInfo&&_.stateNode.implementation===S.implementation){n(w,_.sibling),_=i(_,S.children||[]),_.return=w,w=_;break e}else{n(w,_);break}else e(w,_);_=_.sibling}_=hd(S,w.mode,D),_.return=w,w=_}return o(w);case Wn:return M=S._init,P(w,_,M(S._payload),D)}if(xs(S))return R(w,_,S,D);if(Rs(S))return x(w,_,S,D);el(w,S)}return typeof S=="string"&&S!==""||typeof S=="number"?(S=""+S,_!==null&&_.tag===6?(n(w,_.sibling),_=i(_,S),_.return=w,w=_):(n(w,_),_=cd(S,w.mode,D),_.return=w,w=_),o(w)):n(w,_)}return P}var Vi=mg(!0),gg=mg(!1),tl=er(null),nl=null,Oi=null,wh=null;function Eh(){wh=Oi=nl=null}function Th(t){var e=tl.current;_e(tl),t._currentValue=e}function Ih(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function Li(t,e){nl=t,wh=Oi=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(_t=!0),t.firstContext=null)}function Dt(t){var e=t._currentValue;if(wh!==t)if(t={context:t,memoizedValue:e,next:null},Oi===null){if(nl===null)throw Error(F(308));Oi=t,nl.dependencies={lanes:0,firstContext:t}}else Oi=Oi.next=t;return e}var Ur=null;function Sh(t){Ur===null?Ur=[t]:Ur.push(t)}function yg(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Sh(e)):(n.next=i.next,i.next=n),e.interleaved=n,wn(t,r)}function wn(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var rr=!1;function Ah(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function _g(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function En(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function ir(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,re&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,wn(t,n)}return i=r.interleaved,i===null?(e.next=e,Sh(r)):(e.next=i.next,i.next=e),r.interleaved=e,wn(t,n)}function rl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,Uc(t,n)}}function vg(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function il(t,e,n,r){var i=t.updateQueue;rr=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var u=l,h=u.next;u.next=null,o===null?s=h:o.next=h,o=u;var f=t.alternate;f!==null&&(f=f.updateQueue,l=f.lastBaseUpdate,l!==o&&(l===null?f.firstBaseUpdate=h:l.next=h,f.lastBaseUpdate=u))}if(s!==null){var m=i.baseState;o=0,f=h=u=null,l=s;do{var p=l.lane,k=l.eventTime;if((r&p)===p){f!==null&&(f=f.next={eventTime:k,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var R=t,x=l;switch(p=e,k=n,x.tag){case 1:if(R=x.payload,typeof R=="function"){m=R.call(k,m,p);break e}m=R;break e;case 3:R.flags=R.flags&-65537|128;case 0:if(R=x.payload,p=typeof R=="function"?R.call(k,m,p):R,p==null)break e;m=Ee({},m,p);break e;case 2:rr=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,p=i.effects,p===null?i.effects=[l]:p.push(l))}else k={eventTime:k,lane:p,tag:l.tag,payload:l.payload,callback:l.callback,next:null},f===null?(h=f=k,u=m):f=f.next=k,o|=p;if(l=l.next,l===null){if(l=i.shared.pending,l===null)break;p=l,l=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(!0);if(f===null&&(u=m),i.baseState=u,i.firstBaseUpdate=h,i.lastBaseUpdate=f,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);Br|=o,t.lanes=o,t.memoizedState=m}}function wg(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(F(191,i));i.call(r)}}}var no={},rn=er(no),ro=er(no),io=er(no);function zr(t){if(t===no)throw Error(F(174));return t}function kh(t,e){switch(pe(io,e),pe(ro,t),pe(rn,no),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Cc(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Cc(e,t)}_e(rn),pe(rn,e)}function Mi(){_e(rn),_e(ro),_e(io)}function Eg(t){zr(io.current);var e=zr(rn.current),n=Cc(e,t.type);e!==n&&(pe(ro,t),pe(rn,n))}function Ch(t){ro.current===t&&(_e(rn),_e(ro))}var Te=er(0);function sl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Rh=[];function Ph(){for(var t=0;t<Rh.length;t++)Rh[t]._workInProgressVersionPrimary=null;Rh.length=0}var ol=mn.ReactCurrentDispatcher,xh=mn.ReactCurrentBatchConfig,jr=0,Ie=null,Le=null,ze=null,al=!1,so=!1,oo=0,lI=0;function Je(){throw Error(F(321))}function Nh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!$t(t[n],e[n]))return!1;return!0}function Dh(t,e,n,r,i,s){if(jr=s,Ie=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,ol.current=t===null||t.memoizedState===null?dI:fI,t=n(r,i),so){s=0;do{if(so=!1,oo=0,25<=s)throw Error(F(301));s+=1,ze=Le=null,e.updateQueue=null,ol.current=pI,t=n(r,i)}while(so)}if(ol.current=cl,e=Le!==null&&Le.next!==null,jr=0,ze=Le=Ie=null,al=!1,e)throw Error(F(300));return t}function bh(){var t=oo!==0;return oo=0,t}function sn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ze===null?Ie.memoizedState=ze=t:ze=ze.next=t,ze}function bt(){if(Le===null){var t=Ie.alternate;t=t!==null?t.memoizedState:null}else t=Le.next;var e=ze===null?Ie.memoizedState:ze.next;if(e!==null)ze=e,Le=t;else{if(t===null)throw Error(F(310));Le=t,t={memoizedState:Le.memoizedState,baseState:Le.baseState,baseQueue:Le.baseQueue,queue:Le.queue,next:null},ze===null?Ie.memoizedState=ze=t:ze=ze.next=t}return ze}function ao(t,e){return typeof e=="function"?e(t):e}function Vh(t){var e=bt(),n=e.queue;if(n===null)throw Error(F(311));n.lastRenderedReducer=t;var r=Le,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var l=o=null,u=null,h=s;do{var f=h.lane;if((jr&f)===f)u!==null&&(u=u.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),r=h.hasEagerState?h.eagerState:t(r,h.action);else{var m={lane:f,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};u===null?(l=u=m,o=r):u=u.next=m,Ie.lanes|=f,Br|=f}h=h.next}while(h!==null&&h!==s);u===null?o=r:u.next=l,$t(r,e.memoizedState)||(_t=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,Ie.lanes|=s,Br|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Oh(t){var e=bt(),n=e.queue;if(n===null)throw Error(F(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);$t(s,e.memoizedState)||(_t=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function Tg(){}function Ig(t,e){var n=Ie,r=bt(),i=e(),s=!$t(r.memoizedState,i);if(s&&(r.memoizedState=i,_t=!0),r=r.queue,Lh(kg.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||ze!==null&&ze.memoizedState.tag&1){if(n.flags|=2048,lo(9,Ag.bind(null,n,r,i,e),void 0,null),je===null)throw Error(F(349));jr&30||Sg(n,e,i)}return i}function Sg(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Ie.updateQueue,e===null?(e={lastEffect:null,stores:null},Ie.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Ag(t,e,n,r){e.value=n,e.getSnapshot=r,Cg(e)&&Rg(t)}function kg(t,e,n){return n(function(){Cg(e)&&Rg(t)})}function Cg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!$t(t,n)}catch{return!0}}function Rg(t){var e=wn(t,1);e!==null&&Kt(e,t,1,-1)}function Pg(t){var e=sn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ao,lastRenderedState:t},e.queue=t,t=t.dispatch=hI.bind(null,Ie,t),[e.memoizedState,t]}function lo(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=Ie.updateQueue,e===null?(e={lastEffect:null,stores:null},Ie.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function xg(){return bt().memoizedState}function ll(t,e,n,r){var i=sn();Ie.flags|=t,i.memoizedState=lo(1|e,n,void 0,r===void 0?null:r)}function ul(t,e,n,r){var i=bt();r=r===void 0?null:r;var s=void 0;if(Le!==null){var o=Le.memoizedState;if(s=o.destroy,r!==null&&Nh(r,o.deps)){i.memoizedState=lo(e,n,s,r);return}}Ie.flags|=t,i.memoizedState=lo(1|e,n,s,r)}function Ng(t,e){return ll(8390656,8,t,e)}function Lh(t,e){return ul(2048,8,t,e)}function Dg(t,e){return ul(4,2,t,e)}function bg(t,e){return ul(4,4,t,e)}function Vg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Og(t,e,n){return n=n!=null?n.concat([t]):null,ul(4,4,Vg.bind(null,e,t),n)}function Mh(){}function Lg(t,e){var n=bt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Nh(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function Mg(t,e){var n=bt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Nh(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function Fg(t,e,n){return jr&21?($t(n,e)||(n=pm(),Ie.lanes|=n,Br|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,_t=!0),t.memoizedState=n)}function uI(t,e){var n=ae;ae=n!==0&&4>n?n:4,t(!0);var r=xh.transition;xh.transition={};try{t(!1),e()}finally{ae=n,xh.transition=r}}function Ug(){return bt().memoizedState}function cI(t,e,n){var r=lr(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},zg(t))jg(e,n);else if(n=yg(t,e,n,r),n!==null){var i=dt();Kt(n,t,r,i),Bg(n,e,r)}}function hI(t,e,n){var r=lr(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(zg(t))jg(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,l=s(o,n);if(i.hasEagerState=!0,i.eagerState=l,$t(l,o)){var u=e.interleaved;u===null?(i.next=i,Sh(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch{}finally{}n=yg(t,e,i,r),n!==null&&(i=dt(),Kt(n,t,r,i),Bg(n,e,r))}}function zg(t){var e=t.alternate;return t===Ie||e!==null&&e===Ie}function jg(t,e){so=al=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Bg(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,Uc(t,n)}}var cl={readContext:Dt,useCallback:Je,useContext:Je,useEffect:Je,useImperativeHandle:Je,useInsertionEffect:Je,useLayoutEffect:Je,useMemo:Je,useReducer:Je,useRef:Je,useState:Je,useDebugValue:Je,useDeferredValue:Je,useTransition:Je,useMutableSource:Je,useSyncExternalStore:Je,useId:Je,unstable_isNewReconciler:!1},dI={readContext:Dt,useCallback:function(t,e){return sn().memoizedState=[t,e===void 0?null:e],t},useContext:Dt,useEffect:Ng,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,ll(4194308,4,Vg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return ll(4194308,4,t,e)},useInsertionEffect:function(t,e){return ll(4,2,t,e)},useMemo:function(t,e){var n=sn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=sn();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=cI.bind(null,Ie,t),[r.memoizedState,t]},useRef:function(t){var e=sn();return t={current:t},e.memoizedState=t},useState:Pg,useDebugValue:Mh,useDeferredValue:function(t){return sn().memoizedState=t},useTransition:function(){var t=Pg(!1),e=t[0];return t=uI.bind(null,t[1]),sn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=Ie,i=sn();if(we){if(n===void 0)throw Error(F(407));n=n()}else{if(n=e(),je===null)throw Error(F(349));jr&30||Sg(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,Ng(kg.bind(null,r,s,t),[t]),r.flags|=2048,lo(9,Ag.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=sn(),e=je.identifierPrefix;if(we){var n=vn,r=_n;n=(r&~(1<<32-Bt(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=oo++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=lI++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},fI={readContext:Dt,useCallback:Lg,useContext:Dt,useEffect:Lh,useImperativeHandle:Og,useInsertionEffect:Dg,useLayoutEffect:bg,useMemo:Mg,useReducer:Vh,useRef:xg,useState:function(){return Vh(ao)},useDebugValue:Mh,useDeferredValue:function(t){var e=bt();return Fg(e,Le.memoizedState,t)},useTransition:function(){var t=Vh(ao)[0],e=bt().memoizedState;return[t,e]},useMutableSource:Tg,useSyncExternalStore:Ig,useId:Ug,unstable_isNewReconciler:!1},pI={readContext:Dt,useCallback:Lg,useContext:Dt,useEffect:Lh,useImperativeHandle:Og,useInsertionEffect:Dg,useLayoutEffect:bg,useMemo:Mg,useReducer:Oh,useRef:xg,useState:function(){return Oh(ao)},useDebugValue:Mh,useDeferredValue:function(t){var e=bt();return Le===null?e.memoizedState=t:Fg(e,Le.memoizedState,t)},useTransition:function(){var t=Oh(ao)[0],e=bt().memoizedState;return[t,e]},useMutableSource:Tg,useSyncExternalStore:Ig,useId:Ug,unstable_isNewReconciler:!1};function Wt(t,e){if(t&&t.defaultProps){e=Ee({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Fh(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:Ee({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var hl={isMounted:function(t){return(t=t._reactInternals)?Vr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=dt(),i=lr(t),s=En(r,i);s.payload=e,n!=null&&(s.callback=n),e=ir(t,s,i),e!==null&&(Kt(e,t,i,r),rl(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=dt(),i=lr(t),s=En(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=ir(t,s,i),e!==null&&(Kt(e,t,i,r),rl(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=dt(),r=lr(t),i=En(n,r);i.tag=2,e!=null&&(i.callback=e),e=ir(t,i,r),e!==null&&(Kt(e,t,r,n),rl(e,t,r))}};function $g(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!Ks(n,r)||!Ks(i,s):!0}function Hg(t,e,n){var r=!1,i=tr,s=e.contextType;return typeof s=="object"&&s!==null?s=Dt(s):(i=yt(e)?Lr:Ye.current,r=e.contextTypes,s=(r=r!=null)?xi(t,i):tr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=hl,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function Wg(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&hl.enqueueReplaceState(e,e.state,null)}function Uh(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},Ah(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Dt(s):(s=yt(e)?Lr:Ye.current,i.context=xi(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Fh(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&hl.enqueueReplaceState(i,i.state,null),il(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function Fi(t,e){try{var n="",r=e;do n+=B1(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function zh(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function jh(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var mI=typeof WeakMap=="function"?WeakMap:Map;function qg(t,e,n){n=En(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){_l||(_l=!0,nd=r),jh(t,e)},n}function Gg(t,e,n){n=En(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){jh(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){jh(t,e),typeof r!="function"&&(or===null?or=new Set([this]):or.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Kg(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new mI;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=PI.bind(null,t,e,n),e.then(t,t))}function Qg(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Xg(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=En(-1,1),e.tag=2,ir(n,e,1))),n.lanes|=1),t)}var gI=mn.ReactCurrentOwner,_t=!1;function ht(t,e,n,r){e.child=t===null?gg(e,null,n,r):Vi(e,t.child,n,r)}function Yg(t,e,n,r,i){n=n.render;var s=e.ref;return Li(e,i),r=Dh(t,e,n,r,s,i),n=bh(),t!==null&&!_t?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Tn(t,e,i)):(we&&n&&mh(e),e.flags|=1,ht(t,e,r,i),e.child)}function Jg(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!ud(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,Zg(t,e,s,r,i)):(t=Sl(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ks,n(o,r)&&t.ref===e.ref)return Tn(t,e,i)}return e.flags|=1,t=cr(s,r),t.ref=e.ref,t.return=e,e.child=t}function Zg(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(Ks(s,r)&&t.ref===e.ref)if(_t=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(_t=!0);else return e.lanes=t.lanes,Tn(t,e,i)}return Bh(t,e,n,r,i)}function ey(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},pe(zi,Ct),Ct|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,pe(zi,Ct),Ct|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,pe(zi,Ct),Ct|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,pe(zi,Ct),Ct|=r;return ht(t,e,i,n),e.child}function ty(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Bh(t,e,n,r,i){var s=yt(n)?Lr:Ye.current;return s=xi(e,s),Li(e,i),n=Dh(t,e,n,r,s,i),r=bh(),t!==null&&!_t?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Tn(t,e,i)):(we&&r&&mh(e),e.flags|=1,ht(t,e,n,i),e.child)}function ny(t,e,n,r,i){if(yt(n)){var s=!0;Qa(e)}else s=!1;if(Li(e,i),e.stateNode===null)fl(t,e),Hg(e,n,r),Uh(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var u=o.context,h=n.contextType;typeof h=="object"&&h!==null?h=Dt(h):(h=yt(n)?Lr:Ye.current,h=xi(e,h));var f=n.getDerivedStateFromProps,m=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";m||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||u!==h)&&Wg(e,o,r,h),rr=!1;var p=e.memoizedState;o.state=p,il(e,r,o,i),u=e.memoizedState,l!==r||p!==u||gt.current||rr?(typeof f=="function"&&(Fh(e,n,f,r),u=e.memoizedState),(l=rr||$g(e,n,l,r,p,u,h))?(m||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=h,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,_g(t,e),l=e.memoizedProps,h=e.type===e.elementType?l:Wt(e.type,l),o.props=h,m=e.pendingProps,p=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Dt(u):(u=yt(n)?Lr:Ye.current,u=xi(e,u));var k=n.getDerivedStateFromProps;(f=typeof k=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==m||p!==u)&&Wg(e,o,r,u),rr=!1,p=e.memoizedState,o.state=p,il(e,r,o,i);var R=e.memoizedState;l!==m||p!==R||gt.current||rr?(typeof k=="function"&&(Fh(e,n,k,r),R=e.memoizedState),(h=rr||$g(e,n,h,r,p,R,u)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,R,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,R,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=R),o.props=r,o.state=R,o.context=u,r=h):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),r=!1)}return $h(t,e,n,r,s,i)}function $h(t,e,n,r,i,s){ty(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&ag(e,n,!1),Tn(t,e,s);r=e.stateNode,gI.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=Vi(e,t.child,null,s),e.child=Vi(e,null,l,s)):ht(t,e,l,s),e.memoizedState=r.state,i&&ag(e,n,!0),e.child}function ry(t){var e=t.stateNode;e.pendingContext?sg(t,e.pendingContext,e.pendingContext!==e.context):e.context&&sg(t,e.context,!1),kh(t,e.containerInfo)}function iy(t,e,n,r,i){return bi(),vh(i),e.flags|=256,ht(t,e,n,r),e.child}var Hh={dehydrated:null,treeContext:null,retryLane:0};function Wh(t){return{baseLanes:t,cachePool:null,transitions:null}}function sy(t,e,n){var r=e.pendingProps,i=Te.current,s=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(i&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),pe(Te,i&1),t===null)return _h(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Al(o,r,0,null),t=qr(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Wh(n),e.memoizedState=Hh,t):qh(e,o));if(i=t.memoizedState,i!==null&&(l=i.dehydrated,l!==null))return yI(t,e,o,r,l,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,l=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=cr(i,u),r.subtreeFlags=i.subtreeFlags&14680064),l!==null?s=cr(l,s):(s=qr(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?Wh(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Hh,r}return s=t.child,t=s.sibling,r=cr(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function qh(t,e){return e=Al({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function dl(t,e,n,r){return r!==null&&vh(r),Vi(e,t.child,null,n),t=qh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function yI(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=zh(Error(F(422))),dl(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=Al({mode:"visible",children:r.children},i,0,null),s=qr(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&Vi(e,t.child,null,o),e.child.memoizedState=Wh(o),e.memoizedState=Hh,s);if(!(e.mode&1))return dl(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error(F(419)),r=zh(s,r,void 0),dl(t,e,o,r)}if(l=(o&t.childLanes)!==0,_t||l){if(r=je,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,wn(t,i),Kt(r,t,i,-1))}return ld(),r=zh(Error(F(421))),dl(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=xI.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,kt=Zn(i.nextSibling),At=e,we=!0,Ht=null,t!==null&&(xt[Nt++]=_n,xt[Nt++]=vn,xt[Nt++]=Mr,_n=t.id,vn=t.overflow,Mr=e),e=qh(e,r.children),e.flags|=4096,e)}function oy(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),Ih(t.return,e,n)}function Gh(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function ay(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(ht(t,e,r.children,n),r=Te.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&oy(t,n,e);else if(t.tag===19)oy(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(pe(Te,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&sl(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),Gh(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&sl(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}Gh(e,!0,n,null,s);break;case"together":Gh(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function fl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Tn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Br|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(F(153));if(e.child!==null){for(t=e.child,n=cr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=cr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function _I(t,e,n){switch(e.tag){case 3:ry(e),bi();break;case 5:Eg(e);break;case 1:yt(e.type)&&Qa(e);break;case 4:kh(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;pe(tl,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(pe(Te,Te.current&1),e.flags|=128,null):n&e.child.childLanes?sy(t,e,n):(pe(Te,Te.current&1),t=Tn(t,e,n),t!==null?t.sibling:null);pe(Te,Te.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return ay(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),pe(Te,Te.current),r)break;return null;case 22:case 23:return e.lanes=0,ey(t,e,n)}return Tn(t,e,n)}var ly,Kh,uy,cy;ly=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Kh=function(){},uy=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,zr(rn.current);var s=null;switch(n){case"input":i=Ic(t,i),r=Ic(t,r),s=[];break;case"select":i=Ee({},i,{value:void 0}),r=Ee({},r,{value:void 0}),s=[];break;case"textarea":i=kc(t,i),r=kc(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=qa)}Rc(n,r);var o;n=null;for(h in i)if(!r.hasOwnProperty(h)&&i.hasOwnProperty(h)&&i[h]!=null)if(h==="style"){var l=i[h];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(Cs.hasOwnProperty(h)?s||(s=[]):(s=s||[]).push(h,null));for(h in r){var u=r[h];if(l=i!=null?i[h]:void 0,r.hasOwnProperty(h)&&u!==l&&(u!=null||l!=null))if(h==="style")if(l){for(o in l)!l.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&l[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(s||(s=[]),s.push(h,n)),n=u;else h==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(s=s||[]).push(h,u)):h==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(h,""+u):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(Cs.hasOwnProperty(h)?(u!=null&&h==="onScroll"&&ye("scroll",t),s||l===u||(s=[])):(s=s||[]).push(h,u))}n&&(s=s||[]).push("style",n);var h=s;(e.updateQueue=h)&&(e.flags|=4)}},cy=function(t,e,n,r){n!==r&&(e.flags|=4)};function uo(t,e){if(!we)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function Ze(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function vI(t,e,n){var r=e.pendingProps;switch(gh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ze(e),null;case 1:return yt(e.type)&&Ka(),Ze(e),null;case 3:return r=e.stateNode,Mi(),_e(gt),_e(Ye),Ph(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(Za(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Ht!==null&&(sd(Ht),Ht=null))),Kh(t,e),Ze(e),null;case 5:Ch(e);var i=zr(io.current);if(n=e.type,t!==null&&e.stateNode!=null)uy(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(F(166));return Ze(e),null}if(t=zr(rn.current),Za(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[nn]=e,r[Zs]=s,t=(e.mode&1)!==0,n){case"dialog":ye("cancel",r),ye("close",r);break;case"iframe":case"object":case"embed":ye("load",r);break;case"video":case"audio":for(i=0;i<Xs.length;i++)ye(Xs[i],r);break;case"source":ye("error",r);break;case"img":case"image":case"link":ye("error",r),ye("load",r);break;case"details":ye("toggle",r);break;case"input":Hp(r,s),ye("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},ye("invalid",r);break;case"textarea":Gp(r,s),ye("invalid",r)}Rc(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var l=s[o];o==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&Wa(r.textContent,l,t),i=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&Wa(r.textContent,l,t),i=["children",""+l]):Cs.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&ye("scroll",r)}switch(n){case"input":Ta(r),qp(r,s,!0);break;case"textarea":Ta(r),Qp(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=qa)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Xp(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[nn]=e,t[Zs]=r,ly(t,e,!1,!1),e.stateNode=t;e:{switch(o=Pc(n,r),n){case"dialog":ye("cancel",t),ye("close",t),i=r;break;case"iframe":case"object":case"embed":ye("load",t),i=r;break;case"video":case"audio":for(i=0;i<Xs.length;i++)ye(Xs[i],t);i=r;break;case"source":ye("error",t),i=r;break;case"img":case"image":case"link":ye("error",t),ye("load",t),i=r;break;case"details":ye("toggle",t),i=r;break;case"input":Hp(t,r),i=Ic(t,r),ye("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=Ee({},r,{value:void 0}),ye("invalid",t);break;case"textarea":Gp(t,r),i=kc(t,r),ye("invalid",t);break;default:i=r}Rc(n,i),l=i;for(s in l)if(l.hasOwnProperty(s)){var u=l[s];s==="style"?Zp(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&Yp(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Ns(t,u):typeof u=="number"&&Ns(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Cs.hasOwnProperty(s)?u!=null&&s==="onScroll"&&ye("scroll",t):u!=null&&dc(t,s,u,o))}switch(n){case"input":Ta(t),qp(t,r,!1);break;case"textarea":Ta(t),Qp(t);break;case"option":r.value!=null&&t.setAttribute("value",""+qn(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?_i(t,!!r.multiple,s,!1):r.defaultValue!=null&&_i(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=qa)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Ze(e),null;case 6:if(t&&e.stateNode!=null)cy(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(F(166));if(n=zr(io.current),zr(rn.current),Za(e)){if(r=e.stateNode,n=e.memoizedProps,r[nn]=e,(s=r.nodeValue!==n)&&(t=At,t!==null))switch(t.tag){case 3:Wa(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Wa(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[nn]=e,e.stateNode=r}return Ze(e),null;case 13:if(_e(Te),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(we&&kt!==null&&e.mode&1&&!(e.flags&128))fg(),bi(),e.flags|=98560,s=!1;else if(s=Za(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(F(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(F(317));s[nn]=e}else bi(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Ze(e),s=!1}else Ht!==null&&(sd(Ht),Ht=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||Te.current&1?Me===0&&(Me=3):ld())),e.updateQueue!==null&&(e.flags|=4),Ze(e),null);case 4:return Mi(),Kh(t,e),t===null&&Ys(e.stateNode.containerInfo),Ze(e),null;case 10:return Th(e.type._context),Ze(e),null;case 17:return yt(e.type)&&Ka(),Ze(e),null;case 19:if(_e(Te),s=e.memoizedState,s===null)return Ze(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)uo(s,!1);else{if(Me!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=sl(t),o!==null){for(e.flags|=128,uo(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return pe(Te,Te.current&1|2),e.child}t=t.sibling}s.tail!==null&&Re()>ji&&(e.flags|=128,r=!0,uo(s,!1),e.lanes=4194304)}else{if(!r)if(t=sl(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),uo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!we)return Ze(e),null}else 2*Re()-s.renderingStartTime>ji&&n!==1073741824&&(e.flags|=128,r=!0,uo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Re(),e.sibling=null,n=Te.current,pe(Te,r?n&1|2:n&1),e):(Ze(e),null);case 22:case 23:return ad(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Ct&1073741824&&(Ze(e),e.subtreeFlags&6&&(e.flags|=8192)):Ze(e),null;case 24:return null;case 25:return null}throw Error(F(156,e.tag))}function wI(t,e){switch(gh(e),e.tag){case 1:return yt(e.type)&&Ka(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Mi(),_e(gt),_e(Ye),Ph(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Ch(e),null;case 13:if(_e(Te),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(F(340));bi()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return _e(Te),null;case 4:return Mi(),null;case 10:return Th(e.type._context),null;case 22:case 23:return ad(),null;case 24:return null;default:return null}}var pl=!1,et=!1,EI=typeof WeakSet=="function"?WeakSet:Set,$=null;function Ui(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){ke(t,e,r)}else n.current=null}function Qh(t,e,n){try{n()}catch(r){ke(t,e,r)}}var hy=!1;function TI(t,e){if(ah=Va,t=$m(),Zc(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,l=-1,u=-1,h=0,f=0,m=t,p=null;t:for(;;){for(var k;m!==n||i!==0&&m.nodeType!==3||(l=o+i),m!==s||r!==0&&m.nodeType!==3||(u=o+r),m.nodeType===3&&(o+=m.nodeValue.length),(k=m.firstChild)!==null;)p=m,m=k;for(;;){if(m===t)break t;if(p===n&&++h===i&&(l=o),p===s&&++f===r&&(u=o),(k=m.nextSibling)!==null)break;m=p,p=m.parentNode}m=k}n=l===-1||u===-1?null:{start:l,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(lh={focusedElem:t,selectionRange:n},Va=!1,$=e;$!==null;)if(e=$,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,$=t;else for(;$!==null;){e=$;try{var R=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(R!==null){var x=R.memoizedProps,P=R.memoizedState,w=e.stateNode,_=w.getSnapshotBeforeUpdate(e.elementType===e.type?x:Wt(e.type,x),P);w.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var S=e.stateNode.containerInfo;S.nodeType===1?S.textContent="":S.nodeType===9&&S.documentElement&&S.removeChild(S.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(F(163))}}catch(D){ke(e,e.return,D)}if(t=e.sibling,t!==null){t.return=e.return,$=t;break}$=e.return}return R=hy,hy=!1,R}function co(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&Qh(e,n,s)}i=i.next}while(i!==r)}}function ml(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function Xh(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function dy(t){var e=t.alternate;e!==null&&(t.alternate=null,dy(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[nn],delete e[Zs],delete e[dh],delete e[iI],delete e[sI])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function fy(t){return t.tag===5||t.tag===3||t.tag===4}function py(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||fy(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Yh(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=qa));else if(r!==4&&(t=t.child,t!==null))for(Yh(t,e,n),t=t.sibling;t!==null;)Yh(t,e,n),t=t.sibling}function Jh(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(Jh(t,e,n),t=t.sibling;t!==null;)Jh(t,e,n),t=t.sibling}var Ge=null,qt=!1;function sr(t,e,n){for(n=n.child;n!==null;)my(t,e,n),n=n.sibling}function my(t,e,n){if(tn&&typeof tn.onCommitFiberUnmount=="function")try{tn.onCommitFiberUnmount(Ra,n)}catch{}switch(n.tag){case 5:et||Ui(n,e);case 6:var r=Ge,i=qt;Ge=null,sr(t,e,n),Ge=r,qt=i,Ge!==null&&(qt?(t=Ge,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Ge.removeChild(n.stateNode));break;case 18:Ge!==null&&(qt?(t=Ge,n=n.stateNode,t.nodeType===8?hh(t.parentNode,n):t.nodeType===1&&hh(t,n),Bs(t)):hh(Ge,n.stateNode));break;case 4:r=Ge,i=qt,Ge=n.stateNode.containerInfo,qt=!0,sr(t,e,n),Ge=r,qt=i;break;case 0:case 11:case 14:case 15:if(!et&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Qh(n,e,o),i=i.next}while(i!==r)}sr(t,e,n);break;case 1:if(!et&&(Ui(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){ke(n,e,l)}sr(t,e,n);break;case 21:sr(t,e,n);break;case 22:n.mode&1?(et=(r=et)||n.memoizedState!==null,sr(t,e,n),et=r):sr(t,e,n);break;default:sr(t,e,n)}}function gy(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new EI),e.forEach(function(r){var i=NI.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function Gt(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:Ge=l.stateNode,qt=!1;break e;case 3:Ge=l.stateNode.containerInfo,qt=!0;break e;case 4:Ge=l.stateNode.containerInfo,qt=!0;break e}l=l.return}if(Ge===null)throw Error(F(160));my(s,o,i),Ge=null,qt=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(h){ke(i,e,h)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)yy(e,t),e=e.sibling}function yy(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Gt(e,t),on(t),r&4){try{co(3,t,t.return),ml(3,t)}catch(x){ke(t,t.return,x)}try{co(5,t,t.return)}catch(x){ke(t,t.return,x)}}break;case 1:Gt(e,t),on(t),r&512&&n!==null&&Ui(n,n.return);break;case 5:if(Gt(e,t),on(t),r&512&&n!==null&&Ui(n,n.return),t.flags&32){var i=t.stateNode;try{Ns(i,"")}catch(x){ke(t,t.return,x)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,l=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&Wp(i,s),Pc(l,o);var h=Pc(l,s);for(o=0;o<u.length;o+=2){var f=u[o],m=u[o+1];f==="style"?Zp(i,m):f==="dangerouslySetInnerHTML"?Yp(i,m):f==="children"?Ns(i,m):dc(i,f,m,h)}switch(l){case"input":Sc(i,s);break;case"textarea":Kp(i,s);break;case"select":var p=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var k=s.value;k!=null?_i(i,!!s.multiple,k,!1):p!==!!s.multiple&&(s.defaultValue!=null?_i(i,!!s.multiple,s.defaultValue,!0):_i(i,!!s.multiple,s.multiple?[]:"",!1))}i[Zs]=s}catch(x){ke(t,t.return,x)}}break;case 6:if(Gt(e,t),on(t),r&4){if(t.stateNode===null)throw Error(F(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(x){ke(t,t.return,x)}}break;case 3:if(Gt(e,t),on(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Bs(e.containerInfo)}catch(x){ke(t,t.return,x)}break;case 4:Gt(e,t),on(t);break;case 13:Gt(e,t),on(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(td=Re())),r&4&&gy(t);break;case 22:if(f=n!==null&&n.memoizedState!==null,t.mode&1?(et=(h=et)||f,Gt(e,t),et=h):Gt(e,t),on(t),r&8192){if(h=t.memoizedState!==null,(t.stateNode.isHidden=h)&&!f&&t.mode&1)for($=t,f=t.child;f!==null;){for(m=$=f;$!==null;){switch(p=$,k=p.child,p.tag){case 0:case 11:case 14:case 15:co(4,p,p.return);break;case 1:Ui(p,p.return);var R=p.stateNode;if(typeof R.componentWillUnmount=="function"){r=p,n=p.return;try{e=r,R.props=e.memoizedProps,R.state=e.memoizedState,R.componentWillUnmount()}catch(x){ke(r,n,x)}}break;case 5:Ui(p,p.return);break;case 22:if(p.memoizedState!==null){wy(m);continue}}k!==null?(k.return=p,$=k):wy(m)}f=f.sibling}e:for(f=null,m=t;;){if(m.tag===5){if(f===null){f=m;try{i=m.stateNode,h?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=m.stateNode,u=m.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,l.style.display=Jp("display",o))}catch(x){ke(t,t.return,x)}}}else if(m.tag===6){if(f===null)try{m.stateNode.nodeValue=h?"":m.memoizedProps}catch(x){ke(t,t.return,x)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===t)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===t)break e;for(;m.sibling===null;){if(m.return===null||m.return===t)break e;f===m&&(f=null),m=m.return}f===m&&(f=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Gt(e,t),on(t),r&4&&gy(t);break;case 21:break;default:Gt(e,t),on(t)}}function on(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(fy(n)){var r=n;break e}n=n.return}throw Error(F(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Ns(i,""),r.flags&=-33);var s=py(t);Jh(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,l=py(t);Yh(t,l,o);break;default:throw Error(F(161))}}catch(u){ke(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function II(t,e,n){$=t,_y(t)}function _y(t,e,n){for(var r=(t.mode&1)!==0;$!==null;){var i=$,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||pl;if(!o){var l=i.alternate,u=l!==null&&l.memoizedState!==null||et;l=pl;var h=et;if(pl=o,(et=u)&&!h)for($=i;$!==null;)o=$,u=o.child,o.tag===22&&o.memoizedState!==null?Ey(i):u!==null?(u.return=o,$=u):Ey(i);for(;s!==null;)$=s,_y(s),s=s.sibling;$=i,pl=l,et=h}vy(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,$=s):vy(t)}}function vy(t){for(;$!==null;){var e=$;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:et||ml(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!et)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:Wt(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&wg(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}wg(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var h=e.alternate;if(h!==null){var f=h.memoizedState;if(f!==null){var m=f.dehydrated;m!==null&&Bs(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(F(163))}et||e.flags&512&&Xh(e)}catch(p){ke(e,e.return,p)}}if(e===t){$=null;break}if(n=e.sibling,n!==null){n.return=e.return,$=n;break}$=e.return}}function wy(t){for(;$!==null;){var e=$;if(e===t){$=null;break}var n=e.sibling;if(n!==null){n.return=e.return,$=n;break}$=e.return}}function Ey(t){for(;$!==null;){var e=$;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{ml(4,e)}catch(u){ke(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){ke(e,i,u)}}var s=e.return;try{Xh(e)}catch(u){ke(e,s,u)}break;case 5:var o=e.return;try{Xh(e)}catch(u){ke(e,o,u)}}}catch(u){ke(e,e.return,u)}if(e===t){$=null;break}var l=e.sibling;if(l!==null){l.return=e.return,$=l;break}$=e.return}}var SI=Math.ceil,gl=mn.ReactCurrentDispatcher,Zh=mn.ReactCurrentOwner,Vt=mn.ReactCurrentBatchConfig,re=0,je=null,Ne=null,Ke=0,Ct=0,zi=er(0),Me=0,ho=null,Br=0,yl=0,ed=0,fo=null,vt=null,td=0,ji=1/0,In=null,_l=!1,nd=null,or=null,vl=!1,ar=null,wl=0,po=0,rd=null,El=-1,Tl=0;function dt(){return re&6?Re():El!==-1?El:El=Re()}function lr(t){return t.mode&1?re&2&&Ke!==0?Ke&-Ke:aI.transition!==null?(Tl===0&&(Tl=pm()),Tl):(t=ae,t!==0||(t=window.event,t=t===void 0?16:Im(t.type)),t):1}function Kt(t,e,n,r){if(50<po)throw po=0,rd=null,Error(F(185));Ms(t,n,r),(!(re&2)||t!==je)&&(t===je&&(!(re&2)&&(yl|=n),Me===4&&ur(t,Ke)),wt(t,r),n===1&&re===0&&!(e.mode&1)&&(ji=Re()+500,Xa&&nr()))}function wt(t,e){var n=t.callbackNode;aT(t,e);var r=Na(t,t===je?Ke:0);if(r===0)n!==null&&hm(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&hm(n),e===1)t.tag===0?oI(Iy.bind(null,t)):lg(Iy.bind(null,t)),nI(function(){!(re&6)&&nr()}),n=null;else{switch(mm(r)){case 1:n=Lc;break;case 4:n=dm;break;case 16:n=Ca;break;case 536870912:n=fm;break;default:n=Ca}n=Ny(n,Ty.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function Ty(t,e){if(El=-1,Tl=0,re&6)throw Error(F(327));var n=t.callbackNode;if(Bi()&&t.callbackNode!==n)return null;var r=Na(t,t===je?Ke:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=Il(t,r);else{e=r;var i=re;re|=2;var s=Ay();(je!==t||Ke!==e)&&(In=null,ji=Re()+500,Hr(t,e));do try{CI();break}catch(l){Sy(t,l)}while(!0);Eh(),gl.current=s,re=i,Ne!==null?e=0:(je=null,Ke=0,e=Me)}if(e!==0){if(e===2&&(i=Mc(t),i!==0&&(r=i,e=id(t,i))),e===1)throw n=ho,Hr(t,0),ur(t,r),wt(t,Re()),n;if(e===6)ur(t,r);else{if(i=t.current.alternate,!(r&30)&&!AI(i)&&(e=Il(t,r),e===2&&(s=Mc(t),s!==0&&(r=s,e=id(t,s))),e===1))throw n=ho,Hr(t,0),ur(t,r),wt(t,Re()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(F(345));case 2:Wr(t,vt,In);break;case 3:if(ur(t,r),(r&130023424)===r&&(e=td+500-Re(),10<e)){if(Na(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){dt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=ch(Wr.bind(null,t,vt,In),e);break}Wr(t,vt,In);break;case 4:if(ur(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-Bt(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=Re()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*SI(r/1960))-r,10<r){t.timeoutHandle=ch(Wr.bind(null,t,vt,In),r);break}Wr(t,vt,In);break;case 5:Wr(t,vt,In);break;default:throw Error(F(329))}}}return wt(t,Re()),t.callbackNode===n?Ty.bind(null,t):null}function id(t,e){var n=fo;return t.current.memoizedState.isDehydrated&&(Hr(t,e).flags|=256),t=Il(t,e),t!==2&&(e=vt,vt=n,e!==null&&sd(e)),t}function sd(t){vt===null?vt=t:vt.push.apply(vt,t)}function AI(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!$t(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ur(t,e){for(e&=~ed,e&=~yl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Bt(e),r=1<<n;t[n]=-1,e&=~r}}function Iy(t){if(re&6)throw Error(F(327));Bi();var e=Na(t,0);if(!(e&1))return wt(t,Re()),null;var n=Il(t,e);if(t.tag!==0&&n===2){var r=Mc(t);r!==0&&(e=r,n=id(t,r))}if(n===1)throw n=ho,Hr(t,0),ur(t,e),wt(t,Re()),n;if(n===6)throw Error(F(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Wr(t,vt,In),wt(t,Re()),null}function od(t,e){var n=re;re|=1;try{return t(e)}finally{re=n,re===0&&(ji=Re()+500,Xa&&nr())}}function $r(t){ar!==null&&ar.tag===0&&!(re&6)&&Bi();var e=re;re|=1;var n=Vt.transition,r=ae;try{if(Vt.transition=null,ae=1,t)return t()}finally{ae=r,Vt.transition=n,re=e,!(re&6)&&nr()}}function ad(){Ct=zi.current,_e(zi)}function Hr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,tI(n)),Ne!==null)for(n=Ne.return;n!==null;){var r=n;switch(gh(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ka();break;case 3:Mi(),_e(gt),_e(Ye),Ph();break;case 5:Ch(r);break;case 4:Mi();break;case 13:_e(Te);break;case 19:_e(Te);break;case 10:Th(r.type._context);break;case 22:case 23:ad()}n=n.return}if(je=t,Ne=t=cr(t.current,null),Ke=Ct=e,Me=0,ho=null,ed=yl=Br=0,vt=fo=null,Ur!==null){for(e=0;e<Ur.length;e++)if(n=Ur[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}Ur=null}return t}function Sy(t,e){do{var n=Ne;try{if(Eh(),ol.current=cl,al){for(var r=Ie.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}al=!1}if(jr=0,ze=Le=Ie=null,so=!1,oo=0,Zh.current=null,n===null||n.return===null){Me=1,ho=e,Ne=null;break}e:{var s=t,o=n.return,l=n,u=e;if(e=Ke,l.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var h=u,f=l,m=f.tag;if(!(f.mode&1)&&(m===0||m===11||m===15)){var p=f.alternate;p?(f.updateQueue=p.updateQueue,f.memoizedState=p.memoizedState,f.lanes=p.lanes):(f.updateQueue=null,f.memoizedState=null)}var k=Qg(o);if(k!==null){k.flags&=-257,Xg(k,o,l,s,e),k.mode&1&&Kg(s,h,e),e=k,u=h;var R=e.updateQueue;if(R===null){var x=new Set;x.add(u),e.updateQueue=x}else R.add(u);break e}else{if(!(e&1)){Kg(s,h,e),ld();break e}u=Error(F(426))}}else if(we&&l.mode&1){var P=Qg(o);if(P!==null){!(P.flags&65536)&&(P.flags|=256),Xg(P,o,l,s,e),vh(Fi(u,l));break e}}s=u=Fi(u,l),Me!==4&&(Me=2),fo===null?fo=[s]:fo.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var w=qg(s,u,e);vg(s,w);break e;case 1:l=u;var _=s.type,S=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||S!==null&&typeof S.componentDidCatch=="function"&&(or===null||!or.has(S)))){s.flags|=65536,e&=-e,s.lanes|=e;var D=Gg(s,l,e);vg(s,D);break e}}s=s.return}while(s!==null)}Cy(n)}catch(b){e=b,Ne===n&&n!==null&&(Ne=n=n.return);continue}break}while(!0)}function Ay(){var t=gl.current;return gl.current=cl,t===null?cl:t}function ld(){(Me===0||Me===3||Me===2)&&(Me=4),je===null||!(Br&268435455)&&!(yl&268435455)||ur(je,Ke)}function Il(t,e){var n=re;re|=2;var r=Ay();(je!==t||Ke!==e)&&(In=null,Hr(t,e));do try{kI();break}catch(i){Sy(t,i)}while(!0);if(Eh(),re=n,gl.current=r,Ne!==null)throw Error(F(261));return je=null,Ke=0,Me}function kI(){for(;Ne!==null;)ky(Ne)}function CI(){for(;Ne!==null&&!J1();)ky(Ne)}function ky(t){var e=xy(t.alternate,t,Ct);t.memoizedProps=t.pendingProps,e===null?Cy(t):Ne=e,Zh.current=null}function Cy(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=wI(n,e),n!==null){n.flags&=32767,Ne=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Me=6,Ne=null;return}}else if(n=vI(n,e,Ct),n!==null){Ne=n;return}if(e=e.sibling,e!==null){Ne=e;return}Ne=e=t}while(e!==null);Me===0&&(Me=5)}function Wr(t,e,n){var r=ae,i=Vt.transition;try{Vt.transition=null,ae=1,RI(t,e,n,r)}finally{Vt.transition=i,ae=r}return null}function RI(t,e,n,r){do Bi();while(ar!==null);if(re&6)throw Error(F(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(F(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(lT(t,s),t===je&&(Ne=je=null,Ke=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||vl||(vl=!0,Ny(Ca,function(){return Bi(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Vt.transition,Vt.transition=null;var o=ae;ae=1;var l=re;re|=4,Zh.current=null,TI(t,n),yy(n,t),KT(lh),Va=!!ah,lh=ah=null,t.current=n,II(n),Z1(),re=l,ae=o,Vt.transition=s}else t.current=n;if(vl&&(vl=!1,ar=t,wl=i),s=t.pendingLanes,s===0&&(or=null),nT(n.stateNode),wt(t,Re()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(_l)throw _l=!1,t=nd,nd=null,t;return wl&1&&t.tag!==0&&Bi(),s=t.pendingLanes,s&1?t===rd?po++:(po=0,rd=t):po=0,nr(),null}function Bi(){if(ar!==null){var t=mm(wl),e=Vt.transition,n=ae;try{if(Vt.transition=null,ae=16>t?16:t,ar===null)var r=!1;else{if(t=ar,ar=null,wl=0,re&6)throw Error(F(331));var i=re;for(re|=4,$=t.current;$!==null;){var s=$,o=s.child;if($.flags&16){var l=s.deletions;if(l!==null){for(var u=0;u<l.length;u++){var h=l[u];for($=h;$!==null;){var f=$;switch(f.tag){case 0:case 11:case 15:co(8,f,s)}var m=f.child;if(m!==null)m.return=f,$=m;else for(;$!==null;){f=$;var p=f.sibling,k=f.return;if(dy(f),f===h){$=null;break}if(p!==null){p.return=k,$=p;break}$=k}}}var R=s.alternate;if(R!==null){var x=R.child;if(x!==null){R.child=null;do{var P=x.sibling;x.sibling=null,x=P}while(x!==null)}}$=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,$=o;else e:for(;$!==null;){if(s=$,s.flags&2048)switch(s.tag){case 0:case 11:case 15:co(9,s,s.return)}var w=s.sibling;if(w!==null){w.return=s.return,$=w;break e}$=s.return}}var _=t.current;for($=_;$!==null;){o=$;var S=o.child;if(o.subtreeFlags&2064&&S!==null)S.return=o,$=S;else e:for(o=_;$!==null;){if(l=$,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:ml(9,l)}}catch(b){ke(l,l.return,b)}if(l===o){$=null;break e}var D=l.sibling;if(D!==null){D.return=l.return,$=D;break e}$=l.return}}if(re=i,nr(),tn&&typeof tn.onPostCommitFiberRoot=="function")try{tn.onPostCommitFiberRoot(Ra,t)}catch{}r=!0}return r}finally{ae=n,Vt.transition=e}}return!1}function Ry(t,e,n){e=Fi(n,e),e=qg(t,e,1),t=ir(t,e,1),e=dt(),t!==null&&(Ms(t,1,e),wt(t,e))}function ke(t,e,n){if(t.tag===3)Ry(t,t,n);else for(;e!==null;){if(e.tag===3){Ry(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(or===null||!or.has(r))){t=Fi(n,t),t=Gg(e,t,1),e=ir(e,t,1),t=dt(),e!==null&&(Ms(e,1,t),wt(e,t));break}}e=e.return}}function PI(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=dt(),t.pingedLanes|=t.suspendedLanes&n,je===t&&(Ke&n)===n&&(Me===4||Me===3&&(Ke&130023424)===Ke&&500>Re()-td?Hr(t,0):ed|=n),wt(t,e)}function Py(t,e){e===0&&(t.mode&1?(e=xa,xa<<=1,!(xa&130023424)&&(xa=4194304)):e=1);var n=dt();t=wn(t,e),t!==null&&(Ms(t,e,n),wt(t,n))}function xI(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Py(t,n)}function NI(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(F(314))}r!==null&&r.delete(e),Py(t,n)}var xy;xy=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||gt.current)_t=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return _t=!1,_I(t,e,n);_t=!!(t.flags&131072)}else _t=!1,we&&e.flags&1048576&&ug(e,Ja,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;fl(t,e),t=e.pendingProps;var i=xi(e,Ye.current);Li(e,n),i=Dh(null,e,r,t,i,n);var s=bh();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,yt(r)?(s=!0,Qa(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Ah(e),i.updater=hl,e.stateNode=i,i._reactInternals=e,Uh(e,r,t,n),e=$h(null,e,r,!0,s,n)):(e.tag=0,we&&s&&mh(e),ht(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(fl(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=bI(r),t=Wt(r,t),i){case 0:e=Bh(null,e,r,t,n);break e;case 1:e=ny(null,e,r,t,n);break e;case 11:e=Yg(null,e,r,t,n);break e;case 14:e=Jg(null,e,r,Wt(r.type,t),n);break e}throw Error(F(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Wt(r,i),Bh(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Wt(r,i),ny(t,e,r,i,n);case 3:e:{if(ry(e),t===null)throw Error(F(387));r=e.pendingProps,s=e.memoizedState,i=s.element,_g(t,e),il(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=Fi(Error(F(423)),e),e=iy(t,e,r,n,i);break e}else if(r!==i){i=Fi(Error(F(424)),e),e=iy(t,e,r,n,i);break e}else for(kt=Zn(e.stateNode.containerInfo.firstChild),At=e,we=!0,Ht=null,n=gg(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(bi(),r===i){e=Tn(t,e,n);break e}ht(t,e,r,n)}e=e.child}return e;case 5:return Eg(e),t===null&&_h(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,uh(r,i)?o=null:s!==null&&uh(r,s)&&(e.flags|=32),ty(t,e),ht(t,e,o,n),e.child;case 6:return t===null&&_h(e),null;case 13:return sy(t,e,n);case 4:return kh(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=Vi(e,null,r,n):ht(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Wt(r,i),Yg(t,e,r,i,n);case 7:return ht(t,e,e.pendingProps,n),e.child;case 8:return ht(t,e,e.pendingProps.children,n),e.child;case 12:return ht(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,pe(tl,r._currentValue),r._currentValue=o,s!==null)if($t(s.value,o)){if(s.children===i.children&&!gt.current){e=Tn(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){o=s.child;for(var u=l.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=En(-1,n&-n),u.tag=2;var h=s.updateQueue;if(h!==null){h=h.shared;var f=h.pending;f===null?u.next=u:(u.next=f.next,f.next=u),h.pending=u}}s.lanes|=n,u=s.alternate,u!==null&&(u.lanes|=n),Ih(s.return,n,e),l.lanes|=n;break}u=u.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(F(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),Ih(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}ht(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,Li(e,n),i=Dt(i),r=r(i),e.flags|=1,ht(t,e,r,n),e.child;case 14:return r=e.type,i=Wt(r,e.pendingProps),i=Wt(r.type,i),Jg(t,e,r,i,n);case 15:return Zg(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Wt(r,i),fl(t,e),e.tag=1,yt(r)?(t=!0,Qa(e)):t=!1,Li(e,n),Hg(e,r,i),Uh(e,r,i,n),$h(null,e,r,!0,t,n);case 19:return ay(t,e,n);case 22:return ey(t,e,n)}throw Error(F(156,e.tag))};function Ny(t,e){return cm(t,e)}function DI(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ot(t,e,n,r){return new DI(t,e,n,r)}function ud(t){return t=t.prototype,!(!t||!t.isReactComponent)}function bI(t){if(typeof t=="function")return ud(t)?1:0;if(t!=null){if(t=t.$$typeof,t===mc)return 11;if(t===_c)return 14}return 2}function cr(t,e){var n=t.alternate;return n===null?(n=Ot(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Sl(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")ud(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case yi:return qr(n.children,i,s,e);case fc:o=8,i|=8;break;case pc:return t=Ot(12,n,e,i|2),t.elementType=pc,t.lanes=s,t;case gc:return t=Ot(13,n,e,i),t.elementType=gc,t.lanes=s,t;case yc:return t=Ot(19,n,e,i),t.elementType=yc,t.lanes=s,t;case zp:return Al(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Fp:o=10;break e;case Up:o=9;break e;case mc:o=11;break e;case _c:o=14;break e;case Wn:o=16,r=null;break e}throw Error(F(130,t==null?t:typeof t,""))}return e=Ot(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function qr(t,e,n,r){return t=Ot(7,t,r,e),t.lanes=n,t}function Al(t,e,n,r){return t=Ot(22,t,r,e),t.elementType=zp,t.lanes=n,t.stateNode={isHidden:!1},t}function cd(t,e,n){return t=Ot(6,t,null,e),t.lanes=n,t}function hd(t,e,n){return e=Ot(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function VI(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Fc(0),this.expirationTimes=Fc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Fc(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function dd(t,e,n,r,i,s,o,l,u){return t=new VI(t,e,n,l,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Ot(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ah(s),t}function OI(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:gi,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function Dy(t){if(!t)return tr;t=t._reactInternals;e:{if(Vr(t)!==t||t.tag!==1)throw Error(F(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(yt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(F(171))}if(t.tag===1){var n=t.type;if(yt(n))return og(t,n,e)}return e}function by(t,e,n,r,i,s,o,l,u){return t=dd(n,r,!0,t,i,s,o,l,u),t.context=Dy(null),n=t.current,r=dt(),i=lr(n),s=En(r,i),s.callback=e??null,ir(n,s,i),t.current.lanes=i,Ms(t,i,r),wt(t,r),t}function kl(t,e,n,r){var i=e.current,s=dt(),o=lr(i);return n=Dy(n),e.context===null?e.context=n:e.pendingContext=n,e=En(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=ir(i,e,o),t!==null&&(Kt(t,i,o,s),rl(t,i,o)),o}function Cl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Vy(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function fd(t,e){Vy(t,e),(t=t.alternate)&&Vy(t,e)}function LI(){return null}var Oy=typeof reportError=="function"?reportError:function(t){console.error(t)};function pd(t){this._internalRoot=t}Rl.prototype.render=pd.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(F(409));kl(t,e,null,null)},Rl.prototype.unmount=pd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;$r(function(){kl(null,t,null,null)}),e[gn]=null}};function Rl(t){this._internalRoot=t}Rl.prototype.unstable_scheduleHydration=function(t){if(t){var e=_m();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Xn.length&&e!==0&&e<Xn[n].priority;n++);Xn.splice(n,0,t),n===0&&Em(t)}};function md(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Pl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Ly(){}function MI(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var h=Cl(o);s.call(h)}}var o=by(e,r,t,0,null,!1,!1,"",Ly);return t._reactRootContainer=o,t[gn]=o.current,Ys(t.nodeType===8?t.parentNode:t),$r(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var l=r;r=function(){var h=Cl(u);l.call(h)}}var u=dd(t,0,!1,null,null,!1,!1,"",Ly);return t._reactRootContainer=u,t[gn]=u.current,Ys(t.nodeType===8?t.parentNode:t),$r(function(){kl(e,u,n,r)}),u}function xl(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var l=i;i=function(){var u=Cl(o);l.call(u)}}kl(e,o,t,i)}else o=MI(n,e,t,i,r);return Cl(o)}gm=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Ls(e.pendingLanes);n!==0&&(Uc(e,n|1),wt(e,Re()),!(re&6)&&(ji=Re()+500,nr()))}break;case 13:$r(function(){var r=wn(t,1);if(r!==null){var i=dt();Kt(r,t,1,i)}}),fd(t,1)}},zc=function(t){if(t.tag===13){var e=wn(t,134217728);if(e!==null){var n=dt();Kt(e,t,134217728,n)}fd(t,134217728)}},ym=function(t){if(t.tag===13){var e=lr(t),n=wn(t,e);if(n!==null){var r=dt();Kt(n,t,e,r)}fd(t,e)}},_m=function(){return ae},vm=function(t,e){var n=ae;try{return ae=t,e()}finally{ae=n}},Dc=function(t,e,n){switch(e){case"input":if(Sc(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=Ga(r);if(!i)throw Error(F(90));$p(r),Sc(r,i)}}}break;case"textarea":Kp(t,n);break;case"select":e=n.value,e!=null&&_i(t,!!n.multiple,e,!1)}},rm=od,im=$r;var FI={usingClientEntryPoint:!1,Events:[eo,Ri,Ga,tm,nm,od]},mo={findFiberByHostInstance:Or,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},UI={bundleType:mo.bundleType,version:mo.version,rendererPackageName:mo.rendererPackageName,rendererConfig:mo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:mn.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=lm(t),t===null?null:t.stateNode},findFiberByHostInstance:mo.findFiberByHostInstance||LI,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Nl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Nl.isDisabled&&Nl.supportsFiber)try{Ra=Nl.inject(UI),tn=Nl}catch{}}Tt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=FI,Tt.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!md(e))throw Error(F(200));return OI(t,e,null,n)},Tt.createRoot=function(t,e){if(!md(t))throw Error(F(299));var n=!1,r="",i=Oy;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=dd(t,1,!1,null,null,n,!1,r,i),t[gn]=e.current,Ys(t.nodeType===8?t.parentNode:t),new pd(e)},Tt.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(F(188)):(t=Object.keys(t).join(","),Error(F(268,t)));return t=lm(e),t=t===null?null:t.stateNode,t},Tt.flushSync=function(t){return $r(t)},Tt.hydrate=function(t,e,n){if(!Pl(e))throw Error(F(200));return xl(null,t,e,!0,n)},Tt.hydrateRoot=function(t,e,n){if(!md(t))throw Error(F(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=Oy;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=by(e,null,t,1,n??null,i,!1,s,o),t[gn]=e.current,Ys(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new Rl(e)},Tt.render=function(t,e,n){if(!Pl(e))throw Error(F(200));return xl(null,t,e,!1,n)},Tt.unmountComponentAtNode=function(t){if(!Pl(t))throw Error(F(40));return t._reactRootContainer?($r(function(){xl(null,null,t,!1,function(){t._reactRootContainer=null,t[gn]=null})}),!0):!1},Tt.unstable_batchedUpdates=od,Tt.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!Pl(n))throw Error(F(200));if(t==null||t._reactInternals===void 0)throw Error(F(38));return xl(t,e,n,!1,r)},Tt.version="18.3.1-next-f1338f8080-20240426";function My(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(My)}catch(t){console.error(t)}}My(),Dp.exports=Tt;var zI=Dp.exports,Fy=zI;lc.createRoot=Fy.createRoot,lc.hydrateRoot=Fy.hydrateRoot;const jI=({onClose:t})=>{const[e,n]=wa.useState(!0);return wa.useEffect(()=>{const r=i=>{i.key==="Escape"&&(n(!1),t())};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[t]),e?mt.jsxs("div",{style:{position:"fixed",top:"20px",right:"20px",zIndex:1e6,background:"white",color:"#111",border:"1px solid #ddd",borderRadius:"8px",padding:"16px",boxShadow:"0 6px 20px rgba(0,0,0,0.15)",maxWidth:"420px",fontFamily:"Segoe UI, Arial, sans-serif"},children:[mt.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[mt.jsx("h3",{style:{margin:0,fontSize:"16px",fontWeight:600},children:"DesAInR Assistant"}),mt.jsx("button",{onClick:()=>{n(!1),t()},style:{border:"1px solid #ddd",borderRadius:"6px",padding:"4px 8px",background:"#f7f7f7",cursor:"pointer",fontSize:"12px"},children:"Close"})]}),mt.jsxs("div",{style:{fontSize:"14px",lineHeight:"1.5"},children:[mt.jsx("p",{children:"AI-powered writing assistant ready to help you:"}),mt.jsxs("ul",{style:{margin:"8px 0",paddingLeft:"20px"},children:[mt.jsx("li",{children:"Refine and clarify text"}),mt.jsx("li",{children:"Translate content"}),mt.jsx("li",{children:"Analyze pages"}),mt.jsx("li",{children:"Apply custom actions"})]}),mt.jsxs("p",{style:{fontSize:"12px",color:"#666",marginTop:"12px"},children:["Select text on any page to see options, or press ",mt.jsx("strong",{children:"Ctrl/Cmd+M"})," to toggle this overlay."]})]})]}):null};function BI(t,e){const n=lc.createRoot(t);return n.render(mt.jsx(jI,{onClose:e})),{detach:()=>{n.unmount(),t.remove()}}}const $I=Object.freeze(Object.defineProperty({__proto__:null,mountOverlay:BI},Symbol.toStringTag,{value:"Module"})),HI=()=>{};var Uy={};/**
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
 */const zy=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},WI=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],l=t[n++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},jy={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,l=o?t[i+1]:0,u=i+2<t.length,h=u?t[i+2]:0,f=s>>2,m=(s&3)<<4|l>>4;let p=(l&15)<<2|h>>6,k=h&63;u||(k=64,o||(p=64)),r.push(n[f],n[m],n[p],n[k])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(zy(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):WI(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const h=i<t.length?n[t.charAt(i)]:64;++i;const m=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||h==null||m==null)throw new qI;const p=s<<2|l>>4;if(r.push(p),h!==64){const k=l<<4&240|h>>2;if(r.push(k),m!==64){const R=h<<6&192|m;r.push(R)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class qI extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const GI=function(t){const e=zy(t);return jy.encodeByteArray(e,!0)},Dl=function(t){return GI(t).replace(/\./g,"")},By=function(t){try{return jy.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function KI(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const QI=()=>KI().__FIREBASE_DEFAULTS__,XI=()=>{if(typeof process>"u"||typeof Uy>"u")return;const t=Uy.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},YI=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&By(t[1]);return e&&JSON.parse(e)},bl=()=>{try{return HI()||QI()||XI()||YI()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},$y=t=>{var e,n;return(n=(e=bl())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},JI=t=>{const e=$y(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},Hy=()=>{var t;return(t=bl())===null||t===void 0?void 0:t.config},Wy=t=>{var e;return(e=bl())===null||e===void 0?void 0:e[`_${t}`]};/**
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
 */class ZI{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function $i(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function qy(t){return(await fetch(t,{credentials:"include"})).ok}/**
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
 */function eS(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Dl(JSON.stringify(n)),Dl(JSON.stringify(o)),""].join(".")}const go={};function tS(){const t={prod:[],emulator:[]};for(const e of Object.keys(go))go[e]?t.emulator.push(e):t.prod.push(e);return t}function nS(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let Gy=!1;function Ky(t,e){if(typeof window>"u"||typeof document>"u"||!$i(window.location.host)||go[t]===e||go[t]||Gy)return;go[t]=e;function n(p){return`__firebase__banner__${p}`}const r="__firebase__banner",s=tS().prod.length>0;function o(){const p=document.getElementById(r);p&&p.remove()}function l(p){p.style.display="flex",p.style.background="#7faaf0",p.style.position="fixed",p.style.bottom="5px",p.style.left="5px",p.style.padding=".5em",p.style.borderRadius="5px",p.style.alignItems="center"}function u(p,k){p.setAttribute("width","24"),p.setAttribute("id",k),p.setAttribute("height","24"),p.setAttribute("viewBox","0 0 24 24"),p.setAttribute("fill","none"),p.style.marginLeft="-6px"}function h(){const p=document.createElement("span");return p.style.cursor="pointer",p.style.marginLeft="16px",p.style.fontSize="24px",p.innerHTML=" &times;",p.onclick=()=>{Gy=!0,o()},p}function f(p,k){p.setAttribute("id",k),p.innerText="Learn more",p.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",p.setAttribute("target","__blank"),p.style.paddingLeft="5px",p.style.textDecoration="underline"}function m(){const p=nS(r),k=n("text"),R=document.getElementById(k)||document.createElement("span"),x=n("learnmore"),P=document.getElementById(x)||document.createElement("a"),w=n("preprendIcon"),_=document.getElementById(w)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(p.created){const S=p.element;l(S),f(P,x);const D=h();u(_,w),S.append(_,R,P,D),document.body.appendChild(S)}s?(R.innerText="Preview backend disconnected.",_.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(_.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,R.innerText="Preview backend running in this workspace."),R.setAttribute("id",k)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",m):m()}/**
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
 */function tt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function rS(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(tt())}function iS(){var t;const e=(t=bl())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function sS(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function oS(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function aS(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function lS(){const t=tt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function uS(){return!iS()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function cS(){try{return typeof indexedDB=="object"}catch{return!1}}function hS(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
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
 */const dS="FirebaseError";class Sn extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=dS,Object.setPrototypeOf(this,Sn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,yo.prototype.create)}}class yo{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?fS(s,r):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new Sn(i,l,r)}}function fS(t,e){return t.replace(pS,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const pS=/\{\$([^}]+)}/g;function mS(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Gr(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(Qy(s)&&Qy(o)){if(!Gr(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Qy(t){return t!==null&&typeof t=="object"}/**
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
 */function _o(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function gS(t,e){const n=new yS(t,e);return n.subscribe.bind(n)}class yS{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");_S(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=gd),i.error===void 0&&(i.error=gd),i.complete===void 0&&(i.complete=gd);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function _S(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function gd(){}/**
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
 */function Lt(t){return t&&t._delegate?t._delegate:t}class Kr{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Qr="[DEFAULT]";/**
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
 */class vS{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new ZI;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ES(e))try{this.getOrInitializeService({instanceIdentifier:Qr})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Qr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Qr){return this.instances.has(e)}getOptions(e=Qr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&o.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:wS(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Qr){return this.component?this.component.multipleInstances?e:Qr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function wS(t){return t===Qr?void 0:t}function ES(t){return t.instantiationMode==="EAGER"}/**
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
 */class TS{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new vS(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var ee;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ee||(ee={}));const IS={debug:ee.DEBUG,verbose:ee.VERBOSE,info:ee.INFO,warn:ee.WARN,error:ee.ERROR,silent:ee.SILENT},SS=ee.INFO,AS={[ee.DEBUG]:"log",[ee.VERBOSE]:"log",[ee.INFO]:"info",[ee.WARN]:"warn",[ee.ERROR]:"error"},kS=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=AS[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class yd{constructor(e){this.name=e,this._logLevel=SS,this._logHandler=kS,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ee))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?IS[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ee.DEBUG,...e),this._logHandler(this,ee.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ee.VERBOSE,...e),this._logHandler(this,ee.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ee.INFO,...e),this._logHandler(this,ee.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ee.WARN,...e),this._logHandler(this,ee.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ee.ERROR,...e),this._logHandler(this,ee.ERROR,...e)}}const CS=(t,e)=>e.some(n=>t instanceof n);let Xy,Yy;function RS(){return Xy||(Xy=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function PS(){return Yy||(Yy=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Jy=new WeakMap,_d=new WeakMap,Zy=new WeakMap,vd=new WeakMap,wd=new WeakMap;function xS(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(hr(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Jy.set(n,t)}).catch(()=>{}),wd.set(e,t),e}function NS(t){if(_d.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});_d.set(t,e)}let Ed={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return _d.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Zy.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return hr(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function DS(t){Ed=t(Ed)}function bS(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Td(this),e,...n);return Zy.set(r,e.sort?e.sort():[e]),hr(r)}:PS().includes(t)?function(...e){return t.apply(Td(this),e),hr(Jy.get(this))}:function(...e){return hr(t.apply(Td(this),e))}}function VS(t){return typeof t=="function"?bS(t):(t instanceof IDBTransaction&&NS(t),CS(t,RS())?new Proxy(t,Ed):t)}function hr(t){if(t instanceof IDBRequest)return xS(t);if(vd.has(t))return vd.get(t);const e=VS(t);return e!==t&&(vd.set(t,e),wd.set(e,t)),e}const Td=t=>wd.get(t);function OS(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),l=hr(o);return r&&o.addEventListener("upgradeneeded",u=>{r(hr(o.result),u.oldVersion,u.newVersion,hr(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const LS=["get","getKey","getAll","getAllKeys","count"],MS=["put","add","delete","clear"],Id=new Map;function e_(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Id.get(e))return Id.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=MS.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||LS.includes(n)))return;const s=async function(o,...l){const u=this.transaction(o,i?"readwrite":"readonly");let h=u.store;return r&&(h=h.index(l.shift())),(await Promise.all([h[n](...l),i&&u.done]))[0]};return Id.set(e,s),s}DS(t=>({...t,get:(e,n,r)=>e_(e,n)||t.get(e,n,r),has:(e,n)=>!!e_(e,n)||t.has(e,n)}));/**
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
 */class FS{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(US(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function US(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Sd="@firebase/app",t_="0.13.2";/**
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
 */const An=new yd("@firebase/app"),zS="@firebase/app-compat",jS="@firebase/analytics-compat",BS="@firebase/analytics",$S="@firebase/app-check-compat",HS="@firebase/app-check",WS="@firebase/auth",qS="@firebase/auth-compat",GS="@firebase/database",KS="@firebase/data-connect",QS="@firebase/database-compat",XS="@firebase/functions",YS="@firebase/functions-compat",JS="@firebase/installations",ZS="@firebase/installations-compat",eA="@firebase/messaging",tA="@firebase/messaging-compat",nA="@firebase/performance",rA="@firebase/performance-compat",iA="@firebase/remote-config",sA="@firebase/remote-config-compat",oA="@firebase/storage",aA="@firebase/storage-compat",lA="@firebase/firestore",uA="@firebase/ai",cA="@firebase/firestore-compat",hA="firebase",dA="11.10.0";/**
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
 */const Ad="[DEFAULT]",fA={[Sd]:"fire-core",[zS]:"fire-core-compat",[BS]:"fire-analytics",[jS]:"fire-analytics-compat",[HS]:"fire-app-check",[$S]:"fire-app-check-compat",[WS]:"fire-auth",[qS]:"fire-auth-compat",[GS]:"fire-rtdb",[KS]:"fire-data-connect",[QS]:"fire-rtdb-compat",[XS]:"fire-fn",[YS]:"fire-fn-compat",[JS]:"fire-iid",[ZS]:"fire-iid-compat",[eA]:"fire-fcm",[tA]:"fire-fcm-compat",[nA]:"fire-perf",[rA]:"fire-perf-compat",[iA]:"fire-rc",[sA]:"fire-rc-compat",[oA]:"fire-gcs",[aA]:"fire-gcs-compat",[lA]:"fire-fst",[cA]:"fire-fst-compat",[uA]:"fire-vertex","fire-js":"fire-js",[hA]:"fire-js-all"};/**
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
 */const vo=new Map,pA=new Map,kd=new Map;function n_(t,e){try{t.container.addComponent(e)}catch(n){An.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Hi(t){const e=t.name;if(kd.has(e))return An.debug(`There were multiple attempts to register component ${e}.`),!1;kd.set(e,t);for(const n of vo.values())n_(n,t);for(const n of pA.values())n_(n,t);return!0}function Cd(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function an(t){return t==null?!1:t.settings!==void 0}/**
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
 */const mA={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},dr=new yo("app","Firebase",mA);/**
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
 */class gA{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Kr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw dr.create("app-deleted",{appName:this._name})}}/**
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
 */const Wi=dA;function r_(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Ad,automaticDataCollectionEnabled:!0},e),i=r.name;if(typeof i!="string"||!i)throw dr.create("bad-app-name",{appName:String(i)});if(n||(n=Hy()),!n)throw dr.create("no-options");const s=vo.get(i);if(s){if(Gr(n,s.options)&&Gr(r,s.config))return s;throw dr.create("duplicate-app",{appName:i})}const o=new TS(i);for(const u of kd.values())o.addComponent(u);const l=new gA(n,r,o);return vo.set(i,l),l}function i_(t=Ad){const e=vo.get(t);if(!e&&t===Ad&&Hy())return r_();if(!e)throw dr.create("no-app",{appName:t});return e}function s_(){return Array.from(vo.values())}function fr(t,e,n){var r;let i=(r=fA[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),An.warn(l.join(" "));return}Hi(new Kr(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const yA="firebase-heartbeat-database",_A=1,wo="firebase-heartbeat-store";let Rd=null;function o_(){return Rd||(Rd=OS(yA,_A,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(wo)}catch(n){console.warn(n)}}}}).catch(t=>{throw dr.create("idb-open",{originalErrorMessage:t.message})})),Rd}async function vA(t){try{const n=(await o_()).transaction(wo),r=await n.objectStore(wo).get(l_(t));return await n.done,r}catch(e){if(e instanceof Sn)An.warn(e.message);else{const n=dr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});An.warn(n.message)}}}async function a_(t,e){try{const r=(await o_()).transaction(wo,"readwrite");await r.objectStore(wo).put(e,l_(t)),await r.done}catch(n){if(n instanceof Sn)An.warn(n.message);else{const r=dr.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});An.warn(r.message)}}}function l_(t){return`${t.name}!${t.options.appId}`}/**
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
 */const wA=1024,EA=30;class TA{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new SA(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=u_();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>EA){const o=AA(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){An.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=u_(),{heartbeatsToSend:r,unsentEntries:i}=IA(this._heartbeatsCache.heartbeats),s=Dl(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return An.warn(n),""}}}function u_(){return new Date().toISOString().substring(0,10)}function IA(t,e=wA){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),c_(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),c_(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class SA{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return cS()?hS().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await vA(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return a_(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return a_(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function c_(t){return Dl(JSON.stringify({version:2,heartbeats:t})).length}function AA(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
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
 */function kA(t){Hi(new Kr("platform-logger",e=>new FS(e),"PRIVATE")),Hi(new Kr("heartbeat",e=>new TA(e),"PRIVATE")),fr(Sd,t_,t),fr(Sd,t_,"esm2017"),fr("fire-js","")}kA("");var CA="firebase",RA="11.10.0";/**
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
 */fr(CA,RA,"app");function Pd(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}typeof SuppressedError=="function"&&SuppressedError;function h_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const PA=h_,d_=new yo("auth","Firebase",h_());/**
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
 */const Vl=new yd("@firebase/auth");function xA(t,...e){Vl.logLevel<=ee.WARN&&Vl.warn(`Auth (${Wi}): ${t}`,...e)}function Ol(t,...e){Vl.logLevel<=ee.ERROR&&Vl.error(`Auth (${Wi}): ${t}`,...e)}/**
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
 */function kn(t,...e){throw xd(t,...e)}function ln(t,...e){return xd(t,...e)}function f_(t,e,n){const r=Object.assign(Object.assign({},PA()),{[e]:n});return new yo("auth","Firebase",r).create(e,{appName:t.name})}function Xr(t){return f_(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function xd(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return d_.create(t,...e)}function K(t,e,...n){if(!t)throw xd(e,...n)}function Cn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ol(e),new Error(e)}function Rn(t,e){t||Cn(e)}/**
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
 */function Nd(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function NA(){return p_()==="http:"||p_()==="https:"}function p_(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
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
 */function DA(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(NA()||oS()||"connection"in navigator)?navigator.onLine:!0}function bA(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
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
 */class Eo{constructor(e,n){this.shortDelay=e,this.longDelay=n,Rn(n>e,"Short delay should be less than long delay!"),this.isMobile=rS()||aS()}get(){return DA()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Dd(t,e){Rn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class m_{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Cn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Cn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Cn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const VA={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const OA=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],LA=new Eo(3e4,6e4);function bd(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function qi(t,e,n,r,i={}){return g_(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const l=_o(Object.assign({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const h=Object.assign({method:e,headers:u},s);return sS()||(h.referrerPolicy="no-referrer"),t.emulatorConfig&&$i(t.emulatorConfig.host)&&(h.credentials="include"),m_.fetch()(await y_(t,t.config.apiHost,n,l),h)})}async function g_(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},VA),e);try{const i=new FA(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Ll(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[u,h]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ll(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Ll(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw Ll(t,"user-disabled",o);const f=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw f_(t,f,h);kn(t,f)}}catch(i){if(i instanceof Sn)throw i;kn(t,"network-request-failed",{message:String(i)})}}async function MA(t,e,n,r,i={}){const s=await qi(t,e,n,r,i);return"mfaPendingCredential"in s&&kn(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function y_(t,e,n,r){const i=`${e}${n}?${r}`,s=t,o=s.config.emulator?Dd(t.config,i):`${t.config.apiScheme}://${i}`;return OA.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}class FA{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ln(this.auth,"network-request-failed")),LA.get())})}}function Ll(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=ln(t,e,r);return i.customData._tokenResponse=n,i}/**
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
 */async function UA(t,e){return qi(t,"POST","/v1/accounts:delete",e)}async function Ml(t,e){return qi(t,"POST","/v1/accounts:lookup",e)}/**
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
 */function To(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function zA(t,e=!1){const n=Lt(t),r=await n.getIdToken(e),i=Od(r);K(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:To(Vd(i.auth_time)),issuedAtTime:To(Vd(i.iat)),expirationTime:To(Vd(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Vd(t){return Number(t)*1e3}function Od(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ol("JWT malformed, contained fewer than 3 sections"),null;try{const i=By(n);return i?JSON.parse(i):(Ol("Failed to decode base64 JWT payload"),null)}catch(i){return Ol("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function __(t){const e=Od(t);return K(e,"internal-error"),K(typeof e.exp<"u","internal-error"),K(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Io(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Sn&&jA(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function jA({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
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
 */class BA{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Ld{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=To(this.lastLoginAt),this.creationTime=To(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Fl(t){var e;const n=t.auth,r=await t.getIdToken(),i=await Io(t,Ml(n,{idToken:r}));K(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?v_(s.providerUserInfo):[],l=HA(t.providerData,o),u=t.isAnonymous,h=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),f=u?h:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new Ld(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(t,m)}async function $A(t){const e=Lt(t);await Fl(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function HA(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function v_(t){return t.map(e=>{var{providerId:n}=e,r=Pd(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function WA(t,e){const n=await g_(t,{},async()=>{const r=_o({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=await y_(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:l,body:r};return t.emulatorConfig&&$i(t.emulatorConfig.host)&&(u.credentials="include"),m_.fetch()(o,u)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function qA(t,e){return qi(t,"POST","/v2/accounts:revokeToken",bd(t,e))}/**
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
 */class Gi{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken<"u","internal-error"),K(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):__(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){K(e.length!==0,"internal-error");const n=__(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await WA(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new Gi;return r&&(K(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(K(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(K(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Gi,this.toJSON())}_performRefresh(){return Cn("not implemented")}}/**
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
 */function pr(t,e){K(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Qt{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=Pd(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new BA(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Ld(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await Io(this,this.stsTokenManager.getToken(this.auth,e));return K(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return zA(this,e)}reload(){return $A(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Qt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Fl(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(an(this.auth.app))return Promise.reject(Xr(this.auth));const e=await this.getIdToken();return await Io(this,UA(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,o,l,u,h,f;const m=(r=n.displayName)!==null&&r!==void 0?r:void 0,p=(i=n.email)!==null&&i!==void 0?i:void 0,k=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,R=(o=n.photoURL)!==null&&o!==void 0?o:void 0,x=(l=n.tenantId)!==null&&l!==void 0?l:void 0,P=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,w=(h=n.createdAt)!==null&&h!==void 0?h:void 0,_=(f=n.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:S,emailVerified:D,isAnonymous:b,providerData:M,stsTokenManager:T}=n;K(S&&T,e,"internal-error");const y=Gi.fromJSON(this.name,T);K(typeof S=="string",e,"internal-error"),pr(m,e.name),pr(p,e.name),K(typeof D=="boolean",e,"internal-error"),K(typeof b=="boolean",e,"internal-error"),pr(k,e.name),pr(R,e.name),pr(x,e.name),pr(P,e.name),pr(w,e.name),pr(_,e.name);const v=new Qt({uid:S,auth:e,email:p,emailVerified:D,displayName:m,isAnonymous:b,photoURL:R,phoneNumber:k,tenantId:x,stsTokenManager:y,createdAt:w,lastLoginAt:_});return M&&Array.isArray(M)&&(v.providerData=M.map(E=>Object.assign({},E))),P&&(v._redirectEventId=P),v}static async _fromIdTokenResponse(e,n,r=!1){const i=new Gi;i.updateFromServerResponse(n);const s=new Qt({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Fl(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];K(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?v_(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new Gi;l.updateFromIdToken(r);const u=new Qt({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Ld(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,h),u}}/**
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
 */const w_=new Map;function Pn(t){Rn(t instanceof Function,"Expected a class definition");let e=w_.get(t);return e?(Rn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,w_.set(t,e),e)}/**
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
 */class E_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}E_.type="NONE";const T_=E_;/**
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
 */function Ul(t,e,n){return`firebase:${t}:${e}:${n}`}class Ki{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Ul(this.userKey,i.apiKey,s),this.fullPersistenceKey=Ul("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Ml(this.auth,{idToken:e}).catch(()=>{});return n?Qt._fromGetAccountInfoResponse(this.auth,n,e):null}return Qt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Ki(Pn(T_),e,r);const i=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let s=i[0]||Pn(T_);const o=Ul(r,e.config.apiKey,e.name);let l=null;for(const h of n)try{const f=await h._get(o);if(f){let m;if(typeof f=="string"){const p=await Ml(e,{idToken:f}).catch(()=>{});if(!p)break;m=await Qt._fromGetAccountInfoResponse(e,p,f)}else m=Qt._fromJSON(e,f);h!==s&&(l=m),s=h;break}}catch{}const u=i.filter(h=>h._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new Ki(s,e,r):(s=u[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async h=>{if(h!==s)try{await h._remove(o)}catch{}})),new Ki(s,e,r))}}/**
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
 */function I_(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(C_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(S_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(P_(e))return"Blackberry";if(x_(e))return"Webos";if(A_(e))return"Safari";if((e.includes("chrome/")||k_(e))&&!e.includes("edge/"))return"Chrome";if(R_(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function S_(t=tt()){return/firefox\//i.test(t)}function A_(t=tt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function k_(t=tt()){return/crios\//i.test(t)}function C_(t=tt()){return/iemobile/i.test(t)}function R_(t=tt()){return/android/i.test(t)}function P_(t=tt()){return/blackberry/i.test(t)}function x_(t=tt()){return/webos/i.test(t)}function Md(t=tt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function GA(t=tt()){var e;return Md(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function KA(){return lS()&&document.documentMode===10}function N_(t=tt()){return Md(t)||R_(t)||x_(t)||P_(t)||/windows phone/i.test(t)||C_(t)}/**
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
 */function D_(t,e=[]){let n;switch(t){case"Browser":n=I_(tt());break;case"Worker":n=`${I_(tt())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Wi}/${r}`}/**
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
 */class QA{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,l)=>{try{const u=e(s);o(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function XA(t,e={}){return qi(t,"GET","/v2/passwordPolicy",bd(t,e))}/**
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
 */const YA=6;class JA{constructor(e){var n,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:YA,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,o,l;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(l=u.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),u}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
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
 */class ZA{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new b_(this),this.idTokenSubscription=new b_(this),this.beforeStateQueue=new QA(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=d_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Pn(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await Ki.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Ml(this,{idToken:e}),r=await Qt._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(an(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Fl(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=bA()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(an(this.app))return Promise.reject(Xr(this));const n=e?Lt(e):null;return n&&K(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return an(this.app)?Promise.reject(Xr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return an(this.app)?Promise.reject(Xr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Pn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await XA(this),n=new JA(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new yo("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await qA(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Pn(e)||this._popupRedirectResolver;K(n,this,"argument-error"),this.redirectPersistenceManager=await Ki.create(this,[Pn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=D_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;if(an(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&xA(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Fd(t){return Lt(t)}class b_{constructor(e){this.auth=e,this.observer=null,this.addObserver=gS(n=>this.observer=n)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Ud={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ek(t){Ud=t}function tk(t){return Ud.loadJS(t)}function nk(){return Ud.gapiScript}function rk(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
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
 */function ik(t,e){const n=Cd(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(Gr(s,e??{}))return i;kn(i,"already-initialized")}return n.initialize({options:e})}function sk(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Pn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function ok(t,e,n){const r=Fd(t);K(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=V_(e),{host:o,port:l}=ak(e),u=l===null?"":`:${l}`,h={url:`${s}//${o}${u}/`},f=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){K(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),K(Gr(h,r.config.emulator)&&Gr(f,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=h,r.emulatorConfig=f,r.settings.appVerificationDisabledForTesting=!0,$i(o)?(qy(`${s}//${o}${u}`),Ky("Auth",!0)):lk()}function V_(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function ak(t){const e=V_(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:O_(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:O_(o)}}}function O_(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function lk(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
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
 */class L_{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Cn("not implemented")}_getIdTokenResponse(e){return Cn("not implemented")}_linkToIdToken(e,n){return Cn("not implemented")}_getReauthenticationResolver(e){return Cn("not implemented")}}/**
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
 */async function Qi(t,e){return MA(t,"POST","/v1/accounts:signInWithIdp",bd(t,e))}/**
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
 */const uk="http://localhost";class Yr extends L_{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Yr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):kn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=Pd(n,["providerId","signInMethod"]);if(!r||!i)return null;const o=new Yr(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Qi(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Qi(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Qi(e,n)}buildRequest(){const e={requestUri:uk,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=_o(n)}return e}}/**
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
 */class M_{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class So extends M_{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class mr extends So{constructor(){super("facebook.com")}static credential(e){return Yr._fromParams({providerId:mr.PROVIDER_ID,signInMethod:mr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return mr.credentialFromTaggedObject(e)}static credentialFromError(e){return mr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return mr.credential(e.oauthAccessToken)}catch{return null}}}mr.FACEBOOK_SIGN_IN_METHOD="facebook.com",mr.PROVIDER_ID="facebook.com";/**
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
 */class gr extends So{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Yr._fromParams({providerId:gr.PROVIDER_ID,signInMethod:gr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return gr.credentialFromTaggedObject(e)}static credentialFromError(e){return gr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return gr.credential(n,r)}catch{return null}}}gr.GOOGLE_SIGN_IN_METHOD="google.com",gr.PROVIDER_ID="google.com";/**
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
 */class yr extends So{constructor(){super("github.com")}static credential(e){return Yr._fromParams({providerId:yr.PROVIDER_ID,signInMethod:yr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return yr.credentialFromTaggedObject(e)}static credentialFromError(e){return yr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return yr.credential(e.oauthAccessToken)}catch{return null}}}yr.GITHUB_SIGN_IN_METHOD="github.com",yr.PROVIDER_ID="github.com";/**
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
 */class _r extends So{constructor(){super("twitter.com")}static credential(e,n){return Yr._fromParams({providerId:_r.PROVIDER_ID,signInMethod:_r.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return _r.credentialFromTaggedObject(e)}static credentialFromError(e){return _r.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return _r.credential(n,r)}catch{return null}}}_r.TWITTER_SIGN_IN_METHOD="twitter.com",_r.PROVIDER_ID="twitter.com";/**
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
 */class Xi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await Qt._fromIdTokenResponse(e,r,i),o=F_(r);return new Xi({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=F_(r);return new Xi({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function F_(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
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
 */class zl extends Sn{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,zl.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new zl(e,n,r,i)}}function U_(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?zl._fromErrorAndOperation(t,s,e,r):s})}async function ck(t,e,n=!1){const r=await Io(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Xi._forOperation(t,"link",r)}/**
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
 */async function hk(t,e,n=!1){const{auth:r}=t;if(an(r.app))return Promise.reject(Xr(r));const i="reauthenticate";try{const s=await Io(t,U_(r,i,e,t),n);K(s.idToken,r,"internal-error");const o=Od(s.idToken);K(o,r,"internal-error");const{sub:l}=o;return K(t.uid===l,r,"user-mismatch"),Xi._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&kn(r,"user-mismatch"),s}}/**
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
 */async function dk(t,e,n=!1){if(an(t.app))return Promise.reject(Xr(t));const r="signIn",i=await U_(t,r,e),s=await Xi._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}function fk(t,e,n,r){return Lt(t).onIdTokenChanged(e,n,r)}function pk(t,e,n){return Lt(t).beforeAuthStateChanged(e,n)}const jl="__sak";/**
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
 */class z_{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(jl,"1"),this.storage.removeItem(jl),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const mk=1e3,gk=10;class j_ extends z_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=N_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);KA()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,gk):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},mk)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}j_.type="LOCAL";const yk=j_;/**
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
 */class B_ extends z_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}B_.type="SESSION";const $_=B_;/**
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
 */function _k(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Bl{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new Bl(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(o).map(async h=>h(n.origin,s)),u=await _k(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Bl.receivers=[];/**
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
 */function zd(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class vk{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((l,u)=>{const h=zd("",20);i.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(m){const p=m;if(p.data.eventId===h)switch(p.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(p.data.response);break;default:clearTimeout(f),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
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
 */function un(){return window}function wk(t){un().location.href=t}/**
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
 */function H_(){return typeof un().WorkerGlobalScope<"u"&&typeof un().importScripts=="function"}async function Ek(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Tk(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function Ik(){return H_()?self:null}/**
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
 */const W_="firebaseLocalStorageDb",Sk=1,$l="firebaseLocalStorage",q_="fbase_key";class Ao{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Hl(t,e){return t.transaction([$l],e?"readwrite":"readonly").objectStore($l)}function Ak(){const t=indexedDB.deleteDatabase(W_);return new Ao(t).toPromise()}function jd(){const t=indexedDB.open(W_,Sk);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore($l,{keyPath:q_})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains($l)?e(r):(r.close(),await Ak(),e(await jd()))})})}async function G_(t,e,n){const r=Hl(t,!0).put({[q_]:e,value:n});return new Ao(r).toPromise()}async function kk(t,e){const n=Hl(t,!1).get(e),r=await new Ao(n).toPromise();return r===void 0?null:r.value}function K_(t,e){const n=Hl(t,!0).delete(e);return new Ao(n).toPromise()}const Ck=800,Rk=3;class Q_{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await jd(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>Rk)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return H_()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Bl._getInstance(Ik()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await Ek(),!this.activeServiceWorker)return;this.sender=new vk(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Tk()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await jd();return await G_(e,jl,"1"),await K_(e,jl),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>G_(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>kk(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>K_(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Hl(i,!1).getAll();return new Ao(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Ck)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Q_.type="LOCAL";const Pk=Q_;new Eo(3e4,6e4);/**
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
 */function xk(t,e){return e?Pn(e):(K(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class Bd extends L_{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Qi(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Qi(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Qi(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Nk(t){return dk(t.auth,new Bd(t),t.bypassAuthState)}function Dk(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),hk(n,new Bd(t),t.bypassAuthState)}async function bk(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),ck(n,new Bd(t),t.bypassAuthState)}/**
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
 */class X_{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Nk;case"linkViaPopup":case"linkViaRedirect":return bk;case"reauthViaPopup":case"reauthViaRedirect":return Dk;default:kn(this.auth,"internal-error")}}resolve(e){Rn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Rn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Vk=new Eo(2e3,1e4);class Yi extends X_{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Yi.currentPopupAction&&Yi.currentPopupAction.cancel(),Yi.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){Rn(this.filter.length===1,"Popup operations only handle one event");const e=zd();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ln(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(ln(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Yi.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ln(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Vk.get())};e()}}Yi.currentPopupAction=null;/**
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
 */const Ok="pendingRedirect",Wl=new Map;class Lk extends X_{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Wl.get(this.auth._key());if(!e){try{const r=await Mk(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Wl.set(this.auth._key(),e)}return this.bypassAuthState||Wl.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Mk(t,e){const n=zk(e),r=Uk(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function Fk(t,e){Wl.set(t._key(),e)}function Uk(t){return Pn(t._redirectPersistence)}function zk(t){return Ul(Ok,t.config.apiKey,t.name)}async function jk(t,e,n=!1){if(an(t.app))return Promise.reject(Xr(t));const r=Fd(t),i=xk(r,e),o=await new Lk(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
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
 */const Bk=10*60*1e3;class $k{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Hk(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!J_(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(ln(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Bk&&this.cachedEventUids.clear(),this.cachedEventUids.has(Y_(e))}saveEventToCache(e){this.cachedEventUids.add(Y_(e)),this.lastProcessedEventTime=Date.now()}}function Y_(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function J_({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Hk(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return J_(t);default:return!1}}/**
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
 */async function Wk(t,e={}){return qi(t,"GET","/v1/projects",e)}/**
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
 */const qk=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Gk=/^https?/;async function Kk(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Wk(t);for(const n of e)try{if(Qk(n))return}catch{}kn(t,"unauthorized-domain")}function Qk(t){const e=Nd(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!Gk.test(n))return!1;if(qk.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const Xk=new Eo(3e4,6e4);function Z_(){const t=un().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Yk(t){return new Promise((e,n)=>{var r,i,s;function o(){Z_(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Z_(),n(ln(t,"network-request-failed"))},timeout:Xk.get()})}if(!((i=(r=un().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=un().gapi)===null||s===void 0)&&s.load)o();else{const l=rk("iframefcb");return un()[l]=()=>{gapi.load?o():n(ln(t,"network-request-failed"))},tk(`${nk()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw ql=null,e})}let ql=null;function Jk(t){return ql=ql||Yk(t),ql}/**
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
 */const Zk=new Eo(5e3,15e3),eC="__/auth/iframe",tC="emulator/auth/iframe",nC={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},rC=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function iC(t){const e=t.config;K(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Dd(e,tC):`https://${t.config.authDomain}/${eC}`,r={apiKey:e.apiKey,appName:t.name,v:Wi},i=rC.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${_o(r).slice(1)}`}async function sC(t){const e=await Jk(t),n=un().gapi;return K(n,t,"internal-error"),e.open({where:document.body,url:iC(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:nC,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=ln(t,"network-request-failed"),l=un().setTimeout(()=>{s(o)},Zk.get());function u(){un().clearTimeout(l),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
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
 */const oC={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},aC=500,lC=600,uC="_blank",cC="http://localhost";class ev{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function hC(t,e,n,r=aC,i=lC){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u=Object.assign(Object.assign({},oC),{width:r.toString(),height:i.toString(),top:s,left:o}),h=tt().toLowerCase();n&&(l=k_(h)?uC:n),S_(h)&&(e=e||cC,u.scrollbars="yes");const f=Object.entries(u).reduce((p,[k,R])=>`${p}${k}=${R},`,"");if(GA(h)&&l!=="_self")return dC(e||"",l),new ev(null);const m=window.open(e||"",l,f);K(m,t,"popup-blocked");try{m.focus()}catch{}return new ev(m)}function dC(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const fC="__/auth/handler",pC="emulator/auth/handler",mC=encodeURIComponent("fac");async function tv(t,e,n,r,i,s){K(t.config.authDomain,t,"auth-domain-config-required"),K(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Wi,eventId:i};if(e instanceof M_){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",mS(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))o[f]=m}if(e instanceof So){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(o.scopes=f.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const u=await t._getAppCheckToken(),h=u?`#${mC}=${encodeURIComponent(u)}`:"";return`${gC(t)}?${_o(l).slice(1)}${h}`}function gC({config:t}){return t.emulator?Dd(t,pC):`https://${t.authDomain}/${fC}`}/**
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
 */const $d="webStorageSupport";class yC{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=$_,this._completeRedirectFn=jk,this._overrideRedirectResult=Fk}async _openPopup(e,n,r,i){var s;Rn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await tv(e,n,r,Nd(),i);return hC(e,o,zd())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await tv(e,n,r,Nd(),i);return wk(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Rn(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await sC(e),r=new $k(e);return n.register("authEvent",i=>(K(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send($d,{type:$d},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[$d];o!==void 0&&n(!!o),kn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Kk(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return N_()||A_()||Md()}}const _C=yC;var nv="@firebase/auth",rv="1.10.8";/**
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
 */class vC{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function wC(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function EC(t){Hi(new Kr("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:D_(t)},h=new ZA(r,i,s,u);return sk(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Hi(new Kr("auth-internal",e=>{const n=Fd(e.getProvider("auth").getImmediate());return(r=>new vC(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),fr(nv,rv,wC(t)),fr(nv,rv,"esm2017")}/**
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
 */const TC=5*60,IC=Wy("authIdTokenMaxAge")||TC;let iv=null;const SC=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>IC)return;const i=n==null?void 0:n.token;iv!==i&&(iv=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function AC(t=i_()){const e=Cd(t,"auth");if(e.isInitialized())return e.getImmediate();const n=ik(t,{popupRedirectResolver:_C,persistence:[Pk,yk,$_]}),r=Wy("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=SC(s.toString());pk(n,o,()=>o(n.currentUser)),fk(n,l=>o(l))}}const i=$y("auth");return i&&ok(n,`http://${i}`),n}function kC(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}ek({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ln("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",kC().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="}),EC("Browser");var sv=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var vr,ov;(function(){var t;/** @license

   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function e(T,y){function v(){}v.prototype=y.prototype,T.D=y.prototype,T.prototype=new v,T.prototype.constructor=T,T.C=function(E,A,C){for(var I=Array(arguments.length-2),Ae=2;Ae<arguments.length;Ae++)I[Ae-2]=arguments[Ae];return y.prototype[A].apply(E,I)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(T,y,v){v||(v=0);var E=Array(16);if(typeof y=="string")for(var A=0;16>A;++A)E[A]=y.charCodeAt(v++)|y.charCodeAt(v++)<<8|y.charCodeAt(v++)<<16|y.charCodeAt(v++)<<24;else for(A=0;16>A;++A)E[A]=y[v++]|y[v++]<<8|y[v++]<<16|y[v++]<<24;y=T.g[0],v=T.g[1],A=T.g[2];var C=T.g[3],I=y+(C^v&(A^C))+E[0]+3614090360&4294967295;y=v+(I<<7&4294967295|I>>>25),I=C+(A^y&(v^A))+E[1]+3905402710&4294967295,C=y+(I<<12&4294967295|I>>>20),I=A+(v^C&(y^v))+E[2]+606105819&4294967295,A=C+(I<<17&4294967295|I>>>15),I=v+(y^A&(C^y))+E[3]+3250441966&4294967295,v=A+(I<<22&4294967295|I>>>10),I=y+(C^v&(A^C))+E[4]+4118548399&4294967295,y=v+(I<<7&4294967295|I>>>25),I=C+(A^y&(v^A))+E[5]+1200080426&4294967295,C=y+(I<<12&4294967295|I>>>20),I=A+(v^C&(y^v))+E[6]+2821735955&4294967295,A=C+(I<<17&4294967295|I>>>15),I=v+(y^A&(C^y))+E[7]+4249261313&4294967295,v=A+(I<<22&4294967295|I>>>10),I=y+(C^v&(A^C))+E[8]+1770035416&4294967295,y=v+(I<<7&4294967295|I>>>25),I=C+(A^y&(v^A))+E[9]+2336552879&4294967295,C=y+(I<<12&4294967295|I>>>20),I=A+(v^C&(y^v))+E[10]+4294925233&4294967295,A=C+(I<<17&4294967295|I>>>15),I=v+(y^A&(C^y))+E[11]+2304563134&4294967295,v=A+(I<<22&4294967295|I>>>10),I=y+(C^v&(A^C))+E[12]+1804603682&4294967295,y=v+(I<<7&4294967295|I>>>25),I=C+(A^y&(v^A))+E[13]+4254626195&4294967295,C=y+(I<<12&4294967295|I>>>20),I=A+(v^C&(y^v))+E[14]+2792965006&4294967295,A=C+(I<<17&4294967295|I>>>15),I=v+(y^A&(C^y))+E[15]+1236535329&4294967295,v=A+(I<<22&4294967295|I>>>10),I=y+(A^C&(v^A))+E[1]+4129170786&4294967295,y=v+(I<<5&4294967295|I>>>27),I=C+(v^A&(y^v))+E[6]+3225465664&4294967295,C=y+(I<<9&4294967295|I>>>23),I=A+(y^v&(C^y))+E[11]+643717713&4294967295,A=C+(I<<14&4294967295|I>>>18),I=v+(C^y&(A^C))+E[0]+3921069994&4294967295,v=A+(I<<20&4294967295|I>>>12),I=y+(A^C&(v^A))+E[5]+3593408605&4294967295,y=v+(I<<5&4294967295|I>>>27),I=C+(v^A&(y^v))+E[10]+38016083&4294967295,C=y+(I<<9&4294967295|I>>>23),I=A+(y^v&(C^y))+E[15]+3634488961&4294967295,A=C+(I<<14&4294967295|I>>>18),I=v+(C^y&(A^C))+E[4]+3889429448&4294967295,v=A+(I<<20&4294967295|I>>>12),I=y+(A^C&(v^A))+E[9]+568446438&4294967295,y=v+(I<<5&4294967295|I>>>27),I=C+(v^A&(y^v))+E[14]+3275163606&4294967295,C=y+(I<<9&4294967295|I>>>23),I=A+(y^v&(C^y))+E[3]+4107603335&4294967295,A=C+(I<<14&4294967295|I>>>18),I=v+(C^y&(A^C))+E[8]+1163531501&4294967295,v=A+(I<<20&4294967295|I>>>12),I=y+(A^C&(v^A))+E[13]+2850285829&4294967295,y=v+(I<<5&4294967295|I>>>27),I=C+(v^A&(y^v))+E[2]+4243563512&4294967295,C=y+(I<<9&4294967295|I>>>23),I=A+(y^v&(C^y))+E[7]+1735328473&4294967295,A=C+(I<<14&4294967295|I>>>18),I=v+(C^y&(A^C))+E[12]+2368359562&4294967295,v=A+(I<<20&4294967295|I>>>12),I=y+(v^A^C)+E[5]+4294588738&4294967295,y=v+(I<<4&4294967295|I>>>28),I=C+(y^v^A)+E[8]+2272392833&4294967295,C=y+(I<<11&4294967295|I>>>21),I=A+(C^y^v)+E[11]+1839030562&4294967295,A=C+(I<<16&4294967295|I>>>16),I=v+(A^C^y)+E[14]+4259657740&4294967295,v=A+(I<<23&4294967295|I>>>9),I=y+(v^A^C)+E[1]+2763975236&4294967295,y=v+(I<<4&4294967295|I>>>28),I=C+(y^v^A)+E[4]+1272893353&4294967295,C=y+(I<<11&4294967295|I>>>21),I=A+(C^y^v)+E[7]+4139469664&4294967295,A=C+(I<<16&4294967295|I>>>16),I=v+(A^C^y)+E[10]+3200236656&4294967295,v=A+(I<<23&4294967295|I>>>9),I=y+(v^A^C)+E[13]+681279174&4294967295,y=v+(I<<4&4294967295|I>>>28),I=C+(y^v^A)+E[0]+3936430074&4294967295,C=y+(I<<11&4294967295|I>>>21),I=A+(C^y^v)+E[3]+3572445317&4294967295,A=C+(I<<16&4294967295|I>>>16),I=v+(A^C^y)+E[6]+76029189&4294967295,v=A+(I<<23&4294967295|I>>>9),I=y+(v^A^C)+E[9]+3654602809&4294967295,y=v+(I<<4&4294967295|I>>>28),I=C+(y^v^A)+E[12]+3873151461&4294967295,C=y+(I<<11&4294967295|I>>>21),I=A+(C^y^v)+E[15]+530742520&4294967295,A=C+(I<<16&4294967295|I>>>16),I=v+(A^C^y)+E[2]+3299628645&4294967295,v=A+(I<<23&4294967295|I>>>9),I=y+(A^(v|~C))+E[0]+4096336452&4294967295,y=v+(I<<6&4294967295|I>>>26),I=C+(v^(y|~A))+E[7]+1126891415&4294967295,C=y+(I<<10&4294967295|I>>>22),I=A+(y^(C|~v))+E[14]+2878612391&4294967295,A=C+(I<<15&4294967295|I>>>17),I=v+(C^(A|~y))+E[5]+4237533241&4294967295,v=A+(I<<21&4294967295|I>>>11),I=y+(A^(v|~C))+E[12]+1700485571&4294967295,y=v+(I<<6&4294967295|I>>>26),I=C+(v^(y|~A))+E[3]+2399980690&4294967295,C=y+(I<<10&4294967295|I>>>22),I=A+(y^(C|~v))+E[10]+4293915773&4294967295,A=C+(I<<15&4294967295|I>>>17),I=v+(C^(A|~y))+E[1]+2240044497&4294967295,v=A+(I<<21&4294967295|I>>>11),I=y+(A^(v|~C))+E[8]+1873313359&4294967295,y=v+(I<<6&4294967295|I>>>26),I=C+(v^(y|~A))+E[15]+4264355552&4294967295,C=y+(I<<10&4294967295|I>>>22),I=A+(y^(C|~v))+E[6]+2734768916&4294967295,A=C+(I<<15&4294967295|I>>>17),I=v+(C^(A|~y))+E[13]+1309151649&4294967295,v=A+(I<<21&4294967295|I>>>11),I=y+(A^(v|~C))+E[4]+4149444226&4294967295,y=v+(I<<6&4294967295|I>>>26),I=C+(v^(y|~A))+E[11]+3174756917&4294967295,C=y+(I<<10&4294967295|I>>>22),I=A+(y^(C|~v))+E[2]+718787259&4294967295,A=C+(I<<15&4294967295|I>>>17),I=v+(C^(A|~y))+E[9]+3951481745&4294967295,T.g[0]=T.g[0]+y&4294967295,T.g[1]=T.g[1]+(A+(I<<21&4294967295|I>>>11))&4294967295,T.g[2]=T.g[2]+A&4294967295,T.g[3]=T.g[3]+C&4294967295}r.prototype.u=function(T,y){y===void 0&&(y=T.length);for(var v=y-this.blockSize,E=this.B,A=this.h,C=0;C<y;){if(A==0)for(;C<=v;)i(this,T,C),C+=this.blockSize;if(typeof T=="string"){for(;C<y;)if(E[A++]=T.charCodeAt(C++),A==this.blockSize){i(this,E),A=0;break}}else for(;C<y;)if(E[A++]=T[C++],A==this.blockSize){i(this,E),A=0;break}}this.h=A,this.o+=y},r.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var y=1;y<T.length-8;++y)T[y]=0;var v=8*this.o;for(y=T.length-8;y<T.length;++y)T[y]=v&255,v/=256;for(this.u(T),T=Array(16),y=v=0;4>y;++y)for(var E=0;32>E;E+=8)T[v++]=this.g[y]>>>E&255;return T};function s(T,y){var v=l;return Object.prototype.hasOwnProperty.call(v,T)?v[T]:v[T]=y(T)}function o(T,y){this.h=y;for(var v=[],E=!0,A=T.length-1;0<=A;A--){var C=T[A]|0;E&&C==y||(v[A]=C,E=!1)}this.g=v}var l={};function u(T){return-128<=T&&128>T?s(T,function(y){return new o([y|0],0>y?-1:0)}):new o([T|0],0>T?-1:0)}function h(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return P(h(-T));for(var y=[],v=1,E=0;T>=v;E++)y[E]=T/v|0,v*=4294967296;return new o(y,0)}function f(T,y){if(T.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(T.charAt(0)=="-")return P(f(T.substring(1),y));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=h(Math.pow(y,8)),E=m,A=0;A<T.length;A+=8){var C=Math.min(8,T.length-A),I=parseInt(T.substring(A,A+C),y);8>C?(C=h(Math.pow(y,C)),E=E.j(C).add(h(I))):(E=E.j(v),E=E.add(h(I)))}return E}var m=u(0),p=u(1),k=u(16777216);t=o.prototype,t.m=function(){if(x(this))return-P(this).m();for(var T=0,y=1,v=0;v<this.g.length;v++){var E=this.i(v);T+=(0<=E?E:4294967296+E)*y,y*=4294967296}return T},t.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(R(this))return"0";if(x(this))return"-"+P(this).toString(T);for(var y=h(Math.pow(T,6)),v=this,E="";;){var A=D(v,y).g;v=w(v,A.j(y));var C=((0<v.g.length?v.g[0]:v.h)>>>0).toString(T);if(v=A,R(v))return C+E;for(;6>C.length;)C="0"+C;E=C+E}},t.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function R(T){if(T.h!=0)return!1;for(var y=0;y<T.g.length;y++)if(T.g[y]!=0)return!1;return!0}function x(T){return T.h==-1}t.l=function(T){return T=w(this,T),x(T)?-1:R(T)?0:1};function P(T){for(var y=T.g.length,v=[],E=0;E<y;E++)v[E]=~T.g[E];return new o(v,~T.h).add(p)}t.abs=function(){return x(this)?P(this):this},t.add=function(T){for(var y=Math.max(this.g.length,T.g.length),v=[],E=0,A=0;A<=y;A++){var C=E+(this.i(A)&65535)+(T.i(A)&65535),I=(C>>>16)+(this.i(A)>>>16)+(T.i(A)>>>16);E=I>>>16,C&=65535,I&=65535,v[A]=I<<16|C}return new o(v,v[v.length-1]&-2147483648?-1:0)};function w(T,y){return T.add(P(y))}t.j=function(T){if(R(this)||R(T))return m;if(x(this))return x(T)?P(this).j(P(T)):P(P(this).j(T));if(x(T))return P(this.j(P(T)));if(0>this.l(k)&&0>T.l(k))return h(this.m()*T.m());for(var y=this.g.length+T.g.length,v=[],E=0;E<2*y;E++)v[E]=0;for(E=0;E<this.g.length;E++)for(var A=0;A<T.g.length;A++){var C=this.i(E)>>>16,I=this.i(E)&65535,Ae=T.i(A)>>>16,st=T.i(A)&65535;v[2*E+2*A]+=I*st,_(v,2*E+2*A),v[2*E+2*A+1]+=C*st,_(v,2*E+2*A+1),v[2*E+2*A+1]+=I*Ae,_(v,2*E+2*A+1),v[2*E+2*A+2]+=C*Ae,_(v,2*E+2*A+2)}for(E=0;E<y;E++)v[E]=v[2*E+1]<<16|v[2*E];for(E=y;E<2*y;E++)v[E]=0;return new o(v,0)};function _(T,y){for(;(T[y]&65535)!=T[y];)T[y+1]+=T[y]>>>16,T[y]&=65535,y++}function S(T,y){this.g=T,this.h=y}function D(T,y){if(R(y))throw Error("division by zero");if(R(T))return new S(m,m);if(x(T))return y=D(P(T),y),new S(P(y.g),P(y.h));if(x(y))return y=D(T,P(y)),new S(P(y.g),y.h);if(30<T.g.length){if(x(T)||x(y))throw Error("slowDivide_ only works with positive integers.");for(var v=p,E=y;0>=E.l(T);)v=b(v),E=b(E);var A=M(v,1),C=M(E,1);for(E=M(E,2),v=M(v,2);!R(E);){var I=C.add(E);0>=I.l(T)&&(A=A.add(v),C=I),E=M(E,1),v=M(v,1)}return y=w(T,A.j(y)),new S(A,y)}for(A=m;0<=T.l(y);){for(v=Math.max(1,Math.floor(T.m()/y.m())),E=Math.ceil(Math.log(v)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),C=h(v),I=C.j(y);x(I)||0<I.l(T);)v-=E,C=h(v),I=C.j(y);R(C)&&(C=p),A=A.add(C),T=w(T,I)}return new S(A,T)}t.A=function(T){return D(this,T).h},t.and=function(T){for(var y=Math.max(this.g.length,T.g.length),v=[],E=0;E<y;E++)v[E]=this.i(E)&T.i(E);return new o(v,this.h&T.h)},t.or=function(T){for(var y=Math.max(this.g.length,T.g.length),v=[],E=0;E<y;E++)v[E]=this.i(E)|T.i(E);return new o(v,this.h|T.h)},t.xor=function(T){for(var y=Math.max(this.g.length,T.g.length),v=[],E=0;E<y;E++)v[E]=this.i(E)^T.i(E);return new o(v,this.h^T.h)};function b(T){for(var y=T.g.length+1,v=[],E=0;E<y;E++)v[E]=T.i(E)<<1|T.i(E-1)>>>31;return new o(v,T.h)}function M(T,y){var v=y>>5;y%=32;for(var E=T.g.length-v,A=[],C=0;C<E;C++)A[C]=0<y?T.i(C+v)>>>y|T.i(C+v+1)<<32-y:T.i(C+v);return new o(A,T.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,ov=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,vr=o}).apply(typeof sv<"u"?sv:typeof self<"u"?self:typeof window<"u"?window:{});var Gl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var av,ko,lv,Kl,Hd,uv,cv,hv;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,c,d){return a==Array.prototype||a==Object.prototype||(a[c]=d.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Gl=="object"&&Gl];for(var c=0;c<a.length;++c){var d=a[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=n(this);function i(a,c){if(c)e:{var d=r;a=a.split(".");for(var g=0;g<a.length-1;g++){var N=a[g];if(!(N in d))break e;d=d[N]}a=a[a.length-1],g=d[a],c=c(g),c!=g&&c!=null&&e(d,a,{configurable:!0,writable:!0,value:c})}}function s(a,c){a instanceof String&&(a+="");var d=0,g=!1,N={next:function(){if(!g&&d<a.length){var V=d++;return{value:c(V,a[V]),done:!1}}return g=!0,{done:!0,value:void 0}}};return N[Symbol.iterator]=function(){return N},N}i("Array.prototype.values",function(a){return a||function(){return s(this,function(c,d){return d})}});/** @license

   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */var o=o||{},l=this||self;function u(a){var c=typeof a;return c=c!="object"?c:a?Array.isArray(a)?"array":c:"null",c=="array"||c=="object"&&typeof a.length=="number"}function h(a){var c=typeof a;return c=="object"&&a!=null||c=="function"}function f(a,c,d){return a.call.apply(a.bind,arguments)}function m(a,c,d){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var N=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(N,g),a.apply(c,N)}}return function(){return a.apply(c,arguments)}}function p(a,c,d){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,p.apply(null,arguments)}function k(a,c){var d=Array.prototype.slice.call(arguments,1);return function(){var g=d.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function R(a,c){function d(){}d.prototype=c.prototype,a.aa=c.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(g,N,V){for(var z=Array(arguments.length-2),fe=2;fe<arguments.length;fe++)z[fe-2]=arguments[fe];return c.prototype[N].apply(g,z)}}function x(a){const c=a.length;if(0<c){const d=Array(c);for(let g=0;g<c;g++)d[g]=a[g];return d}return[]}function P(a,c){for(let d=1;d<arguments.length;d++){const g=arguments[d];if(u(g)){const N=a.length||0,V=g.length||0;a.length=N+V;for(let z=0;z<V;z++)a[N+z]=g[z]}else a.push(g)}}class w{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function _(a){return/^[\s\xa0]*$/.test(a)}function S(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function D(a){return D[" "](a),a}D[" "]=function(){};var b=S().indexOf("Gecko")!=-1&&!(S().toLowerCase().indexOf("webkit")!=-1&&S().indexOf("Edge")==-1)&&!(S().indexOf("Trident")!=-1||S().indexOf("MSIE")!=-1)&&S().indexOf("Edge")==-1;function M(a,c,d){for(const g in a)c.call(d,a[g],g,a)}function T(a,c){for(const d in a)c.call(void 0,a[d],d,a)}function y(a){const c={};for(const d in a)c[d]=a[d];return c}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(a,c){let d,g;for(let N=1;N<arguments.length;N++){g=arguments[N];for(d in g)a[d]=g[d];for(let V=0;V<v.length;V++)d=v[V],Object.prototype.hasOwnProperty.call(g,d)&&(a[d]=g[d])}}function A(a){var c=1;a=a.split(":");const d=[];for(;0<c&&a.length;)d.push(a.shift()),c--;return a.length&&d.push(a.join(":")),d}function C(a){l.setTimeout(()=>{throw a},0)}function I(){var a=H;let c=null;return a.g&&(c=a.g,a.g=a.g.next,a.g||(a.h=null),c.next=null),c}class Ae{constructor(){this.h=this.g=null}add(c,d){const g=st.get();g.set(c,d),this.h?this.h.next=g:this.g=g,this.h=g}}var st=new w(()=>new he,a=>a.reset());class he{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Y,U=!1,H=new Ae,q=()=>{const a=l.Promise.resolve(void 0);Y=()=>{a.then(le)}};var le=()=>{for(var a;a=I();){try{a.h.call(a.g)}catch(d){C(d)}var c=st;c.j(a),100>c.h&&(c.h++,a.next=c.g,c.g=a)}U=!1};function de(){this.s=this.s,this.C=this.C}de.prototype.s=!1,de.prototype.ma=function(){this.s||(this.s=!0,this.N())},de.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function xe(a,c){this.type=a,this.g=this.target=c,this.defaultPrevented=!1}xe.prototype.h=function(){this.defaultPrevented=!0};var Ln=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,c=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};l.addEventListener("test",d,c),l.removeEventListener("test",d,c)}catch{}return a}();function Mn(a,c){if(xe.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=c,c=a.relatedTarget){if(b){e:{try{D(c.nodeName);var N=!0;break e}catch{}N=!1}N||(c=null)}}else d=="mouseover"?c=a.fromElement:d=="mouseout"&&(c=a.toElement);this.relatedTarget=c,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Fn[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&Mn.aa.h.call(this)}}R(Mn,xe);var Fn={2:"touch",3:"pen",4:"mouse"};Mn.prototype.h=function(){Mn.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Un="closure_listenable_"+(1e6*Math.random()|0),Sx=0;function Ax(a,c,d,g,N){this.listener=a,this.proxy=null,this.src=c,this.type=d,this.capture=!!g,this.ha=N,this.key=++Sx,this.da=this.fa=!1}function Ou(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Lu(a){this.src=a,this.g={},this.h=0}Lu.prototype.add=function(a,c,d,g,N){var V=a.toString();a=this.g[V],a||(a=this.g[V]=[],this.h++);var z=Gf(a,c,g,N);return-1<z?(c=a[z],d||(c.fa=!1)):(c=new Ax(c,this.src,V,!!g,N),c.fa=d,a.push(c)),c};function qf(a,c){var d=c.type;if(d in a.g){var g=a.g[d],N=Array.prototype.indexOf.call(g,c,void 0),V;(V=0<=N)&&Array.prototype.splice.call(g,N,1),V&&(Ou(c),a.g[d].length==0&&(delete a.g[d],a.h--))}}function Gf(a,c,d,g){for(var N=0;N<a.length;++N){var V=a[N];if(!V.da&&V.listener==c&&V.capture==!!d&&V.ha==g)return N}return-1}var Kf="closure_lm_"+(1e6*Math.random()|0),Qf={};function oE(a,c,d,g,N){if(Array.isArray(c)){for(var V=0;V<c.length;V++)oE(a,c[V],d,g,N);return null}return d=uE(d),a&&a[Un]?a.K(c,d,h(g)?!!g.capture:!1,N):kx(a,c,d,!1,g,N)}function kx(a,c,d,g,N,V){if(!c)throw Error("Invalid event type");var z=h(N)?!!N.capture:!!N,fe=Yf(a);if(fe||(a[Kf]=fe=new Lu(a)),d=fe.add(c,d,g,z,V),d.proxy)return d;if(g=Cx(),d.proxy=g,g.src=a,g.listener=d,a.addEventListener)Ln||(N=z),N===void 0&&(N=!1),a.addEventListener(c.toString(),g,N);else if(a.attachEvent)a.attachEvent(lE(c.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Cx(){function a(d){return c.call(a.src,a.listener,d)}const c=Rx;return a}function aE(a,c,d,g,N){if(Array.isArray(c))for(var V=0;V<c.length;V++)aE(a,c[V],d,g,N);else g=h(g)?!!g.capture:!!g,d=uE(d),a&&a[Un]?(a=a.i,c=String(c).toString(),c in a.g&&(V=a.g[c],d=Gf(V,d,g,N),-1<d&&(Ou(V[d]),Array.prototype.splice.call(V,d,1),V.length==0&&(delete a.g[c],a.h--)))):a&&(a=Yf(a))&&(c=a.g[c.toString()],a=-1,c&&(a=Gf(c,d,g,N)),(d=-1<a?c[a]:null)&&Xf(d))}function Xf(a){if(typeof a!="number"&&a&&!a.da){var c=a.src;if(c&&c[Un])qf(c.i,a);else{var d=a.type,g=a.proxy;c.removeEventListener?c.removeEventListener(d,g,a.capture):c.detachEvent?c.detachEvent(lE(d),g):c.addListener&&c.removeListener&&c.removeListener(g),(d=Yf(c))?(qf(d,a),d.h==0&&(d.src=null,c[Kf]=null)):Ou(a)}}}function lE(a){return a in Qf?Qf[a]:Qf[a]="on"+a}function Rx(a,c){if(a.da)a=!0;else{c=new Mn(c,this);var d=a.listener,g=a.ha||a.src;a.fa&&Xf(a),a=d.call(g,c)}return a}function Yf(a){return a=a[Kf],a instanceof Lu?a:null}var Jf="__closure_events_fn_"+(1e9*Math.random()>>>0);function uE(a){return typeof a=="function"?a:(a[Jf]||(a[Jf]=function(c){return a.handleEvent(c)}),a[Jf])}function ot(){de.call(this),this.i=new Lu(this),this.M=this,this.F=null}R(ot,de),ot.prototype[Un]=!0,ot.prototype.removeEventListener=function(a,c,d,g){aE(this,a,c,d,g)};function ft(a,c){var d,g=a.F;if(g)for(d=[];g;g=g.F)d.push(g);if(a=a.M,g=c.type||c,typeof c=="string")c=new xe(c,a);else if(c instanceof xe)c.target=c.target||a;else{var N=c;c=new xe(g,a),E(c,N)}if(N=!0,d)for(var V=d.length-1;0<=V;V--){var z=c.g=d[V];N=Mu(z,g,!0,c)&&N}if(z=c.g=a,N=Mu(z,g,!0,c)&&N,N=Mu(z,g,!1,c)&&N,d)for(V=0;V<d.length;V++)z=c.g=d[V],N=Mu(z,g,!1,c)&&N}ot.prototype.N=function(){if(ot.aa.N.call(this),this.i){var a=this.i,c;for(c in a.g){for(var d=a.g[c],g=0;g<d.length;g++)Ou(d[g]);delete a.g[c],a.h--}}this.F=null},ot.prototype.K=function(a,c,d,g){return this.i.add(String(a),c,!1,d,g)},ot.prototype.L=function(a,c,d,g){return this.i.add(String(a),c,!0,d,g)};function Mu(a,c,d,g){if(c=a.i.g[String(c)],!c)return!0;c=c.concat();for(var N=!0,V=0;V<c.length;++V){var z=c[V];if(z&&!z.da&&z.capture==d){var fe=z.listener,Xe=z.ha||z.src;z.fa&&qf(a.i,z),N=fe.call(Xe,g)!==!1&&N}}return N&&!g.defaultPrevented}function cE(a,c,d){if(typeof a=="function")d&&(a=p(a,d));else if(a&&typeof a.handleEvent=="function")a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:l.setTimeout(a,c||0)}function hE(a){a.g=cE(()=>{a.g=null,a.i&&(a.i=!1,hE(a))},a.l);const c=a.h;a.h=null,a.m.apply(null,c)}class Px extends de{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:hE(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Xo(a){de.call(this),this.h=a,this.g={}}R(Xo,de);var dE=[];function fE(a){M(a.g,function(c,d){this.g.hasOwnProperty(d)&&Xf(c)},a),a.g={}}Xo.prototype.N=function(){Xo.aa.N.call(this),fE(this)},Xo.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Zf=l.JSON.stringify,xx=l.JSON.parse,Nx=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function ep(){}ep.prototype.h=null;function pE(a){return a.h||(a.h=a.i())}function mE(){}var Yo={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function tp(){xe.call(this,"d")}R(tp,xe);function np(){xe.call(this,"c")}R(np,xe);var ai={},gE=null;function Fu(){return gE=gE||new ot}ai.La="serverreachability";function yE(a){xe.call(this,ai.La,a)}R(yE,xe);function Jo(a){const c=Fu();ft(c,new yE(c))}ai.STAT_EVENT="statevent";function _E(a,c){xe.call(this,ai.STAT_EVENT,a),this.stat=c}R(_E,xe);function pt(a){const c=Fu();ft(c,new _E(c,a))}ai.Ma="timingevent";function vE(a,c){xe.call(this,ai.Ma,a),this.size=c}R(vE,xe);function Zo(a,c){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},c)}function ea(){this.g=!0}ea.prototype.xa=function(){this.g=!1};function Dx(a,c,d,g,N,V){a.info(function(){if(a.g)if(V)for(var z="",fe=V.split("&"),Xe=0;Xe<fe.length;Xe++){var ie=fe[Xe].split("=");if(1<ie.length){var at=ie[0];ie=ie[1];var lt=at.split("_");z=2<=lt.length&&lt[1]=="type"?z+(at+"="+ie+"&"):z+(at+"=redacted&")}}else z=null;else z=V;return"XMLHTTP REQ ("+g+") [attempt "+N+"]: "+c+`
`+d+`
`+z})}function bx(a,c,d,g,N,V,z){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+N+"]: "+c+`
`+d+`
`+V+" "+z})}function Es(a,c,d,g){a.info(function(){return"XMLHTTP TEXT ("+c+"): "+Ox(a,d)+(g?" "+g:"")})}function Vx(a,c){a.info(function(){return"TIMEOUT: "+c})}ea.prototype.info=function(){};function Ox(a,c){if(!a.g)return c;if(!c)return null;try{var d=JSON.parse(c);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var g=d[a];if(!(2>g.length)){var N=g[1];if(Array.isArray(N)&&!(1>N.length)){var V=N[0];if(V!="noop"&&V!="stop"&&V!="close")for(var z=1;z<N.length;z++)N[z]=""}}}}return Zf(d)}catch{return c}}var Uu={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},wE={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},rp;function zu(){}R(zu,ep),zu.prototype.g=function(){return new XMLHttpRequest},zu.prototype.i=function(){return{}},rp=new zu;function Pr(a,c,d,g){this.j=a,this.i=c,this.l=d,this.R=g||1,this.U=new Xo(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new EE}function EE(){this.i=null,this.g="",this.h=!1}var TE={},ip={};function sp(a,c,d){a.L=1,a.v=Hu(zn(c)),a.m=d,a.P=!0,IE(a,null)}function IE(a,c){a.F=Date.now(),ju(a),a.A=zn(a.v);var d=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),ME(d.i,"t",g),a.C=0,d=a.j.J,a.h=new EE,a.g=t1(a.j,d?c:null,!a.m),0<a.O&&(a.M=new Px(p(a.Y,a,a.g),a.O)),c=a.U,d=a.g,g=a.ca;var N="readystatechange";Array.isArray(N)||(N&&(dE[0]=N.toString()),N=dE);for(var V=0;V<N.length;V++){var z=oE(d,N[V],g||c.handleEvent,!1,c.h||c);if(!z)break;c.g[z.key]=z}c=a.H?y(a.H):{},a.m?(a.u||(a.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,c)):(a.u="GET",a.g.ea(a.A,a.u,null,c)),Jo(),Dx(a.i,a.u,a.A,a.l,a.R,a.m)}Pr.prototype.ca=function(a){a=a.target;const c=this.M;c&&jn(a)==3?c.j():this.Y(a)},Pr.prototype.Y=function(a){try{if(a==this.g)e:{const lt=jn(this.g);var c=this.g.Ba();const Ss=this.g.Z();if(!(3>lt)&&(lt!=3||this.g&&(this.h.h||this.g.oa()||HE(this.g)))){this.J||lt!=4||c==7||(c==8||0>=Ss?Jo(3):Jo(2)),op(this);var d=this.g.Z();this.X=d;t:if(SE(this)){var g=HE(this.g);a="";var N=g.length,V=jn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){li(this),ta(this);var z="";break t}this.h.i=new l.TextDecoder}for(c=0;c<N;c++)this.h.h=!0,a+=this.h.i.decode(g[c],{stream:!(V&&c==N-1)});g.length=0,this.h.g+=a,this.C=0,z=this.h.g}else z=this.g.oa();if(this.o=d==200,bx(this.i,this.u,this.A,this.l,this.R,lt,d),this.o){if(this.T&&!this.K){t:{if(this.g){var fe,Xe=this.g;if((fe=Xe.g?Xe.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(fe)){var ie=fe;break t}}ie=null}if(d=ie)Es(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,ap(this,d);else{this.o=!1,this.s=3,pt(12),li(this),ta(this);break e}}if(this.P){d=!0;let en;for(;!this.J&&this.C<z.length;)if(en=Lx(this,z),en==ip){lt==4&&(this.s=4,pt(14),d=!1),Es(this.i,this.l,null,"[Incomplete Response]");break}else if(en==TE){this.s=4,pt(15),Es(this.i,this.l,z,"[Invalid Chunk]"),d=!1;break}else Es(this.i,this.l,en,null),ap(this,en);if(SE(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),lt!=4||z.length!=0||this.h.h||(this.s=1,pt(16),d=!1),this.o=this.o&&d,!d)Es(this.i,this.l,z,"[Invalid Chunked Response]"),li(this),ta(this);else if(0<z.length&&!this.W){this.W=!0;var at=this.j;at.g==this&&at.ba&&!at.M&&(at.j.info("Great, no buffering proxy detected. Bytes received: "+z.length),fp(at),at.M=!0,pt(11))}}else Es(this.i,this.l,z,null),ap(this,z);lt==4&&li(this),this.o&&!this.J&&(lt==4?YE(this.j,this):(this.o=!1,ju(this)))}else Zx(this.g),d==400&&0<z.indexOf("Unknown SID")?(this.s=3,pt(12)):(this.s=0,pt(13)),li(this),ta(this)}}}catch{}finally{}};function SE(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Lx(a,c){var d=a.C,g=c.indexOf(`
`,d);return g==-1?ip:(d=Number(c.substring(d,g)),isNaN(d)?TE:(g+=1,g+d>c.length?ip:(c=c.slice(g,g+d),a.C=g+d,c)))}Pr.prototype.cancel=function(){this.J=!0,li(this)};function ju(a){a.S=Date.now()+a.I,AE(a,a.I)}function AE(a,c){if(a.B!=null)throw Error("WatchDog timer not null");a.B=Zo(p(a.ba,a),c)}function op(a){a.B&&(l.clearTimeout(a.B),a.B=null)}Pr.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Vx(this.i,this.A),this.L!=2&&(Jo(),pt(17)),li(this),this.s=2,ta(this)):AE(this,this.S-a)};function ta(a){a.j.G==0||a.J||YE(a.j,a)}function li(a){op(a);var c=a.M;c&&typeof c.ma=="function"&&c.ma(),a.M=null,fE(a.U),a.g&&(c=a.g,a.g=null,c.abort(),c.ma())}function ap(a,c){try{var d=a.j;if(d.G!=0&&(d.g==a||lp(d.h,a))){if(!a.K&&lp(d.h,a)&&d.G==3){try{var g=d.Da.g.parse(c)}catch{g=null}if(Array.isArray(g)&&g.length==3){var N=g;if(N[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)Xu(d),Ku(d);else break e;dp(d),pt(18)}}else d.za=N[1],0<d.za-d.T&&37500>N[2]&&d.F&&d.v==0&&!d.C&&(d.C=Zo(p(d.Za,d),6e3));if(1>=RE(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else ci(d,11)}else if((a.K||d.g==a)&&Xu(d),!_(c))for(N=d.Da.g.parse(c),c=0;c<N.length;c++){let ie=N[c];if(d.T=ie[0],ie=ie[1],d.G==2)if(ie[0]=="c"){d.K=ie[1],d.ia=ie[2];const at=ie[3];at!=null&&(d.la=at,d.j.info("VER="+d.la));const lt=ie[4];lt!=null&&(d.Aa=lt,d.j.info("SVER="+d.Aa));const Ss=ie[5];Ss!=null&&typeof Ss=="number"&&0<Ss&&(g=1.5*Ss,d.L=g,d.j.info("backChannelRequestTimeoutMs_="+g)),g=d;const en=a.g;if(en){const Ju=en.g?en.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ju){var V=g.h;V.g||Ju.indexOf("spdy")==-1&&Ju.indexOf("quic")==-1&&Ju.indexOf("h2")==-1||(V.j=V.l,V.g=new Set,V.h&&(up(V,V.h),V.h=null))}if(g.D){const pp=en.g?en.g.getResponseHeader("X-HTTP-Session-Id"):null;pp&&(g.ya=pp,ve(g.I,g.D,pp))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),g=d;var z=a;if(g.qa=e1(g,g.J?g.ia:null,g.W),z.K){PE(g.h,z);var fe=z,Xe=g.L;Xe&&(fe.I=Xe),fe.B&&(op(fe),ju(fe)),g.g=z}else QE(g);0<d.i.length&&Qu(d)}else ie[0]!="stop"&&ie[0]!="close"||ci(d,7);else d.G==3&&(ie[0]=="stop"||ie[0]=="close"?ie[0]=="stop"?ci(d,7):hp(d):ie[0]!="noop"&&d.l&&d.l.ta(ie),d.v=0)}}Jo(4)}catch{}}var Mx=class{constructor(a,c){this.g=a,this.map=c}};function kE(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function CE(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function RE(a){return a.h?1:a.g?a.g.size:0}function lp(a,c){return a.h?a.h==c:a.g?a.g.has(c):!1}function up(a,c){a.g?a.g.add(c):a.h=c}function PE(a,c){a.h&&a.h==c?a.h=null:a.g&&a.g.has(c)&&a.g.delete(c)}kE.prototype.cancel=function(){if(this.i=xE(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function xE(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let c=a.i;for(const d of a.g.values())c=c.concat(d.D);return c}return x(a.i)}function Fx(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var c=[],d=a.length,g=0;g<d;g++)c.push(a[g]);return c}c=[],d=0;for(g in a)c[d++]=a[g];return c}function Ux(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var c=[];a=a.length;for(var d=0;d<a;d++)c.push(d);return c}c=[],d=0;for(const g in a)c[d++]=g;return c}}}function NE(a,c){if(a.forEach&&typeof a.forEach=="function")a.forEach(c,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,c,void 0);else for(var d=Ux(a),g=Fx(a),N=g.length,V=0;V<N;V++)c.call(void 0,g[V],d&&d[V],a)}var DE=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function zx(a,c){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var g=a[d].indexOf("="),N=null;if(0<=g){var V=a[d].substring(0,g);N=a[d].substring(g+1)}else V=a[d];c(V,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function ui(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof ui){this.h=a.h,Bu(this,a.j),this.o=a.o,this.g=a.g,$u(this,a.s),this.l=a.l;var c=a.i,d=new ia;d.i=c.i,c.g&&(d.g=new Map(c.g),d.h=c.h),bE(this,d),this.m=a.m}else a&&(c=String(a).match(DE))?(this.h=!1,Bu(this,c[1]||"",!0),this.o=na(c[2]||""),this.g=na(c[3]||"",!0),$u(this,c[4]),this.l=na(c[5]||"",!0),bE(this,c[6]||"",!0),this.m=na(c[7]||"")):(this.h=!1,this.i=new ia(null,this.h))}ui.prototype.toString=function(){var a=[],c=this.j;c&&a.push(ra(c,VE,!0),":");var d=this.g;return(d||c=="file")&&(a.push("//"),(c=this.o)&&a.push(ra(c,VE,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(ra(d,d.charAt(0)=="/"?$x:Bx,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",ra(d,Wx)),a.join("")};function zn(a){return new ui(a)}function Bu(a,c,d){a.j=d?na(c,!0):c,a.j&&(a.j=a.j.replace(/:$/,""))}function $u(a,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);a.s=c}else a.s=null}function bE(a,c,d){c instanceof ia?(a.i=c,qx(a.i,a.h)):(d||(c=ra(c,Hx)),a.i=new ia(c,a.h))}function ve(a,c,d){a.i.set(c,d)}function Hu(a){return ve(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function na(a,c){return a?c?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function ra(a,c,d){return typeof a=="string"?(a=encodeURI(a).replace(c,jx),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function jx(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var VE=/[#\/\?@]/g,Bx=/[#\?:]/g,$x=/[#\?]/g,Hx=/[#\?@]/g,Wx=/#/g;function ia(a,c){this.h=this.g=null,this.i=a||null,this.j=!!c}function xr(a){a.g||(a.g=new Map,a.h=0,a.i&&zx(a.i,function(c,d){a.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}t=ia.prototype,t.add=function(a,c){xr(this),this.i=null,a=Ts(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(c),this.h+=1,this};function OE(a,c){xr(a),c=Ts(a,c),a.g.has(c)&&(a.i=null,a.h-=a.g.get(c).length,a.g.delete(c))}function LE(a,c){return xr(a),c=Ts(a,c),a.g.has(c)}t.forEach=function(a,c){xr(this),this.g.forEach(function(d,g){d.forEach(function(N){a.call(c,N,g,this)},this)},this)},t.na=function(){xr(this);const a=Array.from(this.g.values()),c=Array.from(this.g.keys()),d=[];for(let g=0;g<c.length;g++){const N=a[g];for(let V=0;V<N.length;V++)d.push(c[g])}return d},t.V=function(a){xr(this);let c=[];if(typeof a=="string")LE(this,a)&&(c=c.concat(this.g.get(Ts(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)c=c.concat(a[d])}return c},t.set=function(a,c){return xr(this),this.i=null,a=Ts(this,a),LE(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[c]),this.h+=1,this},t.get=function(a,c){return a?(a=this.V(a),0<a.length?String(a[0]):c):c};function ME(a,c,d){OE(a,c),0<d.length&&(a.i=null,a.g.set(Ts(a,c),x(d)),a.h+=d.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],c=Array.from(this.g.keys());for(var d=0;d<c.length;d++){var g=c[d];const V=encodeURIComponent(String(g)),z=this.V(g);for(g=0;g<z.length;g++){var N=V;z[g]!==""&&(N+="="+encodeURIComponent(String(z[g]))),a.push(N)}}return this.i=a.join("&")};function Ts(a,c){return c=String(c),a.j&&(c=c.toLowerCase()),c}function qx(a,c){c&&!a.j&&(xr(a),a.i=null,a.g.forEach(function(d,g){var N=g.toLowerCase();g!=N&&(OE(this,g),ME(this,N,d))},a)),a.j=c}function Gx(a,c){const d=new ea;if(l.Image){const g=new Image;g.onload=k(Nr,d,"TestLoadImage: loaded",!0,c,g),g.onerror=k(Nr,d,"TestLoadImage: error",!1,c,g),g.onabort=k(Nr,d,"TestLoadImage: abort",!1,c,g),g.ontimeout=k(Nr,d,"TestLoadImage: timeout",!1,c,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else c(!1)}function Kx(a,c){const d=new ea,g=new AbortController,N=setTimeout(()=>{g.abort(),Nr(d,"TestPingServer: timeout",!1,c)},1e4);fetch(a,{signal:g.signal}).then(V=>{clearTimeout(N),V.ok?Nr(d,"TestPingServer: ok",!0,c):Nr(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(N),Nr(d,"TestPingServer: error",!1,c)})}function Nr(a,c,d,g,N){try{N&&(N.onload=null,N.onerror=null,N.onabort=null,N.ontimeout=null),g(d)}catch{}}function Qx(){this.g=new Nx}function Xx(a,c,d){const g=d||"";try{NE(a,function(N,V){let z=N;h(N)&&(z=Zf(N)),c.push(g+V+"="+encodeURIComponent(z))})}catch(N){throw c.push(g+"type="+encodeURIComponent("_badmap")),N}}function Wu(a){this.l=a.Ub||null,this.j=a.eb||!1}R(Wu,ep),Wu.prototype.g=function(){return new qu(this.l,this.j)},Wu.prototype.i=function(a){return function(){return a}}({});function qu(a,c){ot.call(this),this.D=a,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}R(qu,ot),t=qu.prototype,t.open=function(a,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=c,this.readyState=1,oa(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(c.body=a),(this.D||l).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,sa(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,oa(this)),this.g&&(this.readyState=3,oa(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;FE(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function FE(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var c=a.value?a.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!a.done}))&&(this.response=this.responseText+=c)}a.done?sa(this):oa(this),this.readyState==3&&FE(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,sa(this))},t.Qa=function(a){this.g&&(this.response=a,sa(this))},t.ga=function(){this.g&&sa(this)};function sa(a){a.readyState=4,a.l=null,a.j=null,a.v=null,oa(a)}t.setRequestHeader=function(a,c){this.u.append(a,c)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=c.next();return a.join(`\r
`)};function oa(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(qu.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function UE(a){let c="";return M(a,function(d,g){c+=g,c+=":",c+=d,c+=`\r
`}),c}function cp(a,c,d){e:{for(g in d){var g=!1;break e}g=!0}g||(d=UE(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):ve(a,c,d))}function Ce(a){ot.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}R(Ce,ot);var Yx=/^https?$/i,Jx=["POST","PUT"];t=Ce.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,c,d,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);c=c?c.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():rp.g(),this.v=this.o?pE(this.o):pE(rp),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(c,String(a),!0),this.B=!1}catch(V){zE(this,V);return}if(a=d||"",d=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var N in g)d.set(N,g[N]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const V of g.keys())d.set(V,g.get(V));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(d.keys()).find(V=>V.toLowerCase()=="content-type"),N=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Jx,c,void 0))||g||N||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[V,z]of d)this.g.setRequestHeader(V,z);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{$E(this),this.u=!0,this.g.send(a),this.u=!1}catch(V){zE(this,V)}};function zE(a,c){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=c,a.m=5,jE(a),Gu(a)}function jE(a){a.A||(a.A=!0,ft(a,"complete"),ft(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,ft(this,"complete"),ft(this,"abort"),Gu(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Gu(this,!0)),Ce.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?BE(this):this.bb())},t.bb=function(){BE(this)};function BE(a){if(a.h&&typeof o<"u"&&(!a.v[1]||jn(a)!=4||a.Z()!=2)){if(a.u&&jn(a)==4)cE(a.Ea,0,a);else if(ft(a,"readystatechange"),jn(a)==4){a.h=!1;try{const z=a.Z();e:switch(z){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var g;if(g=z===0){var N=String(a.D).match(DE)[1]||null;!N&&l.self&&l.self.location&&(N=l.self.location.protocol.slice(0,-1)),g=!Yx.test(N?N.toLowerCase():"")}d=g}if(d)ft(a,"complete"),ft(a,"success");else{a.m=6;try{var V=2<jn(a)?a.g.statusText:""}catch{V=""}a.l=V+" ["+a.Z()+"]",jE(a)}}finally{Gu(a)}}}}function Gu(a,c){if(a.g){$E(a);const d=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,c||ft(a,"ready");try{d.onreadystatechange=g}catch{}}}function $E(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function jn(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<jn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var c=this.g.responseText;return a&&c.indexOf(a)==0&&(c=c.substring(a.length)),xx(c)}};function HE(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Zx(a){const c={};a=(a.g&&2<=jn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(_(a[g]))continue;var d=A(a[g]);const N=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const V=c[N]||[];c[N]=V,V.push(d)}T(c,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function aa(a,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||c}function WE(a){this.Aa=0,this.i=[],this.j=new ea,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=aa("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=aa("baseRetryDelayMs",5e3,a),this.cb=aa("retryDelaySeedMs",1e4,a),this.Wa=aa("forwardChannelMaxRetries",2,a),this.wa=aa("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new kE(a&&a.concurrentRequestLimit),this.Da=new Qx,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=WE.prototype,t.la=8,t.G=1,t.connect=function(a,c,d,g){pt(0),this.W=a,this.H=c||{},d&&g!==void 0&&(this.H.OSID=d,this.H.OAID=g),this.F=this.X,this.I=e1(this,null,this.W),Qu(this)};function hp(a){if(qE(a),a.G==3){var c=a.U++,d=zn(a.I);if(ve(d,"SID",a.K),ve(d,"RID",c),ve(d,"TYPE","terminate"),la(a,d),c=new Pr(a,a.j,c),c.L=2,c.v=Hu(zn(d)),d=!1,l.navigator&&l.navigator.sendBeacon)try{d=l.navigator.sendBeacon(c.v.toString(),"")}catch{}!d&&l.Image&&(new Image().src=c.v,d=!0),d||(c.g=t1(c.j,null),c.g.ea(c.v)),c.F=Date.now(),ju(c)}ZE(a)}function Ku(a){a.g&&(fp(a),a.g.cancel(),a.g=null)}function qE(a){Ku(a),a.u&&(l.clearTimeout(a.u),a.u=null),Xu(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Qu(a){if(!CE(a.h)&&!a.s){a.s=!0;var c=a.Ga;Y||q(),U||(Y(),U=!0),H.add(c,a),a.B=0}}function eN(a,c){return RE(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=c.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=Zo(p(a.Ga,a,c),JE(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const N=new Pr(this,this.j,a);let V=this.o;if(this.S&&(V?(V=y(V),E(V,this.S)):V=this.S),this.m!==null||this.O||(N.H=V,V=null),this.P)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var g=this.i[d];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(c+=g,4096<c){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=KE(this,N,c),d=zn(this.I),ve(d,"RID",a),ve(d,"CVER",22),this.D&&ve(d,"X-HTTP-Session-Id",this.D),la(this,d),V&&(this.O?c="headers="+encodeURIComponent(String(UE(V)))+"&"+c:this.m&&cp(d,this.m,V)),up(this.h,N),this.Ua&&ve(d,"TYPE","init"),this.P?(ve(d,"$req",c),ve(d,"SID","null"),N.T=!0,sp(N,d,null)):sp(N,d,c),this.G=2}}else this.G==3&&(a?GE(this,a):this.i.length==0||CE(this.h)||GE(this))};function GE(a,c){var d;c?d=c.l:d=a.U++;const g=zn(a.I);ve(g,"SID",a.K),ve(g,"RID",d),ve(g,"AID",a.T),la(a,g),a.m&&a.o&&cp(g,a.m,a.o),d=new Pr(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),c&&(a.i=c.D.concat(a.i)),c=KE(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),up(a.h,d),sp(d,g,c)}function la(a,c){a.H&&M(a.H,function(d,g){ve(c,g,d)}),a.l&&NE({},function(d,g){ve(c,g,d)})}function KE(a,c,d){d=Math.min(a.i.length,d);var g=a.l?p(a.l.Na,a.l,a):null;e:{var N=a.i;let V=-1;for(;;){const z=["count="+d];V==-1?0<d?(V=N[0].g,z.push("ofs="+V)):V=0:z.push("ofs="+V);let fe=!0;for(let Xe=0;Xe<d;Xe++){let ie=N[Xe].g;const at=N[Xe].map;if(ie-=V,0>ie)V=Math.max(0,N[Xe].g-100),fe=!1;else try{Xx(at,z,"req"+ie+"_")}catch{g&&g(at)}}if(fe){g=z.join("&");break e}}}return a=a.i.splice(0,d),c.D=a,g}function QE(a){if(!a.g&&!a.u){a.Y=1;var c=a.Fa;Y||q(),U||(Y(),U=!0),H.add(c,a),a.v=0}}function dp(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=Zo(p(a.Fa,a),JE(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,XE(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=Zo(p(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,pt(10),Ku(this),XE(this))};function fp(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function XE(a){a.g=new Pr(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var c=zn(a.qa);ve(c,"RID","rpc"),ve(c,"SID",a.K),ve(c,"AID",a.T),ve(c,"CI",a.F?"0":"1"),!a.F&&a.ja&&ve(c,"TO",a.ja),ve(c,"TYPE","xmlhttp"),la(a,c),a.m&&a.o&&cp(c,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=Hu(zn(c)),d.m=null,d.P=!0,IE(d,a)}t.Za=function(){this.C!=null&&(this.C=null,Ku(this),dp(this),pt(19))};function Xu(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function YE(a,c){var d=null;if(a.g==c){Xu(a),fp(a),a.g=null;var g=2}else if(lp(a.h,c))d=c.D,PE(a.h,c),g=1;else return;if(a.G!=0){if(c.o)if(g==1){d=c.m?c.m.length:0,c=Date.now()-c.F;var N=a.B;g=Fu(),ft(g,new vE(g,d)),Qu(a)}else QE(a);else if(N=c.s,N==3||N==0&&0<c.X||!(g==1&&eN(a,c)||g==2&&dp(a)))switch(d&&0<d.length&&(c=a.h,c.i=c.i.concat(d)),N){case 1:ci(a,5);break;case 4:ci(a,10);break;case 3:ci(a,6);break;default:ci(a,2)}}}function JE(a,c){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*c}function ci(a,c){if(a.j.info("Error code "+c),c==2){var d=p(a.fb,a),g=a.Xa;const N=!g;g=new ui(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Bu(g,"https"),Hu(g),N?Gx(g.toString(),d):Kx(g.toString(),d)}else pt(2);a.G=0,a.l&&a.l.sa(c),ZE(a),qE(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),pt(2)):(this.j.info("Failed to ping google.com"),pt(1))};function ZE(a){if(a.G=0,a.ka=[],a.l){const c=xE(a.h);(c.length!=0||a.i.length!=0)&&(P(a.ka,c),P(a.ka,a.i),a.h.i.length=0,x(a.i),a.i.length=0),a.l.ra()}}function e1(a,c,d){var g=d instanceof ui?zn(d):new ui(d);if(g.g!="")c&&(g.g=c+"."+g.g),$u(g,g.s);else{var N=l.location;g=N.protocol,c=c?c+"."+N.hostname:N.hostname,N=+N.port;var V=new ui(null);g&&Bu(V,g),c&&(V.g=c),N&&$u(V,N),d&&(V.l=d),g=V}return d=a.D,c=a.ya,d&&c&&ve(g,d,c),ve(g,"VER",a.la),la(a,g),g}function t1(a,c,d){if(c&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=a.Ca&&!a.pa?new Ce(new Wu({eb:d})):new Ce(a.pa),c.Ha(a.J),c}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function n1(){}t=n1.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Yu(){}Yu.prototype.g=function(a,c){return new Pt(a,c)};function Pt(a,c){ot.call(this),this.g=new WE(c),this.l=a,this.h=c&&c.messageUrlParams||null,a=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(a?a["X-WebChannel-Content-Type"]=c.messageContentType:a={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(a?a["X-WebChannel-Client-Profile"]=c.va:a={"X-WebChannel-Client-Profile":c.va}),this.g.S=a,(a=c&&c.Sb)&&!_(a)&&(this.g.m=a),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!_(c)&&(this.g.D=c,a=this.h,a!==null&&c in a&&(a=this.h,c in a&&delete a[c])),this.j=new Is(this)}R(Pt,ot),Pt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Pt.prototype.close=function(){hp(this.g)},Pt.prototype.o=function(a){var c=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=Zf(a),a=d);c.i.push(new Mx(c.Ya++,a)),c.G==3&&Qu(c)},Pt.prototype.N=function(){this.g.l=null,delete this.j,hp(this.g),delete this.g,Pt.aa.N.call(this)};function r1(a){tp.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var c=a.__sm__;if(c){e:{for(const d in c){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,c=c!==null&&a in c?c[a]:void 0),this.data=c}else this.data=a}R(r1,tp);function i1(){np.call(this),this.status=1}R(i1,np);function Is(a){this.g=a}R(Is,n1),Is.prototype.ua=function(){ft(this.g,"a")},Is.prototype.ta=function(a){ft(this.g,new r1(a))},Is.prototype.sa=function(a){ft(this.g,new i1)},Is.prototype.ra=function(){ft(this.g,"b")},Yu.prototype.createWebChannel=Yu.prototype.g,Pt.prototype.send=Pt.prototype.o,Pt.prototype.open=Pt.prototype.m,Pt.prototype.close=Pt.prototype.close,hv=function(){return new Yu},cv=function(){return Fu()},uv=ai,Hd={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Uu.NO_ERROR=0,Uu.TIMEOUT=8,Uu.HTTP_ERROR=6,Kl=Uu,wE.COMPLETE="complete",lv=wE,mE.EventType=Yo,Yo.OPEN="a",Yo.CLOSE="b",Yo.ERROR="c",Yo.MESSAGE="d",ot.prototype.listen=ot.prototype.K,ko=mE,Ce.prototype.listenOnce=Ce.prototype.L,Ce.prototype.getLastError=Ce.prototype.Ka,Ce.prototype.getLastErrorCode=Ce.prototype.Ba,Ce.prototype.getStatus=Ce.prototype.Z,Ce.prototype.getResponseJson=Ce.prototype.Oa,Ce.prototype.getResponseText=Ce.prototype.oa,Ce.prototype.send=Ce.prototype.ea,Ce.prototype.setWithCredentials=Ce.prototype.Ha,av=Ce}).apply(typeof Gl<"u"?Gl:typeof self<"u"?self:typeof window<"u"?window:{});const dv="@firebase/firestore",fv="4.8.0";/**
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
 */class nt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}nt.UNAUTHENTICATED=new nt(null),nt.GOOGLE_CREDENTIALS=new nt("google-credentials-uid"),nt.FIRST_PARTY=new nt("first-party-uid"),nt.MOCK_USER=new nt("mock-user");/**
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
 */let Ji="11.10.0";/**
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
 */const Jr=new yd("@firebase/firestore");function Zi(){return Jr.logLevel}function B(t,...e){if(Jr.logLevel<=ee.DEBUG){const n=e.map(Wd);Jr.debug(`Firestore (${Ji}): ${t}`,...n)}}function xn(t,...e){if(Jr.logLevel<=ee.ERROR){const n=e.map(Wd);Jr.error(`Firestore (${Ji}): ${t}`,...n)}}function Nn(t,...e){if(Jr.logLevel<=ee.WARN){const n=e.map(Wd);Jr.warn(`Firestore (${Ji}): ${t}`,...n)}}function Wd(t){if(typeof t=="string")return t;try{/**
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
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
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
 */function G(t,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,pv(t,r,n)}function pv(t,e,n){let r=`FIRESTORE (${Ji}) INTERNAL ASSERTION FAILED: ${e} (ID: ${t.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw xn(r),new Error(r)}function se(t,e,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,t||pv(e,i,r)}function X(t,e){return t}/**
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
 */const O={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class j extends Sn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class wr{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
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
 */class mv{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class gv{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(nt.UNAUTHENTICATED))}shutdown(){}}class CC{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class RC{constructor(e){this.t=e,this.currentUser=nt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){se(this.o===void 0,42304);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new wr;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new wr,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},l=u=>{B("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(B("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new wr)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(B("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(se(typeof r.accessToken=="string",31837,{l:r}),new mv(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return se(e===null||typeof e=="string",2055,{h:e}),new nt(e)}}class PC{constructor(e,n,r){this.P=e,this.T=n,this.I=r,this.type="FirstParty",this.user=nt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class xC{constructor(e,n,r){this.P=e,this.T=n,this.I=r}getToken(){return Promise.resolve(new PC(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable(()=>n(nt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class yv{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class NC{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,an(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){se(this.o===void 0,3512);const r=s=>{s.error!=null&&B("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,B("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{B("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):B("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new yv(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(se(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new yv(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function DC(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
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
 */function _v(){return new TextEncoder}/**
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
 */class Ql{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=DC(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%62))}return r}}function J(t,e){return t<e?-1:t>e?1:0}function qd(t,e){let n=0;for(;n<t.length&&n<e.length;){const r=t.codePointAt(n),i=e.codePointAt(n);if(r!==i){if(r<128&&i<128)return J(r,i);{const s=_v(),o=bC(s.encode(vv(t,n)),s.encode(vv(e,n)));return o!==0?o:J(r,i)}}n+=r>65535?2:1}return J(t.length,e.length)}function vv(t,e){return t.codePointAt(e)>65535?t.substring(e,e+2):t.substring(e,e+1)}function bC(t,e){for(let n=0;n<t.length&&n<e.length;++n)if(t[n]!==e[n])return J(t[n],e[n]);return J(t.length,e.length)}function es(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
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
 */const wv="__name__";class cn{constructor(e,n,r){n===void 0?n=0:n>e.length&&G(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&G(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return cn.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof cn?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=cn.compareSegments(e.get(i),n.get(i));if(s!==0)return s}return J(e.length,n.length)}static compareSegments(e,n){const r=cn.isNumericId(e),i=cn.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?cn.extractNumericId(e).compare(cn.extractNumericId(n)):qd(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return vr.fromString(e.substring(4,e.length-2))}}class me extends cn{construct(e,n,r){return new me(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new j(O.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new me(n)}static emptyPath(){return new me([])}}const VC=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Be extends cn{construct(e,n,r){return new Be(e,n,r)}static isValidIdentifier(e){return VC.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Be.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===wv}static keyField(){return new Be([wv])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new j(O.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new j(O.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new j(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(r+=l,i++):(s(),i++)}if(s(),o)throw new j(O.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Be(n)}static emptyPath(){return new Be([])}}/**
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
 */class W{constructor(e){this.path=e}static fromPath(e){return new W(me.fromString(e))}static fromName(e){return new W(me.fromString(e).popFirst(5))}static empty(){return new W(me.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&me.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return me.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new me(e.slice()))}}/**
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
 */function Ev(t,e,n){if(!n)throw new j(O.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function Tv(t,e,n,r){if(e===!0&&r===!0)throw new j(O.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Iv(t){if(!W.isDocumentKey(t))throw new j(O.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Sv(t){if(W.isDocumentKey(t))throw new j(O.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Av(t){return typeof t=="object"&&t!==null&&(Object.getPrototypeOf(t)===Object.prototype||Object.getPrototypeOf(t)===null)}function Xl(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":G(12329,{type:typeof t})}function Co(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new j(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Xl(t);throw new j(O.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
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
 */function De(t,e){const n={typeString:t};return e&&(n.value=e),n}function Ro(t,e){if(!Av(t))throw new j(O.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in e)if(e[r]){const i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in t)){n=`JSON missing required field: '${r}'`;break}const o=t[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&o!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new j(O.INVALID_ARGUMENT,n);return!0}/**
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
 */const kv=-62135596800,Cv=1e6;class ge{static now(){return ge.fromMillis(Date.now())}static fromDate(e){return ge.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*Cv);return new ge(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new j(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new j(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<kv)throw new j(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new j(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Cv}_compareTo(e){return this.seconds===e.seconds?J(this.nanoseconds,e.nanoseconds):J(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ge._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ro(e,ge._jsonSchema))return new ge(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-kv;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ge._jsonSchemaVersion="firestore/timestamp/1.0",ge._jsonSchema={type:De("string",ge._jsonSchemaVersion),seconds:De("number"),nanoseconds:De("number")};/**
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
 */class Q{static fromTimestamp(e){return new Q(e)}static min(){return new Q(new ge(0,0))}static max(){return new Q(new ge(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const Po=-1;function OC(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=Q.fromTimestamp(r===1e9?new ge(n+1,0):new ge(n,r));return new Er(i,W.empty(),e)}function LC(t){return new Er(t.readTime,t.key,Po)}class Er{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Er(Q.min(),W.empty(),Po)}static max(){return new Er(Q.max(),W.empty(),Po)}}function MC(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=W.comparator(t.documentKey,e.documentKey),n!==0?n:J(t.largestBatchId,e.largestBatchId))}/**
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
 */const FC="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class UC{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function ts(t){if(t.code!==O.FAILED_PRECONDITION||t.message!==FC)throw t;B("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class L{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&G(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new L((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof L?n:L.resolve(n)}catch(n){return L.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):L.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):L.reject(n)}static resolve(e){return new L((n,r)=>{n(e)})}static reject(e){return new L((n,r)=>{r(e)})}static waitFor(e){return new L((n,r)=>{let i=0,s=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++s,o&&s===i&&n()},u=>r(u))}),o=!0,s===i&&n()})}static or(e){let n=L.resolve(!1);for(const r of e)n=n.next(i=>i?L.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new L((r,i)=>{const s=e.length,o=new Array(s);let l=0;for(let u=0;u<s;u++){const h=u;n(e[h]).next(f=>{o[h]=f,++l,l===s&&r(o)},f=>i(f))}})}static doWhile(e,n){return new L((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}function zC(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function ns(t){return t.name==="IndexedDbTransactionError"}/**
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
 */class Yl{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this._e(r),this.ae=r=>n.writeSequenceNumber(r))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Yl.ue=-1;/**
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
 */const Gd=-1;function Jl(t){return t==null}function Zl(t){return t===0&&1/t==-1/0}function jC(t){return typeof t=="number"&&Number.isInteger(t)&&!Zl(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
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
 */const Rv="";function BC(t){let e="";for(let n=0;n<t.length;n++)e.length>0&&(e=Pv(e)),e=$C(t.get(n),e);return Pv(e)}function $C(t,e){let n=e;const r=t.length;for(let i=0;i<r;i++){const s=t.charAt(i);switch(s){case"\0":n+="";break;case Rv:n+="";break;default:n+=s}}return n}function Pv(t){return t+Rv+""}/**
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
 */function xv(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Zr(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function Nv(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
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
 */class Se{constructor(e,n){this.comparator=e,this.root=n||Qe.EMPTY}insert(e,n){return new Se(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Qe.BLACK,null,null))}remove(e){return new Se(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Qe.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new eu(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new eu(this.root,e,this.comparator,!1)}getReverseIterator(){return new eu(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new eu(this.root,e,this.comparator,!0)}}class eu{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Qe{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??Qe.RED,this.left=i??Qe.EMPTY,this.right=s??Qe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new Qe(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Qe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return Qe.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw G(43730,{key:this.key,value:this.value});if(this.right.isRed())throw G(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw G(27949);return e+(this.isRed()?0:1)}}Qe.EMPTY=null,Qe.RED=!0,Qe.BLACK=!1,Qe.EMPTY=new class{constructor(){this.size=0}get key(){throw G(57766)}get value(){throw G(16141)}get color(){throw G(16727)}get left(){throw G(29726)}get right(){throw G(36894)}copy(e,n,r,i,s){return this}insert(e,n,r){return new Qe(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Fe{constructor(e){this.comparator=e,this.data=new Se(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Dv(this.data.getIterator())}getIteratorFrom(e){return new Dv(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof Fe)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Fe(this.comparator);return n.data=e,n}}class Dv{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Xt{constructor(e){this.fields=e,e.sort(Be.comparator)}static empty(){return new Xt([])}unionWith(e){let n=new Fe(Be.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Xt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return es(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
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
 */class bv extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class $e{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new bv("Invalid base64 string: "+s):s}}(e);return new $e(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new $e(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return J(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}$e.EMPTY_BYTE_STRING=new $e("");const HC=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Tr(t){if(se(!!t,39018),typeof t=="string"){let e=0;const n=HC.exec(t);if(se(!!n,46558,{timestamp:t}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Pe(t.seconds),nanos:Pe(t.nanos)}}function Pe(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Ir(t){return typeof t=="string"?$e.fromBase64String(t):$e.fromUint8Array(t)}/**
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
 */const Vv="server_timestamp",Ov="__type__",Lv="__previous_value__",Mv="__local_write_time__";function Kd(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{})[Ov])===null||n===void 0?void 0:n.stringValue)===Vv}function tu(t){const e=t.mapValue.fields[Lv];return Kd(e)?tu(e):e}function xo(t){const e=Tr(t.mapValue.fields[Mv].timestampValue);return new ge(e.seconds,e.nanos)}/**
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
 */class WC{constructor(e,n,r,i,s,o,l,u,h,f){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h,this.isUsingEmulator=f}}const nu="(default)";class rs{constructor(e,n){this.projectId=e,this.database=n||nu}static empty(){return new rs("","")}get isDefaultDatabase(){return this.database===nu}isEqual(e){return e instanceof rs&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const Fv="__type__",qC="__max__",ru={mapValue:{}},Uv="__vector__",iu="value";function Sr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Kd(t)?4:KC(t)?9007199254740991:GC(t)?10:11:G(28295,{value:t})}function hn(t,e){if(t===e)return!0;const n=Sr(t);if(n!==Sr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return xo(t).isEqual(xo(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=Tr(i.timestampValue),l=Tr(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Ir(i.bytesValue).isEqual(Ir(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Pe(i.geoPointValue.latitude)===Pe(s.geoPointValue.latitude)&&Pe(i.geoPointValue.longitude)===Pe(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Pe(i.integerValue)===Pe(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Pe(i.doubleValue),l=Pe(s.doubleValue);return o===l?Zl(o)===Zl(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return es(t.arrayValue.values||[],e.arrayValue.values||[],hn);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},l=s.mapValue.fields||{};if(xv(o)!==xv(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!hn(o[u],l[u])))return!1;return!0}(t,e);default:return G(52216,{left:t})}}function No(t,e){return(t.values||[]).find(n=>hn(n,e))!==void 0}function is(t,e){if(t===e)return 0;const n=Sr(t),r=Sr(e);if(n!==r)return J(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return J(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Pe(s.integerValue||s.doubleValue),u=Pe(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return zv(t.timestampValue,e.timestampValue);case 4:return zv(xo(t),xo(e));case 5:return qd(t.stringValue,e.stringValue);case 6:return function(s,o){const l=Ir(s),u=Ir(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),u=o.split("/");for(let h=0;h<l.length&&h<u.length;h++){const f=J(l[h],u[h]);if(f!==0)return f}return J(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=J(Pe(s.latitude),Pe(o.latitude));return l!==0?l:J(Pe(s.longitude),Pe(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return jv(t.arrayValue,e.arrayValue);case 10:return function(s,o){var l,u,h,f;const m=s.fields||{},p=o.fields||{},k=(l=m[iu])===null||l===void 0?void 0:l.arrayValue,R=(u=p[iu])===null||u===void 0?void 0:u.arrayValue,x=J(((h=k==null?void 0:k.values)===null||h===void 0?void 0:h.length)||0,((f=R==null?void 0:R.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:jv(k,R)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===ru.mapValue&&o===ru.mapValue)return 0;if(s===ru.mapValue)return 1;if(o===ru.mapValue)return-1;const l=s.fields||{},u=Object.keys(l),h=o.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let m=0;m<u.length&&m<f.length;++m){const p=qd(u[m],f[m]);if(p!==0)return p;const k=is(l[u[m]],h[f[m]]);if(k!==0)return k}return J(u.length,f.length)}(t.mapValue,e.mapValue);default:throw G(23264,{le:n})}}function zv(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return J(t,e);const n=Tr(t),r=Tr(e),i=J(n.seconds,r.seconds);return i!==0?i:J(n.nanos,r.nanos)}function jv(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=is(n[i],r[i]);if(s)return s}return J(n.length,r.length)}function ss(t){return Qd(t)}function Qd(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=Tr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Ir(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return W.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=Qd(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${Qd(n.fields[o])}`;return i+"}"}(t.mapValue):G(61005,{value:t})}function su(t){switch(Sr(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=tu(t);return e?16+su(e):16;case 5:return 2*t.stringValue.length;case 6:return Ir(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+su(s),0)}(t.arrayValue);case 10:case 11:return function(r){let i=0;return Zr(r.fields,(s,o)=>{i+=s.length+su(o)}),i}(t.mapValue);default:throw G(13486,{value:t})}}function Bv(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function Xd(t){return!!t&&"integerValue"in t}function Yd(t){return!!t&&"arrayValue"in t}function $v(t){return!!t&&"nullValue"in t}function Hv(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function ou(t){return!!t&&"mapValue"in t}function GC(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{})[Fv])===null||n===void 0?void 0:n.stringValue)===Uv}function Do(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Zr(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Do(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Do(t.arrayValue.values[n]);return e}return Object.assign({},t)}function KC(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue===qC}/**
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
 */class Mt{constructor(e){this.value=e}static empty(){return new Mt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!ou(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Do(n)}setAll(e){let n=Be.emptyPath(),r={},i=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=l.popLast()}o?r[l.lastSegment()]=Do(o):i.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());ou(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return hn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];ou(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){Zr(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new Mt(Do(this.value))}}function Wv(t){const e=[];return Zr(t.fields,(n,r)=>{const i=new Be([n]);if(ou(r)){const s=Wv(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new Xt(e)}/**
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
 */class rt{constructor(e,n,r,i,s,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new rt(e,0,Q.min(),Q.min(),Q.min(),Mt.empty(),0)}static newFoundDocument(e,n,r,i){return new rt(e,1,n,Q.min(),r,i,0)}static newNoDocument(e,n){return new rt(e,2,n,Q.min(),Q.min(),Mt.empty(),0)}static newUnknownDocument(e,n){return new rt(e,3,n,Q.min(),Q.min(),Mt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Mt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Mt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof rt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new rt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class au{constructor(e,n){this.position=e,this.inclusive=n}}function qv(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(s.field.isKeyField()?r=W.comparator(W.fromName(o.referenceValue),n.key):r=is(o,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Gv(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!hn(t.position[n],e.position[n]))return!1;return!0}/**
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
 */class bo{constructor(e,n="asc"){this.field=e,this.dir=n}}function QC(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
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
 */class Kv{}class be extends Kv{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new YC(e,n,r):n==="array-contains"?new eR(e,r):n==="in"?new tR(e,r):n==="not-in"?new nR(e,r):n==="array-contains-any"?new rR(e,r):new be(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new JC(e,r):new ZC(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(is(n,this.value)):n!==null&&Sr(this.value)===Sr(n)&&this.matchesComparison(is(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return G(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Yt extends Kv{constructor(e,n){super(),this.filters=e,this.op=n,this.he=null}static create(e,n){return new Yt(e,n)}matches(e){return Qv(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Qv(t){return t.op==="and"}function Xv(t){return XC(t)&&Qv(t)}function XC(t){for(const e of t.filters)if(e instanceof Yt)return!1;return!0}function Jd(t){if(t instanceof be)return t.field.canonicalString()+t.op.toString()+ss(t.value);if(Xv(t))return t.filters.map(e=>Jd(e)).join(",");{const e=t.filters.map(n=>Jd(n)).join(",");return`${t.op}(${e})`}}function Yv(t,e){return t instanceof be?function(r,i){return i instanceof be&&r.op===i.op&&r.field.isEqual(i.field)&&hn(r.value,i.value)}(t,e):t instanceof Yt?function(r,i){return i instanceof Yt&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,l)=>s&&Yv(o,i.filters[l]),!0):!1}(t,e):void G(19439)}function Jv(t){return t instanceof be?function(n){return`${n.field.canonicalString()} ${n.op} ${ss(n.value)}`}(t):t instanceof Yt?function(n){return n.op.toString()+" {"+n.getFilters().map(Jv).join(" ,")+"}"}(t):"Filter"}class YC extends be{constructor(e,n,r){super(e,n,r),this.key=W.fromName(r.referenceValue)}matches(e){const n=W.comparator(e.key,this.key);return this.matchesComparison(n)}}class JC extends be{constructor(e,n){super(e,"in",n),this.keys=Zv("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class ZC extends be{constructor(e,n){super(e,"not-in",n),this.keys=Zv("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function Zv(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>W.fromName(r.referenceValue))}class eR extends be{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Yd(n)&&No(n.arrayValue,this.value)}}class tR extends be{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&No(this.value.arrayValue,n)}}class nR extends be{constructor(e,n){super(e,"not-in",n)}matches(e){if(No(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!No(this.value.arrayValue,n)}}class rR extends be{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Yd(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>No(this.value.arrayValue,r))}}/**
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
 */class iR{constructor(e,n=null,r=[],i=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=l,this.Pe=null}}function e0(t,e=null,n=[],r=[],i=null,s=null,o=null){return new iR(t,e,n,r,i,s,o)}function Zd(t){const e=X(t);if(e.Pe===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>Jd(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),Jl(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>ss(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>ss(r)).join(",")),e.Pe=n}return e.Pe}function ef(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!QC(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!Yv(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Gv(t.startAt,e.startAt)&&Gv(t.endAt,e.endAt)}function tf(t){return W.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
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
 */class os{constructor(e,n=null,r=[],i=[],s=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=u,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function sR(t,e,n,r,i,s,o,l){return new os(t,e,n,r,i,s,o,l)}function t0(t){return new os(t)}function n0(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function r0(t){return t.collectionGroup!==null}function Vo(t){const e=X(t);if(e.Te===null){e.Te=[];const n=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Fe(Be.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.Te.push(new bo(s,r))}),n.has(Be.keyField().canonicalString())||e.Te.push(new bo(Be.keyField(),r))}return e.Te}function dn(t){const e=X(t);return e.Ie||(e.Ie=oR(e,Vo(t))),e.Ie}function oR(t,e){if(t.limitType==="F")return e0(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new bo(i.field,s)});const n=t.endAt?new au(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new au(t.startAt.position,t.startAt.inclusive):null;return e0(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function nf(t,e){const n=t.filters.concat([e]);return new os(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function rf(t,e,n){return new os(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function lu(t,e){return ef(dn(t),dn(e))&&t.limitType===e.limitType}function i0(t){return`${Zd(dn(t))}|lt:${t.limitType}`}function as(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>Jv(i)).join(", ")}]`),Jl(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>ss(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>ss(i)).join(",")),`Target(${r})`}(dn(t))}; limitType=${t.limitType})`}function uu(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):W.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of Vo(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(o,l,u){const h=qv(o,l,u);return o.inclusive?h<=0:h<0}(r.startAt,Vo(r),i)||r.endAt&&!function(o,l,u){const h=qv(o,l,u);return o.inclusive?h>=0:h>0}(r.endAt,Vo(r),i))}(t,e)}function aR(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function s0(t){return(e,n)=>{let r=!1;for(const i of Vo(t)){const s=lR(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function lR(t,e,n){const r=t.field.isKeyField()?W.comparator(e.key,n.key):function(s,o,l){const u=o.data.field(s),h=l.data.field(s);return u!==null&&h!==null?is(u,h):G(42886)}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return G(19790,{direction:t.dir})}}/**
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
 */class ei{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Zr(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return Nv(this.inner)}size(){return this.innerSize}}/**
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
 */const uR=new Se(W.comparator);function Dn(){return uR}const o0=new Se(W.comparator);function Oo(...t){let e=o0;for(const n of t)e=e.insert(n.key,n);return e}function a0(t){let e=o0;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function ti(){return Lo()}function l0(){return Lo()}function Lo(){return new ei(t=>t.toString(),(t,e)=>t.isEqual(e))}const cR=new Se(W.comparator),hR=new Fe(W.comparator);function te(...t){let e=hR;for(const n of t)e=e.add(n);return e}const dR=new Fe(J);function fR(){return dR}/**
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
 */function sf(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Zl(e)?"-0":e}}function u0(t){return{integerValue:""+t}}function pR(t,e){return jC(e)?u0(e):sf(t,e)}/**
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
 */class cu{constructor(){this._=void 0}}function mR(t,e,n){return t instanceof Mo?function(i,s){const o={fields:{[Ov]:{stringValue:Vv},[Mv]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Kd(s)&&(s=tu(s)),s&&(o.fields[Lv]=s),{mapValue:o}}(n,e):t instanceof Fo?h0(t,e):t instanceof Uo?d0(t,e):function(i,s){const o=c0(i,s),l=f0(o)+f0(i.Ee);return Xd(o)&&Xd(i.Ee)?u0(l):sf(i.serializer,l)}(t,e)}function gR(t,e,n){return t instanceof Fo?h0(t,e):t instanceof Uo?d0(t,e):n}function c0(t,e){return t instanceof hu?function(r){return Xd(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class Mo extends cu{}class Fo extends cu{constructor(e){super(),this.elements=e}}function h0(t,e){const n=p0(e);for(const r of t.elements)n.some(i=>hn(i,r))||n.push(r);return{arrayValue:{values:n}}}class Uo extends cu{constructor(e){super(),this.elements=e}}function d0(t,e){let n=p0(e);for(const r of t.elements)n=n.filter(i=>!hn(i,r));return{arrayValue:{values:n}}}class hu extends cu{constructor(e,n){super(),this.serializer=e,this.Ee=n}}function f0(t){return Pe(t.integerValue||t.doubleValue)}function p0(t){return Yd(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
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
 */class yR{constructor(e,n){this.field=e,this.transform=n}}function _R(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof Fo&&i instanceof Fo||r instanceof Uo&&i instanceof Uo?es(r.elements,i.elements,hn):r instanceof hu&&i instanceof hu?hn(r.Ee,i.Ee):r instanceof Mo&&i instanceof Mo}(t.transform,e.transform)}class vR{constructor(e,n){this.version=e,this.transformResults=n}}class bn{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new bn}static exists(e){return new bn(void 0,e)}static updateTime(e){return new bn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function du(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class fu{}function m0(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new w0(t.key,bn.none()):new jo(t.key,t.data,bn.none());{const n=t.data,r=Mt.empty();let i=new Fe(Be.comparator);for(let s of e.fields)if(!i.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new ni(t.key,r,new Xt(i.toArray()),bn.none())}}function wR(t,e,n){t instanceof jo?function(i,s,o){const l=i.value.clone(),u=_0(i.fieldTransforms,s,o.transformResults);l.setAll(u),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof ni?function(i,s,o){if(!du(i.precondition,s))return void s.convertToUnknownDocument(o.version);const l=_0(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(y0(i)),u.setAll(l),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function zo(t,e,n,r){return t instanceof jo?function(s,o,l,u){if(!du(s.precondition,o))return l;const h=s.value.clone(),f=v0(s.fieldTransforms,u,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(t,e,n,r):t instanceof ni?function(s,o,l,u){if(!du(s.precondition,o))return l;const h=v0(s.fieldTransforms,u,o),f=o.data;return f.setAll(y0(s)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(t,e,n,r):function(s,o,l){return du(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function ER(t,e){let n=null;for(const r of t.fieldTransforms){const i=e.data.field(r.field),s=c0(r.transform,i||null);s!=null&&(n===null&&(n=Mt.empty()),n.set(r.field,s))}return n||null}function g0(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&es(r,i,(s,o)=>_R(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class jo extends fu{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class ni extends fu{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function y0(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function _0(t,e,n){const r=new Map;se(t.length===n.length,32656,{Ae:n.length,Re:t.length});for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,l=e.data.field(s.field);r.set(s.field,gR(o,l,n[i]))}return r}function v0(t,e,n){const r=new Map;for(const i of t){const s=i.transform,o=n.data.field(i.field);r.set(i.field,mR(s,o,e))}return r}class w0 extends fu{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class TR extends fu{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class IR{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&wR(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=zo(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=zo(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=l0();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=n.has(i.key)?null:l;const u=m0(o,l);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(Q.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),te())}isEqual(e){return this.batchId===e.batchId&&es(this.mutations,e.mutations,(n,r)=>g0(n,r))&&es(this.baseMutations,e.baseMutations,(n,r)=>g0(n,r))}}class of{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){se(e.mutations.length===r.length,58842,{Ve:e.mutations.length,me:r.length});let i=function(){return cR}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new of(e,n,r,i)}}/**
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
 */class SR{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
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
 */class AR{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
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
 */var Ve,ne;function kR(t){switch(t){case O.OK:return G(64938);case O.CANCELLED:case O.UNKNOWN:case O.DEADLINE_EXCEEDED:case O.RESOURCE_EXHAUSTED:case O.INTERNAL:case O.UNAVAILABLE:case O.UNAUTHENTICATED:return!1;case O.INVALID_ARGUMENT:case O.NOT_FOUND:case O.ALREADY_EXISTS:case O.PERMISSION_DENIED:case O.FAILED_PRECONDITION:case O.ABORTED:case O.OUT_OF_RANGE:case O.UNIMPLEMENTED:case O.DATA_LOSS:return!0;default:return G(15467,{code:t})}}function E0(t){if(t===void 0)return xn("GRPC error has no .code"),O.UNKNOWN;switch(t){case Ve.OK:return O.OK;case Ve.CANCELLED:return O.CANCELLED;case Ve.UNKNOWN:return O.UNKNOWN;case Ve.DEADLINE_EXCEEDED:return O.DEADLINE_EXCEEDED;case Ve.RESOURCE_EXHAUSTED:return O.RESOURCE_EXHAUSTED;case Ve.INTERNAL:return O.INTERNAL;case Ve.UNAVAILABLE:return O.UNAVAILABLE;case Ve.UNAUTHENTICATED:return O.UNAUTHENTICATED;case Ve.INVALID_ARGUMENT:return O.INVALID_ARGUMENT;case Ve.NOT_FOUND:return O.NOT_FOUND;case Ve.ALREADY_EXISTS:return O.ALREADY_EXISTS;case Ve.PERMISSION_DENIED:return O.PERMISSION_DENIED;case Ve.FAILED_PRECONDITION:return O.FAILED_PRECONDITION;case Ve.ABORTED:return O.ABORTED;case Ve.OUT_OF_RANGE:return O.OUT_OF_RANGE;case Ve.UNIMPLEMENTED:return O.UNIMPLEMENTED;case Ve.DATA_LOSS:return O.DATA_LOSS;default:return G(39323,{code:t})}}(ne=Ve||(Ve={}))[ne.OK=0]="OK",ne[ne.CANCELLED=1]="CANCELLED",ne[ne.UNKNOWN=2]="UNKNOWN",ne[ne.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ne[ne.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ne[ne.NOT_FOUND=5]="NOT_FOUND",ne[ne.ALREADY_EXISTS=6]="ALREADY_EXISTS",ne[ne.PERMISSION_DENIED=7]="PERMISSION_DENIED",ne[ne.UNAUTHENTICATED=16]="UNAUTHENTICATED",ne[ne.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ne[ne.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ne[ne.ABORTED=10]="ABORTED",ne[ne.OUT_OF_RANGE=11]="OUT_OF_RANGE",ne[ne.UNIMPLEMENTED=12]="UNIMPLEMENTED",ne[ne.INTERNAL=13]="INTERNAL",ne[ne.UNAVAILABLE=14]="UNAVAILABLE",ne[ne.DATA_LOSS=15]="DATA_LOSS";/**
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
 */const CR=new vr([4294967295,4294967295],0);function T0(t){const e=_v().encode(t),n=new ov;return n.update(e),new Uint8Array(n.digest())}function I0(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new vr([n,r],0),new vr([i,s],0)]}class af{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new Bo(`Invalid padding: ${n}`);if(r<0)throw new Bo(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Bo(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new Bo(`Invalid padding when bitmap length is 0: ${n}`);this.fe=8*e.length-n,this.ge=vr.fromNumber(this.fe)}pe(e,n,r){let i=e.add(n.multiply(vr.fromNumber(r)));return i.compare(CR)===1&&(i=new vr([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const n=T0(e),[r,i]=I0(n);for(let s=0;s<this.hashCount;s++){const o=this.pe(r,i,s);if(!this.ye(o))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new af(s,i,n);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.fe===0)return;const n=T0(e),[r,i]=I0(n);for(let s=0;s<this.hashCount;s++){const o=this.pe(r,i,s);this.we(o)}}we(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class Bo extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class pu{constructor(e,n,r,i,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,$o.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new pu(Q.min(),i,new Se(J),Dn(),te())}}class $o{constructor(e,n,r,i,s){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new $o(r,n,te(),te(),te())}}/**
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
 */class mu{constructor(e,n,r,i){this.Se=e,this.removedTargetIds=n,this.key=r,this.be=i}}class S0{constructor(e,n){this.targetId=e,this.De=n}}class A0{constructor(e,n,r=$e.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class k0{constructor(){this.ve=0,this.Ce=C0(),this.Fe=$e.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=te(),n=te(),r=te();return this.Ce.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:G(38017,{changeType:s})}}),new $o(this.Fe,this.Me,e,n,r)}ke(){this.xe=!1,this.Ce=C0()}qe(e,n){this.xe=!0,this.Ce=this.Ce.insert(e,n)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,se(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class RR{constructor(e){this.We=e,this.Ge=new Map,this.ze=Dn(),this.je=gu(),this.Je=gu(),this.He=new Se(J)}Ye(e){for(const n of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(n,e.be):this.Xe(n,e.key,e.be);for(const n of e.removedTargetIds)this.Xe(n,e.key,e.be)}et(e){this.forEachTarget(e,n=>{const r=this.tt(n);switch(e.state){case 0:this.nt(n)&&r.Be(e.resumeToken);break;case 1:r.Ue(),r.Oe||r.ke(),r.Be(e.resumeToken);break;case 2:r.Ue(),r.Oe||this.removeTarget(n);break;case 3:this.nt(n)&&(r.Ke(),r.Be(e.resumeToken));break;case 4:this.nt(n)&&(this.rt(n),r.Be(e.resumeToken));break;default:G(56790,{state:e.state})}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Ge.forEach((r,i)=>{this.nt(i)&&n(i)})}it(e){const n=e.targetId,r=e.De.count,i=this.st(n);if(i){const s=i.target;if(tf(s))if(r===0){const o=new W(s.path);this.Xe(n,o,rt.newNoDocument(o,Q.min()))}else se(r===1,20013,{expectedCount:r});else{const o=this.ot(n);if(o!==r){const l=this._t(e),u=l?this.ut(l,e,o):1;if(u!==0){this.rt(n);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(n,h)}}}}}_t(e){const n=e.De.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=n;let o,l;try{o=Ir(r).toUint8Array()}catch(u){if(u instanceof bv)return Nn("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new af(o,i,s)}catch(u){return Nn(u instanceof Bo?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.fe===0?null:l}ut(e,n,r){return n.De.count===r-this.ht(e,n.targetId)?0:2}ht(e,n){const r=this.We.getRemoteKeysForTarget(n);let i=0;return r.forEach(s=>{const o=this.We.lt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Xe(n,s,null),i++)}),i}Pt(e){const n=new Map;this.Ge.forEach((s,o)=>{const l=this.st(o);if(l){if(s.current&&tf(l.target)){const u=new W(l.target.path);this.Tt(u).has(o)||this.It(o,u)||this.Xe(o,u,rt.newNoDocument(u,e))}s.Ne&&(n.set(o,s.Le()),s.ke())}});let r=te();this.Je.forEach((s,o)=>{let l=!0;o.forEachWhile(u=>{const h=this.st(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(s))}),this.ze.forEach((s,o)=>o.setReadTime(e));const i=new pu(e,n,this.He,this.ze,r);return this.ze=Dn(),this.je=gu(),this.Je=gu(),this.He=new Se(J),i}Ze(e,n){if(!this.nt(e))return;const r=this.It(e,n.key)?2:0;this.tt(e).qe(n.key,r),this.ze=this.ze.insert(n.key,n),this.je=this.je.insert(n.key,this.Tt(n.key).add(e)),this.Je=this.Je.insert(n.key,this.dt(n.key).add(e))}Xe(e,n,r){if(!this.nt(e))return;const i=this.tt(e);this.It(e,n)?i.qe(n,1):i.Qe(n),this.Je=this.Je.insert(n,this.dt(n).delete(e)),this.Je=this.Je.insert(n,this.dt(n).add(e)),r&&(this.ze=this.ze.insert(n,r))}removeTarget(e){this.Ge.delete(e)}ot(e){const n=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let n=this.Ge.get(e);return n||(n=new k0,this.Ge.set(e,n)),n}dt(e){let n=this.Je.get(e);return n||(n=new Fe(J),this.Je=this.Je.insert(e,n)),n}Tt(e){let n=this.je.get(e);return n||(n=new Fe(J),this.je=this.je.insert(e,n)),n}nt(e){const n=this.st(e)!==null;return n||B("WatchChangeAggregator","Detected inactive target",e),n}st(e){const n=this.Ge.get(e);return n&&n.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new k0),this.We.getRemoteKeysForTarget(e).forEach(n=>{this.Xe(e,n,null)})}It(e,n){return this.We.getRemoteKeysForTarget(e).has(n)}}function gu(){return new Se(W.comparator)}function C0(){return new Se(W.comparator)}const PR={asc:"ASCENDING",desc:"DESCENDING"},xR={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},NR={and:"AND",or:"OR"};class DR{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function lf(t,e){return t.useProto3Json||Jl(e)?e:{value:e}}function yu(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function R0(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function bR(t,e){return yu(t,e.toTimestamp())}function fn(t){return se(!!t,49232),Q.fromTimestamp(function(n){const r=Tr(n);return new ge(r.seconds,r.nanos)}(t))}function uf(t,e){return cf(t,e).canonicalString()}function cf(t,e){const n=function(i){return new me(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function P0(t){const e=me.fromString(t);return se(O0(e),10190,{key:e.toString()}),e}function hf(t,e){return uf(t.databaseId,e.path)}function df(t,e){const n=P0(e);if(n.get(1)!==t.databaseId.projectId)throw new j(O.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new j(O.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new W(N0(n))}function x0(t,e){return uf(t.databaseId,e)}function VR(t){const e=P0(t);return e.length===4?me.emptyPath():N0(e)}function ff(t){return new me(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function N0(t){return se(t.length>4&&t.get(4)==="documents",29091,{key:t.toString()}),t.popFirst(5)}function D0(t,e,n){return{name:hf(t,e),fields:n.value.mapValue.fields}}function OR(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:G(39313,{state:h})}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(h,f){return h.useProto3Json?(se(f===void 0||typeof f=="string",58123),$e.fromBase64String(f||"")):(se(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),$e.fromUint8Array(f||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const f=h.code===void 0?O.UNKNOWN:E0(h.code);return new j(f,h.message||"")}(o);n=new A0(r,i,s,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=df(t,r.document.name),s=fn(r.document.updateTime),o=r.document.createTime?fn(r.document.createTime):Q.min(),l=new Mt({mapValue:{fields:r.document.fields}}),u=rt.newFoundDocument(i,s,o,l),h=r.targetIds||[],f=r.removedTargetIds||[];n=new mu(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=df(t,r.document),s=r.readTime?fn(r.readTime):Q.min(),o=rt.newNoDocument(i,s),l=r.removedTargetIds||[];n=new mu([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=df(t,r.document),s=r.removedTargetIds||[];n=new mu([],s,i,null)}else{if(!("filter"in e))return G(11601,{At:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new AR(i,s),l=r.targetId;n=new S0(l,o)}}return n}function LR(t,e){let n;if(e instanceof jo)n={update:D0(t,e.key,e.value)};else if(e instanceof w0)n={delete:hf(t,e.key)};else if(e instanceof ni)n={update:D0(t,e.key,e.data),updateMask:WR(e.fieldMask)};else{if(!(e instanceof TR))return G(16599,{Rt:e.type});n={verify:hf(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const l=o.transform;if(l instanceof Mo)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Fo)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Uo)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof hu)return{fieldPath:o.field.canonicalString(),increment:l.Ee};throw G(20930,{transform:o.transform})}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:bR(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:G(27497)}(t,e.precondition)),n}function MR(t,e){return t&&t.length>0?(se(e!==void 0,14353),t.map(n=>function(i,s){let o=i.updateTime?fn(i.updateTime):fn(s);return o.isEqual(Q.min())&&(o=fn(s)),new vR(o,i.transformResults||[])}(n,e))):[]}function FR(t,e){return{documents:[x0(t,e.path)]}}function UR(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=x0(t,i);const s=function(h){if(h.length!==0)return V0(Yt.create(h,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(h){if(h.length!==0)return h.map(f=>function(p){return{field:ls(p.field),direction:BR(p.dir)}}(f))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=lf(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{Vt:n,parent:i}}function zR(t){let e=VR(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){se(r===1,65062);const f=n.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];n.where&&(s=function(m){const p=b0(m);return p instanceof Yt&&Xv(p)?p.getFilters():[p]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(p=>function(R){return new bo(us(R.field),function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(R.direction))}(p))}(n.orderBy));let l=null;n.limit&&(l=function(m){let p;return p=typeof m=="object"?m.value:m,Jl(p)?null:p}(n.limit));let u=null;n.startAt&&(u=function(m){const p=!!m.before,k=m.values||[];return new au(k,p)}(n.startAt));let h=null;return n.endAt&&(h=function(m){const p=!m.before,k=m.values||[];return new au(k,p)}(n.endAt)),sR(e,i,o,s,l,"F",u,h)}function jR(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return G(28987,{purpose:i})}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function b0(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=us(n.unaryFilter.field);return be.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=us(n.unaryFilter.field);return be.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=us(n.unaryFilter.field);return be.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=us(n.unaryFilter.field);return be.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return G(61313);default:return G(60726)}}(t):t.fieldFilter!==void 0?function(n){return be.create(us(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return G(58110);default:return G(50506)}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return Yt.create(n.compositeFilter.filters.map(r=>b0(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return G(1026)}}(n.compositeFilter.op))}(t):G(30097,{filter:t})}function BR(t){return PR[t]}function $R(t){return xR[t]}function HR(t){return NR[t]}function ls(t){return{fieldPath:t.canonicalString()}}function us(t){return Be.fromServerFormat(t.fieldPath)}function V0(t){return t instanceof be?function(n){if(n.op==="=="){if(Hv(n.value))return{unaryFilter:{field:ls(n.field),op:"IS_NAN"}};if($v(n.value))return{unaryFilter:{field:ls(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Hv(n.value))return{unaryFilter:{field:ls(n.field),op:"IS_NOT_NAN"}};if($v(n.value))return{unaryFilter:{field:ls(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ls(n.field),op:$R(n.op),value:n.value}}}(t):t instanceof Yt?function(n){const r=n.getFilters().map(i=>V0(i));return r.length===1?r[0]:{compositeFilter:{op:HR(n.op),filters:r}}}(t):G(54877,{filter:t})}function WR(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function O0(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
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
 */class Ar{constructor(e,n,r,i,s=Q.min(),o=Q.min(),l=$e.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new Ar(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Ar(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ar(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ar(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class qR{constructor(e){this.gt=e}}function GR(t){const e=zR({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?rf(e,e.limit,"L"):e}/**
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
 */class KR{constructor(){this.Dn=new QR}addToCollectionParentIndex(e,n){return this.Dn.add(n),L.resolve()}getCollectionParents(e,n){return L.resolve(this.Dn.getEntries(n))}addFieldIndex(e,n){return L.resolve()}deleteFieldIndex(e,n){return L.resolve()}deleteAllFieldIndexes(e){return L.resolve()}createTargetIndexes(e,n){return L.resolve()}getDocumentsMatchingTarget(e,n){return L.resolve(null)}getIndexType(e,n){return L.resolve(0)}getFieldIndexes(e,n){return L.resolve([])}getNextCollectionGroupToUpdate(e){return L.resolve(null)}getMinOffset(e,n){return L.resolve(Er.min())}getMinOffsetFromCollectionGroup(e,n){return L.resolve(Er.min())}updateCollectionGroup(e,n,r){return L.resolve()}updateIndexEntries(e,n){return L.resolve()}}class QR{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new Fe(me.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new Fe(me.comparator)).toArray()}}/**
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
 */const L0={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},M0=41943040;class Et{static withCacheSize(e){return new Et(e,Et.DEFAULT_COLLECTION_PERCENTILE,Et.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}}/**
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
 */Et.DEFAULT_COLLECTION_PERCENTILE=10,Et.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Et.DEFAULT=new Et(M0,Et.DEFAULT_COLLECTION_PERCENTILE,Et.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Et.DISABLED=new Et(-1,0,0);/**
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
 */class cs{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new cs(0)}static ur(){return new cs(-1)}}/**
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
 */const F0="LruGarbageCollector",XR=1048576;function U0([t,e],[n,r]){const i=J(t,n);return i===0?J(e,r):i}class YR{constructor(e){this.Tr=e,this.buffer=new Fe(U0),this.Ir=0}dr(){return++this.Ir}Er(e){const n=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();U0(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class JR{constructor(e,n,r){this.garbageCollector=e,this.asyncQueue=n,this.localStore=r,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){B(F0,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){ns(n)?B(F0,"Ignoring IndexedDB error during garbage collection: ",n):await ts(n)}await this.Rr(3e5)})}}class ZR{constructor(e,n){this.Vr=e,this.params=n}calculateTargetCount(e,n){return this.Vr.mr(e).next(r=>Math.floor(n/100*r))}nthSequenceNumber(e,n){if(n===0)return L.resolve(Yl.ue);const r=new YR(n);return this.Vr.forEachTarget(e,i=>r.Er(i.sequenceNumber)).next(()=>this.Vr.gr(e,i=>r.Er(i))).next(()=>r.maxValue)}removeTargets(e,n,r){return this.Vr.removeTargets(e,n,r)}removeOrphanedDocuments(e,n){return this.Vr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?(B("LruGarbageCollector","Garbage collection skipped; disabled"),L.resolve(L0)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(B("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),L0):this.pr(e,n))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,n){let r,i,s,o,l,u,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?(B("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),i=this.params.maximumSequenceNumbersToCollect):i=m,o=Date.now(),this.nthSequenceNumber(e,i))).next(m=>(r=m,l=Date.now(),this.removeTargets(e,r,n))).next(m=>(s=m,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(m=>(h=Date.now(),Zi()<=ee.DEBUG&&B("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${i} in `+(l-o)+`ms
	Removed ${s} targets in `+(u-l)+`ms
	Removed ${m} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),L.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:m})))}}function eP(t,e){return new ZR(t,e)}/**
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
 */class tP{constructor(){this.changes=new ei(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,rt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?L.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 *//**
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
 */class nP{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
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
 */class rP{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&zo(r.mutation,i,Xt.empty(),ge.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,te()).next(()=>r))}getLocalViewOfDocuments(e,n,r=te()){const i=ti();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let o=Oo();return s.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=ti();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,te()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,r,i){let s=Dn();const o=Lo(),l=function(){return Lo()}();return n.forEach((u,h)=>{const f=r.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof ni)?s=s.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),zo(f.mutation,h,f.mutation.getFieldMask(),ge.now())):o.set(h.key,Xt.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((h,f)=>o.set(h,f)),n.forEach((h,f)=>{var m;return l.set(h,new nP(f,(m=o.get(h))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const r=Lo();let i=new Se((o,l)=>o-l),s=te();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const h=n.get(u);if(h===null)return;let f=r.get(u)||Xt.empty();f=l.applyToLocalView(h,f),r.set(u,f);const m=(i.get(l.batchId)||te()).add(u);i=i.insert(l.batchId,m)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,f=u.value,m=l0();f.forEach(p=>{if(!s.has(p)){const k=m0(n.get(p),r.get(p));k!==null&&m.set(p,k),s=s.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,m))}return L.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return function(o){return W.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):r0(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):L.resolve(ti());let l=Po,u=s;return o.next(h=>L.forEach(h,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),s.get(f)?L.resolve():this.remoteDocumentCache.getEntry(e,f).next(p=>{u=u.insert(f,p)}))).next(()=>this.populateOverlays(e,h,s)).next(()=>this.computeViews(e,u,h,te())).next(f=>({batchId:l,changes:a0(f)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new W(n)).next(r=>{let i=Oo();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let o=Oo();return this.indexManager.getCollectionParents(e,s).next(l=>L.forEach(l,u=>{const h=function(m,p){return new os(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,h,r,i).next(f=>{f.forEach((m,p)=>{o=o.insert(m,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(o=>{s.forEach((u,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,rt.newInvalidDocument(f)))});let l=Oo();return o.forEach((u,h)=>{const f=s.get(u);f!==void 0&&zo(f.mutation,h,Xt.empty(),ge.now()),uu(n,h)&&(l=l.insert(u,h))}),l})}}/**
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
 */class iP{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,n){return L.resolve(this.Br.get(n))}saveBundleMetadata(e,n){return this.Br.set(n.id,function(i){return{id:i.id,version:i.version,createTime:fn(i.createTime)}}(n)),L.resolve()}getNamedQuery(e,n){return L.resolve(this.Lr.get(n))}saveNamedQuery(e,n){return this.Lr.set(n.name,function(i){return{name:i.name,query:GR(i.bundledQuery),readTime:fn(i.readTime)}}(n)),L.resolve()}}/**
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
 */class sP{constructor(){this.overlays=new Se(W.comparator),this.kr=new Map}getOverlay(e,n){return L.resolve(this.overlays.get(n))}getOverlays(e,n){const r=ti();return L.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.wt(e,n,s)}),L.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.kr.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.kr.delete(r)),L.resolve()}getOverlaysForCollection(e,n,r){const i=ti(),s=n.length+1,o=new W(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return L.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new Se((h,f)=>h-f);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let f=s.get(h.largestBatchId);f===null&&(f=ti(),s=s.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const l=ti(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,f)=>l.set(h,f)),!(l.size()>=i)););return L.resolve(l)}wt(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.kr.get(i.largestBatchId).delete(r.key);this.kr.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new SR(n,r));let s=this.kr.get(n);s===void 0&&(s=te(),this.kr.set(n,s)),this.kr.set(n,s.add(r.key))}}/**
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
 */class oP{constructor(){this.sessionToken=$e.EMPTY_BYTE_STRING}getSessionToken(e){return L.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,L.resolve()}}/**
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
 */class pf{constructor(){this.qr=new Fe(He.Qr),this.$r=new Fe(He.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,n){const r=new He(e,n);this.qr=this.qr.add(r),this.$r=this.$r.add(r)}Kr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Wr(new He(e,n))}Gr(e,n){e.forEach(r=>this.removeReference(r,n))}zr(e){const n=new W(new me([])),r=new He(n,e),i=new He(n,e+1),s=[];return this.$r.forEachInRange([r,i],o=>{this.Wr(o),s.push(o.key)}),s}jr(){this.qr.forEach(e=>this.Wr(e))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const n=new W(new me([])),r=new He(n,e),i=new He(n,e+1);let s=te();return this.$r.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new He(e,0),r=this.qr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class He{constructor(e,n){this.key=e,this.Hr=n}static Qr(e,n){return W.comparator(e.key,n.key)||J(e.Hr,n.Hr)}static Ur(e,n){return J(e.Hr,n.Hr)||W.comparator(e.key,n.key)}}/**
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
 */class aP{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.er=1,this.Yr=new Fe(He.Qr)}checkEmpty(e){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new IR(s,n,r,i);this.mutationQueue.push(o);for(const l of i)this.Yr=this.Yr.add(new He(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return L.resolve(o)}lookupMutationBatch(e,n){return L.resolve(this.Zr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.Xr(r),s=i<0?0:i;return L.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?Gd:this.er-1)}getAllMutationBatches(e){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new He(n,0),i=new He(n,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([r,i],o=>{const l=this.Zr(o.Hr);s.push(l)}),L.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new Fe(J);return n.forEach(i=>{const s=new He(i,0),o=new He(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,o],l=>{r=r.add(l.Hr)})}),L.resolve(this.ei(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;W.isDocumentKey(s)||(s=s.child(""));const o=new He(new W(s),0);let l=new Fe(J);return this.Yr.forEachWhile(u=>{const h=u.key.path;return!!r.isPrefixOf(h)&&(h.length===i&&(l=l.add(u.Hr)),!0)},o),L.resolve(this.ei(l))}ei(e){const n=[];return e.forEach(r=>{const i=this.Zr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){se(this.ti(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Yr;return L.forEach(n.mutations,i=>{const s=new He(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.Yr=r})}rr(e){}containsKey(e,n){const r=new He(n,0),i=this.Yr.firstAfterOrEqual(r);return L.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,L.resolve()}ti(e,n){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const n=this.Xr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
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
 */class lP{constructor(e){this.ni=e,this.docs=function(){return new Se(W.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,o=this.ni(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return L.resolve(r?r.document.mutableCopy():rt.newInvalidDocument(n))}getEntries(e,n){let r=Dn();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():rt.newInvalidDocument(i))}),L.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=Dn();const o=n.path,l=new W(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||MC(LC(f),r)<=0||(i.has(f.key)||uu(n,f))&&(s=s.insert(f.key,f.mutableCopy()))}return L.resolve(s)}getAllFromCollectionGroup(e,n,r,i){G(9500)}ri(e,n){return L.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new uP(this)}getSize(e){return L.resolve(this.size)}}class uP extends tP{constructor(e){super(),this.Or=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.Or.addEntry(e,i)):this.Or.removeEntry(r)}),L.waitFor(n)}getFromCache(e,n){return this.Or.getEntry(e,n)}getAllFromCache(e,n){return this.Or.getEntries(e,n)}}/**
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
 */class cP{constructor(e){this.persistence=e,this.ii=new ei(n=>Zd(n),ef),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.si=0,this.oi=new pf,this.targetCount=0,this._i=cs.ar()}forEachTarget(e,n){return this.ii.forEach((r,i)=>n(i)),L.resolve()}getLastRemoteSnapshotVersion(e){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return L.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.si&&(this.si=n),L.resolve()}hr(e){this.ii.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this._i=new cs(n),this.highestTargetId=n),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,n){return this.hr(n),this.targetCount+=1,L.resolve()}updateTargetData(e,n){return this.hr(n),L.resolve()}removeTargetData(e,n){return this.ii.delete(n.target),this.oi.zr(n.targetId),this.targetCount-=1,L.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.ii.forEach((o,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.ii.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),L.waitFor(s).next(()=>i)}getTargetCount(e){return L.resolve(this.targetCount)}getTargetData(e,n){const r=this.ii.get(n)||null;return L.resolve(r)}addMatchingKeys(e,n,r){return this.oi.Kr(n,r),L.resolve()}removeMatchingKeys(e,n,r){this.oi.Gr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),L.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.oi.zr(n),L.resolve()}getMatchingKeysForTargetId(e,n){const r=this.oi.Jr(n);return L.resolve(r)}containsKey(e,n){return L.resolve(this.oi.containsKey(n))}}/**
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
 */class z0{constructor(e,n){this.ai={},this.overlays={},this.ui=new Yl(0),this.ci=!1,this.ci=!0,this.li=new oP,this.referenceDelegate=e(this),this.hi=new cP(this),this.indexManager=new KR,this.remoteDocumentCache=function(i){return new lP(i)}(r=>this.referenceDelegate.Pi(r)),this.serializer=new qR(n),this.Ti=new iP(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new sP,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.ai[e.toKey()];return r||(r=new aP(n,this.referenceDelegate),this.ai[e.toKey()]=r),r}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,n,r){B("MemoryPersistence","Starting transaction:",e);const i=new hP(this.ui.next());return this.referenceDelegate.Ii(),r(i).next(s=>this.referenceDelegate.di(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Ei(e,n){return L.or(Object.values(this.ai).map(r=>()=>r.containsKey(e,n)))}}class hP extends UC{constructor(e){super(),this.currentSequenceNumber=e}}class mf{constructor(e){this.persistence=e,this.Ai=new pf,this.Ri=null}static Vi(e){return new mf(e)}get mi(){if(this.Ri)return this.Ri;throw G(60996)}addReference(e,n,r){return this.Ai.addReference(r,n),this.mi.delete(r.toString()),L.resolve()}removeReference(e,n,r){return this.Ai.removeReference(r,n),this.mi.add(r.toString()),L.resolve()}markPotentiallyOrphaned(e,n){return this.mi.add(n.toString()),L.resolve()}removeTarget(e,n){this.Ai.zr(n.targetId).forEach(i=>this.mi.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.mi.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}Ii(){this.Ri=new Set}di(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.mi,r=>{const i=W.fromPath(r);return this.fi(e,i).next(s=>{s||n.removeEntry(i,Q.min())})}).next(()=>(this.Ri=null,n.apply(e)))}updateLimboDocument(e,n){return this.fi(e,n).next(r=>{r?this.mi.delete(n.toString()):this.mi.add(n.toString())})}Pi(e){return 0}fi(e,n){return L.or([()=>L.resolve(this.Ai.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ei(e,n)])}}class _u{constructor(e,n){this.persistence=e,this.gi=new ei(r=>BC(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=eP(this,n)}static Vi(e,n){return new _u(e,n)}Ii(){}di(e){return L.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}mr(e){const n=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>n.next(i=>r+i))}yr(e){let n=0;return this.gr(e,r=>{n++}).next(()=>n)}gr(e,n){return L.forEach(this.gi,(r,i)=>this.Sr(e,r,i).next(s=>s?L.resolve():n(i)))}removeTargets(e,n,r){return this.persistence.getTargetCache().removeTargets(e,n,r)}removeOrphanedDocuments(e,n){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ri(e,o=>this.Sr(e,o,n).next(l=>{l||(r++,s.removeEntry(o,Q.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,n){return this.gi.set(n,e.currentSequenceNumber),L.resolve()}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,n,r){return this.gi.set(r,e.currentSequenceNumber),L.resolve()}removeReference(e,n,r){return this.gi.set(r,e.currentSequenceNumber),L.resolve()}updateLimboDocument(e,n){return this.gi.set(n,e.currentSequenceNumber),L.resolve()}Pi(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=su(e.data.value)),n}Sr(e,n,r){return L.or([()=>this.persistence.Ei(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const i=this.gi.get(n);return L.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class gf{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.Is=r,this.ds=i}static Es(e,n){let r=te(),i=te();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new gf(e,n.fromCache,r,i)}}/**
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
 */class dP{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class fP{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=function(){return uS()?8:zC(tt())>0?6:4}()}initialize(e,n){this.gs=e,this.indexManager=n,this.As=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.ps(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.ys(e,n,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new dP;return this.ws(e,n,o).next(l=>{if(s.result=l,this.Rs)return this.Ss(e,n,o,l.size)})}).next(()=>s.result)}Ss(e,n,r,i){return r.documentReadCount<this.Vs?(Zi()<=ee.DEBUG&&B("QueryEngine","SDK will not create cache indexes for query:",as(n),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),L.resolve()):(Zi()<=ee.DEBUG&&B("QueryEngine","Query:",as(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.fs*i?(Zi()<=ee.DEBUG&&B("QueryEngine","The SDK decides to create cache indexes for query:",as(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,dn(n))):L.resolve())}ps(e,n){if(n0(n))return L.resolve(null);let r=dn(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=rf(n,null,"F"),r=dn(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=te(...s);return this.gs.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const h=this.bs(n,l);return this.Ds(n,h,o,u.readTime)?this.ps(e,rf(n,null,"F")):this.vs(e,h,n,u)}))})))}ys(e,n,r,i){return n0(n)||i.isEqual(Q.min())?L.resolve(null):this.gs.getDocuments(e,r).next(s=>{const o=this.bs(n,s);return this.Ds(n,o,r,i)?L.resolve(null):(Zi()<=ee.DEBUG&&B("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),as(n)),this.vs(e,o,n,OC(i,Po)).next(l=>l))})}bs(e,n){let r=new Fe(s0(e));return n.forEach((i,s)=>{uu(e,s)&&(r=r.add(s))}),r}Ds(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ws(e,n,r){return Zi()<=ee.DEBUG&&B("QueryEngine","Using full collection scan to execute query:",as(n)),this.gs.getDocumentsMatchingQuery(e,n,Er.min(),r)}vs(e,n,r,i){return this.gs.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
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
 */const yf="LocalStore",pP=3e8;class mP{constructor(e,n,r,i){this.persistence=e,this.Cs=n,this.serializer=i,this.Fs=new Se(J),this.Ms=new ei(s=>Zd(s),ef),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(r)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new rP(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.Fs))}}function gP(t,e,n,r){return new mP(t,e,n,r)}async function j0(t,e){const n=X(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.Ns(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],l=[];let u=te();for(const h of i){o.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of s){l.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return n.localDocuments.getDocuments(r,u).next(h=>({Bs:h,removedBatchIds:o,addedBatchIds:l}))})})}function yP(t,e){const n=X(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=n.Os.newChangeBuffer({trackRemovals:!0});return function(l,u,h,f){const m=h.batch,p=m.keys();let k=L.resolve();return p.forEach(R=>{k=k.next(()=>f.getEntry(u,R)).next(x=>{const P=h.docVersions.get(R);se(P!==null,48541),x.version.compareTo(P)<0&&(m.applyToRemoteDocument(x,h),x.isValidDocument()&&(x.setReadTime(h.commitVersion),f.addEntry(x)))})}),k.next(()=>l.mutationQueue.removeMutationBatch(u,m))}(n,r,e,s).next(()=>s.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let u=te();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,i))})}function B0(t){const e=X(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.hi.getLastRemoteSnapshotVersion(n))}function _P(t,e){const n=X(t),r=e.snapshotVersion;let i=n.Fs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.Os.newChangeBuffer({trackRemovals:!0});i=n.Fs;const l=[];e.targetChanges.forEach((f,m)=>{const p=i.get(m);if(!p)return;l.push(n.hi.removeMatchingKeys(s,f.removedDocuments,m).next(()=>n.hi.addMatchingKeys(s,f.addedDocuments,m)));let k=p.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?k=k.withResumeToken($e.EMPTY_BYTE_STRING,Q.min()).withLastLimboFreeSnapshotVersion(Q.min()):f.resumeToken.approximateByteSize()>0&&(k=k.withResumeToken(f.resumeToken,r)),i=i.insert(m,k),function(x,P,w){return x.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=pP?!0:w.addedDocuments.size+w.modifiedDocuments.size+w.removedDocuments.size>0}(p,k,f)&&l.push(n.hi.updateTargetData(s,k))});let u=Dn(),h=te();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(s,f))}),l.push(vP(s,o,e.documentUpdates).next(f=>{u=f.Ls,h=f.ks})),!r.isEqual(Q.min())){const f=n.hi.getLastRemoteSnapshotVersion(s).next(m=>n.hi.setTargetsMetadata(s,s.currentSequenceNumber,r));l.push(f)}return L.waitFor(l).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,u,h)).next(()=>u)}).then(s=>(n.Fs=i,s))}function vP(t,e,n){let r=te(),i=te();return n.forEach(s=>r=r.add(s)),e.getEntries(t,r).next(s=>{let o=Dn();return n.forEach((l,u)=>{const h=s.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),u.isNoDocument()&&u.version.isEqual(Q.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):B(yf,"Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)}),{Ls:o,ks:i}})}function wP(t,e){const n=X(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=Gd),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function EP(t,e){const n=X(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return n.hi.getTargetData(r,e).next(s=>s?(i=s,L.resolve(i)):n.hi.allocateTargetId(r).next(o=>(i=new Ar(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.hi.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=n.Fs.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.Fs=n.Fs.insert(r.targetId,r),n.Ms.set(e,r.targetId)),r})}async function _f(t,e,n){const r=X(t),i=r.Fs.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!ns(o))throw o;B(yf,`Failed to update sequence numbers for target ${e}: ${o}`)}r.Fs=r.Fs.remove(e),r.Ms.delete(i.target)}function $0(t,e,n){const r=X(t);let i=Q.min(),s=te();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,h,f){const m=X(u),p=m.Ms.get(f);return p!==void 0?L.resolve(m.Fs.get(p)):m.hi.getTargetData(h,f)}(r,o,dn(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,r.hi.getMatchingKeysForTargetId(o,l.targetId).next(u=>{s=u})}).next(()=>r.Cs.getDocumentsMatchingQuery(o,e,n?i:Q.min(),n?s:te())).next(l=>(TP(r,aR(e),l),{documents:l,qs:s})))}function TP(t,e,n){let r=t.xs.get(e)||Q.min();n.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),t.xs.set(e,r)}class H0{constructor(){this.activeTargetIds=fR()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class IP{constructor(){this.Fo=new H0,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,n,r){this.Mo[e]=n}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new H0,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class SP{xo(e){}shutdown(){}}/**
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
 */const W0="ConnectivityMonitor";class q0{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){B(W0,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){B(W0,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let vu=null;function vf(){return vu===null?vu=function(){return 268435456+Math.round(2147483648*Math.random())}():vu++,"0x"+vu.toString(16)}/**
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
 */const wf="RestConnection",AP={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class kP{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=n+"://"+e.host,this.Uo=`projects/${r}/databases/${i}`,this.Ko=this.databaseId.database===nu?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Wo(e,n,r,i,s){const o=vf(),l=this.Go(e,n.toUriEncodedString());B(wf,`Sending RPC '${e}' ${o}:`,l,r);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(u,i,s);const{host:h}=new URL(l),f=$i(h);return this.jo(e,l,u,r,f).then(m=>(B(wf,`Received RPC '${e}' ${o}: `,m),m),m=>{throw Nn(wf,`RPC '${e}' ${o} failed with error: `,m,"url: ",l,"request:",r),m})}Jo(e,n,r,i,s,o){return this.Wo(e,n,r,i,s)}zo(e,n,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Ji}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}Go(e,n){const r=AP[e];return`${this.$o}/v1/${n}:${r}`}terminate(){}}/**
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
 */class CP{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
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
 */const it="WebChannelConnection";class RP extends kP{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,n,r,i,s){const o=vf();return new Promise((l,u)=>{const h=new av;h.setWithCredentials(!0),h.listenOnce(lv.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case Kl.NO_ERROR:const m=h.getResponseJson();B(it,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(m)),l(m);break;case Kl.TIMEOUT:B(it,`RPC '${e}' ${o} timed out`),u(new j(O.DEADLINE_EXCEEDED,"Request time out"));break;case Kl.HTTP_ERROR:const p=h.getStatus();if(B(it,`RPC '${e}' ${o} failed with status:`,p,"response text:",h.getResponseText()),p>0){let k=h.getResponseJson();Array.isArray(k)&&(k=k[0]);const R=k==null?void 0:k.error;if(R&&R.status&&R.message){const x=function(w){const _=w.toLowerCase().replace(/_/g,"-");return Object.values(O).indexOf(_)>=0?_:O.UNKNOWN}(R.status);u(new j(x,R.message))}else u(new j(O.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new j(O.UNAVAILABLE,"Connection failed."));break;default:G(9055,{c_:e,streamId:o,l_:h.getLastErrorCode(),h_:h.getLastError()})}}finally{B(it,`RPC '${e}' ${o} completed.`)}});const f=JSON.stringify(i);B(it,`RPC '${e}' ${o} sending request:`,i),h.send(n,"POST",f,r,15)})}P_(e,n,r){const i=vf(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=hv(),l=cv(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.zo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const f=s.join("");B(it,`Creating RPC '${e}' stream ${i}: ${f}`,u);const m=o.createWebChannel(f,u);this.T_(m);let p=!1,k=!1;const R=new CP({Ho:P=>{k?B(it,`Not sending because RPC '${e}' stream ${i} is closed:`,P):(p||(B(it,`Opening RPC '${e}' stream ${i} transport.`),m.open(),p=!0),B(it,`RPC '${e}' stream ${i} sending:`,P),m.send(P))},Yo:()=>m.close()}),x=(P,w,_)=>{P.listen(w,S=>{try{_(S)}catch(D){setTimeout(()=>{throw D},0)}})};return x(m,ko.EventType.OPEN,()=>{k||(B(it,`RPC '${e}' stream ${i} transport opened.`),R.s_())}),x(m,ko.EventType.CLOSE,()=>{k||(k=!0,B(it,`RPC '${e}' stream ${i} transport closed`),R.__(),this.I_(m))}),x(m,ko.EventType.ERROR,P=>{k||(k=!0,Nn(it,`RPC '${e}' stream ${i} transport errored. Name:`,P.name,"Message:",P.message),R.__(new j(O.UNAVAILABLE,"The operation could not be completed")))}),x(m,ko.EventType.MESSAGE,P=>{var w;if(!k){const _=P.data[0];se(!!_,16349);const S=_,D=(S==null?void 0:S.error)||((w=S[0])===null||w===void 0?void 0:w.error);if(D){B(it,`RPC '${e}' stream ${i} received error:`,D);const b=D.status;let M=function(v){const E=Ve[v];if(E!==void 0)return E0(E)}(b),T=D.message;M===void 0&&(M=O.INTERNAL,T="Unknown error status: "+b+" with message "+D.message),k=!0,R.__(new j(M,T)),m.close()}else B(it,`RPC '${e}' stream ${i} received:`,_),R.a_(_)}}),x(l,uv.STAT_EVENT,P=>{P.stat===Hd.PROXY?B(it,`RPC '${e}' stream ${i} detected buffering proxy`):P.stat===Hd.NOPROXY&&B(it,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{R.o_()},0),R}terminate(){this.u_.forEach(e=>e.close()),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter(n=>n===e)}}function Ef(){return typeof document<"u"?document:null}/**
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
 */function wu(t){return new DR(t,!0)}/**
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
 */class G0{constructor(e,n,r=1e3,i=1.5,s=6e4){this.Fi=e,this.timerId=n,this.d_=r,this.E_=i,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const n=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),i=Math.max(0,n-r);i>0&&B("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
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
 */const K0="PersistentStream";class Q0{constructor(e,n,r,i,s,o,l,u){this.Fi=e,this.w_=r,this.S_=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new G0(e,n)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,n){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():n&&n.code===O.RESOURCE_EXHAUSTED?(xn(n.toString()),xn("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):n&&n.code===O.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(n)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),n=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.b_===n&&this.W_(r,i)},r=>{e(()=>{const i=new j(O.UNKNOWN,"Fetching auth token failed: "+r.message);return this.G_(i)})})}W_(e,n){const r=this.K_(this.b_);this.stream=this.z_(e,n),this.stream.Zo(()=>{r(()=>this.listener.Zo())}),this.stream.e_(()=>{r(()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.e_()))}),this.stream.n_(i=>{r(()=>this.G_(i))}),this.stream.onMessage(i=>{r(()=>++this.C_==1?this.j_(i):this.onNext(i))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(e){return B(K0,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return n=>{this.Fi.enqueueAndForget(()=>this.b_===e?n():(B(K0,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class PP extends Q0{constructor(e,n,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}z_(e,n){return this.connection.P_("Listen",e,n)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const n=OR(this.serializer,e),r=function(s){if(!("targetChange"in s))return Q.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?Q.min():o.readTime?fn(o.readTime):Q.min()}(e);return this.listener.J_(n,r)}H_(e){const n={};n.database=ff(this.serializer),n.addTarget=function(s,o){let l;const u=o.target;if(l=tf(u)?{documents:FR(s,u)}:{query:UR(s,u).Vt},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=R0(s,o.resumeToken);const h=lf(s,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(Q.min())>0){l.readTime=yu(s,o.snapshotVersion.toTimestamp());const h=lf(s,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const r=jR(this.serializer,e);r&&(n.labels=r),this.k_(n)}Y_(e){const n={};n.database=ff(this.serializer),n.removeTarget=e,this.k_(n)}}class xP extends Q0{constructor(e,n,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,n){return this.connection.P_("Write",e,n)}j_(e){return se(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,se(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){se(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const n=MR(e.writeResults,e.commitTime),r=fn(e.commitTime);return this.listener.ta(r,n)}na(){const e={};e.database=ff(this.serializer),this.k_(e)}X_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>LR(this.serializer,r))};this.k_(n)}}/**
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
 */class NP{}class DP extends NP{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new j(O.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,n,r,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Wo(e,cf(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new j(O.UNKNOWN,s.toString())})}Jo(e,n,r,i,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Jo(e,cf(n,r),i,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new j(O.UNKNOWN,o.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}class bP{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(xn(n),this._a=!1):B("OnlineStateTracker",n)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
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
 */const ri="RemoteStore";class VP{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo(o=>{r.enqueueAndForget(async()=>{ii(this)&&(B(ri,"Restarting streams for network reachability change."),await async function(u){const h=X(u);h.Ia.add(4),await Ho(h),h.Aa.set("Unknown"),h.Ia.delete(4),await Eu(h)}(this))})}),this.Aa=new bP(r,i)}}async function Eu(t){if(ii(t))for(const e of t.da)await e(!0)}async function Ho(t){for(const e of t.da)await e(!1)}function X0(t,e){const n=X(t);n.Ta.has(e.targetId)||(n.Ta.set(e.targetId,e),Af(n)?Sf(n):hs(n).x_()&&If(n,e))}function Tf(t,e){const n=X(t),r=hs(n);n.Ta.delete(e),r.x_()&&Y0(n,e),n.Ta.size===0&&(r.x_()?r.B_():ii(n)&&n.Aa.set("Unknown"))}function If(t,e){if(t.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Q.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}hs(t).H_(e)}function Y0(t,e){t.Ra.$e(e),hs(t).Y_(e)}function Sf(t){t.Ra=new RR({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>t.Ta.get(e)||null,lt:()=>t.datastore.serializer.databaseId}),hs(t).start(),t.Aa.aa()}function Af(t){return ii(t)&&!hs(t).M_()&&t.Ta.size>0}function ii(t){return X(t).Ia.size===0}function J0(t){t.Ra=void 0}async function OP(t){t.Aa.set("Online")}async function LP(t){t.Ta.forEach((e,n)=>{If(t,e)})}async function MP(t,e){J0(t),Af(t)?(t.Aa.la(e),Sf(t)):t.Aa.set("Unknown")}async function FP(t,e,n){if(t.Aa.set("Online"),e instanceof A0&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const l of s.targetIds)i.Ta.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.Ta.delete(l),i.Ra.removeTarget(l))}(t,e)}catch(r){B(ri,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Tu(t,r)}else if(e instanceof mu?t.Ra.Ye(e):e instanceof S0?t.Ra.it(e):t.Ra.et(e),!n.isEqual(Q.min()))try{const r=await B0(t.localStore);n.compareTo(r)>=0&&await function(s,o){const l=s.Ra.Pt(o);return l.targetChanges.forEach((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=s.Ta.get(h);f&&s.Ta.set(h,f.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,h)=>{const f=s.Ta.get(u);if(!f)return;s.Ta.set(u,f.withResumeToken($e.EMPTY_BYTE_STRING,f.snapshotVersion)),Y0(s,u);const m=new Ar(f.target,u,h,f.sequenceNumber);If(s,m)}),s.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(r){B(ri,"Failed to raise snapshot:",r),await Tu(t,r)}}async function Tu(t,e,n){if(!ns(e))throw e;t.Ia.add(1),await Ho(t),t.Aa.set("Offline"),n||(n=()=>B0(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{B(ri,"Retrying IndexedDB access"),await n(),t.Ia.delete(1),await Eu(t)})}function Z0(t,e){return e().catch(n=>Tu(t,n,e))}async function Iu(t){const e=X(t),n=kr(e);let r=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Gd;for(;UP(e);)try{const i=await wP(e.localStore,r);if(i===null){e.Pa.length===0&&n.B_();break}r=i.batchId,zP(e,i)}catch(i){await Tu(e,i)}ew(e)&&tw(e)}function UP(t){return ii(t)&&t.Pa.length<10}function zP(t,e){t.Pa.push(e);const n=kr(t);n.x_()&&n.Z_&&n.X_(e.mutations)}function ew(t){return ii(t)&&!kr(t).M_()&&t.Pa.length>0}function tw(t){kr(t).start()}async function jP(t){kr(t).na()}async function BP(t){const e=kr(t);for(const n of t.Pa)e.X_(n.mutations)}async function $P(t,e,n){const r=t.Pa.shift(),i=of.from(r,e,n);await Z0(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await Iu(t)}async function HP(t,e){e&&kr(t).Z_&&await async function(r,i){if(function(o){return kR(o)&&o!==O.ABORTED}(i.code)){const s=r.Pa.shift();kr(r).N_(),await Z0(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await Iu(r)}}(t,e),ew(t)&&tw(t)}async function nw(t,e){const n=X(t);n.asyncQueue.verifyOperationInProgress(),B(ri,"RemoteStore received new credentials");const r=ii(n);n.Ia.add(3),await Ho(n),r&&n.Aa.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ia.delete(3),await Eu(n)}async function WP(t,e){const n=X(t);e?(n.Ia.delete(2),await Eu(n)):e||(n.Ia.add(2),await Ho(n),n.Aa.set("Unknown"))}function hs(t){return t.Va||(t.Va=function(n,r,i){const s=X(n);return s.ia(),new PP(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Zo:OP.bind(null,t),e_:LP.bind(null,t),n_:MP.bind(null,t),J_:FP.bind(null,t)}),t.da.push(async e=>{e?(t.Va.N_(),Af(t)?Sf(t):t.Aa.set("Unknown")):(await t.Va.stop(),J0(t))})),t.Va}function kr(t){return t.ma||(t.ma=function(n,r,i){const s=X(n);return s.ia(),new xP(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Zo:()=>Promise.resolve(),e_:jP.bind(null,t),n_:HP.bind(null,t),ea:BP.bind(null,t),ta:$P.bind(null,t)}),t.da.push(async e=>{e?(t.ma.N_(),await Iu(t)):(await t.ma.stop(),t.Pa.length>0&&(B(ri,`Stopping write stream with ${t.Pa.length} pending writes`),t.Pa=[]))})),t.ma}/**
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
 */class kf{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new wr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const o=Date.now()+r,l=new kf(e,n,o,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new j(O.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Cf(t,e){if(xn("AsyncQueue",`${e}: ${t}`),ns(t))return new j(O.UNAVAILABLE,`${e}: ${t}`);throw t}/**
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
 */class ds{static emptySet(e){return new ds(e.comparator)}constructor(e){this.comparator=e?(n,r)=>e(n,r)||W.comparator(n.key,r.key):(n,r)=>W.comparator(n.key,r.key),this.keyedMap=Oo(),this.sortedSet=new Se(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof ds)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new ds;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
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
 */class rw{constructor(){this.fa=new Se(W.comparator)}track(e){const n=e.doc.key,r=this.fa.get(n);r?e.type!==0&&r.type===3?this.fa=this.fa.insert(n,e):e.type===3&&r.type!==1?this.fa=this.fa.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.fa=this.fa.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.fa=this.fa.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.fa=this.fa.remove(n):e.type===1&&r.type===2?this.fa=this.fa.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.fa=this.fa.insert(n,{type:2,doc:e.doc}):G(63341,{At:e,ga:r}):this.fa=this.fa.insert(n,e)}pa(){const e=[];return this.fa.inorderTraversal((n,r)=>{e.push(r)}),e}}class fs{constructor(e,n,r,i,s,o,l,u,h){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,n,r,i,s){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new fs(e,n,ds.emptySet(n),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&lu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
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
 */class qP{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some(e=>e.ba())}}class GP{constructor(){this.queries=iw(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(n,r){const i=X(n),s=i.queries;i.queries=iw(),s.forEach((o,l)=>{for(const u of l.wa)u.onError(r)})})(this,new j(O.ABORTED,"Firestore shutting down"))}}function iw(){return new ei(t=>i0(t),lu)}async function KP(t,e){const n=X(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.Sa()&&e.ba()&&(r=2):(s=new qP,r=e.ba()?0:1);try{switch(r){case 0:s.ya=await n.onListen(i,!0);break;case 1:s.ya=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const l=Cf(o,`Initialization of query '${as(e.query)}' failed`);return void e.onError(l)}n.queries.set(i,s),s.wa.push(e),e.va(n.onlineState),s.ya&&e.Ca(s.ya)&&Rf(n)}async function QP(t,e){const n=X(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const o=s.wa.indexOf(e);o>=0&&(s.wa.splice(o,1),s.wa.length===0?i=e.ba()?0:1:!s.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function XP(t,e){const n=X(t);let r=!1;for(const i of e){const s=i.query,o=n.queries.get(s);if(o){for(const l of o.wa)l.Ca(i)&&(r=!0);o.ya=i}}r&&Rf(n)}function YP(t,e,n){const r=X(t),i=r.queries.get(e);if(i)for(const s of i.wa)s.onError(n);r.queries.delete(e)}function Rf(t){t.Da.forEach(e=>{e.next()})}var Pf,sw;(sw=Pf||(Pf={})).Fa="default",sw.Cache="cache";class JP{constructor(e,n,r){this.query=e,this.Ma=n,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=r||{}}Ca(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new fs(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),n=!0):this.Ba(e,this.onlineState)&&(this.La(e),n=!0),this.Oa=e,n}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let n=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),n=!0),n}Ba(e,n){if(!e.fromCache||!this.ba())return!0;const r=n!=="Offline";return(!this.options.ka||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const n=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}La(e){e=fs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==Pf.Cache}}/**
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
 */class ow{constructor(e){this.key=e}}class aw{constructor(e){this.key=e}}class ZP{constructor(e,n){this.query=e,this.Ha=n,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=te(),this.mutatedKeys=te(),this.Xa=s0(e),this.eu=new ds(this.Xa)}get tu(){return this.Ha}nu(e,n){const r=n?n.ru:new rw,i=n?n.eu:this.eu;let s=n?n.mutatedKeys:this.mutatedKeys,o=i,l=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((f,m)=>{const p=i.get(f),k=uu(this.query,m)?m:null,R=!!p&&this.mutatedKeys.has(p.key),x=!!k&&(k.hasLocalMutations||this.mutatedKeys.has(k.key)&&k.hasCommittedMutations);let P=!1;p&&k?p.data.isEqual(k.data)?R!==x&&(r.track({type:3,doc:k}),P=!0):this.iu(p,k)||(r.track({type:2,doc:k}),P=!0,(u&&this.Xa(k,u)>0||h&&this.Xa(k,h)<0)&&(l=!0)):!p&&k?(r.track({type:0,doc:k}),P=!0):p&&!k&&(r.track({type:1,doc:p}),P=!0,(u||h)&&(l=!0)),P&&(k?(o=o.add(k),s=x?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),r.track({type:1,doc:f})}return{eu:o,ru:r,Ds:l,mutatedKeys:s}}iu(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const o=e.ru.pa();o.sort((f,m)=>function(k,R){const x=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return G(20277,{At:P})}};return x(k)-x(R)}(f.type,m.type)||this.Xa(f.doc,m.doc)),this.su(r),i=i!=null&&i;const l=n&&!i?this.ou():[],u=this.Za.size===0&&this.current&&!i?1:0,h=u!==this.Ya;return this.Ya=u,o.length!==0||h?{snapshot:new fs(this.query,e.eu,s,o,e.mutatedKeys,u===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),_u:l}:{_u:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new rw,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach(n=>this.Ha=this.Ha.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ha=this.Ha.delete(n)),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=te(),this.eu.forEach(r=>{this.au(r.key)&&(this.Za=this.Za.add(r.key))});const n=[];return e.forEach(r=>{this.Za.has(r)||n.push(new aw(r))}),this.Za.forEach(r=>{e.has(r)||n.push(new ow(r))}),n}uu(e){this.Ha=e.qs,this.Za=te();const n=this.nu(e.documents);return this.applyChanges(n,!0)}cu(){return fs.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const xf="SyncEngine";class e2{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class t2{constructor(e){this.key=e,this.lu=!1}}class n2{constructor(e,n,r,i,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.hu={},this.Pu=new ei(l=>i0(l),lu),this.Tu=new Map,this.Iu=new Set,this.du=new Se(W.comparator),this.Eu=new Map,this.Au=new pf,this.Ru={},this.Vu=new Map,this.mu=cs.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function r2(t,e,n=!0){const r=mw(t);let i;const s=r.Pu.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await lw(r,e,n,!0),i}async function i2(t,e){const n=mw(t);await lw(n,e,!0,!1)}async function lw(t,e,n,r){const i=await EP(t.localStore,dn(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let l;return r&&(l=await s2(t,e,s,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&X0(t.remoteStore,i),l}async function s2(t,e,n,r,i){t.gu=(m,p,k)=>async function(x,P,w,_){let S=P.view.nu(w);S.Ds&&(S=await $0(x.localStore,P.query,!1).then(({documents:T})=>P.view.nu(T,S)));const D=_&&_.targetChanges.get(P.targetId),b=_&&_.targetMismatches.get(P.targetId)!=null,M=P.view.applyChanges(S,x.isPrimaryClient,D,b);return pw(x,P.targetId,M._u),M.snapshot}(t,m,p,k);const s=await $0(t.localStore,e,!0),o=new ZP(e,s.qs),l=o.nu(s.documents),u=$o.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",i),h=o.applyChanges(l,t.isPrimaryClient,u);pw(t,n,h._u);const f=new e2(e,n,o);return t.Pu.set(e,f),t.Tu.has(n)?t.Tu.get(n).push(e):t.Tu.set(n,[e]),h.snapshot}async function o2(t,e,n){const r=X(t),i=r.Pu.get(e),s=r.Tu.get(i.targetId);if(s.length>1)return r.Tu.set(i.targetId,s.filter(o=>!lu(o,e))),void r.Pu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await _f(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&Tf(r.remoteStore,i.targetId),Nf(r,i.targetId)}).catch(ts)):(Nf(r,i.targetId),await _f(r.localStore,i.targetId,!0))}async function a2(t,e){const n=X(t),r=n.Pu.get(e),i=n.Tu.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Tf(n.remoteStore,r.targetId))}async function l2(t,e,n){const r=m2(t);try{const i=await function(o,l){const u=X(o),h=ge.now(),f=l.reduce((k,R)=>k.add(R.key),te());let m,p;return u.persistence.runTransaction("Locally write mutations","readwrite",k=>{let R=Dn(),x=te();return u.Os.getEntries(k,f).next(P=>{R=P,R.forEach((w,_)=>{_.isValidDocument()||(x=x.add(w))})}).next(()=>u.localDocuments.getOverlayedDocuments(k,R)).next(P=>{m=P;const w=[];for(const _ of l){const S=ER(_,m.get(_.key).overlayedDocument);S!=null&&w.push(new ni(_.key,S,Wv(S.value.mapValue),bn.exists(!0)))}return u.mutationQueue.addMutationBatch(k,h,w,l)}).next(P=>{p=P;const w=P.applyToLocalDocumentSet(m,x);return u.documentOverlayCache.saveOverlays(k,P.batchId,w)})}).then(()=>({batchId:p.batchId,changes:a0(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,l,u){let h=o.Ru[o.currentUser.toKey()];h||(h=new Se(J)),h=h.insert(l,u),o.Ru[o.currentUser.toKey()]=h}(r,i.batchId,n),await Wo(r,i.changes),await Iu(r.remoteStore)}catch(i){const s=Cf(i,"Failed to persist write");n.reject(s)}}async function uw(t,e){const n=X(t);try{const r=await _P(n.localStore,e);e.targetChanges.forEach((i,s)=>{const o=n.Eu.get(s);o&&(se(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?o.lu=!0:i.modifiedDocuments.size>0?se(o.lu,14607):i.removedDocuments.size>0&&(se(o.lu,42227),o.lu=!1))}),await Wo(n,r,e)}catch(r){await ts(r)}}function cw(t,e,n){const r=X(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Pu.forEach((s,o)=>{const l=o.view.va(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const u=X(o);u.onlineState=l;let h=!1;u.queries.forEach((f,m)=>{for(const p of m.wa)p.va(l)&&(h=!0)}),h&&Rf(u)}(r.eventManager,e),i.length&&r.hu.J_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function u2(t,e,n){const r=X(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Eu.get(e),s=i&&i.key;if(s){let o=new Se(W.comparator);o=o.insert(s,rt.newNoDocument(s,Q.min()));const l=te().add(s),u=new pu(Q.min(),new Map,new Se(J),o,l);await uw(r,u),r.du=r.du.remove(s),r.Eu.delete(e),Df(r)}else await _f(r.localStore,e,!1).then(()=>Nf(r,e,n)).catch(ts)}async function c2(t,e){const n=X(t),r=e.batch.batchId;try{const i=await yP(n.localStore,e);dw(n,r,null),hw(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Wo(n,i)}catch(i){await ts(i)}}async function h2(t,e,n){const r=X(t);try{const i=await function(o,l){const u=X(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return u.mutationQueue.lookupMutationBatch(h,l).next(m=>(se(m!==null,37113),f=m.keys(),u.mutationQueue.removeMutationBatch(h,m))).next(()=>u.mutationQueue.performConsistencyCheck(h)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>u.localDocuments.getDocuments(h,f))})}(r.localStore,e);dw(r,e,n),hw(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Wo(r,i)}catch(i){await ts(i)}}function hw(t,e){(t.Vu.get(e)||[]).forEach(n=>{n.resolve()}),t.Vu.delete(e)}function dw(t,e,n){const r=X(t);let i=r.Ru[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(n?s.reject(n):s.resolve(),i=i.remove(e)),r.Ru[r.currentUser.toKey()]=i}}function Nf(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Tu.get(e))t.Pu.delete(r),n&&t.hu.pu(r,n);t.Tu.delete(e),t.isPrimaryClient&&t.Au.zr(e).forEach(r=>{t.Au.containsKey(r)||fw(t,r)})}function fw(t,e){t.Iu.delete(e.path.canonicalString());const n=t.du.get(e);n!==null&&(Tf(t.remoteStore,n),t.du=t.du.remove(e),t.Eu.delete(n),Df(t))}function pw(t,e,n){for(const r of n)r instanceof ow?(t.Au.addReference(r.key,e),d2(t,r)):r instanceof aw?(B(xf,"Document no longer in limbo: "+r.key),t.Au.removeReference(r.key,e),t.Au.containsKey(r.key)||fw(t,r.key)):G(19791,{yu:r})}function d2(t,e){const n=e.key,r=n.path.canonicalString();t.du.get(n)||t.Iu.has(r)||(B(xf,"New document in limbo: "+n),t.Iu.add(r),Df(t))}function Df(t){for(;t.Iu.size>0&&t.du.size<t.maxConcurrentLimboResolutions;){const e=t.Iu.values().next().value;t.Iu.delete(e);const n=new W(me.fromString(e)),r=t.mu.next();t.Eu.set(r,new t2(n)),t.du=t.du.insert(n,r),X0(t.remoteStore,new Ar(dn(t0(n.path)),r,"TargetPurposeLimboResolution",Yl.ue))}}async function Wo(t,e,n){const r=X(t),i=[],s=[],o=[];r.Pu.isEmpty()||(r.Pu.forEach((l,u)=>{o.push(r.gu(u,e,n).then(h=>{var f;if((h||n)&&r.isPrimaryClient){const m=h?!h.fromCache:(f=n==null?void 0:n.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(h){i.push(h);const m=gf.Es(u.targetId,h);s.push(m)}}))}),await Promise.all(o),r.hu.J_(i),await async function(u,h){const f=X(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(h,p=>L.forEach(p.Is,k=>f.persistence.referenceDelegate.addReference(m,p.targetId,k)).next(()=>L.forEach(p.ds,k=>f.persistence.referenceDelegate.removeReference(m,p.targetId,k)))))}catch(m){if(!ns(m))throw m;B(yf,"Failed to update sequence numbers: "+m)}for(const m of h){const p=m.targetId;if(!m.fromCache){const k=f.Fs.get(p),R=k.snapshotVersion,x=k.withLastLimboFreeSnapshotVersion(R);f.Fs=f.Fs.insert(p,x)}}}(r.localStore,s))}async function f2(t,e){const n=X(t);if(!n.currentUser.isEqual(e)){B(xf,"User change. New user:",e.toKey());const r=await j0(n.localStore,e);n.currentUser=e,function(s,o){s.Vu.forEach(l=>{l.forEach(u=>{u.reject(new j(O.CANCELLED,o))})}),s.Vu.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Wo(n,r.Bs)}}function p2(t,e){const n=X(t),r=n.Eu.get(e);if(r&&r.lu)return te().add(r.key);{let i=te();const s=n.Tu.get(e);if(!s)return i;for(const o of s){const l=n.Pu.get(o);i=i.unionWith(l.view.tu)}return i}}function mw(t){const e=X(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=uw.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=p2.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=u2.bind(null,e),e.hu.J_=XP.bind(null,e.eventManager),e.hu.pu=YP.bind(null,e.eventManager),e}function m2(t){const e=X(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=c2.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=h2.bind(null,e),e}class Su{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=wu(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,n){return null}Fu(e,n){return null}vu(e){return gP(this.persistence,new fP,e.initialUser,this.serializer)}Du(e){return new z0(mf.Vi,this.serializer)}bu(e){return new IP}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Su.provider={build:()=>new Su};class g2 extends Su{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,n){se(this.persistence.referenceDelegate instanceof _u,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new JR(r,e.asyncQueue,n)}Du(e){const n=this.cacheSizeBytes!==void 0?Et.withCacheSize(this.cacheSizeBytes):Et.DEFAULT;return new z0(r=>_u.Vi(r,n),this.serializer)}}class bf{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>cw(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=f2.bind(null,this.syncEngine),await WP(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new GP}()}createDatastore(e){const n=wu(e.databaseInfo.databaseId),r=function(s){return new RP(s)}(e.databaseInfo);return function(s,o,l,u){return new DP(s,o,l,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,o,l){return new VP(r,i,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>cw(this.syncEngine,n,0),function(){return q0.C()?new q0:new SP}())}createSyncEngine(e,n){return function(i,s,o,l,u,h,f){const m=new n2(i,s,o,l,u,h);return f&&(m.fu=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=X(i);B(ri,"RemoteStore shutting down."),s.Ia.add(5),await Ho(s),s.Ea.shutdown(),s.Aa.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}bf.provider={build:()=>new bf};/**
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
 *//**
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
 */class y2{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):xn("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
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
 */const Cr="FirestoreClient";class _2{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=i,this.user=nt.UNAUTHENTICATED,this.clientId=Ql.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{B(Cr,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(B(Cr,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new wr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=Cf(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Vf(t,e){t.asyncQueue.verifyOperationInProgress(),B(Cr,"Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await j0(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>{Nn("Terminating Firestore due to IndexedDb database deletion"),t.terminate().then(()=>{B("Terminating Firestore due to IndexedDb database deletion completed successfully")}).catch(i=>{Nn("Terminating Firestore due to IndexedDb database deletion failed",i)})}),t._offlineComponents=e}async function gw(t,e){t.asyncQueue.verifyOperationInProgress();const n=await v2(t);B(Cr,"Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>nw(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>nw(e.remoteStore,i)),t._onlineComponents=e}async function v2(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){B(Cr,"Using user provided OfflineComponentProvider");try{await Vf(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===O.FAILED_PRECONDITION||i.code===O.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;Nn("Error using user provided cache. Falling back to memory cache: "+n),await Vf(t,new Su)}}else B(Cr,"Using default OfflineComponentProvider"),await Vf(t,new g2(void 0));return t._offlineComponents}async function yw(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(B(Cr,"Using user provided OnlineComponentProvider"),await gw(t,t._uninitializedComponentsProvider._online)):(B(Cr,"Using default OnlineComponentProvider"),await gw(t,new bf))),t._onlineComponents}function w2(t){return yw(t).then(e=>e.syncEngine)}async function E2(t){const e=await yw(t),n=e.eventManager;return n.onListen=r2.bind(null,e.syncEngine),n.onUnlisten=o2.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=i2.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=a2.bind(null,e.syncEngine),n}function T2(t,e,n={}){const r=new wr;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,u,h){const f=new y2({next:p=>{f.Ou(),o.enqueueAndForget(()=>QP(s,m)),p.fromCache&&u.source==="server"?h.reject(new j(O.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(p)},error:p=>h.reject(p)}),m=new JP(l,f,{includeMetadataChanges:!0,ka:!0});return KP(s,m)}(await E2(t),t.asyncQueue,e,n,r)),r.promise}/**
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
 */function _w(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
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
 */const vw=new Map;/**
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
 */const ww="firestore.googleapis.com",Ew=!0;class Tw{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new j(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=ww,this.ssl=Ew}else this.host=e.host,this.ssl=(n=e.ssl)!==null&&n!==void 0?n:Ew;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=M0;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<XR)throw new j(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Tv("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=_w((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Au{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Tw({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new j(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new j(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Tw(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new gv;switch(r.type){case"firstParty":return new xC(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new j(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=vw.get(n);r&&(B("ComponentProvider","Removing Datastore"),vw.delete(n),r.terminate())}(this),Promise.resolve()}}function Iw(t,e,n,r={}){var i;t=Co(t,Au);const s=$i(e),o=t._getSettings(),l=Object.assign(Object.assign({},o),{emulatorOptions:t._getEmulatorOptions()}),u=`${e}:${n}`;s&&(qy(`https://${u}`),Ky("Firestore",!0)),o.host!==ww&&o.host!==u&&Nn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h=Object.assign(Object.assign({},o),{host:u,ssl:s,emulatorOptions:r});if(!Gr(h,l)&&(t._setSettings(h),r.mockUserToken)){let f,m;if(typeof r.mockUserToken=="string")f=r.mockUserToken,m=nt.MOCK_USER;else{f=eS(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const p=r.mockUserToken.sub||r.mockUserToken.user_id;if(!p)throw new j(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new nt(p)}t._authCredentials=new CC(new mv(f,m))}}/**
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
 */class Rr{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Rr(this.firestore,e,this._query)}}class Ue{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Vn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ue(this.firestore,e,this._key)}toJSON(){return{type:Ue._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(Ro(n,Ue._jsonSchema))return new Ue(e,r||null,new W(me.fromString(n.referencePath)))}}Ue._jsonSchemaVersion="firestore/documentReference/1.0",Ue._jsonSchema={type:De("string",Ue._jsonSchemaVersion),referencePath:De("string")};class Vn extends Rr{constructor(e,n,r){super(e,n,t0(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ue(this.firestore,null,new W(e))}withConverter(e){return new Vn(this.firestore,e,this._path)}}function I2(t,e,...n){if(t=Lt(t),Ev("collection","path",e),t instanceof Au){const r=me.fromString(e,...n);return Sv(r),new Vn(t,null,r)}{if(!(t instanceof Ue||t instanceof Vn))throw new j(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(me.fromString(e,...n));return Sv(r),new Vn(t.firestore,null,r)}}function Sw(t,e,...n){if(t=Lt(t),arguments.length===1&&(e=Ql.newId()),Ev("doc","path",e),t instanceof Au){const r=me.fromString(e,...n);return Iv(r),new Ue(t,null,new W(r))}{if(!(t instanceof Ue||t instanceof Vn))throw new j(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(me.fromString(e,...n));return Iv(r),new Ue(t.firestore,t instanceof Vn?t.converter:null,new W(r))}}/**
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
 */const Aw="AsyncQueue";class kw{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new G0(this,"async_queue_retry"),this.oc=()=>{const r=Ef();r&&B(Aw,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const n=Ef();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const n=Ef();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});const n=new wr;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!ns(e))throw e;B(Aw,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){const n=this._c.then(()=>(this.nc=!0,e().catch(r=>{throw this.tc=r,this.nc=!1,xn("INTERNAL UNHANDLED ERROR: ",Cw(r)),r}).then(r=>(this.nc=!1,r))));return this._c=n,n}enqueueAfterDelay(e,n,r){this.ac(),this.sc.indexOf(e)>-1&&(n=0);const i=kf.createAndSchedule(this,e,n,r,s=>this.lc(s));return this.ec.push(i),i}ac(){this.tc&&G(47125,{hc:Cw(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const n of this.ec)if(n.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.ec)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){const n=this.ec.indexOf(e);this.ec.splice(n,1)}}function Cw(t){let e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+`
`+t.stack),e}class ku extends Au{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new kw,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new kw(e),this._firestoreClient=void 0,await e}}}function Rw(t,e){const n=typeof t=="object"?t:i_(),r=typeof t=="string"?t:nu,i=Cd(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=JI("firestore");s&&Iw(i,...s)}return i}function Of(t){if(t._terminated)throw new j(O.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||S2(t),t._firestoreClient}function S2(t){var e,n,r;const i=t._freezeSettings(),s=function(l,u,h,f){return new WC(l,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,_w(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,i);t._componentsProvider||!((n=i.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new _2(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
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
 */class Rt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Rt($e.fromBase64String(e))}catch(n){throw new j(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Rt($e.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Rt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Ro(e,Rt._jsonSchema))return Rt.fromBase64String(e.bytes)}}Rt._jsonSchemaVersion="firestore/bytes/1.0",Rt._jsonSchema={type:De("string",Rt._jsonSchemaVersion),bytes:De("string")};/**
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
 */class Cu{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new j(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Be(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Ru{constructor(e){this._methodName=e}}/**
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
 */class Jt{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new j(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new j(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return J(this._lat,e._lat)||J(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Jt._jsonSchemaVersion}}static fromJSON(e){if(Ro(e,Jt._jsonSchema))return new Jt(e.latitude,e.longitude)}}Jt._jsonSchemaVersion="firestore/geoPoint/1.0",Jt._jsonSchema={type:De("string",Jt._jsonSchemaVersion),latitude:De("number"),longitude:De("number")};/**
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
 */class Zt{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:Zt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ro(e,Zt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(n=>typeof n=="number"))return new Zt(e.vectorValues);throw new j(O.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Zt._jsonSchemaVersion="firestore/vectorValue/1.0",Zt._jsonSchema={type:De("string",Zt._jsonSchemaVersion),vectorValues:De("object")};/**
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
 */const A2=/^__.*__$/;class k2{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new ni(e,this.data,this.fieldMask,n,this.fieldTransforms):new jo(e,this.data,n,this.fieldTransforms)}}function Pw(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw G(40011,{Ec:t})}}class Lf{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Lf(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Rc({path:r,mc:!1});return i.fc(e),i}gc(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Rc({path:r,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Pu(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(Pw(this.Ec)&&A2.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class C2{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||wu(e)}Dc(e,n,r,i=!1){return new Lf({Ec:e,methodName:n,bc:r,path:Be.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function xw(t){const e=t._freezeSettings(),n=wu(t._databaseId);return new C2(t._databaseId,!!e.ignoreUndefinedProperties,n)}function R2(t,e,n,r,i,s={}){const o=t.Dc(s.merge||s.mergeFields?2:0,e,n,i);bw("Data must be an object, but it was:",o,r);const l=Nw(r,o);let u,h;if(s.merge)u=new Xt(o.fieldMask),h=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const m of s.mergeFields){const p=x2(e,m,n);if(!o.contains(p))throw new j(O.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);D2(f,p)||f.push(p)}u=new Xt(f),h=o.fieldTransforms.filter(m=>u.covers(m.field))}else u=null,h=o.fieldTransforms;return new k2(new Mt(l),u,h)}class Mf extends Ru{_toFieldTransform(e){return new yR(e.path,new Mo)}isEqual(e){return e instanceof Mf}}function P2(t,e,n,r=!1){return Ff(n,t.Dc(r?4:3,e))}function Ff(t,e){if(Dw(t=Lt(t)))return bw("Unsupported field value:",e,t),Nw(t,e);if(t instanceof Ru)return function(r,i){if(!Pw(i.Ec))throw i.wc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const l of r){let u=Ff(l,i.yc(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=Lt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return pR(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=ge.fromDate(r);return{timestampValue:yu(i.serializer,s)}}if(r instanceof ge){const s=new ge(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:yu(i.serializer,s)}}if(r instanceof Jt)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Rt)return{bytesValue:R0(i.serializer,r._byteString)};if(r instanceof Ue){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.wc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:uf(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof Zt)return function(o,l){return{mapValue:{fields:{[Fv]:{stringValue:Uv},[iu]:{arrayValue:{values:o.toArray().map(h=>{if(typeof h!="number")throw l.wc("VectorValues must only contain numeric values.");return sf(l.serializer,h)})}}}}}}(r,i);throw i.wc(`Unsupported field value: ${Xl(r)}`)}(t,e)}function Nw(t,e){const n={};return Nv(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Zr(t,(r,i)=>{const s=Ff(i,e.Vc(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function Dw(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof ge||t instanceof Jt||t instanceof Rt||t instanceof Ue||t instanceof Ru||t instanceof Zt)}function bw(t,e,n){if(!Dw(n)||!Av(n)){const r=Xl(n);throw r==="an object"?e.wc(t+" a custom object"):e.wc(t+" "+r)}}function x2(t,e,n){if((e=Lt(e))instanceof Cu)return e._internalPath;if(typeof e=="string")return Vw(t,e);throw Pu("Field path arguments must be of type string or ",t,!1,void 0,n)}const N2=new RegExp("[~\\*/\\[\\]]");function Vw(t,e,n){if(e.search(N2)>=0)throw Pu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Cu(...e.split("."))._internalPath}catch{throw Pu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Pu(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new j(O.INVALID_ARGUMENT,l+t+u)}function D2(t,e){return t.some(n=>n.isEqual(e))}/**
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
 */class Ow{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Ue(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new b2(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Uf("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class b2 extends Ow{data(){return super.data()}}function Uf(t,e){return typeof e=="string"?Vw(t,e):e instanceof Cu?e._internalPath:e._delegate._internalPath}/**
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
 */function V2(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new j(O.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class zf{}class jf extends zf{}function O2(t,e,...n){let r=[];e instanceof zf&&r.push(e),r=r.concat(n),function(s){const o=s.filter(u=>u instanceof Nu).length,l=s.filter(u=>u instanceof xu).length;if(o>1||o>0&&l>0)throw new j(O.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)t=i._apply(t);return t}class xu extends jf{constructor(e,n,r){super(),this._field=e,this._op=n,this._value=r,this.type="where"}static _create(e,n,r){return new xu(e,n,r)}_apply(e){const n=this._parse(e);return Fw(e._query,n),new Rr(e.firestore,e.converter,nf(e._query,n))}_parse(e){const n=xw(e.firestore);return function(s,o,l,u,h,f,m){let p;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new j(O.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Mw(m,f);const R=[];for(const x of m)R.push(Lw(u,s,x));p={arrayValue:{values:R}}}else p=Lw(u,s,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Mw(m,f),p=P2(l,o,m,f==="in"||f==="not-in");return be.create(h,f,p)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}class Nu extends zf{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new Nu(e,n)}_parse(e){const n=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return n.length===1?n[0]:Yt.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(i,s){let o=i;const l=s.getFlattenedFilters();for(const u of l)Fw(o,u),o=nf(o,u)}(e._query,n),new Rr(e.firestore,e.converter,nf(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Du extends jf{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new Du(e,n)}_apply(e){const n=function(i,s,o){if(i.startAt!==null)throw new j(O.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new j(O.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new bo(s,o)}(e._query,this._field,this._direction);return new Rr(e.firestore,e.converter,function(i,s){const o=i.explicitOrderBy.concat([s]);return new os(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,n))}}function L2(t,e="asc"){const n=e,r=Uf("orderBy",t);return Du._create(r,n)}function Lw(t,e,n){if(typeof(n=Lt(n))=="string"){if(n==="")throw new j(O.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!r0(e)&&n.indexOf("/")!==-1)throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(me.fromString(n));if(!W.isDocumentKey(r))throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Bv(t,new W(r))}if(n instanceof Ue)return Bv(t,n._key);throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Xl(n)}.`)}function Mw(t,e){if(!Array.isArray(t)||t.length===0)throw new j(O.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Fw(t,e){const n=function(i,s){for(const o of i)for(const l of o.getFlattenedFilters())if(s.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new j(O.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new j(O.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class Uw{convertValue(e,n="none"){switch(Sr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Pe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Ir(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw G(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return Zr(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var n,r,i;const s=(i=(r=(n=e.fields)===null||n===void 0?void 0:n[iu].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>Pe(o.doubleValue));return new Zt(s)}convertGeoPoint(e){return new Jt(Pe(e.latitude),Pe(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=tu(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(xo(e));default:return null}}convertTimestamp(e){const n=Tr(e);return new ge(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=me.fromString(e);se(O0(r),9688,{name:e});const i=new rs(r.get(1),r.get(3)),s=new W(r.popFirst(5));return i.isEqual(n)||xn(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
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
 */function M2(t,e,n){let r;return r=t?t.toFirestore(e):e,r}class qo{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class si extends Ow{constructor(e,n,r,i,s,o){super(e,n,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Go(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(Uf("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new j(O.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,n={};return n.type=si._jsonSchemaVersion,n.bundle="",n.bundleSource="DocumentSnapshot",n.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),n.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),n)}}si._jsonSchemaVersion="firestore/documentSnapshot/1.0",si._jsonSchema={type:De("string",si._jsonSchemaVersion),bundleSource:De("string","DocumentSnapshot"),bundleName:De("string"),bundle:De("string")};class Go extends si{data(e={}){return super.data(e)}}class oi{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new qo(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new Go(this._firestore,this._userDataWriter,r.key,r,new qo(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new j(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const u=new Go(i._firestore,i._userDataWriter,l.doc.key,l.doc,new qo(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const u=new Go(i._firestore,i._userDataWriter,l.doc.key,l.doc,new qo(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:F2(l.type),doc:u,oldIndex:h,newIndex:f}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new j(O.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=oi._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ql.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const n=[],r=[],i=[];return this.docs.forEach(s=>{s._document!==null&&(n.push(s._document),r.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function F2(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return G(61501,{type:t})}}oi._jsonSchemaVersion="firestore/querySnapshot/1.0",oi._jsonSchema={type:De("string",oi._jsonSchemaVersion),bundleSource:De("string","QuerySnapshot"),bundleName:De("string"),bundle:De("string")};class U2 extends Uw{constructor(e){super(),this.firestore=e}convertBytes(e){return new Rt(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Ue(this.firestore,null,n)}}function z2(t){t=Co(t,Rr);const e=Co(t.firestore,ku),n=Of(e),r=new U2(e);return V2(t._query),T2(n,t._query).then(i=>new oi(e,r,t,i))}function j2(t,e){const n=Co(t.firestore,ku),r=Sw(t),i=M2(t.converter,e);return zw(n,[R2(xw(t.firestore),"addDoc",r._key,i,t.converter!==null,{}).toMutation(r._key,bn.exists(!1))]).then(()=>r)}function zw(t,e){return function(r,i){const s=new wr;return r.asyncQueue.enqueueAndForget(async()=>l2(await w2(r),i,s)),s.promise}(Of(t),e)}function B2(){return new Mf("serverTimestamp")}(function(e,n=!0){(function(i){Ji=i})(Wi),Hi(new Kr("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),l=new ku(new RC(r.getProvider("auth-internal")),new NC(o,r.getProvider("app-check-internal")),function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new j(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new rs(h.options.projectId,f)}(o,i),o);return s=Object.assign({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),fr(dv,fv,e),fr(dv,fv,"esm2017")})();const jw=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Uw,Bytes:Rt,CollectionReference:Vn,DocumentReference:Ue,DocumentSnapshot:si,FieldPath:Cu,FieldValue:Ru,Firestore:ku,FirestoreError:j,GeoPoint:Jt,Query:Rr,QueryCompositeFilterConstraint:Nu,QueryConstraint:jf,QueryDocumentSnapshot:Go,QueryFieldFilterConstraint:xu,QueryOrderByConstraint:Du,QuerySnapshot:oi,SnapshotMetadata:qo,Timestamp:ge,VectorValue:Zt,_AutoId:Ql,_ByteString:$e,_DatabaseId:rs,_DocumentKey:W,_EmptyAuthCredentialsProvider:gv,_FieldPath:Be,_cast:Co,_logWarn:Nn,_validateIsNotUsedTogether:Tv,addDoc:j2,collection:I2,connectFirestoreEmulator:Iw,doc:Sw,ensureFirestoreConfigured:Of,executeWrite:zw,getDocs:z2,getFirestore:Rw,orderBy:L2,query:O2,serverTimestamp:B2},Symbol.toStringTag,{value:"Module"})),$2={apiKey:"AIzaSyDb3FPl9-DA_RiY_m8flV-gePeLFnXYVoA",authDomain:"desainr.firebaseapp.com",projectId:"desainr",storageBucket:"desainr.firebasestorage.app",messagingSenderId:"897610202784",appId:"1:897610202784:web:b6a38c0fdf6b07bfe5d3c5"};let bu;s_().length?bu=s_()[0]:bu=r_($2);const Bw=AC(bu),H2=Rw(bu),$w=Object.freeze(Object.defineProperty({__proto__:null,firebaseAuth:Bw,firebaseDb:H2},Symbol.toStringTag,{value:"Module"}));class W2{constructor(e=50){ua(this,"history",[]);ua(this,"currentIndex",-1);ua(this,"maxHistorySize",50);ua(this,"listeners",new Set);this.maxHistorySize=e}addAction(e){const n=`undo-${Date.now()}-${Math.random()}`,r={...e,id:n,timestamp:Date.now()};return this.history=this.history.slice(0,this.currentIndex+1),this.history.push(r),this.currentIndex++,this.history.length>this.maxHistorySize&&(this.history=this.history.slice(-this.maxHistorySize),this.currentIndex=this.history.length-1),this.notifyListeners(),n}undo(){if(!this.canUndo())return!1;const n=this.history[this.currentIndex].undo();return n&&(this.currentIndex--,this.notifyListeners()),n}redo(){if(!this.canRedo())return!1;const e=this.history[this.currentIndex+1];if(!e.redo)return!1;const n=e.redo();return n&&(this.currentIndex++,this.notifyListeners()),n}canUndo(){return this.currentIndex>=0}canRedo(){var e;return this.currentIndex<this.history.length-1&&((e=this.history[this.currentIndex+1])==null?void 0:e.redo)!==void 0}getHistory(){return[...this.history]}getRecentActions(e=5){return this.history.slice(Math.max(0,this.currentIndex-e+1),this.currentIndex+1).reverse()}clear(){this.history=[],this.currentIndex=-1,this.notifyListeners()}clearOld(e){const n=Date.now()-e,r=this.history.findIndex(i=>i.timestamp>=n);r>0&&(this.history=this.history.slice(r),this.currentIndex=Math.max(-1,this.currentIndex-r),this.notifyListeners())}subscribe(e){return this.listeners.add(e),e(this.getHistory(),this.canUndo(),this.canRedo()),()=>{this.listeners.delete(e)}}notifyListeners(){const e=this.getHistory(),n=this.canUndo(),r=this.canRedo();this.listeners.forEach(i=>{i(e,n,r)})}}let Bf=null;function q2(){return Bf||(Bf=new W2),Bf}function G2(t){if(!t)return!1;const e=t.tagName.toLowerCase();return e==="input"||e==="textarea"}async function Hw(t){var e;try{if((e=navigator.clipboard)!=null&&e.writeText)return await navigator.clipboard.writeText(t),!0}catch{}try{const n=document.createElement("textarea");n.value=t,n.style.position="fixed",n.style.opacity="0",document.body.appendChild(n),n.focus(),n.select();const r=document.execCommand("copy");return document.body.removeChild(n),r}catch{return!1}}function Ww(t){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const n=document.activeElement;if(G2(n))try{const r=n,i=r.selectionStart??0,s=r.selectionEnd??i,o=r.value??"",l=o.slice(i,s);r.value=o.slice(0,i)+t+o.slice(s);const u=i+t.length;r.selectionStart=r.selectionEnd=u,r.dispatchEvent(new Event("input",{bubbles:!0}));const h={description:`Replace "${l.slice(0,20)}${l.length>20?"...":""}" with "${t.slice(0,20)}${t.length>20?"...":""}"`,undo:()=>{try{return r.value=o,r.selectionStart=i,r.selectionEnd=s,r.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}},redo:()=>{try{return r.value=o.slice(0,i)+t+o.slice(s),r.selectionStart=r.selectionEnd=i+t.length,r.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}}};return q2().addAction(h),{undo:h.undo}}catch{}try{const r=e.getRangeAt(0),i=r.cloneContents(),s=r.cloneContents(),o=Array.from(s.childNodes).some(h=>h.nodeType!==Node.TEXT_NODE),l=r.endContainer!==r.startContainer;if(o&&l)return null;r.deleteContents();const u=document.createTextNode(t);return r.insertNode(u),r.setStartAfter(u),r.collapse(!0),e.removeAllRanges(),e.addRange(r),{undo:()=>{try{const h=u.parentNode;if(!h)return!1;const f=i.cloneNode(!0);return h.insertBefore(f,u),h.removeChild(u),!0}catch{return!1}}}}catch{return null}}async function K2(t){const e=Ww(t);return e?{outcome:"replaced",undo:e.undo}:await Hw(t)?{outcome:"copied"}:{outcome:"failed"}}const qw=Object.freeze(Object.defineProperty({__proto__:null,applyReplacementOrCopyWithUndo:K2,copyToClipboard:Hw,replaceSelectionSafelyWithUndo:Ww},Symbol.toStringTag,{value:"Module"})),$f={},Q2=($f==null?void 0:$f.VITE_DEFAULT_TARGET_LANG)||"en",ps=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_TARGET_LANG:Q2},Symbol.toStringTag,{value:"Module"})),ms="desainr.auth.uid",gs="desainr.auth.idToken",ys="desainr.auth.signedInAt";function Gw(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function X2(){var t,e,n;if(Gw())return new Promise(r=>{chrome.storage.local.get([ms,gs,ys],i=>{r({uid:i[ms],idToken:i[gs],signedInAt:i[ys]})})});try{const r=((t=globalThis==null?void 0:globalThis.localStorage)==null?void 0:t.getItem(ms))||void 0,i=((e=globalThis==null?void 0:globalThis.localStorage)==null?void 0:e.getItem(gs))||void 0,s=((n=globalThis==null?void 0:globalThis.localStorage)==null?void 0:n.getItem(ys))||void 0,o=s?Number(s):void 0;return{uid:r,idToken:i,signedInAt:o}}catch{return{}}}async function Y2(t){var n,r,i;const e={[ms]:t.uid,[gs]:t.idToken,[ys]:t.signedInAt??Date.now()};if(Gw()){await chrome.storage.local.set(e);return}try{(n=globalThis==null?void 0:globalThis.localStorage)==null||n.setItem(ms,String(e[ms]??"")),(r=globalThis==null?void 0:globalThis.localStorage)==null||r.setItem(gs,String(e[gs]??"")),(i=globalThis==null?void 0:globalThis.localStorage)==null||i.setItem(ys,String(e[ys]??""))}catch{}}async function J2(){const t=Bw.currentUser;if(t){const n=await t.getIdToken(!0);return await Y2({uid:t.uid,idToken:n}),n}const e=await X2();if(e.idToken)return e.idToken;throw new Error("Not signed in")}const _s={rewrite:{maxTokens:20,refillRate:.5,costPerCall:1},"translate-chunks":{maxTokens:30,refillRate:1,costPerCall:1},"analyze-page":{maxTokens:10,refillRate:.2,costPerCall:1},chat:{maxTokens:30,refillRate:.5,costPerCall:1},actions:{maxTokens:20,refillRate:.5,costPerCall:1},"memo/save":{maxTokens:50,refillRate:1,costPerCall:1},"slash-prompts":{maxTokens:10,refillRate:.5,costPerCall:1},default:{maxTokens:20,refillRate:.5,costPerCall:1}},Kw="rateLimiter_";function Qw(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function Xw(t){var r;const e=`${Kw}${t}`,n=_s[t]||_s.default;if(Qw())return new Promise(i=>{chrome.storage.local.get(e,s=>{const o=s[e];o&&o.tokens!==void 0&&o.lastRefill!==void 0?i(o):i({tokens:n.maxTokens,lastRefill:Date.now()})})});try{const i=(r=globalThis==null?void 0:globalThis.localStorage)==null?void 0:r.getItem(e);if(i){const s=JSON.parse(i);if(s&&s.tokens!==void 0&&s.lastRefill!==void 0)return s}}catch{}return{tokens:n.maxTokens,lastRefill:Date.now()}}async function Yw(t,e){var r;const n=`${Kw}${t}`;if(Qw())return new Promise(i=>{chrome.storage.local.set({[n]:e},i)});try{(r=globalThis==null?void 0:globalThis.localStorage)==null||r.setItem(n,JSON.stringify(e))}catch{}}function Jw(t,e){const n=Date.now(),i=(n-t.lastRefill)/1e3*e.refillRate;return{tokens:Math.min(t.tokens+i,e.maxTokens),lastRefill:n}}async function Z2(t){const e=_s[t]||_s.default;let n=await Xw(t);return n=Jw(n,e),n.tokens<e.costPerCall?(await Yw(t,n),!1):(n.tokens-=e.costPerCall,await Yw(t,n),!0)}async function ex(t){const e=_s[t]||_s.default;let n=await Xw(t);n=Jw(n,e);const r=Math.max(0,e.costPerCall-n.tokens),i=r>0?r/e.refillRate:0;return{remainingTokens:Math.floor(n.tokens),maxTokens:e.maxTokens,timeUntilRefill:Math.ceil(i),canMakeCall:n.tokens>=e.costPerCall}}async function vs(t,e){if(!await Z2(t)){const s=(await ex(t)).timeUntilRefill;return{ok:!1,status:429,error:`Rate limit exceeded. Please wait ${s} second${s!==1?"s":""} before trying again.`}}const r=await J2();return new Promise(i=>{chrome.runtime.sendMessage({type:"API_CALL",path:t,token:r,body:e},s=>{if(!s)return i({ok:!1,status:0,error:"No response from background"});i(s)})})}async function ws(t,e=3,n=100){let r;for(let i=0;i<e;i++){const s=await t();if(s.ok)return s;if(r=s,s.status&&s.status<500&&s.status!==0)break;await new Promise(o=>setTimeout(o,n*Math.pow(2,i)))}return r??{ok:!1,status:0,error:"Unknown error"}}async function tx(t){return ws(()=>vs("rewrite",t))}async function nx(t){return ws(()=>vs("translate-chunks",t))}async function rx(t){return ws(()=>vs("translate-chunks",t))}async function ix(t){return ws(()=>vs("analyze-page",t))}async function sx(t){return ws(()=>vs("actions",t))}async function ox(t){return ws(()=>vs("memo/save",t))}const Ft=Object.freeze(Object.defineProperty({__proto__:null,actions:sx,analyzePage:ix,rewrite:tx,saveMemo:ox,translateChunks:nx,translateChunksBatch:rx},Symbol.toStringTag,{value:"Module"}));function ax(){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const n=t.getRangeAt(0).getBoundingClientRect(),r=t.toString();if(!r.trim())return null;const i=n.left+window.scrollX,s=n.top+window.scrollY;return{text:r,rect:n,pageX:i,pageY:s}}const lx=Object.freeze(Object.defineProperty({__proto__:null,getSelectionInfo:ax},Symbol.toStringTag,{value:"Module"})),ux=new Set(["script","style","noscript","template","textarea","input","select","option","code","pre","kbd","samp","var","svg","canvas","math","video","audio"]);function cx(t){if(!t)return!1;if(t.isContentEditable)return!0;const n=t.getAttribute("contenteditable");return n===""||n==="true"}function hx(t){if(!t)return!1;const e=t.tagName.toLowerCase();return e==="input"||e==="textarea"||e==="select"||e==="option"}function dx(t){return!!(!t||ux.has(t.tagName.toLowerCase())||hx(t)||cx(t))}function fx(t){const e=getComputedStyle(t);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0"||t.hidden)return!0;const n=t.getBoundingClientRect();return n.width===0&&n.height===0}function px(t){let e=t;for(;e;){if(dx(e)||fx(e))return!0;e=e.parentElement}return!1}function mx(t,e=5){const n=[];let r=t,i=0;for(;r&&i<e;){const s=r.tagName.toLowerCase(),o=r.id?`#${r.id}`:"",l=r.className&&typeof r.className=="string"?`.${r.className.trim().split(/\s+/).slice(0,2).join(".")}`:"";n.unshift(`${s}${o}${l}`),r=r.parentElement,i++}return n.join(">")}function Hf(t=document.body){const e=[],n=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,{acceptNode:i=>{if(i.nodeType!==Node.TEXT_NODE)return NodeFilter.FILTER_REJECT;const s=i.data;if(!s||!s.trim())return NodeFilter.FILTER_REJECT;const o=i.parentElement;return!o||o.closest&&o.closest(".desainr-parallel-wrapper")||px(o)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let r=n.nextNode();for(;r;){const i=r,s=i.parentElement;e.push({node:i,text:i.data,index:e.length,parent:s,path:mx(s)}),r=n.nextNode()}return e}function Zw(t){return t.map(e=>e.text)}async function gx(t,e,n){const r=new Array(t.length);let i=0,s=0;return new Promise((o,l)=>{const u=()=>{for(;s<e&&i<t.length;){const h=i++;s++,Promise.resolve(n(t[h],h)).then(f=>{r[h]=f,s--,i>=t.length&&s===0?o(r):u()}).catch(f=>{r[h]=void 0,s--,i>=t.length&&s===0?o(r):u()})}};t.length===0?o(r):u()})}async function yx(t,e=3,n=400){var m;const{translateChunksBatch:r,translateChunks:i}=await ue(async()=>{const{translateChunksBatch:p,translateChunks:k}=await Promise.resolve().then(()=>Ft);return{translateChunksBatch:p,translateChunks:k}},void 0),s=Hf(),o=s.slice(0,n),l=Zw(o);let u=[],h=!1;try{const p=await r({chunks:l,url:location.href,targetLang:t});p.ok&&Array.isArray((m=p.json)==null?void 0:m.results)&&(u=p.json.results??[],h=!0)}catch{}(!h||u.length!==l.length)&&(u=await gx(l,e,async p=>{var R;const k=await i({selection:p,url:location.href,targetLang:t});return k.ok&&((R=k.json)!=null&&R.result)?k.json.result:p}));let f=0;for(let p=0;p<o.length;p++)try{const k=u[p];typeof k=="string"&&k!==o[p].text&&(o[p].node.data=k,f++)}catch{}return{totalNodes:s.length,translated:f,skipped:o.length-f}}const _x=Object.freeze(Object.defineProperty({__proto__:null,collectTextNodes:Hf,snapshotTexts:Zw,translatePageAll:yx},Symbol.toStringTag,{value:"Module"})),Ko="desainr-parallel-wrapper",eE="desainr-parallel-original",tE="desainr-parallel-translated",nE="desainr-parallel-style";let On=!1,Qo=null;function vx(){if(document.getElementById(nE))return;const t=document.createElement("style");t.id=nE,t.textContent=`
    .${Ko} { display: inline; white-space: pre-wrap; }
    .${eE} { opacity: 0.95; }
    .${tE} { opacity: 0.75; color: #555; margin-left: 0.4em; }
  `,document.documentElement.appendChild(t)}async function Wf(t,e){var i;const{translateChunks:n}=await ue(async()=>{const{translateChunks:s}=await Promise.resolve().then(()=>Ft);return{translateChunks:s}},void 0),r=await n({selection:t,url:location.href,targetLang:e});return r.ok&&((i=r.json)!=null&&i.result)?r.json.result:t}function Vu(t,e){const n=t.parentElement;if(!n||n.closest&&n.closest(`.${Ko}`))return;const r=t.data,i=document.createElement("span");i.className=Ko,i.dataset.orig=r;const s=document.createElement("span");s.className=eE,s.textContent=r;const o=document.createElement("span");o.className=tE,o.textContent=e,i.appendChild(s),i.appendChild(document.createTextNode(" ")),i.appendChild(o),n.replaceChild(i,t)}function rE(t){return!!t&&t.classList.contains(Ko)}function wx(){var e;if(!On)return;On=!1,Qo&&(Qo.disconnect(),Qo=null);const t=Array.from(document.querySelectorAll(`.${Ko}`));for(const n of t){const r=((e=n.dataset)==null?void 0:e.orig)??"",i=document.createTextNode(r);n.parentNode&&n.parentNode.replaceChild(i,n)}}function Ex(){return On}async function Tx(t){var l;if(On)return;On=!0,vx();const r=Hf().slice(0,400),{DEFAULT_TARGET_LANG:i}=await ue(async()=>{const{DEFAULT_TARGET_LANG:u}=await Promise.resolve().then(()=>ps);return{DEFAULT_TARGET_LANG:u}},void 0),s=t||i;let o=!1;try{const{translateChunksBatch:u}=await ue(async()=>{const{translateChunksBatch:p}=await Promise.resolve().then(()=>Ft);return{translateChunksBatch:p}},void 0),h=r.map(p=>p.text),f=await u({chunks:h,url:location.href,targetLang:s}),m=(l=f.json)==null?void 0:l.results;if(f.ok&&Array.isArray(m)&&m.length===r.length){for(let p=0;p<r.length;p++)try{Vu(r[p].node,m[p])}catch{}o=!0}}catch{}if(!o){let h=0;async function f(){if(!On)return;const m=h++;if(m>=r.length)return;const p=r[m];try{const k=await Wf(p.text,s);Vu(p.node,k)}catch{}await f()}await Promise.all(new Array(3).fill(0).map(()=>f()))}Qo=new MutationObserver(async u=>{if(On)for(const h of u)if(h.type==="characterData"&&h.target.nodeType===Node.TEXT_NODE){const f=h.target,m=f.parentElement;if(!m||rE(m))continue;const p=f.data;if(p&&p.trim())try{const k=await Wf(p,s);if(!On)return;Vu(f,k)}catch{}}else h.type==="childList"&&h.addedNodes.forEach(async f=>{if(f.nodeType===Node.TEXT_NODE){const m=f,p=m.parentElement;if(!p||rE(p))return;const k=m.data;if(k&&k.trim())try{const R=await Wf(k,s);if(!On)return;Vu(m,R)}catch{}}})}),Qo.observe(document.body,{subtree:!0,childList:!0,characterData:!0})}const Ix=Object.freeze(Object.defineProperty({__proto__:null,disableParallelMode:wx,enableParallelMode:Tx,isParallelModeEnabled:Ex},Symbol.toStringTag,{value:"Module"}))})();
