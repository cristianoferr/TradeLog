/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/Device','./InputBase','./DateTimeField','sap/ui/model/type/Date','sap/ui/model/odata/type/ODataType','sap/ui/core/date/UniversalDate','./library'],function(q,D,I,a,b,O,U,l){"use strict";var c=a.extend("sap.m.DatePicker",{metadata:{library:"sap.m",properties:{displayFormatType:{type:"string",group:"Appearance",defaultValue:""},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance",defaultValue:null},minDate:{type:"object",group:"Misc",defaultValue:null},maxDate:{type:"object",group:"Misc",defaultValue:null}},aggregations:{specialDates:{type:"sap.ui.core.Element",multiple:true,singularName:"specialDate"}},associations:{legend:{type:"sap.ui.core.Control",multiple:false}},events:{navigate:{parameters:{dateRange:{type:"sap.ui.unified.DateRange"}}}},designTime:true}});c.prototype.init=function(){I.prototype.init.apply(this,arguments);this._bIntervalSelection=false;this._bOnlyCalendar=true;this._bDatePickerInstance=this.getMetadata().getName()==="sap.m.DatePicker";this._bValid=true;this._oMinDate=new Date(1,0,1);this._oMinDate.setFullYear(1);this._oMaxDate=this._bDatePickerInstance?new Date(9999,11,31):new Date(9999,11,31,23,59,59,99);};c.prototype.exit=function(){I.prototype.exit.apply(this,arguments);if(this._oPopup){if(this._oPopup.isOpen()){this._oPopup.close();}delete this._oPopup;}if(this._oCalendar){this._oCalendar.destroy();delete this._oCalendar;}if(this._iInvalidateCalendar){q.sap.clearDelayedCall(this._iInvalidateCalendar);}this._sUsedDisplayPattern=undefined;this._sUsedDisplayCalendarType=undefined;this._oDisplayFormat=undefined;this._sUsedValuePattern=undefined;this._sUsedValueCalendarType=undefined;this._oValueFormat=undefined;this._bDatePickerInstance=undefined;};c.prototype.invalidate=function(o){if(!o||o!=this._oCalendar){sap.ui.core.Control.prototype.invalidate.apply(this,arguments);this._iInvalidateCalendar=q.sap.delayedCall(0,this,k);}};c.prototype.onBeforeRendering=function(){I.prototype.onBeforeRendering.apply(this,arguments);this._checkMinMaxDate();};c.prototype.setWidth=function(w){return I.prototype.setWidth.call(this,w||"100%");};c.prototype.getWidth=function(w){return this.getProperty("width")||"100%";};c.prototype.applyFocusInfo=function(F){this._bFocusNoPopup=true;I.prototype.applyFocusInfo.apply(this,arguments);};c.prototype.onfocusin=function(E){if(!q(E.target).hasClass("sapUiIcon")){I.prototype.onfocusin.apply(this,arguments);}this._bFocusNoPopup=undefined;};c.prototype.onsapshow=function(E){d.call(this);E.preventDefault();};c.prototype.onsaphide=c.prototype.onsapshow;c.prototype.onsappageup=function(E){f.call(this,1,"day");E.preventDefault();};c.prototype.onsappageupmodifiers=function(E){if(!E.ctrlKey&&E.shiftKey){f.call(this,1,"month");}else{f.call(this,1,"year");}E.preventDefault();};c.prototype.onsappagedown=function(E){f.call(this,-1,"day");E.preventDefault();};c.prototype.onsappagedownmodifiers=function(E){if(!E.ctrlKey&&E.shiftKey){f.call(this,-1,"month");}else{f.call(this,-1,"year");}E.preventDefault();};c.prototype.onkeypress=function(E){if(!E.charCode||E.metaKey||E.ctrlKey){return;}var F=this._getFormatter(true);var C=String.fromCharCode(E.charCode);if(C&&F.sAllowedCharacters&&F.sAllowedCharacters.indexOf(C)<0){E.preventDefault();}};c.prototype.onclick=function(E){if(q(E.target).hasClass("sapUiIcon")){d.call(this);}};c.prototype._dateValidation=function(o){if(o&&(o.getTime()<this._oMinDate.getTime()||o.getTime()>this._oMaxDate.getTime())){this._bValid=false;this._oWantedDate=o;o=undefined;}else{this._bValid=true;this.setProperty("dateValue",o,true);this._oWantedDate=undefined;}return o;};c.prototype.setMinDate=function(o){if(o&&!(o instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}if(q.sap.equal(this.getMinDate(),o)){return this;}if(o){var y=o.getFullYear();if(y<1||y>9999){throw new Error("Date must be between 0001-01-01 and 9999-12-31; "+this);}this._oMinDate=new Date(o.getTime());var m=this.getDateValue();if(m&&m.getTime()<o.getTime()){q.sap.log.warning("DateValue not in valid date -> changed to minDate",this);this.setDateValue(new Date(o.getTime()));}}else{this._oMinDate=new Date(1,0,1);this._oMinDate.setFullYear(1);}this.setProperty("minDate",o,false);if(this._oCalendar){this._oCalendar.setMinDate(o);}if(this._bDatePickerInstance){this._oMinDate.setHours(0,0,0,0);}return this;};c.prototype.setMaxDate=function(o){if(o&&!(o instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}if(q.sap.equal(this.getMaxDate(),o)){return this;}if(o){var y=o.getFullYear();if(y<1||y>9999){throw new Error("Date must be between 0001-01-01 and 9999-12-31; "+this);}this._oMaxDate=new Date(o.getTime());var m=this.getDateValue();if(m&&m.getTime()>o.getTime()){q.sap.log.warning("DateValue not in valid date -> changed to maxDate",this);this.setDateValue(new Date(o.getTime()));}}else{this._oMaxDate=new Date(9999,11,31,23,59,59,99);}this.setProperty("maxDate",o,false);if(this._oCalendar){this._oCalendar.setMaxDate(o);}if(this._bDatePickerInstance){this._oMaxDate.setHours(0,0,0,0);}return this;};c.prototype._checkMinMaxDate=function(){if(this._oMinDate.getTime()>this._oMaxDate.getTime()){q.sap.log.warning("minDate > MaxDate -> dates switched",this);var m=new Date(this._oMinDate.getTime());var M=new Date(this._oMaxDate.getTime());this._oMinDate=new Date(M.getTime());this._oMaxDate=new Date(m.getTime());this.setProperty("minDate",M,true);this.setProperty("maxDate",m,true);if(this._oCalendar){this._oCalendar.setMinDate(M);this._oCalendar.setMaxDate(m);}}if(this._oWantedDate&&this._oWantedDate.getTime()>=this._oMinDate.getTime()&&this._oWantedDate.getTime()<=this._oMaxDate.getTime()){this.setDateValue(this._oWantedDate);}};c.prototype.getDisplayFormatType=function(){return this.getProperty("displayFormatType");};c.prototype._handleDateValidation=function(o){if(!o||o.getTime()<this._oMinDate.getTime()||o.getTime()>this._oMaxDate.getTime()){this._bValid=false;q.sap.log.warning("Value can not be converted to a valid date",this);}else{this._bValid=true;this.setProperty("dateValue",o,true);}};c.prototype.setDisplayFormatType=function(s){if(s){var F=false;for(var t in sap.ui.core.CalendarType){if(t==s){F=true;break;}}if(!F){throw new Error(s+" is not a valid calendar type"+this);}}this.setProperty("displayFormatType",s,true);this.setDisplayFormat(this.getDisplayFormat());return this;};c.prototype.setSecondaryCalendarType=function(C){this._bSecondaryCalendarTypeSet=true;this.setProperty("secondaryCalendarType",C,true);if(this._oCalendar){this._oCalendar.setSecondaryCalendarType(C);}return this;};c.prototype.addSpecialDate=function(s){j.call(this,s);this.addAggregation("specialDates",s,true);k.call(this);return this;};c.prototype.insertSpecialDate=function(s,m){j.call(this,s);this.insertAggregation("specialDates",s,m,true);k.call(this);return this;};c.prototype.removeSpecialDate=function(s){var r=this.removeAggregation("specialDates",s,true);k.call(this);return r;};c.prototype.removeAllSpecialDates=function(){var r=this.removeAllAggregation("specialDates",true);k.call(this);return r;};c.prototype.destroySpecialDates=function(){this.destroyAggregation("specialDates",true);k.call(this);return this;};c.prototype.setLegend=function(L){this.setAssociation("legend",L,true);var s=this.getLegend();if(s){if(!sap.ui.unified.CalendarLegend){sap.ui.getCore().loadLibrary("sap.ui.unified");q.sap.require("sap.ui.unified.library");}L=sap.ui.getCore().byId(s);if(L&&!(L instanceof sap.ui.unified.CalendarLegend)){throw new Error(L+" is not an sap.ui.unified.CalendarLegend. "+this);}}if(this._oCalendar){this._oCalendar.setLegend(s);}return this;};c.prototype.onChange=function(E){if(!this.getEditable()||!this.getEnabled()){return;}var v=this._$input.val();var o=this._formatValue(this.getDateValue());if(v==o&&this._bValid){return;}var m;this._oWantedDate=undefined;this._bValid=true;if(v!=""){m=this._parseValue(v,true);if(!m||m.getTime()<this._oMinDate.getTime()||m.getTime()>this._oMaxDate.getTime()){this._bValid=false;m=undefined;}else{v=this._formatValue(m);}}if(this.getDomRef()&&(this._$input.val()!==v)){this._$input.val(v);this._curpos=this._$input.cursorPos();}if(m){v=this._formatValue(m,true);}if(this._lastValue!==v||(m&&this.getDateValue()&&m.getFullYear()!==this.getDateValue().getFullYear())){this._lastValue=v;this.setProperty("value",v,true);var n=this.getValue();if(this._bValid&&v==n){this.setProperty("dateValue",m,true);}v=n;if(this._oPopup&&this._oPopup.isOpen()){if(this._bValid){m=this.getDateValue();}this._oCalendar.focusDate(m);var s=this._oDateRange.getStartDate();if((!s&&m)||(s&&m&&s.getTime()!=m.getTime())){this._oDateRange.setStartDate(new Date(m.getTime()));}else if(s&&!m){this._oDateRange.setStartDate(undefined);}}this.fireChangeEvent(v,{valid:this._bValid});}};c.prototype._getInputValue=function(v){v=(typeof v=="undefined")?this._$input.val():v.toString();var o=this._parseValue(v,true);v=this._formatValue(o,true);return v;};c.prototype.updateDomValue=function(v){if(this.isActive()&&(this._$input.val()!==v)){this._bCheckDomValue=true;v=(typeof v=="undefined")?this._$input.val():v.toString();this._curpos=this._$input.cursorPos();var o=this._parseValue(v,true);v=this._formatValue(o);this._$input.val(v);this._$input.cursorPos(this._curpos);}return this;};function _(){this._createPopup();this._createPopupContent();var C;var B=this.getBinding("value");if(B&&B.oType&&B.oType.oOutputFormat){C=B.oType.oOutputFormat.oFormatOptions.calendarType;}else if(B&&B.oType&&B.oType.oFormat){C=B.oType.oFormat.oFormatOptions.calendarType;}if(!C){C=this.getDisplayFormatType();}if(C){this._oCalendar.setPrimaryCalendarType(C);}var v=this._bValid?this._formatValue(this.getDateValue()):this.getValue();if(v!=this._$input.val()){this.onChange();}this._fillDateRange();this._openPopup();this.fireNavigate({dateRange:this._getVisibleDatesRange(this._oCalendar)});}c.prototype._createPopup=function(){if(!this._oPopup){q.sap.require("sap.ui.core.Popup");this._oPopup=new sap.ui.core.Popup();this._oPopup.setAutoClose(true);this._oPopup.setDurations(0,0);this._oPopup.attachOpened(g,this);this._oPopup.attachClosed(h,this);}};c.prototype._openPopup=function(){if(!this._oPopup){return;}this._oPopup.setAutoCloseAreas([this.getDomRef()]);var m=sap.ui.core.Popup.Dock;var A;if(this.getTextAlign()==sap.ui.core.TextAlign.End){A=m.EndBottom+"-4";this._oPopup.open(0,m.EndTop,A,this,null,"fit",true);}else{A=m.BeginBottom+"-4";this._oPopup.open(0,m.BeginTop,A,this,null,"fit",true);}};c.prototype._getVisibleDatesRange=function(C){var v=C._getVisibleDays();return new sap.ui.unified.DateRange({startDate:v[0].toLocalJSDate(),endDate:v[v.length-1].toLocalJSDate()});};c.prototype._createPopupContent=function(){if(!this._oCalendar){sap.ui.getCore().loadLibrary("sap.ui.unified");q.sap.require("sap.ui.unified.library");this._oCalendar=new sap.ui.unified.Calendar(this.getId()+"-cal",{intervalSelection:this._bIntervalSelection,minDate:this.getMinDate(),maxDate:this.getMaxDate(),legend:this.getLegend(),startDateChange:function(){this.fireNavigate({dateRange:this._getVisibleDatesRange(this._oCalendar)});}.bind(this)});this._oDateRange=new sap.ui.unified.DateRange();this._oCalendar.addSelectedDate(this._oDateRange);if(this.$().closest(".sapUiSizeCompact").length>0){this._oCalendar.addStyleClass("sapUiSizeCompact");}if(this._bSecondaryCalendarTypeSet){this._oCalendar.setSecondaryCalendarType(this.getSecondaryCalendarType());}if(this._bOnlyCalendar){this._oCalendar.attachSelect(this._selectDate,this);this._oCalendar.attachCancel(e,this);this._oCalendar.attachEvent("_renderMonth",i,this);this._oCalendar.setPopupMode(true);this._oCalendar.setParent(this,undefined,true);this._oPopup.setContent(this._oCalendar);}}};c.prototype._fillDateRange=function(){var o=this.getDateValue();if(o){this._oCalendar.focusDate(new Date(o.getTime()));if(!this._oDateRange.getStartDate()||this._oDateRange.getStartDate().getTime()!=o.getTime()){this._oDateRange.setStartDate(new Date(o.getTime()));}}else{var F=new Date();var m=this._oMaxDate.getTime()+86400000;if(F.getTime()<this._oMinDate.getTime()||F.getTime()>m){F=this._oMinDate;}this._oCalendar.focusDate(F);if(this._oDateRange.getStartDate()){this._oDateRange.setStartDate(undefined);}}};c.prototype.getAccessibilityInfo=function(){var r=this.getRenderer();var o=I.prototype.getAccessibilityInfo.apply(this,arguments);var v=this.getValue()||"";if(this._bValid){var m=this.getDateValue();if(m){v=this._formatValue(m);}}o.type=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_DATEINPUT");o.description=[v,r.getLabelledByAnnouncement(this),r.getDescribedByAnnouncement(this)].join(" ").trim();return o;};function d(){if(this.getEditable()&&this.getEnabled()){if(!this._oPopup||!this._oPopup.isOpen()){_.call(this);}else{e.call(this);}}}c.prototype._selectDate=function(E){var o=this.getDateValue();var m=this._getSelectedDate();var v="";if(!q.sap.equal(m,o)){this.setDateValue(new Date(m.getTime()));v=this.getValue();this.fireChangeEvent(v,{valid:true});if(this.getDomRef()&&(D.system.desktop||!D.support.touch)&&!q.sap.simulateMobileOnDesktop){this._curpos=this._$input.val().length;this._$input.cursorPos(this._curpos);}}else if(!this._bValid){v=this._formatValue(m);if(v!=this._$input.val()){this._bValid=true;if(this.getDomRef()){this._$input.val(v);this._lastValue=v;}this.setProperty("value",v,true);this.fireChangeEvent(v,{valid:true});}}else if((D.system.desktop||!D.support.touch)&&!q.sap.simulateMobileOnDesktop){this.focus();}this._oPopup.close();};c.prototype._getSelectedDate=function(){var s=this._oCalendar.getSelectedDates();var o;if(s.length>0){o=s[0].getStartDate();}return o;};function e(E){if(this._oPopup&&this._oPopup.isOpen()){this._oPopup.close();if((D.system.desktop||!D.support.touch)&&!q.sap.simulateMobileOnDesktop){this.focus();}}}function f(n,u){var o=this.getDateValue();var C=this._$input.cursorPos();if(o&&this.getEditable()&&this.getEnabled()){var s;var B=this.getBinding("value");if(B&&B.oType&&B.oType.oOutputFormat){s=B.oType.oOutputFormat.oFormatOptions.calendarType;}else if(B&&B.oType&&B.oType.oFormat){s=B.oType.oFormat.oFormatOptions.calendarType;}if(!s){s=this.getDisplayFormatType();}var m=U.getInstance(new Date(o.getTime()),s);o=U.getInstance(new Date(o.getTime()),s);switch(u){case"day":m.setDate(m.getDate()+n);break;case"month":m.setMonth(m.getMonth()+n);var M=(o.getMonth()+n)%12;if(M<0){M=12+M;}while(m.getMonth()!=M){m.setDate(m.getDate()-1);}break;case"year":m.setFullYear(m.getFullYear()+n);while(m.getMonth()!=o.getMonth()){m.setDate(m.getDate()-1);}break;default:break;}if(m.getTime()<this._oMinDate.getTime()){m=new U(this._oMinDate.getTime());}else if(m.getTime()>this._oMaxDate.getTime()){m=new U(this._oMaxDate.getTime());}if(!q.sap.equal(this.getDateValue(),m.getJSDate())){this.setDateValue(new Date(m.getTime()));this._curpos=C;this._$input.cursorPos(this._curpos);var v=this.getValue();this.fireChangeEvent(v,{valid:true});}}}function g(E){this._renderedDays=this._oCalendar.$("-Month0-days").find(".sapUiCalItem").length;this.$("inner").attr("aria-owns",this.getId()+"-cal");this.$("inner").attr("aria-expanded",true);}function h(E){this.$("inner").attr("aria-expanded",false);}function i(E){var m=E.getParameter("days");if(m>this._renderedDays){this._renderedDays=m;this._oPopup._applyPosition(this._oPopup._oLastPosition);}}function j(s){if(!sap.ui.unified.DateTypeRange){sap.ui.getCore().loadLibrary("sap.ui.unified");q.sap.require("sap.ui.unified.library");}if(s&&!(s instanceof sap.ui.unified.DateTypeRange)){throw new Error(s+"is not valid for aggregation \"specialDates\" of "+this);}}function k(){if(this._oPopup&&this._oPopup.isOpen()){this._oCalendar._bDateRangeChanged=true;this._oCalendar.invalidate();}}return c;},true);