'use strict';

var $  = require( 'jquery' );
//require( 'datatables.net-dt' )( window, $ );
var dt = require( 'datatables.net' )( window, $ );
require('datatables.net-select' )( window, $ );
//require('datatables.net-autofill' )( window, $ );
//var buttons = require( 'datatables.net-buttons' )( window, $ );
//var buttons2 = require( 'datatables.net-buttons-dt' )( window, $ );

var dataSet = [
      [ "1","Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
      [  "2","Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
      [  "3","Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ]
];


$(document).ready(function() {
var table = $('#example').DataTable( {
        select: true,
        autofill: true,
        data: dataSet,
        columns: [
            { title: "ID" },
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

    $('#saveBtn').click( function() {
      var data = table.$('input, select').serialize();
       //console.log(data[3].value);  //.substr( 0, 120 ));
       console.log( data);
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
       var e1 = e3 = e4 = e5 = e6 = '<td><input type="text" name="fname"></td>';
       var e2 = '<td><select name="car"><option value="volvo">Volvo</option><option value="saab">Saab</option></select></td>';
        var rowNode = table.row.add( [e1, e2, e3, e4, e5, e6] ).draw().node();

       $( rowNode )
       .css( 'color', 'red' )
       .animate( { color: 'blue' } );
          console.log( table.data() );

        return false;
    } );

    $('#editBtn').click( function() {
         var rowNode = table.row('.selected');
         console.log(rowNode.data());
         var nodeArr =  rowNode.data();
         //for (i=0;i<nodeArr.length;i++){
        //  rowNode.remove().draw();
          table.row('.selected').data(["3",'<td><input type="text" name="fname" value='+nodeArr[0]+'></td>', nodeArr[1],"e","e2","e3","e4"] ).draw().node();
         //}
        return false;
    } );

    $('#delBtn').click( function() {
       console.log(table.row($(this)));
       var rowNode = table.row('.selected').remove().draw();
       console.log( table.data() );
        return false;
    } );
} );
