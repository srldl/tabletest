'use strict';

var $  = require( 'jquery' );
//require( 'datatables.net-dt' )( window, $ );
var dt = require( 'datatables.net' )( window, $ );
var select = require('datatables.net-select' )( window, $ );
//var buttons = require( 'datatables.net-buttons' )( window, $ );
//var buttons2 = require( 'datatables.net-buttons-dt' )( window, $ );

var dataSet = [
      [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
      [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
      [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ]
];


$(document).ready(function() {
var table = $('#example').DataTable( {
        select: true,
        data: dataSet,
        columns: [
            { title: "Name" },
            { title: "Position" },
            { title: "Office" },
            { title: "Extn." },
            { title: "Start date" },
            { title: "Salary" }
        ]
    } );



    //console.log(table);
    //console.log($('#example').dataTable());
    //console.log( table.data() );
  //  var tt = table.cell( ':eq(0)', null, {page: 'current'} ).select();
  //  console.log(tt);
  //  tt.focus();

    $('#saveBtn').click( function() {
       console.log( table.data() );
        return false;
    } );

    var e1 = 'Eva 2 Olsen';
    var e2 = '<td><input type="text" value=""></td>';
    var e3 = 'Edinburgh';
    var e4 = "8422";
    var e5 = "2011/07/25";
    var e6 = "$170,750";

    $('#addBtn').click( function() {
        console.log( e1);
        var rowNode = table.row.add( [e1, e2, e3, e4, e5, e6] ).draw().node();

       $( rowNode )
       .css( 'color', 'red' )
       .animate( { color: 'blue' } );

          console.log( table.data() );

        return false;
    } );

    $('#newBtn').click( function() {
       var e1 = e2 = e3 = e4 = e5 = e6 = '<td><input type="text" value=""></td>';
        var rowNode = table.row.add( [e1, e2, e3, e4, e5, e6] ).draw().node();

       $( rowNode )
       .css( 'color', 'red' )
       .animate( { color: 'blue' } );
          console.log( table.data() );

        return false;
    } );

    $('#delBtn').click( function() {
       console.log(table.row($(this)));
       var rowNode = table.row('.selected').remove().draw();
       console.log( table.data() );
        return false;
    } );
} );
