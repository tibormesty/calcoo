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
import{dcLocalStorage as e,dcSessionStorage as t}from"../../../common/local-storage.js";import{dcTabStorage as a}from"../tab-storage.js";import{util as n}from"../content-util.js";import{signInUtil as r}from"./signInUtils.js";import{privateApi as i}from"../content-privateApi.js";import{COOLDOWN_FOR_LFT_PROMPT as o,OptionPageActions as s,LOCAL_FILE_PERMISSION_URL as c,LOCAL_FTE_WINDOW as d}from"../../../common/constant.js";import{indexedDBScript as l}from"../../../common/indexDB.js";import{loggingApi as m}from"../../../common/loggingApi.js";import{updateExtUserState as g,isNewUser as p}from"../../../common/util.js";import f from"./ResponseHeaders.js";import u from"./BookmarkUtils.js";import I from"./LruUtil.js";import{analytics as h,events as w}from"../../../common/analytics.js";import{fileUtil as b}from"./fileUtil.js";await e.init(),await t.init();const v=e.getItem("appLocale");let S=!1;!function(){let d,y,_,L,E,P,R,T,k,U,D,C,B,F,A,M,x,O,V,N,$,H,W,G,j="";const z=chrome.runtime.getURL("viewer.html"),q=chrome.runtime.getURL("signInHandler.html"),J="file:",Y=["https:","http:",J],K=e=>{if(!e)return!1;try{const t=new URL(e),a=t.protocol;let n=-1!==Y.indexOf(a);return n=a===J?t.pathname.toLowerCase().endsWith(".pdf"):n,n}catch(e){return!1}};function X(e){const t=a.getItem("search");return new URLSearchParams(t).get(e)}function Z(e,t){return F?(A=A||1,e.tabId=A,e.mimeHandled=!0,chrome.runtime.sendMessage(e,t)):chrome.runtime.sendMessage(e,t)}function Q(e,t){return new URLSearchParams(e).get(t)||""}function ee(){if(L=Q(document.location.search,"pdfurl"),H=Q(document.location.search,"tabId"),W=Q(document.location.search,"aw"),!K(L))return void(E=!1);!function(){const e=new URLSearchParams(document.location.search),n=t.getItem("rtParams");if(n){const a=n.split(",").map((t=>e.has(t)?`&${t}=${e.get(t)}`:null)).join("")||"";t.setItem("payPalUrl",a),t.removeItem("rtParams")}e.has("dialog!dropin")&&a.setItem("dialog!dropin",e.get("dialog!dropin")),e.has("load!dropin")&&a.setItem("load!dropin",e.get("load!dropin"))}();const e=a.getItem("search");(!e||Q(e,"pdfurl")!==L||e.length<document.location.search)&&a.setItem("search",document.location.search),_=Q(document.location.search,"pdffilename")||Q(e,"pdffilename")||Se(L),document.title=_;const n="/"+L+location.hash;history.replaceState({},_,n)}function te(t=!1){if(F)try{t||Z({main_op:"viewer-type",viewer:"mime-native"}),setTimeout((()=>{i.reloadWithNativeViewer({contentLength:parseInt(d)||0})}),100)}catch(e){ne("DCBrowserExt:Viewer:FallbackToNative:Failed")}else try{setTimeout((()=>{chrome.tabs.getCurrent((function(t){e.setItem(`reloadurl-${t.id}`,L),window.location.href=L}))}),500)}catch(e){ne("DCBrowserExt:Viewer:FallbackToNative:Failed")}}const ae=t=>{try{const a=new URL(e.getItem("cdnUrl")),n=[/^https:\/\/([a-zA-Z\d-]+\.){0,}(adobe|acrobat)\.com(:[0-9]*)?$/];return t===a.origin&&!!n.find((e=>e.test(t)))}catch(e){return!1}};function ne(e){const t={main_op:"analytics"};t.analytics=[[e]],Z(t)}function re(){return $e(L)?`${z}?pdfurl=${encodeURIComponent(L)}&pdffilename=${encodeURIComponent(document.title)}`:L}function ie(){let e,t=z;return F?(e="?mimePdfUrl="+encodeURIComponent(L),t=q):(e=a.getItem("search"),e||(e="?pdfurl="+encodeURIComponent(L))),new URL(t+e)}const oe=["AdobeID","openid","DCAPI","sign_user_read","sign_user_write","sign_user_login","sign_library_read","sign_library_write","agreement_send","agreement_read","agreement_write","ab.manage","additional_info.account_type","sao.ACOM_ESIGN_TRIAL","widget_read","widget_write","workflow_read","workflow_write"];function se(t={}){if(e.getItem("csi")){const e=re(),a={...t,pdfUrl:e};return void r.cdnSignIn(a)}const a=ie(),i=e.getItem("cdnUrl"),o=t.sign_up?1:0,s=n.generateStateCSRF(),c=e.getItem("enableCSRF"),d=JSON.stringify({touchp:t.touchpoint||"",signIn:!0,...c&&{state:s}}),l=e.getItem("theme")||"auto",m=`${i}?la=true&locale=${v||e.getItem("locale")}&theme=${l}&ru=${encodeURIComponent(a.href)}&rp=${d}&su=${o}#/susi`;chrome.tabs.update({url:m,active:!0})}function ce(){let e;e=F?ie().href:window.location.href,r.sign_out(e)}function de(t={}){if(e.getItem("csi")){const e={...t,pdfUrl:L};return void r.cdnSignIn(e)}let n=new URL(q);const i=t.idp_token;return n.searchParams.append("socialSignIn","true"),n.searchParams.append("mimePdfUrl",encodeURIComponent(L)),a.setItem("idp_token",i),n.href}function le(e={}){F?chrome.tabs.update({url:de(e),active:!0}):r.socialSignIn(e,ie(),L)}function me(t={}){if(e.getItem("csi")){try{const e=new URL(JSON.parse(t.url));delete t.url;const a={...t,pdfUrl:re()},n=r.getCDNSignURL(a);e.searchParams.append("redirect_uri",n),chrome.tabs.update({url:e.href,active:!0})}catch(e){chrome.tabs.update({url:L})}return}const i=t.application||"google",o=e.getItem("viewerImsClientIdSocial"),s=e.getItem("imsURL"),c=n.uuid(),d=ie();d.hash=d.hash+"signIn=true";const l=new URL(s+"/ims/authorize/v1"),m={ac:n.getAppCode(),csrf:c};a.setItem("csrf",c),l.searchParams.append("response_type","token"),l.searchParams.append("idp_flow","social.deep_link.web"),l.searchParams.append("client_id",o),l.searchParams.append("provider_id",i),l.searchParams.append("redirect_uri",d),l.searchParams.append("scope",oe.join(",")),l.searchParams.append("locale",v||e.getItem("locale")),l.searchParams.append("state",JSON.stringify(m)),l.searchParams.append("xApiClientId",o),l.searchParams.append("xApiClientLocation ",i),chrome.tabs.update({url:l.href,active:!0})}const ge={isSharePointURL:!1,isSharePointFeatureEnabled:!1,isFrictionlessEnabled:!0,featureFlags:[],isFillAndSignRegisteryEnabled:!1};class pe{constructor(e){this.iframeElement=void 0,this.parentDiv=e}createIframe=t=>{const a=window.document,n=(e.getItem("cdnUrl"),a.createElement("iframe"));n.setAttribute("src",t),n.setAttribute("id","dc-view-frame"),n.setAttribute("allowfullscreen","allowfullscreen"),n.setAttribute("allow","clipboard-read; clipboard-write; local-fonts;"),n.style.width="100vw",n.style.height="100vh",n.style.border="none",n.style.overflow="hidden",this.parentDiv.appendChild(n),m.info({message:"Viewer Iframe created"}),this.iframeElement=a.getElementById("dc-view-frame")};_sendMessage=(e,t)=>{this.iframeElement&&ae(t)&&function(e){let t=Date.now();return new Promise((function a(n,r){P&&(E||F)?n(E||F):e&&Date.now()-t>=e?r(new Error("timeout")):setTimeout(a.bind(this,n,r),30)}))}(1e6).then((a=>a&&this.iframeElement.contentWindow.postMessage(e,t)))};sendStartupConfigs=(e,a)=>{this._sendMessage({type:"nativeConfigs",nativeConfigs:ge,extUrl:encodeURI(e),returnParamsUrl:t.getItem("payPalUrl"),isInstallTypeUpsell:S},a)};sendFileMetaData=(e,t,a,n,r,i,o,s)=>{this._sendMessage({fileUrl:r,fileName:i,fileSize:a,acceptRanges:n,handShakeTime:t,type:e,isFrictionlessEnabled:ge.isFrictionlessEnabled,isReloadOrBackForward:s,isMimeHandled:F},o)};sendSubmitFormResponse=(e,t)=>{this._sendMessage({type:"submitForm",response:e},t)};sendRecentUrl=async(e,t,a,n=!1)=>{await chrome.extension.isAllowedFileSchemeAccess()||(t=t?.filter((e=>!e.url.startsWith("file://")))),this._sendMessage({type:"RecentUrls",permission:e,showOverlay:n,recentUrls:t},a)};sendProgress=(e,t,a,n)=>{this._sendMessage({total:t,loaded:a,type:e},n)};sendInitialBuffer=(e,t,a,n,r)=>{this._sendMessage({type:e,downLoadstartTime:t,downLoadEndTime:a,buffer:n},r)};sendBufferRanges=(e,t,a,n)=>{this._sendMessage({type:e,range:t,buffer:a},n)};preview=(e,t,n,r,i,o,s)=>{const c="true"===a.getItem("bufferFromIndexedDB");a.removeItem("bufferFromIndexedDB"),this._sendMessage({fileSize:n,type:e,fileBuffer:t,fileName:r,downLoadstartTime:i,downLoadEndTime:o,fromIndexedDB:c},s)};openInAcrobatResponse=(e,t,a)=>{this._sendMessage({type:e,res:t},a)};postLog=(e,t,a,n,r)=>{this._sendMessage({type:e,reqId:t,message:a,error:n},r)};sendCertificateValidationResponse=(e,t)=>{this._sendMessage({type:"certificateValidationResponse",response:e},t)}}function fe(t,a){try{D=void 0!==D?D:"false"!==e.getItem("logAnalytics")&&"false"!==e.getItem("ANALYTICS_OPT_IN_ADMIN"),D&&(k&&y?k.postLog("log",U,t,a,y.origin):setTimeout((()=>{k&&y&&k.postLog("log",U,t,a,y.origin)}),500))}catch(e){}}function ue(){let e;return e=F?L:window.location.href,e}function Ie(){const t=ue(),n=(t.split("#")||[]).pop();if(n.indexOf("access_token=")>-1)try{const i=new URLSearchParams(n).get("access_token"),{client_id:o}=JSON.parse(window.atob(i.split(".")[1]))||{},s=e.getItem("viewerImsClientId");if([s,e.getItem("viewerImsClientIdSocial")].includes(o)){const e=a.getItem("csrf");a.removeItem("csrf");const n=r.parseCSRF(new URL(t));(!e||!n||n!==e)&&(ne("DCBrowserExt:Viewer:User:Error:NonMatchingCsrfToken:FailedToLogin"),ce())}}catch{}}function he(t,a,n,r,i){i&&t.forEach((e=>{n.has(e)&&a.searchParams.append(e,n.get(e))})),r&&t.forEach((t=>{""!==e.getItem(t)&&a.searchParams.append(t,e.getItem(t))}))}const we=()=>{try{const r=e.getItem("cdnUrl"),i=new URL(r);if(!ae(i.origin))return fe("Invalid CDN URL detected","Invalid Origin"),void te();y||(y=i);let o=e.getItem("viewer-locale");o||(o=e.getItem("locale"));const s="false"!==e.getItem("logAnalytics"),c="false"!==e.getItem("ANALYTICS_OPT_IN_ADMIN"),d=s&&c?"true":c?"optinOff":"gpoOff",l="true"===e.getItem("betaOptOut");i.searchParams.append("locale",v||o),i.searchParams.append("logAnalytics",d),i.searchParams.append("callingApp",chrome.runtime.id),i.searchParams.append("betaOptOut",l),i.searchParams.append("lfa",e.getItem("isAllowedLocalFileAccess")||"false"),i.searchParams.append("enableCaretMode",O),t.getItem("signInTp")&&i.searchParams.append("touchp",t.getItem("signInTp")),i.searchParams.append("rvu",e.getItem("userState")?.rvu??null);const m=e.getItem("installType")||"update",g=e.getItem("installSource");i.searchParams.append("version",`${chrome.runtime.getManifest().version}:${m}`),i.searchParams.append("installSource",g),i.searchParams.append("storage",JSON.stringify(e.getItem("viewerStorage")||{})),i.searchParams.append("tabId",H),"false"===e.getItem("staticFteCoachmarkShown")&&i.searchParams.append("showFTECoachmark","true"),"true"!==X("googlePrint")&&!0!==M||"false"===a.getItem("googleAppsPrint")||i.searchParams.append("googleAppsPrint","true"),i.searchParams.append("sdp",e.getItem("sdp")?"1":"0"),i.searchParams.append("sds",e.getItem("sds")?"1":"0"),i.searchParams.append("lf",e.getItem("lf")?"1":"0");const f=$.read(L);f&&(delete f.filename,delete f.lastVisited,i.searchParams.append("docState",JSON.stringify(f))),i.searchParams.append("nu",p()),i.searchParams.append("rs",e.getItem("rs")?"1":"0"),i.searchParams.append("nm",e.getItem("supportNightMode")?"1":"0"),i.searchParams.append("dpt",e.getItem("isDarkPageThemeEnabled")?"1":"0"),i.searchParams.append("adminDisableGenAI","true"===e.getItem("DISABLE_GENAI_BY_ADMIN")?"1":"0");const u=["dropin!","provider!","app!","forceDisableGenAI"],I=["analytics","logToConsole","enableLogging","frictionless","sessionId","linearization","ev","ao"],h=["rrv","isDeskTop","isAcrobat","theme","defaultOwnerShipExperiment","sessionId","ev","ao","ip","rate","genAI","mv","pi","ks","edd","tpt","lft","fsu","dcs","egal","ots","egaf","gga","pnb","subv2","s3d","ips","ripe"];let w=a.getItem("signinTouchPointData");w=JSON.parse(w||"{}"),w&&"object"==typeof w&&Object.keys(w).length&&(i.searchParams.append("tp",w.touchpoint),i.searchParams.append("acmt",w.allowCommentsInShare?"1":"0")),a.removeItem("signinTouchPointData");e.getItem("env");let b;b=F?new URLSearchParams(new URL(L).search):new URLSearchParams(window.location.search);n=i,["dialog!dropin","load!dropin"].forEach((e=>{""!==(a.getItem(e)||"")&&n.searchParams.append(e,a.getItem(e))})),he(I,i,b,!1,!0),he(h,i,b,!0,!1);let S=i.href;u.forEach((e=>{b.forEach(((t,a)=>{a.startsWith(e)&&(S=S+"&"+a+"="+t)}))})),""===t.getItem("payPalUrl")||""===a.getItem("dialog!dropin")&&""===a.getItem("load!dropin")||(S+=t.getItem("payPalUrl"));const _=a.getItem("access_token");return a.removeItem("access_token"),e.setItem("lastPdfOpenTimestamp",(new Date).getTime()),`${S}${_?`/#${_}`:""}`}catch(e){ne("DCBrowserExt:Viewer:Iframe:Creation:Failed"),te()}var n},be=(a,n,r="localStorage")=>{if(n){const i="localStorage"===r?e.getItem(a):t.getItem(a);let o;i&&i.tabsInfo?(o=i.tabsInfo,o.includes(n)||o.push(n)):o=[n],"localStorage"===r?e.setItem(a,{tabsInfo:o}):t.setItem(a,{tabsInfo:o})}},ve=()=>{try{!function(){try{let e=ue();e&&e.indexOf("#")>-1&&(r.saveAccessToken(e),r.signInAnalyticsLogging(e),r.checkSignInFromEditVerbPaywall(e),e=e.split("#")[0],F?L=e:(window.location.hash=e,history.replaceState(null,document.title,e)))}catch(e){}}(),F&&(H=A);const a=window.document.getElementById("Adobe-dc-view");F||(d=X("clen")||-1),k=new pe(a);const n=we();k.createIframe(n),g(),window.addEventListener("message",(a=>{!a.data||!ae(a.origin)||R||"hsready"!==a.data.type&&"ready"!==a.data.type||(R=!0,T=(new Date).getTime(),U=a.data.requestId,"on"===a.data.killSwitch?(ne("DCBrowserExt:Viewer:KillSwitch:Turned:On"),e.setItem("pdfViewer","false"),i.setViewerState("disabled"),e.setItem("killSwitch","on"),F?te(!0):setTimeout((()=>{window.location.href=L}),200)):e.getItem("killSwitch")&&(ne("DCBrowserExt:Viewer:KillSwitch:Turned:Off"),e.removeItem("killSwitch")),t.getItem("signInTp")&&t.removeItem("signInTp"))}))}catch(e){fe("Error create Iframe",e)}};function Se(e){if(_)return _;let t=e;try{const a=e.split("?")[0].split("/").filter((e=>e.length>0)),n=a.length>0?a[a.length-1]:"untitled";t=n;const r=n.length-4;(n.length<4||n.toLowerCase().indexOf(".pdf")!==r)&&(t+=".pdf")}catch(e){fe("Error in getFileNameFromURL",e)}return t}function ye(e,t){return function(a){if(this.readyState==this.HEADERS_RECEIVED){if(!function(e,t){const a=e.getResponseHeader("content-type"),n=$e(t),r=e.getResponseHeader("content-disposition");if(a){const e=a.toLowerCase().split(";",1)[0].trim();if(!n&&r&&/^\s*attachment[;]?/i.test(r))return!1;if("application/pdf"===e)return!0;if("application/octet-stream"===e&&r&&/\.pdf(["']|$)/i.test(r))return!0}return!1}(e,t))return fe("Fall back to native - not pdf from headers"),te();if(E=!0,"true"===W){const e=this.getResponseHeader("accept-ranges"),a=this.getResponseHeader("content-length");e&&"bytes"===e&&a&&Number(a)>0&&Z({main_op:"setupWorkerOffscreen",pdfURL:t,pdfSize:+a,acceptRanges:!0,tabId:H})}}}}function _e(e,t){let a=!1;return function(n){n.lengthComputable&&(d=n.total,e.sendProgress("progress",n.total,n.loaded,t),a||(!function(e){const t=$.read(L)||{},a={main_op:"getFileSize",fileSize:e,tabId:H,docLastOpenState:t,target:"offscreen"};chrome.runtime.sendMessage(a)}(d),a=!0))}}function Le(e,t){"PDF"===function(e){if(e)try{let t=new URL(e).pathname;return t.substr(t.lastIndexOf(".")+1).toUpperCase()}catch(e){return""}return""}(e)&&(E=!0);const a=new XMLHttpRequest;a.open("GET",e),a.responseType="arraybuffer",a.onreadystatechange=function(){4===a.readyState&&(200!==a.status&&0!=a.status||(t({buffer:a.response,mimeType:a.getResponseHeader("content-type")}),Pe(a.response)))},a.send(null)}async function Ee(){try{const t=a.getItem("bufferTabId");if(t){const e=await l.getDataFromIndexedDB(t);if(e&&e.fileBuffer)return a.setItem("bufferFromIndexedDB",!0),E=!0,{buffer:e.fileBuffer}}else{const t=e.getItem("tabIdMap");if(t){const n=(F?await chrome.tabs.query({active:!0,currentWindow:!0}):[await chrome.tabs.getCurrent()])[0];if(n&&t[n.id]){a.setItem("bufferTabId",t[n.id]);const r=await l.getDataFromIndexedDB(t[n.id]);if(Object.keys(t).length>1?(delete t[n.id],e.setItem("tabIdMap",t)):e.removeItem("tabIdMap"),r&&r.fileBuffer)return a.setItem("bufferFromIndexedDB",!0),E=!0,{buffer:r.fileBuffer}}}}}catch(e){}return a.setItem("bufferFromIndexedDB",!1),{}}function Pe(e){const t=$.read(L)||{},a=new Blob([e],{type:"application/pdf"}),n={main_op:"getFileBuffer",fileBufferBlob:URL.createObjectURL(a),tabId:H,docLastOpenState:t,target:"offscreen"};chrome.runtime.sendMessage(n)}function Re(e,t){ne(`DCBrowserExt:Viewer:SignIn:AdobeYolo:${e}:clicked`),chrome.tabs.query({active:!0,currentWindow:!0},(function(e){var t=e[0]&&e[0].id;be("adobeYoloTabsInfo",t,"sessionStorage")})),Z({main_op:"launchJumpUrl",details:{source:e,userGuid:t}},(t=>{k._sendMessage({type:"adobeYoloJumpResponse",response:t,source:e},y.origin)}))}function Te(e,t,...a){F?l.storeBufferAndCall(e,t,A,...a):chrome.tabs.getCurrent((function(n){l.storeBufferAndCall(e,t,n.id,...a)}))}function ke(e){k._sendMessage({type:"redirectToAcrobatWeb",response:e},y.origin)}function Ue(){F?chrome.tabs.reload(A):chrome.tabs.getCurrent((e=>{chrome.tabs.reload(e.id)}))}function De(r,d){switch(d.data.main_op){case"open_in_acrobat":case"fillsign":!async function(t,a){const r={main_op:"open_in_acrobat"};if("fillsign"===a.data.main_op&&(r.paramName="FillnSign"),r.url=a.data.url,r.click_context="pdfviewer",r.timeStamp=Date.now(),r.filename=a.data&&a.data.filename,a.data.fileBuffer){const e=new Blob([a.data.fileBuffer],{type:"application/pdf"});r.dataURL=URL.createObjectURL(e)}if(x=function(e){"fillsign"===a.data.main_op?t.openInAcrobatResponse("FILLSIGN_IN_DESKTOP_APP",e,a.origin):t.openInAcrobatResponse("OPEN_IN_DESKTOP_APP",e,a.origin),fe(`Open In Acrobat - (${a.data.main_op}) response- ${e}`)},e.getItem("isSharepointFeatureEnabled"))if(ge.isSharePointURL)r.workflow_name="SharePoint",r.isSharePointURL=!0,Z(r,x);else{const e=await n.checkForSharePointURL(r.url);r.isSharePointURL=e,e&&(r.workflow_name="SharePoint"),Z(r,x)}else Z(r,x)}(r,d);break;case"complete_conversion":ne("DCBrowserExt:Viewer:Verbs:Conversion:Redirection"),function(e){const t={};t.main_op=e.data.main_op,t.conversion_url=decodeURIComponent(e.data.conversion_url),t.timeStamp=Date.now(),Z(t)}(d);break;case"updateLocale":ne("DCBrowserExt:Viewer:User:Locale:Updated"),e.setItem("viewer-locale",d.data.locale),Z({main_op:"localeChange",locale:d.data.locale}),chrome.tabs.reload();break;case"setInitialLocale":let g=!1;e.getItem("viewer-locale")||(g=!0,e.setItem("viewer-locale",d.data.locale),ne("DCBrowserExt:Viewer:User:Locale:Initial")),d.data.reloadReq&&g&&chrome.tabs.reload();break;case"error-sign-in":!function(e){const t=n.uuid();a.setItem("csrf",t);const r=new URL(e),i=ie();i.hash=i.hash+`state=${t}&signInError=true`,r.searchParams.set("redirect_uri",i),chrome.tabs.update({url:r.href,active:!0})}(d.data.url);break;case"deleteViewerLocale":e.getItem("viewer-locale")&&(e.removeItem("viewer-locale"),chrome.tabs.reload());break;case"signin":ne("DCBrowserExt:Viewer:Ims:Sign:In"),a.setItem("signInSource",d.data.source),a.setItem("signinTouchPointData",JSON.stringify({touchpoint:d.data.tp,allowCommentsInShare:d.data.allowCommentsInShare})),ne(`DCBrowserExt:Viewer:Ims:Sign:In:${d.data.source}`),Te(d.data.fileBuffer,se,d.data);break;case"googleSignIn":ne("DCBrowserExt:Viewer:Ims:Sign:In"),ne(`DCBrowserExt:Viewer:Ims:Sign:In:${d.data.source}`),a.setItem("signInSource",d.data.source),Te(d.data.fileBuffer,me,d.data);break;case"signup":ne("DCBrowserExt:Viewer:Ims:Sign:Up"),a.setItem("signUpSource",d.data.source),ne(`DCBrowserExt:Viewer:Ims:Sign:Up:${d.data.source}`),Te(d.data.fileBuffer,se,d.data);break;case"reload_viewer":chrome.tabs.reload();break;case"reload_current_tab":Ue();case"upsell_event":!function(e){if(e&&e.url){const a=new URL(decodeURIComponent(e.url));e.returnUrlParams&&t.setItem("rtParams",e.returnUrlParams.toString()),"_blank"===e.target?chrome.tabs.create({url:a.href,active:!0}):chrome.tabs.update({url:a.href,active:!0})}}(d.data);break;case"upsell_remove_urlParams":t.removeItem("rtParams"),t.removeItem("payPalUrl"),a.removeItem("dialog!dropin"),a.removeItem("load!dropin");break;case"fetchLocalRecents":const p=new URL(e.getItem("cdnUrl")).origin;if(d.data.fetchRecents){const e=d.data.showOverlay;!async function(e,t,a=!1){const n=$.getAllItems();e.sendRecentUrl(!0,n,t,a)}(k,p,e)}else k.sendRecentUrl(!0,null,p);break;case"socialSignIn":ne("DCBrowserExt:Viewer:Ims:Sign:In"),ne(`DCBrowserExt:Viewer:Ims:Sign:In:${d.data.source}`),a.setItem("signInSource",d.data.source),Te(d.data.fileBuffer,le,d.data);break;case"openRecentFileLink":const f={};f.main_op=d.data.main_op,f.recent_file_url=decodeURIComponent(d.data.recent_file_url),f.file_name=d.data.file_name,Z(f);break;case"updateCurrentURL":!async function(e){const{redirectURL:t,copyToClipboard:a}=e;if(a)try{await navigator.clipboard.writeText(a)}catch(e){}const n=F?A:(await chrome.tabs.getCurrent())?.id;chrome.tabs.update(n,{url:t})}(d.data);break;case"saveFileBufferAndReload":case"saveFileBufferAndReload":Te(d.data.fileBuffer,Ue);break;case"userSubscriptionData":if(F){const e={};e.eventType=d.data.main_op,e.userSubscriptionData=d.data.userSubscriptionData,e.data=d.data,e.main_op=d.data.main_op;Z(e,(function(e){e&&"showUninstallPopUp"===e.main_op&&k._sendMessage({type:"showUninstallPopUp"},y.origin)}))}break;case"uninstall":F&&Z({main_op:"uninstall",defaultUrl:L});break;case"submit_form":fetch(d.data.resource,d.data.options).then((e=>{k.sendSubmitFormResponse(e.ok,d.origin)})).catch((()=>{k.sendSubmitFormResponse(!1,d.origin)}));break;case"ownerShipExperimentShown":e.removeItem("defaultOwnerShipExperiment");break;case"openAcrobatOptions":chrome.runtime.openOptionsPage(),ne(`DCBrowserExt:Viewer:ManagePref:clicked:${d.data.source}`);break;case"openExtensionSettings":const I=e.getItem("openSettingsInWindow");I?chrome.tabs.query({active:!0,currentWindow:!0},(function(t){const a=t[0];e.setItem("lastOpenTabId",a.id),n.openExtensionSettingsInWindow(a)})):chrome.tabs.create({url:c,active:!0}),h.event(w.LOCAL_FILE_ACCESS_TOUCHPOINT_SETTINGS_OPENED,{VARIANT:I?"InWindow":"InTab"}),e.setItem("LocalFileAccessTouchpointsFromViewer",!0),setTimeout((()=>{e.removeItem("LocalFileAccessTouchpointsFromViewer")}),o),Z({main_op:"triggerBufferSave"});break;case"encryptedWriteFile":({secureString:j}=d.data),Ae(document.title);break;case"launchJump":Te(d.data.fileBuffer,Re,d.data.source,d.data.userGuid);break;case"saveAsEvent":!async function(e){try{if(ne("DCBrowserExt:Viewer:SaveToMyComputer:"+(N?"fileHandlerExist":"fileHandlerNotExist")),N)G=!1;else{const t={suggestedName:`${e.fileName}.pdf`,types:[{description:"PDF file",accept:{"application/pdf":[".pdf"]}}]};N=await window.showSaveFilePicker(t),G=!0,Ae(N?.name)}k._sendMessage({type:"newSaveToLocalResponse",newAsset:G,updatedFileName:N?.name},y.origin)}catch(e){N=null,fe("Save As Handler Error",e),k._sendMessage({type:"newSaveToLocalResponse",error:e},y.origin)}}(d.data);break;case"downloadFile":!async function(e){try{let t=e.fileUrl;if(!t){const a=new Blob([e.fileBuffer],{type:"application/pdf"});t=URL.createObjectURL(a)}await chrome.downloads.download({url:t,conflictAction:"uniquify",saveAs:!0,...e.fileName&&{filename:`${e.fileName}.pdf`}})}catch(e){fe("downloadFile error",e),k._sendMessage({type:"downloadFileError"},y.origin)}}(d.data);break;case"rememberSaveLocationPreference":!function(t){let a="";t.cloudStorage&&!e.getItem("selectedSaveLocationPreference")?a="PreferenceMigrationSuccess":t.cloudStorage||(a="SaveDialogRememberMe");a&&ne(`DCBrowserExt:Viewer:ChangeSaveLocationPreference:${a}`);(!t.cloudStorage||t.cloudStorage&&!e.getItem("selectedSaveLocationPreference"))&&(e.setItem("saveLocation",t.saveLocation),e.setItem("selectedSaveLocationPreference",!0),Z({panel_op:"options_page",requestType:s.OPTIONS_UPDATE_TOGGLE,toggleId:"saveLocationPreferenceTitle",toggleVal:t.saveLocation}))}(d.data);break;case"appRenderingDone":qe();break;case"saveFileBuffer":Te(d.data.fileBuffer);break;case"deleteFileBuffer":const b=a.getItem("bufferTabId");b&&l.deleteDataFromIndexedDB(b),a.removeItem("bufferTabId");case"appRenderingDone":qe();break;case"writeToLocalSavedFile":!async function(e){try{const t=await N.createWritable();await t.write(e.fileBuffer),await t.close(),k._sendMessage({type:"newSaveToLocalResponse",newAsset:G,updatedFileName:N?.name,isFileWriteStage:!0},y.origin)}catch(e){N=null,fe("Write to Local File Error",e),k._sendMessage({type:"newSaveToLocalResponse",error:e,isFileWriteStage:!0},y.origin)}}(d.data);break;case"bookmarkWeb":u(d.data.url,ke,ne);break;case"updateDocumentViewState":!function(e){const{documentViewState:t}=e;$.writeAndSyncWithHistory(L,t)}(d.data);break;case"validateEdgeCertificateForDigitalSignature":i.validateCertificate(d.data).then((e=>k.sendCertificateValidationResponse(e,d.origin)));break;case"documentViewThemeChange":!function(t){e.getItem("theme")!==t.data&&(e.setItem("theme",t.theme),Z({panel_op:"options_page",requestType:s.OPTIONS_UPDATE_TOGGLE,toggleId:"appearancePrefTitle",toggleVal:t.theme}));e.getItem("isDarkPageThemeEnabled")!==t.isDarkPageThemeEnabled&&e.setItem("isDarkPageThemeEnabled",t.isDarkPageThemeEnabled)}(d.data);break;case"enableGenAIFeaturesToggledFromViewer":m=d.data,e.getItem("egaf")!==m.isEnabled&&(e.setItem("egaf",m.isEnabled.toString()),Z({panel_op:"options_page",requestType:s.OPTIONS_UPDATE_TOGGLE,toggleId:"enableGenAIFeaturesTitle",toggleVal:m.isEnabled}));break;case"genAIEligible":!function(t){e.setItem("genAIEligible",t.isEligible.toString())}(d.data);break;case"rrvLayerRemoved":chrome.runtime.sendMessage({main_op:"rrvLayerRemoved",tabId:d.data.tabId,target:"offscreen"})}var m}function Ce(e){try{const t=new TextDecoder("utf-8").decode(e.buffer);let a=!1;-1!=t.indexOf("Linearized 1")?a=!0:-1!=t.indexOf("Linearized")&&ne("DCBrowserExt:Viewer:Linearization:Linearized:Version:Other"),k._sendMessage({type:"Linearization",linearized:a},y.origin)}catch(e){ne("DCBrowserExt:Viewer:Linearization:Linearized:Detection:Failed"),fe("Linearization Detection failed",e)}}function Be(t,a,n,r){n.then((n=>{const i=n.downLoadEndTime,o=n.buffer;n.buffer.byteLength;t.preview("preview",o,d,_,r,i,a.origin),k._sendMessage({type:"NavigationStartTime",time:window.performance&&window.performance.timing&&window.performance.timing.navigationStart},y.origin),!0===e.getItem("isSaveLocationPrefEnabled")&&k._sendMessage({type:"changeSaveLocationPreference",saveLocation:e.getItem("saveLocation"),onLoad:!0},y.origin)})).catch((e=>(ne("DCBrowserExt:Viewer:Error:FallbackToNative:FileDownload:Failed"),te()))).finally((()=>{e.removeItem("sessionStarted")}))}class Fe{constructor(){this.request={main_op:"analytics"}}analytics=e=>{this.request.analytics||(this.request.analytics=[]),this.request.analytics.push([e])};sendAnalytics=()=>{Z(this.request)}}function Ae(e){e&&(document.title=e+j)}const Me=(t,a,n)=>{const r=n?"viewerStorage":"viewerStorageAsync",i=e.getItem(r)||{};i[t]=a,e.setItem(r,i)},xe=t=>{const a=e.getItem("viewerStorage")||{},n=e.getItem("viewerStorageAsync")||{};delete a[t],delete n[t],e.setItem("viewerStorage",a),e.setItem("viewerStorageAsync",n)};function Oe(t,n,r,i){return o=>{try{if(o.data&&o.origin&&ae(o.origin)&&(e=>{try{return e&&e.source&&e.source.top.location.origin==="chrome-extension://"+chrome.runtime.id}catch(e){return!1}})(o)){if(o.data.main_op)return De(t,o);switch(o.data.type){case"ready":if(F?async function(t,n,r,i){let o=new Fe;P=!0;const s=L;document.title=_;const c=V.getHeaderValue("accept-ranges"),l=!a.getItem("bufferTabId")&&c&&"bytes"===c.toLowerCase()?"true":"false";t.sendFileMetaData("metadata",T,d,l,s,_,n.origin,!1),We(),r&&r.then((e=>{t.sendInitialBuffer("initialBuffer",e.startTime,e.endTime,e.buffer,n.origin),Ce(e)})).catch((e=>{t.sendInitialBuffer("initialBuffer",0,0,-1,n.origin),o.analytics("DCBrowserExt:Viewer:Error:Linearization:InitialBufiled")})),e.removeItem("isReload"),e.removeItem("isBackForward");const m=window.performance&&window.performance.timing&&window.performance.timing.navigationStart,g=Ee();(await g).buffer?Be(t,n,g,m):(fetch(i.streamUrl).then((e=>{let a=0;return new Response(new ReadableStream({start(r){const i=e.body.getReader();!function e(){i.read().then((({done:i,value:o})=>{i?r.close():(a+=o.byteLength,t.sendProgress("progress",d,a,n.origin),r.enqueue(o),e())})).catch((e=>{r.error(e)}))}()}}))})).then((e=>e.arrayBuffer())).then((a=>{d=a.byteLength,Pe(a),t.preview("preview",a,a.byteLength,_,m,(new Date).getTime(),n.origin),k._sendMessage({type:"NavigationStartTime",time:window.performance&&window.performance.timing&&window.performance.timing.navigationStart},n.origin),!0===e.getItem("isSaveLocationPrefEnabled")&&k._sendMessage({type:"changeSaveLocationPreference",saveLocation:e.getItem("saveLocation"),onLoad:!0},n.origin)})).catch((e=>(o.analytics("DCBrowserExt:Viewer:Error:FallbackToNative:FileDownload:Failed"),te()))),o.sendAnalytics()),fe("Viewer loaded")}(t,o,r,n):function(e,t,n,r,i){P=!0;const o=L,s=!a.getItem("bufferTabId")&&X("chunk")||"false",c=window.performance.getEntriesByType("navigation").map((e=>e.type)).includes("reload"),l=window.performance.getEntriesByType("navigation").map((e=>e.type)).includes("back_forward");e.sendFileMetaData("metadata",T,d,s,encodeURI(o),_,t.origin,c||l),We(),n?n.then((a=>{e.sendInitialBuffer("initialBuffer",a.startTime,a.endTime,a.buffer,t.origin),Ce(a)})).catch((a=>{e.sendInitialBuffer("initialBuffer",0,0,-1,t.origin),m.error("Linearization InitialBuffer Failed")})):e.sendInitialBuffer("initialBuffer",0,0,-1,t.origin),Be(e,t,r,i),fe("Viewer loaded")}(t,o,r,n,i),Z({main_op:"getUserInfoFromAcrobat"},(e=>{k._sendMessage({type:"adobeYoloUserData",...e},y.origin)})),o.data.visitorID){const t=e.getItem("viewerVisitorID");e.setItem("viewerVisitorID",o.data.visitorID),t&&t!==o.data.visitorID&&ne("DCBrowserExt:Analytics:viewerVisitorID:MCMID:Changed")}break;case"getFileBufferRange":!function(e,t){let a={url:L};b.getFileBufferRange(a,e.data.range).then((a=>{B||(B=!0),t.sendBufferRanges("bufferRanges",`${e.data.range.start}-${e.data.range.end}`,a.buffer,e.origin)})).catch((a=>{ne("DCBrowserExt:Viewer:Error:Linearization:Range:Failed"),t.sendBufferRanges("bufferRanges",`${e.data.range.start}-${e.data.range.end}`,-1,e.origin)}))}(o,t);break;case"previewFailed":C||(ne("DCBrowserExt:Viewer:Error:FallbackToNative:Preview:Failed"),C=!0,te());break;case"lastUserGuid":e.setItem("lastUserGuid",o.data.value);break;case"signin":ne("DCBrowserExt:Viewer:Ims:Sign:In"),se();break;case"signout":ne("DCBrowserExt:Viewer:Ims:Sign:Out"),e.removeItem("viewer-locale"),e.removeItem("userDetailsFetchedTimeStamp"),e.removeItem("discoveryExpiryTime"),e.removeItem("viewer-locale"),Te(o.data.fileBuffer,ce);break;case"googleAppsPrintShown":a.setItem("googleAppsPrint","false"),ne("DCBrowserExt:Viewer:GoogleApps:Print:Shown");break;case"signInExperimentShown":chrome.tabs.query({active:!0,currentWindow:!0},(function(t){const a=t[0],n=(new Date).getTime();e.setItem("signInExperimentShown",JSON.stringify({currTabId:a.id,timestamp:n}))}));break;case"disableViewer":e.setItem("pdfViewer","false"),chrome.tabs.reload();break;case"signInExperimentClosed":case"signInExperimentSkipped":e.setItem("signInExperimentSuppressed","true");break;case"enableBeta":e.setItem("betaOptOut","false"),chrome.tabs.reload();break;case"disableBeta":e.setItem("betaOptOut","true"),chrome.tabs.reload();break;case"updateTitle":Ae(o.data.title);break;case"viewer_set_item":Me(o.data.key,o.data.value,o.data.startup);break;case"viewer_remove_item":xe(o.data.key)}}}catch(e){ne("DCBrowserExt:Viewer:Error:MessageHandler:Unknown")}}}function Ve(){if(!R)return ne("DCBrowserExt:Viewer:Error:Handshake:TimedOut"),te(),!1}const Ne=t=>{try{e.getItem("enableCSRF")&&Ie();const n=V.getHeaderValue("content-length");d=n;const r=V.getHeaderValue("accept-ranges"),i=r&&"bytes"===r.toLowerCase();L=t.originalUrl,ve(),_=function(){let e;const t=V.getHeaderValue("content-disposition");if(t&&/\.pdf(["']|$)/i.test(t)){const a=/filename[^;=\n\*]?=((['"]).*?\2|[^;\n]*)/.exec(t);null!=a&&a.length>1&&(e=a[1].replace(/['"]/g,""))}return e||(e=Se(L)),decodeURIComponent(e)}();const o={url:L},s=new URL(e.getItem("cdnUrl"));y||(y=s);let c=null;const l="false"!==X("linearization")&&!a.getItem("bufferTabId");l&&i&&n>0&&(c=b.getFileBufferRange(o,{start:0,end:1024})),window.addEventListener("message",Oe(k,t,c)),Ge(),setTimeout(Ve,25e3)}catch(e){fe("InitMimeHandlerScript failed",e),te()}},$e=e=>e&&new URLSearchParams(e)?.has("acrobatPromotionSource"),He=async()=>{try{if(e.getItem("enableCSRF")&&Ie(),!K(L))return void(E=!1);ve();const t=X("clen")||-1,n=X("chunk")||!1,r="false"!==X("linearization")&&!a.getItem("bufferTabId"),i={url:L},o=(new Date).getTime(),s=new URL(e.getItem("cdnUrl"));_=X("pdffilename"),_=_?encodeURIComponent(_):Se(L),document.title=decodeURIComponent(_),y||(y=s);let c=null;const d=r&&n&&t>0;d&&(c=b.getFileBufferRange(i,{start:0,end:1024}));const l=Ee(),m=(await l).buffer?l:function(e,t,a){return new Promise(((n,r)=>{const i=L;if(i.startsWith("file://"))return void Le(i,n);const o=new XMLHttpRequest;o.open("GET",i),o.responseType="arraybuffer",t&&o.setRequestHeader("If-Range","randomrange"),o.onreadystatechange=ye(o,i),o.onprogress=_e(e,a),o.onload=()=>{if(o.status>=200&&o.status<400)n({buffer:o.response,mimeType:o.getResponseHeader("content-type"),downLoadEndTime:(new Date).getTime()}),Pe(o.response);else{const e={status:o.status,statusText:o.statusText};r({message:"Invalid response fetching content",error:e})}},o.onerror=e=>{r({message:"Error to download file contents",error:e})},o.ontimeout=e=>{r({message:"Timeout to download file contents",error:e})},o.send()}))}(k,d,s.origin);window.addEventListener("message",Oe(k,m,c,o)),setTimeout(Ve,25e3),(()=>{try{L&&$e(L)&&ne(`DCBrowserExt:Viewer:ExtnViewerPdfOpened:${Q(new URL(L)?.search,"acrobatPromotionSource")}`)}catch(e){}})()}catch(e){fe("InitScript failed",e),te()}};function We(){if(a.getItem("signInAction")){const e=a.getItem("signInAction");k._sendMessage({type:"signInInformation",action:e,source:"signIn"===e?a.getItem("signInSource"):a.getItem("signUpSource")},y.origin),a.removeItem("signInSource"),a.removeItem("signUpSource"),a.removeItem("signInAction")}}async function Ge(){chrome.storage.onChanged.addListener(((t,a)=>{"local"===a&&Object.entries(t).forEach((([t,{newValue:a}])=>{switch(t){case"theme":k._sendMessage({type:"themeChange",theme:a},y.origin);break;case"ANALYTICS_OPT_IN_ADMIN":{const t="false"!==e.getItem("logAnalytics"),n="false"!==a;k._sendMessage({type:"analyticsTrackingChange",value:t&&n},y.origin);break}case"saveLocation":k._sendMessage({type:"changeSaveLocationPreference",saveLocation:a},y.origin);break;case"isDarkPageThemeEnabled":k._sendMessage({type:"darkPageThemeChange",isDarkPageThemeEnabled:a},y.origin);break;case"egaf":k._sendMessage({type:"enableGenAIFeaturesToggled",enableGenAIFeatures:a},y.origin);break;case"akamai":Z({main_op:"reRegisterUninstallUrl"})}}))})),await async function(){return S=await i.isInstalledViaUpsell(),S}(),k._sendMessage({type:"setAsyncStorage",storage:e.getItem("viewerStorageAsync")},y.origin),Z({main_op:"viewer-startup",url:L,startup_time:Date.now(),viewer:!0},(e=>{ge.isSharePointURL=!!e.isSharePointURL,ge.isSharePointFeatureEnabled=!!e.isSharePointEnabled,ge.isFrictionlessEnabled=!!e.isFrictionlessEnabled,ge.featureFlags=e.featureFlags,ge.isFillAndSignRegisteryEnabled=e.isFillnSignEnabled;const t=ie().href;k.sendStartupConfigs(t,y.origin)})),Z({main_op:"get-features&groups",cachePurge:"LAZY"},(e=>{k._sendMessage({type:"featureGroups",featureGroups:e.featureGroups,featureFlags:e.featureFlags,ffResponse:e.ffResponse},y.origin)})),F?setTimeout((()=>be("loadedTabsInfo",A)),2e3):Z({main_op:"updateLoadedTabsInfo"}),$.writeAndSyncWithHistory(L,{filename:_,lastVisited:Date.now()})}function je(e){Z({main_op:"caret_mode_toggle_handler",toggleCaretModeValue:e})}function ze(t){switch(t.panel_op&&!0===t.reload_in_native&&(delete t.is_viewer,chrome.tabs.reload(t.tabId)),t.content_op){case"showLocalFileAccessToast":t.tabId&&t.tabId!==e.getItem("lastOpenTabId")||k._sendMessage({type:"showLocalFileAccessToast"},y.origin);break;case"rapidRenditionResponse":k._sendMessage({type:"rapidRenditionResponse",pageRendition:t.pageRendition,perfMarker:t.perfMarker},y.origin);break;case"rapidRenditionError":k._sendMessage({type:"rapidRenditionError",error:t.error},y.origin)}switch(t.main_op){case"relay_to_content":if("dismiss"===t.content_op){delete t.content_op,delete t.reload_in_native;let e=document.getElementById("__acrobatDialog__");return void(e&&(e.remove(),e=null))}"caret_mode_toggle_handler"===t.content_op&&k._sendMessage({type:"toggleCaretMode",toggleCaretModeValue:t.status},y.origin);break;case"reset":k._sendMessage({type:"toggleAnalytics",logAnalytics:t.analytics_on},y.origin);break;case"showUninstallPopUp":k._sendMessage({type:"showUninstallPopUp"},y.origin);break;case"jumpUrlSuccess":(!F||t.tabInfo&&t.tabInfo.includes(A))&&k._sendMessage({type:"adobeYoloJumpUrlSuccess"},y.origin);break;case"triggerBufferSave":k._sendMessage({type:"triggerBufferSave"},y.origin);break;case"downloadFileSuccess":k._sendMessage({type:"downloadFileSuccess"},y.origin)}return!1}function qe(){const t=e.getItem("userState");let a=!1;if(void 0!==t?.rvu&&(a=!0),!0!==t.rvu){const t={rvu:a};e.setItem("userState",t)}}document.addEventListener("DOMContentLoaded",function(e){const t=(new Date).getTime();let a=window.setInterval((function(){(function(){const e=document.getElementById("dc-view-frame");return e&&e.contentWindow&&1===e.contentWindow.length}()||(new Date).getTime()-t>15e3)&&(window.clearInterval(a),e.call(this))}),200)}((function(){const e=document.getElementById("dc-view-frame");e&&e.contentWindow&&e.contentWindow.focus()}))),void 0!==chrome.runtime&&($=new I,i.isMimeHandlerAvailable().then((async function(t){if(chrome.runtime.onMessage.addListener(ze),t){if(F=!0,!window.navigator.onLine&&e.getItem("offlineSupportDisable"))return void te();e.getItem("sessionStarted")||(e.setItem("sessionId",n.uuid()),e.setItem("sessionStarted",!0));const t=await i.getStreamInfo()||{};V=new f(t.responseHeaders),A=t.tabId;let a=await Z({main_op:"check-is-google-print"});M=a&&a.isGooglePrint,O=await i.caretModeStatus(),i.addCaretModeListener(je),Z({main_op:"viewer-preview",startup_time:Date.now(),viewer:!0},(()=>Ne(t)));const r=V.getHeaderValue("content-length"),o=V.getHeaderValue("accept-ranges"),s=o&&"bytes"===o.toLowerCase();r>0&&s&&Z({main_op:"setupWorkerOffscreen",pdfURL:t.originalUrl,pdfSize:+r,acceptRanges:s});e.getItem("firstOpenedTabId")||e.setItem("firstOpenedTabId",A)}else ee(),He(),Ge()})))}();