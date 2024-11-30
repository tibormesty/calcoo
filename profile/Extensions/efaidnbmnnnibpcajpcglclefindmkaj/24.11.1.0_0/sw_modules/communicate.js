/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property laws,
* including trade secret and or copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/
import{util as e}from"./util.js";import{common as t}from"./common.js";import{analytics as s}from"../common/analytics.js";import{Proxy as i}from"./proxy.js";import{floodgate as a}from"./floodgate.js";import{sharepointModule as r}from"./sharepoint-module.js";import{privateApi as n}from"./private-api.js";import{viewerModuleUtils as o}from"./viewer-module-utils.js";import{SETTINGS as l}from"./settings.js";import{dcLocalStorage as d,dcSessionStorage as c}from"../common/local-storage.js";import{OFFSCREEN_DOCUMENT_PATH as p}from"../common/constant.js";import{CACHE_PURGE_SCHEME as m}from"./constant.js";import{closeExpress as u,isExpressContextMenuEnabled as h,toggleExpressTouchpoints as g}from"./express.js";let b=null,f={},_={};class I{constructor(){this.tabs={},this.version=-1,this.NMHConnStatus=!0,this.activeTab=void 0,this.isAllowedLocalFileAccess=!1}proxy(...e){return i.proxy.bind(this)(...e)}LOG(...e){return t.LOG(...e)}setIsAllowedLocalFileAccess(e){this.isAllowedLocalFileAccess=e,d.setItem("isAllowedLocalFileAccess",e)}registerHandlers(t){_=e.extend(_,t)}registerModule(e,t){f[e]=t}getModule(e){return f[e]}getTabLastMessage(e){return this.tabs[e]}updateTabMessage(t,s){this.tabs[t]?this.tabs[t]=e.extend(this.tabs[t],s):this.tabs[t]=s}setNMHConnectionStatus(e){this.NMHConnStatus=e}legacyShim(){return this.version<=1}setVersion(e){this.version=e}resetPersistPrefCount(){d.setItem("persist-menu-closed",0)}incrementPersistPrefCount(e){let t=d.getItem("persist-menu-closed");t<10&&"false"!==d.getItem("always-show-pdf-menu")&&(t++,d.setItem("persist-menu-closed",t)),t>=10&&(d.setItem("always-show-pdf-menu","false"),e||s.event(s.e.PERSIST_PDF_OPENPDF_PREF_OFF))}diffDays(e,t){const s=Math.abs(e-t);return Math.floor(s/864e5)}enableReprompt(){if(!d.getItem("repromptCount")||parseInt(d.getItem("repromptCount"))<l.REPROMPT_DORMANT_USER_ATTEMPTS){let e=Date.now(),t=d.getItem("fteDenied")&&10===parseInt(d.getItem("fteDenied")),s=d.getItem("pdfViewer"),i=l.VIEWER_ENABLED,a=!d.getItem("reprompt-user-timestamp"),r=d.getItem("repromptCount")?d.getItem("repromptCount"):0,n=d.getItem("reprompt-user-timestamp")&&this.diffDays(e,d.getItem("reprompt-user-timestamp"))>=l.REPROMPT_DORMANT_USER_TIME_INTERVALS[r];return i&&!s&&t&&(n||a)}return!1}async isEnablePersistMenu(e){if(e&&"mime-native"===e.viewer&&(l.IS_ERP_READER||l.IS_READER)&&d.getItem("openInAcrobatEnable")&&"admin"!==d.getItem("installSource"))return!1;if(await n.isInstalledViaUpsell()&&!d.getItem("pdfViewer"))return!1;if(e&&"mime"===e.viewer)return!1;if(l.VIEWER_ENABLED&&(l.IS_ACROBAT&&!l.VIEWER_ENABLED_FOR_ACROBAT||d.getItem("fteDenied")||"true"!==d.getItem("pdfViewer")||this.resetPersistPrefCount()),l.REPROMPT_DORMANT_USER&&this.enableReprompt()){let e=d.getItem("repromptCount")?parseInt(d.getItem("repromptCount"))+1:1;d.setItem("repromptCount",e),d.setItem("fteDenied",9),d.setItem("persist-menu-closed",9),d.removeItem("always-show-pdf-menu")}return"false"!==d.getItem("always-show-pdf-menu")&&(d.getItem("persist-menu-closed")<10?!(this.legacyShim()&&(!l.VIEWER_ENABLED||d.getItem("pdfViewer"))):"true"===d.getItem("always-show-pdf-menu")&&(this.resetPersistPrefCount(),!0))}isViewerEnabled(){return!(!l.VIEWER_ENABLED||l.IS_ACROBAT&&!l.VIEWER_ENABLED_FOR_ACROBAT||"true"!==d.getItem("pdfViewer"))}async relayMessageToContentScript(e){if(1==e.newUI&&"dismiss"===e.content_op)e.persist=!1,null!=e.tabId&&(this.tabs[e.tabId].persist=!1),this.incrementPersistPrefCount(e.fteClosed);else if(1==e.newUI&&"pdf_menu"===e.panel_op){await this.isEnablePersistMenu(e)?null!=e.tabId&&(this.tabs[e.tabId].persist=!0):e.persist=!1,this.resetPersistPrefCount()}this.sendMessage(e)}isViewerEnabledOrFromExternalTouchPoint(e){return this.isViewerEnabled()||o.isPDFURLFromExternalTouchPoint(e)}sendViewerStartupInformation(t,i,n){if(this.isViewerEnabledOrFromExternalTouchPoint(i)&&e.isViewerURL(i)||t.mimeHandled){if("viewer-startup"===t.main_op&&(delete t.main_op,t.isFrictionlessEnabled=l.FRICTIONLESS_ENABLED,t.isSharePointEnabled=r.isFeatureEnabled(),t.isSharePointURL=!1),t.isSharePointEnabled)try{let e=new URL(i).searchParams.get("pdfurl");t.isSharePointURL=r.isAllowListedSharePointURL(e)}catch(e){}t.mimeHandled&&(s.event(s.e.VIEWER_EXTN_PDF_OPENED,{tabURL:i}),i.startsWith("file://")?s.event(s.e.VIEWER_PDF_LOCAL_FILE):s.event(s.e.VIEWER_PDF_OPENED_MIME_HANDLER)),t.isFillnSignEnabled=l.FILL_N_SIGN_ENABLED,a.getFeaturesAndGroups().then((({featureFlags:e})=>{t.featureFlags=e,n(t)})).catch((s=>{n(t),e.consoleLog(s)}))}}async sendViewerPreviewInformation(e,t){this.sendMessage({dend_op:"viewer-type",viewer:"mime",tabId:e.tabId,is_pdf:!0}),await o.updateVariables(this.version),t()}handlerTabs(e){e&&e.tabId&&"outermost_frame"===e.frameType&&communicate.filterLoadedTabs(e)}async filterLoadedTabs(e){const t=await n.isMimeHandlerAvailable(),s=d.getItem("loadedTabsInfo");if(s&&s.tabsInfo){const i=s.tabsInfo||[];if(t){if(i.includes(e.tabId)){const t=i.filter((t=>t!==e.tabId));t.length>0?d.setItem("loadedTabsInfo",{tabsInfo:t}):d.removeItem("loadedTabsInfo")}}else{-1!==i.findIndex((t=>t.id==e.tabId))&&this.getCurrentTabInfoAndUpdateLoadedTabs()}}}async getCurrentTabInfoAndUpdateLoadedTabs(){const e=await n.isMimeHandlerAvailable(),t=d.getItem("loadedTabsInfo"),s=t?.tabsInfo;if(!e&&s){const e=`chrome-extension://${chrome.runtime.id}/*`;let t=await chrome.tabs.query({url:e});t=t.filter((e=>e.url!==chrome.runtime.getURL("browser/js/local-fte.html"))),t.length?d.setItem("loadedTabsInfo",{tabsInfo:t}):d.removeItem("loadedTabsInfo")}}handler(t,i,r){var o,l=this;if(!t)return;if(this.dump(t,"Communicate Handler receive: "),t.mimeHandled){var c={id:t.tabId,url:t.url};i.tab=c}const h=`chrome-extension://${chrome.runtime.id}/browser/js/popup.html`,b=`chrome-extension://${chrome.runtime.id}/${p}`,f=i.url.split("?")[0];if([h,b].includes(f)&&(i.tab=t.tab,delete t.tab),i&&i.tab&&(t.tabId=i.tab.id,this.activeTab||(this.activeTab=i.tab.id),t.main_op)){switch(o=t.main_op,delete t.main_op,s.logBrowserAnalytics(t),this.tabs[t.tabId]&&this.tabs[t.tabId].suppress_frictionless&&(t.suppress_frictionless=this.tabs[t.tabId].suppress_frictionless),t.version=this.version,t.NMHConnStatus=this.NMHConnStatus,o){case"acrobat-gmail-fte-config":this.gmailFteConfigUpdated(t);case"express-init":this.expressInit(r);break;case"gmail-init":this.gmailInit(r);break;case"acrobat-gdrive-fte-state":this.gdriveFteStateUpdated(t);break;case"gdrive-init":this.gdriveInit(r,t.tabId);break;case"gdrive-download-init":this.gDriveDownloadPageInit(r);break;case"viewer-preview":return this.sendViewerPreviewInformation(t,r),!0;case"get-features&groups":return a.getFeaturesAndGroups(t.cachePurge).then((e=>r(e))),!0;case"getFloodgateFlag":a.hasFlag(t.flag).then(r);break;case"openRecentFileLink":let c=t.recent_file_url;new URLSearchParams(t.recent_file_url)?.has("acrobatPromotionSource")&&(c=chrome.runtime.getURL("viewer.html")+"?pdfurl="+encodeURIComponent(t.recent_file_url)+"&pdffilename="+encodeURIComponent(t.file_name)),e.createTab(c);break;case"viewer-type":setTimeout((()=>{this.sendMessage({dend_op:"viewer-type",viewer:t.viewer,tabId:t.tabId,is_pdf:!0})}),500);case"init-floodgate":setTimeout((()=>{a.init(),a.getFeaturesAndGroups()}),2e3);break;case"complete_conversion":e.createTab(t.conversion_url);break;case"analytics":break;case"pdf-contentType-event":a.hasFlag("dc-cv-content-type-pdf-analtyics",m.NO_CALL).then((e=>{"true"===d.getItem("pdfViewer")&&e&&s.event(s.e.PDF_CONTENT_TYPE_EVENT)}));break;case"relay_to_content":this.relayMessageToContentScript(t);break;case"viewer-startup":t.main_op="viewer-startup",this.sendViewerStartupInformation(t,i.tab.url,r);break;case"check-cookie":r(d.getItem(t.key));break;case"set-cookie":d.setItem(t.key,t.value);break;case"check-mime-viewer-availability":n.isMimeHandlerAvailable().then((e=>{e?"false"===d.getItem("pdfViewer")||"true"===d.getItem("cdnFailure")?this.sendMessage({dend_op:"viewer-type",tabId:i.tab.id,viewer:"mime-native",is_pdf:!0}):t.url&&t.url.startsWith("file://")&&(this.isAllowedLocalFileAccess||(s.event(s.e.VIEWER_PDF_LOCAL_FILE_IGNORED),l.sendMessage({dend_op:"viewer-type",tabId:i.tab.id,viewer:"mime-native",is_pdf:!0}))):this.sendMessage({dend_op:"viewer-type",tabId:i.tab.id,viewer:"native",is_pdf:!0})}));break;case"uninstall":n.setViewerState("disabled"),d.setItem("pdfViewer","false"),d.setItem("always-show-pdf-menu","false"),e.mimeReloadAllTabs(),d.removeItem("userEligibleForUninstall"),chrome.runtime.setUninstallURL(""),s.event(s.e.UNINSTALL_DIALOG_UNINSTALLED_SUCCESSFUL),setTimeout((()=>{chrome.management.uninstallSelf()}),1e3);break;case"caret_mode_toggle_handler":chrome.runtime.sendMessage({main_op:"relay_to_content",content_op:"caret_mode_toggle_handler",status:t.toggleCaretModeValue});break;case"initialise-popup":this.initialisePopup(i.tab,r);break;case"cancelWebpageConversion":case"clearStatus":this.cancelConversion(this.tabs[i.tab.id]);break;case"triggerBufferSave":chrome.runtime.sendMessage({main_op:"triggerBufferSave"});break;case"closeExpressApp":u(i.tab.id);break;case"toggle-express-touch-points":g(t.allowed);break;default:return _[o]?(s.setOp({preview:"Copy",image_preview:"Image",send:"Send",fillsign:"FillSign",export:"Export",acom:"GotoAcom",to_pdf:"ConvertToPdf"}[t.handleResult]),_[o](t,i,r)):void e.consoleLog("failed to find handler for: "+o)}return!0}}gmailSelectors(){return Promise.resolve((()=>{const e=a.getFeatureMeta("dc-cv-gmail-selectors"),t=a.getFeatureMeta("dc-cv-gmail-selectors-list-view"),s=a.getFeatureMeta("dc-cv-gmail-selectors-native-viewer");let i={};try{i.messageView=JSON.parse(e),i.listView=JSON.parse(t),i.nativeViewer=JSON.parse(s)}catch(e){}return i})())}gmailFteToolTipConfig(){return Promise.resolve((()=>{let e=a.getFeatureMeta("dc-cv-gmail-fte-tooltip");try{e=JSON.parse(e)}catch(t){e={tooltip:{shortCoolDown:7,longCoolDown:60,maxFteCount:-1,resetDay:-1}}}return e})())}initStorageForGSuiteFlows(){d.getItem("cdnUrl")||o.updateVariables(this.version)}async gmailInit(t){const[s,i,r,n,o,l,d]=await Promise.all([this.gmailSelectors(),a.hasFlag("dc-cv-gmail-attachment-card-prompt"),a.hasFlag("dc-cv-gmail-selectors-list-view"),a.hasFlag("dc-cv-gmail-fte-tooltip"),a.hasFlag("dc-cv-gmail-drive-link-attachment-prompt"),this.gmailFteToolTipConfig(),chrome.storage.local.get("acrobat-gsuite-touch-points")]);t({enableAttachmentCardPromptInGmail:i,enableListViewPromptInGmail:r,enableDriveLinkAttachmentPromptInGmail:o,touchPointSettingEnabled:"false"!==d["acrobat-gsuite-touch-points"],selectors:s,acrobatPromptText:e.getTranslation("gsuiteOpenWithAcrobat"),gmailFteToolTipStrings:{title:e.getTranslation("acrobatGmailFteToolTipTitle"),description:e.getTranslation("acrobatGmailFteToolTipDescription"),button:e.getTranslation("acrobatGmailFteToolTipButton")},fteConfig:l,enableGmailFteToolTip:n}),this.initStorageForGSuiteFlows()}async gdriveInit(t){const s=await a.hasFlag("dc-cv-gdrive-open-in-extension"),i=a.getFeatureMeta("dc-cv-gdrive-selectors"),r=await a.hasFlag("dc-cv-gdrive-fte-tooltip"),n=a.getFeatureMeta("dc-cv-gdrive-fte-tooltip");let o,l;try{o=JSON.parse(i),l=JSON.parse(n)}catch(e){l={tooltip:{shortCoolDown:7,longCoolDown:60,maxFteCount:-1,resetDay:-1}}}t({enableOpenInExtension:s,acrobatPromptText:e.getTranslation("gsuiteOpenWithAcrobat"),selectors:o,fteToolTipStrings:{title:e.getTranslation("acrobatGsuiteFteToolTipTitle"),description:e.getTranslation("acrobatGsuiteFteToolTipDescription"),button:e.getTranslation("acrobatGsuiteFteToolTipButton")},fteConfig:l,enableFteToolTip:r}),this.initStorageForGSuiteFlows()}gdriveFteStateUpdated(e){chrome.tabs.query({url:["https://drive.google.com/*"]},(function(t){t?.forEach((function(t){t.id!==e.tabId&&chrome.tabs.sendMessage(t.id,{content_op:"acrobatGdriveFteStateUpdated",fteState:e?.fteState})}))}))}async gDriveDownloadPageInit(e){const t=a.getFeatureMeta("dc-cv-gdrive-download-page-selectors");let s;try{s=JSON.parse(t)}catch(e){}e({selectors:s})}gmailFteConfigUpdated(e){chrome.tabs.query({url:["https://mail.google.com/*"]},(function(t){t?.forEach((function(t){t?.id!==e.tabId&&chrome.tabs.sendMessage(t.id,{content_op:"acrobatGmailFteStateUpdated",fteState:e?.fteState})}))}))}async expressInit(t){const[s]=await Promise.all([h()]),i=s.enableExpressOptionsPagePreference,r=s.enableExpressTooltip,n=a.getFeatureMeta("dc-cv-express-context-menu-tooltip");let o;try{o=JSON.parse(n)}catch(e){o={minimumImageDimension:{height:50,width:50}}}const l=a.getFeatureMeta("dc-cv-express-context-menu-tooltip-exception-list");let d={exceptionListArray:[],enabled:!1};if(l){d.enabled=!0;try{d.exceptionListArray=JSON.parse(l)}catch(e){}}t({shouldEnableExpressTouchpointsPreference:i,showExpressTooltip:r,imageDimension:o.minimumImageDimension,exceptionInfo:d,expressTooltipStrings:{title:e.getTranslation("expressFteTitle"),description:e.getTranslation("expressFteDescription"),footer:e.getTranslation("expressFTEFooter")}})}async initialisePopup(s,i){let a={hostedURL:t.getPopupCDNUrl()};if(this.tabs[s.id]){a=e.extend(a,this.tabs[s.id]);const t=`chrome-extension://${chrome.runtime.id}`;s.url.startsWith(t)&&(a.is_viewer=!0);["chrome://extensions/",t,"chrome://newtab/","https://chrome.google.com","https://acrobat.adobe.com/link/file/?uri=","https://acrobat.adobe.com/id/urn:","https://acrobat.adobe.com/link/review/?uri="].some((e=>s.url.startsWith(e)))&&(a.isBlacklistedUrl=!0);if(!["downloading","pdf_downloading","waiting","in_progress","complete"].includes(a.current_status)||a.isBlacklistedUrl){const e=a.is_pdf;this.clearStatus(a),a.is_pdf=e}e.isLocalFileUrl(s.url)&&(a.is_pdf=!0,a.isFillnSignEnabled=l.FILL_N_SIGN_ENABLED),a.isAcrobat=e.isAcrobatAvailable(this.version),a.autoOpenPDFInAcrobat="false"!==d.getItem("ViewResultsPref")}i(a)}echoRequest(t){var i,a,r;if(!(l.CHROME_VERSION<l.SUPPORTED_VERSION)){if(!this.avoidUrl(t.url)){var n=t.id||t.tabId;return this.tabs[n]&&("cancelled"!==(i=this.tabs[n]).current_status&&"pdf_opened"!==i.current_status&&"pdf_failure"!==i.current_status&&"viewer_menu"!==i.panel_op||(r=i.is_pdf,this.clearStatus(i),i.is_pdf=r),i.current_status&&(i.panel_op="status"),a=i.is_pdf?"pdf_menu":"html_menu",i.panel_op&&"load-frictionless"===i.panel_op&&(delete i.panel_op,s.event(s.e.FRICTIONLESS_WIDGET_CLOSED)),"resize_window"===i.content_op&&(delete i.content_op,delete i.window_height),i.panel_op=i.panel_op||a,"html_menu"===a&&(i.persist=!1),i.incognito=t.incognito,e.isLocalFileUrl(t.url)&&(i.panel_op="pdf_menu",i.is_pdf=!0,i.isFillnSignEnabled=l.FILL_N_SIGN_ENABLED),t.url.startsWith(`chrome-extension://${chrome.runtime.id}`)?(i.panel_op="viewer_menu",i.is_viewer=!0):i.is_viewer=!1,e.consoleLog("repeat cached request: "+i.panel_op)),i}this.disable(t.id)}}setGlobals(e){this.globals=e}dump(t,s){var i,a=[s];for(i in t)t.hasOwnProperty(i)&&a.push("  "+i+": "+t[i]);e.consoleLog(a.join("\n"))}sendMessage(t,i=!0,a){var r,n=t.tabId;this.dump(t,"Sending message:"),t.version=this.version,e.consoleLog("sendMessage version",t),i&&(this.tabs[n]=e.extend(this.tabs[n],t)),t.NMHConnStatus=this.NMHConnStatus,t.show_frictionless=!0,t.is_edge=e.isEdge(),"flickr"===t.panel_op&&(r=s.e.FLICKR_OFFER_SHOWN),r&&s.checkAndLogAnalytics(r),e.sendMessage(t,this.globals,a),delete t.mimeHandled,delete this.tabs[n].mimeHandled}deferMessage(e){"undefined"==typeof setTimeout?this.sendMessage(e):setTimeout(this.proxy(this.sendMessage,e),0)}sendMessageToPopup(t,s=!0){const i=t.tabId;t.version=this.version,s&&(this.tabs[i]=e.extend(this.tabs[i],t)),t.NMHConnStatus=this.NMHConnStatus,t.is_edge=e.isEdge(),chrome.runtime.sendMessage(t)}filenameFromUrl(e){try{const t=decodeURIComponent(e),s=t.split("?")[0].split("/").filter((e=>e.length>0)),i=s.length>0?s[s.length-1]:"untitled";let a=i;const r=i.length-4;return(i.length<4||i.toLowerCase().indexOf(".pdf")!==r)&&(a+=".pdf"),a}catch(e){return"untitled.pdf"}}async pdf_menu(t,i){var a;if(delete(a=this.tabs[i.tab.id]=e.extend(this.tabs[i.tab.id],{tabId:i.tab.id})).dend_op,a.filename=this.filenameFromUrl(t.url),a.panel_op="pdf_menu",a.url=t.url,a.viewer=t.viewer,a.incognito=i.tab.incognito,a.fteFeatureFlag=t.fteFeatureFlag,a.isFillnSignEnabled=l.FILL_N_SIGN_ENABLED,a.isSharePointEnabled=r.isFeatureEnabled(),1==a.isSharePointEnabled&&(a.isSharePointURL=r.isAllowListedSharePointURL(a.url)),1==t.persist){const e=await this.isEnablePersistMenu(t);a.persist=!!e}else a.persist=!1;const n=d.getItem("fteDenied");var o=!(0==t.version||1==t.version||t.version===l.READER_VER||t.version===l.ERP_READER_VER);const c=l.VIEWER_ENABLED&&!d.getItem("pdfViewer")&&(!n||10!==parseInt(n))&&(!o||l.VIEWER_ENABLED_FOR_ACROBAT);if("false"!==d.getItem("always-show-pdf-menu")&&"mime"!==a.viewer&&(1!=a.persist||c||(delete a.fteFeatureFlag,s.event(s.e.PERSIST_PDF_MENU_SHOWN)),this.deferMessage(a)),c){let e,i=d.getItem("repromptCount");switch(t.fteFeatureFlag){case"dc-cv-fte-pdf-redcard":e=s.e.PERSIST_PDF_MENU_RED_CARD_FTE_SHOWN;break;case"dc-cv-fte-pdf-dmb":e=s.e.PERSIST_PDF_MENU_DMB_FTE_SHOWN;break;default:e=s.e.PERSIST_PDF_MENU_FTE_SHOWN}i?s.event(e,{LAUNCH:"Reprompt"}):s.event(e,{LAUNCH:"Launch"})}if(!a.incognito)if("true"!==d.getItem("pdfViewer")||"native"!==a.viewer&&"mime-native"!==a.viewer){if(!d.getItem("pdfViewer")||"false"===d.getItem("pdfViewer")){let e="Acrobat";this.legacyShim()?e="NoApp":this.version!==l.READER_VER&&this.version!==l.ERP_READER_VER||(e="Reader"),"native"!==a.viewer&&"mime-native"!==a.viewer||s.event(s.e.VIEWER_DISABLED_PDF_OPEN_NATIVE_VIEWER,{APPLICATION:e})}}else s.event(s.e.VIEWER_ENABLED_PDF_OPEN_NATIVE_VIEWER)}loaded(t){this.tabs[t]=e.extend(this.tabs[t],{tabId:t,loaded:!0})}setIsPDF(t,s){this.tabs[t]=e.extend(this.tabs[t],{tabId:t,is_pdf:s})}cancelConversion(e){this.getModule("acro-web2pdf").cancelConversion(e.tabId),delete e.current_status,delete e.file_path,delete e.domtitle,delete e.timing,delete e.panel_op,delete e.is_pdf,delete e.newUI}clearStatus(e,t){"in_progress"!==e.current_status&&"downloading"!==e.current_status&&(t||"waiting"!==e.current_status)&&this.cancelConversion(e)}loading(t){var s=t.id;this.tabs[s]=e.extend(this.tabs[s],{tabId:s,loaded:!1}),this.clearStatus(this.tabs[s],!0)}async active(t){this.activeTab=t.tabId,this.tabs[this.activeTab]=e.extend(this.tabs[this.activeTab],{tabId:t.tabId});if(await this.isEnablePersistMenu()){var s=this.echoRequest(this.tabs[this.activeTab]);s&&s.persist&&this.sendMessage(s)}}disable(e){this.tabs[e]&&(this.tabs[e].loaded=!1)}close(e){this.getModule("acro-web2pdf").cancelConversion(e),delete this.tabs[e],this.activeTab===e&&(this.activeTab=null)}tabReplace(e,t){this.close(t),this.loaded(e)}activeTab(){return this.activeTab}noop(){}avoidUrl(t){if(t=t||"",l.VIEWER_ENABLED&&d.getItem("pdfViewer")&&e.isViewerURL(t))return!1;if(this.version===l.ERP_READER_VER)return!0;if(t.startsWith("https://chrome.google.com"))return!0;if(this.version==l.READER_VER&&0==l.FRICTIONLESS_ENABLED)return!t.endsWith(".pdf")&&!t.endsWith(".PDF");if((0==this.version||1==this.version&&0==this.NMHConnStatus)&&!1===l.FRICTIONLESS_ENABLED)return!1;d.getItem("appLocale");const s=this.isAllowedLocalFileAccess&&e.isLocalFileUrl(t);return!t.startsWith("http")&&!s}}b||(b=new I,b.registerHandlers({"send-analytics":b.proxy(b.noop)}));export const communicate=b;