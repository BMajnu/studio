var Jt=Object.defineProperty;var Qt=(pe,oe,ye)=>oe in pe?Jt(pe,oe,{enumerable:!0,configurable:!0,writable:!0,value:ye}):pe[oe]=ye;var V=(pe,oe,ye)=>Qt(pe,typeof oe!="symbol"?oe+"":oe,ye);(function(){"use strict";const pe="modulepreload",oe=function(n){return"/"+n},ye={},L=function(e,o,t){let i=Promise.resolve();function s(u){const g=new Event("vite:preloadError",{cancelable:!0});if(g.payload=u,window.dispatchEvent(g),!g.defaultPrevented)throw u}return i.then(u=>{for(const g of u||[])g.status==="rejected"&&s(g.reason);return e().catch(s)})},ct={background:"#0f0f0f",surface:"#1a1a1a",surfaceHover:"#262626",surfaceActive:"#333333",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#ffffff",textSecondary:"#a1a1aa",textMuted:"#71717a",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#262626",borderLight:"#374151",shadow:"rgba(0, 0, 0, 0.8)",shadowLight:"rgba(0, 0, 0, 0.4)"},dt={background:"#ffffff",surface:"#f8fafc",surfaceHover:"#f1f5f9",surfaceActive:"#e2e8f0",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#1e293b",textSecondary:"#475569",textMuted:"#64748b",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#e2e8f0",borderLight:"#cbd5e1",shadow:"rgba(0, 0, 0, 0.15)",shadowLight:"rgba(0, 0, 0, 0.08)"},ut=()=>typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":"dark",Le=()=>ut()==="dark"?ct:dt,r={colors:Le(),updateTheme(){this.colors=Le()},watchThemeChanges(n){typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.updateTheme(),n()})},featureIcons:{refine:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',translate:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 4h2.764L13 9.236 11.618 12z"></path></svg>',rewrite:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',analyze:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',explain:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>',correct:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',expand:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',chatPersonal:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>',chatPro:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',copy:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>',settings:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',customize:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>'},featureCategories:{"Quick Actions":{title:"Quick Actions",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>',description:"Fast access to common tools"},"Content Tools":{title:"Content Tools",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',description:"Text editing and enhancement"},"AI Chat":{title:"AI Chat",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>',description:"AI-powered conversations"},Advanced:{title:"Advanced",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',description:"Advanced features and settings"}},spacing:{xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},borderRadius:{sm:"6px",md:"8px",lg:"12px",xl:"16px",full:"9999px"},typography:{fontFamily:'"Inter", "Segoe UI", system-ui, sans-serif',fontSize:{xs:"12px",sm:"13px",base:"14px",lg:"16px",xl:"18px"},fontWeight:{normal:"400",medium:"500",semibold:"600",bold:"700"},lineHeight:{tight:"1.25",normal:"1.4",relaxed:"1.6"}},animation:{fast:"150ms ease-out",normal:"250ms ease-out",slow:"350ms ease-out"},shadows:{sm:"0 2px 4px rgba(0, 0, 0, 0.4)",md:"0 4px 12px rgba(0, 0, 0, 0.6)",lg:"0 8px 24px rgba(0, 0, 0, 0.8)",glow:"0 0 20px rgba(139, 92, 246, 0.3)"},zIndex:{tooltip:1e3,dropdown:1100,overlay:1200,modal:1300,toast:1400,max:2147483647}},U={summarize:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
  </svg>`},Ce=[{id:"refine",label:"Refine",icon:U.refine,shortcut:"R",isPinned:!0},{id:"translate",label:"Translate",icon:U.translate,shortcut:"T",isPinned:!0},{id:"rephrase",label:"Rephrase",icon:U.rewrite,isPinned:!1},{id:"summarize",label:"Summarize",icon:U.summarize,isPinned:!1},{id:"add-details",label:"Add Details",icon:U.plusCircle,isPinned:!1},{id:"more-informative",label:"More Informative",icon:U.info,isPinned:!1},{id:"simplify",label:"Simplify",icon:U.simplify,isPinned:!1},{id:"emojify",label:"Emojify",icon:U.emoji,isPinned:!1},{id:"analyze",label:"Analyze",icon:U.analyze,shortcut:"A",isPinned:!1},{id:"explain",label:"Explain",icon:U.explain,shortcut:"E",isPinned:!1},{id:"correct",label:"Correct Grammar",icon:U.grammar,shortcut:"C",isPinned:!1},{id:"expand",label:"Expand Text",icon:U.expand,shortcut:"X",isPinned:!1},{id:"designer-chat",label:"Designer",icon:U.chat,shortcut:"D",isPinned:!1},{id:"customize",label:"Customize Actions",icon:U.custom,shortcut:"M",isPinned:!1}];class Ie{constructor(){V(this,"container",null);V(this,"shadowRoot",null);V(this,"actions",Ce);V(this,"onActionClick",null);V(this,"maxPinned",9);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions(),r.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
      position: fixed;
      z-index: ${r.zIndex.max};
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
    `,e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      :host {
        --monica-bg: ${r.colors.background};
        --monica-surface: ${r.colors.surface};
        --monica-surface-hover: ${r.colors.surfaceHover};
        --monica-surface-active: ${r.colors.surfaceActive};
        --monica-primary: ${r.colors.primary};
        --monica-primary-hover: ${r.colors.primaryHover};
        --monica-primary-active: ${r.colors.primaryActive};
        --monica-text-primary: ${r.colors.textPrimary};
        --monica-text-secondary: ${r.colors.textSecondary};
        --monica-text-muted: ${r.colors.textMuted};
        --monica-border: ${r.colors.border};
        --monica-shadow: ${r.colors.shadow};
        --monica-transition: ${r.animation.fast};
        --monica-radius: ${r.borderRadius.md};
      }
      
      .monica-menu {
        position: fixed;
        background: var(--monica-surface);
        color: var(--monica-text-primary);
        font-size: 0.95em;
        border: 1px solid var(--monica-border);
        border-radius: ${r.borderRadius.lg};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        min-width: 260px;
        max-width: 380px;
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden; /* remove bottom scrollbar */
        scrollbar-width: thin; /* Firefox minimal scrollbar */
        scrollbar-color: var(--monica-border) transparent;
        padding: ${r.spacing.sm} 0;
        opacity: 0;
        transform: scale(0.98) translateY(-4px);
        transition: all ${r.animation.fast};
        pointer-events: auto;
        z-index: ${r.zIndex.max};
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
        margin-bottom: ${r.spacing.xs};
      }
      
      .category-header {
        display: flex;
        align-items: center;
        gap: ${r.spacing.xs};
        padding: ${r.spacing.xs} ${r.spacing.sm};
        font-size: ${r.typography.fontSize.xs};
        font-weight: ${r.typography.fontWeight.semibold};
        color: var(--monica-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: ${r.spacing.xs};
      }
      
      .menu-item {
        display: flex;
        align-items: center;
        gap: ${r.spacing.sm};
        padding: ${r.spacing.sm} ${r.spacing.md};
        border-radius: ${r.borderRadius.md};
        cursor: pointer;
        transition: all ${r.animation.fast};
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
        transition: color ${r.animation.fast};
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
        font-weight: ${r.typography.fontWeight.medium};
        line-height: ${r.typography.lineHeight.tight};
        min-width: 0; /* allow flex item to shrink to avoid horizontal overflow */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .item-shortcut {
        font-size: ${r.typography.fontSize.xs};
        color: var(--monica-text-muted);
        font-weight: ${r.typography.fontWeight.normal};
        background: var(--monica-surface-hover);
        padding: 1px 5px;
        border-radius: ${r.borderRadius.sm};
      }

      .menu-item.featured .item-shortcut {
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
      }

      .item-pin {
        margin-left: ${r.spacing.sm};
        color: var(--monica-text-muted);
        background: transparent;
        border: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${r.borderRadius.sm};
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
        transition: opacity ${r.animation.fast};
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
        margin: ${r.spacing.sm} 0;
      }
      
      .menu-footer {
        padding: ${r.spacing.sm} ${r.spacing.lg};
        text-align: center;
        font-size: ${r.typography.fontSize.xs};
        color: var(--monica-text-muted);
        border-top: 1px solid var(--monica-border);
        margin-top: ${r.spacing.sm};
      }
      
      .powered-by {
        opacity: 0.7;
        transition: opacity ${r.animation.fast};
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
        transition: left ${r.animation.normal};
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
          padding: ${r.spacing.sm} ${r.spacing.md};
        }
      }
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const o=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||[];this.actions=this.actions.map(t=>({...t,isPinned:o.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}async savePinnedActions(){var e,o;try{const t=this.actions.filter(i=>i.isPinned).map(i=>i.id).slice(0,this.maxPinned);await chrome.storage.sync.set({"desainr.pinnedActions":t});try{(o=(e=chrome==null?void 0:chrome.runtime)==null?void 0:e.sendMessage)==null||o.call(e,{type:"SAVE_PINNED_ACTIONS",pinnedIds:t})}catch(i){console.warn("Broadcast SAVE_PINNED_ACTIONS failed:",i)}}catch(t){console.warn("Failed to save pinned actions:",t)}}togglePin(e){const o=this.actions.findIndex(i=>i.id===e);if(o===-1)return;const t=this.actions[o];if(t.isPinned)t.isPinned=!1;else{if(this.actions.filter(s=>s.isPinned).length>=this.maxPinned)return;t.isPinned=!0}this.savePinnedActions(),this.refreshMenuUI()}refreshMenuUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-menu");if(!e)return;const o=e.style.left,t=e.style.top;e.remove();const i=this.renderMenu();this.shadowRoot.appendChild(i),i.classList.add("show"),o&&(i.style.left=o),t&&(i.style.top=t)}renderMenu(){const e=document.createElement("div");e.className="monica-menu",this.actions.filter(i=>i.isPinned||!this.actions.some(s=>s.isPinned&&s.id===i.id)).forEach(i=>{const s=document.createElement("div");s.className=`menu-item ${i.isPinned?"pinned":""}`;const u=U.memo;s.innerHTML=`
        <div class="item-icon">${i.icon}</div>
        <div class="item-label">${i.label}</div>
        ${i.shortcut?`<div class="item-shortcut">${i.shortcut}</div>`:""}
        <button class="item-pin" title="${i.isPinned?"Unpin":"Pin"}" aria-label="${i.isPinned?"Unpin":"Pin"}">
          ${u}
        </button>
        <div class="pin-indicator"></div>
      `,s.addEventListener("click",()=>{var p;this.hide(),(p=this.onActionClick)==null||p.call(this,i)});const g=s.querySelector(".item-pin");if(g){g.setAttribute("aria-pressed",i.isPinned?"true":"false");const p=g.querySelector("svg");p&&(i.isPinned?p.classList.add("filled"):p.classList.remove("filled")),g.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),this.togglePin(i.id)})}e.appendChild(s)});const t=document.createElement("div");return t.className="menu-footer",t.innerHTML=`
      <div class="powered-by">Powered by DesAInR ✨</div>
    `,e.appendChild(t),e}show(e,o,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t;const i=this.shadowRoot.querySelector(".monica-menu");i&&i.remove();const s=this.renderMenu();if(this.shadowRoot.appendChild(s),!document.body)return;document.body.appendChild(this.container);const u={width:window.innerWidth,height:window.innerHeight},g=s.getBoundingClientRect();let p=e,h=o;e+g.width>u.width-20&&(p=Math.max(20,e-g.width)),o+g.height>u.height-20&&(h=Math.max(20,o-g.height)),s.style.left=`${p}px`,s.style.top=`${h}px`,requestAnimationFrame(()=>{s.classList.add("show")});const A=P=>{const v=P.target,R=v&&v||null;(!R||!s.contains(R))&&(this.hide(),document.removeEventListener("click",A))};setTimeout(()=>{document.addEventListener("click",A)},100)}hide(){var o;const e=(o=this.shadowRoot)==null?void 0:o.querySelector(".monica-menu");e&&(e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}updateActions(e){this.actions=e}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}const ht=Object.freeze(Object.defineProperty({__proto__:null,DefaultActions:Ce,MonicaStyleContextMenu:Ie},Symbol.toStringTag,{value:"Module"})),Se=["refine","translate","rephrase","summarize"],Ne=Ce.map(n=>({id:n.id,label:n.label.replace(" Selection",""),icon:n.icon,shortcut:n.shortcut,isPinned:n.isPinned,category:n.category}));class pt{constructor(){V(this,"container",null);V(this,"shadowRoot",null);V(this,"actions",Ne);V(this,"onActionClick",null);V(this,"isVisible",!1);V(this,"pinnedIds",Se);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions();try{chrome.runtime.onMessage.addListener(e=>{(e==null?void 0:e.type)==="SAVE_PINNED_ACTIONS"&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}try{chrome.storage.onChanged.addListener((e,o)=>{o==="sync"&&e["desainr.pinnedActions"]&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}r.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
      position: fixed;
      z-index: ${r.zIndex.overlay};
      pointer-events: none;
      top: 0;
      left: 0;
    `,e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      :host {
        --monica-bg: ${r.colors.background};
        --monica-surface: ${r.colors.surface};
        --monica-surface-hover: ${r.colors.surfaceHover};
        --monica-primary: ${r.colors.primary};
        --monica-primary-hover: ${r.colors.primaryHover};
        --monica-text-primary: ${r.colors.textPrimary};
        --monica-text-secondary: ${r.colors.textSecondary};
        --monica-border: ${r.colors.border};
        --monica-shadow: ${r.shadows.lg};
        --monica-radius: ${r.borderRadius.lg};
        --monica-font: ${r.typography.fontFamily};
        --monica-transition: ${r.animation.fast};
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
        font-family: ${r.typography.fontFamily};
        font-size: 11px;
        opacity: 0;
        transform: scale(0.95) translateY(-4px);
        transition: all ${r.animation.fast};
        z-index: ${r.zIndex.overlay};
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
        transition: all ${r.animation.fast};
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
        font-weight: ${r.typography.fontWeight.bold};
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
        transition: all ${r.animation.fast};
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
        padding: ${r.spacing.xs} ${r.spacing.sm};
        border-radius: ${r.borderRadius.sm};
        font-size: ${r.typography.fontSize.xs};
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--monica-transition);
        margin-bottom: ${r.spacing.xs};
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
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const o=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||Se;this.pinnedIds=o.slice(0,9),this.actions=Ne.map(t=>({...t,isPinned:o.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}refreshToolbarUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-toolbar");if(!e)return;const{left:o,top:t}=e.style;e.remove();const i=this.renderToolbar();this.shadowRoot.appendChild(i),i.classList.add("show"),o&&(i.style.left=o),t&&(i.style.top=t)}renderToolbar(){const e=document.createElement("div");e.className="monica-toolbar";const o=this.pinnedIds.map(i=>this.actions.find(s=>s.id===i&&s.isPinned)).filter(i=>!!i).slice(0,10);if(o.forEach((i,s)=>{const u=document.createElement("div");u.className=`toolbar-action ${s===0?"featured":""}`,u.innerHTML=`
        <div class="action-icon">${i.icon}</div>
        <div class="action-label">${i.label}</div>
        <div class="tooltip">${i.label}</div>
      `,u.addEventListener("click",g=>{var p;g.preventDefault(),g.stopPropagation(),(p=this.onActionClick)==null||p.call(this,i)}),e.appendChild(u)}),o.length>0){const i=document.createElement("div");i.className="toolbar-divider",e.appendChild(i)}const t=document.createElement("div");return t.className="more-button",t.innerHTML=`
      <div class="action-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </div>
      <div class="action-label">More</div>
      <div class="tooltip">More actions</div>
    `,t.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const s=t.getBoundingClientRect();this.showContextMenu(s.left,s.bottom)}),e.appendChild(t),e}showContextMenu(e,o){L(async()=>{const{MonicaStyleContextMenu:t}=await Promise.resolve().then(()=>ht);return{MonicaStyleContextMenu:t}},void 0).then(({MonicaStyleContextMenu:t})=>{new t().show(e,o,s=>{var u;(u=this.onActionClick)==null||u.call(this,s)})}).catch(()=>{console.log("More actions menu clicked"),alert("More actions menu - Context menu integration pending")})}show(e,o,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t,this.isVisible=!0;const i=this.shadowRoot.querySelector(".monica-toolbar");i&&i.remove();const s=this.renderToolbar();if(this.shadowRoot.appendChild(s),!document.body)return;document.body.appendChild(this.container);const u={width:window.innerWidth},g=s.getBoundingClientRect();let p=e-g.width/2,h=o-g.height-8;p<10&&(p=10),p+g.width>u.width-10&&(p=u.width-g.width-10),h<10&&(h=o+8),s.style.left=`${p}px`,s.style.top=`${h}px`,requestAnimationFrame(()=>{s.classList.add("show")});const A=P=>{var be;const v=P.target,R=v&&v||null,Y=document.getElementById("desainr-result-popup"),ce=(be=P.composedPath)==null?void 0:be.call(P),j=Y?ce?ce.includes(Y):R?Y.contains(R):!1:!1;(!R||!s.contains(R)&&!j)&&(this.hide(),document.removeEventListener("click",A))};setTimeout(()=>{document.addEventListener("click",A)},100)}hide(){var o;const e=(o=this.shadowRoot)==null?void 0:o.querySelector(".monica-toolbar");e&&(this.isVisible=!1,e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}isShown(){return this.isVisible}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}(()=>{const n="desainr-overlay-root";let e=null,o=null,t=null;(()=>{e||(e=new Ie),o||(o=new pt)})();async function s(c,w){var x,f,z,O,H,G,y,X,J,ie,re,de,ee,Q,q,W,C,E,M,K,B,ae,se,te,ne,ue,le,ke,Qe,Ze,et,tt,nt,ot,it,rt,at,st,lt;try{if(c==="refine"){const _=((x=window.getSelection())==null?void 0:x.toString())||"";if(!_.trim()){h("No text selected","warning");return}const a=(()=>{try{const b=window.getSelection();if(b&&b.rangeCount)return b.getRangeAt(0).getBoundingClientRect()}catch{}return null})();try{await k("Refine",_,"Working…",a||void 0);const b=await((O=(f=chrome.storage)==null?void 0:(z=f.local).get)==null?void 0:O.call(z,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),$=b==null?void 0:b["desainr.settings.modelId"],N=(b==null?void 0:b["desainr.settings.thinkingMode"])||"none",S=b==null?void 0:b["desainr.settings.userApiKey"],{rewrite:D}=await L(async()=>{const{rewrite:$e}=await Promise.resolve().then(()=>F);return{rewrite:$e}},void 0),{ok:l,status:I,json:m,error:he}=await D({selection:_,url:location.href,task:"clarify",modelId:$,thinkingMode:N,userApiKey:S});if(l&&(m!=null&&m.result))await k("Refine",_,m.result,a||void 0);else{const $e=he||(m==null?void 0:m.error)||"unknown";await k("Refine",_,`Failed (${I}): ${$e}`,a||void 0)}}catch(b){await k("Refine",_,`Error: ${(b==null?void 0:b.message)||b}`,a||void 0)}return}const d=((H=window.getSelection())==null?void 0:H.toString())||"",T=(()=>{try{const _=window.getSelection();if(_&&_.rangeCount)return _.getRangeAt(0).getBoundingClientRect()}catch{}return null})();if(c==="translate"){if(!d.trim()){h("No text selected","warning");return}const{translateChunks:_}=await L(async()=>{const{translateChunks:he}=await Promise.resolve().then(()=>F);return{translateChunks:he}},void 0);await k("Translate",d,"Working…",T||void 0);const a=await((X=(G=chrome.storage)==null?void 0:(y=G.local).get)==null?void 0:X.call(y,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=(a==null?void 0:a["desainr.settings.targetLang"])||(await L(async()=>{const{DEFAULT_TARGET_LANG:he}=await Promise.resolve().then(()=>ve);return{DEFAULT_TARGET_LANG:he}},void 0)).DEFAULT_TARGET_LANG,$=a==null?void 0:a["desainr.settings.modelId"],N=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",S=a==null?void 0:a["desainr.settings.userApiKey"],{ok:D,status:l,json:I,error:m}=await _({selection:d,url:location.href,targetLang:b,modelId:$,thinkingMode:N,userApiKey:S});if(D&&(I!=null&&I.result))await k("Translate",d,I.result,T||void 0);else{const he=m||(I==null?void 0:I.error)||"unknown";await k("Translate",d,`Failed (${l}): ${he}`,T||void 0)}}else if(c==="rewrite"){if(!d.trim()){h("No text selected","warning");return}const{rewrite:_}=await L(async()=>{const{rewrite:m}=await Promise.resolve().then(()=>F);return{rewrite:m}},void 0);await k("Rewrite",d,"Working…",T||void 0);const a=await((re=(J=chrome.storage)==null?void 0:(ie=J.local).get)==null?void 0:re.call(ie,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,url:location.href,task:"clarify",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Rewrite",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Rewrite",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="expand"){if(!d.trim()){h("No text selected","warning");return}const{rewrite:_}=await L(async()=>{const{rewrite:m}=await Promise.resolve().then(()=>F);return{rewrite:m}},void 0);await k("Expand",d,"Working…",T||void 0);const a=await((Q=(de=chrome.storage)==null?void 0:(ee=de.local).get)==null?void 0:Q.call(ee,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,url:location.href,task:"expand",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Expand",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Expand",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="correct"){if(!d.trim()){h("No text selected","warning");return}const{rewrite:_}=await L(async()=>{const{rewrite:m}=await Promise.resolve().then(()=>F);return{rewrite:m}},void 0);await k("Correct Grammar",d,"Working…",T||void 0);const a=await((C=(q=chrome.storage)==null?void 0:(W=q.local).get)==null?void 0:C.call(W,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,url:location.href,task:"grammar",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Correct Grammar",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Correct Grammar",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="explain"){if(!d.trim()){h("No text selected","warning");return}const{actions:_}=await L(async()=>{const{actions:m}=await Promise.resolve().then(()=>F);return{actions:m}},void 0);await k("Explain",d,"Working…",T||void 0);const a=await((K=(E=chrome.storage)==null?void 0:(M=E.local).get)==null?void 0:K.call(M,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,clientMessage:d,customInstruction:"Explain this clearly",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Explain",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Explain",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="rephrase"){if(!d.trim()){h("No text selected","warning");return}const{actions:_}=await L(async()=>{const{actions:m}=await Promise.resolve().then(()=>F);return{actions:m}},void 0);await k("Rephrase",d,"Working…",T||void 0);const a=await((se=(B=chrome.storage)==null?void 0:(ae=B.local).get)==null?void 0:se.call(ae,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,clientMessage:d,customInstruction:"Rephrase the following text to be clearer and more natural while preserving meaning. Return only the rephrased text.",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Rephrase",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Rephrase",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="summarize"){if(!d.trim()){h("No text selected","warning");return}const{actions:_}=await L(async()=>{const{actions:m}=await Promise.resolve().then(()=>F);return{actions:m}},void 0);await k("Summarize",d,"Working…",T||void 0);const a=await((ue=(te=chrome.storage)==null?void 0:(ne=te.local).get)==null?void 0:ue.call(ne,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,clientMessage:d,customInstruction:"Summarize the following text concisely in 1-3 sentences. Return only the summary.",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Summarize",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Summarize",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="add-details"){if(!d.trim()){h("No text selected","warning");return}const{actions:_}=await L(async()=>{const{actions:m}=await Promise.resolve().then(()=>F);return{actions:m}},void 0);await k("Add Details",d,"Working…",T||void 0);const a=await((Qe=(le=chrome.storage)==null?void 0:(ke=le.local).get)==null?void 0:Qe.call(ke,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,clientMessage:d,customInstruction:"Add helpful, concrete details to the following text while preserving tone and meaning. Return only the improved text.",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Add Details",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Add Details",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="more-informative"){if(!d.trim()){h("No text selected","warning");return}const{actions:_}=await L(async()=>{const{actions:m}=await Promise.resolve().then(()=>F);return{actions:m}},void 0);await k("More Informative",d,"Working…",T||void 0);const a=await((tt=(Ze=chrome.storage)==null?void 0:(et=Ze.local).get)==null?void 0:tt.call(et,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,clientMessage:d,customInstruction:"Make the following text more informative by adding succinct, factual context. Keep it concise. Return only the revised text.",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("More Informative",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("More Informative",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="simplify"){if(!d.trim()){h("No text selected","warning");return}const{actions:_}=await L(async()=>{const{actions:m}=await Promise.resolve().then(()=>F);return{actions:m}},void 0);await k("Simplify",d,"Working…",T||void 0);const a=await((it=(nt=chrome.storage)==null?void 0:(ot=nt.local).get)==null?void 0:it.call(ot,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,clientMessage:d,customInstruction:"Simplify the following text to be easier to understand, using plain language. Return only the simplified text.",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Simplify",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Simplify",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="emojify"){if(!d.trim()){h("No text selected","warning");return}const{actions:_}=await L(async()=>{const{actions:m}=await Promise.resolve().then(()=>F);return{actions:m}},void 0);await k("Emojify",d,"Working…",T||void 0);const a=await((st=(rt=chrome.storage)==null?void 0:(at=rt.local).get)==null?void 0:st.call(at,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),b=a==null?void 0:a["desainr.settings.modelId"],$=(a==null?void 0:a["desainr.settings.thinkingMode"])||"none",N=a==null?void 0:a["desainr.settings.userApiKey"],{ok:S,status:D,json:l,error:I}=await _({selection:d,clientMessage:d,customInstruction:"Rewrite the following text with a friendly, engaging tone and add relevant emojis where appropriate; do not overuse them. Return only the revised text.",modelId:b,thinkingMode:$,userApiKey:N});if(S&&(l!=null&&l.result))await k("Emojify",d,l.result,T||void 0);else{const m=I||(l==null?void 0:l.error)||"unknown";await k("Emojify",d,`Failed (${D}): ${m}`,T||void 0)}}else if(c==="analyze"){const{analyzePage:_}=await L(async()=>{const{analyzePage:S}=await Promise.resolve().then(()=>F);return{analyzePage:S}},void 0);await k("Analyze",d||"(No selection)","Working…",T||void 0);const{ok:a,status:b,json:$,error:N}=await _({url:location.href,title:document.title});if(a)await k("Analyze",d||"(No selection)",($==null?void 0:$.summary)||"Done",T||void 0);else{const S=N||($==null?void 0:$.error)||"unknown";await k("Analyze",d||"(No selection)",`Failed (${b}): ${S}`,T||void 0)}}else if(c==="designer-chat")be();else if(c==="copy"){const _=((lt=window.getSelection())==null?void 0:lt.toString())||"";_?(navigator.clipboard.writeText(_),h("Text copied to clipboard! 📋","success")):h("No text selected","warning")}else c==="settings"?h("Extension settings coming soon! ⚙️","info"):c==="customize"?h("Custom actions coming soon! 🔧","info"):h(`Unknown action: ${w}`,"warning")}catch(d){h(`Error: ${(d==null?void 0:d.message)||d}`,"error")}}const u=document.getElementById(n);if(u)try{u.style.display="none",u.textContent=""}catch{}function g(){return t&&t.remove(),t=document.createElement("div"),Object.assign(t.style,{position:"fixed",top:"20px",right:"20px",zIndex:r.zIndex.toast,background:r.colors.surface,color:r.colors.textPrimary,border:`1px solid ${r.colors.border}`,borderRadius:r.borderRadius.lg,padding:`${r.spacing.md} ${r.spacing.lg}`,boxShadow:r.shadows.lg,backdropFilter:"blur(12px)",maxWidth:"420px",fontFamily:r.typography.fontFamily,fontSize:r.typography.fontSize.sm,display:"none",opacity:"0",transform:"translateY(-8px) scale(0.95)",transition:`all ${r.animation.fast}`}),document.documentElement.appendChild(t),t}function p(){return g()}function h(c,w="info"){const x=g(),f={info:"💬",success:"✅",error:"❌",warning:"⚠️"},z={info:r.colors.info,success:r.colors.success,error:r.colors.error,warning:r.colors.warning};x.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.md};">
        <div style="font-size: 18px;">${f[w]}</div>
        <div style="flex: 1; line-height: ${r.typography.lineHeight.normal};">${c}</div>
        <div style="width: 4px; height: 40px; background: ${z[w]}; border-radius: 2px; margin-left: ${r.spacing.md};"></div>
      </div>
    `,x.style.display="block",requestAnimationFrame(()=>{x.style.opacity="1",x.style.transform="translateY(0) scale(1)"}),setTimeout(()=>A(),3e3)}function A(){t&&(t.style.opacity="0",t.style.transform="translateY(-8px) scale(0.95)",setTimeout(()=>{t&&(t.style.display="none")},150))}function P(c,w,x=6e3){const f=document.createElement("button");f.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.xs};">
        <span>↶</span>
        <span>Undo</span>
      </div>
    `,Object.assign(f.style,{marginLeft:r.spacing.md,padding:`${r.spacing.xs} ${r.spacing.md}`,background:r.colors.primary,color:"white",border:"none",borderRadius:r.borderRadius.md,cursor:"pointer",fontSize:r.typography.fontSize.sm,fontWeight:r.typography.fontWeight.medium,transition:`all ${r.animation.fast}`,fontFamily:r.typography.fontFamily}),f.onmouseenter=()=>{f.style.background=r.colors.primaryHover,f.style.transform="translateY(-1px)"},f.onmouseleave=()=>{f.style.background=r.colors.primary,f.style.transform="translateY(0)"};const z=()=>{try{const O=w();h(O?"Undone successfully! ✓":"Undo failed",O?"success":"error")}catch{h("Undo failed","error")}finally{f.remove(),setTimeout(()=>A(),800)}};f.addEventListener("click",z,{once:!0}),c.appendChild(f),setTimeout(()=>{try{f.remove()}catch{}},x)}function v(c,w,x=12e3){const f=document.createElement("button");f.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.xs};">
        <span>📋</span>
        <span>Copy</span>
      </div>
    `,Object.assign(f.style,{marginLeft:r.spacing.md,padding:`${r.spacing.xs} ${r.spacing.md}`,background:r.colors.surface,color:r.colors.textPrimary,border:`1px solid ${r.colors.border}`,borderRadius:r.borderRadius.md,cursor:"pointer",fontSize:r.typography.fontSize.sm,fontWeight:r.typography.fontWeight.medium,transition:`all ${r.animation.fast}`,fontFamily:r.typography.fontFamily}),f.onmouseenter=()=>{f.style.background=r.colors.surfaceHover,f.style.borderColor=r.colors.primary,f.style.transform="translateY(-1px)"},f.onmouseleave=()=>{f.style.background=r.colors.surface,f.style.borderColor=r.colors.border,f.style.transform="translateY(0)"};const z=async()=>{try{await navigator.clipboard.writeText(w),h("Copied to clipboard! ✓","success")}catch{h("Copy failed","error")}finally{f.remove(),setTimeout(()=>A(),800)}};f.addEventListener("click",z,{once:!0}),c.appendChild(f),setTimeout(()=>{try{f.remove()}catch{}},x)}function R(c){return c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Y(c,w){const x=R(String(w.summary||"Analysis complete")),f=Array.isArray(w.keyPoints)?w.keyPoints:[],z=Array.isArray(w.links)?w.links:[],O=f.length?`<ul style="margin:6px 0 8px 18px; padding:0;">${f.map(y=>`<li style="margin:2px 0;">${R(y)}</li>`).join("")}</ul>`:"",H=z.length?`<div style="margin-top:6px; max-height:160px; overflow:auto;"><div style="font-weight:600; margin-bottom:4px;">Top links</div>${z.slice(0,10).map(y=>`<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><a href="${R(y)}" target="_blank" rel="noopener noreferrer">${R(y)}</a></div>`).join("")}</div>`:"";c.innerHTML=`<div style="font-size:13px; line-height:1.35;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-weight:700;">Analysis</div>
        <button id="desainr-close-overlay" style="border:1px solid #ddd; border-radius:6px; padding:2px 6px; background:#f7f7f7; cursor:pointer;">Close</button>
      </div>
      <div style="margin-top:6px;">${x}</div>
      ${O}
      ${H}
    </div>`;const G=c.querySelector("#desainr-close-overlay");G&&(G.onclick=()=>{c.style.display="none"})}let ce=null,j=null;async function be(){if(j){try{j.detach()}catch{}j=null,ce=null;return}const c=document.createElement("div");c.id="desainr-overlay-react-root",Object.assign(c.style,{position:"fixed",top:"20px",right:"20px",zIndex:1e6}),document.documentElement.appendChild(c);try{j=(await L(()=>Promise.resolve().then(()=>At),void 0)).mountOverlay(c,()=>{try{j==null||j.detach()}catch{}j=null,ce=null}),ce=c}catch(w){const x=p();x.style.display="block",x.textContent=`Overlay failed: ${(w==null?void 0:w.message)||w}`,setTimeout(()=>A(),1500)}}let Wt=0,Re=null,Ae=null;function jt(){if(Re)return Re;const c=document.createElement("div");c.id="desainr-result-popup",Object.assign(c.style,{position:"fixed",zIndex:1e6,top:"0px",left:"0px",display:"none"}),Ae=c.attachShadow({mode:"open"});const w=document.createElement("style");w.textContent=`
      :host { all: initial; }
      .popup { min-width: 520px; max-width: 720px; max-height: 520px; overflow: auto;
        background: #fff; color: #111; border: 1px solid #e6e6e6; border-radius: 12px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.2); font-family: Segoe UI, Arial, sans-serif;
      }
      .hdr { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid #efefef; }
      .ttl { font-weight: 700; font-size: 14px; }
      .body { padding: 12px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
      .panel { display:flex; flex-direction:column; gap:8px; }
      .ph { font-weight: 600; color:#333; font-size: 12px; }
      .orig { color:#444; background:#fafafa; border:1px solid #f0f0f0; border-radius:8px; padding:8px; }
      .res { background:#fff; border:1px solid #eee; border-radius:8px; padding:8px; }
      .ftr { display:flex; justify-content:flex-end; gap:8px; padding:10px 12px; border-top:1px solid #efefef; }
      button { border:1px solid #ddd; border-radius:8px; padding:6px 10px; background:#f7f7f7; cursor:pointer; }
      button.primary { background:#6f6cff; color:#fff; border-color:#6f6cff; }
      button:hover { filter: brightness(0.97); }
    `,Ae.appendChild(w);const x=document.createElement("div");return x.className="popup",x.innerHTML=`<div class="hdr"><div class="ttl">Refine Result</div><button id="close">✕</button></div>
      <div class="body">
        <div class="panel">
          <div class="ph">Original Text</div>
          <div class="orig" id="orig"></div>
        </div>
        <div class="panel">
          <div class="ph">Refined Text</div>
          <div class="res" id="res"></div>
        </div>
      </div>
      <div class="ftr">
        <button id="copy">Copy</button>
        <button id="cancel">Cancel</button>
        <button id="replace" class="primary">Replace</button>
      </div>`,Ae.appendChild(x),document.documentElement.appendChild(c),Re=c,c}async function k(c,w,x,f){const z=jt(),O=Ae;if(!O){try{console.warn("DesAInR: popupShadow not available")}catch{}return}const H=O.querySelector(".ttl"),G=O.getElementById("orig"),y=O.getElementById("res"),X=O.getElementById("close"),J=O.getElementById("cancel"),ie=O.getElementById("copy"),re=O.getElementById("replace");H&&(H.textContent=c),G&&(G.textContent=w),y&&(y.textContent=x);function de(){let Q=0,q=0;const W=10,C=f||new DOMRect(window.innerWidth/2-200,80,400,0),E=z.getBoundingClientRect();Q=Math.min(Math.max(W,C.left),window.innerWidth-E.width-W),q=Math.min(Math.max(W,C.top+C.height+W),window.innerHeight-E.height-W),z.style.left=`${Math.round(Q)}px`,z.style.top=`${Math.round(q)}px`}z.style.display="block",requestAnimationFrame(()=>de());const ee=()=>{z.style.display="none"};X&&(X.onclick=()=>ee()),J&&(J.onclick=()=>ee()),ie&&(ie.onclick=async()=>{try{await navigator.clipboard.writeText(x)}catch{}}),re&&(re.onclick=async()=>{const{applyReplacementOrCopyWithUndo:Q}=await L(async()=>{const{applyReplacementOrCopyWithUndo:E}=await Promise.resolve().then(()=>We);return{applyReplacementOrCopyWithUndo:E}},void 0),{outcome:q,undo:W}=await Q(x),C=p();q==="replaced"?(C.textContent="Replaced ✓",W&&P(C,W)):q==="copied"?(C.textContent="Copied ✓",v(C,x)):C.textContent="Done",C.style.display="block",setTimeout(()=>A(),900),ee()})}async function qt(){const w=(await L(()=>Promise.resolve().then(()=>Pt),void 0)).getSelectionInfo();if(!w){Pe();return}if(w.text,w.rect,o){const x=w.rect,f=x.left+x.width/2,z=x.top-8;o.show(f,z,O=>{s(O.id,O.label)})}}function Pe(){if(o)try{o.hide()}catch(c){console.warn("Error hiding Monica toolbar:",c)}}document.addEventListener("keydown",c=>{if(c.key==="Escape"&&(Pe(),j)){try{j.detach()}catch{}j=null,ce=null}}),document.addEventListener("selectionchange",()=>{var w;if(Date.now()<Wt)return;(((w=window.getSelection())==null?void 0:w.toString())||"").trim()||Pe()}),document.addEventListener("mousedown",c=>{},!0);function Yt(c=4e3){return new Promise(w=>{let x=!1;const f=H=>{window.removeEventListener("message",z),H&&clearTimeout(H)},z=H=>{if(H.source!==window)return;const G=H.data;if(!G||G.type!=="DESAINR_WEBAPP_TOKEN"||x)return;x=!0,f();const{ok:y,idToken:X,error:J}=G||{};w({ok:!!y,idToken:X,error:J||(y?void 0:"no_token")})};window.addEventListener("message",z);const O=window.setTimeout(()=>{x||(x=!0,f(),w({ok:!1,error:"timeout"}))},c);try{window.postMessage({type:"DESAINR_EXTENSION_GET_TOKEN",from:"desainr-extension"},window.origin)}catch{x=!0,f(O),w({ok:!1,error:"post_message_failed"})}})}chrome.runtime.onMessage.addListener((c,w,x)=>{if((c==null?void 0:c.type)==="TOGGLE_OVERLAY"&&be(),(c==null?void 0:c.type)==="CONTEXT_MENU"&&Xt(c.id,c.info),(c==null?void 0:c.type)==="DESAINR_GET_WEBAPP_ID_TOKEN")return Yt().then(f=>x(f)),!0}),document.addEventListener("mouseup",()=>{setTimeout(()=>{qt().catch(()=>{})},100)}),document.addEventListener("contextmenu",c=>{const w=window.getSelection();w&&w.toString().trim()&&(c.preventDefault(),e&&e.show(c.pageX,c.pageY,x=>{s(x.id,x.label)}))});async function Xt(c,w){var X,J,ie,re,de,ee,Q,q,W;const{rewrite:x,translateChunks:f,analyzePage:z,saveMemo:O}=await L(async()=>{const{rewrite:C,translateChunks:E,analyzePage:M,saveMemo:K}=await Promise.resolve().then(()=>F);return{rewrite:C,translateChunks:E,analyzePage:M,saveMemo:K}},void 0),{DEFAULT_TARGET_LANG:H}=await L(async()=>{const{DEFAULT_TARGET_LANG:C}=await Promise.resolve().then(()=>ve);return{DEFAULT_TARGET_LANG:C}},void 0),{applyReplacementOrCopyWithUndo:G}=await L(async()=>{const{applyReplacementOrCopyWithUndo:C}=await Promise.resolve().then(()=>We);return{applyReplacementOrCopyWithUndo:C}},void 0),y=p();y.style.display="block";try{if(c==="desainr-refine"){y.textContent="Refining selection...";const C=((X=window.getSelection())==null?void 0:X.toString())||"",E=await((re=(J=chrome.storage)==null?void 0:(ie=J.local).get)==null?void 0:re.call(ie,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=E==null?void 0:E["desainr.settings.modelId"],K=(E==null?void 0:E["desainr.settings.thinkingMode"])||"none",B=E==null?void 0:E["desainr.settings.userApiKey"],{ok:ae,status:se,json:te,error:ne}=await x({selection:C,url:location.href,task:"clarify",modelId:M,thinkingMode:K,userApiKey:B});if(ae&&(te!=null&&te.result)){const{outcome:ue,undo:le}=await G(te.result);ue==="replaced"?(y.textContent="Refined ✓ (replaced selection)",le&&P(y,le)):ue==="copied"?y.textContent="Refined ✓ (copied)":y.textContent="Refined ✓"}else y.textContent=`Refine failed (${se}): ${ne||"unknown"}`}else if(c==="desainr-translate"){y.textContent="Translating selection...";const C=((de=window.getSelection())==null?void 0:de.toString())||"",E=await((q=(ee=chrome.storage)==null?void 0:(Q=ee.local).get)==null?void 0:q.call(Q,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=(E==null?void 0:E["desainr.settings.targetLang"])||H,K=E==null?void 0:E["desainr.settings.modelId"],B=(E==null?void 0:E["desainr.settings.thinkingMode"])||"none",ae=E==null?void 0:E["desainr.settings.userApiKey"],{ok:se,status:te,json:ne,error:ue}=await f({selection:C,url:location.href,targetLang:M,modelId:K,thinkingMode:B,userApiKey:ae});if(se&&(ne!=null&&ne.result)){const{outcome:le,undo:ke}=await G(ne.result);le==="replaced"?(y.textContent="Translated ✓ (replaced selection)",ke&&P(y,ke)):le==="copied"?y.textContent="Translated ✓ (copied)":y.textContent="Translated ✓"}else y.textContent=`Translate failed (${te}): ${ue||"unknown"}`}else if(c==="desainr-save-memo"){y.textContent="Saving to memo...";const C=((W=window.getSelection())==null?void 0:W.toString())||"";if(!C)y.textContent="No text selected";else{const E={title:`Selection from ${document.title||location.hostname}`,content:C,url:location.href,type:"selection",metadata:{pageTitle:document.title,timestamp:new Date().toISOString()},tags:["selection","extension"]},{ok:M,json:K,error:B}=await O(E);M&&K?y.textContent=`✓ Saved to memo (ID: ${K.memoId})`:y.textContent=`Save to memo failed: ${B||"unknown"}`}}else if(c==="desainr-analyze"){y.textContent="Analyzing page...";const{ok:C,status:E,json:M,error:K}=await z({url:location.href,title:document.title});C?Y(y,{summary:M==null?void 0:M.summary,keyPoints:M==null?void 0:M.keyPoints,links:M==null?void 0:M.links}):y.textContent=`Analyze failed (${E}): ${K||"unknown"}`}else if(c==="desainr-translate-page"){y.textContent="Translating page...";const{translatePageAll:C}=await L(async()=>{const{translatePageAll:M}=await Promise.resolve().then(()=>Bt);return{translatePageAll:M}},void 0),{DEFAULT_TARGET_LANG:E}=await L(async()=>{const{DEFAULT_TARGET_LANG:M}=await Promise.resolve().then(()=>ve);return{DEFAULT_TARGET_LANG:M}},void 0);try{const M=await C(E);y.textContent=`Translated page ✓ (${M.translated}/${M.totalNodes} nodes, skipped ${M.skipped})`}catch(M){y.textContent=`Translate page error: ${(M==null?void 0:M.message)||M}`}}else if(c==="desainr-toggle-parallel"){const{isParallelModeEnabled:C,enableParallelMode:E,disableParallelMode:M}=await L(async()=>{const{isParallelModeEnabled:B,enableParallelMode:ae,disableParallelMode:se}=await Promise.resolve().then(()=>Kt);return{isParallelModeEnabled:B,enableParallelMode:ae,disableParallelMode:se}},void 0),{DEFAULT_TARGET_LANG:K}=await L(async()=>{const{DEFAULT_TARGET_LANG:B}=await Promise.resolve().then(()=>ve);return{DEFAULT_TARGET_LANG:B}},void 0);try{C()?(y.textContent="Disabling parallel translate...",M(),y.textContent="Parallel translate OFF"):(y.textContent="Enabling parallel translate...",await E(K),y.textContent="Parallel translate ON")}catch(B){y.textContent=`Parallel toggle error: ${(B==null?void 0:B.message)||B}`}}else y.textContent=`Unknown action: ${c}`}catch(C){y.textContent=`Error: ${(C==null?void 0:C.message)||C}`}finally{setTimeout(()=>{try{A()}catch{}},800)}}})();const me={rewrite:{maxTokens:20,refillRate:.5,costPerCall:1},"translate-chunks":{maxTokens:30,refillRate:1,costPerCall:1},"analyze-page":{maxTokens:10,refillRate:.2,costPerCall:1},chat:{maxTokens:30,refillRate:.5,costPerCall:1},actions:{maxTokens:20,refillRate:.5,costPerCall:1},"memo/save":{maxTokens:50,refillRate:1,costPerCall:1},"slash-prompts":{maxTokens:10,refillRate:.5,costPerCall:1},default:{maxTokens:20,refillRate:.5,costPerCall:1}},ze="rateLimiter_";function Oe(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function De(n){var t;const e=`${ze}${n}`,o=me[n]||me.default;if(Oe())return new Promise(i=>{chrome.storage.local.get(e,s=>{const u=s[e];u&&u.tokens!==void 0&&u.lastRefill!==void 0?i(u):i({tokens:o.maxTokens,lastRefill:Date.now()})})});try{const i=(t=globalThis==null?void 0:globalThis.localStorage)==null?void 0:t.getItem(e);if(i){const s=JSON.parse(i);if(s&&s.tokens!==void 0&&s.lastRefill!==void 0)return s}}catch{}return{tokens:o.maxTokens,lastRefill:Date.now()}}async function Fe(n,e){var t;const o=`${ze}${n}`;if(Oe())return new Promise(i=>{chrome.storage.local.set({[o]:e},i)});try{(t=globalThis==null?void 0:globalThis.localStorage)==null||t.setItem(o,JSON.stringify(e))}catch{}}function Be(n,e){const o=Date.now(),i=(o-n.lastRefill)/1e3*e.refillRate;return{tokens:Math.min(n.tokens+i,e.maxTokens),lastRefill:o}}async function mt(n){const e=me[n]||me.default;let o=await De(n);return o=Be(o,e),o.tokens<e.costPerCall?(await Fe(n,o),!1):(o.tokens-=e.costPerCall,await Fe(n,o),!0)}async function ft(n){const e=me[n]||me.default;let o=await De(n);o=Be(o,e);const t=Math.max(0,e.costPerCall-o.tokens),i=t>0?t/e.refillRate:0;return{remainingTokens:Math.floor(o.tokens),maxTokens:e.maxTokens,timeUntilRefill:Math.ceil(i),canMakeCall:o.tokens>=e.costPerCall}}async function fe(n,e){if(!await mt(n)){const i=(await ft(n)).timeUntilRefill;return{ok:!1,status:429,error:`Rate limit exceeded. Please wait ${i} second${i!==1?"s":""} before trying again.`}}return new Promise(t=>{chrome.runtime.sendMessage({type:"API_CALL",path:n,body:e},i=>{if(!i)return t({ok:!1,status:0,error:"No response from background"});t(i)})})}function Ve(n,e,o){const t=`${e&&(e.error||(e.message??""))||""} ${o||""}`.toLowerCase(),i=["quota","exhausted","insufficient","rate limit","resource has been exhausted","insufficient_quota","429","capacity"];return!!(n===429||n>=500&&i.some(s=>t.includes(s)))}function Ue(n,e,o){const t=`${e&&(e.error||(e.message??""))||""} ${o||""}`.toLowerCase();return n===401||n===403?!0:["invalid api key","api key not valid","key invalid","missing api key","no api key","invalid authentication","unauthorized","forbidden","permission denied"].some(s=>t.includes(s))}function He(n,e,o){const t=`${e&&(e.error||(e.message??""))||""} ${o||""}`.toLowerCase();return["billing","access not configured","permission not configured","project has been blocked","enable billing"].some(s=>t.includes(s))}function gt(n,e,o){if(Ue(n,e,o))return"Invalid or unauthorized API key. Update your Gemini API key in Settings or sign in again.";if(He(n,e,o))return"Billing or API access is not configured for this key/project. Enable billing in Google AI Studio or use another API key.";if(Ve(n,e,o))return"AI capacity exhausted right now. Please try again in a bit, or switch the model/API key in settings.";if(n===401||n===403)return"Unauthorized. Please sign in again.";if(n===429)return"Too many requests. Please slow down and try again shortly.";if(n>=500)return"Server error. Please try again shortly."}async function ge(n,e=3,o=100){let t;for(let i=0;i<e;i++){let s=await n();if(s.ok)return s;const u=gt(s.status,s.json,s.error);u&&(s={...s,error:u}),t=s;const g=!s.status||s.status===0||s.status>=500,p=Ve(s.status,s.json,s.error),h=Ue(s.status,s.json,s.error),A=He(s.status,s.json,s.error);if(!g||p||h||A||s.status===401||s.status===403||s.status===400)break;await new Promise(P=>setTimeout(P,o*Math.pow(2,i)))}return t??{ok:!1,status:0,error:"Unknown error"}}async function yt(n){return ge(()=>fe("rewrite",n))}async function vt(n){return ge(()=>fe("translate-chunks",n))}async function wt(n){return ge(()=>fe("translate-chunks",n))}async function xt(n){return ge(()=>fe("analyze-page",n))}async function bt(n){return ge(()=>fe("actions",n))}async function kt(n){return ge(()=>fe("memo/save",n))}const F=Object.freeze(Object.defineProperty({__proto__:null,actions:bt,analyzePage:xt,rewrite:yt,saveMemo:kt,translateChunks:vt,translateChunksBatch:wt},Symbol.toStringTag,{value:"Module"})),ve=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_TARGET_LANG:"en"},Symbol.toStringTag,{value:"Module"}));function Et(n,e){try{n.innerHTML=""}catch{}const o=n.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
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
  `,o.appendChild(t);const i=document.createElement("div");i.className="wrap",i.innerHTML=`
    <div class="hdr">
      <div class="ttl">DesAInR Overlay</div>
      <button id="ovl-close" title="Close">Close</button>
    </div>
    <div class="body">Overlay is mounted. This is a minimal stub implementation.</div>
  `,o.appendChild(i);const s=o.getElementById("ovl-close");return s&&s.addEventListener("click",()=>{try{e&&e()}catch{}}),{detach:()=>{try{n.parentNode&&n.parentNode.removeChild(n)}catch{}}}}const At=Object.freeze(Object.defineProperty({__proto__:null,mountOverlay:Et},Symbol.toStringTag,{value:"Module"}));class Ct{constructor(e=50){V(this,"history",[]);V(this,"currentIndex",-1);V(this,"maxHistorySize",50);V(this,"listeners",new Set);this.maxHistorySize=e}addAction(e){const o=`undo-${Date.now()}-${Math.random()}`,t={...e,id:o,timestamp:Date.now()};return this.history=this.history.slice(0,this.currentIndex+1),this.history.push(t),this.currentIndex++,this.history.length>this.maxHistorySize&&(this.history=this.history.slice(-this.maxHistorySize),this.currentIndex=this.history.length-1),this.notifyListeners(),o}undo(){if(!this.canUndo())return!1;const o=this.history[this.currentIndex].undo();return o&&(this.currentIndex--,this.notifyListeners()),o}redo(){if(!this.canRedo())return!1;const e=this.history[this.currentIndex+1];if(!e.redo)return!1;const o=e.redo();return o&&(this.currentIndex++,this.notifyListeners()),o}canUndo(){return this.currentIndex>=0}canRedo(){var e;return this.currentIndex<this.history.length-1&&((e=this.history[this.currentIndex+1])==null?void 0:e.redo)!==void 0}getHistory(){return[...this.history]}getRecentActions(e=5){return this.history.slice(Math.max(0,this.currentIndex-e+1),this.currentIndex+1).reverse()}clear(){this.history=[],this.currentIndex=-1,this.notifyListeners()}clearOld(e){const o=Date.now()-e,t=this.history.findIndex(i=>i.timestamp>=o);t>0&&(this.history=this.history.slice(t),this.currentIndex=Math.max(-1,this.currentIndex-t),this.notifyListeners())}subscribe(e){return this.listeners.add(e),e(this.getHistory(),this.canUndo(),this.canRedo()),()=>{this.listeners.delete(e)}}notifyListeners(){const e=this.getHistory(),o=this.canUndo(),t=this.canRedo();this.listeners.forEach(i=>{i(e,o,t)})}}let _e=null;function _t(){return _e||(_e=new Ct),_e}function Tt(n){if(!n)return!1;const e=n.tagName.toLowerCase();return e==="input"||e==="textarea"}async function Ge(n){var e;try{if((e=navigator.clipboard)!=null&&e.writeText)return await navigator.clipboard.writeText(n),!0}catch{}try{const o=document.createElement("textarea");o.value=n,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.focus(),o.select();const t=document.execCommand("copy");return document.body.removeChild(o),t}catch{return!1}}function Ke(n){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const o=document.activeElement;if(Tt(o))try{const t=o,i=t.selectionStart??0,s=t.selectionEnd??i,u=t.value??"",g=u.slice(i,s);t.value=u.slice(0,i)+n+u.slice(s);const p=i+n.length;t.selectionStart=t.selectionEnd=p,t.dispatchEvent(new Event("input",{bubbles:!0}));const h={description:`Replace "${g.slice(0,20)}${g.length>20?"...":""}" with "${n.slice(0,20)}${n.length>20?"...":""}"`,undo:()=>{try{return t.value=u,t.selectionStart=i,t.selectionEnd=s,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}},redo:()=>{try{return t.value=u.slice(0,i)+n+u.slice(s),t.selectionStart=t.selectionEnd=i+n.length,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}}};return _t().addAction(h),{undo:h.undo}}catch{}try{const t=e.getRangeAt(0),i=t.cloneContents(),s=t.cloneContents(),u=Array.from(s.childNodes).some(h=>h.nodeType!==Node.TEXT_NODE),g=t.endContainer!==t.startContainer;if(u&&g)return null;t.deleteContents();const p=document.createTextNode(n);return t.insertNode(p),t.setStartAfter(p),t.collapse(!0),e.removeAllRanges(),e.addRange(t),{undo:()=>{try{const h=p.parentNode;if(!h)return!1;const A=i.cloneNode(!0);return h.insertBefore(A,p),h.removeChild(p),!0}catch{return!1}}}}catch{return null}}async function Mt(n){const e=Ke(n);return e?{outcome:"replaced",undo:e.undo}:await Ge(n)?{outcome:"copied"}:{outcome:"failed"}}const We=Object.freeze(Object.defineProperty({__proto__:null,applyReplacementOrCopyWithUndo:Mt,copyToClipboard:Ge,replaceSelectionSafelyWithUndo:Ke},Symbol.toStringTag,{value:"Module"}));function Rt(){const n=window.getSelection();if(!n||n.rangeCount===0)return null;const o=n.getRangeAt(0).getBoundingClientRect(),t=n.toString();if(!t.trim())return null;const i=o.left+window.scrollX,s=o.top+window.scrollY;return{text:t,rect:o,pageX:i,pageY:s}}const Pt=Object.freeze(Object.defineProperty({__proto__:null,getSelectionInfo:Rt},Symbol.toStringTag,{value:"Module"})),$t=new Set(["script","style","noscript","template","textarea","input","select","option","code","pre","kbd","samp","var","svg","canvas","math","video","audio"]);function Lt(n){if(!n)return!1;if(n.isContentEditable)return!0;const o=n.getAttribute("contenteditable");return o===""||o==="true"}function It(n){if(!n)return!1;const e=n.tagName.toLowerCase();return e==="input"||e==="textarea"||e==="select"||e==="option"}function St(n){return!!(!n||$t.has(n.tagName.toLowerCase())||It(n)||Lt(n))}function Nt(n){const e=getComputedStyle(n);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0"||n.hidden)return!0;const o=n.getBoundingClientRect();return o.width===0&&o.height===0}function zt(n){let e=n;for(;e;){if(St(e)||Nt(e))return!0;e=e.parentElement}return!1}function Ot(n,e=5){const o=[];let t=n,i=0;for(;t&&i<e;){const s=t.tagName.toLowerCase(),u=t.id?`#${t.id}`:"",g=t.className&&typeof t.className=="string"?`.${t.className.trim().split(/\s+/).slice(0,2).join(".")}`:"";o.unshift(`${s}${u}${g}`),t=t.parentElement,i++}return o.join(">")}function Te(n=document.body){const e=[],o=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,{acceptNode:i=>{if(i.nodeType!==Node.TEXT_NODE)return NodeFilter.FILTER_REJECT;const s=i.data;if(!s||!s.trim())return NodeFilter.FILTER_REJECT;const u=i.parentElement;return!u||u.closest&&u.closest(".desainr-parallel-wrapper")||zt(u)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let t=o.nextNode();for(;t;){const i=t,s=i.parentElement;e.push({node:i,text:i.data,index:e.length,parent:s,path:Ot(s)}),t=o.nextNode()}return e}function je(n){return n.map(e=>e.text)}async function Dt(n,e,o){const t=new Array(n.length);let i=0,s=0;return new Promise((u,g)=>{const p=()=>{for(;s<e&&i<n.length;){const h=i++;s++,Promise.resolve(o(n[h],h)).then(A=>{t[h]=A,s--,i>=n.length&&s===0?u(t):p()}).catch(A=>{t[h]=void 0,s--,i>=n.length&&s===0?u(t):p()})}};n.length===0?u(t):p()})}async function Ft(n,e=3,o=400){var P;const{translateChunksBatch:t,translateChunks:i}=await L(async()=>{const{translateChunksBatch:v,translateChunks:R}=await Promise.resolve().then(()=>F);return{translateChunksBatch:v,translateChunks:R}},void 0),s=Te(),u=s.slice(0,o),g=je(u);let p=[],h=!1;try{const v=await t({chunks:g,url:location.href,targetLang:n});v.ok&&Array.isArray((P=v.json)==null?void 0:P.results)&&(p=v.json.results??[],h=!0)}catch{}(!h||p.length!==g.length)&&(p=await Dt(g,e,async v=>{var Y;const R=await i({selection:v,url:location.href,targetLang:n});return R.ok&&((Y=R.json)!=null&&Y.result)?R.json.result:v}));let A=0;for(let v=0;v<u.length;v++)try{const R=p[v];typeof R=="string"&&R!==u[v].text&&(u[v].node.data=R,A++)}catch{}return{totalNodes:s.length,translated:A,skipped:u.length-A}}const Bt=Object.freeze(Object.defineProperty({__proto__:null,collectTextNodes:Te,snapshotTexts:je,translatePageAll:Ft},Symbol.toStringTag,{value:"Module"})),we="desainr-parallel-wrapper",qe="desainr-parallel-original",Ye="desainr-parallel-translated",Xe="desainr-parallel-style";let Z=!1,xe=null;function Vt(){if(document.getElementById(Xe))return;const n=document.createElement("style");n.id=Xe,n.textContent=`
    .${we} { display: inline; white-space: pre-wrap; }
    .${qe} { opacity: 0.95; }
    .${Ye} { opacity: 0.75; color: #555; margin-left: 0.4em; }
  `,document.documentElement.appendChild(n)}async function Me(n,e){var i;const{translateChunks:o}=await L(async()=>{const{translateChunks:s}=await Promise.resolve().then(()=>F);return{translateChunks:s}},void 0),t=await o({selection:n,url:location.href,targetLang:e});return t.ok&&((i=t.json)!=null&&i.result)?t.json.result:n}function Ee(n,e){const o=n.parentElement;if(!o||o.closest&&o.closest(`.${we}`))return;const t=n.data,i=document.createElement("span");i.className=we,i.dataset.orig=t;const s=document.createElement("span");s.className=qe,s.textContent=t;const u=document.createElement("span");u.className=Ye,u.textContent=e,i.appendChild(s),i.appendChild(document.createTextNode(" ")),i.appendChild(u),o.replaceChild(i,n)}function Je(n){return!!n&&n.classList.contains(we)}function Ut(){var e;if(!Z)return;Z=!1,xe&&(xe.disconnect(),xe=null);const n=Array.from(document.querySelectorAll(`.${we}`));for(const o of n){const t=((e=o.dataset)==null?void 0:e.orig)??"",i=document.createTextNode(t);o.parentNode&&o.parentNode.replaceChild(i,o)}}function Ht(){return Z}async function Gt(n){var g;if(Z)return;Z=!0,Vt();const t=Te().slice(0,400),{DEFAULT_TARGET_LANG:i}=await L(async()=>{const{DEFAULT_TARGET_LANG:p}=await Promise.resolve().then(()=>ve);return{DEFAULT_TARGET_LANG:p}},void 0),s=n||i;let u=!1;try{const{translateChunksBatch:p}=await L(async()=>{const{translateChunksBatch:v}=await Promise.resolve().then(()=>F);return{translateChunksBatch:v}},void 0),h=t.map(v=>v.text),A=await p({chunks:h,url:location.href,targetLang:s}),P=(g=A.json)==null?void 0:g.results;if(A.ok&&Array.isArray(P)&&P.length===t.length){for(let v=0;v<t.length;v++)try{Ee(t[v].node,P[v])}catch{}u=!0}}catch{}if(!u){let h=0;async function A(){if(!Z)return;const P=h++;if(P>=t.length)return;const v=t[P];try{const R=await Me(v.text,s);Ee(v.node,R)}catch{}await A()}await Promise.all(new Array(3).fill(0).map(()=>A()))}xe=new MutationObserver(async p=>{if(Z)for(const h of p)if(h.type==="characterData"&&h.target.nodeType===Node.TEXT_NODE){const A=h.target,P=A.parentElement;if(!P||Je(P))continue;const v=A.data;if(v&&v.trim())try{const R=await Me(v,s);if(!Z)return;Ee(A,R)}catch{}}else h.type==="childList"&&h.addedNodes.forEach(async A=>{if(A.nodeType===Node.TEXT_NODE){const P=A,v=P.parentElement;if(!v||Je(v))return;const R=P.data;if(R&&R.trim())try{const Y=await Me(R,s);if(!Z)return;Ee(P,Y)}catch{}}})}),xe.observe(document.body,{subtree:!0,childList:!0,characterData:!0})}const Kt=Object.freeze(Object.defineProperty({__proto__:null,disableParallelMode:Ut,enableParallelMode:Gt,isParallelModeEnabled:Ht},Symbol.toStringTag,{value:"Module"}))})();
