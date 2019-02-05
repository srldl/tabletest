'use strict';

var $  = require( 'jquery' );
//require( 'datatables.net-dt' )( window, $ );
var dt = require( 'datatables.net' )( window, $ );
//var buttons = require( 'datatables.net-buttons' )( window, $ );
//var buttons2 = require( 'datatables.net-buttons-dt' )( window, $ );


console.log("test");

$(document).ready(function() {
    $('#example').DataTable();
} );
