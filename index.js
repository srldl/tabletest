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
  "id":"4568140a7f01462edc029e42ab040f01</p>",
  "matrix":"hairstraw",
  "event_date": "1993-04-07T17:01:30Z",
  "species": "ursus maritimus",
  "latitude": "77",
  "longitude": "16",
  "placename": "Burgerbukta",
  "no_samples_amount": "33"
},
{
  "id":"4568140a7f01462edc029e42ab056e41",
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
let id;
//Traverse fieldwork array
for (let n=0; n<fieldwork.length; n++) {
  //Traverse template array to ensure matching headings and values
  for (let value of template.field) {
    found = false;
    id = '';
    for (let m in fieldwork[n]) {
           //If fieldwork object contains heading (template key)
           if (m == value) {
             //Push value into correct row/column
             row.push(fieldwork[n][m]);
             found = true;
             //Need to add ID at the end of the array
           } else if (m == 'id') {
              id  = fieldwork[n][m];
           }
    }
    //If the method has no value/is not included, the value is empty string
    if (found === false) {row.push("")};
}
//Push ID to array at the end
row.push(id);

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
        data: dataSet,
        columns: columnsArr,
        rowId: function(dataSet) {
           return 'id_' + dataSet[8];
	      }
});

//On select convert text elements to active inputs
table.on( 'select', function () {
  let sel_row = table.rows( { selected: true } ).data();
  let sel = editTable.active(template.field,sel_row[0]);
  let rowNode = table.row('.selected').data(sel).draw();
  $( rowNode ).animate( { color: 'blue' } );
  return false;
} );

//On deselect convert active elements to passive text
table.on( 'deselect', function ( e, dt, type, indexes ) {
    if ( type === 'row' ) {
        let sel_row = table.row( indexes ).data();
        let sel = editTable.passive(sel_row,(sel_row.length),1);
        console.log(sel);
        let rowNode = table.row(indexes).data(sel).draw();
        $( rowNode ).animate( { color: 'blue' } );
        return false

    }
} );


$('#saveBtn').click( function() {
   var data = table.$('input, select').serialize();

//  console.log(table);
//  console.log(data);

  // let data = table.rows({ selected: true }).serialize();

   //console.log(table.rows().ids());

  //Fetch all data
   let allData = table.data();
   //console.log(allData);

   let ret = editTable.passive(allData,(table.rows()[0].length),(table.columns()[0].length));
   //Delete all rows in table, Display new ones
   table.rows().remove().draw();
   table.rows.add(ret).draw();

   return false;
} );

$('#copyBtn').click( function() {

    let sel_row =   table.rows({ selected: true }).data();
    //Check that a row has been selected
    if (sel_row[0] === undefined) {
        alert("Please select at least one row");
    } else {
        //if sel_row has id, remove it to become a new entry
        let cpy_row = Array.from(sel_row[0]);
      //  console.log(sel_row[0].length, template);
        if ((sel_row[0]).length > (template.field).length){ cpy_row.pop(); }
        //Activate without ids since it is a new entry
        let cpy_row2 = editTable.passive([cpy_row],1,(table.columns()[0].length));
        //let sel = editTable.active(template.field,(cpy_row2[0]));
        let rowNode = table.row.add( cpy_row2[0]).draw().node();

        $( rowNode )
              //  .css( 'color', 'red' )
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

        $('input, select').blur(function(){
          var data = table.$('input, select').serialize();
          // console.log(table.rows({ selected: true }).ids());
          let sel_row =   table.rows({ selected: true }).data();
           console.log(sel_row[0]);
           console.log(data);
           //table.row.add('.id_undefined').draw().node();
        });

        $( rowNode )
        .css( 'color', 'red' )
        .animate( { color: 'blue' } );

        return false;
     });



    $('#delBtn').click( function() {
       //console.log(table.row($(this)));
       var rowNode = table.row('.selected').remove().draw();
       //console.log( table.data() );
        return false;
    } );


} );
