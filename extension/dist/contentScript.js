var Lt=Object.defineProperty;var It=(se,ne,ue)=>ne in se?Lt(se,ne,{enumerable:!0,configurable:!0,writable:!0,value:ue}):se[ne]=ue;var B=(se,ne,ue)=>It(se,typeof ne!="symbol"?ne+"":ne,ue);(function(){"use strict";const se="modulepreload",ne=function(n){return"/"+n},ue={},S=function(e,o,t){let i=Promise.resolve();function a(c){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=c,window.dispatchEvent(f),!f.defaultPrevented)throw c}return i.then(c=>{for(const f of c||[])f.status==="rejected"&&a(f.reason);return e().catch(a)})},We={background:"#0f0f0f",surface:"#1a1a1a",surfaceHover:"#262626",surfaceActive:"#333333",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#ffffff",textSecondary:"#a1a1aa",textMuted:"#71717a",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#262626",borderLight:"#374151",shadow:"rgba(0, 0, 0, 0.8)",shadowLight:"rgba(0, 0, 0, 0.4)"},Ke={background:"#ffffff",surface:"#f8fafc",surfaceHover:"#f1f5f9",surfaceActive:"#e2e8f0",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#1e293b",textSecondary:"#475569",textMuted:"#64748b",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#e2e8f0",borderLight:"#cbd5e1",shadow:"rgba(0, 0, 0, 0.15)",shadowLight:"rgba(0, 0, 0, 0.08)"},qe=()=>typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":"dark",Te=()=>qe()==="dark"?We:Ke,r={colors:Te(),updateTheme(){this.colors=Te()},watchThemeChanges(n){typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.updateTheme(),n()})},featureIcons:{refine:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',translate:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 4h2.764L13 9.236 11.618 12z"></path></svg>',rewrite:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',analyze:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',explain:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>',correct:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',expand:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',chatPersonal:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>',chatPro:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',copy:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>',settings:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',customize:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>'},featureCategories:{"Quick Actions":{title:"Quick Actions",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>',description:"Fast access to common tools"},"Content Tools":{title:"Content Tools",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',description:"Text editing and enhancement"},"AI Chat":{title:"AI Chat",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>',description:"AI-powered conversations"},Advanced:{title:"Advanced",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',description:"Advanced features and settings"}},spacing:{xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},borderRadius:{sm:"6px",md:"8px",lg:"12px",xl:"16px",full:"9999px"},typography:{fontFamily:'"Inter", "Segoe UI", system-ui, sans-serif',fontSize:{xs:"12px",sm:"13px",base:"14px",lg:"16px",xl:"18px"},fontWeight:{normal:"400",medium:"500",semibold:"600",bold:"700"},lineHeight:{tight:"1.25",normal:"1.4",relaxed:"1.6"}},animation:{fast:"150ms ease-out",normal:"250ms ease-out",slow:"350ms ease-out"},shadows:{sm:"0 2px 4px rgba(0, 0, 0, 0.4)",md:"0 4px 12px rgba(0, 0, 0, 0.6)",lg:"0 8px 24px rgba(0, 0, 0, 0.8)",glow:"0 0 20px rgba(139, 92, 246, 0.3)"},zIndex:{tooltip:1e3,dropdown:1100,overlay:1200,modal:1300,toast:1400,max:2147483647}},q={translate:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 18H20.25"/>
  </svg>`,explain:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>`,grammar:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>`,rewrite:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>`,expand:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="15,3 21,3 21,9"/>
    <polyline points="9,21 3,21 3,15"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
    <line x1="3" y1="21" x2="10" y2="14"/>
  </svg>`,question:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>`,analyze:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="7.5,10 12,13 16.5,10"/>
    <line x1="12" y1="22.08" x2="12" y2="13"/>
  </svg>`,chat:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>`,custom:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>`,refine:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 3l7 3-7 3-7-3 7-3z"/>
    <path d="M5 12l7 3 7-3"/>
    <path d="M5 18l7 3 7-3"/>
  </svg>`,memo:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>`},ve=[{id:"refine",label:"Refine Selection",category:"Quick Actions",icon:q.refine,shortcut:"R",isPinned:!0},{id:"translate",label:"Translate Selection",category:"Quick Actions",icon:q.translate,shortcut:"T",isPinned:!0},{id:"rewrite",label:"Rewrite Selection",category:"Quick Actions",icon:q.rewrite,shortcut:"W",isPinned:!0},{id:"analyze",label:"Analyze Page",category:"Content Tools",icon:q.analyze,shortcut:"A",isPinned:!1},{id:"explain",label:"Explain Selection",category:"Content Tools",icon:q.explain,shortcut:"E",isPinned:!1},{id:"correct",label:"Correct Grammar",category:"Content Tools",icon:q.grammar,shortcut:"C",isPinned:!1},{id:"expand",label:"Expand Text",category:"Content Tools",icon:q.expand,shortcut:"X",isPinned:!1},{id:"chat-personal",label:"Personal Chat",category:"AI Chat",icon:q.chat,shortcut:"P",isPinned:!1},{id:"chat-pro",label:"Pro Chat",category:"AI Chat",icon:q.question,shortcut:"O",isPinned:!1},{id:"settings",label:"Extension Settings",category:"Advanced",icon:q.custom,shortcut:"S",isPinned:!1},{id:"customize",label:"Customize Actions",category:"Advanced",icon:q.custom,shortcut:"M",isPinned:!1}];class Ae{constructor(){B(this,"container",null);B(this,"shadowRoot",null);B(this,"actions",ve);B(this,"onActionClick",null);B(this,"maxPinned",9);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions(),r.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
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
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const o=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||[];this.actions=this.actions.map(t=>({...t,isPinned:o.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}async savePinnedActions(){var e,o;try{const t=this.actions.filter(i=>i.isPinned).map(i=>i.id).slice(0,this.maxPinned);await chrome.storage.sync.set({"desainr.pinnedActions":t});try{(o=(e=chrome==null?void 0:chrome.runtime)==null?void 0:e.sendMessage)==null||o.call(e,{type:"SAVE_PINNED_ACTIONS",pinnedIds:t})}catch(i){console.warn("Broadcast SAVE_PINNED_ACTIONS failed:",i)}}catch(t){console.warn("Failed to save pinned actions:",t)}}togglePin(e){const o=this.actions.findIndex(i=>i.id===e);if(o===-1)return;const t=this.actions[o];if(t.isPinned)t.isPinned=!1;else{if(this.actions.filter(a=>a.isPinned).length>=this.maxPinned)return;t.isPinned=!0}this.savePinnedActions(),this.refreshMenuUI()}refreshMenuUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-menu");if(!e)return;const o=e.style.left,t=e.style.top;e.remove();const i=this.renderMenu();this.shadowRoot.appendChild(i),i.classList.add("show"),o&&(i.style.left=o),t&&(i.style.top=t)}renderMenu(){const e=document.createElement("div");e.className="monica-menu";const o=this.actions.reduce((i,a)=>(r.featureCategories[a.category],i[a.category]||(i[a.category]=[]),i[a.category].push(a),i),{});Object.entries(o).forEach(([i,a])=>{var m,d;const c=document.createElement("div");c.className="menu-category";const f=document.createElement("div");f.className="category-header",f.innerHTML=`
        <div class="category-icon">${((m=r.featureCategories[i])==null?void 0:m.icon)||""}</div>
        <div class="category-title">${((d=r.featureCategories[i])==null?void 0:d.title)||i}</div>
      `,c.appendChild(f),a.forEach((u,A)=>{const h=document.createElement("div");h.className=`menu-item ${u.isPinned?"pinned":""} ${A===0&&i==="Quick Actions"?"featured":""}`;const T=q.memo;h.innerHTML=`
          <div class="item-icon">${u.icon}</div>
          <div class="item-label">${u.label}</div>
          ${u.shortcut?`<div class="item-shortcut">${u.shortcut}</div>`:""}
          <button class="item-pin" title="${u.isPinned?"Unpin":"Pin"}" aria-label="${u.isPinned?"Unpin":"Pin"}">
            ${T}
          </button>
          <div class="pin-indicator"></div>
        `,h.addEventListener("click",()=>{var W;this.hide(),(W=this.onActionClick)==null||W.call(this,u)});const F=h.querySelector(".item-pin");if(F){F.setAttribute("aria-pressed",u.isPinned?"true":"false");const W=F.querySelector("svg");W&&(u.isPinned?W.classList.add("filled"):W.classList.remove("filled")),F.addEventListener("click",O=>{O.preventDefault(),O.stopPropagation(),this.togglePin(u.id)})}c.appendChild(h)}),e.appendChild(c)});const t=document.createElement("div");return t.className="menu-footer",t.innerHTML=`
      <div class="powered-by">Powered by DesAInR ✨</div>
    `,e.appendChild(t),e}show(e,o,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t;const i=this.shadowRoot.querySelector(".monica-menu");i&&i.remove();const a=this.renderMenu();if(this.shadowRoot.appendChild(a),!document.body)return;document.body.appendChild(this.container);const c={width:window.innerWidth,height:window.innerHeight},f=a.getBoundingClientRect();let m=e,d=o;e+f.width>c.width-20&&(m=Math.max(20,e-f.width)),o+f.height>c.height-20&&(d=Math.max(20,o-f.height)),a.style.left=`${m}px`,a.style.top=`${d}px`,requestAnimationFrame(()=>{a.classList.add("show")});const u=A=>{const h=A.target,T=h&&h||null;(!T||!a.contains(T))&&(this.hide(),document.removeEventListener("click",u))};setTimeout(()=>{document.addEventListener("click",u)},100)}hide(){var o;const e=(o=this.shadowRoot)==null?void 0:o.querySelector(".monica-menu");e&&(e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}updateActions(e){this.actions=e}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}const je=Object.freeze(Object.defineProperty({__proto__:null,DefaultActions:ve,MonicaStyleContextMenu:Ae},Symbol.toStringTag,{value:"Module"})),_e=["refine","translate","rewrite","explain"],Re=ve.map(n=>({id:n.id,label:n.label.replace(" Selection",""),icon:n.icon,shortcut:n.shortcut,isPinned:n.isPinned,category:n.category}));class Ye{constructor(){B(this,"container",null);B(this,"shadowRoot",null);B(this,"actions",Re);B(this,"onActionClick",null);B(this,"isVisible",!1);B(this,"pinnedIds",_e);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions();try{chrome.runtime.onMessage.addListener(e=>{(e==null?void 0:e.type)==="SAVE_PINNED_ACTIONS"&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}try{chrome.storage.onChanged.addListener((e,o)=>{o==="sync"&&e["desainr.pinnedActions"]&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}r.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
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
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const o=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||_e;this.pinnedIds=o.slice(0,9),this.actions=Re.map(t=>({...t,isPinned:o.includes(t.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}refreshToolbarUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-toolbar");if(!e)return;const{left:o,top:t}=e.style;e.remove();const i=this.renderToolbar();this.shadowRoot.appendChild(i),i.classList.add("show"),o&&(i.style.left=o),t&&(i.style.top=t)}renderToolbar(){const e=document.createElement("div");e.className="monica-toolbar";const o=this.pinnedIds.map(i=>this.actions.find(a=>a.id===i&&a.isPinned)).filter(i=>!!i).slice(0,10);if(o.forEach((i,a)=>{const c=document.createElement("div");c.className=`toolbar-action ${a===0?"featured":""}`,c.innerHTML=`
        <div class="action-icon">${i.icon}</div>
        <div class="action-label">${i.label}</div>
        <div class="tooltip">${i.label}</div>
      `,c.addEventListener("click",f=>{var m;f.preventDefault(),f.stopPropagation(),(m=this.onActionClick)==null||m.call(this,i)}),e.appendChild(c)}),o.length>0){const i=document.createElement("div");i.className="toolbar-divider",e.appendChild(i)}const t=document.createElement("div");return t.className="more-button",t.innerHTML=`
      <div class="action-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </div>
      <div class="action-label">More</div>
      <div class="tooltip">More actions</div>
    `,t.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const a=t.getBoundingClientRect();this.showContextMenu(a.left,a.bottom)}),e.appendChild(t),e}showContextMenu(e,o){S(async()=>{const{MonicaStyleContextMenu:t}=await Promise.resolve().then(()=>je);return{MonicaStyleContextMenu:t}},void 0).then(({MonicaStyleContextMenu:t})=>{new t().show(e,o,a=>{var c;(c=this.onActionClick)==null||c.call(this,a)})}).catch(()=>{console.log("More actions menu clicked"),alert("More actions menu - Context menu integration pending")})}show(e,o,t){if(!this.container||!this.shadowRoot)return;this.onActionClick=t,this.isVisible=!0;const i=this.shadowRoot.querySelector(".monica-toolbar");i&&i.remove();const a=this.renderToolbar();if(this.shadowRoot.appendChild(a),!document.body)return;document.body.appendChild(this.container);const c={width:window.innerWidth},f=a.getBoundingClientRect();let m=e-f.width/2,d=o-f.height-8;m<10&&(m=10),m+f.width>c.width-10&&(m=c.width-f.width-10),d<10&&(d=o+8),a.style.left=`${m}px`,a.style.top=`${d}px`,requestAnimationFrame(()=>{a.classList.add("show")});const u=A=>{var fe;const h=A.target,T=h&&h||null,F=document.getElementById("desainr-result-popup"),W=(fe=A.composedPath)==null?void 0:fe.call(A),O=F?W?W.includes(F):T?F.contains(T):!1:!1;(!T||!a.contains(T)&&!O)&&(this.hide(),document.removeEventListener("click",u))};setTimeout(()=>{document.addEventListener("click",u)},100)}hide(){var o;const e=(o=this.shadowRoot)==null?void 0:o.querySelector(".monica-toolbar");e&&(this.isVisible=!1,e.classList.remove("show"),setTimeout(()=>{var t;(t=this.container)!=null&&t.parentNode&&this.container.parentNode.removeChild(this.container)},150))}isShown(){return this.isVisible}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}(()=>{const n="desainr-overlay-root";let e=null,o=null,t=null;(()=>{e||(e=new Ae),o||(o=new Ye)})();async function a(s,y){var v,p,P,L,H,U,g,Q,J,oe,ie,re,te,Z,Y,K,b,w,k,G,N;try{if(s==="refine"){const _=((v=window.getSelection())==null?void 0:v.toString())||"";if(!_.trim()){d("No text selected","warning");return}const l=(()=>{try{const C=window.getSelection();if(C&&C.rangeCount)return C.getRangeAt(0).getBoundingClientRect()}catch{}return null})();try{await I("Refine",_,"Working…",l||void 0);const C=await((L=(p=chrome.storage)==null?void 0:(P=p.local).get)==null?void 0:L.call(P,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),M=C==null?void 0:C["desainr.settings.modelId"],D=(C==null?void 0:C["desainr.settings.thinkingMode"])||"none",V=C==null?void 0:C["desainr.settings.userApiKey"],{rewrite:X}=await S(async()=>{const{rewrite:Ee}=await Promise.resolve().then(()=>j);return{rewrite:Ee}},void 0),{ok:E,status:z,json:R,error:ae}=await X({selection:_,url:location.href,task:"clarify",modelId:M,thinkingMode:D,userApiKey:V});if(E&&(R!=null&&R.result))await I("Refine",_,R.result,l||void 0);else{const Ee=ae||(R==null?void 0:R.error)||"unknown";await I("Refine",_,`Failed (${z}): ${Ee}`,l||void 0)}}catch(C){await I("Refine",_,`Error: ${(C==null?void 0:C.message)||C}`,l||void 0)}return}const x=((H=window.getSelection())==null?void 0:H.toString())||"",$=(()=>{try{const _=window.getSelection();if(_&&_.rangeCount)return _.getRangeAt(0).getBoundingClientRect()}catch{}return null})();if(s==="translate"){if(!x.trim()){d("No text selected","warning");return}const{translateChunks:_}=await S(async()=>{const{translateChunks:ae}=await Promise.resolve().then(()=>j);return{translateChunks:ae}},void 0);await I("Translate",x,"Working…",$||void 0);const l=await((Q=(U=chrome.storage)==null?void 0:(g=U.local).get)==null?void 0:Q.call(g,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),C=(l==null?void 0:l["desainr.settings.targetLang"])||(await S(async()=>{const{DEFAULT_TARGET_LANG:ae}=await Promise.resolve().then(()=>he);return{DEFAULT_TARGET_LANG:ae}},void 0)).DEFAULT_TARGET_LANG,M=l==null?void 0:l["desainr.settings.modelId"],D=(l==null?void 0:l["desainr.settings.thinkingMode"])||"none",V=l==null?void 0:l["desainr.settings.userApiKey"],{ok:X,status:E,json:z,error:R}=await _({selection:x,url:location.href,targetLang:C,modelId:M,thinkingMode:D,userApiKey:V});if(X&&(z!=null&&z.result))await I("Translate",x,z.result,$||void 0);else{const ae=R||(z==null?void 0:z.error)||"unknown";await I("Translate",x,`Failed (${E}): ${ae}`,$||void 0)}}else if(s==="rewrite"){if(!x.trim()){d("No text selected","warning");return}const{rewrite:_}=await S(async()=>{const{rewrite:R}=await Promise.resolve().then(()=>j);return{rewrite:R}},void 0);await I("Rewrite",x,"Working…",$||void 0);const l=await((ie=(J=chrome.storage)==null?void 0:(oe=J.local).get)==null?void 0:ie.call(oe,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),C=l==null?void 0:l["desainr.settings.modelId"],M=(l==null?void 0:l["desainr.settings.thinkingMode"])||"none",D=l==null?void 0:l["desainr.settings.userApiKey"],{ok:V,status:X,json:E,error:z}=await _({selection:x,url:location.href,task:"clarify",modelId:C,thinkingMode:M,userApiKey:D});if(V&&(E!=null&&E.result))await I("Rewrite",x,E.result,$||void 0);else{const R=z||(E==null?void 0:E.error)||"unknown";await I("Rewrite",x,`Failed (${X}): ${R}`,$||void 0)}}else if(s==="expand"){if(!x.trim()){d("No text selected","warning");return}const{rewrite:_}=await S(async()=>{const{rewrite:R}=await Promise.resolve().then(()=>j);return{rewrite:R}},void 0);await I("Expand",x,"Working…",$||void 0);const l=await((Z=(re=chrome.storage)==null?void 0:(te=re.local).get)==null?void 0:Z.call(te,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),C=l==null?void 0:l["desainr.settings.modelId"],M=(l==null?void 0:l["desainr.settings.thinkingMode"])||"none",D=l==null?void 0:l["desainr.settings.userApiKey"],{ok:V,status:X,json:E,error:z}=await _({selection:x,url:location.href,task:"expand",modelId:C,thinkingMode:M,userApiKey:D});if(V&&(E!=null&&E.result))await I("Expand",x,E.result,$||void 0);else{const R=z||(E==null?void 0:E.error)||"unknown";await I("Expand",x,`Failed (${X}): ${R}`,$||void 0)}}else if(s==="correct"){if(!x.trim()){d("No text selected","warning");return}const{rewrite:_}=await S(async()=>{const{rewrite:R}=await Promise.resolve().then(()=>j);return{rewrite:R}},void 0);await I("Correct Grammar",x,"Working…",$||void 0);const l=await((b=(Y=chrome.storage)==null?void 0:(K=Y.local).get)==null?void 0:b.call(K,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),C=l==null?void 0:l["desainr.settings.modelId"],M=(l==null?void 0:l["desainr.settings.thinkingMode"])||"none",D=l==null?void 0:l["desainr.settings.userApiKey"],{ok:V,status:X,json:E,error:z}=await _({selection:x,url:location.href,task:"grammar",modelId:C,thinkingMode:M,userApiKey:D});if(V&&(E!=null&&E.result))await I("Correct Grammar",x,E.result,$||void 0);else{const R=z||(E==null?void 0:E.error)||"unknown";await I("Correct Grammar",x,`Failed (${X}): ${R}`,$||void 0)}}else if(s==="explain"){if(!x.trim()){d("No text selected","warning");return}const{actions:_}=await S(async()=>{const{actions:R}=await Promise.resolve().then(()=>j);return{actions:R}},void 0);await I("Explain",x,"Working…",$||void 0);const l=await((G=(w=chrome.storage)==null?void 0:(k=w.local).get)==null?void 0:G.call(k,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),C=l==null?void 0:l["desainr.settings.modelId"],M=(l==null?void 0:l["desainr.settings.thinkingMode"])||"none",D=l==null?void 0:l["desainr.settings.userApiKey"],{ok:V,status:X,json:E,error:z}=await _({selection:x,clientMessage:x,customInstruction:"Explain this clearly",modelId:C,thinkingMode:M,userApiKey:D});if(V&&(E!=null&&E.result))await I("Explain",x,E.result,$||void 0);else{const R=z||(E==null?void 0:E.error)||"unknown";await I("Explain",x,`Failed (${X}): ${R}`,$||void 0)}}else if(s==="analyze"){const{analyzePage:_}=await S(async()=>{const{analyzePage:V}=await Promise.resolve().then(()=>j);return{analyzePage:V}},void 0);await I("Analyze",x||"(No selection)","Working…",$||void 0);const{ok:l,status:C,json:M,error:D}=await _({url:location.href,title:document.title});if(l)await I("Analyze",x||"(No selection)",(M==null?void 0:M.summary)||"Done",$||void 0);else{const V=D||(M==null?void 0:M.error)||"unknown";await I("Analyze",x||"(No selection)",`Failed (${C}): ${V}`,$||void 0)}}else if(s==="chat-personal"||s==="chat-pro")fe();else if(s==="copy"){const _=((N=window.getSelection())==null?void 0:N.toString())||"";_?(navigator.clipboard.writeText(_),d("Text copied to clipboard! 📋","success")):d("No text selected","warning")}else s==="settings"?d("Extension settings coming soon! ⚙️","info"):s==="customize"?d("Custom actions coming soon! 🔧","info"):d(`Unknown action: ${y}`,"warning")}catch(x){d(`Error: ${(x==null?void 0:x.message)||x}`,"error")}}const c=document.getElementById(n);if(c)try{c.style.display="none",c.textContent=""}catch{}function f(){return t&&t.remove(),t=document.createElement("div"),Object.assign(t.style,{position:"fixed",top:"20px",right:"20px",zIndex:r.zIndex.toast,background:r.colors.surface,color:r.colors.textPrimary,border:`1px solid ${r.colors.border}`,borderRadius:r.borderRadius.lg,padding:`${r.spacing.md} ${r.spacing.lg}`,boxShadow:r.shadows.lg,backdropFilter:"blur(12px)",maxWidth:"420px",fontFamily:r.typography.fontFamily,fontSize:r.typography.fontSize.sm,display:"none",opacity:"0",transform:"translateY(-8px) scale(0.95)",transition:`all ${r.animation.fast}`}),document.documentElement.appendChild(t),t}function m(){return f()}function d(s,y="info"){const v=f(),p={info:"💬",success:"✅",error:"❌",warning:"⚠️"},P={info:r.colors.info,success:r.colors.success,error:r.colors.error,warning:r.colors.warning};v.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.md};">
        <div style="font-size: 18px;">${p[y]}</div>
        <div style="flex: 1; line-height: ${r.typography.lineHeight.normal};">${s}</div>
        <div style="width: 4px; height: 40px; background: ${P[y]}; border-radius: 2px; margin-left: ${r.spacing.md};"></div>
      </div>
    `,v.style.display="block",requestAnimationFrame(()=>{v.style.opacity="1",v.style.transform="translateY(0) scale(1)"}),setTimeout(()=>u(),3e3)}function u(){t&&(t.style.opacity="0",t.style.transform="translateY(-8px) scale(0.95)",setTimeout(()=>{t&&(t.style.display="none")},150))}function A(s,y,v=6e3){const p=document.createElement("button");p.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.xs};">
        <span>↶</span>
        <span>Undo</span>
      </div>
    `,Object.assign(p.style,{marginLeft:r.spacing.md,padding:`${r.spacing.xs} ${r.spacing.md}`,background:r.colors.primary,color:"white",border:"none",borderRadius:r.borderRadius.md,cursor:"pointer",fontSize:r.typography.fontSize.sm,fontWeight:r.typography.fontWeight.medium,transition:`all ${r.animation.fast}`,fontFamily:r.typography.fontFamily}),p.onmouseenter=()=>{p.style.background=r.colors.primaryHover,p.style.transform="translateY(-1px)"},p.onmouseleave=()=>{p.style.background=r.colors.primary,p.style.transform="translateY(0)"};const P=()=>{try{const L=y();d(L?"Undone successfully! ✓":"Undo failed",L?"success":"error")}catch{d("Undo failed","error")}finally{p.remove(),setTimeout(()=>u(),800)}};p.addEventListener("click",P,{once:!0}),s.appendChild(p),setTimeout(()=>{try{p.remove()}catch{}},v)}function h(s,y,v=12e3){const p=document.createElement("button");p.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${r.spacing.xs};">
        <span>📋</span>
        <span>Copy</span>
      </div>
    `,Object.assign(p.style,{marginLeft:r.spacing.md,padding:`${r.spacing.xs} ${r.spacing.md}`,background:r.colors.surface,color:r.colors.textPrimary,border:`1px solid ${r.colors.border}`,borderRadius:r.borderRadius.md,cursor:"pointer",fontSize:r.typography.fontSize.sm,fontWeight:r.typography.fontWeight.medium,transition:`all ${r.animation.fast}`,fontFamily:r.typography.fontFamily}),p.onmouseenter=()=>{p.style.background=r.colors.surfaceHover,p.style.borderColor=r.colors.primary,p.style.transform="translateY(-1px)"},p.onmouseleave=()=>{p.style.background=r.colors.surface,p.style.borderColor=r.colors.border,p.style.transform="translateY(0)"};const P=async()=>{try{await navigator.clipboard.writeText(y),d("Copied to clipboard! ✓","success")}catch{d("Copy failed","error")}finally{p.remove(),setTimeout(()=>u(),800)}};p.addEventListener("click",P,{once:!0}),s.appendChild(p),setTimeout(()=>{try{p.remove()}catch{}},v)}function T(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function F(s,y){const v=T(String(y.summary||"Analysis complete")),p=Array.isArray(y.keyPoints)?y.keyPoints:[],P=Array.isArray(y.links)?y.links:[],L=p.length?`<ul style="margin:6px 0 8px 18px; padding:0;">${p.map(g=>`<li style="margin:2px 0;">${T(g)}</li>`).join("")}</ul>`:"",H=P.length?`<div style="margin-top:6px; max-height:160px; overflow:auto;"><div style="font-weight:600; margin-bottom:4px;">Top links</div>${P.slice(0,10).map(g=>`<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><a href="${T(g)}" target="_blank" rel="noopener noreferrer">${T(g)}</a></div>`).join("")}</div>`:"";s.innerHTML=`<div style="font-size:13px; line-height:1.35;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-weight:700;">Analysis</div>
        <button id="desainr-close-overlay" style="border:1px solid #ddd; border-radius:6px; padding:2px 6px; background:#f7f7f7; cursor:pointer;">Close</button>
      </div>
      <div style="margin-top:6px;">${v}</div>
      ${L}
      ${H}
    </div>`;const U=s.querySelector("#desainr-close-overlay");U&&(U.onclick=()=>{s.style.display="none"})}let W=null,O=null;async function fe(){if(O){try{O.detach()}catch{}O=null,W=null;return}const s=document.createElement("div");s.id="desainr-overlay-react-root",Object.assign(s.style,{position:"fixed",top:"20px",right:"20px",zIndex:1e6}),document.documentElement.appendChild(s);try{O=(await S(()=>Promise.resolve().then(()=>at),void 0)).mountOverlay(s,()=>{try{O==null||O.detach()}catch{}O=null,W=null}),W=s}catch(y){const v=m();v.style.display="block",v.textContent=`Overlay failed: ${(y==null?void 0:y.message)||y}`,setTimeout(()=>u(),1500)}}let Rt=0,ke=null,ye=null;function Pt(){if(ke)return ke;const s=document.createElement("div");s.id="desainr-result-popup",Object.assign(s.style,{position:"fixed",zIndex:1e6,top:"0px",left:"0px",display:"none"}),ye=s.attachShadow({mode:"open"});const y=document.createElement("style");y.textContent=`
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
    `,ye.appendChild(y);const v=document.createElement("div");return v.className="popup",v.innerHTML=`<div class="hdr"><div class="ttl">Refine Result</div><button id="close">✕</button></div>
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
      </div>`,ye.appendChild(v),document.documentElement.appendChild(s),ke=s,s}async function I(s,y,v,p){const P=Pt(),L=ye;if(!L){try{console.warn("DesAInR: popupShadow not available")}catch{}return}const H=L.querySelector(".ttl"),U=L.getElementById("orig"),g=L.getElementById("res"),Q=L.getElementById("close"),J=L.getElementById("cancel"),oe=L.getElementById("copy"),ie=L.getElementById("replace");H&&(H.textContent=s),U&&(U.textContent=y),g&&(g.textContent=v);function re(){let Z=0,Y=0;const K=10,b=p||new DOMRect(window.innerWidth/2-200,80,400,0),w=P.getBoundingClientRect();Z=Math.min(Math.max(K,b.left),window.innerWidth-w.width-K),Y=Math.min(Math.max(K,b.top+b.height+K),window.innerHeight-w.height-K),P.style.left=`${Math.round(Z)}px`,P.style.top=`${Math.round(Y)}px`}P.style.display="block",requestAnimationFrame(()=>re());const te=()=>{P.style.display="none"};Q&&(Q.onclick=()=>te()),J&&(J.onclick=()=>te()),oe&&(oe.onclick=async()=>{try{await navigator.clipboard.writeText(v)}catch{}}),ie&&(ie.onclick=async()=>{const{applyReplacementOrCopyWithUndo:Z}=await S(async()=>{const{applyReplacementOrCopyWithUndo:w}=await Promise.resolve().then(()=>Be);return{applyReplacementOrCopyWithUndo:w}},void 0),{outcome:Y,undo:K}=await Z(v),b=m();Y==="replaced"?(b.textContent="Replaced ✓",K&&A(b,K)):Y==="copied"?(b.textContent="Copied ✓",h(b,v)):b.textContent="Done",b.style.display="block",setTimeout(()=>u(),900),te()})}async function $t(){const y=(await S(()=>Promise.resolve().then(()=>ht),void 0)).getSelectionInfo();if(!y){Ce();return}if(y.text,y.rect,o){const v=y.rect,p=v.left+v.width/2,P=v.top-8;o.show(p,P,L=>{a(L.id,L.label)})}}function Ce(){if(o)try{o.hide()}catch(s){console.warn("Error hiding Monica toolbar:",s)}}document.addEventListener("keydown",s=>{if(s.key==="Escape"&&(Ce(),O)){try{O.detach()}catch{}O=null,W=null}}),document.addEventListener("selectionchange",()=>{var y;if(Date.now()<Rt)return;(((y=window.getSelection())==null?void 0:y.toString())||"").trim()||Ce()}),document.addEventListener("mousedown",s=>{},!0);function Mt(s=4e3){return new Promise(y=>{let v=!1;const p=H=>{window.removeEventListener("message",P),H&&clearTimeout(H)},P=H=>{if(H.source!==window)return;const U=H.data;if(!U||U.type!=="DESAINR_WEBAPP_TOKEN"||v)return;v=!0,p();const{ok:g,idToken:Q,error:J}=U||{};y({ok:!!g,idToken:Q,error:J||(g?void 0:"no_token")})};window.addEventListener("message",P);const L=window.setTimeout(()=>{v||(v=!0,p(),y({ok:!1,error:"timeout"}))},s);try{window.postMessage({type:"DESAINR_EXTENSION_GET_TOKEN",from:"desainr-extension"},window.origin)}catch{v=!0,p(L),y({ok:!1,error:"post_message_failed"})}})}chrome.runtime.onMessage.addListener((s,y,v)=>{if((s==null?void 0:s.type)==="TOGGLE_OVERLAY"&&fe(),(s==null?void 0:s.type)==="CONTEXT_MENU"&&St(s.id,s.info),(s==null?void 0:s.type)==="DESAINR_GET_WEBAPP_ID_TOKEN")return Mt().then(p=>v(p)),!0}),document.addEventListener("mouseup",()=>{setTimeout(()=>{$t().catch(()=>{})},100)}),document.addEventListener("contextmenu",s=>{const y=window.getSelection();y&&y.toString().trim()&&(s.preventDefault(),e&&e.show(s.pageX,s.pageY,v=>{a(v.id,v.label)}))});async function St(s,y){var Q,J,oe,ie,re,te,Z,Y,K;const{rewrite:v,translateChunks:p,analyzePage:P,saveMemo:L}=await S(async()=>{const{rewrite:b,translateChunks:w,analyzePage:k,saveMemo:G}=await Promise.resolve().then(()=>j);return{rewrite:b,translateChunks:w,analyzePage:k,saveMemo:G}},void 0),{DEFAULT_TARGET_LANG:H}=await S(async()=>{const{DEFAULT_TARGET_LANG:b}=await Promise.resolve().then(()=>he);return{DEFAULT_TARGET_LANG:b}},void 0),{applyReplacementOrCopyWithUndo:U}=await S(async()=>{const{applyReplacementOrCopyWithUndo:b}=await Promise.resolve().then(()=>Be);return{applyReplacementOrCopyWithUndo:b}},void 0),g=m();g.style.display="block";try{if(s==="desainr-refine"){g.textContent="Refining selection...";const b=((Q=window.getSelection())==null?void 0:Q.toString())||"",w=await((ie=(J=chrome.storage)==null?void 0:(oe=J.local).get)==null?void 0:ie.call(oe,["desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),k=w==null?void 0:w["desainr.settings.modelId"],G=(w==null?void 0:w["desainr.settings.thinkingMode"])||"none",N=w==null?void 0:w["desainr.settings.userApiKey"],{ok:x,status:$,json:_,error:l}=await v({selection:b,url:location.href,task:"clarify",modelId:k,thinkingMode:G,userApiKey:N});if(x&&(_!=null&&_.result)){const{outcome:C,undo:M}=await U(_.result);C==="replaced"?(g.textContent="Refined ✓ (replaced selection)",M&&A(g,M)):C==="copied"?g.textContent="Refined ✓ (copied)":g.textContent="Refined ✓"}else g.textContent=`Refine failed (${$}): ${l||"unknown"}`}else if(s==="desainr-translate"){g.textContent="Translating selection...";const b=((re=window.getSelection())==null?void 0:re.toString())||"",w=await((Y=(te=chrome.storage)==null?void 0:(Z=te.local).get)==null?void 0:Y.call(Z,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode","desainr.settings.userApiKey"]).catch(()=>({}))),k=(w==null?void 0:w["desainr.settings.targetLang"])||H,G=w==null?void 0:w["desainr.settings.modelId"],N=(w==null?void 0:w["desainr.settings.thinkingMode"])||"none",x=w==null?void 0:w["desainr.settings.userApiKey"],{ok:$,status:_,json:l,error:C}=await p({selection:b,url:location.href,targetLang:k,modelId:G,thinkingMode:N,userApiKey:x});if($&&(l!=null&&l.result)){const{outcome:M,undo:D}=await U(l.result);M==="replaced"?(g.textContent="Translated ✓ (replaced selection)",D&&A(g,D)):M==="copied"?g.textContent="Translated ✓ (copied)":g.textContent="Translated ✓"}else g.textContent=`Translate failed (${_}): ${C||"unknown"}`}else if(s==="desainr-save-memo"){g.textContent="Saving to memo...";const b=((K=window.getSelection())==null?void 0:K.toString())||"";if(!b)g.textContent="No text selected";else{const w={title:`Selection from ${document.title||location.hostname}`,content:b,url:location.href,type:"selection",metadata:{pageTitle:document.title,timestamp:new Date().toISOString()},tags:["selection","extension"]},{ok:k,json:G,error:N}=await L(w);k&&G?g.textContent=`✓ Saved to memo (ID: ${G.memoId})`:g.textContent=`Save to memo failed: ${N||"unknown"}`}}else if(s==="desainr-analyze"){g.textContent="Analyzing page...";const{ok:b,status:w,json:k,error:G}=await P({url:location.href,title:document.title});b?F(g,{summary:k==null?void 0:k.summary,keyPoints:k==null?void 0:k.keyPoints,links:k==null?void 0:k.links}):g.textContent=`Analyze failed (${w}): ${G||"unknown"}`}else if(s==="desainr-translate-page"){g.textContent="Translating page...";const{translatePageAll:b}=await S(async()=>{const{translatePageAll:k}=await Promise.resolve().then(()=>kt);return{translatePageAll:k}},void 0),{DEFAULT_TARGET_LANG:w}=await S(async()=>{const{DEFAULT_TARGET_LANG:k}=await Promise.resolve().then(()=>he);return{DEFAULT_TARGET_LANG:k}},void 0);try{const k=await b(w);g.textContent=`Translated page ✓ (${k.translated}/${k.totalNodes} nodes, skipped ${k.skipped})`}catch(k){g.textContent=`Translate page error: ${(k==null?void 0:k.message)||k}`}}else if(s==="desainr-toggle-parallel"){const{isParallelModeEnabled:b,enableParallelMode:w,disableParallelMode:k}=await S(async()=>{const{isParallelModeEnabled:N,enableParallelMode:x,disableParallelMode:$}=await Promise.resolve().then(()=>_t);return{isParallelModeEnabled:N,enableParallelMode:x,disableParallelMode:$}},void 0),{DEFAULT_TARGET_LANG:G}=await S(async()=>{const{DEFAULT_TARGET_LANG:N}=await Promise.resolve().then(()=>he);return{DEFAULT_TARGET_LANG:N}},void 0);try{b()?(g.textContent="Disabling parallel translate...",k(),g.textContent="Parallel translate OFF"):(g.textContent="Enabling parallel translate...",await w(G),g.textContent="Parallel translate ON")}catch(N){g.textContent=`Parallel toggle error: ${(N==null?void 0:N.message)||N}`}}else g.textContent=`Unknown action: ${s}`}catch(b){g.textContent=`Error: ${(b==null?void 0:b.message)||b}`}finally{setTimeout(()=>{try{u()}catch{}},800)}}})();const ce={rewrite:{maxTokens:20,refillRate:.5,costPerCall:1},"translate-chunks":{maxTokens:30,refillRate:1,costPerCall:1},"analyze-page":{maxTokens:10,refillRate:.2,costPerCall:1},chat:{maxTokens:30,refillRate:.5,costPerCall:1},actions:{maxTokens:20,refillRate:.5,costPerCall:1},"memo/save":{maxTokens:50,refillRate:1,costPerCall:1},"slash-prompts":{maxTokens:10,refillRate:.5,costPerCall:1},default:{maxTokens:20,refillRate:.5,costPerCall:1}},Pe="rateLimiter_";function $e(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function Me(n){var t;const e=`${Pe}${n}`,o=ce[n]||ce.default;if($e())return new Promise(i=>{chrome.storage.local.get(e,a=>{const c=a[e];c&&c.tokens!==void 0&&c.lastRefill!==void 0?i(c):i({tokens:o.maxTokens,lastRefill:Date.now()})})});try{const i=(t=globalThis==null?void 0:globalThis.localStorage)==null?void 0:t.getItem(e);if(i){const a=JSON.parse(i);if(a&&a.tokens!==void 0&&a.lastRefill!==void 0)return a}}catch{}return{tokens:o.maxTokens,lastRefill:Date.now()}}async function Se(n,e){var t;const o=`${Pe}${n}`;if($e())return new Promise(i=>{chrome.storage.local.set({[o]:e},i)});try{(t=globalThis==null?void 0:globalThis.localStorage)==null||t.setItem(o,JSON.stringify(e))}catch{}}function Le(n,e){const o=Date.now(),i=(o-n.lastRefill)/1e3*e.refillRate;return{tokens:Math.min(n.tokens+i,e.maxTokens),lastRefill:o}}async function Xe(n){const e=ce[n]||ce.default;let o=await Me(n);return o=Le(o,e),o.tokens<e.costPerCall?(await Se(n,o),!1):(o.tokens-=e.costPerCall,await Se(n,o),!0)}async function Qe(n){const e=ce[n]||ce.default;let o=await Me(n);o=Le(o,e);const t=Math.max(0,e.costPerCall-o.tokens),i=t>0?t/e.refillRate:0;return{remainingTokens:Math.floor(o.tokens),maxTokens:e.maxTokens,timeUntilRefill:Math.ceil(i),canMakeCall:o.tokens>=e.costPerCall}}async function le(n,e){if(!await Xe(n)){const i=(await Qe(n)).timeUntilRefill;return{ok:!1,status:429,error:`Rate limit exceeded. Please wait ${i} second${i!==1?"s":""} before trying again.`}}return new Promise(t=>{chrome.runtime.sendMessage({type:"API_CALL",path:n,body:e},i=>{if(!i)return t({ok:!1,status:0,error:"No response from background"});t(i)})})}function Ie(n,e,o){const t=`${e&&(e.error||(e.message??""))||""} ${o||""}`.toLowerCase(),i=["quota","exhausted","insufficient","rate limit","resource has been exhausted","insufficient_quota","429","capacity"];return!!(n===429||n>=500&&i.some(a=>t.includes(a)))}function Ne(n,e,o){const t=`${e&&(e.error||(e.message??""))||""} ${o||""}`.toLowerCase();return n===401||n===403?!0:["invalid api key","api key not valid","key invalid","missing api key","no api key","invalid authentication","unauthorized","forbidden","permission denied"].some(a=>t.includes(a))}function ze(n,e,o){const t=`${e&&(e.error||(e.message??""))||""} ${o||""}`.toLowerCase();return["billing","access not configured","permission not configured","project has been blocked","enable billing"].some(a=>t.includes(a))}function Je(n,e,o){if(Ne(n,e,o))return"Invalid or unauthorized API key. Update your Gemini API key in Settings or sign in again.";if(ze(n,e,o))return"Billing or API access is not configured for this key/project. Enable billing in Google AI Studio or use another API key.";if(Ie(n,e,o))return"AI capacity exhausted right now. Please try again in a bit, or switch the model/API key in settings.";if(n===401||n===403)return"Unauthorized. Please sign in again.";if(n===429)return"Too many requests. Please slow down and try again shortly.";if(n>=500)return"Server error. Please try again shortly."}async function de(n,e=3,o=100){let t;for(let i=0;i<e;i++){let a=await n();if(a.ok)return a;const c=Je(a.status,a.json,a.error);c&&(a={...a,error:c}),t=a;const f=!a.status||a.status===0||a.status>=500,m=Ie(a.status,a.json,a.error),d=Ne(a.status,a.json,a.error),u=ze(a.status,a.json,a.error);if(!f||m||d||u||a.status===401||a.status===403||a.status===400)break;await new Promise(A=>setTimeout(A,o*Math.pow(2,i)))}return t??{ok:!1,status:0,error:"Unknown error"}}async function Ze(n){return de(()=>le("rewrite",n))}async function et(n){return de(()=>le("translate-chunks",n))}async function tt(n){return de(()=>le("translate-chunks",n))}async function nt(n){return de(()=>le("analyze-page",n))}async function ot(n){return de(()=>le("actions",n))}async function it(n){return de(()=>le("memo/save",n))}const j=Object.freeze(Object.defineProperty({__proto__:null,actions:ot,analyzePage:nt,rewrite:Ze,saveMemo:it,translateChunks:et,translateChunksBatch:tt},Symbol.toStringTag,{value:"Module"})),he=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_TARGET_LANG:"en"},Symbol.toStringTag,{value:"Module"}));function rt(n,e){try{n.innerHTML=""}catch{}const o=n.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
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
  `,o.appendChild(i);const a=o.getElementById("ovl-close");return a&&a.addEventListener("click",()=>{try{e&&e()}catch{}}),{detach:()=>{try{n.parentNode&&n.parentNode.removeChild(n)}catch{}}}}const at=Object.freeze(Object.defineProperty({__proto__:null,mountOverlay:rt},Symbol.toStringTag,{value:"Module"}));class st{constructor(e=50){B(this,"history",[]);B(this,"currentIndex",-1);B(this,"maxHistorySize",50);B(this,"listeners",new Set);this.maxHistorySize=e}addAction(e){const o=`undo-${Date.now()}-${Math.random()}`,t={...e,id:o,timestamp:Date.now()};return this.history=this.history.slice(0,this.currentIndex+1),this.history.push(t),this.currentIndex++,this.history.length>this.maxHistorySize&&(this.history=this.history.slice(-this.maxHistorySize),this.currentIndex=this.history.length-1),this.notifyListeners(),o}undo(){if(!this.canUndo())return!1;const o=this.history[this.currentIndex].undo();return o&&(this.currentIndex--,this.notifyListeners()),o}redo(){if(!this.canRedo())return!1;const e=this.history[this.currentIndex+1];if(!e.redo)return!1;const o=e.redo();return o&&(this.currentIndex++,this.notifyListeners()),o}canUndo(){return this.currentIndex>=0}canRedo(){var e;return this.currentIndex<this.history.length-1&&((e=this.history[this.currentIndex+1])==null?void 0:e.redo)!==void 0}getHistory(){return[...this.history]}getRecentActions(e=5){return this.history.slice(Math.max(0,this.currentIndex-e+1),this.currentIndex+1).reverse()}clear(){this.history=[],this.currentIndex=-1,this.notifyListeners()}clearOld(e){const o=Date.now()-e,t=this.history.findIndex(i=>i.timestamp>=o);t>0&&(this.history=this.history.slice(t),this.currentIndex=Math.max(-1,this.currentIndex-t),this.notifyListeners())}subscribe(e){return this.listeners.add(e),e(this.getHistory(),this.canUndo(),this.canRedo()),()=>{this.listeners.delete(e)}}notifyListeners(){const e=this.getHistory(),o=this.canUndo(),t=this.canRedo();this.listeners.forEach(i=>{i(e,o,t)})}}let we=null;function ct(){return we||(we=new st),we}function lt(n){if(!n)return!1;const e=n.tagName.toLowerCase();return e==="input"||e==="textarea"}async function Oe(n){var e;try{if((e=navigator.clipboard)!=null&&e.writeText)return await navigator.clipboard.writeText(n),!0}catch{}try{const o=document.createElement("textarea");o.value=n,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.focus(),o.select();const t=document.execCommand("copy");return document.body.removeChild(o),t}catch{return!1}}function De(n){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const o=document.activeElement;if(lt(o))try{const t=o,i=t.selectionStart??0,a=t.selectionEnd??i,c=t.value??"",f=c.slice(i,a);t.value=c.slice(0,i)+n+c.slice(a);const m=i+n.length;t.selectionStart=t.selectionEnd=m,t.dispatchEvent(new Event("input",{bubbles:!0}));const d={description:`Replace "${f.slice(0,20)}${f.length>20?"...":""}" with "${n.slice(0,20)}${n.length>20?"...":""}"`,undo:()=>{try{return t.value=c,t.selectionStart=i,t.selectionEnd=a,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}},redo:()=>{try{return t.value=c.slice(0,i)+n+c.slice(a),t.selectionStart=t.selectionEnd=i+n.length,t.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}}};return ct().addAction(d),{undo:d.undo}}catch{}try{const t=e.getRangeAt(0),i=t.cloneContents(),a=t.cloneContents(),c=Array.from(a.childNodes).some(d=>d.nodeType!==Node.TEXT_NODE),f=t.endContainer!==t.startContainer;if(c&&f)return null;t.deleteContents();const m=document.createTextNode(n);return t.insertNode(m),t.setStartAfter(m),t.collapse(!0),e.removeAllRanges(),e.addRange(t),{undo:()=>{try{const d=m.parentNode;if(!d)return!1;const u=i.cloneNode(!0);return d.insertBefore(u,m),d.removeChild(m),!0}catch{return!1}}}}catch{return null}}async function dt(n){const e=De(n);return e?{outcome:"replaced",undo:e.undo}:await Oe(n)?{outcome:"copied"}:{outcome:"failed"}}const Be=Object.freeze(Object.defineProperty({__proto__:null,applyReplacementOrCopyWithUndo:dt,copyToClipboard:Oe,replaceSelectionSafelyWithUndo:De},Symbol.toStringTag,{value:"Module"}));function ut(){const n=window.getSelection();if(!n||n.rangeCount===0)return null;const o=n.getRangeAt(0).getBoundingClientRect(),t=n.toString();if(!t.trim())return null;const i=o.left+window.scrollX,a=o.top+window.scrollY;return{text:t,rect:o,pageX:i,pageY:a}}const ht=Object.freeze(Object.defineProperty({__proto__:null,getSelectionInfo:ut},Symbol.toStringTag,{value:"Module"})),pt=new Set(["script","style","noscript","template","textarea","input","select","option","code","pre","kbd","samp","var","svg","canvas","math","video","audio"]);function mt(n){if(!n)return!1;if(n.isContentEditable)return!0;const o=n.getAttribute("contenteditable");return o===""||o==="true"}function ft(n){if(!n)return!1;const e=n.tagName.toLowerCase();return e==="input"||e==="textarea"||e==="select"||e==="option"}function gt(n){return!!(!n||pt.has(n.tagName.toLowerCase())||ft(n)||mt(n))}function yt(n){const e=getComputedStyle(n);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0"||n.hidden)return!0;const o=n.getBoundingClientRect();return o.width===0&&o.height===0}function vt(n){let e=n;for(;e;){if(gt(e)||yt(e))return!0;e=e.parentElement}return!1}function wt(n,e=5){const o=[];let t=n,i=0;for(;t&&i<e;){const a=t.tagName.toLowerCase(),c=t.id?`#${t.id}`:"",f=t.className&&typeof t.className=="string"?`.${t.className.trim().split(/\s+/).slice(0,2).join(".")}`:"";o.unshift(`${a}${c}${f}`),t=t.parentElement,i++}return o.join(">")}function xe(n=document.body){const e=[],o=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,{acceptNode:i=>{if(i.nodeType!==Node.TEXT_NODE)return NodeFilter.FILTER_REJECT;const a=i.data;if(!a||!a.trim())return NodeFilter.FILTER_REJECT;const c=i.parentElement;return!c||c.closest&&c.closest(".desainr-parallel-wrapper")||vt(c)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let t=o.nextNode();for(;t;){const i=t,a=i.parentElement;e.push({node:i,text:i.data,index:e.length,parent:a,path:wt(a)}),t=o.nextNode()}return e}function Fe(n){return n.map(e=>e.text)}async function xt(n,e,o){const t=new Array(n.length);let i=0,a=0;return new Promise((c,f)=>{const m=()=>{for(;a<e&&i<n.length;){const d=i++;a++,Promise.resolve(o(n[d],d)).then(u=>{t[d]=u,a--,i>=n.length&&a===0?c(t):m()}).catch(u=>{t[d]=void 0,a--,i>=n.length&&a===0?c(t):m()})}};n.length===0?c(t):m()})}async function bt(n,e=3,o=400){var A;const{translateChunksBatch:t,translateChunks:i}=await S(async()=>{const{translateChunksBatch:h,translateChunks:T}=await Promise.resolve().then(()=>j);return{translateChunksBatch:h,translateChunks:T}},void 0),a=xe(),c=a.slice(0,o),f=Fe(c);let m=[],d=!1;try{const h=await t({chunks:f,url:location.href,targetLang:n});h.ok&&Array.isArray((A=h.json)==null?void 0:A.results)&&(m=h.json.results??[],d=!0)}catch{}(!d||m.length!==f.length)&&(m=await xt(f,e,async h=>{var F;const T=await i({selection:h,url:location.href,targetLang:n});return T.ok&&((F=T.json)!=null&&F.result)?T.json.result:h}));let u=0;for(let h=0;h<c.length;h++)try{const T=m[h];typeof T=="string"&&T!==c[h].text&&(c[h].node.data=T,u++)}catch{}return{totalNodes:a.length,translated:u,skipped:c.length-u}}const kt=Object.freeze(Object.defineProperty({__proto__:null,collectTextNodes:xe,snapshotTexts:Fe,translatePageAll:bt},Symbol.toStringTag,{value:"Module"})),pe="desainr-parallel-wrapper",He="desainr-parallel-original",Ue="desainr-parallel-translated",Ge="desainr-parallel-style";let ee=!1,me=null;function Ct(){if(document.getElementById(Ge))return;const n=document.createElement("style");n.id=Ge,n.textContent=`
    .${pe} { display: inline; white-space: pre-wrap; }
    .${He} { opacity: 0.95; }
    .${Ue} { opacity: 0.75; color: #555; margin-left: 0.4em; }
  `,document.documentElement.appendChild(n)}async function be(n,e){var i;const{translateChunks:o}=await S(async()=>{const{translateChunks:a}=await Promise.resolve().then(()=>j);return{translateChunks:a}},void 0),t=await o({selection:n,url:location.href,targetLang:e});return t.ok&&((i=t.json)!=null&&i.result)?t.json.result:n}function ge(n,e){const o=n.parentElement;if(!o||o.closest&&o.closest(`.${pe}`))return;const t=n.data,i=document.createElement("span");i.className=pe,i.dataset.orig=t;const a=document.createElement("span");a.className=He,a.textContent=t;const c=document.createElement("span");c.className=Ue,c.textContent=e,i.appendChild(a),i.appendChild(document.createTextNode(" ")),i.appendChild(c),o.replaceChild(i,n)}function Ve(n){return!!n&&n.classList.contains(pe)}function Et(){var e;if(!ee)return;ee=!1,me&&(me.disconnect(),me=null);const n=Array.from(document.querySelectorAll(`.${pe}`));for(const o of n){const t=((e=o.dataset)==null?void 0:e.orig)??"",i=document.createTextNode(t);o.parentNode&&o.parentNode.replaceChild(i,o)}}function Tt(){return ee}async function At(n){var f;if(ee)return;ee=!0,Ct();const t=xe().slice(0,400),{DEFAULT_TARGET_LANG:i}=await S(async()=>{const{DEFAULT_TARGET_LANG:m}=await Promise.resolve().then(()=>he);return{DEFAULT_TARGET_LANG:m}},void 0),a=n||i;let c=!1;try{const{translateChunksBatch:m}=await S(async()=>{const{translateChunksBatch:h}=await Promise.resolve().then(()=>j);return{translateChunksBatch:h}},void 0),d=t.map(h=>h.text),u=await m({chunks:d,url:location.href,targetLang:a}),A=(f=u.json)==null?void 0:f.results;if(u.ok&&Array.isArray(A)&&A.length===t.length){for(let h=0;h<t.length;h++)try{ge(t[h].node,A[h])}catch{}c=!0}}catch{}if(!c){let d=0;async function u(){if(!ee)return;const A=d++;if(A>=t.length)return;const h=t[A];try{const T=await be(h.text,a);ge(h.node,T)}catch{}await u()}await Promise.all(new Array(3).fill(0).map(()=>u()))}me=new MutationObserver(async m=>{if(ee)for(const d of m)if(d.type==="characterData"&&d.target.nodeType===Node.TEXT_NODE){const u=d.target,A=u.parentElement;if(!A||Ve(A))continue;const h=u.data;if(h&&h.trim())try{const T=await be(h,a);if(!ee)return;ge(u,T)}catch{}}else d.type==="childList"&&d.addedNodes.forEach(async u=>{if(u.nodeType===Node.TEXT_NODE){const A=u,h=A.parentElement;if(!h||Ve(h))return;const T=A.data;if(T&&T.trim())try{const F=await be(T,a);if(!ee)return;ge(A,F)}catch{}}})}),me.observe(document.body,{subtree:!0,childList:!0,characterData:!0})}const _t=Object.freeze(Object.defineProperty({__proto__:null,disableParallelMode:Et,enableParallelMode:At,isParallelModeEnabled:Tt},Symbol.toStringTag,{value:"Module"}))})();
