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
  "id":"4568140a7f01462edc029e42ab040f01",
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
},
{
  "id":"4568140a7f01462edc029e42ab056e41",
  "matrix":"plasma",
  "event_date": "1997-12-07T17:01:30Z",
  "species": "ursus maritimus",
  "latitude": 72,
  "longitude": 9,
  "placename": "Longyearbyen",
  "label_name": "20"
}];


//row is each displayed row in table
let index_count = 1;
let row = [index_count++];
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
row=[index_count++];
}

//Create table headings
let columnsArr = [{ 'title': 'index' }];
for (let value of template.field) {
  columnsArr.push({ 'title': value });
}

let table;
$(document).ready(function() {
  $('#table1').on( 'init.dt', function () {
        table = $('#table1').DataTable();
      //    table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
        //      cell.innerHTML = i+1;
        //  table.rows().invalidate();
        //  } );
      } ).DataTable( {
        //  lengthChange: true,
        //  autoWidth: false,
        //  scrollCollapse: false,
        //  searching: true,
          select:'single',
          data: dataSet,
          columns: columnsArr,
          rowId: function(dataSet) {
             return 'id_' + dataSet[8];
          } ,
        //  "order": [[ 8, 'desc' ]],
          "ordering": true,
          "columnDefs": [{targets: 2, type: 'formatted-num'}]

      } );


/*var table = $('#table1').DataTable( {
        select: {
            style: 'single'
        },
        autoWidth: true,
        lengthChange: true,
        data: dataSet,
        columns: columnsArr,
        rowId: function(dataSet) {
           return 'id_' + dataSet[8];
	      }
}); */


let index = 0;


//On select convert text elements to active inputs
/*table.on( 'select', function () {
  let sel_row = table.row( { selected: true } ).data();
  index_row = table.row(  { selected: true } ).index();
  let sel = editTable.active(template.field,sel_row);
  console.log(sel_row);
  console.log(index_row);
  console.log("select");
  let rowNode = table.row('.selected').data(sel).draw();
  $( rowNode ).animate( { color: 'blue' } );
  return false;
} ); */

table.on( 'user-select', function ( e, dt, type, cell, originalEvent ) {
        index = cell.index().row;
        var row = dt.row( cell.index().row ).node();

        if ( $(row).hasClass('selected') ) {
            // deselect

              //console.log("deselect");
        }
        else {
            // select
            let cell = table.cell( {focused:true} ).index();

              //A new row has been selected
              if (index !== cell.row) {
                   //Run all through passive
                   for (let i=0;i<(fieldwork.length);i++){
                       let desel_input = table.row( i ).data();
                       let desel = editTable.passive(desel_input,(desel_input.length));
                       let rowNode = table.row(i).data(desel).draw();
                   }
              }

              let sel_row = table.row( index ).data();
              let sel_row2 = editTable.passive(sel_row,(sel_row.length));
              let sel = editTable.active(template.field+1, sel_row2);
              let rowNode = table.row(index).data(sel).draw();
              $( rowNode ).animate( { color: 'blue' } );
        }
    } );

//On deselect convert active elements to passive text
/*table.on( 'deselect', function ( e, dt, type, indexes ) {
  let sel_cell = table.cell( {focused:true} ).index();

  if (index_row !== sel_cell.row) {
       console.log("no match");
       let sel_row = table.row( indexes ).data();
       let sel = editTable.passive(sel_row,(sel_row.length),1);
       let rowNode = table.row(indexes).data(sel).draw();
  }

     console.log("deselect");
      return false
} );  */


$('#saveBtn').click( function() {
   var data = table.$('input, select').serialize();


//  console.log(table);
//  console.log(data);

  // let data = table.rows({ selected: true }).serialize();

   //console.log(table.rows().ids());

  //Fetch all data
   let allData = table.data();

   let ret = editTable.passive(allData,(table.rows()[0].length),(table.columns()[0].length));
   //Delete all rows in table, Display new ones
   table.rows().remove().draw();
   table.rows.add(ret).draw();
   return false;
} );

$('#copyBtn').click( function() {

    let sel_row =   table.row({ selected: true }).data();
  //    let sel_row = table.row( index ).data();
      console.log(sel_row);

    //Check that a row has been selected
    if (sel_row === undefined) {
        alert("Please select at least one row");
    } else {
        //If sel_row has id, remove it to become a new entry
        let cpy_row = (sel_row.slice(1,((template.field).length+1)));

        //Activate without ids since this is a new entry
        let cpy_row2 = editTable.passive(cpy_row,((template.field).length));
        //Get number of rows
        let  index_counter = get_index();
        let num_rows = get_rows();
        let rowNode;

        //Loop through to include the demanded copies
        for (let j=0;j<(num_rows);j++){
           //Make a deep copy
           let cpy_row3 = [].concat(cpy_row2);
           //Update index_counter
           cpy_row3.splice(0,0,(index_counter++).toString());
           rowNode = table.row.add(cpy_row3).draw().node();
        };

        $( rowNode )
                .animate( { color: 'blue' } );
        }
        return false;
} );

//Get the number of new or copied row we want
//If null, return 1 for one row added
var get_rows = () => {
    let num_input = document.getElementById('addRows').value;
    let num_rows = num_input.match(/[0-9]+/);
    if (num_rows !== null){
      return num_rows[0];
    } else {
      return 1;
    }
}

//Count current index
var get_index = () => {
  return (table.rows().data().length)+1;
}

$('#newBtn').click( function() {
        let sel;
        let num_rows = get_rows();
        console.log(num_rows);
        let arr;

        //Get number of rows
        let  index_counter = get_index();

        for (let j=0;j<(num_rows);j++){
          arr = [index_counter++];

          template.field.forEach(function (i){
             arr.push('');
          });

    /*      if (j===0){
            let desel = editTable.active(template.field+1, arr);
            let rowNode = table.row(sel).data(desel).draw().select();
          }
    */

          sel = table.row.add( arr ).draw().node();
        };

        //Make the last entry active
      //  $( rowNode ).animate( { color: 'blue' } );
        return false;
     });

    $('#delBtn').click( function() {
       var rowNode = table.row('.selected').remove().draw();
       return false;
    } );


} );
