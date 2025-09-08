var an=Object.defineProperty;var sn=(we,he,_e)=>he in we?an(we,he,{enumerable:!0,configurable:!0,writable:!0,value:_e}):we[he]=_e;var te=(we,he,_e)=>sn(we,typeof he!="symbol"?he+"":he,_e);(function(){"use strict";const we="modulepreload",he=function(n){return"/"+n},_e={},I=function(e,i,t){let o=Promise.resolve();function r(d){const v=new Event("vite:preloadError",{cancelable:!0});if(v.payload=d,window.dispatchEvent(v),!v.defaultPrevented)throw d}return o.then(d=>{for(const v of d||[])v.status==="rejected"&&r(v.reason);return e().catch(r)})},ht={background:"#0f0f0f",surface:"#1a1a1a",surfaceHover:"#262626",surfaceActive:"#333333",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#ffffff",textSecondary:"#a1a1aa",textMuted:"#71717a",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#262626",borderLight:"#374151",shadow:"rgba(0, 0, 0, 0.8)",shadowLight:"rgba(0, 0, 0, 0.4)"},mt={background:"#ffffff",surface:"#f8fafc",surfaceHover:"#f1f5f9",surfaceActive:"#e2e8f0",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#1e293b",textSecondary:"#475569",textMuted:"#64748b",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#e2e8f0",borderLight:"#cbd5e1",shadow:"rgba(0, 0, 0, 0.15)",shadowLight:"rgba(0, 0, 0, 0.08)"},ft=()=>typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":"dark",Ge=()=>ft()==="dark"?ht:mt,a={colors:Ge(),updateTheme(){this.colors=Ge()},watchThemeChanges(n){typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.updateTheme(),n()})},featureIcons:{refine:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',translate:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 4h2.764L13 9.236 11.618 12z"></path></svg>',rewrite:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',analyze:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',explain:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>',correct:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',expand:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',chatPersonal:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>',chatPro:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',copy:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>',settings:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',customize:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>'},featureCategories:{"Quick Actions":{title:"Quick Actions",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>',description:"Fast access to common tools"},"Content Tools":{title:"Content Tools",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',description:"Text editing and enhancement"},"AI Chat":{title:"AI Chat",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>',description:"AI-powered conversations"},Advanced:{title:"Advanced",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',description:"Advanced features and settings"}},spacing:{xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},borderRadius:{sm:"6px",md:"8px",lg:"12px",xl:"16px",full:"9999px"},typography:{fontFamily:'"Inter", "Segoe UI", system-ui, sans-serif',fontSize:{xs:"12px",sm:"13px",base:"14px",lg:"16px",xl:"18px"},fontWeight:{normal:"400",medium:"500",semibold:"600",bold:"700"},lineHeight:{tight:"1.25",normal:"1.4",relaxed:"1.6"}},animation:{fast:"150ms ease-out",normal:"250ms ease-out",slow:"350ms ease-out"},shadows:{sm:"0 2px 4px rgba(0, 0, 0, 0.4)",md:"0 4px 12px rgba(0, 0, 0, 0.6)",lg:"0 8px 24px rgba(0, 0, 0, 0.8)",glow:"0 0 20px rgba(139, 92, 246, 0.3)"},zIndex:{tooltip:1e3,dropdown:1100,overlay:1200,modal:1300,toast:1400,max:2147483647}},ne={summarize:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
  </svg>`},Ne=[{id:"refine",label:"Refine",icon:ne.refine,shortcut:"R",isPinned:!0},{id:"translate",label:"Translate",icon:ne.translate,shortcut:"T",isPinned:!0},{id:"rephrase",label:"Rephrase",icon:ne.rewrite,isPinned:!1},{id:"summarize",label:"Summarize",icon:ne.summarize,isPinned:!1},{id:"add-details",label:"Add Details",icon:ne.plusCircle,isPinned:!1},{id:"more-informative",label:"More Informative",icon:ne.info,isPinned:!1},{id:"simplify",label:"Simplify",icon:ne.simplify,isPinned:!1},{id:"emojify",label:"Emojify",icon:ne.emoji,isPinned:!1},{id:"analyze",label:"Analyze",icon:ne.analyze,shortcut:"A",isPinned:!1},{id:"explain",label:"Explain",icon:ne.explain,shortcut:"E",isPinned:!1},{id:"correct",label:"Correct Grammar",icon:ne.grammar,shortcut:"C",isPinned:!1},{id:"expand",label:"Expand Text",icon:ne.expand,shortcut:"X",isPinned:!1},{id:"designer-chat",label:"Designer",icon:ne.chat,shortcut:"D",isPinned:!1},{id:"customize",label:"Customize Actions",icon:ne.custom,shortcut:"M",isPinned:!1}];class Ke{constructor(){te(this,"container",null);te(this,"shadowRoot",null);te(this,"actions",Ne);te(this,"onActionClick",null);te(this,"maxPinned",9);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions(),a.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
      position: fixed;
      z-index: ${a.zIndex.max};
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
    `,e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      :host {
        --monica-bg: ${a.colors.background};
        --monica-surface: ${a.colors.surface};
        --monica-surface-hover: ${a.colors.surfaceHover};
        --monica-surface-active: ${a.colors.surfaceActive};
        --monica-primary: ${a.colors.primary};
        --monica-primary-hover: ${a.colors.primaryHover};
        --monica-primary-active: ${a.colors.primaryActive};
        --monica-text-primary: ${a.colors.textPrimary};
        --monica-text-secondary: ${a.colors.textSecondary};
        --monica-text-muted: ${a.colors.textMuted};
        --monica-border: ${a.colors.border};
        --monica-shadow: ${a.colors.shadow};
        --monica-transition: ${a.animation.fast};
        --monica-radius: ${a.borderRadius.md};
      }
      
      .monica-menu {
        position: fixed;
        background: var(--monica-surface);
        color: var(--monica-text-primary);
        font-size: 0.95em;
        border: 1px solid var(--monica-border);
        border-radius: ${a.borderRadius.lg};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        min-width: 260px;
        max-width: 380px;
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden; /* remove bottom scrollbar */
        scrollbar-width: thin; /* Firefox minimal scrollbar */
        scrollbar-color: var(--monica-border) transparent;
        padding: ${a.spacing.sm} 0;
        opacity: 0;
        transform: scale(0.98) translateY(-4px);
        transition: all ${a.animation.fast};
        pointer-events: auto;
        z-index: ${a.zIndex.max};
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
        margin-bottom: ${a.spacing.xs};
      }
      
      .category-header {
        display: flex;
        align-items: center;
        gap: ${a.spacing.xs};
        padding: ${a.spacing.xs} ${a.spacing.sm};
        font-size: ${a.typography.fontSize.xs};
        font-weight: ${a.typography.fontWeight.semibold};
        color: var(--monica-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: ${a.spacing.xs};
      }
      
      .menu-item {
        display: flex;
        align-items: center;
        gap: ${a.spacing.sm};
        padding: ${a.spacing.sm} ${a.spacing.md};
        border-radius: ${a.borderRadius.md};
        cursor: pointer;
        transition: all ${a.animation.fast};
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
        transition: color ${a.animation.fast};
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
        font-weight: ${a.typography.fontWeight.medium};
        line-height: ${a.typography.lineHeight.tight};
        min-width: 0; /* allow flex item to shrink to avoid horizontal overflow */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .item-shortcut {
        font-size: ${a.typography.fontSize.xs};
        color: var(--monica-text-muted);
        font-weight: ${a.typography.fontWeight.normal};
        background: var(--monica-surface-hover);
        padding: 1px 5px;
        border-radius: ${a.borderRadius.sm};
      }

      .menu-item.featured .item-shortcut {
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
      }

      .item-pin {
        margin-left: ${a.spacing.sm};
        color: var(--monica-text-muted);
        background: transparent;
        border: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${a.borderRadius.sm};
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
        transition: opacity ${a.animation.fast};
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
        margin: ${a.spacing.sm} 0;
      }
      
      .menu-footer {
        padding: ${a.spacing.sm} ${a.spacing.lg};
        text-align: center;
        font-size: ${a.typography.fontSize.xs};
        color: var(--monica-text-muted);
        border-top: 1px solid var(--monica-border);
        margin-top: ${a.spacing.sm};
      }
      
      .powered-by {
        opacity: 0.7;
        transition: opacity ${a.animation.fast};
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
        transition: left ${a.animation.normal};
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
          padding: ${a.spacing.sm} ${a.spacing.md};
        }
      }
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const i=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||[];this.actions=this.actions.map(t=>({...t,isPinned:i.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}async savePinnedActions(){var e,i;try{const t=this.actions.filter(o=>o.isPinned).map(o=>o.id).slice(0,this.maxPinned);await chrome.storage.sync.set({"desainr.pinnedActions":t});try{(i=(e=chrome==null?void 0:chrome.runtime)==null?void 0:e.sendMessage)==null||i.call(e,{type:"SAVE_PINNED_ACTIONS",pinnedIds:t})}catch(o){console.warn("Broadcast SAVE_PINNED_ACTIONS failed:",o)}}catch(t){console.warn("Failed to save pinned actions:",t)}}togglePin(e){const i=this.actions.findIndex(o=>o.id===e);if(i===-1)return;const t=this.actions[i];if(t.isPinned)t.isPinned=!1;else{if(this.actions.filter(r=>r.isPinned).length>=this.maxPinned)return;t.isPinned=!0}this.savePinnedActions(),this.refreshMenuUI()}refreshMenuUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-menu");if(!e)return;const i=e.style.left,t=e.style.top;e.remove();const o=this.renderMenu();this.shadowRoot.appendChild(o),o.classList.add("show"),i&&(o.style.left=i),t&&(o.style.top=t)}renderMenu(){const e=document.createElement("div");e.className="monica-menu",this.actions.filter(o=>o.isPinned||!this.actions.some(r=>r.isPinned&&r.id===o.id)).forEach(o=>{const r=document.createElement("div");r.className=`menu-item ${o.isPinned?"pinned":""}`;const d=ne.memo;r.innerHTML=`
        <div class="item-icon">${o.icon}</div>
        <div class="item-label">${o.label}</div>
        ${o.shortcut?`<div class="item-shortcut">${o.shortcut}</div>`:""}
        <button class="item-pin" title="${o.isPinned?"Unpin":"Pin"}" aria-label="${o.isPinned?"Unpin":"Pin"}">
          ${d}
        </button>
        <div class="pin-indicator"></div>
      `,r.addEventListener("click",()=>{var x;this.hide(),(x=this.onActionClick)==null||x.call(this,o)});const v=r.querySelector(".item-pin");if(v){v.setAttribute("aria-pressed",o.isPinned?"true":"false");const x=v.querySelector("svg");x&&(o.isPinned?x.classList.add("filled"):x.classList.remove("filled")),v.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation(),this.togglePin(o.id)})}e.appendChild(r)});const t=document.createElement("div");return t.className="menu-footer",t.innerHTML=`
      <div class="powered-by">Powered by DesAInR ✨</div>
    `,e.appendChild(t),e}show(e,i,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t;const o=this.shadowRoot.querySelector(".monica-menu");o&&o.remove();const r=this.renderMenu();if(this.shadowRoot.appendChild(r),!document.body)return;document.body.appendChild(this.container);const d={width:window.innerWidth,height:window.innerHeight},v=r.getBoundingClientRect();let x=e,k=i;e+v.width>d.width-20&&(x=Math.max(20,e-v.width)),i+v.height>d.height-20&&(k=Math.max(20,i-v.height)),r.style.left=`${x}px`,r.style.top=`${k}px`,requestAnimationFrame(()=>{r.classList.add("show")});const $=N=>{const E=N.target,g=E&&E||null;(!g||!r.contains(g))&&(this.hide(),document.removeEventListener("click",$))};setTimeout(()=>{document.addEventListener("click",$)},100)}hide(){var i;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(".monica-menu");e&&(e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}updateActions(e){this.actions=e}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}const gt=Object.freeze(Object.defineProperty({__proto__:null,DefaultActions:Ne,MonicaStyleContextMenu:Ke},Symbol.toStringTag,{value:"Module"})),We=["refine","translate","rephrase","summarize"],je=Ne.map(n=>({id:n.id,label:n.label.replace(" Selection",""),icon:n.icon,shortcut:n.shortcut,isPinned:n.isPinned,category:n.category}));class yt{constructor(){te(this,"container",null);te(this,"shadowRoot",null);te(this,"actions",je);te(this,"onActionClick",null);te(this,"isVisible",!1);te(this,"pinnedIds",We);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions();try{chrome.runtime.onMessage.addListener(e=>{(e==null?void 0:e.type)==="SAVE_PINNED_ACTIONS"&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}try{chrome.storage.onChanged.addListener((e,i)=>{i==="sync"&&e["desainr.pinnedActions"]&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}a.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
      position: fixed;
      z-index: ${a.zIndex.overlay};
      pointer-events: none;
      top: 0;
      left: 0;
    `,e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      :host {
        --monica-bg: ${a.colors.background};
        --monica-surface: ${a.colors.surface};
        --monica-surface-hover: ${a.colors.surfaceHover};
        --monica-primary: ${a.colors.primary};
        --monica-primary-hover: ${a.colors.primaryHover};
        --monica-text-primary: ${a.colors.textPrimary};
        --monica-text-secondary: ${a.colors.textSecondary};
        --monica-border: ${a.colors.border};
        --monica-shadow: ${a.shadows.lg};
        --monica-radius: ${a.borderRadius.lg};
        --monica-font: ${a.typography.fontFamily};
        --monica-transition: ${a.animation.fast};
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
        font-family: ${a.typography.fontFamily};
        font-size: 11px;
        opacity: 0;
        transform: scale(0.95) translateY(-4px);
        transition: all ${a.animation.fast};
        z-index: ${a.zIndex.overlay};
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
        transition: all ${a.animation.fast};
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
        font-weight: ${a.typography.fontWeight.bold};
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
        transition: all ${a.animation.fast};
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
        padding: ${a.spacing.xs} ${a.spacing.sm};
        border-radius: ${a.borderRadius.sm};
        font-size: ${a.typography.fontSize.xs};
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--monica-transition);
        margin-bottom: ${a.spacing.xs};
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
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const i=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||We;this.pinnedIds=i.slice(0,9),this.actions=je.map(t=>({...t,isPinned:i.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}refreshToolbarUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-toolbar");if(!e)return;const{left:i,top:t}=e.style;e.remove();const o=this.renderToolbar();this.shadowRoot.appendChild(o),o.classList.add("show"),i&&(o.style.left=i),t&&(o.style.top=t)}renderToolbar(){const e=document.createElement("div");e.className="monica-toolbar";const i=this.pinnedIds.map(o=>this.actions.find(r=>r.id===o&&r.isPinned)).filter(o=>!!o).slice(0,10);if(i.forEach((o,r)=>{const d=document.createElement("div");d.className=`toolbar-action ${r===0?"featured":""}`,d.innerHTML=`
        <div class="action-icon">${o.icon}</div>
        <div class="action-label">${o.label}</div>
        <div class="tooltip">${o.label}</div>
      `,d.addEventListener("click",v=>{var x;v.preventDefault(),v.stopPropagation(),(x=this.onActionClick)==null||x.call(this,o)}),e.appendChild(d)}),i.length>0){const o=document.createElement("div");o.className="toolbar-divider",e.appendChild(o)}const t=document.createElement("div");return t.className="more-button",t.innerHTML=`
      <div class="action-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </div>
      <div class="action-label">More</div>
      <div class="tooltip">More actions</div>
    `,t.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const r=t.getBoundingClientRect();this.showContextMenu(r.left,r.bottom)}),e.appendChild(t),e}showContextMenu(e,i){I(async()=>{const{MonicaStyleContextMenu:t}=await Promise.resolve().then(()=>gt);return{MonicaStyleContextMenu:t}},void 0).then(({MonicaStyleContextMenu:t})=>{new t().show(e,i,r=>{var d;(d=this.onActionClick)==null||d.call(this,r)})}).catch(()=>{console.log("More actions menu clicked"),alert("More actions menu - Context menu integration pending")})}show(e,i,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t,this.isVisible=!0;const o=this.shadowRoot.querySelector(".monica-toolbar");o&&o.remove();const r=this.renderToolbar();if(this.shadowRoot.appendChild(r),!document.body)return;document.body.appendChild(this.container);const d={width:window.innerWidth},v=r.getBoundingClientRect();let x=e-v.width/2,k=i-v.height-8;x<10&&(x=10),x+v.width>d.width-10&&(x=d.width-v.width-10),k<10&&(k=i+8),r.style.left=`${x}px`,r.style.top=`${k}px`,requestAnimationFrame(()=>{r.classList.add("show")});const $=N=>{var ve;const E=N.target,g=E&&E||null,oe=document.getElementById("desainr-result-popup"),Ee=(ve=N.composedPath)==null?void 0:ve.call(N),He=oe?Ee?Ee.includes(oe):g?oe.contains(g):!1:!1;(!g||!r.contains(g)&&!He)&&(this.hide(),document.removeEventListener("click",$))};setTimeout(()=>{document.addEventListener("click",$)},100)}hide(){var i;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(".monica-toolbar");e&&(this.isVisible=!1,e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}isShown(){return this.isVisible}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}(()=>{const n="desainr-overlay-root";let e=null,i=null,t=null,o="",r=null;function d(){try{const c=window.getSelection(),f=(c==null?void 0:c.toString())||"";if(f&&f.trim()){o=f;try{r=c&&c.rangeCount?c.getRangeAt(0).cloneRange():null}catch{r=null}}}catch{}}document.addEventListener("selectionchange",d,!0);function v(){let c="",f=null;try{const m=window.getSelection();if(c=(m==null?void 0:m.toString())||"",m&&m.rangeCount)try{f=m.getRangeAt(0).getBoundingClientRect()}catch{}}catch{}if(!c.trim()&&o.trim()){c=o;try{f=r?r.getBoundingClientRect():f}catch{}}return{text:c,rect:f}}(()=>{e||(e=new Ke),i||(i=new yt)})();async function k(c,f){var m,p,D,R,J,q,b,G,O,re,ie,me,fe,ge,ye,Te,H,_,C,Y,W,ce,h,T,P,L,B,j,Q,Z,le,ae,ee,de,ue,Ce,ut,pt;try{if(c==="refine"){const{text:w,rect:s}=v();if(!w.trim()){g("No text selected","warning");return}try{await A("Refine",w,"Working…",s||void 0);const M=await((D=(m=chrome.storage)==null?void 0:(p=m.local).get)==null?void 0:D.call(p,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),z=M==null?void 0:M["desainr.settings.modelId"],V=(M==null?void 0:M["desainr.settings.thinkingMode"])||"none",U=M==null?void 0:M["desainr.settings.userApiKey"],{rewrite:F}=await I(async()=>{const{rewrite:Ve}=await Promise.resolve().then(()=>X);return{rewrite:Ve}},void 0),{ok:l,status:K,json:y,error:Le}=await F({selection:w,url:location.href,task:"clarify",modelId:z,thinkingMode:V,userApiKey:U});if(l&&(y!=null&&y.result))await A("Refine",w,y.result,s||void 0);else{const Ve=Le||(y==null?void 0:y.error)||"unknown";await A("Refine",w,`Failed (${K}): ${Ve}`,s||void 0)}}catch(M){await A("Refine",w,`Error: ${(M==null?void 0:M.message)||M}`,s||void 0)}return}const{text:u,rect:S}=v();if(c==="translate"){if(!u.trim()){g("No text selected","warning");return}try{await A("Translate",u,"Working…",S||void 0);const w=await((q=(R=chrome.storage)==null?void 0:(J=R.local).get)==null?void 0:q.call(J,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),s=(w==null?void 0:w["desainr.settings.targetLang"])||(await I(async()=>{const{DEFAULT_TARGET_LANG:l}=await Promise.resolve().then(()=>Me);return{DEFAULT_TARGET_LANG:l}},void 0)).DEFAULT_TARGET_LANG,M=w==null?void 0:w["desainr.settings.modelId"],z=(w==null?void 0:w["desainr.settings.thinkingMode"])||"none",V=w==null?void 0:w["desainr.settings.userApiKey"],{translateChunks:U}=await I(async()=>{const{translateChunks:l}=await Promise.resolve().then(()=>X);return{translateChunks:l}},void 0);let F=await U({selection:u,url:location.href,targetLang:s,modelId:M,thinkingMode:z,userApiKey:V});if(F.ok&&((b=F.json)!=null&&b.result))await A("Translate",u,F.json.result,S||void 0);else{const{actions:l}=await I(async()=>{const{actions:Le}=await Promise.resolve().then(()=>X);return{actions:Le}},void 0),K=`Translate the following text into ${s}. Return only the translation, no comments.`,y=await l({selection:u,clientMessage:u,customInstruction:K,modelId:M,thinkingMode:z,userApiKey:V});if(y.ok&&((G=y.json)!=null&&G.result))await A("Translate",u,y.json.result,S||void 0);else{const Le=y.error||((O=y.json)==null?void 0:O.error)||F.error||((re=F.json)==null?void 0:re.error)||"unknown";await A("Translate",u,`Failed (${y.status||F.status}): ${Le}`,S||void 0)}}}catch(w){await A("Translate",u,`Error: ${(w==null?void 0:w.message)||w}`,S||void 0)}}else if(c==="expand"){if(!u.trim()){g("No text selected","warning");return}const{rewrite:w}=await I(async()=>{const{rewrite:y}=await Promise.resolve().then(()=>X);return{rewrite:y}},void 0);await A("Expand",u,"Working…",S||void 0);const s=await((fe=(ie=chrome.storage)==null?void 0:(me=ie.local).get)==null?void 0:fe.call(me,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,url:location.href,task:"expand",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("Expand",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("Expand",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="correct"){if(!u.trim()){g("No text selected","warning");return}const{rewrite:w}=await I(async()=>{const{rewrite:y}=await Promise.resolve().then(()=>X);return{rewrite:y}},void 0);await A("Correct Grammar",u,"Working…",S||void 0);const s=await((Te=(ge=chrome.storage)==null?void 0:(ye=ge.local).get)==null?void 0:Te.call(ye,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,url:location.href,task:"grammar",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("Correct Grammar",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("Correct Grammar",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="explain"){if(!u.trim()){g("No text selected","warning");return}const{actions:w}=await I(async()=>{const{actions:y}=await Promise.resolve().then(()=>X);return{actions:y}},void 0);await A("Explain",u,"Working…",S||void 0);const s=await((C=(H=chrome.storage)==null?void 0:(_=H.local).get)==null?void 0:C.call(_,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,clientMessage:u,customInstruction:"Explain this clearly",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("Explain",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("Explain",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="rephrase"){if(!u.trim()){g("No text selected","warning");return}const{actions:w}=await I(async()=>{const{actions:y}=await Promise.resolve().then(()=>X);return{actions:y}},void 0);await A("Rephrase",u,"Working…",S||void 0);const s=await((ce=(Y=chrome.storage)==null?void 0:(W=Y.local).get)==null?void 0:ce.call(W,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,clientMessage:u,customInstruction:"Rephrase the following text to be clearer and more natural while preserving meaning. Return only the rephrased text.",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("Rephrase",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("Rephrase",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="summarize"){if(!u.trim()){g("No text selected","warning");return}const{actions:w}=await I(async()=>{const{actions:y}=await Promise.resolve().then(()=>X);return{actions:y}},void 0);await A("Summarize",u,"Working…",S||void 0);const s=await((P=(h=chrome.storage)==null?void 0:(T=h.local).get)==null?void 0:P.call(T,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,clientMessage:u,customInstruction:"Summarize the following text concisely in 1-3 sentences. Return only the summary.",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("Summarize",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("Summarize",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="add-details"){if(!u.trim()){g("No text selected","warning");return}const{actions:w}=await I(async()=>{const{actions:y}=await Promise.resolve().then(()=>X);return{actions:y}},void 0);await A("Add Details",u,"Working…",S||void 0);const s=await((j=(L=chrome.storage)==null?void 0:(B=L.local).get)==null?void 0:j.call(B,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,clientMessage:u,customInstruction:"Add helpful, concrete details to the following text while preserving tone and meaning. Return only the improved text.",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("Add Details",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("Add Details",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="more-informative"){if(!u.trim()){g("No text selected","warning");return}const{actions:w}=await I(async()=>{const{actions:y}=await Promise.resolve().then(()=>X);return{actions:y}},void 0);await A("More Informative",u,"Working…",S||void 0);const s=await((le=(Q=chrome.storage)==null?void 0:(Z=Q.local).get)==null?void 0:le.call(Z,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,clientMessage:u,customInstruction:"Make the following text more informative by adding succinct, factual context. Keep it concise. Return only the revised text.",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("More Informative",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("More Informative",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="simplify"){if(!u.trim()){g("No text selected","warning");return}const{actions:w}=await I(async()=>{const{actions:y}=await Promise.resolve().then(()=>X);return{actions:y}},void 0);await A("Simplify",u,"Working…",S||void 0);const s=await((de=(ae=chrome.storage)==null?void 0:(ee=ae.local).get)==null?void 0:de.call(ee,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,clientMessage:u,customInstruction:"Simplify the following text to be easier to understand, using plain language. Return only the simplified text.",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("Simplify",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("Simplify",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="emojify"){if(!u.trim()){g("No text selected","warning");return}const{actions:w}=await I(async()=>{const{actions:y}=await Promise.resolve().then(()=>X);return{actions:y}},void 0);await A("Emojify",u,"Working…",S||void 0);const s=await((ut=(ue=chrome.storage)==null?void 0:(Ce=ue.local).get)==null?void 0:ut.call(Ce,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=s==null?void 0:s["desainr.settings.modelId"],z=(s==null?void 0:s["desainr.settings.thinkingMode"])||"none",V=s==null?void 0:s["desainr.settings.userApiKey"],{ok:U,status:F,json:l,error:K}=await w({selection:u,clientMessage:u,customInstruction:"Rewrite the following text with a friendly, engaging tone and add relevant emojis where appropriate; do not overuse them. Return only the revised text.",modelId:M,thinkingMode:z,userApiKey:V});if(U&&(l!=null&&l.result))await A("Emojify",u,l.result,S||void 0);else{const y=K||(l==null?void 0:l.error)||"unknown";await A("Emojify",u,`Failed (${F}): ${y}`,S||void 0)}}else if(c==="analyze"){const{analyzePage:w}=await I(async()=>{const{analyzePage:U}=await Promise.resolve().then(()=>X);return{analyzePage:U}},void 0);await A("Analyze",u||"(No selection)","Working…",S||void 0);const{ok:s,status:M,json:z,error:V}=await w({url:location.href,title:document.title});if(s)await A("Analyze",u||"(No selection)",(z==null?void 0:z.summary)||"Done",S||void 0);else{const U=V||(z==null?void 0:z.error)||"unknown";await A("Analyze",u||"(No selection)",`Failed (${M}): ${U}`,S||void 0)}}else if(c==="designer")Be();else if(c==="designer-chat")Be();else if(c==="copy"){const w=((pt=window.getSelection())==null?void 0:pt.toString())||"";w?(navigator.clipboard.writeText(w),g("Text copied to clipboard! 📋","success")):g("No text selected","warning")}else c==="settings"?g("Extension settings coming soon! ⚙️","info"):c==="customize"?g("Custom actions coming soon! 🔧","info"):g(`Unknown action: ${f}`,"warning")}catch(u){g(`Error: ${(u==null?void 0:u.message)||u}`,"error")}}const $=document.getElementById(n);if($)try{$.style.display="none",$.textContent=""}catch{}function N(){return t&&t.remove(),t=document.createElement("div"),Object.assign(t.style,{position:"fixed",top:"20px",right:"20px",zIndex:a.zIndex.toast,background:a.colors.surface,color:a.colors.textPrimary,border:`1px solid ${a.colors.border}`,borderRadius:a.borderRadius.lg,padding:`${a.spacing.md} ${a.spacing.lg}`,boxShadow:a.shadows.lg,backdropFilter:"blur(12px)",maxWidth:"420px",fontFamily:a.typography.fontFamily,fontSize:a.typography.fontSize.sm,display:"none",opacity:"0",transform:"translateY(-8px) scale(0.95)",transition:`all ${a.animation.fast}`}),document.documentElement.appendChild(t),t}function E(){return N()}function g(c,f="info"){const m=N(),p={info:"💬",success:"✅",error:"❌",warning:"⚠️"},D={info:a.colors.info,success:a.colors.success,error:a.colors.error,warning:a.colors.warning};m.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${a.spacing.md};">
        <div style="font-size: 18px;">${p[f]}</div>
        <div style="flex: 1; line-height: ${a.typography.lineHeight.normal};">${c}</div>
        <div style="width: 4px; height: 40px; background: ${D[f]}; border-radius: 2px; margin-left: ${a.spacing.md};"></div>
      </div>
    `,m.style.display="block",requestAnimationFrame(()=>{m.style.opacity="1",m.style.transform="translateY(0) scale(1)"}),setTimeout(()=>oe(),3e3)}function oe(){t&&(t.style.opacity="0",t.style.transform="translateY(-8px) scale(0.95)",setTimeout(()=>{t&&(t.style.display="none")},150))}function Ee(c,f,m=6e3){const p=document.createElement("button");p.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${a.spacing.xs};">
        <span>↶</span>
        <span>Undo</span>
      </div>
    `,Object.assign(p.style,{marginLeft:a.spacing.md,padding:`${a.spacing.xs} ${a.spacing.md}`,background:a.colors.primary,color:"white",border:"none",borderRadius:a.borderRadius.md,cursor:"pointer",fontSize:a.typography.fontSize.sm,fontWeight:a.typography.fontWeight.medium,transition:`all ${a.animation.fast}`,fontFamily:a.typography.fontFamily}),p.onmouseenter=()=>{p.style.background=a.colors.primaryHover,p.style.transform="translateY(-1px)"},p.onmouseleave=()=>{p.style.background=a.colors.primary,p.style.transform="translateY(0)"};const D=()=>{try{const R=f();g(R?"Undone successfully! ✓":"Undo failed",R?"success":"error")}catch{g("Undo failed","error")}finally{p.remove(),setTimeout(()=>oe(),800)}};p.addEventListener("click",D,{once:!0}),c.appendChild(p),setTimeout(()=>{try{p.remove()}catch{}},m)}function He(c,f,m=12e3){const p=document.createElement("button");p.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${a.spacing.xs};">
        <span>📋</span>
        <span>Copy</span>
      </div>
    `,Object.assign(p.style,{marginLeft:a.spacing.md,padding:`${a.spacing.xs} ${a.spacing.md}`,background:a.colors.surface,color:a.colors.textPrimary,border:`1px solid ${a.colors.border}`,borderRadius:a.borderRadius.md,cursor:"pointer",fontSize:a.typography.fontSize.sm,fontWeight:a.typography.fontWeight.medium,transition:`all ${a.animation.fast}`,fontFamily:a.typography.fontFamily}),p.onmouseenter=()=>{p.style.background=a.colors.surfaceHover,p.style.borderColor=a.colors.primary,p.style.transform="translateY(-1px)"},p.onmouseleave=()=>{p.style.background=a.colors.surface,p.style.borderColor=a.colors.border,p.style.transform="translateY(0)"};const D=async()=>{try{await navigator.clipboard.writeText(f),g("Copied to clipboard! ✓","success")}catch{g("Copy failed","error")}finally{p.remove(),setTimeout(()=>oe(),800)}};p.addEventListener("click",D,{once:!0}),c.appendChild(p),setTimeout(()=>{try{p.remove()}catch{}},m)}function ve(c){return c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Zt(c,f){const m=ve(String(f.summary||"Analysis complete")),p=Array.isArray(f.keyPoints)?f.keyPoints:[],D=Array.isArray(f.links)?f.links:[],R=p.length?`<ul style="margin:6px 0 8px 18px; padding:0;">${p.map(b=>`<li style="margin:2px 0;">${ve(b)}</li>`).join("")}</ul>`:"",J=D.length?`<div style="margin-top:6px; max-height:160px; overflow:auto;"><div style="font-weight:600; margin-bottom:4px;">Top links</div>${D.slice(0,10).map(b=>`<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><a href="${ve(b)}" target="_blank" rel="noopener noreferrer">${ve(b)}</a></div>`).join("")}</div>`:"";c.innerHTML=`<div style="font-size:13px; line-height:1.35;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-weight:700;">Analysis</div>
        <button id="desainr-close-overlay" style="border:1px solid #ddd; border-radius:6px; padding:2px 6px; background:#f7f7f7; cursor:pointer;">Close</button>
      </div>
      <div style="margin-top:6px;">${m}</div>
      ${R}
      ${J}
    </div>`;const q=c.querySelector("#desainr-close-overlay");q&&(q.onclick=()=>{c.style.display="none"})}let $e=null,se=null;async function Be(){if(se){try{se.detach()}catch{}se=null,$e=null;return}const c=document.createElement("div");c.id="desainr-overlay-react-root",Object.assign(c.style,{position:"fixed",top:"20px",right:"20px",zIndex:1e6}),document.documentElement.appendChild(c);try{se=(await I(()=>Promise.resolve().then(()=>Mt),void 0)).mountOverlay(c,()=>{try{se==null||se.detach()}catch{}se=null,$e=null}),$e=c}catch(f){const m=E();m.style.display="block",m.textContent=`Overlay failed: ${(f==null?void 0:f.message)||f}`,setTimeout(()=>oe(),1500)}}let en=0,Fe=null,Ie=null;function tn(){if(Fe)return Fe;const c=document.createElement("div");c.id="desainr-result-popup",Object.assign(c.style,{position:"fixed",zIndex:1e6,top:"0px",left:"0px",display:"none"});try{const p=R=>{try{R.stopPropagation()}catch{}},D=R=>{try{R.preventDefault()}catch{}try{R.stopPropagation()}catch{}};c.addEventListener("click",p),c.addEventListener("mousedown",p),c.addEventListener("mouseup",p),c.addEventListener("pointerdown",p),c.addEventListener("pointerup",p),c.addEventListener("touchstart",p),c.addEventListener("touchend",p),c.addEventListener("auxclick",D),c.addEventListener("contextmenu",D)}catch{}Ie=c.attachShadow({mode:"open"});const f=document.createElement("style");f.textContent=`
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
    `,Ie.appendChild(f);const m=document.createElement("div");return m.className="popup",m.innerHTML=`
      <div class="body">
        <div class="text-area" id="orig"></div>
        <div class="split-scroll" id="split-scroll"><div class="thumb" id="split-thumb"></div></div>
        <div class="text-area result" id="res"></div>
      </div>
      <div class="footer">
        <div class="left">
          <div class="action-switcher btn" id="action-switcher">
            <span id="action-label">Refine</span>
            <span class="dropdown-arrow"></span>
            <div class="action-dropdown" id="action-dropdown">
              <div class="dropdown-item active" data-action="refine"> Refine</div>
              <div class="dropdown-item" data-action="translate"> Translate</div>
              <div class="dropdown-item" data-action="rephrase"> Rephrase</div>
              <div class="dropdown-item" data-action="summarize"> Summarize</div>
              <div class="dropdown-item" data-action="expand"> Expand</div>
              <div class="dropdown-item" data-action="correct"> Correct Grammar</div>
              <div class="dropdown-item" data-action="explain"> Explain</div>
              <div class="dropdown-item" data-action="add-details"> Add Details</div>
              <div class="dropdown-item" data-action="more-informative"> More Informative</div>
              <div class="dropdown-item" data-action="simplify"> Simplify</div>
              <div class="dropdown-item" data-action="emojify"> Emojify</div>
              <div class="dropdown-item" data-action="analyze"> Analyze</div>
              <div class="dropdown-item" data-action="designer"> Designer</div>
              <div class="dropdown-item" data-action="customize"> Customize Actions</div>
            </div>
          </div>
          <button class="btn" id="regen" title="Regenerate">↻</button>
        </div>
        <div class="right" style="display:flex; gap:6px;">
          <button class="btn" id="copy">Copy</button>
          <button class="btn primary" id="replace">Replace</button>
          <button class="btn" id="close">Close</button>
        </div>
      </div>
    `,Ie.appendChild(m),document.documentElement.appendChild(c),Fe=c,c}let Ae="refine";async function A(c,f,m,p){const D=tn(),R=Ie;if(!R){try{console.warn("DesAInR: popupShadow not available")}catch{}return}Ae=c.toLowerCase();const J=R.querySelector(".popup"),q=R.getElementById("action-switcher"),b=R.getElementById("action-dropdown"),G=R.getElementById("orig"),O=R.getElementById("res"),re=R.getElementById("split-scroll"),ie=R.getElementById("split-thumb"),me=R.getElementById("close"),fe=R.getElementById("copy"),ge=R.getElementById("replace"),ye=R.getElementById("regen");if(G&&(G.textContent=f),O&&(O.textContent=m),(h=>{const T=R.querySelector(".processing");if(h){if(T)return;const P=document.createElement("div");P.className="processing",P.innerHTML='<div class="processing-wrap"><div class="spinner"></div><div class="msg">Preparing…</div></div>';const L=R.querySelector(".body");L&&L.appendChild(P)}else if(T)try{T.remove()}catch{}})(m==="Working…"),G&&O){let h=0;const T=(L,B)=>{const j=Math.max(1,L.scrollHeight-L.clientHeight),Q=Math.max(1,B.scrollHeight-B.clientHeight),Z=L.scrollTop/j;B.scrollTop=Z*Q};G.onscroll=()=>{h!==2&&(h=1,T(G,O),h=0,P())},O.onscroll=()=>{h!==1&&(h=2,T(O,G),h=0,P())};const P=()=>{if(!re||!ie)return;const L=Math.max(1,G.scrollHeight-G.clientHeight),B=Math.max(1,O.scrollHeight-O.clientHeight),j=Math.max(G.scrollTop/L,O.scrollTop/B),Q=re.clientHeight,Z=Math.min(G.clientHeight/G.scrollHeight,O.clientHeight/O.scrollHeight),le=Math.max(40,Math.floor(Q*Z)),ae=Math.floor((Q-le)*j);ie.style.height=`${le}px`,ie.style.top=`${ae}px`};if(re){if(re.onwheel=L=>{L.preventDefault();const B=L.deltaY||L.deltaX;G.scrollTop+=B,O.scrollTop+=B},ie){let L=!1,B=0,j=0;ie.addEventListener("mousedown",Q=>{L=!0,B=Q.clientY,j=ie.offsetTop,Q.preventDefault()}),window.addEventListener("mousemove",Q=>{if(!L||!re)return;const Z=re.clientHeight,le=ie.offsetHeight,ae=Z-le,ee=Math.max(0,Math.min(ae,j+(Q.clientY-B))),de=ae?ee/ae:0,ue=Math.max(1,G.scrollHeight-G.clientHeight),Ce=Math.max(1,O.scrollHeight-O.clientHeight);G.scrollTop=de*ue,O.scrollTop=de*Ce}),window.addEventListener("mouseup",()=>{L=!1})}setTimeout(P,0)}}const _={refine:" Refine",translate:" Translate",rephrase:" Rephrase",summarize:" Summarize",expand:" Expand","correct grammar":" Correct Grammar",explain:" Explain","add details":" Add Details"}[Ae]||"Refine",C=R.getElementById("action-label");C&&(C.textContent=_);const Y=R.querySelectorAll(".dropdown-item");Y.forEach(h=>{h.dataset.action===Ae?h.classList.add("active"):h.classList.remove("active")});function W(){const T=D.getBoundingClientRect();let P=0,L=0;p?(P=p.left,L=p.bottom+15,P+T.width>window.innerWidth-15&&(P=window.innerWidth-T.width-15),P<15&&(P=15),L+T.height>window.innerHeight-15&&(L=p.top-T.height-15,L<15&&(L=15))):(P=(window.innerWidth-T.width)/2,L=(window.innerHeight-T.height)/2),D.style.left=`${Math.round(P)}px`,D.style.top=`${Math.round(L)}px`}D.style.display="block",requestAnimationFrame(()=>{J&&J.classList.add("show"),W()});const ce=()=>{J&&J.classList.remove("show"),setTimeout(()=>D.style.display="none",300)};q&&b&&(q.onclick=h=>{h.stopPropagation(),h.preventDefault(),b.classList.toggle("show"),q.classList.toggle("open")},document.addEventListener("click",()=>{b.classList.remove("show"),q.classList.remove("open")},{once:!0}),Y.forEach(h=>{h.onclick=async T=>{T.preventDefault(),T.stopPropagation();const P=h.dataset.action;P&&P!==Ae&&(b.classList.remove("show"),q.classList.remove("open"),O&&(O.textContent="Processing..."),await k(P,P))}})),me&&(me.onclick=h=>{h.preventDefault(),h.stopPropagation(),ce()}),fe&&(fe.onclick=async h=>{var T,P;(T=h==null?void 0:h.preventDefault)==null||T.call(h),(P=h==null?void 0:h.stopPropagation)==null||P.call(h);try{await navigator.clipboard.writeText(m),g("Copied! ✓","success")}catch{g("Copy failed","error")}}),ye&&(ye.onclick=async h=>{h.preventDefault(),h.stopPropagation(),O&&(O.textContent="Processing..."),await k(Ae,Ae)}),ge&&(ge.onclick=async h=>{var P,L;(P=h==null?void 0:h.preventDefault)==null||P.call(h),(L=h==null?void 0:h.stopPropagation)==null||L.call(h);const T=E();try{const{applyReplacementOrCopyWithUndo:B}=await I(async()=>{const{applyReplacementOrCopyWithUndo:Z}=await Promise.resolve().then(()=>it);return{applyReplacementOrCopyWithUndo:Z}},void 0);let{outcome:j,undo:Q}=await B(m);if(j!=="replaced")try{const{getEditableSelection:Z,isEditableElement:le,replaceEditableSelection:ae}=await I(async()=>{const{getEditableSelection:de,isEditableElement:ue,replaceEditableSelection:Ce}=await Promise.resolve().then(()=>Nt);return{getEditableSelection:de,isEditableElement:ue,replaceEditableSelection:Ce}},void 0),ee=Z();if(ee&&ee.element&&le(ee.element)){const de=ae(ee.element,m,ee.start,ee.end),ue=()=>{try{return de(),!0}catch{return!1}};ue&&(j="replaced",Q=ue)}}catch{}if(j!=="replaced"&&r)try{const Z=r,le=Z.cloneRange(),ae=Z.cloneContents();Z.deleteContents();const ee=document.createTextNode(m);Z.insertNode(ee);const de=()=>{try{const ue=le;return ee.parentNode&&ee.parentNode.removeChild(ee),ue.insertNode(ae),!0}catch{return!1}};j="replaced",Q=de}catch{}if(j==="replaced")T.textContent="Replaced ✓",Q&&Ee(T,Q);else if(j==="copied")T.textContent="Copied ✓",He(T,m);else try{await navigator.clipboard.writeText(m),T.textContent="Copied ✓"}catch{T.textContent="Done"}}catch(B){T.textContent=`Replace failed: ${(B==null?void 0:B.message)||B}`}finally{T.style.display="block",setTimeout(()=>oe(),1e3),ce()}})}async function nn(){const f=(await I(()=>Promise.resolve().then(()=>Dt),void 0)).getSelectionInfo();if(!f){Ue();return}if(f.text,f.rect,i){const m=f.rect,p=m.left+m.width/2,D=m.top-8;i.show(p,D,R=>{k(R.id,R.label)})}}function Ue(){if(i)try{i.hide()}catch(c){console.warn("Error hiding Monica toolbar:",c)}}document.addEventListener("keydown",c=>{if(c.key==="Escape"&&(Ue(),se)){try{se.detach()}catch{}se=null,$e=null}}),document.addEventListener("selectionchange",()=>{var f;if(Date.now()<en)return;(((f=window.getSelection())==null?void 0:f.toString())||"").trim()||Ue()}),document.addEventListener("mousedown",c=>{},!0);function on(c=4e3){return new Promise(f=>{let m=!1;const p=J=>{window.removeEventListener("message",D),J&&clearTimeout(J)},D=J=>{if(J.source!==window)return;const q=J.data;if(!q||q.type!=="DESAINR_WEBAPP_TOKEN"||m)return;m=!0,p();const{ok:b,idToken:G,error:O}=q||{};f({ok:!!b,idToken:G,error:O||(b?void 0:"no_token")})};window.addEventListener("message",D);const R=window.setTimeout(()=>{m||(m=!0,p(),f({ok:!1,error:"timeout"}))},c);try{window.postMessage({type:"DESAINR_EXTENSION_GET_TOKEN",from:"desainr-extension"},window.origin)}catch{m=!0,p(R),f({ok:!1,error:"post_message_failed"})}})}chrome.runtime.onMessage.addListener((c,f,m)=>{if((c==null?void 0:c.type)==="TOGGLE_OVERLAY"&&Be(),(c==null?void 0:c.type)==="CONTEXT_MENU"&&rn(c.id,c.info),(c==null?void 0:c.type)==="DESAINR_GET_WEBAPP_ID_TOKEN")return on().then(p=>m(p)),!0}),document.addEventListener("mouseup",()=>{setTimeout(()=>{nn().catch(()=>{})},100)}),document.addEventListener("contextmenu",c=>{const f=window.getSelection();f&&f.toString().trim()&&(c.preventDefault(),e&&e.show(c.pageX,c.pageY,m=>{k(m.id,m.label)}))});async function rn(c,f){var G,O,re,ie,me,fe,ge,ye,Te;const{rewrite:m,translateChunks:p,analyzePage:D,saveMemo:R}=await I(async()=>{const{rewrite:H,translateChunks:_,analyzePage:C,saveMemo:Y}=await Promise.resolve().then(()=>X);return{rewrite:H,translateChunks:_,analyzePage:C,saveMemo:Y}},void 0),{DEFAULT_TARGET_LANG:J}=await I(async()=>{const{DEFAULT_TARGET_LANG:H}=await Promise.resolve().then(()=>Me);return{DEFAULT_TARGET_LANG:H}},void 0),{applyReplacementOrCopyWithUndo:q}=await I(async()=>{const{applyReplacementOrCopyWithUndo:H}=await Promise.resolve().then(()=>it);return{applyReplacementOrCopyWithUndo:H}},void 0),b=E();b.style.display="block";try{if(c==="desainr-refine"){b.textContent="Refining selection...";const H=((G=window.getSelection())==null?void 0:G.toString())||"",_=await((ie=(O=chrome.storage)==null?void 0:(re=O.local).get)==null?void 0:ie.call(re,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),C=_==null?void 0:_["desainr.settings.modelId"],Y=(_==null?void 0:_["desainr.settings.thinkingMode"])||"none",W=_==null?void 0:_["desainr.settings.userApiKey"],{ok:ce,status:h,json:T,error:P}=await m({selection:H,url:location.href,task:"clarify",modelId:C,thinkingMode:Y,userApiKey:W});if(ce&&(T!=null&&T.result)){const{outcome:L,undo:B}=await q(T.result);L==="replaced"?(b.textContent="Refined ✓ (replaced selection)",B&&Ee(b,B)):L==="copied"?b.textContent="Refined ✓ (copied)":b.textContent="Refined ✓"}else b.textContent=`Refine failed (${h}): ${P||"unknown"}`}else if(c==="desainr-translate"){b.textContent="Translating selection...";const H=((me=window.getSelection())==null?void 0:me.toString())||"",_=await((ye=(fe=chrome.storage)==null?void 0:(ge=fe.local).get)==null?void 0:ye.call(ge,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),C=(_==null?void 0:_["desainr.settings.targetLang"])||J,Y=_==null?void 0:_["desainr.settings.modelId"],W=(_==null?void 0:_["desainr.settings.thinkingMode"])||"none",ce=_==null?void 0:_["desainr.settings.userApiKey"],{ok:h,status:T,json:P,error:L}=await p({selection:H,url:location.href,targetLang:C,modelId:Y,thinkingMode:W,userApiKey:ce});if(h&&(P!=null&&P.result)){const{outcome:B,undo:j}=await q(P.result);B==="replaced"?(b.textContent="Translated ✓ (replaced selection)",j&&Ee(b,j)):B==="copied"?b.textContent="Translated ✓ (copied)":b.textContent="Translated ✓"}else b.textContent=`Translate failed (${T}): ${L||"unknown"}`}else if(c==="desainr-save-memo"){b.textContent="Saving to memo...";const H=((Te=window.getSelection())==null?void 0:Te.toString())||"";if(!H)b.textContent="No text selected";else{const _={title:`Selection from ${document.title||location.hostname}`,content:H,url:location.href,type:"selection",metadata:{pageTitle:document.title,timestamp:new Date().toISOString()},tags:["selection","extension"]},{ok:C,json:Y,error:W}=await R(_);C&&Y?b.textContent=`✓ Saved to memo (ID: ${Y.memoId})`:b.textContent=`Save to memo failed: ${W||"unknown"}`}}else if(c==="desainr-analyze"){b.textContent="Analyzing page...";const{ok:H,status:_,json:C,error:Y}=await D({url:location.href,title:document.title});H?Zt(b,{summary:C==null?void 0:C.summary,keyPoints:C==null?void 0:C.keyPoints,links:C==null?void 0:C.links}):b.textContent=`Analyze failed (${_}): ${Y||"unknown"}`}else if(c==="desainr-translate-page"){b.textContent="Translating page...";const{translatePageAll:H}=await I(async()=>{const{translatePageAll:C}=await Promise.resolve().then(()=>jt);return{translatePageAll:C}},void 0),{DEFAULT_TARGET_LANG:_}=await I(async()=>{const{DEFAULT_TARGET_LANG:C}=await Promise.resolve().then(()=>Me);return{DEFAULT_TARGET_LANG:C}},void 0);try{const C=await H(_);b.textContent=`Translated page ✓ (${C.translated}/${C.totalNodes} nodes, skipped ${C.skipped})`}catch(C){b.textContent=`Translate page error: ${(C==null?void 0:C.message)||C}`}}else if(c==="desainr-toggle-parallel"){const{isParallelModeEnabled:H,enableParallelMode:_,disableParallelMode:C}=await I(async()=>{const{isParallelModeEnabled:W,enableParallelMode:ce,disableParallelMode:h}=await Promise.resolve().then(()=>Qt);return{isParallelModeEnabled:W,enableParallelMode:ce,disableParallelMode:h}},void 0),{DEFAULT_TARGET_LANG:Y}=await I(async()=>{const{DEFAULT_TARGET_LANG:W}=await Promise.resolve().then(()=>Me);return{DEFAULT_TARGET_LANG:W}},void 0);try{H()?(b.textContent="Disabling parallel translate...",C(),b.textContent="Parallel translate OFF"):(b.textContent="Enabling parallel translate...",await _(Y),b.textContent="Parallel translate ON")}catch(W){b.textContent=`Parallel toggle error: ${(W==null?void 0:W.message)||W}`}}else b.textContent=`Unknown action: ${c}`}catch(H){b.textContent=`Error: ${(H==null?void 0:H.message)||H}`}finally{setTimeout(()=>{try{oe()}catch{}},800)}}})();const xe={rewrite:{maxTokens:20,refillRate:.5,costPerCall:1},"translate-chunks":{maxTokens:30,refillRate:1,costPerCall:1},"analyze-page":{maxTokens:10,refillRate:.2,costPerCall:1},chat:{maxTokens:30,refillRate:.5,costPerCall:1},actions:{maxTokens:20,refillRate:.5,costPerCall:1},"memo/save":{maxTokens:50,refillRate:1,costPerCall:1},"slash-prompts":{maxTokens:10,refillRate:.5,costPerCall:1},default:{maxTokens:20,refillRate:.5,costPerCall:1}},qe="rateLimiter_";function Ye(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function Xe(n){var t;const e=`${qe}${n}`,i=xe[n]||xe.default;if(Ye())return new Promise(o=>{chrome.storage.local.get(e,r=>{const d=r[e];d&&d.tokens!==void 0&&d.lastRefill!==void 0?o(d):o({tokens:i.maxTokens,lastRefill:Date.now()})})});try{const o=(t=globalThis==null?void 0:globalThis.localStorage)==null?void 0:t.getItem(e);if(o){const r=JSON.parse(o);if(r&&r.tokens!==void 0&&r.lastRefill!==void 0)return r}}catch{}return{tokens:i.maxTokens,lastRefill:Date.now()}}async function Je(n,e){var t;const i=`${qe}${n}`;if(Ye())return new Promise(o=>{chrome.storage.local.set({[i]:e},o)});try{(t=globalThis==null?void 0:globalThis.localStorage)==null||t.setItem(i,JSON.stringify(e))}catch{}}function Qe(n,e){const i=Date.now(),o=(i-n.lastRefill)/1e3*e.refillRate;return{tokens:Math.min(n.tokens+o,e.maxTokens),lastRefill:i}}async function vt(n){const e=xe[n]||xe.default;let i=await Xe(n);return i=Qe(i,e),i.tokens<e.costPerCall?(await Je(n,i),!1):(i.tokens-=e.costPerCall,await Je(n,i),!0)}async function wt(n){const e=xe[n]||xe.default;let i=await Xe(n);i=Qe(i,e);const t=Math.max(0,e.costPerCall-i.tokens),o=t>0?t/e.refillRate:0;return{remainingTokens:Math.floor(i.tokens),maxTokens:e.maxTokens,timeUntilRefill:Math.ceil(o),canMakeCall:i.tokens>=e.costPerCall}}async function be(n,e){if(!await vt(n)){const o=(await wt(n)).timeUntilRefill;return{ok:!1,status:429,error:`Rate limit exceeded. Please wait ${o} second${o!==1?"s":""} before trying again.`}}return new Promise(t=>{chrome.runtime.sendMessage({type:"API_CALL",path:n,body:e},o=>{if(!o)return t({ok:!1,status:0,error:"No response from background"});t(o)})})}function Ze(n,e,i){const t=`${e&&(e.error||(e.message??""))||""} ${i||""}`.toLowerCase(),o=["quota","exhausted","insufficient","rate limit","resource has been exhausted","insufficient_quota","429","capacity"];return!!(n===429||n>=500&&o.some(r=>t.includes(r)))}function et(n,e,i){const t=e&&(e.error||(e.message??""))||"",o=`${t} ${i||""}`.toLowerCase();return typeof t=="string"&&t.startsWith("UNAUTHORIZED")?!1:n===401||n===403?!0:["invalid api key","api key not valid","key invalid","missing api key","no api key","invalid authentication","unauthorized","forbidden","permission denied"].some(d=>o.includes(d))}function tt(n,e,i){const t=`${e&&(e.error||(e.message??""))||""} ${i||""}`.toLowerCase();return["billing","access not configured","permission not configured","project has been blocked","enable billing"].some(r=>t.includes(r))}function xt(n,e,i){const t=e&&(e.error||(e.message??""))||"";if(typeof t=="string"&&t.startsWith("UNAUTHORIZED"))return"Sign in is required or provide a Gemini API key in Settings (userApiKey).";if(et(n,e,i))return"Invalid or unauthorized API key. Update your Gemini API key in Settings or sign in again.";if(tt(n,e,i))return"Billing or API access is not configured for this key/project. Enable billing in Google AI Studio or use another API key.";if(Ze(n,e,i))return"AI capacity exhausted right now. Please try again in a bit, or switch the model/API key in settings.";if(n===401||n===403)return"Unauthorized. Please sign in again.";if(n===429)return"Too many requests. Please slow down and try again shortly.";if(n>=500)return"Server error. Please try again shortly."}async function ke(n,e=3,i=100){let t;for(let o=0;o<e;o++){let r=await n();if(r.ok)return r;const d=xt(r.status,r.json,r.error);d&&(r={...r,error:d}),t=r;const v=!r.status||r.status===0||r.status>=500,x=Ze(r.status,r.json,r.error),k=et(r.status,r.json,r.error),$=tt(r.status,r.json,r.error);if(!v||x||k||$||r.status===401||r.status===403||r.status===400)break;await new Promise(N=>setTimeout(N,i*Math.pow(2,o)))}return t??{ok:!1,status:0,error:"Unknown error"}}async function bt(n){return ke(()=>be("rewrite",n))}async function kt(n){return ke(()=>be("translate-chunks",n))}async function Et(n){return ke(()=>be("translate-chunks",n))}async function At(n){return ke(()=>be("analyze-page",n))}async function Tt(n){return ke(()=>be("actions",n))}async function Ct(n){return ke(()=>be("memo/save",n))}const X=Object.freeze(Object.defineProperty({__proto__:null,actions:Tt,analyzePage:At,rewrite:bt,saveMemo:Ct,translateChunks:kt,translateChunksBatch:Et},Symbol.toStringTag,{value:"Module"})),Me=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_TARGET_LANG:"en"},Symbol.toStringTag,{value:"Module"}));function _t(n,e){try{n.innerHTML=""}catch{}const i=n.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
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
  `,i.appendChild(o);const r=i.getElementById("ovl-close");return r&&r.addEventListener("click",()=>{try{e&&e()}catch{}}),{detach:()=>{try{n.parentNode&&n.parentNode.removeChild(n)}catch{}}}}const Mt=Object.freeze(Object.defineProperty({__proto__:null,mountOverlay:_t},Symbol.toStringTag,{value:"Module"}));class Rt{constructor(e=50){te(this,"history",[]);te(this,"currentIndex",-1);te(this,"maxHistorySize",50);te(this,"listeners",new Set);this.maxHistorySize=e}addAction(e){const i=`undo-${Date.now()}-${Math.random()}`,t={...e,id:i,timestamp:Date.now()};return this.history=this.history.slice(0,this.currentIndex+1),this.history.push(t),this.currentIndex++,this.history.length>this.maxHistorySize&&(this.history=this.history.slice(-this.maxHistorySize),this.currentIndex=this.history.length-1),this.notifyListeners(),i}undo(){if(!this.canUndo())return!1;const i=this.history[this.currentIndex].undo();return i&&(this.currentIndex--,this.notifyListeners()),i}redo(){if(!this.canRedo())return!1;const e=this.history[this.currentIndex+1];if(!e.redo)return!1;const i=e.redo();return i&&(this.currentIndex++,this.notifyListeners()),i}canUndo(){return this.currentIndex>=0}canRedo(){var e;return this.currentIndex<this.history.length-1&&((e=this.history[this.currentIndex+1])==null?void 0:e.redo)!==void 0}getHistory(){return[...this.history]}getRecentActions(e=5){return this.history.slice(Math.max(0,this.currentIndex-e+1),this.currentIndex+1).reverse()}clear(){this.history=[],this.currentIndex=-1,this.notifyListeners()}clearOld(e){const i=Date.now()-e,t=this.history.findIndex(o=>o.timestamp>=i);t>0&&(this.history=this.history.slice(t),this.currentIndex=Math.max(-1,this.currentIndex-t),this.notifyListeners())}subscribe(e){return this.listeners.add(e),e(this.getHistory(),this.canUndo(),this.canRedo()),()=>{this.listeners.delete(e)}}notifyListeners(){const e=this.getHistory(),i=this.canUndo(),t=this.canRedo();this.listeners.forEach(o=>{o(e,i,t)})}}let ze=null;function Pt(){return ze||(ze=new Rt),ze}function Lt(n){if(!n)return!1;const e=n.tagName.toLowerCase();return e==="input"||e==="textarea"}async function nt(n){var e;try{if((e=navigator.clipboard)!=null&&e.writeText)return await navigator.clipboard.writeText(n),!0}catch{}try{const i=document.createElement("textarea");i.value=n,i.style.position="fixed",i.style.opacity="0",document.body.appendChild(i),i.focus(),i.select();const t=document.execCommand("copy");return document.body.removeChild(i),t}catch{return!1}}function ot(n){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const i=document.activeElement;if(Lt(i))try{const t=i,o=t.selectionStart??0,r=t.selectionEnd??o,d=t.value??"",v=d.slice(o,r);t.value=d.slice(0,o)+n+d.slice(r);const x=o+n.length;t.selectionStart=t.selectionEnd=x,t.dispatchEvent(new Event("input",{bubbles:!0}));const k={description:`Replace "${v.slice(0,20)}${v.length>20?"...":""}" with "${n.slice(0,20)}${n.length>20?"...":""}"`,undo:()=>{try{return t.value=d,t.selectionStart=o,t.selectionEnd=r,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}},redo:()=>{try{return t.value=d.slice(0,o)+n+d.slice(r),t.selectionStart=t.selectionEnd=o+n.length,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}}};return Pt().addAction(k),{undo:k.undo}}catch{}try{const t=e.getRangeAt(0),o=t.cloneContents(),r=t.cloneContents(),d=Array.from(r.childNodes).some(k=>k.nodeType!==Node.TEXT_NODE),v=t.endContainer!==t.startContainer;if(d&&v)return null;t.deleteContents();const x=document.createTextNode(n);return t.insertNode(x),t.setStartAfter(x),t.collapse(!0),e.removeAllRanges(),e.addRange(t),{undo:()=>{try{const k=x.parentNode;if(!k)return!1;const $=o.cloneNode(!0);return k.insertBefore($,x),k.removeChild(x),!0}catch{return!1}}}}catch{return null}}async function St(n){const e=ot(n);return e?{outcome:"replaced",undo:e.undo}:await nt(n)?{outcome:"copied"}:{outcome:"failed"}}const it=Object.freeze(Object.defineProperty({__proto__:null,applyReplacementOrCopyWithUndo:St,copyToClipboard:nt,replaceSelectionSafelyWithUndo:ot},Symbol.toStringTag,{value:"Module"}));function rt(n){if(!n)return!1;const e=n.tagName.toLowerCase();if(e==="input"||e==="textarea"){const t=n;return!t.disabled&&!t.readOnly}if(n.getAttribute("contenteditable")==="true")return!0;let i=n.parentElement;for(;i;){if(i.getAttribute("contenteditable")==="true")return!0;i=i.parentElement}return!1}function $t(){const n=document.activeElement;if(!n||!rt(n))return null;if(n.tagName==="INPUT"||n.tagName==="TEXTAREA"){const e=n,i=e.selectionStart||0,t=e.selectionEnd||0,o=e.value.substring(i,t);if(o)return{element:e,text:o,start:i,end:t}}else if(n.getAttribute("contenteditable")==="true"){const e=window.getSelection();if(e&&e.rangeCount>0){const i=e.toString();if(i)return{element:n,text:i,start:0,end:0}}}return null}function It(n,e,i,t){if(n.tagName==="INPUT"||n.tagName==="TEXTAREA"?n.value.substring(i,t):n.textContent,n.tagName==="INPUT"||n.tagName==="TEXTAREA"){const o=n,r=o.value;return o.value=o.value.substring(0,i)+e+o.value.substring(t),o.setSelectionRange(i+e.length,i+e.length),o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0})),()=>(o.value=r,o.setSelectionRange(i,t),o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0})),!0)}else if(n.getAttribute("contenteditable")==="true"){const o=window.getSelection(),r=n.innerHTML;if(o&&o.rangeCount>0){const d=o.getRangeAt(0);d.deleteContents();const v=document.createTextNode(e);return d.insertNode(v),d.setStartAfter(v),d.setEndAfter(v),o.removeAllRanges(),o.addRange(d),n.dispatchEvent(new Event("input",{bubbles:!0})),()=>(n.innerHTML=r,n.dispatchEvent(new Event("input",{bubbles:!0})),!0)}}return()=>!1}const Nt=Object.freeze(Object.defineProperty({__proto__:null,getEditableSelection:$t,isEditableElement:rt,replaceEditableSelection:It},Symbol.toStringTag,{value:"Module"}));function zt(){const n=window.getSelection();if(!n||n.rangeCount===0)return null;const i=n.getRangeAt(0).getBoundingClientRect(),t=n.toString();if(!t.trim())return null;const o=i.left+window.scrollX,r=i.top+window.scrollY;return{text:t,rect:i,pageX:o,pageY:r}}const Dt=Object.freeze(Object.defineProperty({__proto__:null,getSelectionInfo:zt},Symbol.toStringTag,{value:"Module"})),Ot=new Set(["script","style","noscript","template","textarea","input","select","option","code","pre","kbd","samp","var","svg","canvas","math","video","audio"]);function Ht(n){if(!n)return!1;if(n.isContentEditable)return!0;const i=n.getAttribute("contenteditable");return i===""||i==="true"}function Bt(n){if(!n)return!1;const e=n.tagName.toLowerCase();return e==="input"||e==="textarea"||e==="select"||e==="option"}function Ft(n){return!!(!n||Ot.has(n.tagName.toLowerCase())||Bt(n)||Ht(n))}function Ut(n){const e=getComputedStyle(n);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0"||n.hidden)return!0;const i=n.getBoundingClientRect();return i.width===0&&i.height===0}function Vt(n){let e=n;for(;e;){if(Ft(e)||Ut(e))return!0;e=e.parentElement}return!1}function Gt(n,e=5){const i=[];let t=n,o=0;for(;t&&o<e;){const r=t.tagName.toLowerCase(),d=t.id?`#${t.id}`:"",v=t.className&&typeof t.className=="string"?`.${t.className.trim().split(/\s+/).slice(0,2).join(".")}`:"";i.unshift(`${r}${d}${v}`),t=t.parentElement,o++}return i.join(">")}function De(n=document.body){const e=[],i=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,{acceptNode:o=>{if(o.nodeType!==Node.TEXT_NODE)return NodeFilter.FILTER_REJECT;const r=o.data;if(!r||!r.trim())return NodeFilter.FILTER_REJECT;const d=o.parentElement;return!d||d.closest&&d.closest(".desainr-parallel-wrapper")||Vt(d)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let t=i.nextNode();for(;t;){const o=t,r=o.parentElement;e.push({node:o,text:o.data,index:e.length,parent:r,path:Gt(r)}),t=i.nextNode()}return e}function at(n){return n.map(e=>e.text)}async function Kt(n,e,i){const t=new Array(n.length);let o=0,r=0;return new Promise((d,v)=>{const x=()=>{for(;r<e&&o<n.length;){const k=o++;r++,Promise.resolve(i(n[k],k)).then($=>{t[k]=$,r--,o>=n.length&&r===0?d(t):x()}).catch($=>{t[k]=void 0,r--,o>=n.length&&r===0?d(t):x()})}};n.length===0?d(t):x()})}async function Wt(n,e=3,i=400){var N;const{translateChunksBatch:t,translateChunks:o}=await I(async()=>{const{translateChunksBatch:E,translateChunks:g}=await Promise.resolve().then(()=>X);return{translateChunksBatch:E,translateChunks:g}},void 0),r=De(),d=r.slice(0,i),v=at(d);let x=[],k=!1;try{const E=await t({chunks:v,url:location.href,targetLang:n});E.ok&&Array.isArray((N=E.json)==null?void 0:N.results)&&(x=E.json.results??[],k=!0)}catch{}(!k||x.length!==v.length)&&(x=await Kt(v,e,async E=>{var oe;const g=await o({selection:E,url:location.href,targetLang:n});return g.ok&&((oe=g.json)!=null&&oe.result)?g.json.result:E}));let $=0;for(let E=0;E<d.length;E++)try{const g=x[E];typeof g=="string"&&g!==d[E].text&&(d[E].node.data=g,$++)}catch{}return{totalNodes:r.length,translated:$,skipped:d.length-$}}const jt=Object.freeze(Object.defineProperty({__proto__:null,collectTextNodes:De,snapshotTexts:at,translatePageAll:Wt},Symbol.toStringTag,{value:"Module"})),Re="desainr-parallel-wrapper",st="desainr-parallel-original",ct="desainr-parallel-translated",lt="desainr-parallel-style";let pe=!1,Pe=null;function qt(){if(document.getElementById(lt))return;const n=document.createElement("style");n.id=lt,n.textContent=`
    .${Re} { display: inline; white-space: pre-wrap; }
    .${st} { opacity: 0.95; }
    .${ct} { opacity: 0.75; color: #555; margin-left: 0.4em; }
  `,document.documentElement.appendChild(n)}async function Oe(n,e){var o;const{translateChunks:i}=await I(async()=>{const{translateChunks:r}=await Promise.resolve().then(()=>X);return{translateChunks:r}},void 0),t=await i({selection:n,url:location.href,targetLang:e});return t.ok&&((o=t.json)!=null&&o.result)?t.json.result:n}function Se(n,e){const i=n.parentElement;if(!i||i.closest&&i.closest(`.${Re}`))return;const t=n.data,o=document.createElement("span");o.className=Re,o.dataset.orig=t;const r=document.createElement("span");r.className=st,r.textContent=t;const d=document.createElement("span");d.className=ct,d.textContent=e,o.appendChild(r),o.appendChild(document.createTextNode(" ")),o.appendChild(d),i.replaceChild(o,n)}function dt(n){return!!n&&n.classList.contains(Re)}function Yt(){var e;if(!pe)return;pe=!1,Pe&&(Pe.disconnect(),Pe=null);const n=Array.from(document.querySelectorAll(`.${Re}`));for(const i of n){const t=((e=i.dataset)==null?void 0:e.orig)??"",o=document.createTextNode(t);i.parentNode&&i.parentNode.replaceChild(o,i)}}function Xt(){return pe}async function Jt(n){var v;if(pe)return;pe=!0,qt();const t=De().slice(0,400),{DEFAULT_TARGET_LANG:o}=await I(async()=>{const{DEFAULT_TARGET_LANG:x}=await Promise.resolve().then(()=>Me);return{DEFAULT_TARGET_LANG:x}},void 0),r=n||o;let d=!1;try{const{translateChunksBatch:x}=await I(async()=>{const{translateChunksBatch:E}=await Promise.resolve().then(()=>X);return{translateChunksBatch:E}},void 0),k=t.map(E=>E.text),$=await x({chunks:k,url:location.href,targetLang:r}),N=(v=$.json)==null?void 0:v.results;if($.ok&&Array.isArray(N)&&N.length===t.length){for(let E=0;E<t.length;E++)try{Se(t[E].node,N[E])}catch{}d=!0}}catch{}if(!d){let k=0;async function $(){if(!pe)return;const N=k++;if(N>=t.length)return;const E=t[N];try{const g=await Oe(E.text,r);Se(E.node,g)}catch{}await $()}await Promise.all(new Array(3).fill(0).map(()=>$()))}Pe=new MutationObserver(async x=>{if(pe)for(const k of x)if(k.type==="characterData"&&k.target.nodeType===Node.TEXT_NODE){const $=k.target,N=$.parentElement;if(!N||dt(N))continue;const E=$.data;if(E&&E.trim())try{const g=await Oe(E,r);if(!pe)return;Se($,g)}catch{}}else k.type==="childList"&&k.addedNodes.forEach(async $=>{if($.nodeType===Node.TEXT_NODE){const N=$,E=N.parentElement;if(!E||dt(E))return;const g=N.data;if(g&&g.trim())try{const oe=await Oe(g,r);if(!pe)return;Se(N,oe)}catch{}}})}),Pe.observe(document.body,{subtree:!0,childList:!0,characterData:!0})}const Qt=Object.freeze(Object.defineProperty({__proto__:null,disableParallelMode:Yt,enableParallelMode:Jt,isParallelModeEnabled:Xt},Symbol.toStringTag,{value:"Module"}))})();
