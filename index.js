'use strict';

var $  = require( 'jquery' );
//require( 'datatables.net-dt' )( window, $ );
var dt = require( 'datatables.net' )( window, $ );
//var buttons = require( 'datatables.net-buttons' )( window, $ );
//var buttons2 = require( 'datatables.net-buttons-dt' )( window, $ );

var dataSet = [
      [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
      [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
      [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ]
];


$(document).ready(function() {
var table = $('#example').DataTable( {
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



    console.log(table);
    console.log($('#example').dataTable());
    console.log( table.data() );

    $('#saveBtn').click( function() {
       console.log( table.data() );
        return false;
    } );

    $('#addBtn').click( function() {
       console.log( table.data() );
       var rowNode = table
       .row.add( [ 'Eva 2 Olsen',
       '<td><input type="text" value=""></td>',
       'Edinburgh', "8422", "2011/07/25", "$170,750"] )
       .draw()
       .node();

       $( rowNode )
       .css( 'color', 'red' )
       .animate( { color: 'blue' } );

        return false;
    } );
} );
