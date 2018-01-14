/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Control','./RenderManager'],function(q,C,R){"use strict";var b=R.RenderPrefixes;var H=C.extend("sap.ui.core.HTML",{metadata:{library:"sap.ui.core",properties:{content:{type:"string",group:"Misc",defaultValue:null},preferDOM:{type:"boolean",group:"Misc",defaultValue:true},sanitizeContent:{type:"boolean",group:"Misc",defaultValue:false},visible:{type:"boolean",group:"Appearance",defaultValue:true}},events:{afterRendering:{parameters:{isPreservedDOM:{type:"boolean"}}}}}});H.prototype.getDomRef=function(s){var i=s?this.getId()+"-"+s:this.getId();return q.sap.domById(b.Dummy+i)||q.sap.domById(i);};H.prototype.setContent=function(c){function p(s){if(q.parseHTML){var a=q.parseHTML(s);if(a){var d=0,e=a.length;while(d<e&&a[d].nodeType!=1){d++;}while(d<e&&a[e-1].nodeType!=1){e--;}if(d>0||e<a.length){a=a.slice(d,e);}return q(a);}}return q(s);}if(this.getSanitizeContent()){c=q.sap._sanitizeHTML(c);}this.setProperty("content",c,true);if(this.getDomRef()){var $=p(this.getContent());q(this.getDomRef()).replaceWith($);this._postprocessNewContent($);}else{this.invalidate();}return this;};H.prototype.setSanitizeContent=function(s){this.setProperty("sanitizeContent",s,true);if(s){this.setContent(this.getContent());}return this;};H.prototype.onBeforeRendering=function(){if(this.getPreferDOM()&&this.getDomRef()&&!R.isPreservedContent(this.getDomRef())){R.preserveContent(this.getDomRef(),true,false);}};H.prototype.onAfterRendering=function(){if(!this.getVisible()){return;}var $=q(q.sap.domById(b.Dummy+this.getId()));var a=R.findPreservedContent(this.getId());var c;var i=false;if((!this.getPreferDOM()||a.size()==0)){a.remove();c=new q(this.getContent());$.replaceWith(c);}else if(a.size()>0){$.replaceWith(a);c=a;i=true;}else{$.remove();}this._postprocessNewContent(c);this.fireAfterRendering({isPreservedDOM:i});};H.prototype._postprocessNewContent=function($){if($&&$.size()>0){if($.length>1){q.sap.log.warning("[Unsupported Feature]: "+this+" has rendered "+$.length+" root nodes!");}else{var c=$.attr("id");if(c&&c!=this.getId()){q.sap.log.warning("[Unsupported Feature]: Id of HTML Control '"+this.getId()+"' does not match with content id '"+c+"'!");}}R.markPreservableContent($,this.getId());if($.find("#"+this.getId().replace(/(:|\.)/g,'\\$1')).length===0){$.filter(":not([id])").first().attr("id",this.getId());}}else{q.sap.log.debug(""+this+" is empty after rendering, setting bOutput to false");this.bOutput=false;}};H.prototype.setDOMContent=function(d){var $=q(d);if(this.getDomRef()){q(this.getDomRef()).replaceWith($);this._postprocessNewContent($);}else{$.appendTo(R.getPreserveAreaRef());if(this.getUIArea()){this.getUIArea().invalidate();}this._postprocessNewContent($);}return this;};H.prototype.setTooltip=function(){q.sap.log.warning("The sap.ui.core.HTML control doesn't support tooltips. Add the tooltip to the HTML content instead.");return C.prototype.setTooltip.apply(this,arguments);};"hasStyleClass addStyleClass removeStyleClass toggleStyleClass".split(" ").forEach(function(m){H.prototype[m]=function(){q.sap.log.warning("The sap.ui.core.HTML control doesn't support custom style classes. Manage custom CSS classes in the HTML content instead.");return C.prototype[m].apply(this,arguments);};});return H;});
