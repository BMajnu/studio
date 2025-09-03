var Zd=Object.defineProperty;var ef=(Pt,rt,tn)=>rt in Pt?Zd(Pt,rt,{enumerable:!0,configurable:!0,writable:!0,value:tn}):Pt[rt]=tn;var be=(Pt,rt,tn)=>ef(Pt,typeof rt!="symbol"?rt+"":rt,tn);(function(){"use strict";const Pt="modulepreload",rt=function(i){return"/"+i},tn={},ne=function(e,t,r){let s=Promise.resolve();function a(l){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=l,window.dispatchEvent(p),!p.defaultPrevented)throw l}return s.then(l=>{for(const p of l||[])p.status==="rejected"&&a(p.reason);return e().catch(a)})},Aa={background:"#0f0f0f",surface:"#1a1a1a",surfaceHover:"#262626",surfaceActive:"#333333",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#ffffff",textSecondary:"#a1a1aa",textMuted:"#71717a",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#262626",borderLight:"#374151",shadow:"rgba(0, 0, 0, 0.8)",shadowLight:"rgba(0, 0, 0, 0.4)"},Sa={background:"#ffffff",surface:"#f8fafc",surfaceHover:"#f1f5f9",surfaceActive:"#e2e8f0",primary:"#8b5cf6",primaryHover:"#7c3aed",primaryActive:"#6d28d9",primaryLight:"#a78bfa",textPrimary:"#1e293b",textSecondary:"#475569",textMuted:"#64748b",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",border:"#e2e8f0",borderLight:"#cbd5e1",shadow:"rgba(0, 0, 0, 0.15)",shadowLight:"rgba(0, 0, 0, 0.08)"},ka=()=>typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":"dark",wr=()=>ka()==="dark"?Aa:Sa,T={colors:wr(),updateTheme(){this.colors=wr()},watchThemeChanges(i){typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.updateTheme(),i()})},featureIcons:{refine:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',translate:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 4h2.764L13 9.236 11.618 12z"></path></svg>',rewrite:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',analyze:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',explain:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>',correct:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',expand:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',chatPersonal:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>',chatPro:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',copy:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>',settings:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',customize:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>'},featureCategories:{"Quick Actions":{title:"Quick Actions",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>',description:"Fast access to common tools"},"Content Tools":{title:"Content Tools",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',description:"Text editing and enhancement"},"AI Chat":{title:"AI Chat",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>',description:"AI-powered conversations"},Advanced:{title:"Advanced",icon:'<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',description:"Advanced features and settings"}},spacing:{xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},borderRadius:{sm:"6px",md:"8px",lg:"12px",xl:"16px",full:"9999px"},typography:{fontFamily:'"Inter", "Segoe UI", system-ui, sans-serif',fontSize:{xs:"12px",sm:"13px",base:"14px",lg:"16px",xl:"18px"},fontWeight:{normal:"400",medium:"500",semibold:"600",bold:"700"},lineHeight:{tight:"1.25",normal:"1.4",relaxed:"1.6"}},animation:{fast:"150ms ease-out",normal:"250ms ease-out",slow:"350ms ease-out"},shadows:{sm:"0 2px 4px rgba(0, 0, 0, 0.4)",md:"0 4px 12px rgba(0, 0, 0, 0.6)",lg:"0 8px 24px rgba(0, 0, 0, 0.8)",glow:"0 0 20px rgba(139, 92, 246, 0.3)"},zIndex:{tooltip:1e3,dropdown:1100,overlay:1200,modal:1300,toast:1400,max:2147483647}},Ce={translate:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
  </svg>`},gi=[{id:"refine",label:"Refine Selection",category:"Quick Actions",icon:Ce.refine,shortcut:"R",isPinned:!0},{id:"translate",label:"Translate Selection",category:"Quick Actions",icon:Ce.translate,shortcut:"T",isPinned:!0},{id:"rewrite",label:"Rewrite Selection",category:"Quick Actions",icon:Ce.rewrite,shortcut:"W",isPinned:!0},{id:"analyze",label:"Analyze Page",category:"Content Tools",icon:Ce.analyze,shortcut:"A",isPinned:!1},{id:"explain",label:"Explain Selection",category:"Content Tools",icon:Ce.explain,shortcut:"E",isPinned:!1},{id:"correct",label:"Correct Grammar",category:"Content Tools",icon:Ce.grammar,shortcut:"C",isPinned:!1},{id:"expand",label:"Expand Text",category:"Content Tools",icon:Ce.expand,shortcut:"X",isPinned:!1},{id:"chat-personal",label:"Personal Chat",category:"AI Chat",icon:Ce.chat,shortcut:"P",isPinned:!1},{id:"chat-pro",label:"Pro Chat",category:"AI Chat",icon:Ce.question,shortcut:"O",isPinned:!1},{id:"settings",label:"Extension Settings",category:"Advanced",icon:Ce.custom,shortcut:"S",isPinned:!1},{id:"customize",label:"Customize Actions",category:"Advanced",icon:Ce.custom,shortcut:"M",isPinned:!1}];class Er{constructor(){be(this,"container",null);be(this,"shadowRoot",null);be(this,"actions",gi);be(this,"onActionClick",null);be(this,"maxPinned",9);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions(),T.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
      position: fixed;
      z-index: ${T.zIndex.max};
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
    `,e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      :host {
        --monica-bg: ${T.colors.background};
        --monica-surface: ${T.colors.surface};
        --monica-surface-hover: ${T.colors.surfaceHover};
        --monica-surface-active: ${T.colors.surfaceActive};
        --monica-primary: ${T.colors.primary};
        --monica-primary-hover: ${T.colors.primaryHover};
        --monica-primary-active: ${T.colors.primaryActive};
        --monica-text-primary: ${T.colors.textPrimary};
        --monica-text-secondary: ${T.colors.textSecondary};
        --monica-text-muted: ${T.colors.textMuted};
        --monica-border: ${T.colors.border};
        --monica-shadow: ${T.colors.shadow};
        --monica-transition: ${T.animation.fast};
        --monica-radius: ${T.borderRadius.md};
      }
      
      .monica-menu {
        position: fixed;
        background: var(--monica-surface);
        color: var(--monica-text-primary);
        font-size: 0.95em;
        border: 1px solid var(--monica-border);
        border-radius: ${T.borderRadius.lg};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        min-width: 260px;
        max-width: 380px;
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden; /* remove bottom scrollbar */
        scrollbar-width: thin; /* Firefox minimal scrollbar */
        scrollbar-color: var(--monica-border) transparent;
        padding: ${T.spacing.sm} 0;
        opacity: 0;
        transform: scale(0.98) translateY(-4px);
        transition: all ${T.animation.fast};
        pointer-events: auto;
        z-index: ${T.zIndex.max};
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
        margin-bottom: ${T.spacing.xs};
      }
      
      .category-header {
        display: flex;
        align-items: center;
        gap: ${T.spacing.xs};
        padding: ${T.spacing.xs} ${T.spacing.sm};
        font-size: ${T.typography.fontSize.xs};
        font-weight: ${T.typography.fontWeight.semibold};
        color: var(--monica-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: ${T.spacing.xs};
      }
      
      .menu-item {
        display: flex;
        align-items: center;
        gap: ${T.spacing.sm};
        padding: ${T.spacing.sm} ${T.spacing.md};
        border-radius: ${T.borderRadius.md};
        cursor: pointer;
        transition: all ${T.animation.fast};
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
        transition: color ${T.animation.fast};
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
        font-weight: ${T.typography.fontWeight.medium};
        line-height: ${T.typography.lineHeight.tight};
        min-width: 0; /* allow flex item to shrink to avoid horizontal overflow */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .item-shortcut {
        font-size: ${T.typography.fontSize.xs};
        color: var(--monica-text-muted);
        font-weight: ${T.typography.fontWeight.normal};
        background: var(--monica-surface-hover);
        padding: 1px 5px;
        border-radius: ${T.borderRadius.sm};
      }

      .menu-item.featured .item-shortcut {
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
      }

      .item-pin {
        margin-left: ${T.spacing.sm};
        color: var(--monica-text-muted);
        background: transparent;
        border: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${T.borderRadius.sm};
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
        transition: opacity ${T.animation.fast};
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
        margin: ${T.spacing.sm} 0;
      }
      
      .menu-footer {
        padding: ${T.spacing.sm} ${T.spacing.lg};
        text-align: center;
        font-size: ${T.typography.fontSize.xs};
        color: var(--monica-text-muted);
        border-top: 1px solid var(--monica-border);
        margin-top: ${T.spacing.sm};
      }
      
      .powered-by {
        opacity: 0.7;
        transition: opacity ${T.animation.fast};
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
        transition: left ${T.animation.normal};
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
          padding: ${T.spacing.sm} ${T.spacing.md};
        }
      }
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const t=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||[];this.actions=this.actions.map(r=>({...r,isPinned:t.includes(r.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}async savePinnedActions(){var e,t;try{const r=this.actions.filter(s=>s.isPinned).map(s=>s.id).slice(0,this.maxPinned);await chrome.storage.sync.set({"desainr.pinnedActions":r});try{(t=(e=chrome==null?void 0:chrome.runtime)==null?void 0:e.sendMessage)==null||t.call(e,{type:"SAVE_PINNED_ACTIONS",pinnedIds:r})}catch(s){console.warn("Broadcast SAVE_PINNED_ACTIONS failed:",s)}}catch(r){console.warn("Failed to save pinned actions:",r)}}togglePin(e){const t=this.actions.findIndex(s=>s.id===e);if(t===-1)return;const r=this.actions[t];if(r.isPinned)r.isPinned=!1;else{if(this.actions.filter(a=>a.isPinned).length>=this.maxPinned)return;r.isPinned=!0}this.savePinnedActions(),this.refreshMenuUI()}refreshMenuUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-menu");if(!e)return;const t=e.style.left,r=e.style.top;e.remove();const s=this.renderMenu();this.shadowRoot.appendChild(s),s.classList.add("show"),t&&(s.style.left=t),r&&(s.style.top=r)}renderMenu(){const e=document.createElement("div");e.className="monica-menu";const t=this.actions.reduce((s,a)=>(T.featureCategories[a.category],s[a.category]||(s[a.category]=[]),s[a.category].push(a),s),{});Object.entries(t).forEach(([s,a])=>{var y,E;const l=document.createElement("div");l.className="menu-category";const p=document.createElement("div");p.className="category-header",p.innerHTML=`
        <div class="category-icon">${((y=T.featureCategories[s])==null?void 0:y.icon)||""}</div>
        <div class="category-title">${((E=T.featureCategories[s])==null?void 0:E.title)||s}</div>
      `,l.appendChild(p),a.forEach((A,k)=>{const I=document.createElement("div");I.className=`menu-item ${A.isPinned?"pinned":""} ${k===0&&s==="Quick Actions"?"featured":""}`;const x=Ce.memo;I.innerHTML=`
          <div class="item-icon">${A.icon}</div>
          <div class="item-label">${A.label}</div>
          ${A.shortcut?`<div class="item-shortcut">${A.shortcut}</div>`:""}
          <button class="item-pin" title="${A.isPinned?"Unpin":"Pin"}" aria-label="${A.isPinned?"Unpin":"Pin"}">
            ${x}
          </button>
          <div class="pin-indicator"></div>
        `,I.addEventListener("click",()=>{var $;this.hide(),($=this.onActionClick)==null||$.call(this,A)});const P=I.querySelector(".item-pin");if(P){P.setAttribute("aria-pressed",A.isPinned?"true":"false");const $=P.querySelector("svg");$&&(A.isPinned?$.classList.add("filled"):$.classList.remove("filled")),P.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),this.togglePin(A.id)})}l.appendChild(I)}),e.appendChild(l)});const r=document.createElement("div");return r.className="menu-footer",r.innerHTML=`
      <div class="powered-by">Powered by DesAInR ✨</div>
    `,e.appendChild(r),e}show(e,t,r){if(!this.container||!this.shadowRoot)return;this.onActionClick=r;const s=this.shadowRoot.querySelector(".monica-menu");s&&s.remove();const a=this.renderMenu();this.shadowRoot.appendChild(a),document.body.appendChild(this.container);const l={width:window.innerWidth,height:window.innerHeight},p=a.getBoundingClientRect();let y=e,E=t;e+p.width>l.width-20&&(y=Math.max(20,e-p.width)),t+p.height>l.height-20&&(E=Math.max(20,t-p.height)),a.style.left=`${y}px`,a.style.top=`${E}px`,requestAnimationFrame(()=>{a.classList.add("show")});const A=k=>{a.contains(k.target)||(this.hide(),document.removeEventListener("click",A))};setTimeout(()=>{document.addEventListener("click",A)},100)}hide(){var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector(".monica-menu");e&&(e.classList.remove("show"),setTimeout(()=>{var r;(r=this.container)!=null&&r.parentNode&&this.container.parentNode.removeChild(this.container)},150))}updateActions(e){this.actions=e}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}const Ca=Object.freeze(Object.defineProperty({__proto__:null,DefaultActions:gi,MonicaStyleContextMenu:Er},Symbol.toStringTag,{value:"Module"})),br=["refine","translate","rewrite","explain"],Tr=gi.map(i=>({id:i.id,label:i.label.replace(" Selection",""),icon:i.icon,shortcut:i.shortcut,isPinned:i.isPinned,category:i.category}));class xa{constructor(){be(this,"container",null);be(this,"shadowRoot",null);be(this,"actions",Tr);be(this,"onActionClick",null);be(this,"isVisible",!1);be(this,"pinnedIds",br);this.container=this.createContainer(),this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.injectStyles(),this.loadPinnedActions();try{chrome.runtime.onMessage.addListener(e=>{(e==null?void 0:e.type)==="SAVE_PINNED_ACTIONS"&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}try{chrome.storage.onChanged.addListener((e,t)=>{t==="sync"&&e["desainr.pinnedActions"]&&this.loadPinnedActions().then(()=>this.refreshToolbarUI())})}catch{}T.watchThemeChanges(()=>{this.updateTheme()})}updateTheme(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("style");e&&e.remove(),this.injectStyles()}}createContainer(){const e=document.createElement("div");return e.style.cssText=`
      position: fixed;
      z-index: ${T.zIndex.overlay};
      pointer-events: none;
      top: 0;
      left: 0;
    `,e}injectStyles(){if(!this.shadowRoot)return;const e=document.createElement("style");e.textContent=`
      :host {
        --monica-bg: ${T.colors.background};
        --monica-surface: ${T.colors.surface};
        --monica-surface-hover: ${T.colors.surfaceHover};
        --monica-primary: ${T.colors.primary};
        --monica-primary-hover: ${T.colors.primaryHover};
        --monica-text-primary: ${T.colors.textPrimary};
        --monica-text-secondary: ${T.colors.textSecondary};
        --monica-border: ${T.colors.border};
        --monica-shadow: ${T.shadows.lg};
        --monica-radius: ${T.borderRadius.lg};
        --monica-font: ${T.typography.fontFamily};
        --monica-transition: ${T.animation.fast};
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
        font-family: ${T.typography.fontFamily};
        font-size: 11px;
        opacity: 0;
        transform: scale(0.95) translateY(-4px);
        transition: all ${T.animation.fast};
        z-index: ${T.zIndex.overlay};
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
        transition: all ${T.animation.fast};
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
        font-weight: ${T.typography.fontWeight.bold};
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
        transition: all ${T.animation.fast};
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
        padding: ${T.spacing.xs} ${T.spacing.sm};
        border-radius: ${T.borderRadius.sm};
        font-size: ${T.typography.fontSize.xs};
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--monica-transition);
        margin-bottom: ${T.spacing.xs};
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
    `,this.shadowRoot.appendChild(e)}async loadPinnedActions(){try{const t=(await chrome.storage.sync.get(["desainr.pinnedActions"]))["desainr.pinnedActions"]||br;this.pinnedIds=t.slice(0,9),this.actions=Tr.map(r=>({...r,isPinned:t.includes(r.id)}))}catch(e){console.warn("Failed to load pinned actions:",e)}}refreshToolbarUI(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector(".monica-toolbar");if(!e)return;const{left:t,top:r}=e.style;e.remove();const s=this.renderToolbar();this.shadowRoot.appendChild(s),s.classList.add("show"),t&&(s.style.left=t),r&&(s.style.top=r)}renderToolbar(){const e=document.createElement("div");e.className="monica-toolbar";const t=this.pinnedIds.map(s=>this.actions.find(a=>a.id===s&&a.isPinned)).filter(s=>!!s).slice(0,10);if(t.forEach((s,a)=>{const l=document.createElement("div");l.className=`toolbar-action ${a===0?"featured":""}`,l.innerHTML=`
        <div class="action-icon">${s.icon}</div>
        <div class="action-label">${s.label}</div>
        <div class="tooltip">${s.label}</div>
      `,l.addEventListener("click",p=>{var y;p.preventDefault(),p.stopPropagation(),(y=this.onActionClick)==null||y.call(this,s)}),e.appendChild(l)}),t.length>0){const s=document.createElement("div");s.className="toolbar-divider",e.appendChild(s)}const r=document.createElement("div");return r.className="more-button",r.innerHTML=`
      <div class="action-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </div>
      <div class="action-label">More</div>
      <div class="tooltip">More actions</div>
    `,r.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation();const a=r.getBoundingClientRect();this.showContextMenu(a.left,a.bottom)}),e.appendChild(r),e}showContextMenu(e,t){ne(async()=>{const{MonicaStyleContextMenu:r}=await Promise.resolve().then(()=>Ca);return{MonicaStyleContextMenu:r}},void 0).then(({MonicaStyleContextMenu:r})=>{new r().show(e,t,a=>{var l;(l=this.onActionClick)==null||l.call(this,a)})}).catch(()=>{console.log("More actions menu clicked"),alert("More actions menu - Context menu integration pending")})}show(e,t,r){if(!this.container||!this.shadowRoot)return;this.onActionClick=r,this.isVisible=!0;const s=this.shadowRoot.querySelector(".monica-toolbar");s&&s.remove();const a=this.renderToolbar();this.shadowRoot.appendChild(a),document.body.appendChild(this.container);const l={width:window.innerWidth},p=a.getBoundingClientRect();let y=e-p.width/2,E=t-p.height-8;y<10&&(y=10),y+p.width>l.width-10&&(y=l.width-p.width-10),E<10&&(E=t+8),a.style.left=`${y}px`,a.style.top=`${E}px`,requestAnimationFrame(()=>{a.classList.add("show")});const A=k=>{var $;const I=document.getElementById("desainr-result-popup"),x=($=k.composedPath)==null?void 0:$.call(k),P=I?x?x.includes(I):I.contains(k.target):!1;!a.contains(k.target)&&!P&&(this.hide(),document.removeEventListener("click",A))};setTimeout(()=>{document.addEventListener("click",A)},100)}hide(){var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector(".monica-toolbar");e&&(this.isVisible=!1,e.classList.remove("show"),setTimeout(()=>{var r;(r=this.container)!=null&&r.parentNode&&this.container.parentNode.removeChild(this.container)},150))}isShown(){return this.isVisible}destroy(){var e;(e=this.container)!=null&&e.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null}}(()=>{const i="desainr-overlay-root";let e=null,t=null,r=null;(()=>{e||(e=new Er),t||(t=new xa)})();async function a(d,m){var u,C,G,te,ue,de,N,xe,Ue,_e,D,fe,L,J,X,se,ie,Pe,St,Kt,Jt;try{if(d==="refine"){const Y=((u=window.getSelection())==null?void 0:u.toString())||"";if(!Y.trim()){E("No text selected","warning");return}const O=(()=>{try{const q=window.getSelection();if(q&&q.rangeCount)return q.getRangeAt(0).getBoundingClientRect()}catch{}return null})();try{await F("Refine",Y,"Working…",O||void 0);const q=await((te=(C=chrome.storage)==null?void 0:(G=C.local).get)==null?void 0:te.call(G,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),oe=q==null?void 0:q["desainr.settings.modelId"],ye=(q==null?void 0:q["desainr.settings.thinkingMode"])||"none",{rewrite:me}=await ne(async()=>{const{rewrite:pe}=await Promise.resolve().then(()=>Me);return{rewrite:pe}},void 0),{ok:V,status:ae,json:K,error:Ge}=await me({selection:Y,url:location.href,task:"clarify",modelId:oe,thinkingMode:ye});if(V&&(K!=null&&K.result))await F("Refine",Y,K.result,O||void 0);else{const pe=(K==null?void 0:K.error)||Ge||"unknown";await F("Refine",Y,`Failed (${ae}): ${pe}`,O||void 0)}}catch(q){await F("Refine",Y,`Error: ${(q==null?void 0:q.message)||q}`,O||void 0)}return}const U=((ue=window.getSelection())==null?void 0:ue.toString())||"",re=(()=>{try{const Y=window.getSelection();if(Y&&Y.rangeCount)return Y.getRangeAt(0).getBoundingClientRect()}catch{}return null})();if(d==="translate"){if(!U.trim()){E("No text selected","warning");return}const{translateChunks:Y}=await ne(async()=>{const{translateChunks:Ge}=await Promise.resolve().then(()=>Me);return{translateChunks:Ge}},void 0);await F("Translate",U,"Working…",re||void 0);const O=await((xe=(de=chrome.storage)==null?void 0:(N=de.local).get)==null?void 0:xe.call(N,["desainr.settings.targetLang","desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),q=(O==null?void 0:O["desainr.settings.targetLang"])||(await ne(async()=>{const{DEFAULT_TARGET_LANG:Ge}=await Promise.resolve().then(()=>wn);return{DEFAULT_TARGET_LANG:Ge}},void 0)).DEFAULT_TARGET_LANG,oe=O==null?void 0:O["desainr.settings.modelId"],ye=(O==null?void 0:O["desainr.settings.thinkingMode"])||"none",{ok:me,status:V,json:ae,error:K}=await Y({selection:U,url:location.href,targetLang:q,modelId:oe,thinkingMode:ye});if(me&&(ae!=null&&ae.result))await F("Translate",U,ae.result,re||void 0);else{const Ge=(ae==null?void 0:ae.error)||K||"unknown";await F("Translate",U,`Failed (${V}): ${Ge}`,re||void 0)}}else if(d==="rewrite"){if(!U.trim()){E("No text selected","warning");return}const{rewrite:Y}=await ne(async()=>{const{rewrite:K}=await Promise.resolve().then(()=>Me);return{rewrite:K}},void 0);await F("Rewrite",U,"Working…",re||void 0);const O=await((D=(Ue=chrome.storage)==null?void 0:(_e=Ue.local).get)==null?void 0:D.call(_e,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),q=O==null?void 0:O["desainr.settings.modelId"],oe=(O==null?void 0:O["desainr.settings.thinkingMode"])||"none",{ok:ye,status:me,json:V,error:ae}=await Y({selection:U,url:location.href,task:"clarify",modelId:q,thinkingMode:oe});if(ye&&(V!=null&&V.result))await F("Rewrite",U,V.result,re||void 0);else{const K=(V==null?void 0:V.error)||ae||"unknown";await F("Rewrite",U,`Failed (${me}): ${K}`,re||void 0)}}else if(d==="expand"){if(!U.trim()){E("No text selected","warning");return}const{rewrite:Y}=await ne(async()=>{const{rewrite:K}=await Promise.resolve().then(()=>Me);return{rewrite:K}},void 0);await F("Expand",U,"Working…",re||void 0);const O=await((J=(fe=chrome.storage)==null?void 0:(L=fe.local).get)==null?void 0:J.call(L,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),q=O==null?void 0:O["desainr.settings.modelId"],oe=(O==null?void 0:O["desainr.settings.thinkingMode"])||"none",{ok:ye,status:me,json:V,error:ae}=await Y({selection:U,url:location.href,task:"expand",modelId:q,thinkingMode:oe});if(ye&&(V!=null&&V.result))await F("Expand",U,V.result,re||void 0);else{const K=(V==null?void 0:V.error)||ae||"unknown";await F("Expand",U,`Failed (${me}): ${K}`,re||void 0)}}else if(d==="correct"){if(!U.trim()){E("No text selected","warning");return}const{rewrite:Y}=await ne(async()=>{const{rewrite:K}=await Promise.resolve().then(()=>Me);return{rewrite:K}},void 0);await F("Correct Grammar",U,"Working…",re||void 0);const O=await((ie=(X=chrome.storage)==null?void 0:(se=X.local).get)==null?void 0:ie.call(se,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),q=O==null?void 0:O["desainr.settings.modelId"],oe=(O==null?void 0:O["desainr.settings.thinkingMode"])||"none",{ok:ye,status:me,json:V,error:ae}=await Y({selection:U,url:location.href,task:"grammar",modelId:q,thinkingMode:oe});if(ye&&(V!=null&&V.result))await F("Correct Grammar",U,V.result,re||void 0);else{const K=(V==null?void 0:V.error)||ae||"unknown";await F("Correct Grammar",U,`Failed (${me}): ${K}`,re||void 0)}}else if(d==="explain"){if(!U.trim()){E("No text selected","warning");return}const{actions:Y}=await ne(async()=>{const{actions:K}=await Promise.resolve().then(()=>Me);return{actions:K}},void 0);await F("Explain",U,"Working…",re||void 0);const O=await((Kt=(Pe=chrome.storage)==null?void 0:(St=Pe.local).get)==null?void 0:Kt.call(St,["desainr.settings.modelId","desainr.settings.thinkingMode"]).catch(()=>({}))),q=O==null?void 0:O["desainr.settings.modelId"],oe=(O==null?void 0:O["desainr.settings.thinkingMode"])||"none",{ok:ye,status:me,json:V,error:ae}=await Y({selection:U,clientMessage:U,customInstruction:"Explain this clearly",modelId:q,thinkingMode:oe});if(ye&&(V!=null&&V.result))await F("Explain",U,V.result,re||void 0);else{const K=(V==null?void 0:V.error)||ae||"unknown";await F("Explain",U,`Failed (${me}): ${K}`,re||void 0)}}else if(d==="analyze"){const{analyzePage:Y}=await ne(async()=>{const{analyzePage:me}=await Promise.resolve().then(()=>Me);return{analyzePage:me}},void 0);await F("Analyze",U||"(No selection)","Working…",re||void 0);const{ok:O,status:q,json:oe,error:ye}=await Y({url:location.href,title:document.title});if(O)await F("Analyze",U||"(No selection)",(oe==null?void 0:oe.summary)||"Done",re||void 0);else{const me=(oe==null?void 0:oe.error)||ye||"unknown";await F("Analyze",U||"(No selection)",`Failed (${q}): ${me}`,re||void 0)}}else if(d==="chat-personal"||d==="chat-pro")Ae();else if(d==="copy"){const Y=((Jt=window.getSelection())==null?void 0:Jt.toString())||"";Y?(navigator.clipboard.writeText(Y),E("Text copied to clipboard! 📋","success")):E("No text selected","warning")}else d==="settings"?E("Extension settings coming soon! ⚙️","info"):d==="customize"?E("Custom actions coming soon! 🔧","info"):E(`Unknown action: ${m}`,"warning")}catch(U){E(`Error: ${(U==null?void 0:U.message)||U}`,"error")}}const l=document.getElementById(i);if(l)try{l.style.display="none",l.textContent=""}catch{}function p(){return r&&r.remove(),r=document.createElement("div"),Object.assign(r.style,{position:"fixed",top:"20px",right:"20px",zIndex:T.zIndex.toast,background:T.colors.surface,color:T.colors.textPrimary,border:`1px solid ${T.colors.border}`,borderRadius:T.borderRadius.lg,padding:`${T.spacing.md} ${T.spacing.lg}`,boxShadow:T.shadows.lg,backdropFilter:"blur(12px)",maxWidth:"420px",fontFamily:T.typography.fontFamily,fontSize:T.typography.fontSize.sm,display:"none",opacity:"0",transform:"translateY(-8px) scale(0.95)",transition:`all ${T.animation.fast}`}),document.documentElement.appendChild(r),r}function y(){return p()}function E(d,m="info"){const u=p(),C={info:"💬",success:"✅",error:"❌",warning:"⚠️"},G={info:T.colors.info,success:T.colors.success,error:T.colors.error,warning:T.colors.warning};u.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${T.spacing.md};">
        <div style="font-size: 18px;">${C[m]}</div>
        <div style="flex: 1; line-height: ${T.typography.lineHeight.normal};">${d}</div>
        <div style="width: 4px; height: 40px; background: ${G[m]}; border-radius: 2px; margin-left: ${T.spacing.md};"></div>
      </div>
    `,u.style.display="block",requestAnimationFrame(()=>{u.style.opacity="1",u.style.transform="translateY(0) scale(1)"}),setTimeout(()=>A(),3e3)}function A(){r&&(r.style.opacity="0",r.style.transform="translateY(-8px) scale(0.95)",setTimeout(()=>{r&&(r.style.display="none")},150))}function k(d,m,u=6e3){const C=document.createElement("button");C.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${T.spacing.xs};">
        <span>↶</span>
        <span>Undo</span>
      </div>
    `,Object.assign(C.style,{marginLeft:T.spacing.md,padding:`${T.spacing.xs} ${T.spacing.md}`,background:T.colors.primary,color:"white",border:"none",borderRadius:T.borderRadius.md,cursor:"pointer",fontSize:T.typography.fontSize.sm,fontWeight:T.typography.fontWeight.medium,transition:`all ${T.animation.fast}`,fontFamily:T.typography.fontFamily}),C.onmouseenter=()=>{C.style.background=T.colors.primaryHover,C.style.transform="translateY(-1px)"},C.onmouseleave=()=>{C.style.background=T.colors.primary,C.style.transform="translateY(0)"};const G=()=>{try{const te=m();E(te?"Undone successfully! ✓":"Undo failed",te?"success":"error")}catch{E("Undo failed","error")}finally{C.remove(),setTimeout(()=>A(),800)}};C.addEventListener("click",G,{once:!0}),d.appendChild(C),setTimeout(()=>{try{C.remove()}catch{}},u)}function I(d,m,u=12e3){const C=document.createElement("button");C.innerHTML=`
      <div style="display: flex; align-items: center; gap: ${T.spacing.xs};">
        <span>📋</span>
        <span>Copy</span>
      </div>
    `,Object.assign(C.style,{marginLeft:T.spacing.md,padding:`${T.spacing.xs} ${T.spacing.md}`,background:T.colors.surface,color:T.colors.textPrimary,border:`1px solid ${T.colors.border}`,borderRadius:T.borderRadius.md,cursor:"pointer",fontSize:T.typography.fontSize.sm,fontWeight:T.typography.fontWeight.medium,transition:`all ${T.animation.fast}`,fontFamily:T.typography.fontFamily}),C.onmouseenter=()=>{C.style.background=T.colors.surfaceHover,C.style.borderColor=T.colors.primary,C.style.transform="translateY(-1px)"},C.onmouseleave=()=>{C.style.background=T.colors.surface,C.style.borderColor=T.colors.border,C.style.transform="translateY(0)"};const G=async()=>{try{await navigator.clipboard.writeText(m),E("Copied to clipboard! ✓","success")}catch{E("Copy failed","error")}finally{C.remove(),setTimeout(()=>A(),800)}};C.addEventListener("click",G,{once:!0}),d.appendChild(C),setTimeout(()=>{try{C.remove()}catch{}},u)}function x(d){return d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function P(d,m){const u=x(String(m.summary||"Analysis complete")),C=Array.isArray(m.keyPoints)?m.keyPoints:[],G=Array.isArray(m.links)?m.links:[],te=C.length?`<ul style="margin:6px 0 8px 18px; padding:0;">${C.map(N=>`<li style="margin:2px 0;">${x(N)}</li>`).join("")}</ul>`:"",ue=G.length?`<div style="margin-top:6px; max-height:160px; overflow:auto;"><div style="font-weight:600; margin-bottom:4px;">Top links</div>${G.slice(0,10).map(N=>`<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><a href="${x(N)}" target="_blank" rel="noopener noreferrer">${x(N)}</a></div>`).join("")}</div>`:"";d.innerHTML=`<div style="font-size:13px; line-height:1.35;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-weight:700;">Analysis</div>
        <button id="desainr-close-overlay" style="border:1px solid #ddd; border-radius:6px; padding:2px 6px; background:#f7f7f7; cursor:pointer;">Close</button>
      </div>
      <div style="margin-top:6px;">${u}</div>
      ${te}
      ${ue}
    </div>`;const de=d.querySelector("#desainr-close-overlay");de&&(de.onclick=()=>{d.style.display="none"})}let $=null,M=null;async function Ae(){if(M){try{M.detach()}catch{}M=null,$=null;return}const d=document.createElement("div");d.id="desainr-overlay-react-root",Object.assign(d.style,{position:"fixed",top:"20px",right:"20px",zIndex:1e6}),document.documentElement.appendChild(d);try{M=(await ne(()=>Promise.resolve().then(()=>id),void 0)).mountOverlay(d,()=>{try{M==null||M.detach()}catch{}M=null,$=null}),$=d}catch(m){const u=y();u.style.display="block",u.textContent=`Overlay failed: ${(m==null?void 0:m.message)||m}`,setTimeout(()=>A(),1500)}}let he=0,Z=null,ge=null;function tt(){if(Z)return Z;const d=document.createElement("div");d.id="desainr-result-popup",Object.assign(d.style,{position:"fixed",zIndex:1e6,top:"0px",left:"0px",display:"none"}),ge=d.attachShadow({mode:"open"});const m=document.createElement("style");m.textContent=`
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
    `,ge.appendChild(m);const u=document.createElement("div");return u.className="popup",u.innerHTML=`<div class="hdr"><div class="ttl">Refine Result</div><button id="close">✕</button></div>
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
      </div>`,ge.appendChild(u),document.documentElement.appendChild(d),Z=d,d}async function F(d,m,u,C){const G=tt(),te=ge,ue=te.querySelector(".ttl"),de=te.getElementById("orig"),N=te.getElementById("res"),xe=te.getElementById("close"),Ue=te.getElementById("cancel"),_e=te.getElementById("copy"),D=te.getElementById("replace");ue.textContent=d,de.textContent=m,N.textContent=u;function fe(){let J=0,X=0;const se=10,ie=C||new DOMRect(window.innerWidth/2-200,80,400,0),Pe=Z.getBoundingClientRect();J=Math.min(Math.max(se,ie.left),window.innerWidth-Pe.width-se),X=Math.min(Math.max(se,ie.top+ie.height+se),window.innerHeight-Pe.height-se),G.style.left=`${Math.round(J)}px`,G.style.top=`${Math.round(X)}px`}G.style.display="block",requestAnimationFrame(()=>fe());const L=()=>{G.style.display="none"};xe.onclick=Ue.onclick=()=>L(),_e.onclick=async()=>{try{await navigator.clipboard.writeText(u)}catch{}},D.onclick=async()=>{const{applyReplacementOrCopyWithUndo:J}=await ne(async()=>{const{applyReplacementOrCopyWithUndo:Pe}=await Promise.resolve().then(()=>So);return{applyReplacementOrCopyWithUndo:Pe}},void 0),{outcome:X,undo:se}=await J(u),ie=y();X==="replaced"?(ie.textContent="Replaced ✓",se&&k(ie,se)):X==="copied"?(ie.textContent="Copied ✓",I(ie,u)):ie.textContent="Done",ie.style.display="block",setTimeout(()=>A(),900),L()}}async function _(){const m=(await ne(()=>Promise.resolve().then(()=>ld),void 0)).getSelectionInfo();if(!m){f();return}if(m.text,m.rect,t){const u=m.rect,C=u.left+u.width/2,G=u.top-8;t.show(C,G,te=>{a(te.id,te.label)})}}function f(){if(t)try{t.hide()}catch(d){console.warn("Error hiding Monica toolbar:",d)}}document.addEventListener("keydown",d=>{if(d.key==="Escape"&&(f(),M)){try{M.detach()}catch{}M=null,$=null}}),document.addEventListener("selectionchange",()=>{var m;if(Date.now()<he)return;(((m=window.getSelection())==null?void 0:m.toString())||"").trim()||f()}),document.addEventListener("mousedown",d=>{},!0);function g(d=4e3){return new Promise(m=>{let u=!1;const C=ue=>{window.removeEventListener("message",G),ue&&clearTimeout(ue)},G=ue=>{if(ue.source!==window)return;const de=ue.data;if(!de||de.type!=="DESAINR_WEBAPP_TOKEN"||u)return;u=!0,C();const{ok:N,idToken:xe,error:Ue}=de||{};m({ok:!!N,idToken:xe,error:Ue||(N?void 0:"no_token")})};window.addEventListener("message",G);const te=window.setTimeout(()=>{u||(u=!0,C(),m({ok:!1,error:"timeout"}))},d);try{window.postMessage({type:"DESAINR_EXTENSION_GET_TOKEN",from:"desainr-extension"},window.origin)}catch{u=!0,C(te),m({ok:!1,error:"post_message_failed"})}})}chrome.runtime.onMessage.addListener((d,m,u)=>{if((d==null?void 0:d.type)==="TOGGLE_OVERLAY"&&Ae(),(d==null?void 0:d.type)==="CONTEXT_MENU"&&v(d.id,d.info),(d==null?void 0:d.type)==="DESAINR_GET_WEBAPP_ID_TOKEN")return g().then(C=>u(C)),!0}),document.addEventListener("mouseup",()=>{setTimeout(()=>{_().catch(()=>{})},100)}),document.addEventListener("contextmenu",d=>{const m=window.getSelection();m&&m.toString().trim()&&(d.preventDefault(),e&&e.show(d.pageX,d.pageY,u=>{a(u.id,u.label)}))});async function v(d,m){var xe,Ue,_e;const{rewrite:u,translateChunks:C,analyzePage:G,saveMemo:te}=await ne(async()=>{const{rewrite:D,translateChunks:fe,analyzePage:L,saveMemo:J}=await Promise.resolve().then(()=>Me);return{rewrite:D,translateChunks:fe,analyzePage:L,saveMemo:J}},void 0),{DEFAULT_TARGET_LANG:ue}=await ne(async()=>{const{DEFAULT_TARGET_LANG:D}=await Promise.resolve().then(()=>wn);return{DEFAULT_TARGET_LANG:D}},void 0),{applyReplacementOrCopyWithUndo:de}=await ne(async()=>{const{applyReplacementOrCopyWithUndo:D}=await Promise.resolve().then(()=>So);return{applyReplacementOrCopyWithUndo:D}},void 0),N=y();N.style.display="block";try{if(d==="desainr-refine"){N.textContent="Refining selection...";const D=((xe=window.getSelection())==null?void 0:xe.toString())||"",{ok:fe,status:L,json:J,error:X}=await u({selection:D,url:location.href,task:"clarify"});if(fe&&(J!=null&&J.result)){const{outcome:se,undo:ie}=await de(J.result);se==="replaced"?(N.textContent="Refined ✓ (replaced selection)",ie&&k(N,ie)):se==="copied"?N.textContent="Refined ✓ (copied)":N.textContent="Refined ✓"}else N.textContent=`Refine failed (${L}): ${X||"unknown"}`}else if(d==="desainr-translate"){N.textContent="Translating selection...";const D=((Ue=window.getSelection())==null?void 0:Ue.toString())||"",{ok:fe,status:L,json:J,error:X}=await C({selection:D,url:location.href,targetLang:ue});if(fe&&(J!=null&&J.result)){const{outcome:se,undo:ie}=await de(J.result);se==="replaced"?(N.textContent="Translated ✓ (replaced selection)",ie&&k(N,ie)):se==="copied"?N.textContent="Translated ✓ (copied)":N.textContent="Translated ✓"}else N.textContent=`Translate failed (${L}): ${X||"unknown"}`}else if(d==="desainr-save-memo"){N.textContent="Saving to memo...";const D=((_e=window.getSelection())==null?void 0:_e.toString())||"";if(!D)N.textContent="No text selected";else{const fe={title:`Selection from ${document.title||location.hostname}`,content:D,url:location.href,type:"selection",metadata:{pageTitle:document.title,timestamp:new Date().toISOString()},tags:["selection","extension"]},{ok:L,json:J,error:X}=await te(fe);L&&J?N.textContent=`✓ Saved to memo (ID: ${J.memoId})`:N.textContent=`Save to memo failed: ${X||"unknown"}`}}else if(d==="desainr-analyze"){N.textContent="Analyzing page...";const{ok:D,status:fe,json:L,error:J}=await G({url:location.href,title:document.title});D?P(N,{summary:L==null?void 0:L.summary,keyPoints:L==null?void 0:L.keyPoints,links:L==null?void 0:L.links}):N.textContent=`Analyze failed (${fe}): ${J||"unknown"}`}else if(d==="desainr-translate-page"){N.textContent="Translating page...";const{translatePageAll:D}=await ne(async()=>{const{translatePageAll:L}=await Promise.resolve().then(()=>_d);return{translatePageAll:L}},void 0),{DEFAULT_TARGET_LANG:fe}=await ne(async()=>{const{DEFAULT_TARGET_LANG:L}=await Promise.resolve().then(()=>wn);return{DEFAULT_TARGET_LANG:L}},void 0);try{const L=await D(fe);N.textContent=`Translated page ✓ (${L.translated}/${L.totalNodes} nodes, skipped ${L.skipped})`}catch(L){N.textContent=`Translate page error: ${(L==null?void 0:L.message)||L}`}}else if(d==="desainr-toggle-parallel"){const{isParallelModeEnabled:D,enableParallelMode:fe,disableParallelMode:L}=await ne(async()=>{const{isParallelModeEnabled:X,enableParallelMode:se,disableParallelMode:ie}=await Promise.resolve().then(()=>Id);return{isParallelModeEnabled:X,enableParallelMode:se,disableParallelMode:ie}},void 0),{DEFAULT_TARGET_LANG:J}=await ne(async()=>{const{DEFAULT_TARGET_LANG:X}=await Promise.resolve().then(()=>wn);return{DEFAULT_TARGET_LANG:X}},void 0);try{D()?(N.textContent="Disabling parallel translate...",L(),N.textContent="Parallel translate OFF"):(N.textContent="Enabling parallel translate...",await fe(J),N.textContent="Parallel translate ON")}catch(X){N.textContent=`Parallel toggle error: ${(X==null?void 0:X.message)||X}`}}else N.textContent=`Unknown action: ${d}`}catch(D){N.textContent=`Error: ${(D==null?void 0:D.message)||D}`}finally{setTimeout(()=>{try{A()}catch{}},800)}}})();const Pa=()=>{};var Ir={};/**
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
 */const Ar=function(i){const e=[];let t=0;for(let r=0;r<i.length;r++){let s=i.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<i.length&&(i.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(i.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Ra=function(i){const e=[];let t=0,r=0;for(;t<i.length;){const s=i[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const a=i[t++];e[r++]=String.fromCharCode((s&31)<<6|a&63)}else if(s>239&&s<365){const a=i[t++],l=i[t++],p=i[t++],y=((s&7)<<18|(a&63)<<12|(l&63)<<6|p&63)-65536;e[r++]=String.fromCharCode(55296+(y>>10)),e[r++]=String.fromCharCode(56320+(y&1023))}else{const a=i[t++],l=i[t++];e[r++]=String.fromCharCode((s&15)<<12|(a&63)<<6|l&63)}}return e.join("")},Sr={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,e){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<i.length;s+=3){const a=i[s],l=s+1<i.length,p=l?i[s+1]:0,y=s+2<i.length,E=y?i[s+2]:0,A=a>>2,k=(a&3)<<4|p>>4;let I=(p&15)<<2|E>>6,x=E&63;y||(x=64,l||(I=64)),r.push(t[A],t[k],t[I],t[x])}return r.join("")},encodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(i):this.encodeByteArray(Ar(i),e)},decodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(i):Ra(this.decodeStringToByteArray(i,e))},decodeStringToByteArray(i,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<i.length;){const a=t[i.charAt(s++)],p=s<i.length?t[i.charAt(s)]:0;++s;const E=s<i.length?t[i.charAt(s)]:64;++s;const k=s<i.length?t[i.charAt(s)]:64;if(++s,a==null||p==null||E==null||k==null)throw new Na;const I=a<<2|p>>4;if(r.push(I),E!==64){const x=p<<4&240|E>>2;if(r.push(x),k!==64){const P=E<<6&192|k;r.push(P)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class Na extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Oa=function(i){const e=Ar(i);return Sr.encodeByteArray(e,!0)},Mn=function(i){return Oa(i).replace(/\./g,"")},kr=function(i){try{return Sr.decodeString(i,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Da(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const La=()=>Da().__FIREBASE_DEFAULTS__,Ma=()=>{if(typeof process>"u"||typeof Ir>"u")return;const i=Ir.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},Ua=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=i&&kr(i[1]);return e&&JSON.parse(e)},mi=()=>{try{return Pa()||La()||Ma()||Ua()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},Cr=i=>{var e,t;return(t=(e=mi())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[i]},$a=i=>{const e=Cr(i);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},xr=()=>{var i;return(i=mi())===null||i===void 0?void 0:i.config},Pr=i=>{var e;return(e=mi())===null||e===void 0?void 0:e[`_${i}`]};/**
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
 */class Fa{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function nn(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Rr(i){return(await fetch(i,{credentials:"include"})).ok}/**
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
 */function Va(i,e){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=i.iat||0,a=i.sub||i.user_id;if(!a)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:a,user_id:a,firebase:{sign_in_provider:"custom",identities:{}}},i);return[Mn(JSON.stringify(t)),Mn(JSON.stringify(l)),""].join(".")}const rn={};function ja(){const i={prod:[],emulator:[]};for(const e of Object.keys(rn))rn[e]?i.emulator.push(e):i.prod.push(e);return i}function Ba(i){let e=document.getElementById(i),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",i),t=!0),{created:t,element:e}}let Nr=!1;function Or(i,e){if(typeof window>"u"||typeof document>"u"||!nn(window.location.host)||rn[i]===e||rn[i]||Nr)return;rn[i]=e;function t(I){return`__firebase__banner__${I}`}const r="__firebase__banner",a=ja().prod.length>0;function l(){const I=document.getElementById(r);I&&I.remove()}function p(I){I.style.display="flex",I.style.background="#7faaf0",I.style.position="fixed",I.style.bottom="5px",I.style.left="5px",I.style.padding=".5em",I.style.borderRadius="5px",I.style.alignItems="center"}function y(I,x){I.setAttribute("width","24"),I.setAttribute("id",x),I.setAttribute("height","24"),I.setAttribute("viewBox","0 0 24 24"),I.setAttribute("fill","none"),I.style.marginLeft="-6px"}function E(){const I=document.createElement("span");return I.style.cursor="pointer",I.style.marginLeft="16px",I.style.fontSize="24px",I.innerHTML=" &times;",I.onclick=()=>{Nr=!0,l()},I}function A(I,x){I.setAttribute("id",x),I.innerText="Learn more",I.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",I.setAttribute("target","__blank"),I.style.paddingLeft="5px",I.style.textDecoration="underline"}function k(){const I=Ba(r),x=t("text"),P=document.getElementById(x)||document.createElement("span"),$=t("learnmore"),M=document.getElementById($)||document.createElement("a"),Ae=t("preprendIcon"),he=document.getElementById(Ae)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(I.created){const Z=I.element;p(Z),A(M,$);const ge=E();y(he,Ae),Z.append(he,P,M,ge),document.body.appendChild(Z)}a?(P.innerText="Preview backend disconnected.",he.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(he.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,P.innerText="Preview backend running in this workspace."),P.setAttribute("id",x)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",k):k()}/**
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
 */function Te(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ha(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Te())}function za(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Wa(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function Ga(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function qa(){const i=Te();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function Ka(){try{return typeof indexedDB=="object"}catch{return!1}}function Ja(){return new Promise((i,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),i(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var a;e(((a=s.error)===null||a===void 0?void 0:a.message)||"")}}catch(t){e(t)}})}/**
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
 */const Xa="FirebaseError";class qe extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Xa,Object.setPrototypeOf(this,qe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,sn.prototype.create)}}class sn{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,a=this.errors[e],l=a?Ya(a,r):"Error",p=`${this.serviceName}: ${l} (${s}).`;return new qe(s,p,r)}}function Ya(i,e){return i.replace(Qa,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const Qa=/\{\$([^}]+)}/g;function Za(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function mt(i,e){if(i===e)return!0;const t=Object.keys(i),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const a=i[s],l=e[s];if(Dr(a)&&Dr(l)){if(!mt(a,l))return!1}else if(a!==l)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function Dr(i){return i!==null&&typeof i=="object"}/**
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
 */function on(i){const e=[];for(const[t,r]of Object.entries(i))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function ec(i,e){const t=new tc(i,e);return t.subscribe.bind(t)}class tc{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");nc(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=yi),s.error===void 0&&(s.error=yi),s.complete===void 0&&(s.complete=yi);const a=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),a}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function nc(i,e){if(typeof i!="object"||i===null)return!1;for(const t of e)if(t in i&&typeof i[t]=="function")return!0;return!1}function yi(){}/**
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
 */function Rt(i){return i&&i._delegate?i._delegate:i}class yt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const vt="[DEFAULT]";/**
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
 */class ic{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Fa;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(a){if(s)return null;throw a}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(sc(e))try{this.getOrInitializeService({instanceIdentifier:vt})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const a=this.getOrInitializeService({instanceIdentifier:s});r.resolve(a)}catch{}}}}clearInstance(e=vt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=vt){return this.instances.has(e)}getOptions(e=vt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[a,l]of this.instancesDeferred.entries()){const p=this.normalizeInstanceIdentifier(a);r===p&&l.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),a=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;a.add(e),this.onInitCallbacks.set(s,a);const l=this.instances.get(s);return l&&e(l,s),()=>{a.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:rc(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=vt){return this.component?this.component.multipleInstances?e:vt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function rc(i){return i===vt?void 0:i}function sc(i){return i.instantiationMode==="EAGER"}/**
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
 */class oc{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new ic(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var W;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(W||(W={}));const ac={debug:W.DEBUG,verbose:W.VERBOSE,info:W.INFO,warn:W.WARN,error:W.ERROR,silent:W.SILENT},cc=W.INFO,lc={[W.DEBUG]:"log",[W.VERBOSE]:"log",[W.INFO]:"info",[W.WARN]:"warn",[W.ERROR]:"error"},hc=(i,e,...t)=>{if(e<i.logLevel)return;const r=new Date().toISOString(),s=lc[e];if(s)console[s](`[${r}]  ${i.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class vi{constructor(e){this.name=e,this._logLevel=cc,this._logHandler=hc,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in W))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ac[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,W.DEBUG,...e),this._logHandler(this,W.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,W.VERBOSE,...e),this._logHandler(this,W.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,W.INFO,...e),this._logHandler(this,W.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,W.WARN,...e),this._logHandler(this,W.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,W.ERROR,...e),this._logHandler(this,W.ERROR,...e)}}const uc=(i,e)=>e.some(t=>i instanceof t);let Lr,Mr;function dc(){return Lr||(Lr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function fc(){return Mr||(Mr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ur=new WeakMap,_i=new WeakMap,$r=new WeakMap,wi=new WeakMap,Ei=new WeakMap;function pc(i){const e=new Promise((t,r)=>{const s=()=>{i.removeEventListener("success",a),i.removeEventListener("error",l)},a=()=>{t(st(i.result)),s()},l=()=>{r(i.error),s()};i.addEventListener("success",a),i.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&Ur.set(t,i)}).catch(()=>{}),Ei.set(e,i),e}function gc(i){if(_i.has(i))return;const e=new Promise((t,r)=>{const s=()=>{i.removeEventListener("complete",a),i.removeEventListener("error",l),i.removeEventListener("abort",l)},a=()=>{t(),s()},l=()=>{r(i.error||new DOMException("AbortError","AbortError")),s()};i.addEventListener("complete",a),i.addEventListener("error",l),i.addEventListener("abort",l)});_i.set(i,e)}let bi={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return _i.get(i);if(e==="objectStoreNames")return i.objectStoreNames||$r.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return st(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function mc(i){bi=i(bi)}function yc(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=i.call(Ti(this),e,...t);return $r.set(r,e.sort?e.sort():[e]),st(r)}:fc().includes(i)?function(...e){return i.apply(Ti(this),e),st(Ur.get(this))}:function(...e){return st(i.apply(Ti(this),e))}}function vc(i){return typeof i=="function"?yc(i):(i instanceof IDBTransaction&&gc(i),uc(i,dc())?new Proxy(i,bi):i)}function st(i){if(i instanceof IDBRequest)return pc(i);if(wi.has(i))return wi.get(i);const e=vc(i);return e!==i&&(wi.set(i,e),Ei.set(e,i)),e}const Ti=i=>Ei.get(i);function _c(i,e,{blocked:t,upgrade:r,blocking:s,terminated:a}={}){const l=indexedDB.open(i,e),p=st(l);return r&&l.addEventListener("upgradeneeded",y=>{r(st(l.result),y.oldVersion,y.newVersion,st(l.transaction),y)}),t&&l.addEventListener("blocked",y=>t(y.oldVersion,y.newVersion,y)),p.then(y=>{a&&y.addEventListener("close",()=>a()),s&&y.addEventListener("versionchange",E=>s(E.oldVersion,E.newVersion,E))}).catch(()=>{}),p}const wc=["get","getKey","getAll","getAllKeys","count"],Ec=["put","add","delete","clear"],Ii=new Map;function Fr(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(Ii.get(e))return Ii.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=Ec.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||wc.includes(t)))return;const a=async function(l,...p){const y=this.transaction(l,s?"readwrite":"readonly");let E=y.store;return r&&(E=E.index(p.shift())),(await Promise.all([E[t](...p),s&&y.done]))[0]};return Ii.set(e,a),a}mc(i=>({...i,get:(e,t,r)=>Fr(e,t)||i.get(e,t,r),has:(e,t)=>!!Fr(e,t)||i.has(e,t)}));/**
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
 */class bc{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Tc(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Tc(i){const e=i.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ai="@firebase/app",Vr="0.13.2";/**
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
 */const Ke=new vi("@firebase/app"),Ic="@firebase/app-compat",Ac="@firebase/analytics-compat",Sc="@firebase/analytics",kc="@firebase/app-check-compat",Cc="@firebase/app-check",xc="@firebase/auth",Pc="@firebase/auth-compat",Rc="@firebase/database",Nc="@firebase/data-connect",Oc="@firebase/database-compat",Dc="@firebase/functions",Lc="@firebase/functions-compat",Mc="@firebase/installations",Uc="@firebase/installations-compat",$c="@firebase/messaging",Fc="@firebase/messaging-compat",Vc="@firebase/performance",jc="@firebase/performance-compat",Bc="@firebase/remote-config",Hc="@firebase/remote-config-compat",zc="@firebase/storage",Wc="@firebase/storage-compat",Gc="@firebase/firestore",qc="@firebase/ai",Kc="@firebase/firestore-compat",Jc="firebase",Xc="11.10.0";/**
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
 */const Si="[DEFAULT]",Yc={[Ai]:"fire-core",[Ic]:"fire-core-compat",[Sc]:"fire-analytics",[Ac]:"fire-analytics-compat",[Cc]:"fire-app-check",[kc]:"fire-app-check-compat",[xc]:"fire-auth",[Pc]:"fire-auth-compat",[Rc]:"fire-rtdb",[Nc]:"fire-data-connect",[Oc]:"fire-rtdb-compat",[Dc]:"fire-fn",[Lc]:"fire-fn-compat",[Mc]:"fire-iid",[Uc]:"fire-iid-compat",[$c]:"fire-fcm",[Fc]:"fire-fcm-compat",[Vc]:"fire-perf",[jc]:"fire-perf-compat",[Bc]:"fire-rc",[Hc]:"fire-rc-compat",[zc]:"fire-gcs",[Wc]:"fire-gcs-compat",[Gc]:"fire-fst",[Kc]:"fire-fst-compat",[qc]:"fire-vertex","fire-js":"fire-js",[Jc]:"fire-js-all"};/**
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
 */const an=new Map,Qc=new Map,ki=new Map;function jr(i,e){try{i.container.addComponent(e)}catch(t){Ke.debug(`Component ${e.name} failed to register with FirebaseApp ${i.name}`,t)}}function Nt(i){const e=i.name;if(ki.has(e))return Ke.debug(`There were multiple attempts to register component ${e}.`),!1;ki.set(e,i);for(const t of an.values())jr(t,i);for(const t of Qc.values())jr(t,i);return!0}function Ci(i,e){const t=i.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),i.container.getProvider(e)}function Fe(i){return i==null?!1:i.settings!==void 0}/**
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
 */const Zc={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ot=new sn("app","Firebase",Zc);/**
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
 */class el{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new yt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ot.create("app-deleted",{appName:this._name})}}/**
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
 */const Ot=Xc;function Br(i,e={}){let t=i;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Si,automaticDataCollectionEnabled:!0},e),s=r.name;if(typeof s!="string"||!s)throw ot.create("bad-app-name",{appName:String(s)});if(t||(t=xr()),!t)throw ot.create("no-options");const a=an.get(s);if(a){if(mt(t,a.options)&&mt(r,a.config))return a;throw ot.create("duplicate-app",{appName:s})}const l=new oc(s);for(const y of ki.values())l.addComponent(y);const p=new el(t,r,l);return an.set(s,p),p}function Hr(i=Si){const e=an.get(i);if(!e&&i===Si&&xr())return Br();if(!e)throw ot.create("no-app",{appName:i});return e}function zr(){return Array.from(an.values())}function at(i,e,t){var r;let s=(r=Yc[i])!==null&&r!==void 0?r:i;t&&(s+=`-${t}`);const a=s.match(/\s|\//),l=e.match(/\s|\//);if(a||l){const p=[`Unable to register library "${s}" with version "${e}":`];a&&p.push(`library name "${s}" contains illegal characters (whitespace or "/")`),a&&l&&p.push("and"),l&&p.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ke.warn(p.join(" "));return}Nt(new yt(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const tl="firebase-heartbeat-database",nl=1,cn="firebase-heartbeat-store";let xi=null;function Wr(){return xi||(xi=_c(tl,nl,{upgrade:(i,e)=>{switch(e){case 0:try{i.createObjectStore(cn)}catch(t){console.warn(t)}}}}).catch(i=>{throw ot.create("idb-open",{originalErrorMessage:i.message})})),xi}async function il(i){try{const t=(await Wr()).transaction(cn),r=await t.objectStore(cn).get(qr(i));return await t.done,r}catch(e){if(e instanceof qe)Ke.warn(e.message);else{const t=ot.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ke.warn(t.message)}}}async function Gr(i,e){try{const r=(await Wr()).transaction(cn,"readwrite");await r.objectStore(cn).put(e,qr(i)),await r.done}catch(t){if(t instanceof qe)Ke.warn(t.message);else{const r=ot.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Ke.warn(r.message)}}}function qr(i){return`${i.name}!${i.options.appId}`}/**
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
 */const rl=1024,sl=30;class ol{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new cl(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=Kr();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(l=>l.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:s}),this._heartbeatsCache.heartbeats.length>sl){const l=ll(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ke.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Kr(),{heartbeatsToSend:r,unsentEntries:s}=al(this._heartbeatsCache.heartbeats),a=Mn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(t){return Ke.warn(t),""}}}function Kr(){return new Date().toISOString().substring(0,10)}function al(i,e=rl){const t=[];let r=i.slice();for(const s of i){const a=t.find(l=>l.agent===s.agent);if(a){if(a.dates.push(s.date),Jr(t)>e){a.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Jr(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class cl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ka()?Ja().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await il(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Gr(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Gr(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Jr(i){return Mn(JSON.stringify({version:2,heartbeats:i})).length}function ll(i){if(i.length===0)return-1;let e=0,t=i[0].date;for(let r=1;r<i.length;r++)i[r].date<t&&(t=i[r].date,e=r);return e}/**
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
 */function hl(i){Nt(new yt("platform-logger",e=>new bc(e),"PRIVATE")),Nt(new yt("heartbeat",e=>new ol(e),"PRIVATE")),at(Ai,Vr,i),at(Ai,Vr,"esm2017"),at("fire-js","")}hl("");var ul="firebase",dl="11.10.0";/**
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
 */at(ul,dl,"app");function Pi(i,e){var t={};for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&e.indexOf(r)<0&&(t[r]=i[r]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(i);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(i,r[s])&&(t[r[s]]=i[r[s]]);return t}typeof SuppressedError=="function"&&SuppressedError;function Xr(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const fl=Xr,Yr=new sn("auth","Firebase",Xr());/**
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
 */const Un=new vi("@firebase/auth");function pl(i,...e){Un.logLevel<=W.WARN&&Un.warn(`Auth (${Ot}): ${i}`,...e)}function $n(i,...e){Un.logLevel<=W.ERROR&&Un.error(`Auth (${Ot}): ${i}`,...e)}/**
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
 */function Je(i,...e){throw Ri(i,...e)}function Ve(i,...e){return Ri(i,...e)}function Qr(i,e,t){const r=Object.assign(Object.assign({},fl()),{[e]:t});return new sn("auth","Firebase",r).create(e,{appName:i.name})}function _t(i){return Qr(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ri(i,...e){if(typeof i!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=i.name),i._errorFactory.create(t,...r)}return Yr.create(i,...e)}function R(i,e,...t){if(!i)throw Ri(e,...t)}function Xe(i){const e="INTERNAL ASSERTION FAILED: "+i;throw $n(e),new Error(e)}function Ye(i,e){i||Xe(e)}/**
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
 */function Ni(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.href)||""}function gl(){return Zr()==="http:"||Zr()==="https:"}function Zr(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.protocol)||null}/**
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
 */function ml(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(gl()||Wa()||"connection"in navigator)?navigator.onLine:!0}function yl(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
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
 */class ln{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ye(t>e,"Short delay should be less than long delay!"),this.isMobile=Ha()||Ga()}get(){return ml()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Oi(i,e){Ye(i.emulator,"Emulator should always be set here");const{url:t}=i.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class es{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Xe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Xe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Xe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const vl={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const _l=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],wl=new ln(3e4,6e4);function Di(i,e){return i.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:i.tenantId}):e}async function Dt(i,e,t,r,s={}){return ts(i,s,async()=>{let a={},l={};r&&(e==="GET"?l=r:a={body:JSON.stringify(r)});const p=on(Object.assign({key:i.config.apiKey},l)).slice(1),y=await i._getAdditionalHeaders();y["Content-Type"]="application/json",i.languageCode&&(y["X-Firebase-Locale"]=i.languageCode);const E=Object.assign({method:e,headers:y},a);return za()||(E.referrerPolicy="no-referrer"),i.emulatorConfig&&nn(i.emulatorConfig.host)&&(E.credentials="include"),es.fetch()(await ns(i,i.config.apiHost,t,p),E)})}async function ts(i,e,t){i._canInitEmulator=!1;const r=Object.assign(Object.assign({},vl),e);try{const s=new bl(i),a=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const l=await a.json();if("needConfirmation"in l)throw Fn(i,"account-exists-with-different-credential",l);if(a.ok&&!("errorMessage"in l))return l;{const p=a.ok?l.errorMessage:l.error.message,[y,E]=p.split(" : ");if(y==="FEDERATED_USER_ID_ALREADY_LINKED")throw Fn(i,"credential-already-in-use",l);if(y==="EMAIL_EXISTS")throw Fn(i,"email-already-in-use",l);if(y==="USER_DISABLED")throw Fn(i,"user-disabled",l);const A=r[y]||y.toLowerCase().replace(/[_\s]+/g,"-");if(E)throw Qr(i,A,E);Je(i,A)}}catch(s){if(s instanceof qe)throw s;Je(i,"network-request-failed",{message:String(s)})}}async function El(i,e,t,r,s={}){const a=await Dt(i,e,t,r,s);return"mfaPendingCredential"in a&&Je(i,"multi-factor-auth-required",{_serverResponse:a}),a}async function ns(i,e,t,r){const s=`${e}${t}?${r}`,a=i,l=a.config.emulator?Oi(i.config,s):`${i.config.apiScheme}://${s}`;return _l.includes(t)&&(await a._persistenceManagerAvailable,a._getPersistenceType()==="COOKIE")?a._getPersistence()._getFinalTarget(l).toString():l}class bl{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Ve(this.auth,"network-request-failed")),wl.get())})}}function Fn(i,e,t){const r={appName:i.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Ve(i,e,r);return s.customData._tokenResponse=t,s}/**
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
 */async function Tl(i,e){return Dt(i,"POST","/v1/accounts:delete",e)}async function Vn(i,e){return Dt(i,"POST","/v1/accounts:lookup",e)}/**
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
 */function hn(i){if(i)try{const e=new Date(Number(i));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Il(i,e=!1){const t=Rt(i),r=await t.getIdToken(e),s=Mi(r);R(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const a=typeof s.firebase=="object"?s.firebase:void 0,l=a==null?void 0:a.sign_in_provider;return{claims:s,token:r,authTime:hn(Li(s.auth_time)),issuedAtTime:hn(Li(s.iat)),expirationTime:hn(Li(s.exp)),signInProvider:l||null,signInSecondFactor:(a==null?void 0:a.sign_in_second_factor)||null}}function Li(i){return Number(i)*1e3}function Mi(i){const[e,t,r]=i.split(".");if(e===void 0||t===void 0||r===void 0)return $n("JWT malformed, contained fewer than 3 sections"),null;try{const s=kr(t);return s?JSON.parse(s):($n("Failed to decode base64 JWT payload"),null)}catch(s){return $n("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function is(i){const e=Mi(i);return R(e,"internal-error"),R(typeof e.exp<"u","internal-error"),R(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function un(i,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof qe&&Al(r)&&i.auth.currentUser===i&&await i.auth.signOut(),r}}function Al({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
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
 */class Sl{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Ui{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=hn(this.lastLoginAt),this.creationTime=hn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function jn(i){var e;const t=i.auth,r=await i.getIdToken(),s=await un(i,Vn(t,{idToken:r}));R(s==null?void 0:s.users.length,t,"internal-error");const a=s.users[0];i._notifyReloadListener(a);const l=!((e=a.providerUserInfo)===null||e===void 0)&&e.length?rs(a.providerUserInfo):[],p=Cl(i.providerData,l),y=i.isAnonymous,E=!(i.email&&a.passwordHash)&&!(p!=null&&p.length),A=y?E:!1,k={uid:a.localId,displayName:a.displayName||null,photoURL:a.photoUrl||null,email:a.email||null,emailVerified:a.emailVerified||!1,phoneNumber:a.phoneNumber||null,tenantId:a.tenantId||null,providerData:p,metadata:new Ui(a.createdAt,a.lastLoginAt),isAnonymous:A};Object.assign(i,k)}async function kl(i){const e=Rt(i);await jn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Cl(i,e){return[...i.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function rs(i){return i.map(e=>{var{providerId:t}=e,r=Pi(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function xl(i,e){const t=await ts(i,{},async()=>{const r=on({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:a}=i.config,l=await ns(i,s,"/v1/token",`key=${a}`),p=await i._getAdditionalHeaders();p["Content-Type"]="application/x-www-form-urlencoded";const y={method:"POST",headers:p,body:r};return i.emulatorConfig&&nn(i.emulatorConfig.host)&&(y.credentials="include"),es.fetch()(l,y)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Pl(i,e){return Dt(i,"POST","/v2/accounts:revokeToken",Di(i,e))}/**
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
 */class Lt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){R(e.idToken,"internal-error"),R(typeof e.idToken<"u","internal-error"),R(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):is(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){R(e.length!==0,"internal-error");const t=is(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(R(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:a}=await xl(e,t);this.updateTokensAndExpiration(r,s,Number(a))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:a}=t,l=new Lt;return r&&(R(typeof r=="string","internal-error",{appName:e}),l.refreshToken=r),s&&(R(typeof s=="string","internal-error",{appName:e}),l.accessToken=s),a&&(R(typeof a=="number","internal-error",{appName:e}),l.expirationTime=a),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Lt,this.toJSON())}_performRefresh(){return Xe("not implemented")}}/**
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
 */function ct(i,e){R(typeof i=="string"||typeof i>"u","internal-error",{appName:e})}class Ne{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,a=Pi(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Sl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=a.displayName||null,this.email=a.email||null,this.emailVerified=a.emailVerified||!1,this.phoneNumber=a.phoneNumber||null,this.photoURL=a.photoURL||null,this.isAnonymous=a.isAnonymous||!1,this.tenantId=a.tenantId||null,this.providerData=a.providerData?[...a.providerData]:[],this.metadata=new Ui(a.createdAt||void 0,a.lastLoginAt||void 0)}async getIdToken(e){const t=await un(this,this.stsTokenManager.getToken(this.auth,e));return R(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Il(this,e)}reload(){return kl(this)}_assign(e){this!==e&&(R(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ne(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){R(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await jn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Fe(this.auth.app))return Promise.reject(_t(this.auth));const e=await this.getIdToken();return await un(this,Tl(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,a,l,p,y,E,A;const k=(r=t.displayName)!==null&&r!==void 0?r:void 0,I=(s=t.email)!==null&&s!==void 0?s:void 0,x=(a=t.phoneNumber)!==null&&a!==void 0?a:void 0,P=(l=t.photoURL)!==null&&l!==void 0?l:void 0,$=(p=t.tenantId)!==null&&p!==void 0?p:void 0,M=(y=t._redirectEventId)!==null&&y!==void 0?y:void 0,Ae=(E=t.createdAt)!==null&&E!==void 0?E:void 0,he=(A=t.lastLoginAt)!==null&&A!==void 0?A:void 0,{uid:Z,emailVerified:ge,isAnonymous:tt,providerData:F,stsTokenManager:_}=t;R(Z&&_,e,"internal-error");const f=Lt.fromJSON(this.name,_);R(typeof Z=="string",e,"internal-error"),ct(k,e.name),ct(I,e.name),R(typeof ge=="boolean",e,"internal-error"),R(typeof tt=="boolean",e,"internal-error"),ct(x,e.name),ct(P,e.name),ct($,e.name),ct(M,e.name),ct(Ae,e.name),ct(he,e.name);const g=new Ne({uid:Z,auth:e,email:I,emailVerified:ge,displayName:k,isAnonymous:tt,photoURL:P,phoneNumber:x,tenantId:$,stsTokenManager:f,createdAt:Ae,lastLoginAt:he});return F&&Array.isArray(F)&&(g.providerData=F.map(v=>Object.assign({},v))),M&&(g._redirectEventId=M),g}static async _fromIdTokenResponse(e,t,r=!1){const s=new Lt;s.updateFromServerResponse(t);const a=new Ne({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await jn(a),a}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];R(s.localId!==void 0,"internal-error");const a=s.providerUserInfo!==void 0?rs(s.providerUserInfo):[],l=!(s.email&&s.passwordHash)&&!(a!=null&&a.length),p=new Lt;p.updateFromIdToken(r);const y=new Ne({uid:s.localId,auth:e,stsTokenManager:p,isAnonymous:l}),E={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Ui(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(a!=null&&a.length)};return Object.assign(y,E),y}}/**
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
 */const ss=new Map;function Qe(i){Ye(i instanceof Function,"Expected a class definition");let e=ss.get(i);return e?(Ye(e instanceof i,"Instance stored in cache mismatched with class"),e):(e=new i,ss.set(i,e),e)}/**
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
 */class os{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}os.type="NONE";const as=os;/**
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
 */function Bn(i,e,t){return`firebase:${i}:${e}:${t}`}class Mt{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:a}=this.auth;this.fullUserKey=Bn(this.userKey,s.apiKey,a),this.fullPersistenceKey=Bn("persistence",s.apiKey,a),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Vn(this.auth,{idToken:e}).catch(()=>{});return t?Ne._fromGetAccountInfoResponse(this.auth,t,e):null}return Ne._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Mt(Qe(as),e,r);const s=(await Promise.all(t.map(async E=>{if(await E._isAvailable())return E}))).filter(E=>E);let a=s[0]||Qe(as);const l=Bn(r,e.config.apiKey,e.name);let p=null;for(const E of t)try{const A=await E._get(l);if(A){let k;if(typeof A=="string"){const I=await Vn(e,{idToken:A}).catch(()=>{});if(!I)break;k=await Ne._fromGetAccountInfoResponse(e,I,A)}else k=Ne._fromJSON(e,A);E!==a&&(p=k),a=E;break}}catch{}const y=s.filter(E=>E._shouldAllowMigration);return!a._shouldAllowMigration||!y.length?new Mt(a,e,r):(a=y[0],p&&await a._set(l,p.toJSON()),await Promise.all(t.map(async E=>{if(E!==a)try{await E._remove(l)}catch{}})),new Mt(a,e,r))}}/**
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
 */function cs(i){const e=i.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ds(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(ls(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ps(e))return"Blackberry";if(gs(e))return"Webos";if(hs(e))return"Safari";if((e.includes("chrome/")||us(e))&&!e.includes("edge/"))return"Chrome";if(fs(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=i.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function ls(i=Te()){return/firefox\//i.test(i)}function hs(i=Te()){const e=i.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function us(i=Te()){return/crios\//i.test(i)}function ds(i=Te()){return/iemobile/i.test(i)}function fs(i=Te()){return/android/i.test(i)}function ps(i=Te()){return/blackberry/i.test(i)}function gs(i=Te()){return/webos/i.test(i)}function $i(i=Te()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function Rl(i=Te()){var e;return $i(i)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Nl(){return qa()&&document.documentMode===10}function ms(i=Te()){return $i(i)||fs(i)||gs(i)||ps(i)||/windows phone/i.test(i)||ds(i)}/**
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
 */function ys(i,e=[]){let t;switch(i){case"Browser":t=cs(Te());break;case"Worker":t=`${cs(Te())}-${i}`;break;default:t=i}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Ot}/${r}`}/**
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
 */class Ol{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=a=>new Promise((l,p)=>{try{const y=e(a);l(y)}catch(y){p(y)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Dl(i,e={}){return Dt(i,"GET","/v2/passwordPolicy",Di(i,e))}/**
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
 */const Ll=6;class Ml{constructor(e){var t,r,s,a;const l=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=l.minPasswordLength)!==null&&t!==void 0?t:Ll,l.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=l.maxPasswordLength),l.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=l.containsLowercaseCharacter),l.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=l.containsUppercaseCharacter),l.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=l.containsNumericCharacter),l.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=l.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(a=e.forceUpgradeOnSignin)!==null&&a!==void 0?a:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,s,a,l,p;const y={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,y),this.validatePasswordCharacterOptions(e,y),y.isValid&&(y.isValid=(t=y.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),y.isValid&&(y.isValid=(r=y.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),y.isValid&&(y.isValid=(s=y.containsLowercaseLetter)!==null&&s!==void 0?s:!0),y.isValid&&(y.isValid=(a=y.containsUppercaseLetter)!==null&&a!==void 0?a:!0),y.isValid&&(y.isValid=(l=y.containsNumericCharacter)!==null&&l!==void 0?l:!0),y.isValid&&(y.isValid=(p=y.containsNonAlphanumericCharacter)!==null&&p!==void 0?p:!0),y}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,a){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=a))}}/**
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
 */class Ul{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new vs(this),this.idTokenSubscription=new vs(this),this.beforeStateQueue=new Ol(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Yr,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(a=>this._resolvePersistenceManagerAvailable=a)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Qe(t)),this._initializationPromise=this.queue(async()=>{var r,s,a;if(!this._deleted&&(this.persistenceManager=await Mt.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((a=this.currentUser)===null||a===void 0?void 0:a.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Vn(this,{idToken:e}),r=await Ne._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Fe(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(p=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(p,p))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,a=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,p=s==null?void 0:s._redirectEventId,y=await this.tryRedirectSignIn(e);(!l||l===p)&&(y!=null&&y.user)&&(s=y.user,a=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(a)try{await this.beforeStateQueue.runMiddleware(s)}catch(l){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return R(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await jn(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=yl()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Fe(this.app))return Promise.reject(_t(this));const t=e?Rt(e):null;return t&&R(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&R(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Fe(this.app)?Promise.reject(_t(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Fe(this.app)?Promise.reject(_t(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Qe(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Dl(this),t=new Ml(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new sn("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Pl(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Qe(e)||this._popupRedirectResolver;R(t,this,"argument-error"),this.redirectPersistenceManager=await Mt.create(this,[Qe(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const a=typeof t=="function"?t:t.next.bind(t);let l=!1;const p=this._isInitialized?Promise.resolve():this._initializationPromise;if(R(p,this,"internal-error"),p.then(()=>{l||a(this.currentUser)}),typeof t=="function"){const y=e.addObserver(t,r,s);return()=>{l=!0,y()}}else{const y=e.addObserver(t);return()=>{l=!0,y()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return R(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ys(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;if(Fe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&pl(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Fi(i){return Rt(i)}class vs{constructor(e){this.auth=e,this.observer=null,this.addObserver=ec(t=>this.observer=t)}get next(){return R(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Vi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function $l(i){Vi=i}function Fl(i){return Vi.loadJS(i)}function Vl(){return Vi.gapiScript}function jl(i){return`__${i}${Math.floor(Math.random()*1e6)}`}/**
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
 */function Bl(i,e){const t=Ci(i,"auth");if(t.isInitialized()){const s=t.getImmediate(),a=t.getOptions();if(mt(a,e??{}))return s;Je(s,"already-initialized")}return t.initialize({options:e})}function Hl(i,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Qe);e!=null&&e.errorMap&&i._updateErrorMap(e.errorMap),i._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function zl(i,e,t){const r=Fi(i);R(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,a=_s(e),{host:l,port:p}=Wl(e),y=p===null?"":`:${p}`,E={url:`${a}//${l}${y}/`},A=Object.freeze({host:l,port:p,protocol:a.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){R(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),R(mt(E,r.config.emulator)&&mt(A,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=E,r.emulatorConfig=A,r.settings.appVerificationDisabledForTesting=!0,nn(l)?(Rr(`${a}//${l}${y}`),Or("Auth",!0)):Gl()}function _s(i){const e=i.indexOf(":");return e<0?"":i.substr(0,e+1)}function Wl(i){const e=_s(i),t=/(\/\/)?([^?#/]+)/.exec(i.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const a=s[1];return{host:a,port:ws(r.substr(a.length+1))}}else{const[a,l]=r.split(":");return{host:a,port:ws(l)}}}function ws(i){if(!i)return null;const e=Number(i);return isNaN(e)?null:e}function Gl(){function i(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
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
 */class Es{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Xe("not implemented")}_getIdTokenResponse(e){return Xe("not implemented")}_linkToIdToken(e,t){return Xe("not implemented")}_getReauthenticationResolver(e){return Xe("not implemented")}}/**
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
 */async function Ut(i,e){return El(i,"POST","/v1/accounts:signInWithIdp",Di(i,e))}/**
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
 */const ql="http://localhost";class wt extends Es{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new wt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Je("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,a=Pi(t,["providerId","signInMethod"]);if(!r||!s)return null;const l=new wt(r,s);return l.idToken=a.idToken||void 0,l.accessToken=a.accessToken||void 0,l.secret=a.secret,l.nonce=a.nonce,l.pendingToken=a.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return Ut(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Ut(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ut(e,t)}buildRequest(){const e={requestUri:ql,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=on(t)}return e}}/**
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
 */class bs{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class dn extends bs{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class lt extends dn{constructor(){super("facebook.com")}static credential(e){return wt._fromParams({providerId:lt.PROVIDER_ID,signInMethod:lt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return lt.credentialFromTaggedObject(e)}static credentialFromError(e){return lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return lt.credential(e.oauthAccessToken)}catch{return null}}}lt.FACEBOOK_SIGN_IN_METHOD="facebook.com",lt.PROVIDER_ID="facebook.com";/**
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
 */class ht extends dn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return wt._fromParams({providerId:ht.PROVIDER_ID,signInMethod:ht.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ht.credentialFromTaggedObject(e)}static credentialFromError(e){return ht.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return ht.credential(t,r)}catch{return null}}}ht.GOOGLE_SIGN_IN_METHOD="google.com",ht.PROVIDER_ID="google.com";/**
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
 */class ut extends dn{constructor(){super("github.com")}static credential(e){return wt._fromParams({providerId:ut.PROVIDER_ID,signInMethod:ut.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ut.credentialFromTaggedObject(e)}static credentialFromError(e){return ut.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ut.credential(e.oauthAccessToken)}catch{return null}}}ut.GITHUB_SIGN_IN_METHOD="github.com",ut.PROVIDER_ID="github.com";/**
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
 */class dt extends dn{constructor(){super("twitter.com")}static credential(e,t){return wt._fromParams({providerId:dt.PROVIDER_ID,signInMethod:dt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return dt.credentialFromTaggedObject(e)}static credentialFromError(e){return dt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return dt.credential(t,r)}catch{return null}}}dt.TWITTER_SIGN_IN_METHOD="twitter.com",dt.PROVIDER_ID="twitter.com";/**
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
 */class $t{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const a=await Ne._fromIdTokenResponse(e,r,s),l=Ts(r);return new $t({user:a,providerId:l,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=Ts(r);return new $t({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function Ts(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
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
 */class Hn extends qe{constructor(e,t,r,s){var a;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Hn.prototype),this.customData={appName:e.name,tenantId:(a=e.tenantId)!==null&&a!==void 0?a:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Hn(e,t,r,s)}}function Is(i,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(i):t._getIdTokenResponse(i)).catch(a=>{throw a.code==="auth/multi-factor-auth-required"?Hn._fromErrorAndOperation(i,a,e,r):a})}async function Kl(i,e,t=!1){const r=await un(i,e._linkToIdToken(i.auth,await i.getIdToken()),t);return $t._forOperation(i,"link",r)}/**
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
 */async function Jl(i,e,t=!1){const{auth:r}=i;if(Fe(r.app))return Promise.reject(_t(r));const s="reauthenticate";try{const a=await un(i,Is(r,s,e,i),t);R(a.idToken,r,"internal-error");const l=Mi(a.idToken);R(l,r,"internal-error");const{sub:p}=l;return R(i.uid===p,r,"user-mismatch"),$t._forOperation(i,s,a)}catch(a){throw(a==null?void 0:a.code)==="auth/user-not-found"&&Je(r,"user-mismatch"),a}}/**
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
 */async function Xl(i,e,t=!1){if(Fe(i.app))return Promise.reject(_t(i));const r="signIn",s=await Is(i,r,e),a=await $t._fromIdTokenResponse(i,r,s);return t||await i._updateCurrentUser(a.user),a}function Yl(i,e,t,r){return Rt(i).onIdTokenChanged(e,t,r)}function Ql(i,e,t){return Rt(i).beforeAuthStateChanged(e,t)}const zn="__sak";/**
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
 */class As{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(zn,"1"),this.storage.removeItem(zn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const Zl=1e3,eh=10;class Ss extends As{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ms(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,p,y)=>{this.notifyListeners(l,y)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const l=this.storage.getItem(r);!t&&this.localCache[r]===l||this.notifyListeners(r,l)},a=this.storage.getItem(r);Nl()&&a!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,eh):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Zl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ss.type="LOCAL";const th=Ss;/**
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
 */class ks extends As{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}ks.type="SESSION";const Cs=ks;/**
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
 */function nh(i){return Promise.all(i.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class Wn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new Wn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:a}=t.data,l=this.handlersMap[s];if(!(l!=null&&l.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const p=Array.from(l).map(async E=>E(t.origin,a)),y=await nh(p);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:y})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Wn.receivers=[];/**
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
 */function ji(i="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return i+t}/**
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
 */class ih{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let a,l;return new Promise((p,y)=>{const E=ji("",20);s.port1.start();const A=setTimeout(()=>{y(new Error("unsupported_event"))},r);l={messageChannel:s,onMessage(k){const I=k;if(I.data.eventId===E)switch(I.data.status){case"ack":clearTimeout(A),a=setTimeout(()=>{y(new Error("timeout"))},3e3);break;case"done":clearTimeout(a),p(I.data.response);break;default:clearTimeout(A),clearTimeout(a),y(new Error("invalid_response"));break}}},this.handlers.add(l),s.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:E,data:t},[s.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
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
 */function je(){return window}function rh(i){je().location.href=i}/**
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
 */function xs(){return typeof je().WorkerGlobalScope<"u"&&typeof je().importScripts=="function"}async function sh(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function oh(){var i;return((i=navigator==null?void 0:navigator.serviceWorker)===null||i===void 0?void 0:i.controller)||null}function ah(){return xs()?self:null}/**
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
 */const Ps="firebaseLocalStorageDb",ch=1,Gn="firebaseLocalStorage",Rs="fbase_key";class fn{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function qn(i,e){return i.transaction([Gn],e?"readwrite":"readonly").objectStore(Gn)}function lh(){const i=indexedDB.deleteDatabase(Ps);return new fn(i).toPromise()}function Bi(){const i=indexedDB.open(Ps,ch);return new Promise((e,t)=>{i.addEventListener("error",()=>{t(i.error)}),i.addEventListener("upgradeneeded",()=>{const r=i.result;try{r.createObjectStore(Gn,{keyPath:Rs})}catch(s){t(s)}}),i.addEventListener("success",async()=>{const r=i.result;r.objectStoreNames.contains(Gn)?e(r):(r.close(),await lh(),e(await Bi()))})})}async function Ns(i,e,t){const r=qn(i,!0).put({[Rs]:e,value:t});return new fn(r).toPromise()}async function hh(i,e){const t=qn(i,!1).get(e),r=await new fn(t).toPromise();return r===void 0?null:r.value}function Os(i,e){const t=qn(i,!0).delete(e);return new fn(t).toPromise()}const uh=800,dh=3;class Ds{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Bi(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>dh)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return xs()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Wn._getInstance(ah()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await sh(),!this.activeServiceWorker)return;this.sender=new ih(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||oh()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Bi();return await Ns(e,zn,"1"),await Os(e,zn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ns(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>hh(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Os(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const a=qn(s,!1).getAll();return new fn(a).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:a}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(a)&&(this.notifyListeners(s,a),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),uh)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Ds.type="LOCAL";const fh=Ds;new ln(3e4,6e4);/**
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
 */function ph(i,e){return e?Qe(e):(R(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
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
 */class Hi extends Es{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ut(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ut(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ut(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function gh(i){return Xl(i.auth,new Hi(i),i.bypassAuthState)}function mh(i){const{auth:e,user:t}=i;return R(t,e,"internal-error"),Jl(t,new Hi(i),i.bypassAuthState)}async function yh(i){const{auth:e,user:t}=i;return R(t,e,"internal-error"),Kl(t,new Hi(i),i.bypassAuthState)}/**
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
 */class Ls{constructor(e,t,r,s,a=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=a,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:a,error:l,type:p}=e;if(l){this.reject(l);return}const y={auth:this.auth,requestUri:t,sessionId:r,tenantId:a||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(p)(y))}catch(E){this.reject(E)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return gh;case"linkViaPopup":case"linkViaRedirect":return yh;case"reauthViaPopup":case"reauthViaRedirect":return mh;default:Je(this.auth,"internal-error")}}resolve(e){Ye(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ye(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const vh=new ln(2e3,1e4);class Ft extends Ls{constructor(e,t,r,s,a){super(e,t,s,a),this.provider=r,this.authWindow=null,this.pollId=null,Ft.currentPopupAction&&Ft.currentPopupAction.cancel(),Ft.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return R(e,this.auth,"internal-error"),e}async onExecution(){Ye(this.filter.length===1,"Popup operations only handle one event");const e=ji();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Ve(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ve(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ft.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ve(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,vh.get())};e()}}Ft.currentPopupAction=null;/**
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
 */const _h="pendingRedirect",Kn=new Map;class wh extends Ls{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Kn.get(this.auth._key());if(!e){try{const r=await Eh(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Kn.set(this.auth._key(),e)}return this.bypassAuthState||Kn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Eh(i,e){const t=Ih(e),r=Th(i);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function bh(i,e){Kn.set(i._key(),e)}function Th(i){return Qe(i._redirectPersistence)}function Ih(i){return Bn(_h,i.config.apiKey,i.name)}async function Ah(i,e,t=!1){if(Fe(i.app))return Promise.reject(_t(i));const r=Fi(i),s=ph(r,e),l=await new wh(r,s,t).execute();return l&&!t&&(delete l.user._redirectEventId,await r._persistUserIfCurrent(l.user),await r._setRedirectUser(null,e)),l}/**
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
 */const Sh=10*60*1e3;class kh{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Ch(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Us(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(Ve(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Sh&&this.cachedEventUids.clear(),this.cachedEventUids.has(Ms(e))}saveEventToCache(e){this.cachedEventUids.add(Ms(e)),this.lastProcessedEventTime=Date.now()}}function Ms(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(e=>e).join("-")}function Us({type:i,error:e}){return i==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Ch(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Us(i);default:return!1}}/**
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
 */async function xh(i,e={}){return Dt(i,"GET","/v1/projects",e)}/**
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
 */const Ph=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Rh=/^https?/;async function Nh(i){if(i.config.emulator)return;const{authorizedDomains:e}=await xh(i);for(const t of e)try{if(Oh(t))return}catch{}Je(i,"unauthorized-domain")}function Oh(i){const e=Ni(),{protocol:t,hostname:r}=new URL(e);if(i.startsWith("chrome-extension://")){const l=new URL(i);return l.hostname===""&&r===""?t==="chrome-extension:"&&i.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===r}if(!Rh.test(t))return!1;if(Ph.test(i))return r===i;const s=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const Dh=new ln(3e4,6e4);function $s(){const i=je().___jsl;if(i!=null&&i.H){for(const e of Object.keys(i.H))if(i.H[e].r=i.H[e].r||[],i.H[e].L=i.H[e].L||[],i.H[e].r=[...i.H[e].L],i.CP)for(let t=0;t<i.CP.length;t++)i.CP[t]=null}}function Lh(i){return new Promise((e,t)=>{var r,s,a;function l(){$s(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{$s(),t(Ve(i,"network-request-failed"))},timeout:Dh.get()})}if(!((s=(r=je().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((a=je().gapi)===null||a===void 0)&&a.load)l();else{const p=jl("iframefcb");return je()[p]=()=>{gapi.load?l():t(Ve(i,"network-request-failed"))},Fl(`${Vl()}?onload=${p}`).catch(y=>t(y))}}).catch(e=>{throw Jn=null,e})}let Jn=null;function Mh(i){return Jn=Jn||Lh(i),Jn}/**
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
 */const Uh=new ln(5e3,15e3),$h="__/auth/iframe",Fh="emulator/auth/iframe",Vh={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},jh=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Bh(i){const e=i.config;R(e.authDomain,i,"auth-domain-config-required");const t=e.emulator?Oi(e,Fh):`https://${i.config.authDomain}/${$h}`,r={apiKey:e.apiKey,appName:i.name,v:Ot},s=jh.get(i.config.apiHost);s&&(r.eid=s);const a=i._getFrameworks();return a.length&&(r.fw=a.join(",")),`${t}?${on(r).slice(1)}`}async function Hh(i){const e=await Mh(i),t=je().gapi;return R(t,i,"internal-error"),e.open({where:document.body,url:Bh(i),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Vh,dontclear:!0},r=>new Promise(async(s,a)=>{await r.restyle({setHideOnLeave:!1});const l=Ve(i,"network-request-failed"),p=je().setTimeout(()=>{a(l)},Uh.get());function y(){je().clearTimeout(p),s(r)}r.ping(y).then(y,()=>{a(l)})}))}/**
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
 */const zh={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Wh=500,Gh=600,qh="_blank",Kh="http://localhost";class Fs{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Jh(i,e,t,r=Wh,s=Gh){const a=Math.max((window.screen.availHeight-s)/2,0).toString(),l=Math.max((window.screen.availWidth-r)/2,0).toString();let p="";const y=Object.assign(Object.assign({},zh),{width:r.toString(),height:s.toString(),top:a,left:l}),E=Te().toLowerCase();t&&(p=us(E)?qh:t),ls(E)&&(e=e||Kh,y.scrollbars="yes");const A=Object.entries(y).reduce((I,[x,P])=>`${I}${x}=${P},`,"");if(Rl(E)&&p!=="_self")return Xh(e||"",p),new Fs(null);const k=window.open(e||"",p,A);R(k,i,"popup-blocked");try{k.focus()}catch{}return new Fs(k)}function Xh(i,e){const t=document.createElement("a");t.href=i,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const Yh="__/auth/handler",Qh="emulator/auth/handler",Zh=encodeURIComponent("fac");async function Vs(i,e,t,r,s,a){R(i.config.authDomain,i,"auth-domain-config-required"),R(i.config.apiKey,i,"invalid-api-key");const l={apiKey:i.config.apiKey,appName:i.name,authType:t,redirectUrl:r,v:Ot,eventId:s};if(e instanceof bs){e.setDefaultLanguage(i.languageCode),l.providerId=e.providerId||"",Za(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[A,k]of Object.entries({}))l[A]=k}if(e instanceof dn){const A=e.getScopes().filter(k=>k!=="");A.length>0&&(l.scopes=A.join(","))}i.tenantId&&(l.tid=i.tenantId);const p=l;for(const A of Object.keys(p))p[A]===void 0&&delete p[A];const y=await i._getAppCheckToken(),E=y?`#${Zh}=${encodeURIComponent(y)}`:"";return`${eu(i)}?${on(p).slice(1)}${E}`}function eu({config:i}){return i.emulator?Oi(i,Qh):`https://${i.authDomain}/${Yh}`}/**
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
 */const zi="webStorageSupport";class tu{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Cs,this._completeRedirectFn=Ah,this._overrideRedirectResult=bh}async _openPopup(e,t,r,s){var a;Ye((a=this.eventManagers[e._key()])===null||a===void 0?void 0:a.manager,"_initialize() not called before _openPopup()");const l=await Vs(e,t,r,Ni(),s);return Jh(e,l,ji())}async _openRedirect(e,t,r,s){await this._originValidation(e);const a=await Vs(e,t,r,Ni(),s);return rh(a),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:a}=this.eventManagers[t];return s?Promise.resolve(s):(Ye(a,"If manager is not set, promise should be"),a)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Hh(e),r=new kh(e);return t.register("authEvent",s=>(R(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(zi,{type:zi},s=>{var a;const l=(a=s==null?void 0:s[0])===null||a===void 0?void 0:a[zi];l!==void 0&&t(!!l),Je(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Nh(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ms()||hs()||$i()}}const nu=tu;var js="@firebase/auth",Bs="1.10.8";/**
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
 */class iu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){R(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function ru(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function su(i){Nt(new yt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),a=e.getProvider("app-check-internal"),{apiKey:l,authDomain:p}=r.options;R(l&&!l.includes(":"),"invalid-api-key",{appName:r.name});const y={apiKey:l,authDomain:p,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ys(i)},E=new Ul(r,s,a,y);return Hl(E,t),E},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Nt(new yt("auth-internal",e=>{const t=Fi(e.getProvider("auth").getImmediate());return(r=>new iu(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),at(js,Bs,ru(i)),at(js,Bs,"esm2017")}/**
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
 */const ou=5*60,au=Pr("authIdTokenMaxAge")||ou;let Hs=null;const cu=i=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>au)return;const s=t==null?void 0:t.token;Hs!==s&&(Hs=s,await fetch(i,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function lu(i=Hr()){const e=Ci(i,"auth");if(e.isInitialized())return e.getImmediate();const t=Bl(i,{popupRedirectResolver:nu,persistence:[fh,th,Cs]}),r=Pr("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const a=new URL(r,location.origin);if(location.origin===a.origin){const l=cu(a.toString());Ql(t,l,()=>l(t.currentUser)),Yl(t,p=>l(p))}}const s=Cr("auth");return s&&zl(t,`http://${s}`),t}function hu(){var i,e;return(e=(i=document.getElementsByTagName("head"))===null||i===void 0?void 0:i[0])!==null&&e!==void 0?e:document}$l({loadJS(i){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",i),r.onload=e,r.onerror=s=>{const a=Ve("internal-error");a.customData=s,t(a)},r.type="text/javascript",r.charset="UTF-8",hu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="}),su("Browser");var zs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Wi;(function(){var i;/** @license

   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function e(_,f){function g(){}g.prototype=f.prototype,_.D=f.prototype,_.prototype=new g,_.prototype.constructor=_,_.C=function(v,d,m){for(var u=Array(arguments.length-2),C=2;C<arguments.length;C++)u[C-2]=arguments[C];return f.prototype[d].apply(v,u)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(_,f,g){g||(g=0);var v=Array(16);if(typeof f=="string")for(var d=0;16>d;++d)v[d]=f.charCodeAt(g++)|f.charCodeAt(g++)<<8|f.charCodeAt(g++)<<16|f.charCodeAt(g++)<<24;else for(d=0;16>d;++d)v[d]=f[g++]|f[g++]<<8|f[g++]<<16|f[g++]<<24;f=_.g[0],g=_.g[1],d=_.g[2];var m=_.g[3],u=f+(m^g&(d^m))+v[0]+3614090360&4294967295;f=g+(u<<7&4294967295|u>>>25),u=m+(d^f&(g^d))+v[1]+3905402710&4294967295,m=f+(u<<12&4294967295|u>>>20),u=d+(g^m&(f^g))+v[2]+606105819&4294967295,d=m+(u<<17&4294967295|u>>>15),u=g+(f^d&(m^f))+v[3]+3250441966&4294967295,g=d+(u<<22&4294967295|u>>>10),u=f+(m^g&(d^m))+v[4]+4118548399&4294967295,f=g+(u<<7&4294967295|u>>>25),u=m+(d^f&(g^d))+v[5]+1200080426&4294967295,m=f+(u<<12&4294967295|u>>>20),u=d+(g^m&(f^g))+v[6]+2821735955&4294967295,d=m+(u<<17&4294967295|u>>>15),u=g+(f^d&(m^f))+v[7]+4249261313&4294967295,g=d+(u<<22&4294967295|u>>>10),u=f+(m^g&(d^m))+v[8]+1770035416&4294967295,f=g+(u<<7&4294967295|u>>>25),u=m+(d^f&(g^d))+v[9]+2336552879&4294967295,m=f+(u<<12&4294967295|u>>>20),u=d+(g^m&(f^g))+v[10]+4294925233&4294967295,d=m+(u<<17&4294967295|u>>>15),u=g+(f^d&(m^f))+v[11]+2304563134&4294967295,g=d+(u<<22&4294967295|u>>>10),u=f+(m^g&(d^m))+v[12]+1804603682&4294967295,f=g+(u<<7&4294967295|u>>>25),u=m+(d^f&(g^d))+v[13]+4254626195&4294967295,m=f+(u<<12&4294967295|u>>>20),u=d+(g^m&(f^g))+v[14]+2792965006&4294967295,d=m+(u<<17&4294967295|u>>>15),u=g+(f^d&(m^f))+v[15]+1236535329&4294967295,g=d+(u<<22&4294967295|u>>>10),u=f+(d^m&(g^d))+v[1]+4129170786&4294967295,f=g+(u<<5&4294967295|u>>>27),u=m+(g^d&(f^g))+v[6]+3225465664&4294967295,m=f+(u<<9&4294967295|u>>>23),u=d+(f^g&(m^f))+v[11]+643717713&4294967295,d=m+(u<<14&4294967295|u>>>18),u=g+(m^f&(d^m))+v[0]+3921069994&4294967295,g=d+(u<<20&4294967295|u>>>12),u=f+(d^m&(g^d))+v[5]+3593408605&4294967295,f=g+(u<<5&4294967295|u>>>27),u=m+(g^d&(f^g))+v[10]+38016083&4294967295,m=f+(u<<9&4294967295|u>>>23),u=d+(f^g&(m^f))+v[15]+3634488961&4294967295,d=m+(u<<14&4294967295|u>>>18),u=g+(m^f&(d^m))+v[4]+3889429448&4294967295,g=d+(u<<20&4294967295|u>>>12),u=f+(d^m&(g^d))+v[9]+568446438&4294967295,f=g+(u<<5&4294967295|u>>>27),u=m+(g^d&(f^g))+v[14]+3275163606&4294967295,m=f+(u<<9&4294967295|u>>>23),u=d+(f^g&(m^f))+v[3]+4107603335&4294967295,d=m+(u<<14&4294967295|u>>>18),u=g+(m^f&(d^m))+v[8]+1163531501&4294967295,g=d+(u<<20&4294967295|u>>>12),u=f+(d^m&(g^d))+v[13]+2850285829&4294967295,f=g+(u<<5&4294967295|u>>>27),u=m+(g^d&(f^g))+v[2]+4243563512&4294967295,m=f+(u<<9&4294967295|u>>>23),u=d+(f^g&(m^f))+v[7]+1735328473&4294967295,d=m+(u<<14&4294967295|u>>>18),u=g+(m^f&(d^m))+v[12]+2368359562&4294967295,g=d+(u<<20&4294967295|u>>>12),u=f+(g^d^m)+v[5]+4294588738&4294967295,f=g+(u<<4&4294967295|u>>>28),u=m+(f^g^d)+v[8]+2272392833&4294967295,m=f+(u<<11&4294967295|u>>>21),u=d+(m^f^g)+v[11]+1839030562&4294967295,d=m+(u<<16&4294967295|u>>>16),u=g+(d^m^f)+v[14]+4259657740&4294967295,g=d+(u<<23&4294967295|u>>>9),u=f+(g^d^m)+v[1]+2763975236&4294967295,f=g+(u<<4&4294967295|u>>>28),u=m+(f^g^d)+v[4]+1272893353&4294967295,m=f+(u<<11&4294967295|u>>>21),u=d+(m^f^g)+v[7]+4139469664&4294967295,d=m+(u<<16&4294967295|u>>>16),u=g+(d^m^f)+v[10]+3200236656&4294967295,g=d+(u<<23&4294967295|u>>>9),u=f+(g^d^m)+v[13]+681279174&4294967295,f=g+(u<<4&4294967295|u>>>28),u=m+(f^g^d)+v[0]+3936430074&4294967295,m=f+(u<<11&4294967295|u>>>21),u=d+(m^f^g)+v[3]+3572445317&4294967295,d=m+(u<<16&4294967295|u>>>16),u=g+(d^m^f)+v[6]+76029189&4294967295,g=d+(u<<23&4294967295|u>>>9),u=f+(g^d^m)+v[9]+3654602809&4294967295,f=g+(u<<4&4294967295|u>>>28),u=m+(f^g^d)+v[12]+3873151461&4294967295,m=f+(u<<11&4294967295|u>>>21),u=d+(m^f^g)+v[15]+530742520&4294967295,d=m+(u<<16&4294967295|u>>>16),u=g+(d^m^f)+v[2]+3299628645&4294967295,g=d+(u<<23&4294967295|u>>>9),u=f+(d^(g|~m))+v[0]+4096336452&4294967295,f=g+(u<<6&4294967295|u>>>26),u=m+(g^(f|~d))+v[7]+1126891415&4294967295,m=f+(u<<10&4294967295|u>>>22),u=d+(f^(m|~g))+v[14]+2878612391&4294967295,d=m+(u<<15&4294967295|u>>>17),u=g+(m^(d|~f))+v[5]+4237533241&4294967295,g=d+(u<<21&4294967295|u>>>11),u=f+(d^(g|~m))+v[12]+1700485571&4294967295,f=g+(u<<6&4294967295|u>>>26),u=m+(g^(f|~d))+v[3]+2399980690&4294967295,m=f+(u<<10&4294967295|u>>>22),u=d+(f^(m|~g))+v[10]+4293915773&4294967295,d=m+(u<<15&4294967295|u>>>17),u=g+(m^(d|~f))+v[1]+2240044497&4294967295,g=d+(u<<21&4294967295|u>>>11),u=f+(d^(g|~m))+v[8]+1873313359&4294967295,f=g+(u<<6&4294967295|u>>>26),u=m+(g^(f|~d))+v[15]+4264355552&4294967295,m=f+(u<<10&4294967295|u>>>22),u=d+(f^(m|~g))+v[6]+2734768916&4294967295,d=m+(u<<15&4294967295|u>>>17),u=g+(m^(d|~f))+v[13]+1309151649&4294967295,g=d+(u<<21&4294967295|u>>>11),u=f+(d^(g|~m))+v[4]+4149444226&4294967295,f=g+(u<<6&4294967295|u>>>26),u=m+(g^(f|~d))+v[11]+3174756917&4294967295,m=f+(u<<10&4294967295|u>>>22),u=d+(f^(m|~g))+v[2]+718787259&4294967295,d=m+(u<<15&4294967295|u>>>17),u=g+(m^(d|~f))+v[9]+3951481745&4294967295,_.g[0]=_.g[0]+f&4294967295,_.g[1]=_.g[1]+(d+(u<<21&4294967295|u>>>11))&4294967295,_.g[2]=_.g[2]+d&4294967295,_.g[3]=_.g[3]+m&4294967295}r.prototype.u=function(_,f){f===void 0&&(f=_.length);for(var g=f-this.blockSize,v=this.B,d=this.h,m=0;m<f;){if(d==0)for(;m<=g;)s(this,_,m),m+=this.blockSize;if(typeof _=="string"){for(;m<f;)if(v[d++]=_.charCodeAt(m++),d==this.blockSize){s(this,v),d=0;break}}else for(;m<f;)if(v[d++]=_[m++],d==this.blockSize){s(this,v),d=0;break}}this.h=d,this.o+=f},r.prototype.v=function(){var _=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);_[0]=128;for(var f=1;f<_.length-8;++f)_[f]=0;var g=8*this.o;for(f=_.length-8;f<_.length;++f)_[f]=g&255,g/=256;for(this.u(_),_=Array(16),f=g=0;4>f;++f)for(var v=0;32>v;v+=8)_[g++]=this.g[f]>>>v&255;return _};function a(_,f){var g=p;return Object.prototype.hasOwnProperty.call(g,_)?g[_]:g[_]=f(_)}function l(_,f){this.h=f;for(var g=[],v=!0,d=_.length-1;0<=d;d--){var m=_[d]|0;v&&m==f||(g[d]=m,v=!1)}this.g=g}var p={};function y(_){return-128<=_&&128>_?a(_,function(f){return new l([f|0],0>f?-1:0)}):new l([_|0],0>_?-1:0)}function E(_){if(isNaN(_)||!isFinite(_))return k;if(0>_)return M(E(-_));for(var f=[],g=1,v=0;_>=g;v++)f[v]=_/g|0,g*=4294967296;return new l(f,0)}function A(_,f){if(_.length==0)throw Error("number format error: empty string");if(f=f||10,2>f||36<f)throw Error("radix out of range: "+f);if(_.charAt(0)=="-")return M(A(_.substring(1),f));if(0<=_.indexOf("-"))throw Error('number format error: interior "-" character');for(var g=E(Math.pow(f,8)),v=k,d=0;d<_.length;d+=8){var m=Math.min(8,_.length-d),u=parseInt(_.substring(d,d+m),f);8>m?(m=E(Math.pow(f,m)),v=v.j(m).add(E(u))):(v=v.j(g),v=v.add(E(u)))}return v}var k=y(0),I=y(1),x=y(16777216);i=l.prototype,i.m=function(){if($(this))return-M(this).m();for(var _=0,f=1,g=0;g<this.g.length;g++){var v=this.i(g);_+=(0<=v?v:4294967296+v)*f,f*=4294967296}return _},i.toString=function(_){if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(P(this))return"0";if($(this))return"-"+M(this).toString(_);for(var f=E(Math.pow(_,6)),g=this,v="";;){var d=ge(g,f).g;g=Ae(g,d.j(f));var m=((0<g.g.length?g.g[0]:g.h)>>>0).toString(_);if(g=d,P(g))return m+v;for(;6>m.length;)m="0"+m;v=m+v}},i.i=function(_){return 0>_?0:_<this.g.length?this.g[_]:this.h};function P(_){if(_.h!=0)return!1;for(var f=0;f<_.g.length;f++)if(_.g[f]!=0)return!1;return!0}function $(_){return _.h==-1}i.l=function(_){return _=Ae(this,_),$(_)?-1:P(_)?0:1};function M(_){for(var f=_.g.length,g=[],v=0;v<f;v++)g[v]=~_.g[v];return new l(g,~_.h).add(I)}i.abs=function(){return $(this)?M(this):this},i.add=function(_){for(var f=Math.max(this.g.length,_.g.length),g=[],v=0,d=0;d<=f;d++){var m=v+(this.i(d)&65535)+(_.i(d)&65535),u=(m>>>16)+(this.i(d)>>>16)+(_.i(d)>>>16);v=u>>>16,m&=65535,u&=65535,g[d]=u<<16|m}return new l(g,g[g.length-1]&-2147483648?-1:0)};function Ae(_,f){return _.add(M(f))}i.j=function(_){if(P(this)||P(_))return k;if($(this))return $(_)?M(this).j(M(_)):M(M(this).j(_));if($(_))return M(this.j(M(_)));if(0>this.l(x)&&0>_.l(x))return E(this.m()*_.m());for(var f=this.g.length+_.g.length,g=[],v=0;v<2*f;v++)g[v]=0;for(v=0;v<this.g.length;v++)for(var d=0;d<_.g.length;d++){var m=this.i(v)>>>16,u=this.i(v)&65535,C=_.i(d)>>>16,G=_.i(d)&65535;g[2*v+2*d]+=u*G,he(g,2*v+2*d),g[2*v+2*d+1]+=m*G,he(g,2*v+2*d+1),g[2*v+2*d+1]+=u*C,he(g,2*v+2*d+1),g[2*v+2*d+2]+=m*C,he(g,2*v+2*d+2)}for(v=0;v<f;v++)g[v]=g[2*v+1]<<16|g[2*v];for(v=f;v<2*f;v++)g[v]=0;return new l(g,0)};function he(_,f){for(;(_[f]&65535)!=_[f];)_[f+1]+=_[f]>>>16,_[f]&=65535,f++}function Z(_,f){this.g=_,this.h=f}function ge(_,f){if(P(f))throw Error("division by zero");if(P(_))return new Z(k,k);if($(_))return f=ge(M(_),f),new Z(M(f.g),M(f.h));if($(f))return f=ge(_,M(f)),new Z(M(f.g),f.h);if(30<_.g.length){if($(_)||$(f))throw Error("slowDivide_ only works with positive integers.");for(var g=I,v=f;0>=v.l(_);)g=tt(g),v=tt(v);var d=F(g,1),m=F(v,1);for(v=F(v,2),g=F(g,2);!P(v);){var u=m.add(v);0>=u.l(_)&&(d=d.add(g),m=u),v=F(v,1),g=F(g,1)}return f=Ae(_,d.j(f)),new Z(d,f)}for(d=k;0<=_.l(f);){for(g=Math.max(1,Math.floor(_.m()/f.m())),v=Math.ceil(Math.log(g)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),m=E(g),u=m.j(f);$(u)||0<u.l(_);)g-=v,m=E(g),u=m.j(f);P(m)&&(m=I),d=d.add(m),_=Ae(_,u)}return new Z(d,_)}i.A=function(_){return ge(this,_).h},i.and=function(_){for(var f=Math.max(this.g.length,_.g.length),g=[],v=0;v<f;v++)g[v]=this.i(v)&_.i(v);return new l(g,this.h&_.h)},i.or=function(_){for(var f=Math.max(this.g.length,_.g.length),g=[],v=0;v<f;v++)g[v]=this.i(v)|_.i(v);return new l(g,this.h|_.h)},i.xor=function(_){for(var f=Math.max(this.g.length,_.g.length),g=[],v=0;v<f;v++)g[v]=this.i(v)^_.i(v);return new l(g,this.h^_.h)};function tt(_){for(var f=_.g.length+1,g=[],v=0;v<f;v++)g[v]=_.i(v)<<1|_.i(v-1)>>>31;return new l(g,_.h)}function F(_,f){var g=f>>5;f%=32;for(var v=_.g.length-g,d=[],m=0;m<v;m++)d[m]=0<f?_.i(m+g)>>>f|_.i(m+g+1)<<32-f:_.i(m+g);return new l(d,_.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=E,l.fromString=A,Wi=l}).apply(typeof zs<"u"?zs:typeof self<"u"?self:typeof window<"u"?window:{});var Xn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(n,o,c){return n==Array.prototype||n==Object.prototype||(n[o]=c.value),n};function t(n){n=[typeof globalThis=="object"&&globalThis,n,typeof window=="object"&&window,typeof self=="object"&&self,typeof Xn=="object"&&Xn];for(var o=0;o<n.length;++o){var c=n[o];if(c&&c.Math==Math)return c}throw Error("Cannot find global object")}var r=t(this);function s(n,o){if(o)e:{var c=r;n=n.split(".");for(var h=0;h<n.length-1;h++){var w=n[h];if(!(w in c))break e;c=c[w]}n=n[n.length-1],h=c[n],o=o(h),o!=h&&o!=null&&e(c,n,{configurable:!0,writable:!0,value:o})}}function a(n,o){n instanceof String&&(n+="");var c=0,h=!1,w={next:function(){if(!h&&c<n.length){var b=c++;return{value:o(b,n[b]),done:!1}}return h=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}s("Array.prototype.values",function(n){return n||function(){return a(this,function(o,c){return c})}});/** @license

   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */var l=l||{},p=this||self;function y(n){var o=typeof n;return o=o!="object"?o:n?Array.isArray(n)?"array":o:"null",o=="array"||o=="object"&&typeof n.length=="number"}function E(n){var o=typeof n;return o=="object"&&n!=null||o=="function"}function A(n,o,c){return n.call.apply(n.bind,arguments)}function k(n,o,c){if(!n)throw Error();if(2<arguments.length){var h=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,h),n.apply(o,w)}}return function(){return n.apply(o,arguments)}}function I(n,o,c){return I=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?A:k,I.apply(null,arguments)}function x(n,o){var c=Array.prototype.slice.call(arguments,1);return function(){var h=c.slice();return h.push.apply(h,arguments),n.apply(this,h)}}function P(n,o){function c(){}c.prototype=o.prototype,n.aa=o.prototype,n.prototype=new c,n.prototype.constructor=n,n.Qb=function(h,w,b){for(var S=Array(arguments.length-2),Q=2;Q<arguments.length;Q++)S[Q-2]=arguments[Q];return o.prototype[w].apply(h,S)}}function $(n){const o=n.length;if(0<o){const c=Array(o);for(let h=0;h<o;h++)c[h]=n[h];return c}return[]}function M(n,o){for(let c=1;c<arguments.length;c++){const h=arguments[c];if(y(h)){const w=n.length||0,b=h.length||0;n.length=w+b;for(let S=0;S<b;S++)n[w+S]=h[S]}else n.push(h)}}class Ae{constructor(o,c){this.i=o,this.j=c,this.h=0,this.g=null}get(){let o;return 0<this.h?(this.h--,o=this.g,this.g=o.next,o.next=null):o=this.i(),o}}function he(n){return/^[\s\xa0]*$/.test(n)}function Z(){var n=p.navigator;return n&&(n=n.userAgent)?n:""}function ge(n){return ge[" "](n),n}ge[" "]=function(){};var tt=Z().indexOf("Gecko")!=-1&&!(Z().toLowerCase().indexOf("webkit")!=-1&&Z().indexOf("Edge")==-1)&&!(Z().indexOf("Trident")!=-1||Z().indexOf("MSIE")!=-1)&&Z().indexOf("Edge")==-1;function F(n,o,c){for(const h in n)o.call(c,n[h],h,n)}function _(n,o){for(const c in n)o.call(void 0,n[c],c,n)}function f(n){const o={};for(const c in n)o[c]=n[c];return o}const g="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(n,o){let c,h;for(let w=1;w<arguments.length;w++){h=arguments[w];for(c in h)n[c]=h[c];for(let b=0;b<g.length;b++)c=g[b],Object.prototype.hasOwnProperty.call(h,c)&&(n[c]=h[c])}}function d(n){var o=1;n=n.split(":");const c=[];for(;0<o&&n.length;)c.push(n.shift()),o--;return n.length&&c.push(n.join(":")),c}function m(n){p.setTimeout(()=>{throw n},0)}function u(){var n=N;let o=null;return n.g&&(o=n.g,n.g=n.g.next,n.g||(n.h=null),o.next=null),o}class C{constructor(){this.h=this.g=null}add(o,c){const h=G.get();h.set(o,c),this.h?this.h.next=h:this.g=h,this.h=h}}var G=new Ae(()=>new te,n=>n.reset());class te{constructor(){this.next=this.g=this.h=null}set(o,c){this.h=o,this.g=c,this.next=null}reset(){this.next=this.g=this.h=null}}let ue,de=!1,N=new C,xe=()=>{const n=p.Promise.resolve(void 0);ue=()=>{n.then(Ue)}};var Ue=()=>{for(var n;n=u();){try{n.h.call(n.g)}catch(c){m(c)}var o=G;o.j(n),100>o.h&&(o.h++,n.next=o.g,o.g=n)}de=!1};function _e(){this.s=this.s,this.C=this.C}_e.prototype.s=!1,_e.prototype.ma=function(){this.s||(this.s=!0,this.N())},_e.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function D(n,o){this.type=n,this.g=this.target=o,this.defaultPrevented=!1}D.prototype.h=function(){this.defaultPrevented=!0};var fe=function(){if(!p.addEventListener||!Object.defineProperty)return!1;var n=!1,o=Object.defineProperty({},"passive",{get:function(){n=!0}});try{const c=()=>{};p.addEventListener("test",c,o),p.removeEventListener("test",c,o)}catch{}return n}();function L(n,o){if(D.call(this,n?n.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,n){var c=this.type=n.type,h=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:null;if(this.target=n.target||n.srcElement,this.g=o,o=n.relatedTarget){if(tt){e:{try{ge(o.nodeName);var w=!0;break e}catch{}w=!1}w||(o=null)}}else c=="mouseover"?o=n.fromElement:c=="mouseout"&&(o=n.toElement);this.relatedTarget=o,h?(this.clientX=h.clientX!==void 0?h.clientX:h.pageX,this.clientY=h.clientY!==void 0?h.clientY:h.pageY,this.screenX=h.screenX||0,this.screenY=h.screenY||0):(this.clientX=n.clientX!==void 0?n.clientX:n.pageX,this.clientY=n.clientY!==void 0?n.clientY:n.pageY,this.screenX=n.screenX||0,this.screenY=n.screenY||0),this.button=n.button,this.key=n.key||"",this.ctrlKey=n.ctrlKey,this.altKey=n.altKey,this.shiftKey=n.shiftKey,this.metaKey=n.metaKey,this.pointerId=n.pointerId||0,this.pointerType=typeof n.pointerType=="string"?n.pointerType:J[n.pointerType]||"",this.state=n.state,this.i=n,n.defaultPrevented&&L.aa.h.call(this)}}P(L,D);var J={2:"touch",3:"pen",4:"mouse"};L.prototype.h=function(){L.aa.h.call(this);var n=this.i;n.preventDefault?n.preventDefault():n.returnValue=!1};var X="closure_listenable_"+(1e6*Math.random()|0),se=0;function ie(n,o,c,h,w){this.listener=n,this.proxy=null,this.src=o,this.type=c,this.capture=!!h,this.ha=w,this.key=++se,this.da=this.fa=!1}function Pe(n){n.da=!0,n.listener=null,n.proxy=null,n.src=null,n.ha=null}function St(n){this.src=n,this.g={},this.h=0}St.prototype.add=function(n,o,c,h,w){var b=n.toString();n=this.g[b],n||(n=this.g[b]=[],this.h++);var S=Jt(n,o,h,w);return-1<S?(o=n[S],c||(o.fa=!1)):(o=new ie(o,this.src,b,!!h,w),o.fa=c,n.push(o)),o};function Kt(n,o){var c=o.type;if(c in n.g){var h=n.g[c],w=Array.prototype.indexOf.call(h,o,void 0),b;(b=0<=w)&&Array.prototype.splice.call(h,w,1),b&&(Pe(o),n.g[c].length==0&&(delete n.g[c],n.h--))}}function Jt(n,o,c,h){for(var w=0;w<n.length;++w){var b=n[w];if(!b.da&&b.listener==o&&b.capture==!!c&&b.ha==h)return w}return-1}var U="closure_lm_"+(1e6*Math.random()|0),re={};function Y(n,o,c,h,w){if(Array.isArray(o)){for(var b=0;b<o.length;b++)Y(n,o[b],c,h,w);return null}return c=Ge(c),n&&n[X]?n.K(o,c,E(h)?!!h.capture:!1,w):O(n,o,c,!1,h,w)}function O(n,o,c,h,w,b){if(!o)throw Error("Invalid event type");var S=E(w)?!!w.capture:!!w,Q=ae(n);if(Q||(n[U]=Q=new St(n)),c=Q.add(o,c,h,S,b),c.proxy)return c;if(h=q(),c.proxy=h,h.src=n,h.listener=c,n.addEventListener)fe||(w=S),w===void 0&&(w=!1),n.addEventListener(o.toString(),h,w);else if(n.attachEvent)n.attachEvent(me(o.toString()),h);else if(n.addListener&&n.removeListener)n.addListener(h);else throw Error("addEventListener and attachEvent are unavailable.");return c}function q(){function n(c){return o.call(n.src,n.listener,c)}const o=V;return n}function oe(n,o,c,h,w){if(Array.isArray(o))for(var b=0;b<o.length;b++)oe(n,o[b],c,h,w);else h=E(h)?!!h.capture:!!h,c=Ge(c),n&&n[X]?(n=n.i,o=String(o).toString(),o in n.g&&(b=n.g[o],c=Jt(b,c,h,w),-1<c&&(Pe(b[c]),Array.prototype.splice.call(b,c,1),b.length==0&&(delete n.g[o],n.h--)))):n&&(n=ae(n))&&(o=n.g[o.toString()],n=-1,o&&(n=Jt(o,c,h,w)),(c=-1<n?o[n]:null)&&ye(c))}function ye(n){if(typeof n!="number"&&n&&!n.da){var o=n.src;if(o&&o[X])Kt(o.i,n);else{var c=n.type,h=n.proxy;o.removeEventListener?o.removeEventListener(c,h,n.capture):o.detachEvent?o.detachEvent(me(c),h):o.addListener&&o.removeListener&&o.removeListener(h),(c=ae(o))?(Kt(c,n),c.h==0&&(c.src=null,o[U]=null)):Pe(n)}}}function me(n){return n in re?re[n]:re[n]="on"+n}function V(n,o){if(n.da)n=!0;else{o=new L(o,this);var c=n.listener,h=n.ha||n.src;n.fa&&ye(n),n=c.call(h,o)}return n}function ae(n){return n=n[U],n instanceof St?n:null}var K="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ge(n){return typeof n=="function"?n:(n[K]||(n[K]=function(o){return n.handleEvent(o)}),n[K])}function pe(){_e.call(this),this.i=new St(this),this.M=this,this.F=null}P(pe,_e),pe.prototype[X]=!0,pe.prototype.removeEventListener=function(n,o,c,h){oe(this,n,o,c,h)};function Se(n,o){var c,h=n.F;if(h)for(c=[];h;h=h.F)c.push(h);if(n=n.M,h=o.type||o,typeof o=="string")o=new D(o,n);else if(o instanceof D)o.target=o.target||n;else{var w=o;o=new D(h,n),v(o,w)}if(w=!0,c)for(var b=c.length-1;0<=b;b--){var S=o.g=c[b];w=ni(S,h,!0,o)&&w}if(S=o.g=n,w=ni(S,h,!0,o)&&w,w=ni(S,h,!1,o)&&w,c)for(b=0;b<c.length;b++)S=o.g=c[b],w=ni(S,h,!1,o)&&w}pe.prototype.N=function(){if(pe.aa.N.call(this),this.i){var n=this.i,o;for(o in n.g){for(var c=n.g[o],h=0;h<c.length;h++)Pe(c[h]);delete n.g[o],n.h--}}this.F=null},pe.prototype.K=function(n,o,c,h){return this.i.add(String(n),o,!1,c,h)},pe.prototype.L=function(n,o,c,h){return this.i.add(String(n),o,!0,c,h)};function ni(n,o,c,h){if(o=n.i.g[String(o)],!o)return!0;o=o.concat();for(var w=!0,b=0;b<o.length;++b){var S=o[b];if(S&&!S.da&&S.capture==c){var Q=S.listener,ve=S.ha||S.src;S.fa&&Kt(n.i,S),w=Q.call(ve,h)!==!1&&w}}return w&&!h.defaultPrevented}function No(n,o,c){if(typeof n=="function")c&&(n=I(n,c));else if(n&&typeof n.handleEvent=="function")n=I(n.handleEvent,n);else throw Error("Invalid listener argument");return 2147483647<Number(o)?-1:p.setTimeout(n,o||0)}function Oo(n){n.g=No(()=>{n.g=null,n.i&&(n.i=!1,Oo(n))},n.l);const o=n.h;n.h=null,n.m.apply(null,o)}class Ad extends _e{constructor(o,c){super(),this.m=o,this.l=c,this.h=null,this.i=!1,this.g=null}j(o){this.h=arguments,this.g?this.i=!0:Oo(this)}N(){super.N(),this.g&&(p.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Tn(n){_e.call(this),this.h=n,this.g={}}P(Tn,_e);var Do=[];function Lo(n){F(n.g,function(o,c){this.g.hasOwnProperty(c)&&ye(o)},n),n.g={}}Tn.prototype.N=function(){Tn.aa.N.call(this),Lo(this)},Tn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var nr=p.JSON.stringify,Sd=p.JSON.parse,kd=class{stringify(n){return p.JSON.stringify(n,void 0)}parse(n){return p.JSON.parse(n,void 0)}};function ir(){}ir.prototype.h=null;function Mo(n){return n.h||(n.h=n.i())}function Cd(){}var In={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function rr(){D.call(this,"d")}P(rr,D);function sr(){D.call(this,"c")}P(sr,D);var Xt={},Uo=null;function or(){return Uo=Uo||new pe}Xt.La="serverreachability";function $o(n){D.call(this,Xt.La,n)}P($o,D);function An(n){const o=or();Se(o,new $o(o))}Xt.STAT_EVENT="statevent";function Fo(n,o){D.call(this,Xt.STAT_EVENT,n),this.stat=o}P(Fo,D);function ke(n){const o=or();Se(o,new Fo(o,n))}Xt.Ma="timingevent";function Vo(n,o){D.call(this,Xt.Ma,n),this.size=o}P(Vo,D);function Sn(n,o){if(typeof n!="function")throw Error("Fn must not be null and must be a function");return p.setTimeout(function(){n()},o)}function kn(){this.g=!0}kn.prototype.xa=function(){this.g=!1};function xd(n,o,c,h,w,b){n.info(function(){if(n.g)if(b)for(var S="",Q=b.split("&"),ve=0;ve<Q.length;ve++){var z=Q[ve].split("=");if(1<z.length){var we=z[0];z=z[1];var Ee=we.split("_");S=2<=Ee.length&&Ee[1]=="type"?S+(we+"="+z+"&"):S+(we+"=redacted&")}}else S=null;else S=b;return"XMLHTTP REQ ("+h+") [attempt "+w+"]: "+o+`
`+c+`
`+S})}function Pd(n,o,c,h,w,b,S){n.info(function(){return"XMLHTTP RESP ("+h+") [ attempt "+w+"]: "+o+`
`+c+`
`+b+" "+S})}function Yt(n,o,c,h){n.info(function(){return"XMLHTTP TEXT ("+o+"): "+Nd(n,c)+(h?" "+h:"")})}function Rd(n,o){n.info(function(){return"TIMEOUT: "+o})}kn.prototype.info=function(){};function Nd(n,o){if(!n.g)return o;if(!o)return null;try{var c=JSON.parse(o);if(c){for(n=0;n<c.length;n++)if(Array.isArray(c[n])){var h=c[n];if(!(2>h.length)){var w=h[1];if(Array.isArray(w)&&!(1>w.length)){var b=w[0];if(b!="noop"&&b!="stop"&&b!="close")for(var S=1;S<w.length;S++)w[S]=""}}}}return nr(c)}catch{return o}}var ar={NO_ERROR:0,TIMEOUT:8},Od={},cr;function ii(){}P(ii,ir),ii.prototype.g=function(){return new XMLHttpRequest},ii.prototype.i=function(){return{}},cr=new ii;function ft(n,o,c,h){this.j=n,this.i=o,this.l=c,this.R=h||1,this.U=new Tn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new jo}function jo(){this.i=null,this.g="",this.h=!1}var Bo={},lr={};function hr(n,o,c){n.L=1,n.v=ai(nt(o)),n.m=c,n.P=!0,Ho(n,null)}function Ho(n,o){n.F=Date.now(),ri(n),n.A=nt(n.v);var c=n.A,h=n.R;Array.isArray(h)||(h=[String(h)]),ia(c.i,"t",h),n.C=0,c=n.j.J,n.h=new jo,n.g=Ea(n.j,c?o:null,!n.m),0<n.O&&(n.M=new Ad(I(n.Y,n,n.g),n.O)),o=n.U,c=n.g,h=n.ca;var w="readystatechange";Array.isArray(w)||(w&&(Do[0]=w.toString()),w=Do);for(var b=0;b<w.length;b++){var S=Y(c,w[b],h||o.handleEvent,!1,o.h||o);if(!S)break;o.g[S.key]=S}o=n.H?f(n.H):{},n.m?(n.u||(n.u="POST"),o["Content-Type"]="application/x-www-form-urlencoded",n.g.ea(n.A,n.u,n.m,o)):(n.u="GET",n.g.ea(n.A,n.u,null,o)),An(),xd(n.i,n.u,n.A,n.l,n.R,n.m)}ft.prototype.ca=function(n){n=n.target;const o=this.M;o&&it(n)==3?o.j():this.Y(n)},ft.prototype.Y=function(n){try{if(n==this.g)e:{const Ee=it(this.g);var o=this.g.Ba();const en=this.g.Z();if(!(3>Ee)&&(Ee!=3||this.g&&(this.h.h||this.g.oa()||ha(this.g)))){this.J||Ee!=4||o==7||(o==8||0>=en?An(3):An(2)),ur(this);var c=this.g.Z();this.X=c;t:if(zo(this)){var h=ha(this.g);n="";var w=h.length,b=it(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){kt(this),Cn(this);var S="";break t}this.h.i=new p.TextDecoder}for(o=0;o<w;o++)this.h.h=!0,n+=this.h.i.decode(h[o],{stream:!(b&&o==w-1)});h.length=0,this.h.g+=n,this.C=0,S=this.h.g}else S=this.g.oa();if(this.o=c==200,Pd(this.i,this.u,this.A,this.l,this.R,Ee,c),this.o){if(this.T&&!this.K){t:{if(this.g){var Q,ve=this.g;if((Q=ve.g?ve.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!he(Q)){var z=Q;break t}}z=null}if(c=z)Yt(this.i,this.l,c,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,dr(this,c);else{this.o=!1,this.s=3,ke(12),kt(this),Cn(this);break e}}if(this.P){c=!0;let $e;for(;!this.J&&this.C<S.length;)if($e=Dd(this,S),$e==lr){Ee==4&&(this.s=4,ke(14),c=!1),Yt(this.i,this.l,null,"[Incomplete Response]");break}else if($e==Bo){this.s=4,ke(15),Yt(this.i,this.l,S,"[Invalid Chunk]"),c=!1;break}else Yt(this.i,this.l,$e,null),dr(this,$e);if(zo(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ee!=4||S.length!=0||this.h.h||(this.s=1,ke(16),c=!1),this.o=this.o&&c,!c)Yt(this.i,this.l,S,"[Invalid Chunked Response]"),kt(this),Cn(this);else if(0<S.length&&!this.W){this.W=!0;var we=this.j;we.g==this&&we.ba&&!we.M&&(we.j.info("Great, no buffering proxy detected. Bytes received: "+S.length),vr(we),we.M=!0,ke(11))}}else Yt(this.i,this.l,S,null),dr(this,S);Ee==4&&kt(this),this.o&&!this.J&&(Ee==4?ya(this.j,this):(this.o=!1,ri(this)))}else Yd(this.g),c==400&&0<S.indexOf("Unknown SID")?(this.s=3,ke(12)):(this.s=0,ke(13)),kt(this),Cn(this)}}}catch{}finally{}};function zo(n){return n.g?n.u=="GET"&&n.L!=2&&n.j.Ca:!1}function Dd(n,o){var c=n.C,h=o.indexOf(`
`,c);return h==-1?lr:(c=Number(o.substring(c,h)),isNaN(c)?Bo:(h+=1,h+c>o.length?lr:(o=o.slice(h,h+c),n.C=h+c,o)))}ft.prototype.cancel=function(){this.J=!0,kt(this)};function ri(n){n.S=Date.now()+n.I,Wo(n,n.I)}function Wo(n,o){if(n.B!=null)throw Error("WatchDog timer not null");n.B=Sn(I(n.ba,n),o)}function ur(n){n.B&&(p.clearTimeout(n.B),n.B=null)}ft.prototype.ba=function(){this.B=null;const n=Date.now();0<=n-this.S?(Rd(this.i,this.A),this.L!=2&&(An(),ke(17)),kt(this),this.s=2,Cn(this)):Wo(this,this.S-n)};function Cn(n){n.j.G==0||n.J||ya(n.j,n)}function kt(n){ur(n);var o=n.M;o&&typeof o.ma=="function"&&o.ma(),n.M=null,Lo(n.U),n.g&&(o=n.g,n.g=null,o.abort(),o.ma())}function dr(n,o){try{var c=n.j;if(c.G!=0&&(c.g==n||fr(c.h,n))){if(!n.K&&fr(c.h,n)&&c.G==3){try{var h=c.Da.g.parse(o)}catch{h=null}if(Array.isArray(h)&&h.length==3){var w=h;if(w[0]==0){e:if(!c.u){if(c.g)if(c.g.F+3e3<n.F)fi(c),ui(c);else break e;yr(c),ke(18)}}else c.za=w[1],0<c.za-c.T&&37500>w[2]&&c.F&&c.v==0&&!c.C&&(c.C=Sn(I(c.Za,c),6e3));if(1>=Ko(c.h)&&c.ca){try{c.ca()}catch{}c.ca=void 0}}else xt(c,11)}else if((n.K||c.g==n)&&fi(c),!he(o))for(w=c.Da.g.parse(o),o=0;o<w.length;o++){let z=w[o];if(c.T=z[0],z=z[1],c.G==2)if(z[0]=="c"){c.K=z[1],c.ia=z[2];const we=z[3];we!=null&&(c.la=we,c.j.info("VER="+c.la));const Ee=z[4];Ee!=null&&(c.Aa=Ee,c.j.info("SVER="+c.Aa));const en=z[5];en!=null&&typeof en=="number"&&0<en&&(h=1.5*en,c.L=h,c.j.info("backChannelRequestTimeoutMs_="+h)),h=c;const $e=n.g;if($e){const pi=$e.g?$e.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(pi){var b=h.h;b.g||pi.indexOf("spdy")==-1&&pi.indexOf("quic")==-1&&pi.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(pr(b,b.h),b.h=null))}if(h.D){const _r=$e.g?$e.g.getResponseHeader("X-HTTP-Session-Id"):null;_r&&(h.ya=_r,ee(h.I,h.D,_r))}}c.G=3,c.l&&c.l.ua(),c.ba&&(c.R=Date.now()-n.F,c.j.info("Handshake RTT: "+c.R+"ms")),h=c;var S=n;if(h.qa=wa(h,h.J?h.ia:null,h.W),S.K){Jo(h.h,S);var Q=S,ve=h.L;ve&&(Q.I=ve),Q.B&&(ur(Q),ri(Q)),h.g=S}else ga(h);0<c.i.length&&di(c)}else z[0]!="stop"&&z[0]!="close"||xt(c,7);else c.G==3&&(z[0]=="stop"||z[0]=="close"?z[0]=="stop"?xt(c,7):mr(c):z[0]!="noop"&&c.l&&c.l.ta(z),c.v=0)}}An(4)}catch{}}var Ld=class{constructor(n,o){this.g=n,this.map=o}};function Go(n){this.l=n||10,p.PerformanceNavigationTiming?(n=p.performance.getEntriesByType("navigation"),n=0<n.length&&(n[0].nextHopProtocol=="hq"||n[0].nextHopProtocol=="h2")):n=!!(p.chrome&&p.chrome.loadTimes&&p.chrome.loadTimes()&&p.chrome.loadTimes().wasFetchedViaSpdy),this.j=n?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function qo(n){return n.h?!0:n.g?n.g.size>=n.j:!1}function Ko(n){return n.h?1:n.g?n.g.size:0}function fr(n,o){return n.h?n.h==o:n.g?n.g.has(o):!1}function pr(n,o){n.g?n.g.add(o):n.h=o}function Jo(n,o){n.h&&n.h==o?n.h=null:n.g&&n.g.has(o)&&n.g.delete(o)}Go.prototype.cancel=function(){if(this.i=Xo(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const n of this.g.values())n.cancel();this.g.clear()}};function Xo(n){if(n.h!=null)return n.i.concat(n.h.D);if(n.g!=null&&n.g.size!==0){let o=n.i;for(const c of n.g.values())o=o.concat(c.D);return o}return $(n.i)}function Md(n){if(n.V&&typeof n.V=="function")return n.V();if(typeof Map<"u"&&n instanceof Map||typeof Set<"u"&&n instanceof Set)return Array.from(n.values());if(typeof n=="string")return n.split("");if(y(n)){for(var o=[],c=n.length,h=0;h<c;h++)o.push(n[h]);return o}o=[],c=0;for(h in n)o[c++]=n[h];return o}function Ud(n){if(n.na&&typeof n.na=="function")return n.na();if(!n.V||typeof n.V!="function"){if(typeof Map<"u"&&n instanceof Map)return Array.from(n.keys());if(!(typeof Set<"u"&&n instanceof Set)){if(y(n)||typeof n=="string"){var o=[];n=n.length;for(var c=0;c<n;c++)o.push(c);return o}o=[],c=0;for(const h in n)o[c++]=h;return o}}}function Yo(n,o){if(n.forEach&&typeof n.forEach=="function")n.forEach(o,void 0);else if(y(n)||typeof n=="string")Array.prototype.forEach.call(n,o,void 0);else for(var c=Ud(n),h=Md(n),w=h.length,b=0;b<w;b++)o.call(void 0,h[b],c&&c[b],n)}var Qo=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function $d(n,o){if(n){n=n.split("&");for(var c=0;c<n.length;c++){var h=n[c].indexOf("="),w=null;if(0<=h){var b=n[c].substring(0,h);w=n[c].substring(h+1)}else b=n[c];o(b,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function Ct(n){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,n instanceof Ct){this.h=n.h,si(this,n.j),this.o=n.o,this.g=n.g,oi(this,n.s),this.l=n.l;var o=n.i,c=new Rn;c.i=o.i,o.g&&(c.g=new Map(o.g),c.h=o.h),Zo(this,c),this.m=n.m}else n&&(o=String(n).match(Qo))?(this.h=!1,si(this,o[1]||"",!0),this.o=xn(o[2]||""),this.g=xn(o[3]||"",!0),oi(this,o[4]),this.l=xn(o[5]||"",!0),Zo(this,o[6]||"",!0),this.m=xn(o[7]||"")):(this.h=!1,this.i=new Rn(null,this.h))}Ct.prototype.toString=function(){var n=[],o=this.j;o&&n.push(Pn(o,ea,!0),":");var c=this.g;return(c||o=="file")&&(n.push("//"),(o=this.o)&&n.push(Pn(o,ea,!0),"@"),n.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.s,c!=null&&n.push(":",String(c))),(c=this.l)&&(this.g&&c.charAt(0)!="/"&&n.push("/"),n.push(Pn(c,c.charAt(0)=="/"?jd:Vd,!0))),(c=this.i.toString())&&n.push("?",c),(c=this.m)&&n.push("#",Pn(c,Hd)),n.join("")};function nt(n){return new Ct(n)}function si(n,o,c){n.j=c?xn(o,!0):o,n.j&&(n.j=n.j.replace(/:$/,""))}function oi(n,o){if(o){if(o=Number(o),isNaN(o)||0>o)throw Error("Bad port number "+o);n.s=o}else n.s=null}function Zo(n,o,c){o instanceof Rn?(n.i=o,zd(n.i,n.h)):(c||(o=Pn(o,Bd)),n.i=new Rn(o,n.h))}function ee(n,o,c){n.i.set(o,c)}function ai(n){return ee(n,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),n}function xn(n,o){return n?o?decodeURI(n.replace(/%25/g,"%2525")):decodeURIComponent(n):""}function Pn(n,o,c){return typeof n=="string"?(n=encodeURI(n).replace(o,Fd),c&&(n=n.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n):null}function Fd(n){return n=n.charCodeAt(0),"%"+(n>>4&15).toString(16)+(n&15).toString(16)}var ea=/[#\/\?@]/g,Vd=/[#\?:]/g,jd=/[#\?]/g,Bd=/[#\?@]/g,Hd=/#/g;function Rn(n,o){this.h=this.g=null,this.i=n||null,this.j=!!o}function pt(n){n.g||(n.g=new Map,n.h=0,n.i&&$d(n.i,function(o,c){n.add(decodeURIComponent(o.replace(/\+/g," ")),c)}))}i=Rn.prototype,i.add=function(n,o){pt(this),this.i=null,n=Qt(this,n);var c=this.g.get(n);return c||this.g.set(n,c=[]),c.push(o),this.h+=1,this};function ta(n,o){pt(n),o=Qt(n,o),n.g.has(o)&&(n.i=null,n.h-=n.g.get(o).length,n.g.delete(o))}function na(n,o){return pt(n),o=Qt(n,o),n.g.has(o)}i.forEach=function(n,o){pt(this),this.g.forEach(function(c,h){c.forEach(function(w){n.call(o,w,h,this)},this)},this)},i.na=function(){pt(this);const n=Array.from(this.g.values()),o=Array.from(this.g.keys()),c=[];for(let h=0;h<o.length;h++){const w=n[h];for(let b=0;b<w.length;b++)c.push(o[h])}return c},i.V=function(n){pt(this);let o=[];if(typeof n=="string")na(this,n)&&(o=o.concat(this.g.get(Qt(this,n))));else{n=Array.from(this.g.values());for(let c=0;c<n.length;c++)o=o.concat(n[c])}return o},i.set=function(n,o){return pt(this),this.i=null,n=Qt(this,n),na(this,n)&&(this.h-=this.g.get(n).length),this.g.set(n,[o]),this.h+=1,this},i.get=function(n,o){return n?(n=this.V(n),0<n.length?String(n[0]):o):o};function ia(n,o,c){ta(n,o),0<c.length&&(n.i=null,n.g.set(Qt(n,o),$(c)),n.h+=c.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const n=[],o=Array.from(this.g.keys());for(var c=0;c<o.length;c++){var h=o[c];const b=encodeURIComponent(String(h)),S=this.V(h);for(h=0;h<S.length;h++){var w=b;S[h]!==""&&(w+="="+encodeURIComponent(String(S[h]))),n.push(w)}}return this.i=n.join("&")};function Qt(n,o){return o=String(o),n.j&&(o=o.toLowerCase()),o}function zd(n,o){o&&!n.j&&(pt(n),n.i=null,n.g.forEach(function(c,h){var w=h.toLowerCase();h!=w&&(ta(this,h),ia(this,w,c))},n)),n.j=o}function Wd(n,o){const c=new kn;if(p.Image){const h=new Image;h.onload=x(gt,c,"TestLoadImage: loaded",!0,o,h),h.onerror=x(gt,c,"TestLoadImage: error",!1,o,h),h.onabort=x(gt,c,"TestLoadImage: abort",!1,o,h),h.ontimeout=x(gt,c,"TestLoadImage: timeout",!1,o,h),p.setTimeout(function(){h.ontimeout&&h.ontimeout()},1e4),h.src=n}else o(!1)}function Gd(n,o){const c=new kn,h=new AbortController,w=setTimeout(()=>{h.abort(),gt(c,"TestPingServer: timeout",!1,o)},1e4);fetch(n,{signal:h.signal}).then(b=>{clearTimeout(w),b.ok?gt(c,"TestPingServer: ok",!0,o):gt(c,"TestPingServer: server error",!1,o)}).catch(()=>{clearTimeout(w),gt(c,"TestPingServer: error",!1,o)})}function gt(n,o,c,h,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),h(c)}catch{}}function qd(){this.g=new kd}function Kd(n,o,c){const h=c||"";try{Yo(n,function(w,b){let S=w;E(w)&&(S=nr(w)),o.push(h+b+"="+encodeURIComponent(S))})}catch(w){throw o.push(h+"type="+encodeURIComponent("_badmap")),w}}function ci(n){this.l=n.Ub||null,this.j=n.eb||!1}P(ci,ir),ci.prototype.g=function(){return new li(this.l,this.j)},ci.prototype.i=function(n){return function(){return n}}({});function li(n,o){pe.call(this),this.D=n,this.o=o,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}P(li,pe),i=li.prototype,i.open=function(n,o){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=n,this.A=o,this.readyState=1,On(this)},i.send=function(n){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const o={headers:this.u,method:this.B,credentials:this.m,cache:void 0};n&&(o.body=n),(this.D||p).fetch(new Request(this.A,o)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Nn(this)),this.readyState=0},i.Sa=function(n){if(this.g&&(this.l=n,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=n.headers,this.readyState=2,On(this)),this.g&&(this.readyState=3,On(this),this.g)))if(this.responseType==="arraybuffer")n.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof p.ReadableStream<"u"&&"body"in n){if(this.j=n.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;ra(this)}else n.text().then(this.Ra.bind(this),this.ga.bind(this))};function ra(n){n.j.read().then(n.Pa.bind(n)).catch(n.ga.bind(n))}i.Pa=function(n){if(this.g){if(this.o&&n.value)this.response.push(n.value);else if(!this.o){var o=n.value?n.value:new Uint8Array(0);(o=this.v.decode(o,{stream:!n.done}))&&(this.response=this.responseText+=o)}n.done?Nn(this):On(this),this.readyState==3&&ra(this)}},i.Ra=function(n){this.g&&(this.response=this.responseText=n,Nn(this))},i.Qa=function(n){this.g&&(this.response=n,Nn(this))},i.ga=function(){this.g&&Nn(this)};function Nn(n){n.readyState=4,n.l=null,n.j=null,n.v=null,On(n)}i.setRequestHeader=function(n,o){this.u.append(n,o)},i.getResponseHeader=function(n){return this.h&&this.h.get(n.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const n=[],o=this.h.entries();for(var c=o.next();!c.done;)c=c.value,n.push(c[0]+": "+c[1]),c=o.next();return n.join(`\r
`)};function On(n){n.onreadystatechange&&n.onreadystatechange.call(n)}Object.defineProperty(li.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(n){this.m=n?"include":"same-origin"}});function sa(n){let o="";return F(n,function(c,h){o+=h,o+=":",o+=c,o+=`\r
`}),o}function gr(n,o,c){e:{for(h in c){var h=!1;break e}h=!0}h||(c=sa(c),typeof n=="string"?c!=null&&encodeURIComponent(String(c)):ee(n,o,c))}function ce(n){pe.call(this),this.headers=new Map,this.o=n||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}P(ce,pe);var Jd=/^https?$/i,Xd=["POST","PUT"];i=ce.prototype,i.Ha=function(n){this.J=n},i.ea=function(n,o,c,h){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+n);o=o?o.toUpperCase():"GET",this.D=n,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():cr.g(),this.v=this.o?Mo(this.o):Mo(cr),this.g.onreadystatechange=I(this.Ea,this);try{this.B=!0,this.g.open(o,String(n),!0),this.B=!1}catch(b){oa(this,b);return}if(n=c||"",c=new Map(this.headers),h)if(Object.getPrototypeOf(h)===Object.prototype)for(var w in h)c.set(w,h[w]);else if(typeof h.keys=="function"&&typeof h.get=="function")for(const b of h.keys())c.set(b,h.get(b));else throw Error("Unknown input type for opt_headers: "+String(h));h=Array.from(c.keys()).find(b=>b.toLowerCase()=="content-type"),w=p.FormData&&n instanceof p.FormData,!(0<=Array.prototype.indexOf.call(Xd,o,void 0))||h||w||c.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,S]of c)this.g.setRequestHeader(b,S);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{la(this),this.u=!0,this.g.send(n),this.u=!1}catch(b){oa(this,b)}};function oa(n,o){n.h=!1,n.g&&(n.j=!0,n.g.abort(),n.j=!1),n.l=o,n.m=5,aa(n),hi(n)}function aa(n){n.A||(n.A=!0,Se(n,"complete"),Se(n,"error"))}i.abort=function(n){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=n||7,Se(this,"complete"),Se(this,"abort"),hi(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),hi(this,!0)),ce.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?ca(this):this.bb())},i.bb=function(){ca(this)};function ca(n){if(n.h&&typeof l<"u"&&(!n.v[1]||it(n)!=4||n.Z()!=2)){if(n.u&&it(n)==4)No(n.Ea,0,n);else if(Se(n,"readystatechange"),it(n)==4){n.h=!1;try{const S=n.Z();e:switch(S){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var o=!0;break e;default:o=!1}var c;if(!(c=o)){var h;if(h=S===0){var w=String(n.D).match(Qo)[1]||null;!w&&p.self&&p.self.location&&(w=p.self.location.protocol.slice(0,-1)),h=!Jd.test(w?w.toLowerCase():"")}c=h}if(c)Se(n,"complete"),Se(n,"success");else{n.m=6;try{var b=2<it(n)?n.g.statusText:""}catch{b=""}n.l=b+" ["+n.Z()+"]",aa(n)}}finally{hi(n)}}}}function hi(n,o){if(n.g){la(n);const c=n.g,h=n.v[0]?()=>{}:null;n.g=null,n.v=null,o||Se(n,"ready");try{c.onreadystatechange=h}catch{}}}function la(n){n.I&&(p.clearTimeout(n.I),n.I=null)}i.isActive=function(){return!!this.g};function it(n){return n.g?n.g.readyState:0}i.Z=function(){try{return 2<it(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(n){if(this.g){var o=this.g.responseText;return n&&o.indexOf(n)==0&&(o=o.substring(n.length)),Sd(o)}};function ha(n){try{if(!n.g)return null;if("response"in n.g)return n.g.response;switch(n.H){case"":case"text":return n.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in n.g)return n.g.mozResponseArrayBuffer}return null}catch{return null}}function Yd(n){const o={};n=(n.g&&2<=it(n)&&n.g.getAllResponseHeaders()||"").split(`\r
`);for(let h=0;h<n.length;h++){if(he(n[h]))continue;var c=d(n[h]);const w=c[0];if(c=c[1],typeof c!="string")continue;c=c.trim();const b=o[w]||[];o[w]=b,b.push(c)}_(o,function(h){return h.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Dn(n,o,c){return c&&c.internalChannelParams&&c.internalChannelParams[n]||o}function ua(n){this.Aa=0,this.i=[],this.j=new kn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Dn("failFast",!1,n),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Dn("baseRetryDelayMs",5e3,n),this.cb=Dn("retryDelaySeedMs",1e4,n),this.Wa=Dn("forwardChannelMaxRetries",2,n),this.wa=Dn("forwardChannelRequestTimeoutMs",2e4,n),this.pa=n&&n.xmlHttpFactory||void 0,this.Xa=n&&n.Tb||void 0,this.Ca=n&&n.useFetchStreams||!1,this.L=void 0,this.J=n&&n.supportsCrossDomainXhr||!1,this.K="",this.h=new Go(n&&n.concurrentRequestLimit),this.Da=new qd,this.P=n&&n.fastHandshake||!1,this.O=n&&n.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=n&&n.Rb||!1,n&&n.xa&&this.j.xa(),n&&n.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&n&&n.detectBufferingProxy||!1,this.ja=void 0,n&&n.longPollingTimeout&&0<n.longPollingTimeout&&(this.ja=n.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=ua.prototype,i.la=8,i.G=1,i.connect=function(n,o,c,h){ke(0),this.W=n,this.H=o||{},c&&h!==void 0&&(this.H.OSID=c,this.H.OAID=h),this.F=this.X,this.I=wa(this,null,this.W),di(this)};function mr(n){if(da(n),n.G==3){var o=n.U++,c=nt(n.I);if(ee(c,"SID",n.K),ee(c,"RID",o),ee(c,"TYPE","terminate"),Ln(n,c),o=new ft(n,n.j,o),o.L=2,o.v=ai(nt(c)),c=!1,p.navigator&&p.navigator.sendBeacon)try{c=p.navigator.sendBeacon(o.v.toString(),"")}catch{}!c&&p.Image&&(new Image().src=o.v,c=!0),c||(o.g=Ea(o.j,null),o.g.ea(o.v)),o.F=Date.now(),ri(o)}_a(n)}function ui(n){n.g&&(vr(n),n.g.cancel(),n.g=null)}function da(n){ui(n),n.u&&(p.clearTimeout(n.u),n.u=null),fi(n),n.h.cancel(),n.s&&(typeof n.s=="number"&&p.clearTimeout(n.s),n.s=null)}function di(n){if(!qo(n.h)&&!n.s){n.s=!0;var o=n.Ga;ue||xe(),de||(ue(),de=!0),N.add(o,n),n.B=0}}function Qd(n,o){return Ko(n.h)>=n.h.j-(n.s?1:0)?!1:n.s?(n.i=o.D.concat(n.i),!0):n.G==1||n.G==2||n.B>=(n.Va?0:n.Wa)?!1:(n.s=Sn(I(n.Ga,n,o),va(n,n.B)),n.B++,!0)}i.Ga=function(n){if(this.s)if(this.s=null,this.G==1){if(!n){this.U=Math.floor(1e5*Math.random()),n=this.U++;const w=new ft(this,this.j,n);let b=this.o;if(this.S&&(b?(b=f(b),v(b,this.S)):b=this.S),this.m!==null||this.O||(w.H=b,b=null),this.P)e:{for(var o=0,c=0;c<this.i.length;c++){t:{var h=this.i[c];if("__data__"in h.map&&(h=h.map.__data__,typeof h=="string")){h=h.length;break t}h=void 0}if(h===void 0)break;if(o+=h,4096<o){o=c;break e}if(o===4096||c===this.i.length-1){o=c+1;break e}}o=1e3}else o=1e3;o=pa(this,w,o),c=nt(this.I),ee(c,"RID",n),ee(c,"CVER",22),this.D&&ee(c,"X-HTTP-Session-Id",this.D),Ln(this,c),b&&(this.O?o="headers="+encodeURIComponent(String(sa(b)))+"&"+o:this.m&&gr(c,this.m,b)),pr(this.h,w),this.Ua&&ee(c,"TYPE","init"),this.P?(ee(c,"$req",o),ee(c,"SID","null"),w.T=!0,hr(w,c,null)):hr(w,c,o),this.G=2}}else this.G==3&&(n?fa(this,n):this.i.length==0||qo(this.h)||fa(this))};function fa(n,o){var c;o?c=o.l:c=n.U++;const h=nt(n.I);ee(h,"SID",n.K),ee(h,"RID",c),ee(h,"AID",n.T),Ln(n,h),n.m&&n.o&&gr(h,n.m,n.o),c=new ft(n,n.j,c,n.B+1),n.m===null&&(c.H=n.o),o&&(n.i=o.D.concat(n.i)),o=pa(n,c,1e3),c.I=Math.round(.5*n.wa)+Math.round(.5*n.wa*Math.random()),pr(n.h,c),hr(c,h,o)}function Ln(n,o){n.H&&F(n.H,function(c,h){ee(o,h,c)}),n.l&&Yo({},function(c,h){ee(o,h,c)})}function pa(n,o,c){c=Math.min(n.i.length,c);var h=n.l?I(n.l.Na,n.l,n):null;e:{var w=n.i;let b=-1;for(;;){const S=["count="+c];b==-1?0<c?(b=w[0].g,S.push("ofs="+b)):b=0:S.push("ofs="+b);let Q=!0;for(let ve=0;ve<c;ve++){let z=w[ve].g;const we=w[ve].map;if(z-=b,0>z)b=Math.max(0,w[ve].g-100),Q=!1;else try{Kd(we,S,"req"+z+"_")}catch{h&&h(we)}}if(Q){h=S.join("&");break e}}}return n=n.i.splice(0,c),o.D=n,h}function ga(n){if(!n.g&&!n.u){n.Y=1;var o=n.Fa;ue||xe(),de||(ue(),de=!0),N.add(o,n),n.v=0}}function yr(n){return n.g||n.u||3<=n.v?!1:(n.Y++,n.u=Sn(I(n.Fa,n),va(n,n.v)),n.v++,!0)}i.Fa=function(){if(this.u=null,ma(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var n=2*this.R;this.j.info("BP detection timer enabled: "+n),this.A=Sn(I(this.ab,this),n)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ke(10),ui(this),ma(this))};function vr(n){n.A!=null&&(p.clearTimeout(n.A),n.A=null)}function ma(n){n.g=new ft(n,n.j,"rpc",n.Y),n.m===null&&(n.g.H=n.o),n.g.O=0;var o=nt(n.qa);ee(o,"RID","rpc"),ee(o,"SID",n.K),ee(o,"AID",n.T),ee(o,"CI",n.F?"0":"1"),!n.F&&n.ja&&ee(o,"TO",n.ja),ee(o,"TYPE","xmlhttp"),Ln(n,o),n.m&&n.o&&gr(o,n.m,n.o),n.L&&(n.g.I=n.L);var c=n.g;n=n.ia,c.L=1,c.v=ai(nt(o)),c.m=null,c.P=!0,Ho(c,n)}i.Za=function(){this.C!=null&&(this.C=null,ui(this),yr(this),ke(19))};function fi(n){n.C!=null&&(p.clearTimeout(n.C),n.C=null)}function ya(n,o){var c=null;if(n.g==o){fi(n),vr(n),n.g=null;var h=2}else if(fr(n.h,o))c=o.D,Jo(n.h,o),h=1;else return;if(n.G!=0){if(o.o)if(h==1){c=o.m?o.m.length:0,o=Date.now()-o.F;var w=n.B;h=or(),Se(h,new Vo(h,c)),di(n)}else ga(n);else if(w=o.s,w==3||w==0&&0<o.X||!(h==1&&Qd(n,o)||h==2&&yr(n)))switch(c&&0<c.length&&(o=n.h,o.i=o.i.concat(c)),w){case 1:xt(n,5);break;case 4:xt(n,10);break;case 3:xt(n,6);break;default:xt(n,2)}}}function va(n,o){let c=n.Ta+Math.floor(Math.random()*n.cb);return n.isActive()||(c*=2),c*o}function xt(n,o){if(n.j.info("Error code "+o),o==2){var c=I(n.fb,n),h=n.Xa;const w=!h;h=new Ct(h||"//www.google.com/images/cleardot.gif"),p.location&&p.location.protocol=="http"||si(h,"https"),ai(h),w?Wd(h.toString(),c):Gd(h.toString(),c)}else ke(2);n.G=0,n.l&&n.l.sa(o),_a(n),da(n)}i.fb=function(n){n?(this.j.info("Successfully pinged google.com"),ke(2)):(this.j.info("Failed to ping google.com"),ke(1))};function _a(n){if(n.G=0,n.ka=[],n.l){const o=Xo(n.h);(o.length!=0||n.i.length!=0)&&(M(n.ka,o),M(n.ka,n.i),n.h.i.length=0,$(n.i),n.i.length=0),n.l.ra()}}function wa(n,o,c){var h=c instanceof Ct?nt(c):new Ct(c);if(h.g!="")o&&(h.g=o+"."+h.g),oi(h,h.s);else{var w=p.location;h=w.protocol,o=o?o+"."+w.hostname:w.hostname,w=+w.port;var b=new Ct(null);h&&si(b,h),o&&(b.g=o),w&&oi(b,w),c&&(b.l=c),h=b}return c=n.D,o=n.ya,c&&o&&ee(h,c,o),ee(h,"VER",n.la),Ln(n,h),h}function Ea(n,o,c){if(o&&!n.J)throw Error("Can't create secondary domain capable XhrIo object.");return o=n.Ca&&!n.pa?new ce(new ci({eb:c})):new ce(n.pa),o.Ha(n.J),o}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function ba(){}i=ba.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function Re(n,o){pe.call(this),this.g=new ua(o),this.l=n,this.h=o&&o.messageUrlParams||null,n=o&&o.messageHeaders||null,o&&o.clientProtocolHeaderRequired&&(n?n["X-Client-Protocol"]="webchannel":n={"X-Client-Protocol":"webchannel"}),this.g.o=n,n=o&&o.initMessageHeaders||null,o&&o.messageContentType&&(n?n["X-WebChannel-Content-Type"]=o.messageContentType:n={"X-WebChannel-Content-Type":o.messageContentType}),o&&o.va&&(n?n["X-WebChannel-Client-Profile"]=o.va:n={"X-WebChannel-Client-Profile":o.va}),this.g.S=n,(n=o&&o.Sb)&&!he(n)&&(this.g.m=n),this.v=o&&o.supportsCrossDomainXhr||!1,this.u=o&&o.sendRawJson||!1,(o=o&&o.httpSessionIdParam)&&!he(o)&&(this.g.D=o,n=this.h,n!==null&&o in n&&(n=this.h,o in n&&delete n[o])),this.j=new Zt(this)}P(Re,pe),Re.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Re.prototype.close=function(){mr(this.g)},Re.prototype.o=function(n){var o=this.g;if(typeof n=="string"){var c={};c.__data__=n,n=c}else this.u&&(c={},c.__data__=nr(n),n=c);o.i.push(new Ld(o.Ya++,n)),o.G==3&&di(o)},Re.prototype.N=function(){this.g.l=null,delete this.j,mr(this.g),delete this.g,Re.aa.N.call(this)};function Ta(n){rr.call(this),n.__headers__&&(this.headers=n.__headers__,this.statusCode=n.__status__,delete n.__headers__,delete n.__status__);var o=n.__sm__;if(o){e:{for(const c in o){n=c;break e}n=void 0}(this.i=n)&&(n=this.i,o=o!==null&&n in o?o[n]:void 0),this.data=o}else this.data=n}P(Ta,rr);function Ia(){sr.call(this),this.status=1}P(Ia,sr);function Zt(n){this.g=n}P(Zt,ba),Zt.prototype.ua=function(){Se(this.g,"a")},Zt.prototype.ta=function(n){Se(this.g,new Ta(n))},Zt.prototype.sa=function(n){Se(this.g,new Ia)},Zt.prototype.ra=function(){Se(this.g,"b")},Re.prototype.send=Re.prototype.o,Re.prototype.open=Re.prototype.m,Re.prototype.close=Re.prototype.close,ar.NO_ERROR=0,ar.TIMEOUT=8,ar.HTTP_ERROR=6,Od.COMPLETE="complete",Cd.EventType=In,In.OPEN="a",In.CLOSE="b",In.ERROR="c",In.MESSAGE="d",pe.prototype.listen=pe.prototype.K,ce.prototype.listenOnce=ce.prototype.L,ce.prototype.getLastError=ce.prototype.Ka,ce.prototype.getLastErrorCode=ce.prototype.Ba,ce.prototype.getStatus=ce.prototype.Z,ce.prototype.getResponseJson=ce.prototype.Oa,ce.prototype.getResponseText=ce.prototype.oa,ce.prototype.send=ce.prototype.ea,ce.prototype.setWithCredentials=ce.prototype.Ha}).apply(typeof Xn<"u"?Xn:typeof self<"u"?self:typeof window<"u"?window:{});const Ws="@firebase/firestore",Gs="4.8.0";/**
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
 */class Ie{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ie.UNAUTHENTICATED=new Ie(null),Ie.GOOGLE_CREDENTIALS=new Ie("google-credentials-uid"),Ie.FIRST_PARTY=new Ie("first-party-uid"),Ie.MOCK_USER=new Ie("mock-user");/**
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
 */let pn="11.10.0";/**
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
 */const Vt=new vi("@firebase/firestore");function Oe(i,...e){if(Vt.logLevel<=W.DEBUG){const t=e.map(Gi);Vt.debug(`Firestore (${pn}): ${i}`,...t)}}function qs(i,...e){if(Vt.logLevel<=W.ERROR){const t=e.map(Gi);Vt.error(`Firestore (${pn}): ${i}`,...t)}}function uu(i,...e){if(Vt.logLevel<=W.WARN){const t=e.map(Gi);Vt.warn(`Firestore (${pn}): ${i}`,...t)}}function Gi(i){if(typeof i=="string")return i;try{/**
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
*/return function(t){return JSON.stringify(t)}(i)}catch{return i}}/**
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
 */function gn(i,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Ks(i,r,t)}function Ks(i,e,t){let r=`FIRESTORE (${pn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${i.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw qs(r),new Error(r)}function mn(i,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,i||Ks(e,s,r)}/**
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
 */const j={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class B extends qe{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class yn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class Js{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class du{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Ie.UNAUTHENTICATED))}shutdown(){}}class fu{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class pu{constructor(e){this.t=e,this.currentUser=Ie.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){mn(this.o===void 0,42304);let r=this.i;const s=y=>this.i!==r?(r=this.i,t(y)):Promise.resolve();let a=new yn;this.o=()=>{this.i++,this.currentUser=this.u(),a.resolve(),a=new yn,e.enqueueRetryable(()=>s(this.currentUser))};const l=()=>{const y=a;e.enqueueRetryable(async()=>{await y.promise,await s(this.currentUser)})},p=y=>{Oe("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=y,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit(y=>p(y)),setTimeout(()=>{if(!this.auth){const y=this.t.getImmediate({optional:!0});y?p(y):(Oe("FirebaseAuthCredentialsProvider","Auth not yet detected"),a.resolve(),a=new yn)}},0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(Oe("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(mn(typeof r.accessToken=="string",31837,{l:r}),new Js(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return mn(e===null||typeof e=="string",2055,{h:e}),new Ie(e)}}class gu{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=Ie.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class mu{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new gu(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(Ie.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Xs{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class yu{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Fe(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){mn(this.o===void 0,3512);const r=a=>{a.error!=null&&Oe("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${a.error.message}`);const l=a.token!==this.m;return this.m=a.token,Oe("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(a.token):Promise.resolve()};this.o=a=>{e.enqueueRetryable(()=>r(a))};const s=a=>{Oe("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=a,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(a=>s(a)),setTimeout(()=>{if(!this.appCheck){const a=this.V.getImmediate({optional:!0});a?s(a):Oe("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new Xs(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(mn(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Xs(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function vu(i){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(i);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<i;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */function _u(){return new TextEncoder}/**
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
 */class wu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=vu(40);for(let a=0;a<s.length;++a)r.length<20&&s[a]<t&&(r+=e.charAt(s[a]%62))}return r}}function De(i,e){return i<e?-1:i>e?1:0}function Eu(i,e){let t=0;for(;t<i.length&&t<e.length;){const r=i.codePointAt(t),s=e.codePointAt(t);if(r!==s){if(r<128&&s<128)return De(r,s);{const a=_u(),l=bu(a.encode(Ys(i,t)),a.encode(Ys(e,t)));return l!==0?l:De(r,s)}}t+=r>65535?2:1}return De(i.length,e.length)}function Ys(i,e){return i.codePointAt(e)>65535?i.substring(e,e+2):i.substring(e,e+1)}function bu(i,e){for(let t=0;t<i.length&&t<e.length;++t)if(i[t]!==e[t])return De(i[t],e[t]);return De(i.length,e.length)}/**
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
 */const Qs="__name__";class Be{constructor(e,t,r){t===void 0?t=0:t>e.length&&gn(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&gn(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Be.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Be?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const a=Be.compareSegments(e.get(s),t.get(s));if(a!==0)return a}return De(e.length,t.length)}static compareSegments(e,t){const r=Be.isNumericId(e),s=Be.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?Be.extractNumericId(e).compare(Be.extractNumericId(t)):Eu(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Wi.fromString(e.substring(4,e.length-2))}}class Le extends Be{construct(e,t,r){return new Le(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new B(j.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new Le(t)}static emptyPath(){return new Le([])}}const Tu=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Et extends Be{construct(e,t,r){return new Et(e,t,r)}static isValidIdentifier(e){return Tu.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Et.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Qs}static keyField(){return new Et([Qs])}static fromServerFormat(e){const t=[];let r="",s=0;const a=()=>{if(r.length===0)throw new B(j.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let l=!1;for(;s<e.length;){const p=e[s];if(p==="\\"){if(s+1===e.length)throw new B(j.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const y=e[s+1];if(y!=="\\"&&y!=="."&&y!=="`")throw new B(j.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=y,s+=2}else p==="`"?(l=!l,s++):p!=="."||l?(r+=p,s++):(a(),s++)}if(a(),l)throw new B(j.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Et(t)}static emptyPath(){return new Et([])}}/**
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
 */class bt{constructor(e){this.path=e}static fromPath(e){return new bt(Le.fromString(e))}static fromName(e){return new bt(Le.fromString(e).popFirst(5))}static empty(){return new bt(Le.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Le.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Le.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new bt(new Le(e.slice()))}}function Iu(i,e,t,r){if(e===!0&&r===!0)throw new B(j.INVALID_ARGUMENT,`${i} and ${t} cannot be used together.`)}function Au(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}function Su(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(i);return e?`a custom ${e} object`:"an object"}}return typeof i=="function"?"a function":gn(12329,{type:typeof i})}function ku(i,e){if("_delegate"in i&&(i=i._delegate),!(i instanceof e)){if(e.name===i.constructor.name)throw new B(j.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Su(i);throw new B(j.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return i}/**
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
 */function le(i,e){const t={typeString:i};return e&&(t.value=e),t}function vn(i,e){if(!Au(i))throw new B(j.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,a="value"in e[r]?{value:e[r].value}:void 0;if(!(r in i)){t=`JSON missing required field: '${r}'`;break}const l=i[r];if(s&&typeof l!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(a!==void 0&&l!==a.value){t=`Expected '${r}' field to equal '${a.value}'`;break}}if(t)throw new B(j.INVALID_ARGUMENT,t);return!0}/**
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
 */const Zs=-62135596800,eo=1e6;class He{static now(){return He.fromMillis(Date.now())}static fromDate(e){return He.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*eo);return new He(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new B(j.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new B(j.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Zs)throw new B(j.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new B(j.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/eo}_compareTo(e){return this.seconds===e.seconds?De(this.nanoseconds,e.nanoseconds):De(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:He._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(vn(e,He._jsonSchema))return new He(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Zs;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}He._jsonSchemaVersion="firestore/timestamp/1.0",He._jsonSchema={type:le("string",He._jsonSchemaVersion),seconds:le("number"),nanoseconds:le("number")};function Cu(i){return i.name==="IndexedDbTransactionError"}/**
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
 */class xu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Tt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(a){throw typeof DOMException<"u"&&a instanceof DOMException?new xu("Invalid base64 string: "+a):a}}(e);return new Tt(t)}static fromUint8Array(e){const t=function(s){let a="";for(let l=0;l<s.length;++l)a+=String.fromCharCode(s[l]);return a}(e);return new Tt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return De(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Tt.EMPTY_BYTE_STRING=new Tt("");const qi="(default)";class Yn{constructor(e,t){this.projectId=e,this.database=t||qi}static empty(){return new Yn("","")}get isDefaultDatabase(){return this.database===qi}isEqual(e){return e instanceof Yn&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */class Pu{constructor(e,t=null,r=[],s=[],a=null,l="F",p=null,y=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=a,this.limitType=l,this.startAt=p,this.endAt=y,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function Ru(i){return new Pu(i)}/**
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
 */var to,H;(H=to||(to={}))[H.OK=0]="OK",H[H.CANCELLED=1]="CANCELLED",H[H.UNKNOWN=2]="UNKNOWN",H[H.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",H[H.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",H[H.NOT_FOUND=5]="NOT_FOUND",H[H.ALREADY_EXISTS=6]="ALREADY_EXISTS",H[H.PERMISSION_DENIED=7]="PERMISSION_DENIED",H[H.UNAUTHENTICATED=16]="UNAUTHENTICATED",H[H.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",H[H.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",H[H.ABORTED=10]="ABORTED",H[H.OUT_OF_RANGE=11]="OUT_OF_RANGE",H[H.UNIMPLEMENTED=12]="UNIMPLEMENTED",H[H.INTERNAL=13]="INTERNAL",H[H.UNAVAILABLE=14]="UNAVAILABLE",H[H.DATA_LOSS=15]="DATA_LOSS";/**
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
 */new Wi([4294967295,4294967295],0);/**
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
 */const Nu=41943040;/**
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
 */const Ou=1048576;function Ki(){return typeof document<"u"?document:null}/**
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
 */class Du{constructor(e,t,r=1e3,s=1.5,a=6e4){this.Fi=e,this.timerId=t,this.d_=r,this.E_=s,this.A_=a,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),s=Math.max(0,t-r);s>0&&Oe("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,s,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
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
 */class Ji{constructor(e,t,r,s,a){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=a,this.deferred=new yn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(l=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,a){const l=Date.now()+r,p=new Ji(e,t,l,s,a);return p.start(r),p}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new B(j.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var no,io;(io=no||(no={})).Fa="default",io.Cache="cache";/**
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
 */function Lu(i){const e={};return i.timeoutSeconds!==void 0&&(e.timeoutSeconds=i.timeoutSeconds),e}/**
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
 */const ro=new Map;/**
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
 */const so="firestore.googleapis.com",oo=!0;class ao{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new B(j.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=so,this.ssl=oo}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:oo;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Nu;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Ou)throw new B(j.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Iu("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Lu((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(a){if(a.timeoutSeconds!==void 0){if(isNaN(a.timeoutSeconds))throw new B(j.INVALID_ARGUMENT,`invalid long polling timeout: ${a.timeoutSeconds} (must not be NaN)`);if(a.timeoutSeconds<5)throw new B(j.INVALID_ARGUMENT,`invalid long polling timeout: ${a.timeoutSeconds} (minimum allowed value is 5)`);if(a.timeoutSeconds>30)throw new B(j.INVALID_ARGUMENT,`invalid long polling timeout: ${a.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class co{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ao({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new B(j.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new B(j.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ao(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new du;switch(r.type){case"firstParty":return new mu(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new B(j.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=ro.get(t);r&&(Oe("ComponentProvider","Removing Datastore"),ro.delete(t),r.terminate())}(this),Promise.resolve()}}function Mu(i,e,t,r={}){var s;i=ku(i,co);const a=nn(e),l=i._getSettings(),p=Object.assign(Object.assign({},l),{emulatorOptions:i._getEmulatorOptions()}),y=`${e}:${t}`;a&&(Rr(`https://${y}`),Or("Firestore",!0)),l.host!==so&&l.host!==y&&uu("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const E=Object.assign(Object.assign({},l),{host:y,ssl:a,emulatorOptions:r});if(!mt(E,p)&&(i._setSettings(E),r.mockUserToken)){let A,k;if(typeof r.mockUserToken=="string")A=r.mockUserToken,k=Ie.MOCK_USER;else{A=Va(r.mockUserToken,(s=i._app)===null||s===void 0?void 0:s.options.projectId);const I=r.mockUserToken.sub||r.mockUserToken.user_id;if(!I)throw new B(j.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");k=new Ie(I)}i._authCredentials=new fu(new Js(A,k))}}/**
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
 */class Xi{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Xi(this.firestore,e,this._query)}}class ze{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Yi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ze(this.firestore,e,this._key)}toJSON(){return{type:ze._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(vn(t,ze._jsonSchema))return new ze(e,r||null,new bt(Le.fromString(t.referencePath)))}}ze._jsonSchemaVersion="firestore/documentReference/1.0",ze._jsonSchema={type:le("string",ze._jsonSchemaVersion),referencePath:le("string")};class Yi extends Xi{constructor(e,t,r){super(e,t,Ru(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ze(this.firestore,null,new bt(e))}withConverter(e){return new Yi(this.firestore,e,this._path)}}/**
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
 */const lo="AsyncQueue";class ho{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Du(this,"async_queue_retry"),this.oc=()=>{const r=Ki();r&&Oe(lo,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const t=Ki();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Ki();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});const t=new yn;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Cu(e))throw e;Oe(lo,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){const t=this._c.then(()=>(this.nc=!0,e().catch(r=>{throw this.tc=r,this.nc=!1,qs("INTERNAL UNHANDLED ERROR: ",uo(r)),r}).then(r=>(this.nc=!1,r))));return this._c=t,t}enqueueAfterDelay(e,t,r){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const s=Ji.createAndSchedule(this,e,t,r,a=>this.lc(a));return this.ec.push(s),s}ac(){this.tc&&gn(47125,{hc:uo(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function uo(i){let e=i.message||"";return i.stack&&(e=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),e}class Uu extends co{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new ho,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ho(e),this._firestoreClient=void 0,await e}}}function $u(i,e){const t=typeof i=="object"?i:Hr(),r=typeof i=="string"?i:qi,s=Ci(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const a=$a("firestore");a&&Mu(s,...a)}return s}/**
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
 */class Ze{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ze(Tt.fromBase64String(e))}catch(t){throw new B(j.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ze(Tt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ze._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(vn(e,Ze._jsonSchema))return Ze.fromBase64String(e.bytes)}}Ze._jsonSchemaVersion="firestore/bytes/1.0",Ze._jsonSchema={type:le("string",Ze._jsonSchemaVersion),bytes:le("string")};/**
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
 */class fo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new B(j.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Et(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class It{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new B(j.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new B(j.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return De(this._lat,e._lat)||De(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:It._jsonSchemaVersion}}static fromJSON(e){if(vn(e,It._jsonSchema))return new It(e.latitude,e.longitude)}}It._jsonSchemaVersion="firestore/geoPoint/1.0",It._jsonSchema={type:le("string",It._jsonSchemaVersion),latitude:le("number"),longitude:le("number")};/**
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
 */class At{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let a=0;a<r.length;++a)if(r[a]!==s[a])return!1;return!0}(this._values,e._values)}toJSON(){return{type:At._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(vn(e,At._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new At(e.vectorValues);throw new B(j.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}At._jsonSchemaVersion="firestore/vectorValue/1.0",At._jsonSchema={type:le("string",At._jsonSchemaVersion),vectorValues:le("object")};const Fu=new RegExp("[~\\*/\\[\\]]");function Vu(i,e,t){if(e.search(Fu)>=0)throw po(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,i);try{return new fo(...e.split("."))._internalPath}catch{throw po(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i)}}function po(i,e,t,r,s){let a=`Function ${e}() called with invalid data`;a+=". ";let l="";return new B(j.INVALID_ARGUMENT,a+i+l)}/**
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
 */class go{constructor(e,t,r,s,a){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=a}get id(){return this._key.path.lastSegment()}get ref(){return new ze(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ju(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(mo("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class ju extends go{data(){return super.data()}}function mo(i,e){return typeof e=="string"?Vu(i,e):e instanceof fo?e._internalPath:e._delegate._internalPath}class Qn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class jt extends go{constructor(e,t,r,s,a,l){super(e,t,r,s,l),this._firestore=e,this._firestoreImpl=e,this.metadata=a}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Zn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(mo("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new B(j.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=jt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}jt._jsonSchemaVersion="firestore/documentSnapshot/1.0",jt._jsonSchema={type:le("string",jt._jsonSchemaVersion),bundleSource:le("string","DocumentSnapshot"),bundleName:le("string"),bundle:le("string")};class Zn extends jt{data(e={}){return super.data(e)}}class _n{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Qn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Zn(this._firestore,this._userDataWriter,r.key,r,new Qn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new B(j.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,a){if(s._snapshot.oldDocs.isEmpty()){let l=0;return s._snapshot.docChanges.map(p=>{const y=new Zn(s._firestore,s._userDataWriter,p.doc.key,p.doc,new Qn(s._snapshot.mutatedKeys.has(p.doc.key),s._snapshot.fromCache),s.query.converter);return p.doc,{type:"added",doc:y,oldIndex:-1,newIndex:l++}})}{let l=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(p=>a||p.type!==3).map(p=>{const y=new Zn(s._firestore,s._userDataWriter,p.doc.key,p.doc,new Qn(s._snapshot.mutatedKeys.has(p.doc.key),s._snapshot.fromCache),s.query.converter);let E=-1,A=-1;return p.type!==0&&(E=l.indexOf(p.doc.key),l=l.delete(p.doc.key)),p.type!==1&&(l=l.add(p.doc),A=l.indexOf(p.doc.key)),{type:Bu(p.type),doc:y,oldIndex:E,newIndex:A}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new B(j.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=_n._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=wu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach(a=>{a._document!==null&&(t.push(a._document),r.push(this._userDataWriter.convertObjectMap(a._document.data.value.mapValue.fields,"previous")),s.push(a.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Bu(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return gn(61501,{type:i})}}_n._jsonSchemaVersion="firestore/querySnapshot/1.0",_n._jsonSchema={type:le("string",_n._jsonSchemaVersion),bundleSource:le("string","QuerySnapshot"),bundleName:le("string"),bundle:le("string")},function(e,t=!0){(function(s){pn=s})(Ot),Nt(new yt("firestore",(r,{instanceIdentifier:s,options:a})=>{const l=r.getProvider("app").getImmediate(),p=new Uu(new pu(r.getProvider("auth-internal")),new yu(l,r.getProvider("app-check-internal")),function(E,A){if(!Object.prototype.hasOwnProperty.apply(E.options,["projectId"]))throw new B(j.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Yn(E.options.projectId,A)}(l,s),l);return a=Object.assign({useFetchStreams:t},a),p._setSettings(a),p},"PUBLIC").setMultipleInstances(!0)),at(Ws,Gs,e),at(Ws,Gs,"esm2017")}();const Qi={},Hu=(Qi==null?void 0:Qi.VITE_DEFAULT_TARGET_LANG)||"en",yo={apiKey:"AIzaSyDb3FPl9-DA_RiY_m8flV-gePeLFnXYVoA",authDomain:"desainr.firebaseapp.com",projectId:"desainr",storageBucket:"desainr.firebasestorage.app",messagingSenderId:"897610202784",appId:"1:897610202784:web:b6a38c0fdf6b07bfe5d3c5"},wn=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_TARGET_LANG:Hu,FIREBASE_WEB_CONFIG:yo},Symbol.toStringTag,{value:"Module"})),We=yo;let ei;zr().length?ei=zr()[0]:ei=Br(We);try{const i=(We==null?void 0:We.apiKey)||"",e=i?`${i.slice(0,6)}...${i.slice(-4)}`:"",t={projectId:We==null?void 0:We.projectId,authDomain:We==null?void 0:We.authDomain,apiKey:e};console.info("[DesAInR][ext][firebase] initialized "+JSON.stringify(t))}catch{}const zu=lu(ei);$u(ei);const Bt="desainr.auth.uid",Ht="desainr.auth.idToken",zt="desainr.auth.signedInAt";function vo(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function Wu(){var i,e,t;if(vo())return new Promise(r=>{chrome.storage.local.get([Bt,Ht,zt],s=>{r({uid:s[Bt],idToken:s[Ht],signedInAt:s[zt]})})});try{const r=((i=globalThis==null?void 0:globalThis.localStorage)==null?void 0:i.getItem(Bt))||void 0,s=((e=globalThis==null?void 0:globalThis.localStorage)==null?void 0:e.getItem(Ht))||void 0,a=((t=globalThis==null?void 0:globalThis.localStorage)==null?void 0:t.getItem(zt))||void 0,l=a?Number(a):void 0;return{uid:r,idToken:s,signedInAt:l}}catch{return{}}}async function Gu(i){var t,r,s;const e={[Bt]:i.uid,[Ht]:i.idToken,[zt]:i.signedInAt??Date.now()};if(vo()){await chrome.storage.local.set(e);return}try{(t=globalThis==null?void 0:globalThis.localStorage)==null||t.setItem(Bt,String(e[Bt]??"")),(r=globalThis==null?void 0:globalThis.localStorage)==null||r.setItem(Ht,String(e[Ht]??"")),(s=globalThis==null?void 0:globalThis.localStorage)==null||s.setItem(zt,String(e[zt]??""))}catch{}}async function qu(){const i=zu.currentUser;if(i){const t=await i.getIdToken(!0);return await Gu({uid:i.uid,idToken:t}),t}const e=await Wu();if(e.idToken)return e.idToken;throw new Error("Not signed in")}const Wt={rewrite:{maxTokens:20,refillRate:.5,costPerCall:1},"translate-chunks":{maxTokens:30,refillRate:1,costPerCall:1},"analyze-page":{maxTokens:10,refillRate:.2,costPerCall:1},chat:{maxTokens:30,refillRate:.5,costPerCall:1},actions:{maxTokens:20,refillRate:.5,costPerCall:1},"memo/save":{maxTokens:50,refillRate:1,costPerCall:1},"slash-prompts":{maxTokens:10,refillRate:.5,costPerCall:1},default:{maxTokens:20,refillRate:.5,costPerCall:1}},_o="rateLimiter_";function wo(){try{return typeof chrome<"u"&&!!chrome.storage&&!!chrome.storage.local}catch{return!1}}async function Eo(i){var r;const e=`${_o}${i}`,t=Wt[i]||Wt.default;if(wo())return new Promise(s=>{chrome.storage.local.get(e,a=>{const l=a[e];l&&l.tokens!==void 0&&l.lastRefill!==void 0?s(l):s({tokens:t.maxTokens,lastRefill:Date.now()})})});try{const s=(r=globalThis==null?void 0:globalThis.localStorage)==null?void 0:r.getItem(e);if(s){const a=JSON.parse(s);if(a&&a.tokens!==void 0&&a.lastRefill!==void 0)return a}}catch{}return{tokens:t.maxTokens,lastRefill:Date.now()}}async function bo(i,e){var r;const t=`${_o}${i}`;if(wo())return new Promise(s=>{chrome.storage.local.set({[t]:e},s)});try{(r=globalThis==null?void 0:globalThis.localStorage)==null||r.setItem(t,JSON.stringify(e))}catch{}}function To(i,e){const t=Date.now(),s=(t-i.lastRefill)/1e3*e.refillRate;return{tokens:Math.min(i.tokens+s,e.maxTokens),lastRefill:t}}async function Ku(i){const e=Wt[i]||Wt.default;let t=await Eo(i);return t=To(t,e),t.tokens<e.costPerCall?(await bo(i,t),!1):(t.tokens-=e.costPerCall,await bo(i,t),!0)}async function Ju(i){const e=Wt[i]||Wt.default;let t=await Eo(i);t=To(t,e);const r=Math.max(0,e.costPerCall-t.tokens),s=r>0?r/e.refillRate:0;return{remainingTokens:Math.floor(t.tokens),maxTokens:e.maxTokens,timeUntilRefill:Math.ceil(s),canMakeCall:t.tokens>=e.costPerCall}}async function Gt(i,e){if(!await Ku(i)){const a=(await Ju(i)).timeUntilRefill;return{ok:!1,status:429,error:`Rate limit exceeded. Please wait ${a} second${a!==1?"s":""} before trying again.`}}const r=await qu();return new Promise(s=>{chrome.runtime.sendMessage({type:"API_CALL",path:i,token:r,body:e},a=>{if(!a)return s({ok:!1,status:0,error:"No response from background"});s(a)})})}async function qt(i,e=3,t=100){let r;for(let s=0;s<e;s++){const a=await i();if(a.ok)return a;if(r=a,a.status&&a.status<500&&a.status!==0)break;await new Promise(l=>setTimeout(l,t*Math.pow(2,s)))}return r??{ok:!1,status:0,error:"Unknown error"}}async function Xu(i){return qt(()=>Gt("rewrite",i))}async function Yu(i){return qt(()=>Gt("translate-chunks",i))}async function Qu(i){return qt(()=>Gt("translate-chunks",i))}async function Zu(i){return qt(()=>Gt("analyze-page",i))}async function ed(i){return qt(()=>Gt("actions",i))}async function td(i){return qt(()=>Gt("memo/save",i))}const Me=Object.freeze(Object.defineProperty({__proto__:null,actions:ed,analyzePage:Zu,rewrite:Xu,saveMemo:td,translateChunks:Yu,translateChunksBatch:Qu},Symbol.toStringTag,{value:"Module"}));function nd(i,e){try{i.innerHTML=""}catch{}const t=i.attachShadow({mode:"open"}),r=document.createElement("style");r.textContent=`
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
  `,t.appendChild(r);const s=document.createElement("div");s.className="wrap",s.innerHTML=`
    <div class="hdr">
      <div class="ttl">DesAInR Overlay</div>
      <button id="ovl-close" title="Close">Close</button>
    </div>
    <div class="body">Overlay is mounted. This is a minimal stub implementation.</div>
  `,t.appendChild(s);const a=t.getElementById("ovl-close");return a&&a.addEventListener("click",()=>{try{e&&e()}catch{}}),{detach:()=>{try{i.parentNode&&i.parentNode.removeChild(i)}catch{}}}}const id=Object.freeze(Object.defineProperty({__proto__:null,mountOverlay:nd},Symbol.toStringTag,{value:"Module"}));class rd{constructor(e=50){be(this,"history",[]);be(this,"currentIndex",-1);be(this,"maxHistorySize",50);be(this,"listeners",new Set);this.maxHistorySize=e}addAction(e){const t=`undo-${Date.now()}-${Math.random()}`,r={...e,id:t,timestamp:Date.now()};return this.history=this.history.slice(0,this.currentIndex+1),this.history.push(r),this.currentIndex++,this.history.length>this.maxHistorySize&&(this.history=this.history.slice(-this.maxHistorySize),this.currentIndex=this.history.length-1),this.notifyListeners(),t}undo(){if(!this.canUndo())return!1;const t=this.history[this.currentIndex].undo();return t&&(this.currentIndex--,this.notifyListeners()),t}redo(){if(!this.canRedo())return!1;const e=this.history[this.currentIndex+1];if(!e.redo)return!1;const t=e.redo();return t&&(this.currentIndex++,this.notifyListeners()),t}canUndo(){return this.currentIndex>=0}canRedo(){var e;return this.currentIndex<this.history.length-1&&((e=this.history[this.currentIndex+1])==null?void 0:e.redo)!==void 0}getHistory(){return[...this.history]}getRecentActions(e=5){return this.history.slice(Math.max(0,this.currentIndex-e+1),this.currentIndex+1).reverse()}clear(){this.history=[],this.currentIndex=-1,this.notifyListeners()}clearOld(e){const t=Date.now()-e,r=this.history.findIndex(s=>s.timestamp>=t);r>0&&(this.history=this.history.slice(r),this.currentIndex=Math.max(-1,this.currentIndex-r),this.notifyListeners())}subscribe(e){return this.listeners.add(e),e(this.getHistory(),this.canUndo(),this.canRedo()),()=>{this.listeners.delete(e)}}notifyListeners(){const e=this.getHistory(),t=this.canUndo(),r=this.canRedo();this.listeners.forEach(s=>{s(e,t,r)})}}let Zi=null;function sd(){return Zi||(Zi=new rd),Zi}function od(i){if(!i)return!1;const e=i.tagName.toLowerCase();return e==="input"||e==="textarea"}async function Io(i){var e;try{if((e=navigator.clipboard)!=null&&e.writeText)return await navigator.clipboard.writeText(i),!0}catch{}try{const t=document.createElement("textarea");t.value=i,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.focus(),t.select();const r=document.execCommand("copy");return document.body.removeChild(t),r}catch{return!1}}function Ao(i){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=document.activeElement;if(od(t))try{const r=t,s=r.selectionStart??0,a=r.selectionEnd??s,l=r.value??"",p=l.slice(s,a);r.value=l.slice(0,s)+i+l.slice(a);const y=s+i.length;r.selectionStart=r.selectionEnd=y,r.dispatchEvent(new Event("input",{bubbles:!0}));const E={description:`Replace "${p.slice(0,20)}${p.length>20?"...":""}" with "${i.slice(0,20)}${i.length>20?"...":""}"`,undo:()=>{try{return r.value=l,r.selectionStart=s,r.selectionEnd=a,r.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}},redo:()=>{try{return r.value=l.slice(0,s)+i+l.slice(a),r.selectionStart=r.selectionEnd=s+i.length,r.dispatchEvent(new Event("input",{bubbles:!0})),!0}catch{return!1}}};return sd().addAction(E),{undo:E.undo}}catch{}try{const r=e.getRangeAt(0),s=r.cloneContents(),a=r.cloneContents(),l=Array.from(a.childNodes).some(E=>E.nodeType!==Node.TEXT_NODE),p=r.endContainer!==r.startContainer;if(l&&p)return null;r.deleteContents();const y=document.createTextNode(i);return r.insertNode(y),r.setStartAfter(y),r.collapse(!0),e.removeAllRanges(),e.addRange(r),{undo:()=>{try{const E=y.parentNode;if(!E)return!1;const A=s.cloneNode(!0);return E.insertBefore(A,y),E.removeChild(y),!0}catch{return!1}}}}catch{return null}}async function ad(i){const e=Ao(i);return e?{outcome:"replaced",undo:e.undo}:await Io(i)?{outcome:"copied"}:{outcome:"failed"}}const So=Object.freeze(Object.defineProperty({__proto__:null,applyReplacementOrCopyWithUndo:ad,copyToClipboard:Io,replaceSelectionSafelyWithUndo:Ao},Symbol.toStringTag,{value:"Module"}));function cd(){const i=window.getSelection();if(!i||i.rangeCount===0)return null;const t=i.getRangeAt(0).getBoundingClientRect(),r=i.toString();if(!r.trim())return null;const s=t.left+window.scrollX,a=t.top+window.scrollY;return{text:r,rect:t,pageX:s,pageY:a}}const ld=Object.freeze(Object.defineProperty({__proto__:null,getSelectionInfo:cd},Symbol.toStringTag,{value:"Module"})),hd=new Set(["script","style","noscript","template","textarea","input","select","option","code","pre","kbd","samp","var","svg","canvas","math","video","audio"]);function ud(i){if(!i)return!1;if(i.isContentEditable)return!0;const t=i.getAttribute("contenteditable");return t===""||t==="true"}function dd(i){if(!i)return!1;const e=i.tagName.toLowerCase();return e==="input"||e==="textarea"||e==="select"||e==="option"}function fd(i){return!!(!i||hd.has(i.tagName.toLowerCase())||dd(i)||ud(i))}function pd(i){const e=getComputedStyle(i);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0"||i.hidden)return!0;const t=i.getBoundingClientRect();return t.width===0&&t.height===0}function gd(i){let e=i;for(;e;){if(fd(e)||pd(e))return!0;e=e.parentElement}return!1}function md(i,e=5){const t=[];let r=i,s=0;for(;r&&s<e;){const a=r.tagName.toLowerCase(),l=r.id?`#${r.id}`:"",p=r.className&&typeof r.className=="string"?`.${r.className.trim().split(/\s+/).slice(0,2).join(".")}`:"";t.unshift(`${a}${l}${p}`),r=r.parentElement,s++}return t.join(">")}function er(i=document.body){const e=[],t=document.createTreeWalker(i,NodeFilter.SHOW_TEXT,{acceptNode:s=>{if(s.nodeType!==Node.TEXT_NODE)return NodeFilter.FILTER_REJECT;const a=s.data;if(!a||!a.trim())return NodeFilter.FILTER_REJECT;const l=s.parentElement;return!l||l.closest&&l.closest(".desainr-parallel-wrapper")||gd(l)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let r=t.nextNode();for(;r;){const s=r,a=s.parentElement;e.push({node:s,text:s.data,index:e.length,parent:a,path:md(a)}),r=t.nextNode()}return e}function ko(i){return i.map(e=>e.text)}async function yd(i,e,t){const r=new Array(i.length);let s=0,a=0;return new Promise((l,p)=>{const y=()=>{for(;a<e&&s<i.length;){const E=s++;a++,Promise.resolve(t(i[E],E)).then(A=>{r[E]=A,a--,s>=i.length&&a===0?l(r):y()}).catch(A=>{r[E]=void 0,a--,s>=i.length&&a===0?l(r):y()})}};i.length===0?l(r):y()})}async function vd(i,e=3,t=400){var k;const{translateChunksBatch:r,translateChunks:s}=await ne(async()=>{const{translateChunksBatch:I,translateChunks:x}=await Promise.resolve().then(()=>Me);return{translateChunksBatch:I,translateChunks:x}},void 0),a=er(),l=a.slice(0,t),p=ko(l);let y=[],E=!1;try{const I=await r({chunks:p,url:location.href,targetLang:i});I.ok&&Array.isArray((k=I.json)==null?void 0:k.results)&&(y=I.json.results??[],E=!0)}catch{}(!E||y.length!==p.length)&&(y=await yd(p,e,async I=>{var P;const x=await s({selection:I,url:location.href,targetLang:i});return x.ok&&((P=x.json)!=null&&P.result)?x.json.result:I}));let A=0;for(let I=0;I<l.length;I++)try{const x=y[I];typeof x=="string"&&x!==l[I].text&&(l[I].node.data=x,A++)}catch{}return{totalNodes:a.length,translated:A,skipped:l.length-A}}const _d=Object.freeze(Object.defineProperty({__proto__:null,collectTextNodes:er,snapshotTexts:ko,translatePageAll:vd},Symbol.toStringTag,{value:"Module"})),En="desainr-parallel-wrapper",Co="desainr-parallel-original",xo="desainr-parallel-translated",Po="desainr-parallel-style";let et=!1,bn=null;function wd(){if(document.getElementById(Po))return;const i=document.createElement("style");i.id=Po,i.textContent=`
    .${En} { display: inline; white-space: pre-wrap; }
    .${Co} { opacity: 0.95; }
    .${xo} { opacity: 0.75; color: #555; margin-left: 0.4em; }
  `,document.documentElement.appendChild(i)}async function tr(i,e){var s;const{translateChunks:t}=await ne(async()=>{const{translateChunks:a}=await Promise.resolve().then(()=>Me);return{translateChunks:a}},void 0),r=await t({selection:i,url:location.href,targetLang:e});return r.ok&&((s=r.json)!=null&&s.result)?r.json.result:i}function ti(i,e){const t=i.parentElement;if(!t||t.closest&&t.closest(`.${En}`))return;const r=i.data,s=document.createElement("span");s.className=En,s.dataset.orig=r;const a=document.createElement("span");a.className=Co,a.textContent=r;const l=document.createElement("span");l.className=xo,l.textContent=e,s.appendChild(a),s.appendChild(document.createTextNode(" ")),s.appendChild(l),t.replaceChild(s,i)}function Ro(i){return!!i&&i.classList.contains(En)}function Ed(){var e;if(!et)return;et=!1,bn&&(bn.disconnect(),bn=null);const i=Array.from(document.querySelectorAll(`.${En}`));for(const t of i){const r=((e=t.dataset)==null?void 0:e.orig)??"",s=document.createTextNode(r);t.parentNode&&t.parentNode.replaceChild(s,t)}}function bd(){return et}async function Td(i){var p;if(et)return;et=!0,wd();const r=er().slice(0,400),{DEFAULT_TARGET_LANG:s}=await ne(async()=>{const{DEFAULT_TARGET_LANG:y}=await Promise.resolve().then(()=>wn);return{DEFAULT_TARGET_LANG:y}},void 0),a=i||s;let l=!1;try{const{translateChunksBatch:y}=await ne(async()=>{const{translateChunksBatch:I}=await Promise.resolve().then(()=>Me);return{translateChunksBatch:I}},void 0),E=r.map(I=>I.text),A=await y({chunks:E,url:location.href,targetLang:a}),k=(p=A.json)==null?void 0:p.results;if(A.ok&&Array.isArray(k)&&k.length===r.length){for(let I=0;I<r.length;I++)try{ti(r[I].node,k[I])}catch{}l=!0}}catch{}if(!l){let E=0;async function A(){if(!et)return;const k=E++;if(k>=r.length)return;const I=r[k];try{const x=await tr(I.text,a);ti(I.node,x)}catch{}await A()}await Promise.all(new Array(3).fill(0).map(()=>A()))}bn=new MutationObserver(async y=>{if(et)for(const E of y)if(E.type==="characterData"&&E.target.nodeType===Node.TEXT_NODE){const A=E.target,k=A.parentElement;if(!k||Ro(k))continue;const I=A.data;if(I&&I.trim())try{const x=await tr(I,a);if(!et)return;ti(A,x)}catch{}}else E.type==="childList"&&E.addedNodes.forEach(async A=>{if(A.nodeType===Node.TEXT_NODE){const k=A,I=k.parentElement;if(!I||Ro(I))return;const x=k.data;if(x&&x.trim())try{const P=await tr(x,a);if(!et)return;ti(k,P)}catch{}}})}),bn.observe(document.body,{subtree:!0,childList:!0,characterData:!0})}const Id=Object.freeze(Object.defineProperty({__proto__:null,disableParallelMode:Ed,enableParallelMode:Td,isParallelModeEnabled:bd},Symbol.toStringTag,{value:"Module"}))})();
