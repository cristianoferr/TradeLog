/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.render=function(r,c){var m=c.getMode();r.write("<div");r.writeControlData(c);r.addClass("sapMSplitContainer");if(this.renderAttributes){this.renderAttributes(r,c);}if(!sap.ui.Device.system.phone){if(sap.ui.Device.orientation.portrait){c.addStyleClass("sapMSplitContainerPortrait");}switch(m){case"ShowHideMode":c.addStyleClass("sapMSplitContainerShowHide");break;case"StretchCompress":c.addStyleClass("sapMSplitContainerStretchCompress");break;case"PopoverMode":c.addStyleClass("sapMSplitContainerPopover");break;case"HideMode":c.addStyleClass("sapMSplitContainerHideMode");break;}}r.writeClasses(c);r.writeStyles();var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}r.write(">");if(this.renderBeforeContent){this.renderBeforeContent(r,c);}if(!sap.ui.Device.system.phone){c._bMasterisOpen=false;if((sap.ui.Device.orientation.landscape&&(m!=="HideMode"))||sap.ui.Device.orientation.portrait&&(m==="StretchCompress")){c._oMasterNav.addStyleClass("sapMSplitContainerMasterVisible");c._bMasterisOpen=true;}else{c._oMasterNav.addStyleClass("sapMSplitContainerMasterHidden sapMSplitContainerNoTransition");}if(c.getMode()==="PopoverMode"&&sap.ui.Device.orientation.portrait){c._oDetailNav.addStyleClass("sapMSplitContainerDetail");r.renderControl(c._oDetailNav);if(c._oPopOver.getContent().length===0){c._oPopOver.addAggregation("content",c._oMasterNav,true);}}else{c._oMasterNav.addStyleClass("sapMSplitContainerMaster");r.renderControl(c._oMasterNav);c._oDetailNav.addStyleClass("sapMSplitContainerDetail");r.renderControl(c._oDetailNav);}}else{c._oMasterNav.addStyleClass("sapMSplitContainerMobile");r.renderControl(c._oMasterNav);}r.write("</div>");};return S;},true);
