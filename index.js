'use strict';

var $  = require( 'jquery' );
var tb = require( '@srldl/edit-tabletest/js/edit-table.js');
//require( 'datatables.net-dt' )( window, $ );
var dt = require( 'datatables.net' )( window, $ );
require('datatables.net-select' )( window, $ );
//require('datatables.net-autofill' )( window, $ );
//var buttons = require( 'datatables.net-buttons' )( window, $ );
//var buttons2 = require( 'datatables.net-buttons-dt' )( window, $ );

tb.printMsg();
tb.testMsg();

//Testdata  template and fieldwork
let template = {
  "_id": "a11a7305-45a8-4ad2-80d9-60f4b8980cc3",
  "_rev": "8-99e39377c38e48d48b400c1e031b8a94",
  "title": "Xxxdet var en gang",
  "base": [
    "project",
    "parent_event_id",
    "ris_id",
    "rightsholder"
  ],
  "field": [
    "matrix",
    "event_date",
    "latitude",
    "longitude",
    "placename",
    "species",
    "no_samples_amount",
    "label_name"
  ]
};

let fieldwork = [{
  "matrix":"plasma",
  "event_date": "1993-04-07T17:01:30Z",
  "species": "ursus maritimus",
  "latitude": 77,
  "longitude": 16,
  "placename": "Burgerbukta",
  "no_samples_amount": "33"
},
{
  "matrix":"plasma",
  "event_date": "1999-04-07T17:01:30Z",
  "species": "ursus maritimus",
  "latitude": 77,
  "longitude": 16,
  "placename": "Ny-Ålesund",
  "label_name": "35"
}];


//row is each displayed row in table
let row = [];
//dataSet is all rows displayed in a two dimensional array.
let dataSet = [];
//found is toggled to ensure all rows are filled in
let found = false;
//Traverse fieldwork array
for (let n=0; n<fieldwork.length; n++) {
  //Traverse template array to ensure correct headings with values
  for (let value of template.field) {
    found = false;
    for (let m in fieldwork[n]) {
           //If fieldwork object contains heading (template key)
           if (m == value) {
             //Push value into correct row/column
             row.push(fieldwork[n][m]);
             found = true;
             //console.log(fieldwork[n][m]);
           }
    }
    //If the method has no value/is not included, the value is empty string
    if (found === false) {row.push("")};
}
//Push rows onto dataset, empty row array
dataSet.push(row);
row=[];
}


//Create table headings
let columnsArr = [];
for (let value of template.field) {
  columnsArr.push({ 'title': value });
}

$(document).ready(function() {
var table = $('#example').DataTable( {
        select: true,
        autofill: true,
        data: dataSet,
        columns: columnsArr
});


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
