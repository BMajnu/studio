var En=Object.defineProperty;var An=(Me,xe,ze)=>xe in Me?En(Me,xe,{enumerable:!0,configurable:!0,writable:!0,value:ze}):Me[xe]=ze;var J=(Me,xe,ze)=>An(Me,typeof xe!="symbol"?xe+"":xe,ze);(function(){"use strict";const Me="modulepreload",xe=function(i){return"/"+i},ze={},S=function(e,n,t){let o=Promise.resolve();function a(c){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=c,window.dispatchEvent(p),!p.defaultPrevented)throw c}return o.then(c=>{for(const p of c||[])p.status==="rejected"&&a(p.reason);return e().catch(a)})},Ct={background:"#0f0f0f",surface:"#1a1a1a",surfaceHover:"#262626",surfaceActive:"#333333",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#ffffff",textSecondary:"#a1a1aa",textMuted:"#71717a",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#262626",borderLight:"#374151",shadow:"rgba(0, 0, 0, 0.8)",shadowLight:"rgba(0, 0, 0, 0.4)"},Tt={background:"#ffffff",surface:"#f8fafc",surfaceHover:"#f1f5f9",surfaceActive:"#e2e8f0",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#1e293b",textSecondary:"#475569",textMuted:"#64748b",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#e2e8f0",borderLight:"#cbd5e1",shadow:"rgba(0, 0, 0, 0.15)",shadowLight:"rgba(0, 0, 0, 0.08)"},_t=()=>typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":"dark",nt=()=>_t()==="dark"?Ct:Tt,r={colors:nt(),updateTheme(){this.colors=nt()},watchThemeChanges(i){typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.updateTheme(),i()})},featureIcons:{refine:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',translate:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 4h2.764L13 9.236 11.618 12z"></path></svg>',rewrite:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',analyze:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',explain:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>',correct:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',expand:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',chatPersonal:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>',chatPro:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',copy:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>',settings:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',customize:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>'},featureCategories:{"Quick Actions":{title:"Quick Actions",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>',description:"Fast access to common tools"},"Content Tools":{title:"Content Tools",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',description:"Text editing and enhancement"},"AI Chat":{title:"AI Chat",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>',description:"AI-powered conversations"},Advanced:{title:"Advanced",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',description:"Advanced features and settings"}},spacing:{xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},borderRadius:{sm:"6px",md:"8px",lg:"12px",xl:"16px",full:"9999px"},typography:{fontFamily:'"Inter", "Segoe UI", system-ui, sans-serif',fontSize:{xs:"12px",sm:"13px",base:"14px",lg:"16px",xl:"18px"},fontWeight:{normal:"400",medium:"500",semibold:"600",bold:"700"},lineHeight:{tight:"1.25",normal:"1.4",relaxed:"1.6"}},animation:{fast:"150ms ease-out",normal:"250ms ease-out",slow:"350ms ease-out"},shadows:{sm:"0 2px 4px rgba(0, 0, 0, 0.4)",md:"0 4px 12px rgba(0, 0, 0, 0.6)",lg:"0 8px 24px rgba(0, 0, 0, 0.8)",glow:"0 0 20px rgba(139, 92, 246, 0.3)"},zIndex:{tooltip:1e3,dropdown:1100,overlay:1200,modal:1300,toast:1400,max:2147483647}},re={summarize:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
  </svg>`,translate:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21L15.75 9.75L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"/>
  </svg>`,explain:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
  </svg>`,grammar:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
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
  </svg>`,chat:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.740.194V21l4.155-4.155"/>
  </svg>`,custom:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"/>
  </svg>`,refine:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>
  </svg>`,memo:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
  </svg>`,humanize:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
  </svg>`},He=[{id:"refine",label:"Refine",icon:re.refine,shortcut:"R",isPinned:!0},{id:"translate",label:"Translate",icon:re.translate,shortcut:"T",isPinned:!0},{id:"humanize",label:"Humanize",icon:re.humanize,shortcut:"H",isPinned:!1},{id:"summarize",label:"Summarize",icon:re.summarize,isPinned:!1},{id:"add-details",label:"Add Details",icon:re.plusCircle,isPinned:!1},{id:"more-informative",label:"More Informative",icon:re.info,isPinned:!1},{id:"simplify",label:"Simplify",icon:re.simplify,isPinned:!1},{id:"emojify",label:"Emojify",icon:re.emoji,isPinned:!1},{id:"explain",label:"Explain",icon:re.explain,shortcut:"E",isPinned:!1},{id:"correct",label:"Correct Grammar",icon:re.grammar,shortcut:"C",isPinned:!1},{id:"expand",label:"Expand Text",icon:re.expand,shortcut:"X",isPinned:!1},{id:"designer-chat",label:"Designer",icon:re.chat,shortcut:"D",isPinned:!1},{id:"customize",label:"Customize Actions",icon:re.custom,shortcut:"M",isPinned:!1}];class ot{constructor(){J(this,"container",null);J(this,"shadowRoot",null);J(this,"actions",He);J(this,"onActionClick",null);J(this,"maxPinned",9);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.initializeActions(),r.watchThemeChanges(()=>{this.updateTheme()});try{chrome.runtime.onMessage.addListener(e=>{(e==null?void 0:e.type)==="CUSTOM_ACTIONS_UPDATED"&&this.initializeActions(),(e==null?void 0:e.type)==="SAVE_PINNED_ACTIONS"&&this.initializeActions()})}catch{}}async initializeActions(){await this.loadPinnedActions(),await this.loadCustomActions()}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
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
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const n=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||[];this.actions=this.actions.map(t=>({...t,isPinned:n.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}async loadCustomActions(){var e;try{const{getCustomActions:n}=await S(async()=>{const{getCustomActions:m}=await Promise.resolve().then(()=>Fe);return{getCustomActions:m}},void 0),t=await n(),a=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||[],c=t.map(m=>({id:m.id,label:m.label,icon:m.icon,shortcut:m.shortcut,isPinned:a.includes(m.id)||m.isPinned,category:"custom"})),p=new Map(this.actions.map(m=>[m.id,m.isPinned])),d=He.map(m=>({...m,isPinned:p.get(m.id)??a.includes(m.id)??m.isPinned??!1,category:m.category}));this.actions=[...d,...c],(e=this.shadowRoot)!=null&&e.querySelector(".monica-menu.show")&&this.refreshMenuUI()}catch(n){console.warn("Failed to load custom actions:",n)}}async savePinnedActions(){var e,n;try{const t=this.actions.filter(o=>o.isPinned).map(o=>o.id).slice(0,this.maxPinned);await chrome.storage.sync.set({"desainr.pinnedActions":t});try{(n=(e=chrome==null?void 0:chrome.runtime)==null?void 0:e.sendMessage)==null||n.call(e,{type:"SAVE_PINNED_ACTIONS",pinnedIds:t})}catch(o){console.warn("Broadcast SAVE_PINNED_ACTIONS failed:",o)}}catch(t){console.warn("Failed to save pinned actions:",t)}}async togglePin(e){const n=this.actions.findIndex(o=>o.id===e);if(n===-1)return;const t=this.actions[n];if(t.isPinned)t.isPinned=!1;else{if(this.actions.filter(a=>a.isPinned).length>=this.maxPinned)return;t.isPinned=!0}if(t.category==="custom")try{const{updateCustomAction:o}=await S(async()=>{const{updateCustomAction:a}=await Promise.resolve().then(()=>Fe);return{updateCustomAction:a}},void 0);await o(e,{isPinned:t.isPinned})}catch{}await this.savePinnedActions(),this.refreshMenuUI()}refreshMenuUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-menu");if(!e)return;const n=e.style.left,t=e.style.top;e.remove();const o=this.renderMenu();this.shadowRoot.appendChild(o),o.classList.add("show"),n&&(o.style.left=n),t&&(o.style.top=t)}renderMenu(){const e=document.createElement("div");e.className="monica-menu",this.actions.filter(o=>o.isPinned||!this.actions.some(a=>a.isPinned&&a.id===o.id)).forEach(o=>{const a=document.createElement("div");a.className=`menu-item ${o.isPinned?"pinned":""}`;const c=re.memo;a.innerHTML=`
        <div class="item-icon">${o.icon}</div>
        <div class="item-label">${o.label}</div>
        ${o.shortcut?`<div class="item-shortcut">${o.shortcut}</div>`:""}
        <button class="item-pin" title="${o.isPinned?"Unpin":"Pin"}" aria-label="${o.isPinned?"Unpin":"Pin"}">
          ${c}
        </button>
        <div class="pin-indicator"></div>
      `,a.addEventListener("click",()=>{var d;this.hide(),(d=this.onActionClick)==null||d.call(this,o)});const p=a.querySelector(".item-pin");if(p){p.setAttribute("aria-pressed",o.isPinned?"true":"false");const d=p.querySelector("svg");d&&(o.isPinned?d.classList.add("filled"):d.classList.remove("filled")),p.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),this.togglePin(o.id)})}e.appendChild(a)});const t=document.createElement("div");return t.className="menu-footer",t.innerHTML=`
      <div class="powered-by">Powered by DesAInR ✨</div>
    `,e.appendChild(t),e}show(e,n,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t;const o=this.shadowRoot.querySelector(".monica-menu");o&&o.remove();const a=this.renderMenu();if(this.shadowRoot.appendChild(a),!document.body)return;document.body.appendChild(this.container);const c={width:window.innerWidth,height:window.innerHeight},p=a.getBoundingClientRect();let d=e,m=n;e+p.width>c.width-20&&(d=Math.max(20,e-p.width)),n+p.height>c.height-20&&(m=Math.max(20,n-p.height)),a.style.left=`${d}px`,a.style.top=`${m}px`,requestAnimationFrame(()=>{a.classList.add("show")});const k=N=>{const E=N.target,w=E&&E||null;(!w||!a.contains(w))&&(this.hide(),document.removeEventListener("click",k))};setTimeout(()=>{document.addEventListener("click",k)},100)}hide(){var n;const e=(n=this.shadowRoot)==null?void 0:n.querySelector(".monica-menu");e&&(e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}updateActions(e){this.actions=e}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}const Rt=Object.freeze(Object.defineProperty({__proto__:null,DefaultActions:He,MonicaStyleContextMenu:ot},Symbol.toStringTag,{value:"Module"})),it=["refine","translate","rephrase","summarize"],We=He.map(i=>({id:i.id,label:i.label.replace(" Selection",""),icon:i.icon,shortcut:i.shortcut,isPinned:i.isPinned,category:i.category}));class Mt{constructor(){J(this,"container",null);J(this,"shadowRoot",null);J(this,"actions",We);J(this,"onActionClick",null);J(this,"isVisible",!1);J(this,"pinnedIds",it);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.initializeActions();try{chrome.runtime.onMessage.addListener(e=>{(e==null?void 0:e.type)==="SAVE_PINNED_ACTIONS"&&this.initializeActions().then(()=>this.refreshToolbarUI()),(e==null?void 0:e.type)==="CUSTOM_ACTIONS_UPDATED"&&this.initializeActions().then(()=>this.refreshToolbarUI())})}catch{}try{chrome.storage.onChanged.addListener((e,n)=>{n==="sync"&&e["desainr.pinnedActions"]&&this.initializeActions().then(()=>this.refreshToolbarUI())})}catch{}r.watchThemeChanges(()=>{this.updateTheme()})}async initializeActions(){await this.loadPinnedActions(),await this.loadCustomActions()}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
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
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const n=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||it;this.pinnedIds=n.slice(0,9),this.actions=We.map(t=>({...t,isPinned:n.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}async loadCustomActions(){try{const{getCustomActions:e}=await S(async()=>{const{getCustomActions:d}=await Promise.resolve().then(()=>Fe);return{getCustomActions:d}},void 0),n=await e(),o=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||[],a=n.map(d=>({id:d.id,label:d.label,icon:d.icon,shortcut:d.shortcut,isPinned:o.includes(d.id)||d.isPinned,category:"custom"})),c=new Map(this.actions.map(d=>[d.id,d.isPinned])),p=We.map(d=>({...d,isPinned:c.get(d.id)??o.includes(d.id)??!1,category:d.category}));this.actions=[...p,...a],this.isVisible&&this.refreshToolbarUI()}catch(e){console.warn("Failed to load custom actions:",e)}}refreshToolbarUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-toolbar");if(!e)return;const{left:n,top:t}=e.style;e.remove();const o=this.renderToolbar();this.shadowRoot.appendChild(o),o.classList.add("show"),n&&(o.style.left=n),t&&(o.style.top=t)}renderToolbar(){const e=document.createElement("div");e.className="monica-toolbar";const n=this.pinnedIds.map(o=>this.actions.find(a=>a.id===o&&a.isPinned)).filter(o=>!!o).slice(0,10);if(n.forEach((o,a)=>{const c=document.createElement("div");c.className=`toolbar-action ${a===0?"featured":""}`,c.innerHTML=`
        <div class="action-icon">${o.icon}</div>
        <div class="action-label">${o.label}</div>
        <div class="tooltip">${o.label}</div>
      `,c.addEventListener("click",p=>{var d;p.preventDefault(),p.stopPropagation(),(d=this.onActionClick)==null||d.call(this,o)}),e.appendChild(c)}),n.length>0){const o=document.createElement("div");o.className="toolbar-divider",e.appendChild(o)}const t=document.createElement("div");return t.className="more-button",t.innerHTML=`
      <div class="action-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </div>
      <div class="action-label">More</div>
      <div class="tooltip">More actions</div>
    `,t.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const a=t.getBoundingClientRect();this.showContextMenu(a.left,a.bottom)}),e.appendChild(t),e}showContextMenu(e,n){S(async()=>{const{MonicaStyleContextMenu:t}=await Promise.resolve().then(()=>Rt);return{MonicaStyleContextMenu:t}},void 0).then(({MonicaStyleContextMenu:t})=>{new t().show(e,n,a=>{var c;(c=this.onActionClick)==null||c.call(this,a)})}).catch(()=>{console.log("More actions menu clicked"),alert("More actions menu - Context menu integration pending")})}show(e,n,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t,this.isVisible=!0;const o=this.shadowRoot.querySelector(".monica-toolbar");o&&o.remove();const a=this.renderToolbar();if(this.shadowRoot.appendChild(a),!document.body)return;document.body.appendChild(this.container);const c={width:window.innerWidth},p=a.getBoundingClientRect();let d=e-p.width/2,m=n-p.height-8;d<10&&(d=10),d+p.width>c.width-10&&(d=c.width-p.width-10),m<10&&(m=n+8),a.style.left=`${d}px`,a.style.top=`${m}px`,requestAnimationFrame(()=>{a.classList.add("show")});const k=N=>{var Re;const E=N.target,w=E&&E||null,W=document.getElementById("desainr-result-popup"),be=(Re=N.composedPath)==null?void 0:Re.call(N),_e=W?be?be.includes(W):w?W.contains(w):!1:!1;(!w||!a.contains(w)&&!_e)&&(this.hide(),document.removeEventListener("click",k))};setTimeout(()=>{document.addEventListener("click",k)},100)}hide(){var n;const e=(n=this.shadowRoot)==null?void 0:n.querySelector(".monica-toolbar");e&&(this.isVisible=!1,e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}isShown(){return this.isVisible}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}(()=>{const i="desainr-overlay-root";let e=null,n=null,t=null,o="",a=null;function c(){try{const l=window.getSelection(),y=(l==null?void 0:l.toString())||"";if(y&&y.trim()){o=y;try{a=l&&l.rangeCount?l.getRangeAt(0).cloneRange():null}catch{a=null}}}catch{}}document.addEventListener("selectionchange",c,!0);function p(){let l="",y=null;try{const x=window.getSelection();if(l=(x==null?void 0:x.toString())||"",x&&x.rangeCount)try{y=x.getRangeAt(0).getBoundingClientRect()}catch{}}catch{}if(!l.trim()&&o.trim()){l=o;try{y=a?a.getBoundingClientRect():y}catch{}}return{text:l,rect:y}}(()=>{e||(e=new ot),n||(n=new Mt)})();async function m(l,y){var x,f,U,L,oe,te,C,Y,j,ue,de,ke,Ee,Ae,Ce,$e,F,$,P,ne,Z,me,ge,ae,pe,we,fe,Te,Be,v,M,O,z,G,ee,q,X,ce,se,ie,ve;try{if(l==="customize"){const{CustomActionModal:g}=await S(async()=>{const{CustomActionModal:T}=await Promise.resolve().then(()=>It);return{CustomActionModal:T}},void 0);new g().show(T=>{var b,D;w(`✨ Custom action "${T.label}" created!`,"success"),e&&((b=e.loadCustomActions)==null||b.call(e)),n&&((D=n.loadCustomActions)==null||D.call(n))});return}if(l.startsWith("custom-")){const{text:g,rect:s}=p();if(!g.trim()){w("No text selected","warning");return}try{await A(y,g,"Working…",s||void 0);const{executeCustomAction:T}=await S(async()=>{const{executeCustomAction:D}=await Promise.resolve().then(()=>Fe);return{executeCustomAction:D}},void 0),b=await T(l,g);b.ok&&b.result?await A(y,g,b.result,s||void 0):await A(y,g,`Failed: ${b.error||"unknown"}`,s||void 0)}catch(T){await A(y,g,`Error: ${(T==null?void 0:T.message)||T}`,s||void 0)}return}if(l==="refine"){const{text:g,rect:s}=p();if(!g.trim()){w("No text selected","warning");return}try{await A("Refine",g,"Working…",s||void 0);const{actions:T}=await S(async()=>{const{actions:tt}=await Promise.resolve().then(()=>Q);return{actions:tt}},void 0),b=await((U=(x=chrome.storage)==null?void 0:(f=x.local).get)==null?void 0:U.call(f,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),D=b==null?void 0:b["desainr.settings.modelId"],I=(b==null?void 0:b["desainr.settings.thinkingMode"])||"none",le=b==null?void 0:b["desainr.settings.userApiKey"],B=(b==null?void 0:b["desainr.settings.outputLang"])||"auto",H=`Refine this text professionally: enhance clarity, grammar, flow, and readability. Make it more polished and impactful while maintaining the original message, tone, and voice. Fix any errors and improve word choice. Return ONLY the refined text.${B==="auto"?" Respond in the same language as the input.":` Respond in ${B}.`}`,{ok:h,status:V,json:_,error:kn}=await T({selection:g,clientMessage:g,customInstruction:H,modelId:D,thinkingMode:I,userApiKey:le});if(h&&(_!=null&&_.result))await A("Refine",g,_.result,s||void 0);else{const tt=kn||(_==null?void 0:_.error)||"unknown";await A("Refine",g,`Failed (${V}): ${tt}`,s||void 0)}}catch(T){await A("Refine",g,`Error: ${(T==null?void 0:T.message)||T}`,s||void 0)}return}const{text:u,rect:R}=p();if(l==="translate"){if(!u.trim()){w("No text selected","warning");return}try{await A("Translate",u,"Working…",R||void 0);const g=await((te=(L=chrome.storage)==null?void 0:(oe=L.local).get)==null?void 0:te.call(oe,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({})));let s=(g==null?void 0:g["desainr.settings.targetLang"])||(await S(async()=>{const{DEFAULT_TARGET_LANG:K}=await Promise.resolve().then(()=>Ne);return{DEFAULT_TARGET_LANG:K}},void 0)).DEFAULT_TARGET_LANG;const T=(g==null?void 0:g["desainr.settings.outputLang"])||"auto";T&&T!=="auto"&&(s=T);const b=g==null?void 0:g["desainr.settings.modelId"],D=(g==null?void 0:g["desainr.settings.thinkingMode"])||"none",I=g==null?void 0:g["desainr.settings.userApiKey"],{translateChunks:le}=await S(async()=>{const{translateChunks:K}=await Promise.resolve().then(()=>Q);return{translateChunks:K}},void 0);let B=await le({selection:u,url:location.href,targetLang:s,modelId:b,thinkingMode:D,userApiKey:I});if(B.ok&&((C=B.json)!=null&&C.result))await A("Translate",u,B.json.result,R||void 0);else{const{actions:K}=await S(async()=>{const{actions:V}=await Promise.resolve().then(()=>Q);return{actions:V}},void 0),H=`CRITICAL: Translate EVERY word of the provided text to ${s}. Do NOT summarize or shorten. Translate the COMPLETE text maintaining original length and structure. Return ONLY the full translation of ALL provided text.`,h=await K({selection:u,clientMessage:u,customInstruction:H,modelId:b,thinkingMode:D,userApiKey:I});if(h.ok&&((Y=h.json)!=null&&Y.result))await A("Translate",u,h.json.result,R||void 0);else{const V=h.error||((j=h.json)==null?void 0:j.error)||B.error||((ue=B.json)==null?void 0:ue.error)||"unknown";await A("Translate",u,`Failed (${h.status||B.status}): ${V}`,R||void 0)}}}catch(g){await A("Translate",u,`Error: ${(g==null?void 0:g.message)||g}`,R||void 0)}}else if(l==="expand"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("Expand",u,"Working…",R||void 0);const s=await((Ee=(de=chrome.storage)==null?void 0:(ke=de.local).get)==null?void 0:Ee.call(ke,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Expand this text thoughtfully with relevant details, examples, and context. Add depth and substance while maintaining the original tone, style, and core message. Make it more comprehensive and informative. Return ONLY the expanded text.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("Expand",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("Expand",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="correct"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("Correct Grammar",u,"Working…",R||void 0);const s=await(($e=(Ae=chrome.storage)==null?void 0:(Ce=Ae.local).get)==null?void 0:$e.call(Ce,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Fix all grammar, spelling, punctuation, and syntax errors. Ensure perfect language mechanics while preserving the original meaning and style. Return ONLY the corrected text.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("Correct Grammar",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("Correct Grammar",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="explain"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("Explain",u,"Working…",R||void 0);const s=await((P=(F=chrome.storage)==null?void 0:($=F.local).get)==null?void 0:P.call($,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Provide a clear, easy-to-understand explanation of this text. Break down complex concepts, clarify meanings, and add helpful context. Make it accessible to a general audience. Return ONLY the explanation.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("Explain",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("Explain",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="rephrase"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:V}=await Promise.resolve().then(()=>Q);return{actions:V}},void 0);await A("Rephrase",u,"Working…",R||void 0);const s=await((me=(ne=chrome.storage)==null?void 0:(Z=ne.local).get)==null?void 0:me.call(Z,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",le=I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`,{ok:B,status:K,json:H,error:h}=await g({selection:u,clientMessage:u,customInstruction:"Rephrase the following text to be clearer and more natural while preserving meaning. Return only the rephrased text."+le,modelId:T,thinkingMode:b,userApiKey:D});if(B&&(H!=null&&H.result))await A("Rephrase",u,H.result,R||void 0);else{const V=h||(H==null?void 0:H.error)||"unknown";await A("Rephrase",u,`Failed (${K}): ${V}`,R||void 0)}}else if(l==="summarize"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("Summarize",u,"Working…",R||void 0);const s=await((pe=(ge=chrome.storage)==null?void 0:(ae=ge.local).get)==null?void 0:pe.call(ae,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Create a concise, well-written summary in 1-3 sentences. Capture the core message, key insights, and most important details. Make it clear and engaging. Return ONLY the summary.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("Summarize",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("Summarize",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="add-details"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("Add Details",u,"Working…",R||void 0);const s=await((Te=(we=chrome.storage)==null?void 0:(fe=we.local).get)==null?void 0:Te.call(fe,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Enhance this text by adding specific, helpful details, concrete examples, and relevant context. Make it more complete and valuable while maintaining the original tone and message. Return ONLY the improved text.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("Add Details",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("Add Details",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="more-informative"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("More Informative",u,"Working…",R||void 0);const s=await((M=(Be=chrome.storage)==null?void 0:(v=Be.local).get)==null?void 0:M.call(v,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Make this more informative by adding relevant facts, data, and context. Increase the educational value while staying concise and focused. Ensure accuracy and credibility. Return ONLY the enhanced text.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("More Informative",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("More Informative",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="simplify"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("Simplify",u,"Working…",R||void 0);const s=await((G=(O=chrome.storage)==null?void 0:(z=O.local).get)==null?void 0:G.call(z,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Simplify this text using clear, plain language. Remove jargon and complexity. Make it easy to understand for anyone. Keep the core message intact but more accessible. Return ONLY the simplified text.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("Simplify",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("Simplify",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="emojify"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("Emojify",u,"Working…",R||void 0);const s=await((X=(ee=chrome.storage)==null?void 0:(q=ee.local).get)==null?void 0:X.call(q,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Add relevant, appropriate emojis to make this text more expressive and engaging. Use emojis thoughtfully to enhance meaning and emotion, not excessively. Keep the text professional yet friendly. Return ONLY the emojified text.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("Emojify",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("Emojify",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="humanize"){if(!u.trim()){w("No text selected","warning");return}const{actions:g}=await S(async()=>{const{actions:_}=await Promise.resolve().then(()=>Q);return{actions:_}},void 0);await A("Humanize",u,"Working…",R||void 0);const s=await((ie=(ce=chrome.storage)==null?void 0:(se=ce.local).get)==null?void 0:ie.call(se,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey","desainr.settings.outputLang"]).catch(()=>({}))),T=s==null?void 0:s["desainr.settings.modelId"],b=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",D=s==null?void 0:s["desainr.settings.userApiKey"],I=(s==null?void 0:s["desainr.settings.outputLang"])||"auto",B=`Humanize this text by making it sound natural and conversational, as if written by a real person. Use everyday language and common words that people actually use. Avoid overly formal or complex vocabulary, technical jargon, and uncommon words. Remove special characters, underscores, asterisks, and AI-typical formatting. Make sentences flow naturally with varied structure. Keep it authentic, relatable, and engaging. Preserve the core message but make it feel genuinely human-written. Return ONLY the humanized text.${I==="auto"?" Respond in the same language as the input.":` Respond in ${I}.`}`,{ok:K,status:H,json:h,error:V}=await g({selection:u,clientMessage:u,customInstruction:B,modelId:T,thinkingMode:b,userApiKey:D});if(K&&(h!=null&&h.result))await A("Humanize",u,h.result,R||void 0);else{const _=V||(h==null?void 0:h.error)||"unknown";await A("Humanize",u,`Failed (${H}): ${_}`,R||void 0)}}else if(l==="analyze"){const{analyzePage:g}=await S(async()=>{const{analyzePage:I}=await Promise.resolve().then(()=>Q);return{analyzePage:I}},void 0);await A("Analyze",u||"(No selection)","Working…",R||void 0);const{ok:s,status:T,json:b,error:D}=await g({url:location.href,title:document.title});if(s)await A("Analyze",u||"(No selection)",(b==null?void 0:b.summary)||"Done",R||void 0);else{const I=D||(b==null?void 0:b.error)||"unknown";await A("Analyze",u||"(No selection)",`Failed (${T}): ${I}`,R||void 0)}}else if(l==="designer")Qe();else if(l==="designer-chat")Qe();else if(l==="copy"){const g=((ve=window.getSelection())==null?void 0:ve.toString())||"";g?(navigator.clipboard.writeText(g),w("Text copied to clipboard! 📋","success")):w("No text selected","warning")}else l==="settings"?w("Extension settings coming soon! ⚙️","info"):l==="customize"?w("Custom actions coming soon! 🔧","info"):w(`Unknown action: ${y}`,"warning")}catch(u){w(`Error: ${(u==null?void 0:u.message)||u}`,"error")}}const k=document.getElementById(i);if(k)try{k.style.display="none",k.textContent=""}catch{}function N(){return t&&t.remove(),t=document.createElement("div"),Object.assign(t.style,{position:"fixed",top:"20px",right:"20px",zIndex:r.zIndex.toast,background:r.colors.surface,color:r.colors.textPrimary,border:`1px solid ${r.colors.border}`,borderRadius:r.borderRadius.lg,padding:`${r.spacing.md} ${r.spacing.lg}`,boxShadow:r.shadows.lg,backdropFilter:"blur(12px)",maxWidth:"420px",fontFamily:r.typography.fontFamily,fontSize:r.typography.fontSize.sm,display:"none",opacity:"0",transform:"translateY(-8px) scale(0.95)",transition:`all ${r.animation.fast}`}),document.documentElement.appendChild(t),t}function E(){return N()}function w(l,y="info"){const x=N(),f={info:"💬",success:"✅",error:"❌",warning:"⚠️"},U={info:r.colors.info,success:r.colors.success,error:r.colors.error,warning:r.colors.warning};x.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.md};">
        <div style="font-size: 18px;">${f[y]}</div>
        <div style="flex: 1; line-height: ${r.typography.lineHeight.normal};">${l}</div>
        <div style="width: 4px; height: 40px; background: ${U[y]}; border-radius: 2px; margin-left: ${r.spacing.md};"></div>
      </div>
    `,x.style.display="block",requestAnimationFrame(()=>{x.style.opacity="1",x.style.transform="translateY(0) scale(1)"}),setTimeout(()=>W(),3e3)}function W(){t&&(t.style.opacity="0",t.style.transform="translateY(-8px) scale(0.95)",setTimeout(()=>{t&&(t.style.display="none")},150))}function be(l,y,x=6e3){const f=document.createElement("button");f.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.xs};">
        <span>↶</span>
        <span>Undo</span>
      </div>
    `,Object.assign(f.style,{marginLeft:r.spacing.md,padding:`${r.spacing.xs} ${r.spacing.md}`,background:r.colors.primary,color:"white",border:"none",borderRadius:r.borderRadius.md,cursor:"pointer",fontSize:r.typography.fontSize.sm,fontWeight:r.typography.fontWeight.medium,transition:`all ${r.animation.fast}`,fontFamily:r.typography.fontFamily}),f.onmouseenter=()=>{f.style.background=r.colors.primaryHover,f.style.transform="translateY(-1px)"},f.onmouseleave=()=>{f.style.background=r.colors.primary,f.style.transform="translateY(0)"};const U=()=>{try{const L=y();w(L?"Undone successfully! ✓":"Undo failed",L?"success":"error")}catch{w("Undo failed","error")}finally{f.remove(),setTimeout(()=>W(),800)}};f.addEventListener("click",U,{once:!0}),l.appendChild(f),setTimeout(()=>{try{f.remove()}catch{}},x)}function _e(l,y,x=12e3){const f=document.createElement("button");f.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.xs};">
        <span>📋</span>
        <span>Copy</span>
      </div>
    `,Object.assign(f.style,{marginLeft:r.spacing.md,padding:`${r.spacing.xs} ${r.spacing.md}`,background:r.colors.surface,color:r.colors.textPrimary,border:`1px solid ${r.colors.border}`,borderRadius:r.borderRadius.md,cursor:"pointer",fontSize:r.typography.fontSize.sm,fontWeight:r.typography.fontWeight.medium,transition:`all ${r.animation.fast}`,fontFamily:r.typography.fontFamily}),f.onmouseenter=()=>{f.style.background=r.colors.surfaceHover,f.style.borderColor=r.colors.primary,f.style.transform="translateY(-1px)"},f.onmouseleave=()=>{f.style.background=r.colors.surface,f.style.borderColor=r.colors.border,f.style.transform="translateY(0)"};const U=async()=>{try{await navigator.clipboard.writeText(y),w("Copied to clipboard! ✓","success")}catch{w("Copy failed","error")}finally{f.remove(),setTimeout(()=>W(),800)}};f.addEventListener("click",U,{once:!0}),l.appendChild(f),setTimeout(()=>{try{f.remove()}catch{}},x)}function Re(l){return l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function fn(l,y){const x=Re(String(y.summary||"Analysis complete")),f=Array.isArray(y.keyPoints)?y.keyPoints:[],U=Array.isArray(y.links)?y.links:[],L=f.length?`<ul style="margin:6px 0 8px 18px; padding:0;">${f.map(C=>`<li style="margin:2px 0;">${Re(C)}</li>`).join("")}</ul>`:"",oe=U.length?`<div style="margin-top:6px; max-height:160px; overflow:auto;"><div style="font-weight:600; margin-bottom:4px;">Top links</div>${U.slice(0,10).map(C=>`<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><a href="${Re(C)}" target="_blank" rel="noopener noreferrer">${Re(C)}</a></div>`).join("")}</div>`:"";l.innerHTML=`<div style="font-size:13px; line-height:1.35;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-weight:700;">Analysis</div>
        <button id="desainr-close-overlay" style="border:1px solid #ddd; border-radius:6px; padding:2px 6px; background:#f7f7f7; cursor:pointer;">Close</button>
      </div>
      <div style="margin-top:6px;">${x}</div>
      ${L}
      ${oe}
    </div>`;const te=l.querySelector("#desainr-close-overlay");te&&(te.onclick=()=>{l.style.display="none"})}let Ke=null,he=null;async function Qe(){if(he){try{he.detach()}catch{}he=null,Ke=null;return}const l=document.createElement("div");l.id="desainr-overlay-react-root",Object.assign(l.style,{position:"fixed",top:"20px",right:"20px",zIndex:1e6}),document.documentElement.appendChild(l);try{he=(await S(()=>Promise.resolve().then(()=>Vt),void 0)).mountOverlay(l,()=>{try{he==null||he.detach()}catch{}he=null,Ke=null}),Ke=l}catch(y){const x=E();x.style.display="block",x.textContent=`Overlay failed: ${(y==null?void 0:y.message)||y}`,setTimeout(()=>W(),1500)}}let vn=0,Ze=null,Ge=null;function wn(){if(Ze)return Ze;const l=document.createElement("div");l.id="desainr-result-popup",Object.assign(l.style,{position:"fixed",zIndex:1e6,top:"0px",left:"0px",display:"none"});try{const f=L=>{try{L.stopPropagation()}catch{}},U=L=>{try{L.preventDefault()}catch{}try{L.stopPropagation()}catch{}};l.addEventListener("click",f),l.addEventListener("mousedown",f),l.addEventListener("mouseup",f),l.addEventListener("pointerdown",f),l.addEventListener("pointerup",f),l.addEventListener("touchstart",f),l.addEventListener("touchend",f),l.addEventListener("auxclick",U),l.addEventListener("contextmenu",U)}catch{}Ge=l.attachShadow({mode:"open"});const y=document.createElement("style");y.textContent=`
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
    `,Ge.appendChild(y);const x=document.createElement("div");return x.className="popup",x.innerHTML=`
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
              <div class="dropdown-item" data-action="summarize"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 12h12M3 18h8"/></svg></span> Summarize</div>
              <div class="dropdown-item" data-action="expand"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16M4 12h16"/></svg></span> Expand</div>
              <div class="dropdown-item" data-action="correct"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg></span> Correct Grammar</div>
              <div class="dropdown-item" data-action="explain"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 6.75h1.5v1.5h-1.5zM12 17.25v-6"/></svg></span> Explain</div>
              <div class="dropdown-item" data-action="add-details"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12M6 12h12"/></svg></span> Add Details</div>
              <div class="dropdown-item" data-action="more-informative"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25h1.5v6h-1.5zM12 6.75h.008v.008H12z"/></svg></span> More Informative</div>
              <div class="dropdown-item" data-action="simplify"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12"/></svg></span> Simplify</div>
              <div class="dropdown-item" data-action="emojify"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.121 14.121a3 3 0 01-4.242 0M9 9h.01M15 9h.01M12 21a9 9 0 100-18 9 9 0 000 18z"/></svg></span> Emojify</div>
              <div class="dropdown-item" data-action="humanize"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg></span> Humanize</div>
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
    `,Ge.appendChild(x),document.documentElement.appendChild(l),Ze=l,l}let Se="refine";async function A(l,y,x,f){var fe,Te,Be;const U=wn(),L=Ge;if(!L){try{console.warn("DesAInR: popupShadow not available")}catch{}return}Se=l.toLowerCase();const oe=L.querySelector(".popup"),te=L.getElementById("action-switcher"),C=L.getElementById("action-dropdown"),Y=L.getElementById("orig"),j=L.getElementById("res"),ue=L.getElementById("split-scroll"),de=L.getElementById("split-thumb"),ke=L.getElementById("close"),Ee=L.getElementById("copy"),Ae=L.getElementById("replace"),Ce=L.getElementById("regen");if(Y&&(Y.textContent=y),j&&(j.textContent=x),(v=>{const M=L.querySelector(".processing");if(v){if(M)return;const O=document.createElement("div");O.className="processing",O.innerHTML='<div class="processing-wrap"><div class="spinner"></div><div class="msg">Preparing…</div></div>';const z=L.querySelector(".body");z&&z.appendChild(O)}else if(M)try{M.remove()}catch{}})(x==="Working…"),Y&&j){let v=0;const M=(z,G)=>{const ee=Math.max(1,z.scrollHeight-z.clientHeight),q=Math.max(1,G.scrollHeight-G.clientHeight),X=z.scrollTop/ee;G.scrollTop=X*q};Y.onscroll=()=>{v!==2&&(v=1,M(Y,j),v=0,O())},j.onscroll=()=>{v!==1&&(v=2,M(j,Y),v=0,O())};const O=()=>{if(!ue||!de)return;const z=Math.max(1,Y.scrollHeight-Y.clientHeight),G=Math.max(1,j.scrollHeight-j.clientHeight),ee=Math.max(Y.scrollTop/z,j.scrollTop/G),q=ue.clientHeight,X=Math.min(Y.clientHeight/Y.scrollHeight,j.clientHeight/j.scrollHeight),ce=Math.max(40,Math.floor(q*X)),se=Math.floor((q-ce)*ee);de.style.height=`${ce}px`,de.style.top=`${se}px`};if(ue){if(ue.onwheel=z=>{z.preventDefault();const G=z.deltaY||z.deltaX;Y.scrollTop+=G,j.scrollTop+=G},de){let z=!1,G=0,ee=0;de.addEventListener("mousedown",q=>{z=!0,G=q.clientY,ee=de.offsetTop,q.preventDefault()}),window.addEventListener("mousemove",q=>{if(!z||!ue)return;const X=ue.clientHeight,ce=de.offsetHeight,se=X-ce,ie=Math.max(0,Math.min(se,ee+(q.clientY-G))),ve=se?ie/se:0,u=Math.max(1,Y.scrollHeight-Y.clientHeight),R=Math.max(1,j.scrollHeight-j.clientHeight);Y.scrollTop=ve*u,j.scrollTop=ve*R}),window.addEventListener("mouseup",()=>{z=!1})}setTimeout(O,0)}}const $={refine:" Refine",translate:" Translate",rephrase:" Rephrase",summarize:" Summarize",expand:" Expand","correct grammar":" Correct Grammar",explain:" Explain","add details":" Add Details"}[Se]||"Refine",P=L.getElementById("action-label");P&&(P.textContent=$);const ne=L.querySelectorAll(".dropdown-item");ne.forEach(v=>{v.dataset.action===Se?v.classList.add("active"):v.classList.remove("active")});function Z(){const M=U.getBoundingClientRect();let O=0,z=0;f?(O=f.left,z=f.bottom+15,O+M.width>window.innerWidth-15&&(O=window.innerWidth-M.width-15),O<15&&(O=15),z+M.height>window.innerHeight-15&&(z=f.top-M.height-15,z<15&&(z=15))):(O=(window.innerWidth-M.width)/2,z=(window.innerHeight-M.height)/2),U.style.left=`${Math.round(O)}px`,U.style.top=`${Math.round(z)}px`}U.style.display="block",requestAnimationFrame(()=>{oe&&oe.classList.add("show"),Z()});const me=()=>{oe&&oe.classList.remove("show"),setTimeout(()=>U.style.display="none",300)};te&&C&&(te.onclick=v=>{v.stopPropagation(),v.preventDefault(),C.classList.toggle("show"),te.classList.toggle("open")},document.addEventListener("click",()=>{C.classList.remove("show"),te.classList.remove("open")},{once:!0}),ne.forEach(v=>{v.onclick=async M=>{M.preventDefault(),M.stopPropagation();const O=v.dataset.action;O&&O!==Se&&(C.classList.remove("show"),te.classList.remove("open"),j&&(j.textContent="Processing..."),await m(O,O))}}));const ge=L.getElementById("lang-switcher"),ae=L.getElementById("lang-dropdown"),pe=L.getElementById("lang-label"),we=v=>{const M={auto:"Auto",en:"English",bn:"Bengali",hi:"Hindi",es:"Spanish",fr:"French",de:"German",it:"Italian",pt:"Portuguese",ar:"Arabic",zh:"Chinese",ja:"Japanese",ko:"Korean",ru:"Russian"};pe&&(pe.textContent=M[v]||v.toUpperCase())};try{const v=await((Be=(fe=chrome.storage)==null?void 0:(Te=fe.local).get)==null?void 0:Be.call(Te,["desainr.settings.outputLang"]));we((v==null?void 0:v["desainr.settings.outputLang"])||"auto")}catch{}ge&&ae&&(ge.onclick=M=>{M.preventDefault(),M.stopPropagation(),ae.classList.toggle("show")},document.addEventListener("click",()=>{try{ae.classList.remove("show")}catch{}},{once:!0}),Array.from(ae.querySelectorAll(".lang-item")).forEach(M=>{M.onclick=async O=>{var G,ee,q,X,ce,se;O.preventDefault(),O.stopPropagation();const z=M.dataset.lang||"auto";try{if(await((q=(G=chrome.storage)==null?void 0:(ee=G.local).set)==null?void 0:q.call(ee,{"desainr.settings.outputLang":z})),z!=="auto")try{await((se=(X=chrome.storage)==null?void 0:(ce=X.local).set)==null?void 0:se.call(ce,{"desainr.settings.targetLang":z}))}catch{}}catch{}we(z),ae.classList.remove("show")}})),ke&&(ke.onclick=v=>{v.preventDefault(),v.stopPropagation(),me()}),Ee&&(Ee.onclick=async v=>{var M,O;(M=v==null?void 0:v.preventDefault)==null||M.call(v),(O=v==null?void 0:v.stopPropagation)==null||O.call(v);try{await navigator.clipboard.writeText(x),w("Copied! ✓","success")}catch{w("Copy failed","error")}}),Ce&&(Ce.onclick=async v=>{v.preventDefault(),v.stopPropagation(),j&&(j.textContent="Processing..."),await m(Se,Se)}),Ae&&(Ae.onclick=async v=>{var O,z;(O=v==null?void 0:v.preventDefault)==null||O.call(v),(z=v==null?void 0:v.stopPropagation)==null||z.call(v);const M=E();try{const{applyReplacementOrCopyWithUndo:G}=await S(async()=>{const{applyReplacementOrCopyWithUndo:X}=await Promise.resolve().then(()=>wt);return{applyReplacementOrCopyWithUndo:X}},void 0);let{outcome:ee,undo:q}=await G(x);if(ee!=="replaced")try{const{getEditableSelection:X,isEditableElement:ce,replaceEditableSelection:se}=await S(async()=>{const{getEditableSelection:ve,isEditableElement:u,replaceEditableSelection:R}=await Promise.resolve().then(()=>Jt);return{getEditableSelection:ve,isEditableElement:u,replaceEditableSelection:R}},void 0),ie=X();if(ie&&ie.element&&ce(ie.element)){const ve=se(ie.element,x,ie.start,ie.end),u=()=>{try{return ve(),!0}catch{return!1}};u&&(ee="replaced",q=u)}}catch{}if(ee!=="replaced"&&a)try{const X=a,ce=X.cloneRange(),se=X.cloneContents();X.deleteContents();const ie=document.createTextNode(x);X.insertNode(ie);const ve=()=>{try{const u=ce;return ie.parentNode&&ie.parentNode.removeChild(ie),u.insertNode(se),!0}catch{return!1}};ee="replaced",q=ve}catch{}if(ee==="replaced")M.textContent="Replaced ✓",q&&be(M,q);else if(ee==="copied")M.textContent="Copied ✓",_e(M,x);else try{await navigator.clipboard.writeText(x),M.textContent="Copied ✓"}catch{M.textContent="Done"}}catch(G){M.textContent=`Replace failed: ${(G==null?void 0:G.message)||G}`}finally{M.style.display="block",setTimeout(()=>W(),1e3),me()}})}async function yn(){const y=(await S(()=>Promise.resolve().then(()=>Zt),void 0)).getSelectionInfo();if(!y){et();return}if(y.text,y.rect,n){const x=y.rect,f=x.left+x.width/2,U=x.top-8;n.show(f,U,L=>{m(L.id,L.label)})}}function et(){if(n)try{n.hide()}catch(l){console.warn("Error hiding Monica toolbar:",l)}}document.addEventListener("keydown",l=>{if(l.key==="Escape"&&(et(),he)){try{he.detach()}catch{}he=null,Ke=null}}),document.addEventListener("selectionchange",()=>{var y;if(Date.now()<vn)return;(((y=window.getSelection())==null?void 0:y.toString())||"").trim()||et()}),document.addEventListener("mousedown",l=>{},!0);function xn(l=4e3){return new Promise(y=>{let x=!1;const f=oe=>{window.removeEventListener("message",U),oe&&clearTimeout(oe)},U=oe=>{if(oe.source!==window)return;const te=oe.data;if(!te||te.type!=="DESAINR_WEBAPP_TOKEN"||x)return;x=!0,f();const{ok:C,idToken:Y,error:j}=te||{};y({ok:!!C,idToken:Y,error:j||(C?void 0:"no_token")})};window.addEventListener("message",U);const L=window.setTimeout(()=>{x||(x=!0,f(),y({ok:!1,error:"timeout"}))},l);try{window.postMessage({type:"DESAINR_EXTENSION_GET_TOKEN",from:"desainr-extension"},window.origin)}catch{x=!0,f(L),y({ok:!1,error:"post_message_failed"})}})}chrome.runtime.onMessage.addListener((l,y,x)=>{if((l==null?void 0:l.type)==="TOGGLE_OVERLAY"&&Qe(),(l==null?void 0:l.type)==="CONTEXT_MENU"&&bn(l.id,l.info),(l==null?void 0:l.type)==="DESAINR_GET_WEBAPP_ID_TOKEN")return xn().then(f=>x(f)),!0}),document.addEventListener("mouseup",()=>{setTimeout(()=>{yn().catch(()=>{})},100)}),document.addEventListener("contextmenu",l=>{const y=window.getSelection();y&&y.toString().trim()&&(l.preventDefault(),e&&e.show(l.pageX,l.pageY,x=>{m(x.id,x.label)}))});async function bn(l,y){var Y,j,ue,de,ke,Ee,Ae,Ce,$e;const{rewrite:x,translateChunks:f,analyzePage:U,saveMemo:L}=await S(async()=>{const{rewrite:F,translateChunks:$,analyzePage:P,saveMemo:ne}=await Promise.resolve().then(()=>Q);return{rewrite:F,translateChunks:$,analyzePage:P,saveMemo:ne}},void 0),{DEFAULT_TARGET_LANG:oe}=await S(async()=>{const{DEFAULT_TARGET_LANG:F}=await Promise.resolve().then(()=>Ne);return{DEFAULT_TARGET_LANG:F}},void 0),{applyReplacementOrCopyWithUndo:te}=await S(async()=>{const{applyReplacementOrCopyWithUndo:F}=await Promise.resolve().then(()=>wt);return{applyReplacementOrCopyWithUndo:F}},void 0),C=E();C.style.display="block";try{if(l==="desainr-refine"){C.textContent="Refining selection...";const F=((Y=window.getSelection())==null?void 0:Y.toString())||"",$=await((de=(j=chrome.storage)==null?void 0:(ue=j.local).get)==null?void 0:de.call(ue,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),P=$==null?void 0:$["desainr.settings.modelId"],ne=($==null?void 0:$["desainr.settings.thinkingMode"])||"none",Z=$==null?void 0:$["desainr.settings.userApiKey"],{ok:me,status:ge,json:ae,error:pe}=await x({selection:F,url:location.href,task:"clarify",modelId:P,thinkingMode:ne,userApiKey:Z});if(me&&(ae!=null&&ae.result)){const{outcome:we,undo:fe}=await te(ae.result);we==="replaced"?(C.textContent="Refined ✓ (replaced selection)",fe&&be(C,fe)):we==="copied"?C.textContent="Refined ✓ (copied)":C.textContent="Refined ✓"}else C.textContent=`Refine failed (${ge}): ${pe||"unknown"}`}else if(l==="desainr-translate"){C.textContent="Translating selection...";const F=((ke=window.getSelection())==null?void 0:ke.toString())||"",$=await((Ce=(Ee=chrome.storage)==null?void 0:(Ae=Ee.local).get)==null?void 0:Ce.call(Ae,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),P=($==null?void 0:$["desainr.settings.targetLang"])||oe,ne=$==null?void 0:$["desainr.settings.modelId"],Z=($==null?void 0:$["desainr.settings.thinkingMode"])||"none",me=$==null?void 0:$["desainr.settings.userApiKey"],{ok:ge,status:ae,json:pe,error:we}=await f({selection:F,url:location.href,targetLang:P,modelId:ne,thinkingMode:Z,userApiKey:me});if(ge&&(pe!=null&&pe.result)){const{outcome:fe,undo:Te}=await te(pe.result);fe==="replaced"?(C.textContent="Translated ✓ (replaced selection)",Te&&be(C,Te)):fe==="copied"?C.textContent="Translated ✓ (copied)":C.textContent="Translated ✓"}else C.textContent=`Translate failed (${ae}): ${we||"unknown"}`}else if(l==="desainr-save-memo"){C.textContent="Saving to memo...";const F=(($e=window.getSelection())==null?void 0:$e.toString())||"";if(!F)C.textContent="No text selected";else{const $={title:`Selection from ${document.title||location.hostname}`,content:F,url:location.href,type:"selection",metadata:{pageTitle:document.title,timestamp:new Date().toISOString()},tags:["selection","extension"]},{ok:P,json:ne,error:Z}=await L($);P&&ne?C.textContent=`✓ Saved to memo (ID: ${ne.memoId})`:C.textContent=`Save to memo failed: ${Z||"unknown"}`}}else if(l==="desainr-analyze"){C.textContent="Analyzing page...";const{ok:F,status:$,json:P,error:ne}=await U({url:location.href,title:document.title});F?fn(C,{summary:P==null?void 0:P.summary,keyPoints:P==null?void 0:P.keyPoints,links:P==null?void 0:P.links}):C.textContent=`Analyze failed (${$}): ${ne||"unknown"}`}else if(l==="desainr-translate-page"){C.textContent="Translating page...";const{translatePageAll:F}=await S(async()=>{const{translatePageAll:P}=await Promise.resolve().then(()=>dn);return{translatePageAll:P}},void 0),{DEFAULT_TARGET_LANG:$}=await S(async()=>{const{DEFAULT_TARGET_LANG:P}=await Promise.resolve().then(()=>Ne);return{DEFAULT_TARGET_LANG:P}},void 0);try{const P=await F($);C.textContent=`Translated page ✓ (${P.translated}/${P.totalNodes} nodes, skipped ${P.skipped})`}catch(P){C.textContent=`Translate page error: ${(P==null?void 0:P.message)||P}`}}else if(l==="desainr-toggle-parallel"){const{isParallelModeEnabled:F,enableParallelMode:$,disableParallelMode:P}=await S(async()=>{const{isParallelModeEnabled:Z,enableParallelMode:me,disableParallelMode:ge}=await Promise.resolve().then(()=>gn);return{isParallelModeEnabled:Z,enableParallelMode:me,disableParallelMode:ge}},void 0),{DEFAULT_TARGET_LANG:ne}=await S(async()=>{const{DEFAULT_TARGET_LANG:Z}=await Promise.resolve().then(()=>Ne);return{DEFAULT_TARGET_LANG:Z}},void 0);try{F()?(C.textContent="Disabling parallel translate...",P(),C.textContent="Parallel translate OFF"):(C.textContent="Enabling parallel translate...",await $(ne),C.textContent="Parallel translate ON")}catch(Z){C.textContent=`Parallel toggle error: ${(Z==null?void 0:Z.message)||Z}`}}else C.textContent=`Unknown action: ${l}`}catch(F){C.textContent=`Error: ${(F==null?void 0:F.message)||F}`}finally{setTimeout(()=>{try{W()}catch{}},800)}}})();const Ue="desainr.customActions";async function je(){try{return(await chrome.storage.local.get(Ue))[Ue]||[]}catch(i){return console.error("Error getting custom actions:",i),[]}}async function at(i){const e={...i,id:`custom-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,createdAt:new Date().toISOString()},n=await je();n.push(e),await chrome.storage.local.set({[Ue]:n});try{chrome.runtime.sendMessage({type:"CUSTOM_ACTIONS_UPDATED"})}catch{}return e}async function st(i,e){const n=await je(),t=n.findIndex(o=>o.id===i);if(t===-1)return!1;n[t]={...n[t],...e},await chrome.storage.local.set({[Ue]:n});try{chrome.runtime.sendMessage({type:"CUSTOM_ACTIONS_UPDATED"})}catch{}return!0}async function Lt(i,e){var o,a,c;const t=(await je()).find(p=>p.id===i);if(!t)return{ok:!1,error:"Custom action not found"};try{const{actions:p}=await S(async()=>{const{actions:_e}=await Promise.resolve().then(()=>Q);return{actions:_e}},void 0),d=await((c=(o=chrome.storage)==null?void 0:(a=o.local).get)==null?void 0:c.call(a,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),m=d==null?void 0:d["desainr.settings.modelId"],k=(d==null?void 0:d["desainr.settings.thinkingMode"])||"none",N=d==null?void 0:d["desainr.settings.userApiKey"],{ok:E,status:w,json:W,error:be}=await p({selection:e,clientMessage:e,customInstruction:t.prompt,modelId:m,thinkingMode:k,userApiKey:N});if(E&&(W!=null&&W.result))return{ok:!0,result:W.result};{const _e=(W==null?void 0:W.error)||be||"unknown";return{ok:!1,error:`Failed (${w}): ${_e}`}}}catch(p){return{ok:!1,error:(p==null?void 0:p.message)||String(p)}}}const rt=[{emoji:"✨",name:"Sparkles"},{emoji:"🎯",name:"Target"},{emoji:"💡",name:"Lightbulb"},{emoji:"🚀",name:"Rocket"},{emoji:"⚡",name:"Lightning"},{emoji:"🔥",name:"Fire"},{emoji:"💎",name:"Diamond"},{emoji:"🎨",name:"Art"},{emoji:"📝",name:"Memo"},{emoji:"🔧",name:"Wrench"},{emoji:"⚙️",name:"Gear"},{emoji:"🎭",name:"Theater"},{emoji:"🌟",name:"Star"},{emoji:"💫",name:"Dizzy"},{emoji:"🎪",name:"Circus"},{emoji:"🎬",name:"Clapper"},{emoji:"📌",name:"Pin"},{emoji:"🔖",name:"Bookmark"},{emoji:"📍",name:"Pushpin"},{emoji:"🎲",name:"Dice"}],Fe=Object.freeze(Object.defineProperty({__proto__:null,AVAILABLE_ICONS:rt,executeCustomAction:Lt,getCustomActions:je,saveCustomAction:at,updateCustomAction:st},Symbol.toStringTag,{value:"Module"}));class Pt{constructor(){J(this,"container",null);J(this,"shadowRoot",null);J(this,"onSave",null);J(this,"editingAction",null);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.renderModal()}createContainer(){const e=document.createElement("div");return e.id="desainr-custom-action-modal",Object.assign(e.style,{position:"fixed",inset:"0",zIndex:"2147483647",display:"none"}),document.documentElement.appendChild(e),e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      * { box-sizing: border-box; }
      
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .modal {
        background: linear-gradient(180deg, #ffffff 0%, #fafbff 100%);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow: auto;
        animation: slideUp 0.3s ease;
        border: 1px solid rgba(99, 102, 241, 0.2);
      }
      
      .header {
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 16px 16px 0 0;
      }
      
      .title {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
      }
      
      .close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 8px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        font-size: 20px;
        transition: background 0.2s;
      }
      
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .body {
        padding: 24px;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      .label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #374151;
        font-size: 14px;
      }
      
      .input, .textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1.5px solid #d1d5db;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        transition: all 0.2s;
        background: white;
      }
      
      .input:focus, .textarea:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }
      
      .textarea {
        resize: vertical;
        min-height: 80px;
        line-height: 1.5;
      }
      
      .hint {
        font-size: 12px;
        color: #6b7280;
        margin-top: 4px;
      }
      
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
        gap: 8px;
        margin-top: 8px;
      }
      
      .icon-btn {
        width: 48px;
        height: 48px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        background: white;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .icon-btn:hover {
        border-color: #a5b4fc;
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
      }
      
      .icon-btn.selected {
        border-color: #6366f1;
        background: #eef2ff;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }
      
      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .checkbox {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #6366f1;
      }
      
      .footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        background: #f9fafb;
        border-radius: 0 0 16px 16px;
      }
      
      .btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .btn-secondary {
        background: white;
        color: #374151;
        border: 1.5px solid #d1d5db;
      }
      
      .btn-secondary:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
      }
      
      .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .error {
        color: #dc2626;
        font-size: 13px;
        margin-top: 8px;
        display: none;
      }
      
      .error.show {
        display: block;
      }
    `,this.shadowRoot.appendChild(e)}renderModal(){if(!this.shadowRoot)return;const e=document.createElement("div");e.className="overlay",e.innerHTML=`
      <div class="modal">
        <div class="header">
          <h2 class="title">Create Custom Action</h2>
          <button class="close-btn" id="close-btn">×</button>
        </div>
        <div class="body">
          <div class="form-group">
            <label class="label" for="action-name">Action Name</label>
            <input 
              type="text" 
              id="action-name" 
              class="input" 
              placeholder="e.g., Make Professional"
              maxlength="50"
            />
            <div class="hint">This will appear in the action menu</div>
            <div class="error" id="name-error"></div>
          </div>
          
          <div class="form-group">
            <label class="label" for="action-prompt">AI Prompt</label>
            <textarea 
              id="action-prompt" 
              class="textarea" 
              placeholder="e.g., Make this text more professional and polished while keeping the core message"
            ></textarea>
            <div class="hint">Tell AI what to do with the selected text</div>
            <div class="error" id="prompt-error"></div>
          </div>
          
          <div class="form-group">
            <label class="label">Icon</label>
            <div class="icon-grid" id="icon-grid"></div>
            <div class="error" id="icon-error"></div>
          </div>
          
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="pin-action" class="checkbox" />
              <label for="pin-action" class="label" style="margin: 0;">Pin to quick access</label>
            </div>
            <div class="hint">Pinned actions appear directly in the toolbar</div>
          </div>
        </div>
        <div class="footer">
          <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="save-btn">Create Action</button>
        </div>
      </div>
    `,this.shadowRoot.appendChild(e);const n=this.shadowRoot.getElementById("icon-grid");n&&rt.forEach((t,o)=>{const a=document.createElement("button");a.className="icon-btn",a.textContent=t.emoji,a.title=t.name,a.dataset.icon=t.emoji,o===0&&a.classList.add("selected"),n.appendChild(a)}),this.setupEventListeners()}setupEventListeners(){if(!this.shadowRoot)return;const e=this.shadowRoot.getElementById("close-btn");e==null||e.addEventListener("click",()=>this.hide());const n=this.shadowRoot.getElementById("cancel-btn");n==null||n.addEventListener("click",()=>this.hide());const t=this.shadowRoot.querySelector(".overlay");t==null||t.addEventListener("click",p=>{p.target===t&&this.hide()});const o=this.shadowRoot.querySelectorAll(".icon-btn");o.forEach(p=>{p.addEventListener("click",()=>{o.forEach(d=>d.classList.remove("selected")),p.classList.add("selected")})});const a=this.shadowRoot.getElementById("save-btn");a==null||a.addEventListener("click",()=>this.handleSave());const c=this.shadowRoot.getElementById("action-name");c==null||c.addEventListener("keydown",p=>{p.key==="Enter"&&this.handleSave()})}async handleSave(){if(!this.shadowRoot)return;const e=this.shadowRoot.getElementById("action-name"),n=this.shadowRoot.getElementById("action-prompt"),t=this.shadowRoot.getElementById("pin-action"),o=this.shadowRoot.querySelector(".icon-btn.selected"),a=this.shadowRoot.getElementById("name-error"),c=this.shadowRoot.getElementById("prompt-error"),p=this.shadowRoot.getElementById("icon-error");a==null||a.classList.remove("show"),c==null||c.classList.remove("show"),p==null||p.classList.remove("show");let d=!1;if(e.value.trim()||(a&&(a.textContent="Action name is required",a.classList.add("show")),d=!0),n.value.trim()||(c&&(c.textContent="AI prompt is required",c.classList.add("show")),d=!0),o||(p&&(p.textContent="Please select an icon",p.classList.add("show")),d=!0),d)return;const m={label:e.value.trim(),prompt:n.value.trim(),icon:o.dataset.icon||"✨",isPinned:t.checked};try{if(this.editingAction)await st(this.editingAction.id,m);else{const k=await at(m);this.onSave&&this.onSave(k)}this.hide()}catch(k){console.error("Error saving custom action:",k),c&&(c.textContent="Failed to save action. Please try again.",c.classList.add("show"))}}show(e,n){if(this.container){if(this.onSave=e||null,this.editingAction=n||null,this.shadowRoot){const t=this.shadowRoot.querySelector(".title"),o=this.shadowRoot.getElementById("save-btn");if(this.editingAction){t&&(t.textContent="Edit Custom Action"),o&&(o.textContent="Save Changes");const c=this.shadowRoot.getElementById("action-name"),p=this.shadowRoot.getElementById("action-prompt"),d=this.shadowRoot.getElementById("pin-action");c&&(c.value=this.editingAction.label),p&&(p.value=this.editingAction.prompt),d&&(d.checked=this.editingAction.isPinned),this.shadowRoot.querySelectorAll(".icon-btn").forEach(k=>{k.classList.remove("selected"),k.dataset.icon===this.editingAction.icon&&k.classList.add("selected")})}else{t&&(t.textContent="Create Custom Action"),o&&(o.textContent="Create Action");const c=this.shadowRoot.getElementById("action-name"),p=this.shadowRoot.getElementById("action-prompt"),d=this.shadowRoot.getElementById("pin-action");c&&(c.value=""),p&&(p.value=""),d&&(d.checked=!1),this.shadowRoot.querySelectorAll(".icon-btn").forEach((k,N)=>{k.classList.toggle("selected",N===0)})}this.shadowRoot.querySelectorAll(".error").forEach(c=>c.classList.remove("show"))}this.container.style.display="block",setTimeout(()=>{var o;const t=(o=this.shadowRoot)==null?void 0:o.getElementById("action-name");t==null||t.focus()},100)}}hide(){this.container&&(this.container.style.display="none",this.onSave=null,this.editingAction=null)}destroy(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}const It=Object.freeze(Object.defineProperty({__proto__:null,CustomActionModal:Pt},Symbol.toStringTag,{value:"Module"})),Le={rewrite:{maxTokens:20,refillRate:.5,costPerCall:1},"translate-chunks":{maxTokens:30,refillRate:1,costPerCall:1},"analyze-page":{maxTokens:10,refillRate:.2,costPerCall:1},chat:{maxTokens:30,refillRate:.5,costPerCall:1},actions:{maxTokens:20,refillRate:.5,costPerCall:1},"memo/save":{maxTokens:50,refillRate:1,costPerCall:1},"slash-prompts":{maxTokens:10,refillRate:.5,costPerCall:1},default:{maxTokens:20,refillRate:.5,costPerCall:1}},ct="rateLimiter_";function lt(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function dt(i){var t;const e=`${ct}${i}`,n=Le[i]||Le.default;if(lt())return new Promise(o=>{chrome.storage.local.get(e,a=>{const c=a[e];c&&c.tokens!==void 0&&c.lastRefill!==void 0?o(c):o({tokens:n.maxTokens,lastRefill:Date.now()})})});try{const o=(t=globalThis==null?void 0:globalThis.localStorage)==null?void 0:t.getItem(e);if(o){const a=JSON.parse(o);if(a&&a.tokens!==void 0&&a.lastRefill!==void 0)return a}}catch{}return{tokens:n.maxTokens,lastRefill:Date.now()}}async function ut(i,e){var t;const n=`${ct}${i}`;if(lt())return new Promise(o=>{chrome.storage.local.set({[n]:e},o)});try{(t=globalThis==null?void 0:globalThis.localStorage)==null||t.setItem(n,JSON.stringify(e))}catch{}}function pt(i,e){const n=Date.now(),o=(n-i.lastRefill)/1e3*e.refillRate;return{tokens:Math.min(i.tokens+o,e.maxTokens),lastRefill:n}}async function St(i){const e=Le[i]||Le.default;let n=await dt(i);return n=pt(n,e),n.tokens<e.costPerCall?(await ut(i,n),!1):(n.tokens-=e.costPerCall,await ut(i,n),!0)}async function $t(i){const e=Le[i]||Le.default;let n=await dt(i);n=pt(n,e);const t=Math.max(0,e.costPerCall-n.tokens),o=t>0?t/e.refillRate:0;return{remainingTokens:Math.floor(n.tokens),maxTokens:e.maxTokens,timeUntilRefill:Math.ceil(o),canMakeCall:n.tokens>=e.costPerCall}}async function Pe(i,e){if(!await St(i)){const o=(await $t(i)).timeUntilRefill;return{ok:!1,status:429,error:`Rate limit exceeded. Please wait ${o} second${o!==1?"s":""} before trying again.`}}return new Promise(t=>{chrome.runtime.sendMessage({type:"API_CALL",path:i,body:e},o=>{if(!o)return t({ok:!1,status:0,error:"No response from background"});t(o)})})}function ht(i,e,n){const t=`${e&&(e.error||(e.message??""))||""} ${n||""}`.toLowerCase(),o=["quota","exhausted","insufficient","rate limit","resource has been exhausted","insufficient_quota","429","capacity"];return!!(i===429||i>=500&&o.some(a=>t.includes(a)))}function mt(i,e,n){const t=e&&(e.error||(e.message??""))||"",o=`${t} ${n||""}`.toLowerCase();return typeof t=="string"&&t.startsWith("UNAUTHORIZED")?!1:i===401||i===403?!0:["invalid api key","api key not valid","key invalid","missing api key","no api key","invalid authentication","unauthorized","forbidden","permission denied"].some(c=>o.includes(c))}function gt(i,e,n){const t=`${e&&(e.error||(e.message??""))||""} ${n||""}`.toLowerCase();return["billing","access not configured","permission not configured","project has been blocked","enable billing"].some(a=>t.includes(a))}function zt(i,e,n){const t=e&&(e.error||(e.message??""))||"";if(typeof t=="string"&&t.startsWith("UNAUTHORIZED"))return"Sign in is required or provide a Gemini API key in Settings (userApiKey).";if(mt(i,e,n))return"Invalid or unauthorized API key. Update your Gemini API key in Settings or sign in again.";if(gt(i,e,n))return"Billing or API access is not configured for this key/project. Enable billing in Google AI Studio or use another API key.";if(ht(i,e,n))return"AI capacity exhausted right now. Please try again in a bit, or switch the model/API key in settings.";if(i===401||i===403)return"Unauthorized. Please sign in again.";if(i===429)return"Too many requests. Please slow down and try again shortly.";if(i>=500)return"Server error. Please try again shortly."}async function Ie(i,e=3,n=100){let t;for(let o=0;o<e;o++){let a=await i();if(a.ok)return a;const c=zt(a.status,a.json,a.error);c&&(a={...a,error:c}),t=a;const p=!a.status||a.status===0||a.status>=500,d=ht(a.status,a.json,a.error),m=mt(a.status,a.json,a.error),k=gt(a.status,a.json,a.error);if(!p||d||m||k||a.status===401||a.status===403||a.status===400)break;await new Promise(N=>setTimeout(N,n*Math.pow(2,o)))}return t??{ok:!1,status:0,error:"Unknown error"}}async function Nt(i){return Ie(()=>Pe("rewrite",i))}async function Ot(i){return Ie(()=>Pe("translate-chunks",i))}async function Dt(i){return Ie(()=>Pe("translate-chunks",i))}async function Bt(i){return Ie(()=>Pe("analyze-page",i))}async function Ht(i){return Ie(()=>Pe("actions",i))}async function Ut(i){return Ie(()=>Pe("memo/save",i))}const Q=Object.freeze(Object.defineProperty({__proto__:null,actions:Ht,analyzePage:Bt,rewrite:Nt,saveMemo:Ut,translateChunks:Ot,translateChunksBatch:Dt},Symbol.toStringTag,{value:"Module"})),Ye={},jt=(Ye==null?void 0:Ye.VITE_DEFAULT_TARGET_LANG)||"en",Ne=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_TARGET_LANG:jt},Symbol.toStringTag,{value:"Module"}));function Ft(i,e){try{i.innerHTML=""}catch{}const n=i.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
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
  `,n.appendChild(t);const o=document.createElement("div");o.className="wrap",o.innerHTML=`
    <div class="hdr">
      <div class="ttl">DesAInR Overlay</div>
      <button id="ovl-close" title="Close">Close</button>
    </div>
    <div class="body">Overlay is mounted. This is a minimal stub implementation.</div>
  `,n.appendChild(o);const a=n.getElementById("ovl-close");return a&&a.addEventListener("click",()=>{try{e&&e()}catch{}}),{detach:()=>{try{i.parentNode&&i.parentNode.removeChild(i)}catch{}}}}const Vt=Object.freeze(Object.defineProperty({__proto__:null,mountOverlay:Ft},Symbol.toStringTag,{value:"Module"}));class Kt{constructor(e=50){J(this,"history",[]);J(this,"currentIndex",-1);J(this,"maxHistorySize",50);J(this,"listeners",new Set);this.maxHistorySize=e}addAction(e){const n=`undo-${Date.now()}-${Math.random()}`,t={...e,id:n,timestamp:Date.now()};return this.history=this.history.slice(0,this.currentIndex+1),this.history.push(t),this.currentIndex++,this.history.length>this.maxHistorySize&&(this.history=this.history.slice(-this.maxHistorySize),this.currentIndex=this.history.length-1),this.notifyListeners(),n}undo(){if(!this.canUndo())return!1;const n=this.history[this.currentIndex].undo();return n&&(this.currentIndex--,this.notifyListeners()),n}redo(){if(!this.canRedo())return!1;const e=this.history[this.currentIndex+1];if(!e.redo)return!1;const n=e.redo();return n&&(this.currentIndex++,this.notifyListeners()),n}canUndo(){return this.currentIndex>=0}canRedo(){var e;return this.currentIndex<this.history.length-1&&((e=this.history[this.currentIndex+1])==null?void 0:e.redo)!==void 0}getHistory(){return[...this.history]}getRecentActions(e=5){return this.history.slice(Math.max(0,this.currentIndex-e+1),this.currentIndex+1).reverse()}clear(){this.history=[],this.currentIndex=-1,this.notifyListeners()}clearOld(e){const n=Date.now()-e,t=this.history.findIndex(o=>o.timestamp>=n);t>0&&(this.history=this.history.slice(t),this.currentIndex=Math.max(-1,this.currentIndex-t),this.notifyListeners())}subscribe(e){return this.listeners.add(e),e(this.getHistory(),this.canUndo(),this.canRedo()),()=>{this.listeners.delete(e)}}notifyListeners(){const e=this.getHistory(),n=this.canUndo(),t=this.canRedo();this.listeners.forEach(o=>{o(e,n,t)})}}let qe=null;function Gt(){return qe||(qe=new Kt),qe}function Wt(i){if(!i)return!1;const e=i.tagName.toLowerCase();return e==="input"||e==="textarea"}async function ft(i){var e;try{if((e=navigator.clipboard)!=null&&e.writeText)return await navigator.clipboard.writeText(i),!0}catch{}try{const n=document.createElement("textarea");n.value=i,n.style.position="fixed",n.style.opacity="0",document.body.appendChild(n),n.focus(),n.select();const t=document.execCommand("copy");return document.body.removeChild(n),t}catch{return!1}}function vt(i){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const n=document.activeElement;if(Wt(n))try{const t=n,o=t.selectionStart??0,a=t.selectionEnd??o,c=t.value??"",p=c.slice(o,a);t.value=c.slice(0,o)+i+c.slice(a);const d=o+i.length;t.selectionStart=t.selectionEnd=d,t.dispatchEvent(new Event("input",{bubbles:!0}));const m={description:`Replace "${p.slice(0,20)}${p.length>20?"...":""}" with "${i.slice(0,20)}${i.length>20?"...":""}"`,undo:()=>{try{return t.value=c,t.selectionStart=o,t.selectionEnd=a,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}},redo:()=>{try{return t.value=c.slice(0,o)+i+c.slice(a),t.selectionStart=t.selectionEnd=o+i.length,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}}};return Gt().addAction(m),{undo:m.undo}}catch{}try{const t=e.getRangeAt(0),o=t.cloneContents(),a=t.cloneContents(),c=Array.from(a.childNodes).some(m=>m.nodeType!==Node.TEXT_NODE),p=t.endContainer!==t.startContainer;if(c&&p)return null;t.deleteContents();const d=document.createTextNode(i);return t.insertNode(d),t.setStartAfter(d),t.collapse(!0),e.removeAllRanges(),e.addRange(t),{undo:()=>{try{const m=d.parentNode;if(!m)return!1;const k=o.cloneNode(!0);return m.insertBefore(k,d),m.removeChild(d),!0}catch{return!1}}}}catch{return null}}async function Yt(i){const e=vt(i);return e?{outcome:"replaced",undo:e.undo}:await ft(i)?{outcome:"copied"}:{outcome:"failed"}}const wt=Object.freeze(Object.defineProperty({__proto__:null,applyReplacementOrCopyWithUndo:Yt,copyToClipboard:ft,replaceSelectionSafelyWithUndo:vt},Symbol.toStringTag,{value:"Module"}));function yt(i){if(!i)return!1;const e=i.tagName.toLowerCase();if(e==="input"||e==="textarea"){const t=i;return!t.disabled&&!t.readOnly}if(i.getAttribute("contenteditable")==="true")return!0;let n=i.parentElement;for(;n;){if(n.getAttribute("contenteditable")==="true")return!0;n=n.parentElement}return!1}function qt(){const i=document.activeElement;if(!i||!yt(i))return null;if(i.tagName==="INPUT"||i.tagName==="TEXTAREA"){const e=i,n=e.selectionStart||0,t=e.selectionEnd||0,o=e.value.substring(n,t);if(o)return{element:e,text:o,start:n,end:t}}else if(i.getAttribute("contenteditable")==="true"){const e=window.getSelection();if(e&&e.rangeCount>0){const n=e.toString();if(n)return{element:i,text:n,start:0,end:0}}}return null}function Xt(i,e,n,t){if(i.tagName==="INPUT"||i.tagName==="TEXTAREA"?i.value.substring(n,t):i.textContent,i.tagName==="INPUT"||i.tagName==="TEXTAREA"){const o=i,a=o.value;return o.value=o.value.substring(0,n)+e+o.value.substring(t),o.setSelectionRange(n+e.length,n+e.length),o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0})),()=>(o.value=a,o.setSelectionRange(n,t),o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0})),!0)}else if(i.getAttribute("contenteditable")==="true"){const o=window.getSelection(),a=i.innerHTML;if(o&&o.rangeCount>0){const c=o.getRangeAt(0);c.deleteContents();const p=document.createTextNode(e);return c.insertNode(p),c.setStartAfter(p),c.setEndAfter(p),o.removeAllRanges(),o.addRange(c),i.dispatchEvent(new Event("input",{bubbles:!0})),()=>(i.innerHTML=a,i.dispatchEvent(new Event("input",{bubbles:!0})),!0)}}return()=>!1}const Jt=Object.freeze(Object.defineProperty({__proto__:null,getEditableSelection:qt,isEditableElement:yt,replaceEditableSelection:Xt},Symbol.toStringTag,{value:"Module"}));function Qt(){const i=window.getSelection();if(!i||i.rangeCount===0)return null;const n=i.getRangeAt(0).getBoundingClientRect(),t=i.toString();if(!t.trim())return null;const o=n.left+window.scrollX,a=n.top+window.scrollY;return{text:t,rect:n,pageX:o,pageY:a}}const Zt=Object.freeze(Object.defineProperty({__proto__:null,getSelectionInfo:Qt},Symbol.toStringTag,{value:"Module"})),en=new Set(["script","style","noscript","template","textarea","input","select","option","code","pre","kbd","samp","var","svg","canvas","math","video","audio"]);function tn(i){if(!i)return!1;if(i.isContentEditable)return!0;const n=i.getAttribute("contenteditable");return n===""||n==="true"}function nn(i){if(!i)return!1;const e=i.tagName.toLowerCase();return e==="input"||e==="textarea"||e==="select"||e==="option"}function on(i){return!!(!i||en.has(i.tagName.toLowerCase())||nn(i)||tn(i))}function an(i){const e=getComputedStyle(i);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0"||i.hidden)return!0;const n=i.getBoundingClientRect();return n.width===0&&n.height===0}function sn(i){let e=i;for(;e;){if(on(e)||an(e))return!0;e=e.parentElement}return!1}function rn(i,e=5){const n=[];let t=i,o=0;for(;t&&o<e;){const a=t.tagName.toLowerCase(),c=t.id?`#${t.id}`:"",p=t.className&&typeof t.className=="string"?`.${t.className.trim().split(/\s+/).slice(0,2).join(".")}`:"";n.unshift(`${a}${c}${p}`),t=t.parentElement,o++}return n.join(">")}function Xe(i=document.body){const e=[],n=document.createTreeWalker(i,NodeFilter.SHOW_TEXT,{acceptNode:o=>{if(o.nodeType!==Node.TEXT_NODE)return NodeFilter.FILTER_REJECT;const a=o.data;if(!a||!a.trim())return NodeFilter.FILTER_REJECT;const c=o.parentElement;return!c||c.closest&&c.closest(".desainr-parallel-wrapper")||sn(c)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let t=n.nextNode();for(;t;){const o=t,a=o.parentElement;e.push({node:o,text:o.data,index:e.length,parent:a,path:rn(a)}),t=n.nextNode()}return e}function xt(i){return i.map(e=>e.text)}async function cn(i,e,n){const t=new Array(i.length);let o=0,a=0;return new Promise((c,p)=>{const d=()=>{for(;a<e&&o<i.length;){const m=o++;a++,Promise.resolve(n(i[m],m)).then(k=>{t[m]=k,a--,o>=i.length&&a===0?c(t):d()}).catch(k=>{t[m]=void 0,a--,o>=i.length&&a===0?c(t):d()})}};i.length===0?c(t):d()})}async function ln(i,e=3,n=400){var N;const{translateChunksBatch:t,translateChunks:o}=await S(async()=>{const{translateChunksBatch:E,translateChunks:w}=await Promise.resolve().then(()=>Q);return{translateChunksBatch:E,translateChunks:w}},void 0),a=Xe(),c=a.slice(0,n),p=xt(c);let d=[],m=!1;try{const E=await t({chunks:p,url:location.href,targetLang:i});E.ok&&Array.isArray((N=E.json)==null?void 0:N.results)&&(d=E.json.results??[],m=!0)}catch{}(!m||d.length!==p.length)&&(d=await cn(p,e,async E=>{var W;const w=await o({selection:E,url:location.href,targetLang:i});return w.ok&&((W=w.json)!=null&&W.result)?w.json.result:E}));let k=0;for(let E=0;E<c.length;E++)try{const w=d[E];typeof w=="string"&&w!==c[E].text&&(c[E].node.data=w,k++)}catch{}return{totalNodes:a.length,translated:k,skipped:c.length-k}}const dn=Object.freeze(Object.defineProperty({__proto__:null,collectTextNodes:Xe,snapshotTexts:xt,translatePageAll:ln},Symbol.toStringTag,{value:"Module"})),Oe="desainr-parallel-wrapper",bt="desainr-parallel-original",kt="desainr-parallel-translated",Et="desainr-parallel-style";let ye=!1,De=null;function un(){if(document.getElementById(Et))return;const i=document.createElement("style");i.id=Et,i.textContent=`
    .${Oe} { display: inline; white-space: pre-wrap; }
    .${bt} { opacity: 0.95; }
    .${kt} { opacity: 0.75; color: #555; margin-left: 0.4em; }
  `,document.documentElement.appendChild(i)}async function Je(i,e){var o;const{translateChunks:n}=await S(async()=>{const{translateChunks:a}=await Promise.resolve().then(()=>Q);return{translateChunks:a}},void 0),t=await n({selection:i,url:location.href,targetLang:e});return t.ok&&((o=t.json)!=null&&o.result)?t.json.result:i}function Ve(i,e){const n=i.parentElement;if(!n||n.closest&&n.closest(`.${Oe}`))return;const t=i.data,o=document.createElement("span");o.className=Oe,o.dataset.orig=t;const a=document.createElement("span");a.className=bt,a.textContent=t;const c=document.createElement("span");c.className=kt,c.textContent=e,o.appendChild(a),o.appendChild(document.createTextNode(" ")),o.appendChild(c),n.replaceChild(o,i)}function At(i){return!!i&&i.classList.contains(Oe)}function pn(){var e;if(!ye)return;ye=!1,De&&(De.disconnect(),De=null);const i=Array.from(document.querySelectorAll(`.${Oe}`));for(const n of i){const t=((e=n.dataset)==null?void 0:e.orig)??"",o=document.createTextNode(t);n.parentNode&&n.parentNode.replaceChild(o,n)}}function hn(){return ye}async function mn(i){var p;if(ye)return;ye=!0,un();const t=Xe().slice(0,400),{DEFAULT_TARGET_LANG:o}=await S(async()=>{const{DEFAULT_TARGET_LANG:d}=await Promise.resolve().then(()=>Ne);return{DEFAULT_TARGET_LANG:d}},void 0),a=i||o;let c=!1;try{const{translateChunksBatch:d}=await S(async()=>{const{translateChunksBatch:E}=await Promise.resolve().then(()=>Q);return{translateChunksBatch:E}},void 0),m=t.map(E=>E.text),k=await d({chunks:m,url:location.href,targetLang:a}),N=(p=k.json)==null?void 0:p.results;if(k.ok&&Array.isArray(N)&&N.length===t.length){for(let E=0;E<t.length;E++)try{Ve(t[E].node,N[E])}catch{}c=!0}}catch{}if(!c){let m=0;async function k(){if(!ye)return;const N=m++;if(N>=t.length)return;const E=t[N];try{const w=await Je(E.text,a);Ve(E.node,w)}catch{}await k()}await Promise.all(new Array(3).fill(0).map(()=>k()))}De=new MutationObserver(async d=>{if(ye)for(const m of d)if(m.type==="characterData"&&m.target.nodeType===Node.TEXT_NODE){const k=m.target,N=k.parentElement;if(!N||At(N))continue;const E=k.data;if(E&&E.trim())try{const w=await Je(E,a);if(!ye)return;Ve(k,w)}catch{}}else m.type==="childList"&&m.addedNodes.forEach(async k=>{if(k.nodeType===Node.TEXT_NODE){const N=k,E=N.parentElement;if(!E||At(E))return;const w=N.data;if(w&&w.trim())try{const W=await Je(w,a);if(!ye)return;Ve(N,W)}catch{}}})}),De.observe(document.body,{subtree:!0,childList:!0,characterData:!0})}const gn=Object.freeze(Object.defineProperty({__proto__:null,disableParallelMode:pn,enableParallelMode:mn,isParallelModeEnabled:hn},Symbol.toStringTag,{value:"Module"}))})();
