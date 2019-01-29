'use strict';

//var $ = require('jquery');
//require('jquery-ui');


$.jgrid = $.jgrid || {};
$.jgrid.no_legacy_api = true;
$.jgrid.useJSON = true;

    $(function () {
       "use strict";
       var mydata = [
               { id: "10",  invdate: "2007-10-01", name: "test",   note: "note",   amount: "", tax: "", closed: true,  ship_via: "TN", total: "" },
               { id: "20",  invdate: "2007-10-02", name: "test2",  note: "note2",  amount: "300.00", tax: "20.00", closed: false, ship_via: "FE", total: "320.00" },
               { id: "30",  invdate: "2007-09-01", name: "test3",  note: "note3",  amount: "400.00", tax: "30.00", closed: false, ship_via: "FE", total: "430.00" },
               { id: "40",  invdate: "2007-10-04", name: "test4 test4 test4",  note: "note4",  amount: "200.00", tax: "10.00", closed: true,  ship_via: "TN", total: "210.00" },
               { id: "50",  invdate: "2007-10-31", name: "test5",  note: "note5",  amount: "300.00", tax: "20.00", closed: false, ship_via: "FE", total: "320.00" },
               { id: "60",  invdate: "2007-09-06", name: "test6",  note: "note6",  amount: "400.00", tax: "30.00", closed: false, ship_via: "FE", total: "430.00" },
               { id: "70",  invdate: "2007-10-04", name: "test7",  note: "note7",  amount: "200.00", tax: "10.00", closed: true,  ship_via: "TN", total: "210.00" },
               { id: "80",  invdate: "2007-10-03", name: "test8",  note: "note8",  amount: "300.00", tax: "20.00", closed: false, ship_via: "FE", total: "320.00" },
               { id: "90",  invdate: "2007-09-01", name: "test9 test9 test9 test9 test9",  note: "note9",  amount: "400.00", tax: "30.00", closed: false, ship_via: "TN", total: "430.00" },
               { id: "100", invdate: "2007-09-08", name: "test10", note: "note10", amount: "500.00", tax: "30.00", closed: true,  ship_via: "TN", total: "530.00" },
               { id: "110", invdate: "2007-09-08", name: "test11", note: "note11", amount: "500.00", tax: "30.00", closed: false, ship_via: "FE", total: "530.00" },
               { id: "120", invdate: "2007-09-10", name: "test12", note: "note12", amount: "500.00", tax: "30.00", closed: false, ship_via: "FE", total: "530.00" }
           ],
           $grid = $("#list"),
           initDateEdit = function (elem) {
               $(elem).datepicker({
                   dateFormat: "dd-M-yy",
                   autoSize: true,
                   changeYear: true,
                   changeMonth: true,
                   showButtonPanel: true,
                   showWeek: true
               });
           },
           initDateSearch = function (elem) {
               setTimeout(function () {
                   initDateEdit(elem);
               }, 100);
           };

       $grid.jqGrid({
           data: mydata,
           colNames: ["", "Client", "Date", "Amount", "Tax", "Total", "Closed", "Shipped via", "Notes"],
           colModel: [
               { name: "act", template: "actions" },
               { name: "name", align: "center", width: 92, editrules: {required: true} },
               { name: "invdate", width: 92, align: "center", sorttype: "date", frozen: true,
                   formatter: "date", formatoptions: { newformat: "d-M-Y" }, datefmt: "d-M-Y",
                   editoptions: { dataInit: initDateEdit },
                   searchoptions: { sopt: ["eq", "ne", "lt", "le", "gt", "ge"], dataInit: initDateSearch } },
               { name: "amount", width: 56, template: "number" },
               { name: "tax", width: 35, template: "number", autoResizableMinColSize: 40 },
               { name: "total", width: 43, template: "number" },
               { name: "closed", width: 49, template: "booleanCheckboxFa" },
               { name: "ship_via", width: 76, align: "center", formatter: "select",
                   edittype: "select", editoptions: { value: "FE:FedEx;TN:TNT;IN:Intim", defaultValue: "IN" },
                   stype: "select", searchoptions: { sopt: ["eq", "ne"], value: ":Any;FE:FedEx;TN:TNT;IN:IN" }},
               { name: "note", width: 43, edittype: "textarea", sortable: false }
           ],
           cmTemplate: { autoResizable: true, editable: true },
           iconSet: "fontAwesome",
           rowNum: 10,
           autoResizing: { compact: true },
           rowList: [5, 10, 20, "10000:All"],
           viewrecords: true,
           autoencode: true,
           sortable: true,
           pager: true,
           inlineEditing: { keys: true, defaultFocusField: "amount", focusField: "amount" },
           onSelectRow: function (rowid, status, e) {
               var $self = $(this), savedRow = $self.jqGrid("getGridParam", "savedRow");

               if (savedRow.length > 0 && savedRow[0].id !== rowid) {
                   $self.jqGrid("restoreRow", savedRow[0].id);
               }

               $self.jqGrid("editRow", rowid, { focusField: e.target });
           },/*
           ondblClickRow: function (rowid, iRow, iCol, e) {
               var $self = $(this), savedRow = $self.jqGrid("getGridParam", "savedRow");
               if (savedRow.length > 0 && savedRow[0].id !== rowid) {
                   $self.jqGrid("restoreRow", savedRow[0].id);
               }
               $self.jqGrid("editRow", rowid, { focusField: e.target });
           },*/
           rownumbers: true,
           sortname: "invdate",
           sortorder: "desc",
           caption: "Demonstration the usage of focusField optoin of editRow"
       }).jqGrid("inlineNav")
       .jqGrid("gridResize");
   });
