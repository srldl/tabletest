'use strict';

const $  = require( 'jquery' );
const editTable = require( '@srldl/edit-tabletest/js/edit-table.js');
//require( 'datatables.net-dt' )( window, $ );
const dt = require( 'datatables.net' )( window, $ );
require('datatables.net-select' )( window, $ );
//require('datatables.net-autofill' )( window, $ );

//let pp = editTable.printMsg();
//console.log(pp);

//console.log(editTable.pq('My secret guess2'));

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

let new_fieldwork = {
  "matrix":"plasma",
  "event_date": "1996-04-07T17:01:30Z",
  "species": "ursus maritimus",
  "latitude": 88,
  "longitude": 13,
  "placename": "Bassenget",
  "no_samples_amount": "88"
};


//row is each displayed row in table
let row = [];
//dataSet is all rows displayed in a two dimensional array.
let dataSet = [];
//found is toggled to ensure all rows are filled in
let found = false;
//Traverse fieldwork array
for (let n=0; n<fieldwork.length; n++) {
  //Traverse template array to ensure matching headings and values
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
        select: {
            style: 'single'
        },
      //  autofill: true,
        data: dataSet,
        columns: columnsArr
});

$('#saveBtn').click( function() {
   //Fetch all data
   let allData = table.data();
   console.log( allData );
   //Get number of rows created
   console.log(table.rows()[0]);
   return false;
} );

$('#copyBtn').click( function() {
    var sel_row =   table.rows({ selected: true }).data();
    //Check that a row has been selected
    if (sel_row[0] === undefined) {
        alert("Please select a row");
    } else {
        console.log(sel_row[0]);
        let sel = editTable.active(template.field,sel_row[0]);

        var rowNode = table.row.add( sel).draw().node();

        $( rowNode )
                .css( 'color', 'red' )
                .animate( { color: 'blue' } );

        }
        return false;
} );

     $('#newBtn').click( function() {
        let arr = [];
        for (let i=0;i<template.field.length;i++){
           arr.push(editTable.createString(template.field[i],''))
        }
        var rowNode = table.row.add( arr ).draw().node();

        $( rowNode )
        .css( 'color', 'red' )
        .animate( { color: 'blue' } );

        return false;
     });

     $('#editBtn').click( function() {
         var sel_row =   table.rows({ selected: true }).data()

         //Check that a row has been selected
         if (sel_row[0] === undefined) {
             alert("Please select a row");
         } else {

             console.log(sel_row[0]);
             let sel = editTable.active(template.field,sel_row[0]);

             var rowNode = table.row.add( sel).draw().node();
             var rowNode1 = table.row('.selected').remove().draw();

             $( rowNode )
             .css( 'color', 'red' )
             .animate( { color: 'blue' } );

        }
         return false;
     } );


    $('#delBtn').click( function() {
       console.log(table.row($(this)));
       var rowNode = table.row('.selected').remove().draw();
       console.log( table.data() );
        return false;
    } );
} );
