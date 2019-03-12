'use strict';

const $  = require( 'jquery' );
const editTable = require( '@srldl/edit-tabletest/js/edit-table.js');
//require( 'datatables.net-dt' )( window, $ );
const dt = require( 'datatables.net' )( window, $ );
require('datatables.net-select' )( window, $ );
require( 'datatables.net-keytable' )( window, $ );
require('datatables.net-autofill')( window, $ );

//Testdata  template and fieldwork
let template = {
  "_id": "a11a7305-45a8-4ad2-80d9-60f4b8980cc3",
  "_rev": "8-99e39377c38e48d48b400c1e031b8a94",
  "title": "Xxxdet var en gang",
  "field": [
    "matrix",
    "project",
    "species",
    "species_identification",
    "label_name",
    "comment"
  ]
};

let fieldwork = [{
  "id":"4568140a7f01462edc029e42ab040f01",
  "matrix":"feather",
  "project": "Kongsfjorden northern fulmar",
  "species": "fulmarus glacialis",
  "species_identification": "77",
  "label_name": "6745232",
  "comment": "Found dead"
},
{
  "id":"4568140a7f01462edc029e42ab056e41",
  "matrix":"feather",
  "project": "Kongsfjorden northern fulmar",
  "species": "fulmarus glacialis",
  "species_identification": "78",
  "label_name": "6745211",
  "comment": "Juvenile"
},
{
  "id":"4568140a7f01462edc029e42ab056e41",
  "matrix":"egg",
  "project": "Kongsfjorden northern fulmar",
  "species": "fulmarus glacialis",
  "species_identification": "79",
  "label_name": "4566432",
  "comment": ""
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
for (let i=0; i< row.length; i++){
   row[i] = '<div contenteditable="true" style="color:black;background-color:white">' + row[i] + '</div>'
};
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
      } ).DataTable( {
          autofill: true,
          select:'single',
          data: dataSet,
          stateSave: true,
          stateSaveCallback: function(settings,data) {
     localStorage.setItem( 'DataTables_' + settings.sInstance, JSON.stringify(data) )
   },
 stateLoadCallback: function(settings) {
   return JSON.parse( localStorage.getItem( 'DataTables_' + settings.sInstance ) )
 },
          columns: columnsArr,
          rowId: function(dataSet) {
             return 'id_' + dataSet[8];
          },
        //  "order": [[ 8, 'desc' ]],
          "ordering": true,
          "columnDefs": [{targets: 2, type: 'formatted-num'}]

      } );

let index = 0;
let old_index = 0;

table.on( 'user-select', function ( e, dt, type, cell, originalEvent ) {
        //Get the new and the old index
        old_index = index;
        index = cell.index().row;

        //Get row
        var row = dt.row( cell.index().row ).node();
        if ( $(row).hasClass('selected') ) {

              // deselect
              console.log("deselect");
              return false;

        } else {
           //Get new values
           let row_content = dt.row( old_index ).node().innerHTML;
           //Split string into array
           let row_content2 = row_content.replace(/<\/td>/g,"</td>,").split(",");
           //Draw array
           let rowNode = table.row(old_index).data(row_content2).draw();
        }

    });

$('#saveBtn').click( function() {
   var data = table.data();
   console.log(data);
   return false;
} );

$('#copyBtn').click( function() {

    //Get updated text
    if (!table.row({ selected: true }).node()) {
        alert("Please select at least one row");
    } else {
        let sel_row =   table.row({ selected: true }).node().innerHTML;
        //Split string into array
        let cpy_row = sel_row.replace(/<\/td>/g,"</td>,").split(",");
          //If sel_row has id, remove it to become a new entry
        let cpy_row2 = (cpy_row.slice(1,((template.field).length+1)));

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
        let arr;

        //Get number of rows
        let  index_counter = get_index();

        for (let j=0;j<(num_rows);j++){
          arr = [index_counter++];

          template.field.forEach(function (i){
             arr.push('<div contenteditable="true" style="color:black;background-color:white">&nbsp;</div>');
          });

          sel = table.row.add( arr ).draw().node();
        };

        //Make the last entry active
      //  $( rowNode ).animate( { color: 'blue' } );
        return false;
     });

    $('#delBtn').click( function() {
      let sel_row = table.row({ selected: true });
      //Check that a row has been selected
      if (sel_row[0].length === 0) {
          alert("Please select at least one row");
      } else {
       var rowNode = table.row('.selected').remove().draw();
      }
       return false;
    } );


} );
