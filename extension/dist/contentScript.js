var cn=Object.defineProperty;var dn=(Ae,ve,Pe)=>ve in Ae?cn(Ae,ve,{enumerable:!0,configurable:!0,writable:!0,value:Pe}):Ae[ve]=Pe;var ne=(Ae,ve,Pe)=>dn(Ae,typeof ve!="symbol"?ve+"":ve,Pe);(function(){"use strict";const Ae="modulepreload",ve=function(n){return"/"+n},Pe={},D=function(e,i,t){let o=Promise.resolve();function r(d){const w=new Event("vite:preloadError",{cancelable:!0});if(w.payload=d,window.dispatchEvent(w),!w.defaultPrevented)throw d}return o.then(d=>{for(const w of d||[])w.status==="rejected"&&r(w.reason);return e().catch(r)})},mt={background:"#0f0f0f",surface:"#1a1a1a",surfaceHover:"#262626",surfaceActive:"#333333",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#ffffff",textSecondary:"#a1a1aa",textMuted:"#71717a",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#262626",borderLight:"#374151",shadow:"rgba(0, 0, 0, 0.8)",shadowLight:"rgba(0, 0, 0, 0.4)"},ft={background:"#ffffff",surface:"#f8fafc",surfaceHover:"#f1f5f9",surfaceActive:"#e2e8f0",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#1e293b",textSecondary:"#475569",textMuted:"#64748b",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#e2e8f0",borderLight:"#cbd5e1",shadow:"rgba(0, 0, 0, 0.15)",shadowLight:"rgba(0, 0, 0, 0.08)"},vt=()=>typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":"dark",qe=()=>vt()==="dark"?mt:ft,s={colors:qe(),updateTheme(){this.colors=qe()},watchThemeChanges(n){typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.updateTheme(),n()})},featureIcons:{refine:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',translate:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 4h2.764L13 9.236 11.618 12z"></path></svg>',rewrite:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',analyze:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',explain:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>',correct:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',expand:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',chatPersonal:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>',chatPro:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',copy:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>',settings:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',customize:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>'},featureCategories:{"Quick Actions":{title:"Quick Actions",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>',description:"Fast access to common tools"},"Content Tools":{title:"Content Tools",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',description:"Text editing and enhancement"},"AI Chat":{title:"AI Chat",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>',description:"AI-powered conversations"},Advanced:{title:"Advanced",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',description:"Advanced features and settings"}},spacing:{xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},borderRadius:{sm:"6px",md:"8px",lg:"12px",xl:"16px",full:"9999px"},typography:{fontFamily:'"Inter", "Segoe UI", system-ui, sans-serif',fontSize:{xs:"12px",sm:"13px",base:"14px",lg:"16px",xl:"18px"},fontWeight:{normal:"400",medium:"500",semibold:"600",bold:"700"},lineHeight:{tight:"1.25",normal:"1.4",relaxed:"1.6"}},animation:{fast:"150ms ease-out",normal:"250ms ease-out",slow:"350ms ease-out"},shadows:{sm:"0 2px 4px rgba(0, 0, 0, 0.4)",md:"0 4px 12px rgba(0, 0, 0, 0.6)",lg:"0 8px 24px rgba(0, 0, 0, 0.8)",glow:"0 0 20px rgba(139, 92, 246, 0.3)"},zIndex:{tooltip:1e3,dropdown:1100,overlay:1200,modal:1300,toast:1400,max:2147483647}},oe={summarize:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
  </svg>`,translate:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21L15.75 9.75L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"/>
  </svg>`,explain:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
  </svg>`,grammar:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
  </svg>`,rewrite:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
  </svg>`,expand:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
  </svg>`,info:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="9"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6M12 7.5h.01"/>
  </svg>`,simplify:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/>
  </svg>`,emoji:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="9"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 10h.01M15 10h.01"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.5 14.5c1.75 1.2 3.25 1.2 5 0"/>
  </svg>`,plusCircle:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="9"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8M8 12h8"/>
  </svg>`,analyze:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
  </svg>`,chat:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.740.194V21l4.155-4.155"/>
  </svg>`,custom:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"/>
  </svg>`,refine:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>
  </svg>`,memo:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
  </svg>`},Be=[{id:"refine",label:"Refine",icon:oe.refine,shortcut:"R",isPinned:!0},{id:"translate",label:"Translate",icon:oe.translate,shortcut:"T",isPinned:!0},{id:"rephrase",label:"Rephrase",icon:oe.rewrite,isPinned:!1},{id:"summarize",label:"Summarize",icon:oe.summarize,isPinned:!1},{id:"add-details",label:"Add Details",icon:oe.plusCircle,isPinned:!1},{id:"more-informative",label:"More Informative",icon:oe.info,isPinned:!1},{id:"simplify",label:"Simplify",icon:oe.simplify,isPinned:!1},{id:"emojify",label:"Emojify",icon:oe.emoji,isPinned:!1},{id:"analyze",label:"Analyze",icon:oe.analyze,shortcut:"A",isPinned:!1},{id:"explain",label:"Explain",icon:oe.explain,shortcut:"E",isPinned:!1},{id:"correct",label:"Correct Grammar",icon:oe.grammar,shortcut:"C",isPinned:!1},{id:"expand",label:"Expand Text",icon:oe.expand,shortcut:"X",isPinned:!1},{id:"designer-chat",label:"Designer",icon:oe.chat,shortcut:"D",isPinned:!1},{id:"customize",label:"Customize Actions",icon:oe.custom,shortcut:"M",isPinned:!1}];class Ye{constructor(){ne(this,"container",null);ne(this,"shadowRoot",null);ne(this,"actions",Be);ne(this,"onActionClick",null);ne(this,"maxPinned",9);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions(),s.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
      position: fixed;
      z-index: ${s.zIndex.max};
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
    `,e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      :host {
        --monica-bg: ${s.colors.background};
        --monica-surface: ${s.colors.surface};
        --monica-surface-hover: ${s.colors.surfaceHover};
        --monica-surface-active: ${s.colors.surfaceActive};
        --monica-primary: ${s.colors.primary};
        --monica-primary-hover: ${s.colors.primaryHover};
        --monica-primary-active: ${s.colors.primaryActive};
        --monica-text-primary: ${s.colors.textPrimary};
        --monica-text-secondary: ${s.colors.textSecondary};
        --monica-text-muted: ${s.colors.textMuted};
        --monica-border: ${s.colors.border};
        --monica-shadow: ${s.colors.shadow};
        --monica-transition: ${s.animation.fast};
        --monica-radius: ${s.borderRadius.md};
      }
      
      .monica-menu {
        position: fixed;
        background: var(--monica-surface);
        color: var(--monica-text-primary);
        font-size: 0.95em;
        border: 1px solid var(--monica-border);
        border-radius: ${s.borderRadius.lg};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        min-width: 260px;
        max-width: 380px;
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden; /* remove bottom scrollbar */
        scrollbar-width: thin; /* Firefox minimal scrollbar */
        scrollbar-color: var(--monica-border) transparent;
        padding: ${s.spacing.sm} 0;
        opacity: 0;
        transform: scale(0.98) translateY(-4px);
        transition: all ${s.animation.fast};
        pointer-events: auto;
        z-index: ${s.zIndex.max};
      }

      /* WebKit minimal scrollbar styling */
      .monica-menu::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .monica-menu::-webkit-scrollbar-track {
        background: transparent;
      }
      .monica-menu::-webkit-scrollbar-thumb {
        background: var(--monica-border);
        border-radius: 8px;
      }
      .monica-menu::-webkit-scrollbar-thumb:hover {
        background: var(--monica-text-muted);
      }

      .monica-menu.show {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      .menu-category {
        margin-bottom: ${s.spacing.xs};
      }
      
      .category-header {
        display: flex;
        align-items: center;
        gap: ${s.spacing.xs};
        padding: ${s.spacing.xs} ${s.spacing.sm};
        font-size: ${s.typography.fontSize.xs};
        font-weight: ${s.typography.fontWeight.semibold};
        color: var(--monica-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: ${s.spacing.xs};
      }
      
      .menu-item {
        display: flex;
        align-items: center;
        gap: ${s.spacing.sm};
        padding: ${s.spacing.sm} ${s.spacing.md};
        border-radius: ${s.borderRadius.md};
        cursor: pointer;
        transition: all ${s.animation.fast};
        position: relative;
        overflow: hidden;
      }
      
      .menu-item:hover {
        background: var(--monica-surface-hover);
        transform: translateX(2px);
      }
      
      .menu-item:active {
        background: var(--monica-surface-active);
        transform: translateX(1px);
      }
      
      .menu-item.featured {
        background: linear-gradient(135deg, var(--monica-primary), var(--monica-primary-hover));
        color: white;
      }
      
      .menu-item.featured:hover {
        background: linear-gradient(135deg, var(--monica-primary-hover), var(--monica-primary-active));
        box-shadow: var(--monica-shadow-glow);
      }
      
      .item-icon {
        width: 15px;
        height: 15px;
        color: var(--monica-primary);
        flex-shrink: 0;
        transition: color ${s.animation.fast};
      }

      .item-icon svg {
        width: 15px;
        height: 15px;
        stroke: currentColor;
        fill: none;
        stroke-width: 1.75;
        vector-effect: non-scaling-stroke;
        display: block;
      }
      
      .menu-item.featured .item-icon {
        color: white;
      }
      
      .item-label {
        flex: 1;
        font-weight: ${s.typography.fontWeight.medium};
        line-height: ${s.typography.lineHeight.tight};
        min-width: 0; /* allow flex item to shrink to avoid horizontal overflow */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .item-shortcut {
        font-size: ${s.typography.fontSize.xs};
        color: var(--monica-text-muted);
        font-weight: ${s.typography.fontWeight.normal};
        background: var(--monica-surface-hover);
        padding: 1px 5px;
        border-radius: ${s.borderRadius.sm};
      }

      .menu-item.featured .item-shortcut {
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
      }

      .item-pin {
        margin-left: ${s.spacing.sm};
        color: var(--monica-text-muted);
        background: transparent;
        border: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${s.borderRadius.sm};
        cursor: pointer;
        flex-shrink: 0;
      }

      .item-pin:hover {
        color: var(--monica-primary);
        background: var(--monica-surface-hover);
      }

      .menu-item.featured .item-pin {
        color: rgba(255, 255, 255, 0.85);
        background: transparent;
      }

      .item-pin svg {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 1.75;
        display: block;
      }

      /* Filled state for pinned bookmark */
      .item-pin svg.filled path {
        fill: currentColor;
        stroke: none;
      }

      .pin-indicator {
        width: 4px;
        height: 4px;
        background: var(--monica-primary);
        border-radius: 50%;
        position: absolute;
        top: 6px;
        right: 6px;
        opacity: 0;
        transition: opacity ${s.animation.fast};
      }
      
      .menu-item.pinned .pin-indicator {
        opacity: 1;
      }
      
      .menu-item.pinned .pin-indicator {
        opacity: 1;
      }
      
      .menu-divider {
        height: 1px;
        background: var(--monica-border);
        margin: ${s.spacing.sm} 0;
      }
      
      .menu-footer {
        padding: ${s.spacing.sm} ${s.spacing.lg};
        text-align: center;
        font-size: ${s.typography.fontSize.xs};
        color: var(--monica-text-muted);
        border-top: 1px solid var(--monica-border);
        margin-top: ${s.spacing.sm};
      }
      
      .powered-by {
        opacity: 0.7;
        transition: opacity ${s.animation.fast};
      }
      
      .powered-by:hover {
        opacity: 1;
      }
      
      /* Enhanced animations */
      .menu-item {
        position: relative;
        overflow: hidden;
      }
      
      .menu-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
        transition: left ${s.animation.normal};
      }
      
      .menu-item:hover::before {
        left: 100%;
      }
      
      /* Responsive design */
      @media (max-width: 480px) {
        .monica-menu {
          min-width: 200px;
          max-width: 280px;
        }
        
        .menu-item {
          padding: ${s.spacing.sm} ${s.spacing.md};
        }
      }
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const i=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||[];this.actions=this.actions.map(t=>({...t,isPinned:i.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}async savePinnedActions(){var e,i;try{const t=this.actions.filter(o=>o.isPinned).map(o=>o.id).slice(0,this.maxPinned);await chrome.storage.sync.set({"desainr.pinnedActions":t});try{(i=(e=chrome==null?void 0:chrome.runtime)==null?void 0:e.sendMessage)==null||i.call(e,{type:"SAVE_PINNED_ACTIONS",pinnedIds:t})}catch(o){console.warn("Broadcast SAVE_PINNED_ACTIONS failed:",o)}}catch(t){console.warn("Failed to save pinned actions:",t)}}togglePin(e){const i=this.actions.findIndex(o=>o.id===e);if(i===-1)return;const t=this.actions[i];if(t.isPinned)t.isPinned=!1;else{if(this.actions.filter(r=>r.isPinned).length>=this.maxPinned)return;t.isPinned=!0}this.savePinnedActions(),this.refreshMenuUI()}refreshMenuUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-menu");if(!e)return;const i=e.style.left,t=e.style.top;e.remove();const o=this.renderMenu();this.shadowRoot.appendChild(o),o.classList.add("show"),i&&(o.style.left=i),t&&(o.style.top=t)}renderMenu(){const e=document.createElement("div");e.className="monica-menu",this.actions.filter(o=>o.isPinned||!this.actions.some(r=>r.isPinned&&r.id===o.id)).forEach(o=>{const r=document.createElement("div");r.className=`menu-item ${o.isPinned?"pinned":""}`;const d=oe.memo;r.innerHTML=`
        <div class="item-icon">${o.icon}</div>
        <div class="item-label">${o.label}</div>
        ${o.shortcut?`<div class="item-shortcut">${o.shortcut}</div>`:""}
        <button class="item-pin" title="${o.isPinned?"Unpin":"Pin"}" aria-label="${o.isPinned?"Unpin":"Pin"}">
          ${d}
        </button>
        <div class="pin-indicator"></div>
      `,r.addEventListener("click",()=>{var x;this.hide(),(x=this.onActionClick)==null||x.call(this,o)});const w=r.querySelector(".item-pin");if(w){w.setAttribute("aria-pressed",o.isPinned?"true":"false");const x=w.querySelector("svg");x&&(o.isPinned?x.classList.add("filled"):x.classList.remove("filled")),w.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation(),this.togglePin(o.id)})}e.appendChild(r)});const t=document.createElement("div");return t.className="menu-footer",t.innerHTML=`
      <div class="powered-by">Powered by DesAInR ✨</div>
    `,e.appendChild(t),e}show(e,i,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t;const o=this.shadowRoot.querySelector(".monica-menu");o&&o.remove();const r=this.renderMenu();if(this.shadowRoot.appendChild(r),!document.body)return;document.body.appendChild(this.container);const d={width:window.innerWidth,height:window.innerHeight},w=r.getBoundingClientRect();let x=e,k=i;e+w.width>d.width-20&&(x=Math.max(20,e-w.width)),i+w.height>d.height-20&&(k=Math.max(20,i-w.height)),r.style.left=`${x}px`,r.style.top=`${k}px`,requestAnimationFrame(()=>{r.classList.add("show")});const I=O=>{const E=O.target,v=E&&E||null;(!v||!r.contains(v))&&(this.hide(),document.removeEventListener("click",I))};setTimeout(()=>{document.addEventListener("click",I)},100)}hide(){var i;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(".monica-menu");e&&(e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}updateActions(e){this.actions=e}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}const wt=Object.freeze(Object.defineProperty({__proto__:null,DefaultActions:Be,MonicaStyleContextMenu:Ye},Symbol.toStringTag,{value:"Module"})),Xe=["refine","translate","rephrase","summarize"],Je=Be.map(n=>({id:n.id,label:n.label.replace(" Selection",""),icon:n.icon,shortcut:n.shortcut,isPinned:n.isPinned,category:n.category}));class yt{constructor(){ne(this,"container",null);ne(this,"shadowRoot",null);ne(this,"actions",Je);ne(this,"onActionClick",null);ne(this,"isVisible",!1);ne(this,"pinnedIds",Xe);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions();try{chrome.runtime.onMessage.addListener(e=>{(e==null?void 0:e.type)==="SAVE_PINNED_ACTIONS"&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}try{chrome.storage.onChanged.addListener((e,i)=>{i==="sync"&&e["desainr.pinnedActions"]&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}s.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
      position: fixed;
      z-index: ${s.zIndex.overlay};
      pointer-events: none;
      top: 0;
      left: 0;
    `,e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      :host {
        --monica-bg: ${s.colors.background};
        --monica-surface: ${s.colors.surface};
        --monica-surface-hover: ${s.colors.surfaceHover};
        --monica-primary: ${s.colors.primary};
        --monica-primary-hover: ${s.colors.primaryHover};
        --monica-text-primary: ${s.colors.textPrimary};
        --monica-text-secondary: ${s.colors.textSecondary};
        --monica-border: ${s.colors.border};
        --monica-shadow: ${s.shadows.lg};
        --monica-radius: ${s.borderRadius.lg};
        --monica-font: ${s.typography.fontFamily};
        --monica-transition: ${s.animation.fast};
      }
      
      .monica-toolbar {
        position: fixed;
        display: flex;
        align-items: center;
        gap: 4px;
        background: var(--monica-surface);
        border: 1px solid var(--monica-border);
        border-radius: 20px;
        padding: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-family: ${s.typography.fontFamily};
        font-size: 11px;
        opacity: 0;
        transform: scale(0.95) translateY(-4px);
        transition: all ${s.animation.fast};
        z-index: ${s.zIndex.overlay};
        pointer-events: auto;
        width: auto;
        height: 32px;
        user-select: none;
      }
      
      .monica-toolbar.show {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      .toolbar-action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all ${s.animation.fast};
        position: relative;
        color: var(--monica-text-secondary);
        padding: 0;
      }
      
      .toolbar-action:hover {
        background: var(--monica-surface-hover);
        color: var(--monica-text-primary);
      }
      
      .toolbar-action:active {
        background: var(--monica-surface-active);
      }
      
      .toolbar-action.featured {
        background: var(--monica-primary);
        color: white;
        box-shadow: 0 1px 4px rgba(139, 92, 246, 0.3);
      }
      
      .toolbar-action.featured:hover {
        background: var(--monica-primary-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      }
      
      .action-icon {
        width: 16px;
        height: 16px;
        color: var(--monica-text-secondary);
        transition: color var(--monica-transition);
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      .action-icon svg {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 1.75;
        vector-effect: non-scaling-stroke;
        display: block;
      }
      
      .action-label {
        display: none; /* Hide labels for minimal design */
      }
      
      .toolbar-action.featured .action-icon {
        color: white;
      }
      
      .toolbar-action:hover .action-icon {
        color: var(--monica-primary);
      }
      
      .toolbar-action.featured:hover .action-icon {
        color: white;
      }
      
      .action-shortcut {
        position: absolute;
        bottom: -2px;
        right: -2px;
        background: var(--monica-primary);
        color: white;
        font-size: 8px;
        font-weight: ${s.typography.fontWeight.bold};
        padding: 1px 3px;
        border-radius: 2px;
        line-height: 1;
        opacity: 0;
        transition: opacity var(--monica-transition);
      }
      
      .toolbar-action:hover .action-shortcut {
        opacity: 1;
      }
      
      .toolbar-action.featured .action-shortcut {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .toolbar-divider {
        width: 1px;
        height: 16px;
        background: var(--monica-border);
        margin: 0 2px;
        opacity: 0.5;
      }
      
      .more-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all ${s.animation.fast};
        color: var(--monica-text-secondary);
        position: relative;
        padding: 0;
      }
      
      .more-button:hover {
        background: var(--monica-surface-hover);
        color: var(--monica-text-primary);
      }

      /* Ensure the three-dots glyph centers perfectly like SVG icons */
      .more-button .action-icon {
        line-height: 1;
      }
      
      .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--monica-bg);
        color: var(--monica-text-primary);
        padding: ${s.spacing.xs} ${s.spacing.sm};
        border-radius: ${s.borderRadius.sm};
        font-size: ${s.typography.fontSize.xs};
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--monica-transition);
        margin-bottom: ${s.spacing.xs};
        border: 1px solid var(--monica-border);
        z-index: 1000;
      }
      
      .toolbar-action:hover .tooltip {
        opacity: 1;
      }
      
      /* Remove extra animations and glowing effects for cleaner UI */
      
      /* Mobile responsive */
      @media (max-width: 480px) {
        .monica-toolbar {
          min-width: 160px;
        }
        
        .toolbar-action {
          width: 32px;
          height: 32px;
        }
        
        .action-icon {
          width: 14px;
          height: 14px;
        }
      }
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const i=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||Xe;this.pinnedIds=i.slice(0,9),this.actions=Je.map(t=>({...t,isPinned:i.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}refreshToolbarUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-toolbar");if(!e)return;const{left:i,top:t}=e.style;e.remove();const o=this.renderToolbar();this.shadowRoot.appendChild(o),o.classList.add("show"),i&&(o.style.left=i),t&&(o.style.top=t)}renderToolbar(){const e=document.createElement("div");e.className="monica-toolbar";const i=this.pinnedIds.map(o=>this.actions.find(r=>r.id===o&&r.isPinned)).filter(o=>!!o).slice(0,10);if(i.forEach((o,r)=>{const d=document.createElement("div");d.className=`toolbar-action ${r===0?"featured":""}`,d.innerHTML=`
        <div class="action-icon">${o.icon}</div>
        <div class="action-label">${o.label}</div>
        <div class="tooltip">${o.label}</div>
      `,d.addEventListener("click",w=>{var x;w.preventDefault(),w.stopPropagation(),(x=this.onActionClick)==null||x.call(this,o)}),e.appendChild(d)}),i.length>0){const o=document.createElement("div");o.className="toolbar-divider",e.appendChild(o)}const t=document.createElement("div");return t.className="more-button",t.innerHTML=`
      <div class="action-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </div>
      <div class="action-label">More</div>
      <div class="tooltip">More actions</div>
    `,t.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const r=t.getBoundingClientRect();this.showContextMenu(r.left,r.bottom)}),e.appendChild(t),e}showContextMenu(e,i){D(async()=>{const{MonicaStyleContextMenu:t}=await Promise.resolve().then(()=>wt);return{MonicaStyleContextMenu:t}},void 0).then(({MonicaStyleContextMenu:t})=>{new t().show(e,i,r=>{var d;(d=this.onActionClick)==null||d.call(this,r)})}).catch(()=>{console.log("More actions menu clicked"),alert("More actions menu - Context menu integration pending")})}show(e,i,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t,this.isVisible=!0;const o=this.shadowRoot.querySelector(".monica-toolbar");o&&o.remove();const r=this.renderToolbar();if(this.shadowRoot.appendChild(r),!document.body)return;document.body.appendChild(this.container);const d={width:window.innerWidth},w=r.getBoundingClientRect();let x=e-w.width/2,k=i-w.height-8;x<10&&(x=10),x+w.width>d.width-10&&(x=d.width-w.width-10),k<10&&(k=i+8),r.style.left=`${x}px`,r.style.top=`${k}px`,requestAnimationFrame(()=>{r.classList.add("show")});const I=O=>{var Ee;const E=O.target,v=E&&E||null,ie=document.getElementById("desainr-result-popup"),Me=(Ee=O.composedPath)==null?void 0:Ee.call(O),Ve=ie?Me?Me.includes(ie):v?ie.contains(v):!1:!1;(!v||!r.contains(v)&&!Ve)&&(this.hide(),document.removeEventListener("click",I))};setTimeout(()=>{document.addEventListener("click",I)},100)}hide(){var i;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(".monica-toolbar");e&&(this.isVisible=!1,e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}isShown(){return this.isVisible}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}(()=>{const n="desainr-overlay-root";let e=null,i=null,t=null,o="",r=null;function d(){try{const l=window.getSelection(),f=(l==null?void 0:l.toString())||"";if(f&&f.trim()){o=f;try{r=l&&l.rangeCount?l.getRangeAt(0).cloneRange():null}catch{r=null}}}catch{}}document.addEventListener("selectionchange",d,!0);function w(){let l="",f=null;try{const m=window.getSelection();if(l=(m==null?void 0:m.toString())||"",m&&m.rangeCount)try{f=m.getRangeAt(0).getBoundingClientRect()}catch{}}catch{}if(!l.trim()&&o.trim()){l=o;try{f=r?r.getBoundingClientRect():f}catch{}}return{text:l,rect:f}}(()=>{e||(e=new Ye),i||(i=new yt)})();async function k(l,f){var m,h,B,_,te,Q,b,K,H,ce,le,we,ye,xe,be,Le,F,L,M,Z,Y,pe,he,ae,de,me,ge,ke,Ne,g,A,z,S,V,X,W,q,se;try{if(l==="refine"){const{text:p,rect:a}=w();if(!p.trim()){v("No text selected","warning");return}try{await C("Refine",p,"Working…",a||void 0);const{actions:N}=await D(async()=>{const{actions:We}=await Promise.resolve().then(()=>ee);return{actions:We}},void 0),T=await((B=(m=chrome.storage)==null?void 0:(h=m.local).get)==null?void 0:B.call(h,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),j=T==null?void 0:T["desainr.settings.modelId"],$=(T==null?void 0:T["desainr.settings.thinkingMode"])||"none",J=T==null?void 0:T["desainr.settings.userApiKey"],U=(T==null?void 0:T["desainr.settings.outputLang"])||"auto",u="Improve clarity and fluency while preserving the original meaning. Return only the refined text."+(U==="auto"?" Respond in the same language as the input.":` Respond in ${U}.`),{ok:R,status:P,json:re,error:ln}=await N({selection:p,clientMessage:p,customInstruction:u,modelId:j,thinkingMode:$,userApiKey:J});if(R&&(re!=null&&re.result))await C("Refine",p,re.result,a||void 0);else{const We=ln||(re==null?void 0:re.error)||"unknown";await C("Refine",p,`Failed (${P}): ${We}`,a||void 0)}}catch(N){await C("Refine",p,`Error: ${(N==null?void 0:N.message)||N}`,a||void 0)}return}const{text:c,rect:y}=w();if(l==="translate"){if(!c.trim()){v("No text selected","warning");return}try{await C("Translate",c,"Working…",y||void 0);const p=await((Q=(_=chrome.storage)==null?void 0:(te=_.local).get)==null?void 0:Q.call(te,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({})));let a=(p==null?void 0:p["desainr.settings.targetLang"])||(await D(async()=>{const{DEFAULT_TARGET_LANG:G}=await Promise.resolve().then(()=>Se);return{DEFAULT_TARGET_LANG:G}},void 0)).DEFAULT_TARGET_LANG;const N=(p==null?void 0:p["desainr.settings.outputLang"])||"auto";N&&N!=="auto"&&(a=N);const T=p==null?void 0:p["desainr.settings.modelId"],j=(p==null?void 0:p["desainr.settings.thinkingMode"])||"none",$=p==null?void 0:p["desainr.settings.userApiKey"],{translateChunks:J}=await D(async()=>{const{translateChunks:G}=await Promise.resolve().then(()=>ee);return{translateChunks:G}},void 0);let U=await J({selection:c,url:location.href,targetLang:a,modelId:T,thinkingMode:j,userApiKey:$});if(U.ok&&((b=U.json)!=null&&b.result))await C("Translate",c,U.json.result,y||void 0);else{const{actions:G}=await D(async()=>{const{actions:P}=await Promise.resolve().then(()=>ee);return{actions:P}},void 0),u=`Translate the following text into ${a}. Return only the translation, no comments.`,R=await G({selection:c,clientMessage:c,customInstruction:u,modelId:T,thinkingMode:j,userApiKey:$});if(R.ok&&((K=R.json)!=null&&K.result))await C("Translate",c,R.json.result,y||void 0);else{const P=R.error||((H=R.json)==null?void 0:H.error)||U.error||((ce=U.json)==null?void 0:ce.error)||"unknown";await C("Translate",c,`Failed (${R.status||U.status}): ${P}`,y||void 0)}}}catch(p){await C("Translate",c,`Error: ${(p==null?void 0:p.message)||p}`,y||void 0)}}else if(l==="expand"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:re}=await Promise.resolve().then(()=>ee);return{actions:re}},void 0);await C("Expand",c,"Working…",y||void 0);const a=await((ye=(le=chrome.storage)==null?void 0:(we=le.local).get)==null?void 0:ye.call(we,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",U="Expand the following text to be more detailed and comprehensive while preserving tone and meaning. Return only the expanded text."+($==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`),{ok:G,status:u,json:R,error:P}=await p({selection:c,clientMessage:c,customInstruction:U,modelId:N,thinkingMode:T,userApiKey:j});if(G&&(R!=null&&R.result))await C("Expand",c,R.result,y||void 0);else{const re=P||(R==null?void 0:R.error)||"unknown";await C("Expand",c,`Failed (${u}): ${re}`,y||void 0)}}else if(l==="correct"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:re}=await Promise.resolve().then(()=>ee);return{actions:re}},void 0);await C("Correct Grammar",c,"Working…",y||void 0);const a=await((Le=(xe=chrome.storage)==null?void 0:(be=xe.local).get)==null?void 0:Le.call(be,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",U="Correct grammar, spelling and punctuation while preserving meaning. Return only the corrected text."+($==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`),{ok:G,status:u,json:R,error:P}=await p({selection:c,clientMessage:c,customInstruction:U,modelId:N,thinkingMode:T,userApiKey:j});if(G&&(R!=null&&R.result))await C("Correct Grammar",c,R.result,y||void 0);else{const re=P||(R==null?void 0:R.error)||"unknown";await C("Correct Grammar",c,`Failed (${u}): ${re}`,y||void 0)}}else if(l==="explain"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:P}=await Promise.resolve().then(()=>ee);return{actions:P}},void 0);await C("Explain",c,"Working…",y||void 0);const a=await((M=(F=chrome.storage)==null?void 0:(L=F.local).get)==null?void 0:M.call(L,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",J=$==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`,{ok:U,status:G,json:u,error:R}=await p({selection:c,clientMessage:c,customInstruction:"Explain this clearly."+J,modelId:N,thinkingMode:T,userApiKey:j});if(U&&(u!=null&&u.result))await C("Explain",c,u.result,y||void 0);else{const P=R||(u==null?void 0:u.error)||"unknown";await C("Explain",c,`Failed (${G}): ${P}`,y||void 0)}}else if(l==="rephrase"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:P}=await Promise.resolve().then(()=>ee);return{actions:P}},void 0);await C("Rephrase",c,"Working…",y||void 0);const a=await((pe=(Z=chrome.storage)==null?void 0:(Y=Z.local).get)==null?void 0:pe.call(Y,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",J=$==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`,{ok:U,status:G,json:u,error:R}=await p({selection:c,clientMessage:c,customInstruction:"Rephrase the following text to be clearer and more natural while preserving meaning. Return only the rephrased text."+J,modelId:N,thinkingMode:T,userApiKey:j});if(U&&(u!=null&&u.result))await C("Rephrase",c,u.result,y||void 0);else{const P=R||(u==null?void 0:u.error)||"unknown";await C("Rephrase",c,`Failed (${G}): ${P}`,y||void 0)}}else if(l==="summarize"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:P}=await Promise.resolve().then(()=>ee);return{actions:P}},void 0);await C("Summarize",c,"Working…",y||void 0);const a=await((de=(he=chrome.storage)==null?void 0:(ae=he.local).get)==null?void 0:de.call(ae,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",J=$==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`,{ok:U,status:G,json:u,error:R}=await p({selection:c,clientMessage:c,customInstruction:"Summarize the following text concisely in 1-3 sentences. Return only the summary."+J,modelId:N,thinkingMode:T,userApiKey:j});if(U&&(u!=null&&u.result))await C("Summarize",c,u.result,y||void 0);else{const P=R||(u==null?void 0:u.error)||"unknown";await C("Summarize",c,`Failed (${G}): ${P}`,y||void 0)}}else if(l==="add-details"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:P}=await Promise.resolve().then(()=>ee);return{actions:P}},void 0);await C("Add Details",c,"Working…",y||void 0);const a=await((ke=(me=chrome.storage)==null?void 0:(ge=me.local).get)==null?void 0:ke.call(ge,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",J=$==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`,{ok:U,status:G,json:u,error:R}=await p({selection:c,clientMessage:c,customInstruction:"Add helpful, concrete details to the following text while preserving tone and meaning. Return only the improved text."+J,modelId:N,thinkingMode:T,userApiKey:j});if(U&&(u!=null&&u.result))await C("Add Details",c,u.result,y||void 0);else{const P=R||(u==null?void 0:u.error)||"unknown";await C("Add Details",c,`Failed (${G}): ${P}`,y||void 0)}}else if(l==="more-informative"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:P}=await Promise.resolve().then(()=>ee);return{actions:P}},void 0);await C("More Informative",c,"Working…",y||void 0);const a=await((A=(Ne=chrome.storage)==null?void 0:(g=Ne.local).get)==null?void 0:A.call(g,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",J=$==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`,{ok:U,status:G,json:u,error:R}=await p({selection:c,clientMessage:c,customInstruction:"Make the following text more informative by adding succinct, factual context. Keep it concise. Return only the revised text."+J,modelId:N,thinkingMode:T,userApiKey:j});if(U&&(u!=null&&u.result))await C("More Informative",c,u.result,y||void 0);else{const P=R||(u==null?void 0:u.error)||"unknown";await C("More Informative",c,`Failed (${G}): ${P}`,y||void 0)}}else if(l==="simplify"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:P}=await Promise.resolve().then(()=>ee);return{actions:P}},void 0);await C("Simplify",c,"Working…",y||void 0);const a=await((V=(z=chrome.storage)==null?void 0:(S=z.local).get)==null?void 0:V.call(S,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",J=$==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`,{ok:U,status:G,json:u,error:R}=await p({selection:c,clientMessage:c,customInstruction:"Simplify the following text to be easier to understand, using plain language. Return only the simplified text."+J,modelId:N,thinkingMode:T,userApiKey:j});if(U&&(u!=null&&u.result))await C("Simplify",c,u.result,y||void 0);else{const P=R||(u==null?void 0:u.error)||"unknown";await C("Simplify",c,`Failed (${G}): ${P}`,y||void 0)}}else if(l==="emojify"){if(!c.trim()){v("No text selected","warning");return}const{actions:p}=await D(async()=>{const{actions:P}=await Promise.resolve().then(()=>ee);return{actions:P}},void 0);await C("Emojify",c,"Working…",y||void 0);const a=await((q=(X=chrome.storage)==null?void 0:(W=X.local).get)==null?void 0:q.call(W,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),N=a==null?void 0:a["desainr.settings.modelId"],T=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",j=a==null?void 0:a["desainr.settings.userApiKey"],$=(a==null?void 0:a["desainr.settings.outputLang"])||"auto",J=$==="auto"?" Respond in the same language as the input.":` Respond in ${$}.`,{ok:U,status:G,json:u,error:R}=await p({selection:c,clientMessage:c,customInstruction:"Rewrite the following text with a friendly, engaging tone and add relevant emojis where appropriate; do not overuse them. Return only the revised text."+J,modelId:N,thinkingMode:T,userApiKey:j});if(U&&(u!=null&&u.result))await C("Emojify",c,u.result,y||void 0);else{const P=R||(u==null?void 0:u.error)||"unknown";await C("Emojify",c,`Failed (${G}): ${P}`,y||void 0)}}else if(l==="analyze"){const{analyzePage:p}=await D(async()=>{const{analyzePage:$}=await Promise.resolve().then(()=>ee);return{analyzePage:$}},void 0);await C("Analyze",c||"(No selection)","Working…",y||void 0);const{ok:a,status:N,json:T,error:j}=await p({url:location.href,title:document.title});if(a)await C("Analyze",c||"(No selection)",(T==null?void 0:T.summary)||"Done",y||void 0);else{const $=j||(T==null?void 0:T.error)||"unknown";await C("Analyze",c||"(No selection)",`Failed (${N}): ${$}`,y||void 0)}}else if(l==="designer")je();else if(l==="designer-chat")je();else if(l==="copy"){const p=((se=window.getSelection())==null?void 0:se.toString())||"";p?(navigator.clipboard.writeText(p),v("Text copied to clipboard! 📋","success")):v("No text selected","warning")}else l==="settings"?v("Extension settings coming soon! ⚙️","info"):l==="customize"?v("Custom actions coming soon! 🔧","info"):v(`Unknown action: ${f}`,"warning")}catch(c){v(`Error: ${(c==null?void 0:c.message)||c}`,"error")}}const I=document.getElementById(n);if(I)try{I.style.display="none",I.textContent=""}catch{}function O(){return t&&t.remove(),t=document.createElement("div"),Object.assign(t.style,{position:"fixed",top:"20px",right:"20px",zIndex:s.zIndex.toast,background:s.colors.surface,color:s.colors.textPrimary,border:`1px solid ${s.colors.border}`,borderRadius:s.borderRadius.lg,padding:`${s.spacing.md} ${s.spacing.lg}`,boxShadow:s.shadows.lg,backdropFilter:"blur(12px)",maxWidth:"420px",fontFamily:s.typography.fontFamily,fontSize:s.typography.fontSize.sm,display:"none",opacity:"0",transform:"translateY(-8px) scale(0.95)",transition:`all ${s.animation.fast}`}),document.documentElement.appendChild(t),t}function E(){return O()}function v(l,f="info"){const m=O(),h={info:"💬",success:"✅",error:"❌",warning:"⚠️"},B={info:s.colors.info,success:s.colors.success,error:s.colors.error,warning:s.colors.warning};m.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${s.spacing.md};">
        <div style="font-size: 18px;">${h[f]}</div>
        <div style="flex: 1; line-height: ${s.typography.lineHeight.normal};">${l}</div>
        <div style="width: 4px; height: 40px; background: ${B[f]}; border-radius: 2px; margin-left: ${s.spacing.md};"></div>
      </div>
    `,m.style.display="block",requestAnimationFrame(()=>{m.style.opacity="1",m.style.transform="translateY(0) scale(1)"}),setTimeout(()=>ie(),3e3)}function ie(){t&&(t.style.opacity="0",t.style.transform="translateY(-8px) scale(0.95)",setTimeout(()=>{t&&(t.style.display="none")},150))}function Me(l,f,m=6e3){const h=document.createElement("button");h.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${s.spacing.xs};">
        <span>↶</span>
        <span>Undo</span>
      </div>
    `,Object.assign(h.style,{marginLeft:s.spacing.md,padding:`${s.spacing.xs} ${s.spacing.md}`,background:s.colors.primary,color:"white",border:"none",borderRadius:s.borderRadius.md,cursor:"pointer",fontSize:s.typography.fontSize.sm,fontWeight:s.typography.fontWeight.medium,transition:`all ${s.animation.fast}`,fontFamily:s.typography.fontFamily}),h.onmouseenter=()=>{h.style.background=s.colors.primaryHover,h.style.transform="translateY(-1px)"},h.onmouseleave=()=>{h.style.background=s.colors.primary,h.style.transform="translateY(0)"};const B=()=>{try{const _=f();v(_?"Undone successfully! ✓":"Undo failed",_?"success":"error")}catch{v("Undo failed","error")}finally{h.remove(),setTimeout(()=>ie(),800)}};h.addEventListener("click",B,{once:!0}),l.appendChild(h),setTimeout(()=>{try{h.remove()}catch{}},m)}function Ve(l,f,m=12e3){const h=document.createElement("button");h.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${s.spacing.xs};">
        <span>📋</span>
        <span>Copy</span>
      </div>
    `,Object.assign(h.style,{marginLeft:s.spacing.md,padding:`${s.spacing.xs} ${s.spacing.md}`,background:s.colors.surface,color:s.colors.textPrimary,border:`1px solid ${s.colors.border}`,borderRadius:s.borderRadius.md,cursor:"pointer",fontSize:s.typography.fontSize.sm,fontWeight:s.typography.fontWeight.medium,transition:`all ${s.animation.fast}`,fontFamily:s.typography.fontFamily}),h.onmouseenter=()=>{h.style.background=s.colors.surfaceHover,h.style.borderColor=s.colors.primary,h.style.transform="translateY(-1px)"},h.onmouseleave=()=>{h.style.background=s.colors.surface,h.style.borderColor=s.colors.border,h.style.transform="translateY(0)"};const B=async()=>{try{await navigator.clipboard.writeText(f),v("Copied to clipboard! ✓","success")}catch{v("Copy failed","error")}finally{h.remove(),setTimeout(()=>ie(),800)}};h.addEventListener("click",B,{once:!0}),l.appendChild(h),setTimeout(()=>{try{h.remove()}catch{}},m)}function Ee(l){return l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function tn(l,f){const m=Ee(String(f.summary||"Analysis complete")),h=Array.isArray(f.keyPoints)?f.keyPoints:[],B=Array.isArray(f.links)?f.links:[],_=h.length?`<ul style="margin:6px 0 8px 18px; padding:0;">${h.map(b=>`<li style="margin:2px 0;">${Ee(b)}</li>`).join("")}</ul>`:"",te=B.length?`<div style="margin-top:6px; max-height:160px; overflow:auto;"><div style="font-weight:600; margin-bottom:4px;">Top links</div>${B.slice(0,10).map(b=>`<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><a href="${Ee(b)}" target="_blank" rel="noopener noreferrer">${Ee(b)}</a></div>`).join("")}</div>`:"";l.innerHTML=`<div style="font-size:13px; line-height:1.35;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-weight:700;">Analysis</div>
        <button id="desainr-close-overlay" style="border:1px solid #ddd; border-radius:6px; padding:2px 6px; background:#f7f7f7; cursor:pointer;">Close</button>
      </div>
      <div style="margin-top:6px;">${m}</div>
      ${_}
      ${te}
    </div>`;const Q=l.querySelector("#desainr-close-overlay");Q&&(Q.onclick=()=>{l.style.display="none"})}let De=null,ue=null;async function je(){if(ue){try{ue.detach()}catch{}ue=null,De=null;return}const l=document.createElement("div");l.id="desainr-overlay-react-root",Object.assign(l.style,{position:"fixed",top:"20px",right:"20px",zIndex:1e6}),document.documentElement.appendChild(l);try{ue=(await D(()=>Promise.resolve().then(()=>Lt),void 0)).mountOverlay(l,()=>{try{ue==null||ue.detach()}catch{}ue=null,De=null}),De=l}catch(f){const m=E();m.style.display="block",m.textContent=`Overlay failed: ${(f==null?void 0:f.message)||f}`,setTimeout(()=>ie(),1500)}}let nn=0,Ge=null,Oe=null;function on(){if(Ge)return Ge;const l=document.createElement("div");l.id="desainr-result-popup",Object.assign(l.style,{position:"fixed",zIndex:1e6,top:"0px",left:"0px",display:"none"});try{const h=_=>{try{_.stopPropagation()}catch{}},B=_=>{try{_.preventDefault()}catch{}try{_.stopPropagation()}catch{}};l.addEventListener("click",h),l.addEventListener("mousedown",h),l.addEventListener("mouseup",h),l.addEventListener("pointerdown",h),l.addEventListener("pointerup",h),l.addEventListener("touchstart",h),l.addEventListener("touchend",h),l.addEventListener("auxclick",B),l.addEventListener("contextmenu",B)}catch{}Oe=l.attachShadow({mode:"open"});const f=document.createElement("style");f.textContent=`
      :host { all: initial; }
      .popup { 
        width: clamp(640px, 80vw, 1040px); max-width: 96vw; max-height: 86vh; overflow: visible;
        background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%); color: #1f2937;
        border: 1px solid rgba(99,102,241,0.18);
        border-radius: 16px; box-shadow: 0 20px 50px rgba(17,24,39,0.18);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px; line-height: 1.45;
        opacity: 0; transform: translateY(6px) scale(0.98);
        transition: transform .18s ease, opacity .18s ease;
        position: relative;
      }
      .popup.show { opacity: 1; transform: translateY(0) scale(1); }
      .toolbar { 
        display: none;
      }
      .body { 
        display: grid; grid-template-columns: 1fr 10px 1fr; gap: 0;
        border-top-left-radius: 14px; border-top-right-radius: 14px;
        overflow: hidden;
        background: transparent;
      }
      .split-scroll { position: relative; background: #eef2ff; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
      .split-scroll .thumb { position: absolute; left: 2px; right: 2px; top: 0; height: 60px; border-radius: 6px; background: linear-gradient(180deg,#a5b4fc,#6366f1); box-shadow: inset 0 0 0 2px rgba(255,255,255,.6); cursor: grab; }
      .split-scroll .thumb:active { cursor: grabbing; }
      .text-area { 
        background: #ffffff; padding: 12px; white-space: pre-wrap; 
        min-height: 96px; max-height: 70vh;
        overflow-y: auto; font-size: 12.5px; line-height: 1.5;
        border: none; position: relative;
      }
      .text-area.result { 
        background: linear-gradient(180deg, #fafbff 0%, #f7faff 100%);
      }
      .footer { 
        display: flex; justify-content: space-between; align-items: center; gap: 8px; 
        padding: 10px 12px; background: #fafbfc;
        border-top: 1px solid #f0f0f0; overflow: visible;
        border-bottom-left-radius: 14px; border-bottom-right-radius: 14px;
      }
      .footer-left {
        display: flex; align-items: center; gap: 6px;
      }
      .action-switcher { 
        display: inline-flex; align-items: center; gap: 8px; position: relative; 
      }
      .action-switcher.open { border-color: #a5b4fc; box-shadow: 0 2px 8px rgba(99,102,241,.18); }
      .dropdown-arrow { opacity: 0.6; }
      .btn { 
        border: 1px solid #d1d5db; border-radius: 3px; 
        padding: 4px 8px; background: #fff; 
        cursor: pointer; font-size: 11px; color: #666;
        transition: transform .12s ease, background .12s ease, border-color .12s ease, box-shadow .12s ease;
      }
      .btn:hover { 
        background: #f9f9ff; border-color: #a5b4fc; box-shadow: 0 2px 8px rgba(99,102,241,.18);
        transform: translateY(-1px);
      }
      .btn.primary { 
        background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%); color: #fff; border-color: #4f46e5;
      }
      .btn.primary:hover { 
        background: linear-gradient(180deg, #4f46e5 0%, #4338ca 100%);
      }
      .action-dropdown {
        position: absolute; bottom: 100%; left: 0;
        background: #fff; border: 1px solid rgba(99,102,241,0.2);
        border-radius: 12px; box-shadow: 0 12px 32px rgba(17,24,39,0.18);
        max-height: 260px; overflow-y: auto; width: max-content; min-width: 220px; max-width: 60vw;
        z-index: 1000; display: none; margin-bottom: 8px;
      }
      .action-dropdown.show { display: block; }
      .dropdown-item {
        padding: 6px 10px; cursor: pointer; transition: background .12s ease, transform .12s ease; 
        font-size: 12.5px; color: #1f2937; display: flex; align-items: center; gap: 8px;
        border-bottom: 1px solid #f3f4f6;
      }
      .dropdown-item:last-child { border-bottom: none; }
      .dropdown-item:hover { 
        background: #eef2ff; transform: translateX(2px);
      }
      .dropdown-item.active { 
        background: #e0e7ff; color: #4f46e5;
      }
      .dropdown-item .ico { display:inline-flex; width:16px; height:16px; }
      .dropdown-item .ico svg { width:16px; height:16px; stroke:#4b5563; }

      /* Hide side scrollbars (we use center scrollbar) */
      .text-area::-webkit-scrollbar { width: 0; height: 0; }
      .text-area { scrollbar-width: none; }
      /* Keep dropdown scrollbar minimal */
      .action-dropdown::-webkit-scrollbar { width: 10px; }
      .action-dropdown::-webkit-scrollbar-track { background: #f8fafc; border-radius: 12px; }
      .action-dropdown::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 12px; }
      .action-dropdown { scrollbar-width: thin; scrollbar-color: #c7d2fe #f8fafc; }

      /* Processing overlay */
      .processing { position: absolute; inset: 0; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(2px); background: rgba(255,255,255,0.65); z-index: 2; }
      .processing .spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
      .processing .msg { margin-top: 10px; font-size: 12px; color: #4b5563; text-align:center; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .processing-wrap { display:flex; flex-direction:column; align-items:center; gap:6px; }

      /* Dropdown single-line fit */
      .dropdown-item { white-space: nowrap; }
      
      /* Language switcher */
      .lang-wrap { position: relative; display:inline-flex; }
      .lang-switcher { display:inline-flex; align-items:center; gap:6px; }
      .lang-dropdown { position:absolute; bottom:100%; left:0; background:#fff; border:1px solid #e5e7eb; border-radius:10px; box-shadow: 0 12px 32px rgba(17,24,39,0.18); max-height:260px; overflow:auto; display:none; margin-bottom:8px; z-index:1000; min-width:160px; }
      .lang-dropdown.show { display:block; }
      .lang-item { padding:6px 10px; display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12.5px; border-bottom:1px solid #f3f4f6; }
      .lang-item:last-child { border-bottom:none; }
      .lang-item:hover { background:#eef2ff; }
    `,Oe.appendChild(f);const m=document.createElement("div");return m.className="popup",m.innerHTML=`
      <div class="body">
        <div class="text-area" id="orig"></div>
        <div class="split-scroll" id="split-scroll"><div class="thumb" id="split-thumb"></div></div>
        <div class="text-area result" id="res"></div>
      </div>
      <div class="footer">
        <div class="left">
          <div class="action-switcher btn" id="action-switcher">
            <span id="action-label">Refine</span>
            <span class="dropdown-arrow">▼</span>
            <div class="action-dropdown" id="action-dropdown">
              <div class="dropdown-item active" data-action="refine"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></span> Refine</div>
              <div class="dropdown-item" data-action="translate"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15M9 7.5h6M9 12h3"/></svg></span> Translate</div>
              <div class="dropdown-item" data-action="rephrase"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 12h10M4 16h8"/></svg></span> Rephrase</div>
              <div class="dropdown-item" data-action="summarize"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 12h12M3 18h8"/></svg></span> Summarize</div>
              <div class="dropdown-item" data-action="expand"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16M4 12h16"/></svg></span> Expand</div>
              <div class="dropdown-item" data-action="correct"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg></span> Correct Grammar</div>
              <div class="dropdown-item" data-action="explain"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 6.75h1.5v1.5h-1.5zM12 17.25v-6"/></svg></span> Explain</div>
              <div class="dropdown-item" data-action="add-details"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12M6 12h12"/></svg></span> Add Details</div>
              <div class="dropdown-item" data-action="more-informative"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25h1.5v6h-1.5zM12 6.75h.008v.008H12z"/></svg></span> More Informative</div>
              <div class="dropdown-item" data-action="simplify"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12"/></svg></span> Simplify</div>
              <div class="dropdown-item" data-action="emojify"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.121 14.121a3 3 0 01-4.242 0M9 9h.01M15 9h.01M12 21a9 9 0 100-18 9 9 0 000 18z"/></svg></span> Emojify</div>
              <div class="dropdown-item" data-action="analyze"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 4-4 3 3 7-7"/></svg></span> Analyze</div>
              <div class="dropdown-item" data-action="designer"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4 4 12-12"/></svg></span> Designer</div>
              <div class="dropdown-item" data-action="customize"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h3M4.5 12h15M8.25 18h7.5"/></svg></span> Customize Actions</div>
            </div>
          </div>
          <button class="btn" id="regen" title="Regenerate">↻ Regenerate</button>
          <div class="lang-wrap">
            <button class="btn lang-switcher" id="lang-switcher" title="Output language"><span id="lang-label">Auto</span> <span class="dropdown-arrow">▼</span></button>
            <div class="lang-dropdown" id="lang-dropdown">
              <div class="lang-item" data-lang="auto">Auto (same as input)</div>
              <div class="lang-item" data-lang="en">English</div>
              <div class="lang-item" data-lang="bn">Bengali (বাংলা)</div>
              <div class="lang-item" data-lang="hi">Hindi (हिन्दी)</div>
              <div class="lang-item" data-lang="es">Spanish (Español)</div>
              <div class="lang-item" data-lang="fr">French (Français)</div>
              <div class="lang-item" data-lang="de">German (Deutsch)</div>
              <div class="lang-item" data-lang="it">Italian (Italiano)</div>
              <div class="lang-item" data-lang="pt">Portuguese (Português)</div>
              <div class="lang-item" data-lang="ar">Arabic (العربية)</div>
              <div class="lang-item" data-lang="zh">Chinese (中文)</div>
              <div class="lang-item" data-lang="ja">Japanese (日本語)</div>
              <div class="lang-item" data-lang="ko">Korean (한국어)</div>
              <div class="lang-item" data-lang="ru">Russian (Русский)</div>
            </div>
          </div>
        </div>
        <div class="right" style="display:flex; gap:6px;">
          <button class="btn" id="copy">Copy</button>
          <button class="btn primary" id="replace">Replace</button>
          <button class="btn" id="close">Close</button>
        </div>
      </div>
    `,Oe.appendChild(m),document.documentElement.appendChild(l),Ge=l,l}let Re="refine";async function C(l,f,m,h){var ge,ke,Ne;const B=on(),_=Oe;if(!_){try{console.warn("DesAInR: popupShadow not available")}catch{}return}Re=l.toLowerCase();const te=_.querySelector(".popup"),Q=_.getElementById("action-switcher"),b=_.getElementById("action-dropdown"),K=_.getElementById("orig"),H=_.getElementById("res"),ce=_.getElementById("split-scroll"),le=_.getElementById("split-thumb"),we=_.getElementById("close"),ye=_.getElementById("copy"),xe=_.getElementById("replace"),be=_.getElementById("regen");if(K&&(K.textContent=f),H&&(H.textContent=m),(g=>{const A=_.querySelector(".processing");if(g){if(A)return;const z=document.createElement("div");z.className="processing",z.innerHTML='<div class="processing-wrap"><div class="spinner"></div><div class="msg">Preparing…</div></div>';const S=_.querySelector(".body");S&&S.appendChild(z)}else if(A)try{A.remove()}catch{}})(m==="Working…"),K&&H){let g=0;const A=(S,V)=>{const X=Math.max(1,S.scrollHeight-S.clientHeight),W=Math.max(1,V.scrollHeight-V.clientHeight),q=S.scrollTop/X;V.scrollTop=q*W};K.onscroll=()=>{g!==2&&(g=1,A(K,H),g=0,z())},H.onscroll=()=>{g!==1&&(g=2,A(H,K),g=0,z())};const z=()=>{if(!ce||!le)return;const S=Math.max(1,K.scrollHeight-K.clientHeight),V=Math.max(1,H.scrollHeight-H.clientHeight),X=Math.max(K.scrollTop/S,H.scrollTop/V),W=ce.clientHeight,q=Math.min(K.clientHeight/K.scrollHeight,H.clientHeight/H.scrollHeight),se=Math.max(40,Math.floor(W*q)),c=Math.floor((W-se)*X);le.style.height=`${se}px`,le.style.top=`${c}px`};if(ce){if(ce.onwheel=S=>{S.preventDefault();const V=S.deltaY||S.deltaX;K.scrollTop+=V,H.scrollTop+=V},le){let S=!1,V=0,X=0;le.addEventListener("mousedown",W=>{S=!0,V=W.clientY,X=le.offsetTop,W.preventDefault()}),window.addEventListener("mousemove",W=>{if(!S||!ce)return;const q=ce.clientHeight,se=le.offsetHeight,c=q-se,y=Math.max(0,Math.min(c,X+(W.clientY-V))),p=c?y/c:0,a=Math.max(1,K.scrollHeight-K.clientHeight),N=Math.max(1,H.scrollHeight-H.clientHeight);K.scrollTop=p*a,H.scrollTop=p*N}),window.addEventListener("mouseup",()=>{S=!1})}setTimeout(z,0)}}const L={refine:" Refine",translate:" Translate",rephrase:" Rephrase",summarize:" Summarize",expand:" Expand","correct grammar":" Correct Grammar",explain:" Explain","add details":" Add Details"}[Re]||"Refine",M=_.getElementById("action-label");M&&(M.textContent=L);const Z=_.querySelectorAll(".dropdown-item");Z.forEach(g=>{g.dataset.action===Re?g.classList.add("active"):g.classList.remove("active")});function Y(){const A=B.getBoundingClientRect();let z=0,S=0;h?(z=h.left,S=h.bottom+15,z+A.width>window.innerWidth-15&&(z=window.innerWidth-A.width-15),z<15&&(z=15),S+A.height>window.innerHeight-15&&(S=h.top-A.height-15,S<15&&(S=15))):(z=(window.innerWidth-A.width)/2,S=(window.innerHeight-A.height)/2),B.style.left=`${Math.round(z)}px`,B.style.top=`${Math.round(S)}px`}B.style.display="block",requestAnimationFrame(()=>{te&&te.classList.add("show"),Y()});const pe=()=>{te&&te.classList.remove("show"),setTimeout(()=>B.style.display="none",300)};Q&&b&&(Q.onclick=g=>{g.stopPropagation(),g.preventDefault(),b.classList.toggle("show"),Q.classList.toggle("open")},document.addEventListener("click",()=>{b.classList.remove("show"),Q.classList.remove("open")},{once:!0}),Z.forEach(g=>{g.onclick=async A=>{A.preventDefault(),A.stopPropagation();const z=g.dataset.action;z&&z!==Re&&(b.classList.remove("show"),Q.classList.remove("open"),H&&(H.textContent="Processing..."),await k(z,z))}}));const he=_.getElementById("lang-switcher"),ae=_.getElementById("lang-dropdown"),de=_.getElementById("lang-label"),me=g=>{const A={auto:"Auto",en:"English",bn:"Bengali",hi:"Hindi",es:"Spanish",fr:"French",de:"German",it:"Italian",pt:"Portuguese",ar:"Arabic",zh:"Chinese",ja:"Japanese",ko:"Korean",ru:"Russian"};de&&(de.textContent=A[g]||g.toUpperCase())};try{const g=await((Ne=(ge=chrome.storage)==null?void 0:(ke=ge.local).get)==null?void 0:Ne.call(ke,["desainr.settings.outputLang"]));me((g==null?void 0:g["desainr.settings.outputLang"])||"auto")}catch{}he&&ae&&(he.onclick=A=>{A.preventDefault(),A.stopPropagation(),ae.classList.toggle("show")},document.addEventListener("click",()=>{try{ae.classList.remove("show")}catch{}},{once:!0}),Array.from(ae.querySelectorAll(".lang-item")).forEach(A=>{A.onclick=async z=>{var V,X,W,q,se,c;z.preventDefault(),z.stopPropagation();const S=A.dataset.lang||"auto";try{if(await((W=(V=chrome.storage)==null?void 0:(X=V.local).set)==null?void 0:W.call(X,{"desainr.settings.outputLang":S})),S!=="auto")try{await((c=(q=chrome.storage)==null?void 0:(se=q.local).set)==null?void 0:c.call(se,{"desainr.settings.targetLang":S}))}catch{}}catch{}me(S),ae.classList.remove("show")}})),we&&(we.onclick=g=>{g.preventDefault(),g.stopPropagation(),pe()}),ye&&(ye.onclick=async g=>{var A,z;(A=g==null?void 0:g.preventDefault)==null||A.call(g),(z=g==null?void 0:g.stopPropagation)==null||z.call(g);try{await navigator.clipboard.writeText(m),v("Copied! ✓","success")}catch{v("Copy failed","error")}}),be&&(be.onclick=async g=>{g.preventDefault(),g.stopPropagation(),H&&(H.textContent="Processing..."),await k(Re,Re)}),xe&&(xe.onclick=async g=>{var z,S;(z=g==null?void 0:g.preventDefault)==null||z.call(g),(S=g==null?void 0:g.stopPropagation)==null||S.call(g);const A=E();try{const{applyReplacementOrCopyWithUndo:V}=await D(async()=>{const{applyReplacementOrCopyWithUndo:q}=await Promise.resolve().then(()=>lt);return{applyReplacementOrCopyWithUndo:q}},void 0);let{outcome:X,undo:W}=await V(m);if(X!=="replaced")try{const{getEditableSelection:q,isEditableElement:se,replaceEditableSelection:c}=await D(async()=>{const{getEditableSelection:p,isEditableElement:a,replaceEditableSelection:N}=await Promise.resolve().then(()=>Dt);return{getEditableSelection:p,isEditableElement:a,replaceEditableSelection:N}},void 0),y=q();if(y&&y.element&&se(y.element)){const p=c(y.element,m,y.start,y.end),a=()=>{try{return p(),!0}catch{return!1}};a&&(X="replaced",W=a)}}catch{}if(X!=="replaced"&&r)try{const q=r,se=q.cloneRange(),c=q.cloneContents();q.deleteContents();const y=document.createTextNode(m);q.insertNode(y);const p=()=>{try{const a=se;return y.parentNode&&y.parentNode.removeChild(y),a.insertNode(c),!0}catch{return!1}};X="replaced",W=p}catch{}if(X==="replaced")A.textContent="Replaced ✓",W&&Me(A,W);else if(X==="copied")A.textContent="Copied ✓",Ve(A,m);else try{await navigator.clipboard.writeText(m),A.textContent="Copied ✓"}catch{A.textContent="Done"}}catch(V){A.textContent=`Replace failed: ${(V==null?void 0:V.message)||V}`}finally{A.style.display="block",setTimeout(()=>ie(),1e3),pe()}})}async function an(){const f=(await D(()=>Promise.resolve().then(()=>Bt),void 0)).getSelectionInfo();if(!f){Ke();return}if(f.text,f.rect,i){const m=f.rect,h=m.left+m.width/2,B=m.top-8;i.show(h,B,_=>{k(_.id,_.label)})}}function Ke(){if(i)try{i.hide()}catch(l){console.warn("Error hiding Monica toolbar:",l)}}document.addEventListener("keydown",l=>{if(l.key==="Escape"&&(Ke(),ue)){try{ue.detach()}catch{}ue=null,De=null}}),document.addEventListener("selectionchange",()=>{var f;if(Date.now()<nn)return;(((f=window.getSelection())==null?void 0:f.toString())||"").trim()||Ke()}),document.addEventListener("mousedown",l=>{},!0);function rn(l=4e3){return new Promise(f=>{let m=!1;const h=te=>{window.removeEventListener("message",B),te&&clearTimeout(te)},B=te=>{if(te.source!==window)return;const Q=te.data;if(!Q||Q.type!=="DESAINR_WEBAPP_TOKEN"||m)return;m=!0,h();const{ok:b,idToken:K,error:H}=Q||{};f({ok:!!b,idToken:K,error:H||(b?void 0:"no_token")})};window.addEventListener("message",B);const _=window.setTimeout(()=>{m||(m=!0,h(),f({ok:!1,error:"timeout"}))},l);try{window.postMessage({type:"DESAINR_EXTENSION_GET_TOKEN",from:"desainr-extension"},window.origin)}catch{m=!0,h(_),f({ok:!1,error:"post_message_failed"})}})}chrome.runtime.onMessage.addListener((l,f,m)=>{if((l==null?void 0:l.type)==="TOGGLE_OVERLAY"&&je(),(l==null?void 0:l.type)==="CONTEXT_MENU"&&sn(l.id,l.info),(l==null?void 0:l.type)==="DESAINR_GET_WEBAPP_ID_TOKEN")return rn().then(h=>m(h)),!0}),document.addEventListener("mouseup",()=>{setTimeout(()=>{an().catch(()=>{})},100)}),document.addEventListener("contextmenu",l=>{const f=window.getSelection();f&&f.toString().trim()&&(l.preventDefault(),e&&e.show(l.pageX,l.pageY,m=>{k(m.id,m.label)}))});async function sn(l,f){var K,H,ce,le,we,ye,xe,be,Le;const{rewrite:m,translateChunks:h,analyzePage:B,saveMemo:_}=await D(async()=>{const{rewrite:F,translateChunks:L,analyzePage:M,saveMemo:Z}=await Promise.resolve().then(()=>ee);return{rewrite:F,translateChunks:L,analyzePage:M,saveMemo:Z}},void 0),{DEFAULT_TARGET_LANG:te}=await D(async()=>{const{DEFAULT_TARGET_LANG:F}=await Promise.resolve().then(()=>Se);return{DEFAULT_TARGET_LANG:F}},void 0),{applyReplacementOrCopyWithUndo:Q}=await D(async()=>{const{applyReplacementOrCopyWithUndo:F}=await Promise.resolve().then(()=>lt);return{applyReplacementOrCopyWithUndo:F}},void 0),b=E();b.style.display="block";try{if(l==="desainr-refine"){b.textContent="Refining selection...";const F=((K=window.getSelection())==null?void 0:K.toString())||"",L=await((le=(H=chrome.storage)==null?void 0:(ce=H.local).get)==null?void 0:le.call(ce,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=L==null?void 0:L["desainr.settings.modelId"],Z=(L==null?void 0:L["desainr.settings.thinkingMode"])||"none",Y=L==null?void 0:L["desainr.settings.userApiKey"],{ok:pe,status:he,json:ae,error:de}=await m({selection:F,url:location.href,task:"clarify",modelId:M,thinkingMode:Z,userApiKey:Y});if(pe&&(ae!=null&&ae.result)){const{outcome:me,undo:ge}=await Q(ae.result);me==="replaced"?(b.textContent="Refined ✓ (replaced selection)",ge&&Me(b,ge)):me==="copied"?b.textContent="Refined ✓ (copied)":b.textContent="Refined ✓"}else b.textContent=`Refine failed (${he}): ${de||"unknown"}`}else if(l==="desainr-translate"){b.textContent="Translating selection...";const F=((we=window.getSelection())==null?void 0:we.toString())||"",L=await((be=(ye=chrome.storage)==null?void 0:(xe=ye.local).get)==null?void 0:be.call(xe,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=(L==null?void 0:L["desainr.settings.targetLang"])||te,Z=L==null?void 0:L["desainr.settings.modelId"],Y=(L==null?void 0:L["desainr.settings.thinkingMode"])||"none",pe=L==null?void 0:L["desainr.settings.userApiKey"],{ok:he,status:ae,json:de,error:me}=await h({selection:F,url:location.href,targetLang:M,modelId:Z,thinkingMode:Y,userApiKey:pe});if(he&&(de!=null&&de.result)){const{outcome:ge,undo:ke}=await Q(de.result);ge==="replaced"?(b.textContent="Translated ✓ (replaced selection)",ke&&Me(b,ke)):ge==="copied"?b.textContent="Translated ✓ (copied)":b.textContent="Translated ✓"}else b.textContent=`Translate failed (${ae}): ${me||"unknown"}`}else if(l==="desainr-save-memo"){b.textContent="Saving to memo...";const F=((Le=window.getSelection())==null?void 0:Le.toString())||"";if(!F)b.textContent="No text selected";else{const L={title:`Selection from ${document.title||location.hostname}`,content:F,url:location.href,type:"selection",metadata:{pageTitle:document.title,timestamp:new Date().toISOString()},tags:["selection","extension"]},{ok:M,json:Z,error:Y}=await _(L);M&&Z?b.textContent=`✓ Saved to memo (ID: ${Z.memoId})`:b.textContent=`Save to memo failed: ${Y||"unknown"}`}}else if(l==="desainr-analyze"){b.textContent="Analyzing page...";const{ok:F,status:L,json:M,error:Z}=await B({url:location.href,title:document.title});F?tn(b,{summary:M==null?void 0:M.summary,keyPoints:M==null?void 0:M.keyPoints,links:M==null?void 0:M.links}):b.textContent=`Analyze failed (${L}): ${Z||"unknown"}`}else if(l==="desainr-translate-page"){b.textContent="Translating page...";const{translatePageAll:F}=await D(async()=>{const{translatePageAll:M}=await Promise.resolve().then(()=>Yt);return{translatePageAll:M}},void 0),{DEFAULT_TARGET_LANG:L}=await D(async()=>{const{DEFAULT_TARGET_LANG:M}=await Promise.resolve().then(()=>Se);return{DEFAULT_TARGET_LANG:M}},void 0);try{const M=await F(L);b.textContent=`Translated page ✓ (${M.translated}/${M.totalNodes} nodes, skipped ${M.skipped})`}catch(M){b.textContent=`Translate page error: ${(M==null?void 0:M.message)||M}`}}else if(l==="desainr-toggle-parallel"){const{isParallelModeEnabled:F,enableParallelMode:L,disableParallelMode:M}=await D(async()=>{const{isParallelModeEnabled:Y,enableParallelMode:pe,disableParallelMode:he}=await Promise.resolve().then(()=>en);return{isParallelModeEnabled:Y,enableParallelMode:pe,disableParallelMode:he}},void 0),{DEFAULT_TARGET_LANG:Z}=await D(async()=>{const{DEFAULT_TARGET_LANG:Y}=await Promise.resolve().then(()=>Se);return{DEFAULT_TARGET_LANG:Y}},void 0);try{F()?(b.textContent="Disabling parallel translate...",M(),b.textContent="Parallel translate OFF"):(b.textContent="Enabling parallel translate...",await L(Z),b.textContent="Parallel translate ON")}catch(Y){b.textContent=`Parallel toggle error: ${(Y==null?void 0:Y.message)||Y}`}}else b.textContent=`Unknown action: ${l}`}catch(F){b.textContent=`Error: ${(F==null?void 0:F.message)||F}`}finally{setTimeout(()=>{try{ie()}catch{}},800)}}})();const Te={rewrite:{maxTokens:20,refillRate:.5,costPerCall:1},"translate-chunks":{maxTokens:30,refillRate:1,costPerCall:1},"analyze-page":{maxTokens:10,refillRate:.2,costPerCall:1},chat:{maxTokens:30,refillRate:.5,costPerCall:1},actions:{maxTokens:20,refillRate:.5,costPerCall:1},"memo/save":{maxTokens:50,refillRate:1,costPerCall:1},"slash-prompts":{maxTokens:10,refillRate:.5,costPerCall:1},default:{maxTokens:20,refillRate:.5,costPerCall:1}},Qe="rateLimiter_";function Ze(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function et(n){var t;const e=`${Qe}${n}`,i=Te[n]||Te.default;if(Ze())return new Promise(o=>{chrome.storage.local.get(e,r=>{const d=r[e];d&&d.tokens!==void 0&&d.lastRefill!==void 0?o(d):o({tokens:i.maxTokens,lastRefill:Date.now()})})});try{const o=(t=globalThis==null?void 0:globalThis.localStorage)==null?void 0:t.getItem(e);if(o){const r=JSON.parse(o);if(r&&r.tokens!==void 0&&r.lastRefill!==void 0)return r}}catch{}return{tokens:i.maxTokens,lastRefill:Date.now()}}async function tt(n,e){var t;const i=`${Qe}${n}`;if(Ze())return new Promise(o=>{chrome.storage.local.set({[i]:e},o)});try{(t=globalThis==null?void 0:globalThis.localStorage)==null||t.setItem(i,JSON.stringify(e))}catch{}}function nt(n,e){const i=Date.now(),o=(i-n.lastRefill)/1e3*e.refillRate;return{tokens:Math.min(n.tokens+o,e.maxTokens),lastRefill:i}}async function xt(n){const e=Te[n]||Te.default;let i=await et(n);return i=nt(i,e),i.tokens<e.costPerCall?(await tt(n,i),!1):(i.tokens-=e.costPerCall,await tt(n,i),!0)}async function bt(n){const e=Te[n]||Te.default;let i=await et(n);i=nt(i,e);const t=Math.max(0,e.costPerCall-i.tokens),o=t>0?t/e.refillRate:0;return{remainingTokens:Math.floor(i.tokens),maxTokens:e.maxTokens,timeUntilRefill:Math.ceil(o),canMakeCall:i.tokens>=e.costPerCall}}async function Ce(n,e){if(!await xt(n)){const o=(await bt(n)).timeUntilRefill;return{ok:!1,status:429,error:`Rate limit exceeded. Please wait ${o} second${o!==1?"s":""} before trying again.`}}return new Promise(t=>{chrome.runtime.sendMessage({type:"API_CALL",path:n,body:e},o=>{if(!o)return t({ok:!1,status:0,error:"No response from background"});t(o)})})}function ot(n,e,i){const t=`${e&&(e.error||(e.message??""))||""} ${i||""}`.toLowerCase(),o=["quota","exhausted","insufficient","rate limit","resource has been exhausted","insufficient_quota","429","capacity"];return!!(n===429||n>=500&&o.some(r=>t.includes(r)))}function it(n,e,i){const t=e&&(e.error||(e.message??""))||"",o=`${t} ${i||""}`.toLowerCase();return typeof t=="string"&&t.startsWith("UNAUTHORIZED")?!1:n===401||n===403?!0:["invalid api key","api key not valid","key invalid","missing api key","no api key","invalid authentication","unauthorized","forbidden","permission denied"].some(d=>o.includes(d))}function at(n,e,i){const t=`${e&&(e.error||(e.message??""))||""} ${i||""}`.toLowerCase();return["billing","access not configured","permission not configured","project has been blocked","enable billing"].some(r=>t.includes(r))}function kt(n,e,i){const t=e&&(e.error||(e.message??""))||"";if(typeof t=="string"&&t.startsWith("UNAUTHORIZED"))return"Sign in is required or provide a Gemini API key in Settings (userApiKey).";if(it(n,e,i))return"Invalid or unauthorized API key. Update your Gemini API key in Settings or sign in again.";if(at(n,e,i))return"Billing or API access is not configured for this key/project. Enable billing in Google AI Studio or use another API key.";if(ot(n,e,i))return"AI capacity exhausted right now. Please try again in a bit, or switch the model/API key in settings.";if(n===401||n===403)return"Unauthorized. Please sign in again.";if(n===429)return"Too many requests. Please slow down and try again shortly.";if(n>=500)return"Server error. Please try again shortly."}async function _e(n,e=3,i=100){let t;for(let o=0;o<e;o++){let r=await n();if(r.ok)return r;const d=kt(r.status,r.json,r.error);d&&(r={...r,error:d}),t=r;const w=!r.status||r.status===0||r.status>=500,x=ot(r.status,r.json,r.error),k=it(r.status,r.json,r.error),I=at(r.status,r.json,r.error);if(!w||x||k||I||r.status===401||r.status===403||r.status===400)break;await new Promise(O=>setTimeout(O,i*Math.pow(2,o)))}return t??{ok:!1,status:0,error:"Unknown error"}}async function Et(n){return _e(()=>Ce("rewrite",n))}async function At(n){return _e(()=>Ce("translate-chunks",n))}async function Tt(n){return _e(()=>Ce("translate-chunks",n))}async function Ct(n){return _e(()=>Ce("analyze-page",n))}async function _t(n){return _e(()=>Ce("actions",n))}async function Mt(n){return _e(()=>Ce("memo/save",n))}const ee=Object.freeze(Object.defineProperty({__proto__:null,actions:_t,analyzePage:Ct,rewrite:Et,saveMemo:Mt,translateChunks:At,translateChunksBatch:Tt},Symbol.toStringTag,{value:"Module"})),Se=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_TARGET_LANG:"en"},Symbol.toStringTag,{value:"Module"}));function Rt(n,e){try{n.innerHTML=""}catch{}const i=n.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
    :host { all: initial; }
    .wrap {
      position: relative;
      min-width: 320px;
      max-width: 90vw;
      min-height: 160px;
      max-height: 80vh;
      background: #ffffff;
      color: #111;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      overflow: auto;
      padding: 12px;
    }
    .hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .ttl { font-weight: 700; font-size: 14px; }
    button {
      border: 1px solid #e2e8f0;
      background: #f7fafc;
      border-radius: 8px;
      padding: 4px 10px;
      cursor: pointer;
      font-size: 12px;
    }
    button:hover { background: #eef2f7; }
    .body { font-size: 13px; line-height: 1.5; color: #374151; }
  `,i.appendChild(t);const o=document.createElement("div");o.className="wrap",o.innerHTML=`
    <div class="hdr">
      <div class="ttl">DesAInR Overlay</div>
      <button id="ovl-close" title="Close">Close</button>
    </div>
    <div class="body">Overlay is mounted. This is a minimal stub implementation.</div>
  `,i.appendChild(o);const r=i.getElementById("ovl-close");return r&&r.addEventListener("click",()=>{try{e&&e()}catch{}}),{detach:()=>{try{n.parentNode&&n.parentNode.removeChild(n)}catch{}}}}const Lt=Object.freeze(Object.defineProperty({__proto__:null,mountOverlay:Rt},Symbol.toStringTag,{value:"Module"}));class Pt{constructor(e=50){ne(this,"history",[]);ne(this,"currentIndex",-1);ne(this,"maxHistorySize",50);ne(this,"listeners",new Set);this.maxHistorySize=e}addAction(e){const i=`undo-${Date.now()}-${Math.random()}`,t={...e,id:i,timestamp:Date.now()};return this.history=this.history.slice(0,this.currentIndex+1),this.history.push(t),this.currentIndex++,this.history.length>this.maxHistorySize&&(this.history=this.history.slice(-this.maxHistorySize),this.currentIndex=this.history.length-1),this.notifyListeners(),i}undo(){if(!this.canUndo())return!1;const i=this.history[this.currentIndex].undo();return i&&(this.currentIndex--,this.notifyListeners()),i}redo(){if(!this.canRedo())return!1;const e=this.history[this.currentIndex+1];if(!e.redo)return!1;const i=e.redo();return i&&(this.currentIndex++,this.notifyListeners()),i}canUndo(){return this.currentIndex>=0}canRedo(){var e;return this.currentIndex<this.history.length-1&&((e=this.history[this.currentIndex+1])==null?void 0:e.redo)!==void 0}getHistory(){return[...this.history]}getRecentActions(e=5){return this.history.slice(Math.max(0,this.currentIndex-e+1),this.currentIndex+1).reverse()}clear(){this.history=[],this.currentIndex=-1,this.notifyListeners()}clearOld(e){const i=Date.now()-e,t=this.history.findIndex(o=>o.timestamp>=i);t>0&&(this.history=this.history.slice(t),this.currentIndex=Math.max(-1,this.currentIndex-t),this.notifyListeners())}subscribe(e){return this.listeners.add(e),e(this.getHistory(),this.canUndo(),this.canRedo()),()=>{this.listeners.delete(e)}}notifyListeners(){const e=this.getHistory(),i=this.canUndo(),t=this.canRedo();this.listeners.forEach(o=>{o(e,i,t)})}}let He=null;function St(){return He||(He=new Pt),He}function $t(n){if(!n)return!1;const e=n.tagName.toLowerCase();return e==="input"||e==="textarea"}async function rt(n){var e;try{if((e=navigator.clipboard)!=null&&e.writeText)return await navigator.clipboard.writeText(n),!0}catch{}try{const i=document.createElement("textarea");i.value=n,i.style.position="fixed",i.style.opacity="0",document.body.appendChild(i),i.focus(),i.select();const t=document.execCommand("copy");return document.body.removeChild(i),t}catch{return!1}}function st(n){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const i=document.activeElement;if($t(i))try{const t=i,o=t.selectionStart??0,r=t.selectionEnd??o,d=t.value??"",w=d.slice(o,r);t.value=d.slice(0,o)+n+d.slice(r);const x=o+n.length;t.selectionStart=t.selectionEnd=x,t.dispatchEvent(new Event("input",{bubbles:!0}));const k={description:`Replace "${w.slice(0,20)}${w.length>20?"...":""}" with "${n.slice(0,20)}${n.length>20?"...":""}"`,undo:()=>{try{return t.value=d,t.selectionStart=o,t.selectionEnd=r,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}},redo:()=>{try{return t.value=d.slice(0,o)+n+d.slice(r),t.selectionStart=t.selectionEnd=o+n.length,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}}};return St().addAction(k),{undo:k.undo}}catch{}try{const t=e.getRangeAt(0),o=t.cloneContents(),r=t.cloneContents(),d=Array.from(r.childNodes).some(k=>k.nodeType!==Node.TEXT_NODE),w=t.endContainer!==t.startContainer;if(d&&w)return null;t.deleteContents();const x=document.createTextNode(n);return t.insertNode(x),t.setStartAfter(x),t.collapse(!0),e.removeAllRanges(),e.addRange(t),{undo:()=>{try{const k=x.parentNode;if(!k)return!1;const I=o.cloneNode(!0);return k.insertBefore(I,x),k.removeChild(x),!0}catch{return!1}}}}catch{return null}}async function It(n){const e=st(n);return e?{outcome:"replaced",undo:e.undo}:await rt(n)?{outcome:"copied"}:{outcome:"failed"}}const lt=Object.freeze(Object.defineProperty({__proto__:null,applyReplacementOrCopyWithUndo:It,copyToClipboard:rt,replaceSelectionSafelyWithUndo:st},Symbol.toStringTag,{value:"Module"}));function ct(n){if(!n)return!1;const e=n.tagName.toLowerCase();if(e==="input"||e==="textarea"){const t=n;return!t.disabled&&!t.readOnly}if(n.getAttribute("contenteditable")==="true")return!0;let i=n.parentElement;for(;i;){if(i.getAttribute("contenteditable")==="true")return!0;i=i.parentElement}return!1}function Nt(){const n=document.activeElement;if(!n||!ct(n))return null;if(n.tagName==="INPUT"||n.tagName==="TEXTAREA"){const e=n,i=e.selectionStart||0,t=e.selectionEnd||0,o=e.value.substring(i,t);if(o)return{element:e,text:o,start:i,end:t}}else if(n.getAttribute("contenteditable")==="true"){const e=window.getSelection();if(e&&e.rangeCount>0){const i=e.toString();if(i)return{element:n,text:i,start:0,end:0}}}return null}function zt(n,e,i,t){if(n.tagName==="INPUT"||n.tagName==="TEXTAREA"?n.value.substring(i,t):n.textContent,n.tagName==="INPUT"||n.tagName==="TEXTAREA"){const o=n,r=o.value;return o.value=o.value.substring(0,i)+e+o.value.substring(t),o.setSelectionRange(i+e.length,i+e.length),o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0})),()=>(o.value=r,o.setSelectionRange(i,t),o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0})),!0)}else if(n.getAttribute("contenteditable")==="true"){const o=window.getSelection(),r=n.innerHTML;if(o&&o.rangeCount>0){const d=o.getRangeAt(0);d.deleteContents();const w=document.createTextNode(e);return d.insertNode(w),d.setStartAfter(w),d.setEndAfter(w),o.removeAllRanges(),o.addRange(d),n.dispatchEvent(new Event("input",{bubbles:!0})),()=>(n.innerHTML=r,n.dispatchEvent(new Event("input",{bubbles:!0})),!0)}}return()=>!1}const Dt=Object.freeze(Object.defineProperty({__proto__:null,getEditableSelection:Nt,isEditableElement:ct,replaceEditableSelection:zt},Symbol.toStringTag,{value:"Module"}));function Ot(){const n=window.getSelection();if(!n||n.rangeCount===0)return null;const i=n.getRangeAt(0).getBoundingClientRect(),t=n.toString();if(!t.trim())return null;const o=i.left+window.scrollX,r=i.top+window.scrollY;return{text:t,rect:i,pageX:o,pageY:r}}const Bt=Object.freeze(Object.defineProperty({__proto__:null,getSelectionInfo:Ot},Symbol.toStringTag,{value:"Module"})),Ht=new Set(["script","style","noscript","template","textarea","input","select","option","code","pre","kbd","samp","var","svg","canvas","math","video","audio"]);function Ft(n){if(!n)return!1;if(n.isContentEditable)return!0;const i=n.getAttribute("contenteditable");return i===""||i==="true"}function Ut(n){if(!n)return!1;const e=n.tagName.toLowerCase();return e==="input"||e==="textarea"||e==="select"||e==="option"}function Vt(n){return!!(!n||Ht.has(n.tagName.toLowerCase())||Ut(n)||Ft(n))}function jt(n){const e=getComputedStyle(n);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0"||n.hidden)return!0;const i=n.getBoundingClientRect();return i.width===0&&i.height===0}function Gt(n){let e=n;for(;e;){if(Vt(e)||jt(e))return!0;e=e.parentElement}return!1}function Kt(n,e=5){const i=[];let t=n,o=0;for(;t&&o<e;){const r=t.tagName.toLowerCase(),d=t.id?`#${t.id}`:"",w=t.className&&typeof t.className=="string"?`.${t.className.trim().split(/\s+/).slice(0,2).join(".")}`:"";i.unshift(`${r}${d}${w}`),t=t.parentElement,o++}return i.join(">")}function Fe(n=document.body){const e=[],i=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,{acceptNode:o=>{if(o.nodeType!==Node.TEXT_NODE)return NodeFilter.FILTER_REJECT;const r=o.data;if(!r||!r.trim())return NodeFilter.FILTER_REJECT;const d=o.parentElement;return!d||d.closest&&d.closest(".desainr-parallel-wrapper")||Gt(d)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let t=i.nextNode();for(;t;){const o=t,r=o.parentElement;e.push({node:o,text:o.data,index:e.length,parent:r,path:Kt(r)}),t=i.nextNode()}return e}function dt(n){return n.map(e=>e.text)}async function Wt(n,e,i){const t=new Array(n.length);let o=0,r=0;return new Promise((d,w)=>{const x=()=>{for(;r<e&&o<n.length;){const k=o++;r++,Promise.resolve(i(n[k],k)).then(I=>{t[k]=I,r--,o>=n.length&&r===0?d(t):x()}).catch(I=>{t[k]=void 0,r--,o>=n.length&&r===0?d(t):x()})}};n.length===0?d(t):x()})}async function qt(n,e=3,i=400){var O;const{translateChunksBatch:t,translateChunks:o}=await D(async()=>{const{translateChunksBatch:E,translateChunks:v}=await Promise.resolve().then(()=>ee);return{translateChunksBatch:E,translateChunks:v}},void 0),r=Fe(),d=r.slice(0,i),w=dt(d);let x=[],k=!1;try{const E=await t({chunks:w,url:location.href,targetLang:n});E.ok&&Array.isArray((O=E.json)==null?void 0:O.results)&&(x=E.json.results??[],k=!0)}catch{}(!k||x.length!==w.length)&&(x=await Wt(w,e,async E=>{var ie;const v=await o({selection:E,url:location.href,targetLang:n});return v.ok&&((ie=v.json)!=null&&ie.result)?v.json.result:E}));let I=0;for(let E=0;E<d.length;E++)try{const v=x[E];typeof v=="string"&&v!==d[E].text&&(d[E].node.data=v,I++)}catch{}return{totalNodes:r.length,translated:I,skipped:d.length-I}}const Yt=Object.freeze(Object.defineProperty({__proto__:null,collectTextNodes:Fe,snapshotTexts:dt,translatePageAll:qt},Symbol.toStringTag,{value:"Module"})),$e="desainr-parallel-wrapper",ut="desainr-parallel-original",pt="desainr-parallel-translated",ht="desainr-parallel-style";let fe=!1,Ie=null;function Xt(){if(document.getElementById(ht))return;const n=document.createElement("style");n.id=ht,n.textContent=`
    .${$e} { display: inline; white-space: pre-wrap; }
    .${ut} { opacity: 0.95; }
    .${pt} { opacity: 0.75; color: #555; margin-left: 0.4em; }
  `,document.documentElement.appendChild(n)}async function Ue(n,e){var o;const{translateChunks:i}=await D(async()=>{const{translateChunks:r}=await Promise.resolve().then(()=>ee);return{translateChunks:r}},void 0),t=await i({selection:n,url:location.href,targetLang:e});return t.ok&&((o=t.json)!=null&&o.result)?t.json.result:n}function ze(n,e){const i=n.parentElement;if(!i||i.closest&&i.closest(`.${$e}`))return;const t=n.data,o=document.createElement("span");o.className=$e,o.dataset.orig=t;const r=document.createElement("span");r.className=ut,r.textContent=t;const d=document.createElement("span");d.className=pt,d.textContent=e,o.appendChild(r),o.appendChild(document.createTextNode(" ")),o.appendChild(d),i.replaceChild(o,n)}function gt(n){return!!n&&n.classList.contains($e)}function Jt(){var e;if(!fe)return;fe=!1,Ie&&(Ie.disconnect(),Ie=null);const n=Array.from(document.querySelectorAll(`.${$e}`));for(const i of n){const t=((e=i.dataset)==null?void 0:e.orig)??"",o=document.createTextNode(t);i.parentNode&&i.parentNode.replaceChild(o,i)}}function Qt(){return fe}async function Zt(n){var w;if(fe)return;fe=!0,Xt();const t=Fe().slice(0,400),{DEFAULT_TARGET_LANG:o}=await D(async()=>{const{DEFAULT_TARGET_LANG:x}=await Promise.resolve().then(()=>Se);return{DEFAULT_TARGET_LANG:x}},void 0),r=n||o;let d=!1;try{const{translateChunksBatch:x}=await D(async()=>{const{translateChunksBatch:E}=await Promise.resolve().then(()=>ee);return{translateChunksBatch:E}},void 0),k=t.map(E=>E.text),I=await x({chunks:k,url:location.href,targetLang:r}),O=(w=I.json)==null?void 0:w.results;if(I.ok&&Array.isArray(O)&&O.length===t.length){for(let E=0;E<t.length;E++)try{ze(t[E].node,O[E])}catch{}d=!0}}catch{}if(!d){let k=0;async function I(){if(!fe)return;const O=k++;if(O>=t.length)return;const E=t[O];try{const v=await Ue(E.text,r);ze(E.node,v)}catch{}await I()}await Promise.all(new Array(3).fill(0).map(()=>I()))}Ie=new MutationObserver(async x=>{if(fe)for(const k of x)if(k.type==="characterData"&&k.target.nodeType===Node.TEXT_NODE){const I=k.target,O=I.parentElement;if(!O||gt(O))continue;const E=I.data;if(E&&E.trim())try{const v=await Ue(E,r);if(!fe)return;ze(I,v)}catch{}}else k.type==="childList"&&k.addedNodes.forEach(async I=>{if(I.nodeType===Node.TEXT_NODE){const O=I,E=O.parentElement;if(!E||gt(E))return;const v=O.data;if(v&&v.trim())try{const ie=await Ue(v,r);if(!fe)return;ze(O,ie)}catch{}}})}),Ie.observe(document.body,{subtree:!0,childList:!0,characterData:!0})}const en=Object.freeze(Object.defineProperty({__proto__:null,disableParallelMode:Jt,enableParallelMode:Zt,isParallelModeEnabled:Qt},Symbol.toStringTag,{value:"Module"}))})();
