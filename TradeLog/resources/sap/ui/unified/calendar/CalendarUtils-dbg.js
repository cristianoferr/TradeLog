/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Calendar Utility Class
 *
 * @namespace
 * @name sap.ui.unified.calendar
 * @public
 */

// Provides class sap.ui.unified.calendar.CalendarUtils
sap.ui.define(['jquery.sap.global', 'sap/ui/core/date/UniversalDate', './CalendarDate'],
	function (jQuery, UniversalDate, CalendarDate) {
		"use strict";

		// Static class

		/**
		 * @alias sap.ui.unified.calendar.CalendarUtils
		 * @namespace
		 * @private
		 */
		var CalendarUtils = {};

		/**
		 * The maximum ECMAScript Date converted to milliseconds.
		 * @type {number} milliseconds
		 * @private
		 */
		CalendarUtils.MAX_MILLISECONDS = 8640000000000000;

		/**
		 * 24 hours as milliseconds
		 * @type {number} milliseconds
		 * @private
		 */
		CalendarUtils.HOURS24 = 1000 * 3600 * 24;

		/**
		 * Creates a Date in local timezone from UTC timezone
		 * @param {Date} oDate in UTC timezone
		 * @param {boolean} bTime if set the time part of the date will be used too, otherwise it will be initial
		 * @return {Date} in local timezone
		 * @private
		 */
		CalendarUtils._createLocalDate = function (oDate, bTime) {

			var oLocaleDate;

			if (oDate) {
				var oMyDate;

				if (oDate instanceof UniversalDate) {
					oMyDate = oDate.getJSDate();
				} else {
					oMyDate = oDate;
				}

				oLocaleDate = new Date(oMyDate.getUTCFullYear(), oMyDate.getUTCMonth(), oMyDate.getUTCDate());
				if (oMyDate.getFullYear() < 1000) {
					oLocaleDate.setFullYear(oMyDate.getFullYear());
				}

				if (bTime) {
					oLocaleDate.setHours(oMyDate.getUTCHours());
					oLocaleDate.setMinutes(oMyDate.getUTCMinutes());
					oLocaleDate.setSeconds(oMyDate.getUTCSeconds());
					oLocaleDate.setMilliseconds(oMyDate.getUTCMilliseconds());
				}
			}

			return oLocaleDate;

		};

		/**
		 * Creates a Date in UTC timezone from local timezone
		 * @param {Date} oDate in local timezone
		 * @param {boolean} bTime if set the time part of the date will be used too, otherwise it will be initial
		 * @return {Date} in UTC timezone
		 * @private
		 */
		CalendarUtils._createUTCDate = function (oDate, bTime) {

			var oUTCDate;

			if (oDate) {
				var oMyDate;

				if (oDate instanceof UniversalDate) {
					oMyDate = oDate.getJSDate();
				} else {
					oMyDate = oDate;
				}

				oUTCDate = new Date(Date.UTC(oMyDate.getFullYear(), oMyDate.getMonth(), oMyDate.getDate()));
				if (oMyDate.getFullYear() < 1000) {
					oUTCDate.setUTCFullYear(oMyDate.getFullYear());
				}

				if (bTime) {
					oUTCDate.setUTCHours(oMyDate.getHours());
					oUTCDate.setUTCMinutes(oMyDate.getMinutes());
					oUTCDate.setUTCSeconds(oMyDate.getSeconds());
					oUTCDate.setUTCMilliseconds(oMyDate.getMilliseconds());
				}
			}

			return oUTCDate;

		};

		/**
		 * Creates a Date in UTC timezone from local timezone
		 * @param {Date} oDate in local timezone
		 * @param {sap.ui.core.CalendarType} sCalendarType the type of the used calendar
		 * @param {boolean} bTime if set the time part of the date will be used too, otherwise it will be initial
		 * @return {UniversalDate} in UTC timezone
		 * @private
		 */
		CalendarUtils._createUniversalUTCDate = function (oDate, sCalendarType, bTime) {

			var oUTCDate;

			if (sCalendarType) {
				oUTCDate = UniversalDate.getInstance(this._createUTCDate(oDate, bTime), sCalendarType);
			} else {
				oUTCDate = new UniversalDate(this._createUTCDate(oDate, bTime).getTime()); // use getTime() because IE and FF can not parse dates < 0100.01.01
			}

			return oUTCDate;

		};

		/**
		 * Calculates the week number for a date
		 * @param {Date} oDate date to get week number
		 * @param {int} iYear year for the week number. (In en-US the week number for the last Days in December depends on the year.)
		 * @param {string} sLocale used locale
		 * @param {object} oLocaleData locale date for used locale
		 * @return {int} week number
		 * @private
		 */
		CalendarUtils.calculateWeekNumber = function (oDate, iYear, sLocale, oLocaleData) {

			var iWeekNum = 0;
			var iWeekDay = 0;
			var iFirstDayOfWeek = oLocaleData.getFirstDayOfWeek();
			var oLocale = new sap.ui.core.Locale(sLocale);

			// search Locale for containing "en-US", since sometimes
			// when any user settings have been defined, subtag "sapufmt" is added to the locale name
			// this is described inside sap.ui.core.Configuration file
			if (oLocale && (oLocale.getLanguage() == 'en' && oLocale.getRegion() == 'US')) {
				/*
				 * in US the week starts with Sunday
				 * The first week of the year starts with January 1st. But Dec. 31 is still in the last year
				 * So the week beginning in December and ending in January has 2 week numbers
				 */
				var oJanFirst = new UniversalDate(oDate.getTime());
				oJanFirst.setUTCFullYear(iYear, 0, 1);
				iWeekDay = oJanFirst.getUTCDay();

				//get the date for the same weekday like jan 1.
				var oCheckDate = new UniversalDate(oDate.getTime());
				oCheckDate.setUTCDate(oCheckDate.getUTCDate() - oCheckDate.getUTCDay() + iWeekDay);

				iWeekNum = Math.round((oCheckDate.getTime() - oJanFirst.getTime()) / 86400000 / 7) + 1;

			} else {
				// normally the first week of the year is the one where the first Thursday of the year is
				// find Thursday of this week
				// if the checked day is before the 1. day of the week use a day of the previous week to check
				var oThursday = new UniversalDate(oDate.getTime());
				oThursday.setUTCDate(oThursday.getUTCDate() - iFirstDayOfWeek);
				iWeekDay = oThursday.getUTCDay();
				oThursday.setUTCDate(oThursday.getUTCDate() - iWeekDay + 4);

				var oFirstDayOfYear = new UniversalDate(oThursday.getTime());
				oFirstDayOfYear.setUTCMonth(0, 1);
				iWeekDay = oFirstDayOfYear.getUTCDay();
				var iAddDays = 0;
				if (iWeekDay > 4) {
					iAddDays = 7; // first day of year is after Thursday, so first Thursday is in the next week
				}
				var oFirstThursday = new UniversalDate(oFirstDayOfYear.getTime());
				oFirstThursday.setUTCDate(1 - iWeekDay + 4 + iAddDays);

				iWeekNum = Math.round((oThursday.getTime() - oFirstThursday.getTime()) / 86400000 / 7) + 1;

			}

			return iWeekNum;

		};

		/**
		 * Retrieves the first date of the same week in which is the given date.
		 * This function works with date values in UTC to produce timezone agnostic results.
		 * <br><br>
		 * The US weeks at the end of December and at the beginning of January(53th and 0th), are not considered.
		 * If a given date is in the beginning of January (e.g. Friday, 2 Jan 2015, week 0), the function will return
		 * week start date in the previous year(e.g. Sunday, 28 Dec 2014, week 53).
		 *
		 * @param {Date} oDate the input date for which we search the first week date.
		 * This date is considered as is (no UTC conversion, time cut etc).
		 * @returns {Date} first date of the same week as the given <code>oDate</code> in local timezone.
		 * @public
		 */
		CalendarUtils.getFirstDateOfWeek = function (oDate) {
			var oUniversalDate = new UniversalDate(oDate.getTime()),
				oFirstDateOfWeek,
				oWeek;

			oWeek = UniversalDate.getWeekByDate(oUniversalDate.getCalendarType(), oUniversalDate.getUTCFullYear(),
				oUniversalDate.getUTCMonth(), oUniversalDate.getUTCDate());

			if (oWeek.week === 0 && sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().getRegion() === "US") {
				oWeek.year--;
				oWeek.week = 52;
			}
			oFirstDateOfWeek = UniversalDate.getFirstDateOfWeek(oUniversalDate.getCalendarType(), oWeek.year, oWeek.week);

			return new UniversalDate(Date.UTC(oFirstDateOfWeek.year, oFirstDateOfWeek.month, oFirstDateOfWeek.day,
				oDate.getUTCHours(), oDate.getUTCMinutes(), oDate.getUTCSeconds())).getJSDate();
		};

		/**
		 * Gets the first day of a given month.
		 * This function works with date values in UTC to produce timezone agnostic results.
		 *
		 * @param {Date} oDate JavaScript date
		 * @returns {Date} JavaScript date corresponding to the first date of the month
		 * @public
		 */
		CalendarUtils.getFirstDateOfMonth = function(oDate) {
			var oNewDate = new UniversalDate(oDate.getTime());
			oNewDate.setUTCDate(1);

			return oNewDate;
		};

		/**
		 * Calculates the number of weeks for a given year using the current locale settings
		 * @param {number} iYear The target year of interest in format (YYYY)
		 * @returns {number} The number of weeks for the given year
		 * @private
		 */
		CalendarUtils._getNumberOfWeeksForYear = function (iYear) {
			var sLocale = sap.ui.getCore().getConfiguration().getFormatLocale(),
				oLocaleData = sap.ui.core.LocaleData.getInstance(new sap.ui.core.Locale(sLocale)),
				o1stJan = new Date(Date.UTC(iYear, 0, 1)),
				i1stDay = o1stJan.getUTCDay(),
				iNumberOfWeeksInYear = 52;

			//This is valid for all the regions where Sunday is the first day of the week
			if (oLocaleData.getFirstDayOfWeek() === 0) {
				if (i1stDay === 5 || i1stDay === 6) {
					iNumberOfWeeksInYear = 53;
				}
			} else {
				if (i1stDay === 3 || i1stDay === 4) {
					iNumberOfWeeksInYear = 53;
				}
			}

			return iNumberOfWeeksInYear;
		};

		/**
		 * Determines if the given dates' months differ, including same months from different years.
		 *
		 * @param {Date} oDate1 JavaScript date
		 * @param {Date} oDate2 JavaScript date
		 * @return {boolean} true if the given dates' months differ
		 * @public
		 */
		CalendarUtils.monthsDiffer = function(oDate1, oDate2) {
			return (oDate1.getMonth() !== oDate2.getMonth() || oDate1.getFullYear() !== oDate2.getFullYear());
		};

		/**
		 * Checks in UTC mode if the corresponding date is last in a month.
		 * @param {sap.ui.core.date.UniversalDate} oDate The date to be checked whether it is the last one
		 * @returns {boolean} True if the next date is bigger or not regarding the selected one
		 * @public
		 */
		CalendarUtils.isDateLastInMonth = function(oDate) {
			var oNextDay = new Date(oDate.getTime() + 24 * 60 * 60 * 1000);
			return oNextDay.getUTCDate() < oDate.getUTCDate();
		};


		/**
		 * Sets the given values to the date.
		 * @param {sap.ui.unified.UniversalDate} oDate The date which parameters will be set
		 * @param {int} iYear The year to be set
		 * @param {int} iMonth The month to be set
		 * @param {int} iDate The date to be set
		 * @param {int} iHours The hours to be set
		 * @param {int} iMinutes The minutes to be set
		 * @param {int} iSeconds The seconds to be set
		 * @param {int} iMilliseconds The milliseconds to be set
		 * @private
		 */
		CalendarUtils._updateUTCDate = function(oDate, iYear, iMonth, iDate, iHours, iMinutes, iSeconds, iMilliseconds) {
			if (jQuery.isNumeric(iYear)) {
				oDate.setUTCFullYear(iYear);
			}
			if (jQuery.isNumeric(iMonth)) {
				oDate.setUTCMonth(iMonth);
			}
			if (jQuery.isNumeric(iDate)) {
				oDate.setUTCDate(iDate);
			}
			if (jQuery.isNumeric(iHours)) {
				oDate.setUTCHours(iHours);
			}
			if (jQuery.isNumeric(iMinutes)) {
				oDate.setUTCMinutes(iMinutes);
			}
			if (jQuery.isNumeric(iSeconds)) {
				oDate.setUTCSeconds(iSeconds);
			}
			if (jQuery.isNumeric(iMilliseconds)) {
				oDate.setUTCMilliseconds(iMilliseconds);
			}
		};

		/**
		 * Checks if the given object is JavaScript date object and throws error if its not.
		 * @param {Object} oDate The date to be checked
		 * @private
		 */
		CalendarUtils._checkJSDateObject = function(oDate) {
			if (!(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object.");
			}
		};

		/**
		 * Checks if the given year is between of 1 and 9999 and throws year if its not.
		 * @param {int} iYear The year to be checked
		 * @private
		 */
		CalendarUtils._checkYearInValidRange = function(iYear) {
			if (!jQuery.isNumeric(iYear) || (iYear < 1 || iYear > 9999)) {
				throw new Error("Year must be in valid range (between year 0001 and year 9999).");
			}
		};

		/**
		 * Compares the given month and the one from the <code>startDate</code>.
		 *
		 * @param {Date} oDate1 JavaScript date
		 * @param {Date} oDate2 JavaScript date
		 * @return {boolean} true if the first date's month is chronologically after the second
		 * @private
		 */
		CalendarUtils._isNextMonth = function(oDate1, oDate2) {
			return (oDate1.getMonth() > oDate2.getMonth() && oDate1.getFullYear() === oDate2.getFullYear())
				|| oDate1.getFullYear() > oDate2.getFullYear();
		};

		 // Utilities for working with sap.ui.unified.calendar.CalendarDate

		/**
		 * Calculates how many days are in a given month.
		 * @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate The date which year will be checked
		 * @returns {int} The number of days in the month for the given oCalendarDate
		 * @throws Will throw an error if the arguments are null or are not of the correct type
		 * @private
		 */
		CalendarUtils._daysInMonth = function (oCalendarDate) {
			this._checkCalendarDate(oCalendarDate);

			oCalendarDate = new CalendarDate(oCalendarDate);
			oCalendarDate.setDate(1);
			oCalendarDate.setMonth(oCalendarDate.getMonth() + 1);
			oCalendarDate.setDate(0);
			return oCalendarDate.getDate();
		};

		/**
		 * Checks if the given date is the last date of the same month.
		 * @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate The date to be checked
		 * @returns {boolean} True if the provided date is the last date in the same month, false otherwise
		 * @throws Will throw an error if the arguments are null or are not of the correct type
		 * @private
		 */
		CalendarUtils._isLastDateInMonth = function (oCalendarDate) {
			return oCalendarDate.getDate() === CalendarUtils._daysInMonth(oCalendarDate);
		};

		/**
		 * Retrieves the first date of the same week in which is the given date.
		 * <br><br>
		 * The US weeks at the end of December and at the beginning of January(53th and 0th), are not considered.
		 * If a given date is in the beginning of January (e.g. Friday, 2 Jan 2015, week 0), the function will return
		 * week start date in the previous year(e.g. Sunday, 28 Dec 2014, week 53).
		 *
		 * @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate the input date for which we search the first week date.
		 * @returns {sap.ui.unified.calendar.CalendarDate} first date of the same week as the given <code>oDate</code> in local timezone.
		 * @throws Will throw an error if the arguments are null or are not of the correct type.
		 * @private
		 */
		CalendarUtils._getFirstDateOfWeek = function (oCalendarDate) {
			this._checkCalendarDate(oCalendarDate);
			var oJSDate = CalendarUtils.getFirstDateOfWeek(oCalendarDate.toUTCJSDate());
			oJSDate.setFullYear(oJSDate.getUTCFullYear(), oJSDate.getUTCMonth(), oJSDate.getUTCDate());

			return CalendarDate.fromLocalJSDate(oJSDate, oCalendarDate.getCalendarType());
		};

		/**
		 * Gets the first day of a given month.
		 *
		 * @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate The date whose first date will be returned
		 * @returns {sap.ui.unified.calendar.CalendarDate} Date corresponding to the first date of the month
		 * @throws Will throw an error if the arguments are null or are not of the correct type
		 * @private
		 */
		CalendarUtils._getFirstDateOfMonth = function(oCalendarDate) {
			this._checkCalendarDate(oCalendarDate);

			var oJSDate = CalendarUtils.getFirstDateOfMonth(oCalendarDate.toUTCJSDate()).getJSDate();
			oJSDate.setFullYear(oJSDate.getUTCFullYear(), oJSDate.getUTCMonth(), oJSDate.getUTCDate());

			return CalendarDate.fromLocalJSDate(oJSDate, oCalendarDate.getCalendarType());
		};

		/**
		 * @param {sap.ui.core.CalendarType} sCalendarType The date type whose minimal date will be returned
		 * @returns {sap.ui.unified.calendar.CalendarDate} The minimal date that this calendar supports
		 * @private
		 */
		CalendarUtils._minDate = function (sCalendarType) {
			return new CalendarDate(1, 0, 1, sCalendarType);
		};

		/**
		 * Creates a date corresponding to the max date this calendar supports.
		 * @param {sap.ui.core.CalendarType} sCalendarType The date type whose maximal date will be returned
		 * @returns {sap.ui.unified.calendar.CalendarDate} The maximum date that this calendar supports
		 * @private
		 */
		CalendarUtils._maxDate = function (sCalendarType) {
			var oCalDate = new CalendarDate(9999, 11, 1, sCalendarType);
			oCalDate.setDate(this._daysInMonth(oCalDate));// 31st for Gregorian Calendar
			return new CalendarDate(oCalDate);
		};

		/**
		 * Check if given date matches given date range.
		 * @param {sap.ui.unified.calendar.CalendarDate} oDate The date to check
		 * @param {sap.ui.unified.calendar.CalendarDate} oStartDate The start of the date range
		 * @param {sap.ui.unified.calendar.CalendarDate} oEndDate The end of the date range
		 * @param {boolean} inclusive If true the given date interval is closed (includes the endpoints), otherwise the
		 * given date interval is open(excludes the endpoints)
		 * @returns {boolean} True if the given date is between the start and end date of the range(inclusive), false otherwise
		 * @throws Will throw an error if the arguments are null or are not of the correct type
		 * @private
		 */
		CalendarUtils._isBetween = function (oDate, oStartDate, oEndDate, inclusive) {
			this._checkCalendarDate(oDate);
			this._checkCalendarDate(oStartDate);
			this._checkCalendarDate(oEndDate);

			if (inclusive) {
				return oDate.isSameOrAfter(oStartDate) && oDate.isSameOrBefore(oEndDate);
			} else {
				return oDate.isAfter(oStartDate) && oDate.isBefore(oEndDate);
			}
		};

		/**
		 * Calculates the difference between two calendar dates in days.
		 * @param {sap.ui.unified.calendar.CalendarDate} oFirstDate the first date
		 * @param {sap.ui.unified.calendar.CalendarDate} oSecondDate the second date
		 * @returns {int} days (positive or negative) corresponding to the delta between oFirstDate and oSecondDate
		 * @throws Will throw an error if the arguments are null or are not of the correct type.
		 * @private
		 */
		CalendarUtils._daysBetween = function (oFirstDate, oSecondDate) {
			this._checkCalendarDate(oFirstDate);
			this._checkCalendarDate(oSecondDate);

			return Math.ceil((oFirstDate.valueOf() - oSecondDate.valueOf()) / (this.HOURS24));
		};

		/**
		 * Check if given date does not match given date range.
		 * @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate the date to check.
		 * @param {sap.ui.unified.calendar.CalendarDate} oStartCalendarDate the start of the date range
		 * @param {sap.ui.unified.calendar.CalendarDate} oEndCalendarDate the end of the date range
		 * @returns {boolean} true if the given date is between the start and end date of the range(inclusive), false otherwise.
		 * @throws Will throw an error if the arguments are null or are not of the correct type.
		 * @private
		 */
		CalendarUtils._isOutside = function (oCalendarDate, oStartCalendarDate, oEndCalendarDate) {
			return !this._isBetween(oCalendarDate, oStartCalendarDate, oEndCalendarDate, true);
		};

		/**
		 * Checks if given first date has the same month and year as the given second date.
		 * @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate1 the first date
		 * @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate2 the second date
		 * @return {boolean} true if month and year matches for both given dates, false otherwise
		 * @throws Will throw an error if the arguments are null or are not of the correct type.
		 * @private
		 */
		CalendarUtils._isSameMonthAndYear = function (oCalendarDate1, oCalendarDate2) {
			this._checkCalendarDate(oCalendarDate1);
			this._checkCalendarDate(oCalendarDate2);

			return oCalendarDate1.getYear() === oCalendarDate2.getYear() && oCalendarDate1.getMonth() === oCalendarDate2.getMonth();
		};

		/**
		 * Checks if given date is non null and of type sap.ui.unified.calendar.CalendarDate.
		 * @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate the date to check
		 * @throws Will throw an error if the argument is null or is not of the correct type.
		 * @private
		 */
		CalendarUtils._checkCalendarDate = function (oCalendarDate) {
			if (!oCalendarDate || !(oCalendarDate instanceof CalendarDate)) {
				throw "Invalid calendar date: [" + oCalendarDate + "]. Expected: sap.ui.unified.calendar.CalendarDate";
			}
		};

		/**
		* Returns week information for given calendar date.
		* @param {sap.ui.unified.calendar.CalendarDate} oCalendarDate The date whose week wll be returned
		* @return {Object} Week information - year and week, for given calendar date
		* @private
		*/
		CalendarUtils._getWeek = function (oCalendarDate) {
			this._checkCalendarDate(oCalendarDate);
			return UniversalDate.getWeekByDate(oCalendarDate.getCalendarType(), oCalendarDate.getYear(), oCalendarDate.getMonth(), oCalendarDate.getDate());
		};

		return CalendarUtils;

	}, /* bExport= */ true);
