'use strict';

const $  = require( 'jquery' );
//const editTable = require( '@srldl/edit-tabletest/js/edit-table.js');
//require( 'datatables.net-dt' )( window, $ );
const dt = require( 'datatables.net' )( window, $ );
require('datatables.net-select' )( window, $ );
require('datatables.net-autofill')( window, $ );
require( 'datatables.net-keytable' )( window, $ );


//Testdata  template and fieldwork
let template =  [
    "matrix",
    "project",
    "species",
    "species_identification",
    "label_name",
    "comment",
    "id"
];

let fieldwork = [{
  "id":"4568140a7f01462edc029e42ab040f01",
  "matrix":"feather",
  "project": "Kongsfjorden northern fulmar",
  "species": "fulmarus glacialis",
  "species_identification": "77",
  "label_name": "6745232",
  "comment": "dead"
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


let dataSet=[];
let rowArr;
//This counter holds max row_number
let index_count = 0;
function increment_index_count(){
    index_count++;
}

//sort
for (let j of fieldwork) {
  rowArr = [""];
  for (let k of template) {
     let text = (j[k] == '') ? '&nbsp;' : j[k];
     rowArr.push('<div contenteditable="true" id="'+ k +'_'+(index_count).toString()+'" style="color:black;background-color:white">' + text + '</div>');
  }
  //Id is the last entry, push directly without editable or id
  rowArr[rowArr.length-1] = j['id'];
  dataSet.push(rowArr);
  increment_index_count();
}

  //Create table headings
  let columnsArr = [{ 'title': 'index' }];
  for (let value of template) {
    columnsArr.push({ 'title': value });
  }

    let table;
    $(document).ready(function() {
      $('#table1').on( 'init.dt', function () {
            table = $('#table1').DataTable();
          } ).DataTable( {

          stateSave: true,
            data: dataSet,
            columns: columnsArr,
        //  keys: true,
          autoFill: {
            columns: ':not(:last-child)'
        },
            select:'single',
            keys: true,  //connected events key-blur
          //  rowId:  ,
          /*  rowId: function(index_count) {
              console.log(index_count);
              return   index_count;
            }, */
            "ordering": true
        } );

    //Provide index
    table.on( 'order.dt search.dt', function () {
           table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
               cell.innerHTML = i+1;
           } );
       } ).draw();

  add_id();

  //Add id to <td> html element
  function add_id () {
    table.cells().nodes()[0]['id'] = "undefined_0";
    for  (let b=1;b<table.cells().nodes().length;b++){
        let obj = table.cells().nodes()[b]['_DT_CellIndex'];
        table.cells().nodes()[b]['id'] = template[obj.column-1] + "_" + obj.row.toString();
    }
    return false;
  }


       //Get the number of new or copied row we want
       //If null, return 1 for one row added
       var get_rows = () => {
           let num_input = document.getElementById('addRows').value;
           //Set value back to empty
           document.getElementById('addRows').value = '';
           let num_rows = num_input.match(/[0-9]+/);
           if (num_rows !== null){
             return num_rows[0];
           } else {
             return 1;
           }
       }


       let index = 0;
       let old_index = 0;
       table.on( 'user-select', function ( e, dt, type, cell, originalEvent ) {
               //Get the new and the old index
               old_index = index;
               index = cell.index().row;
            //   table.row(cell.index().row).nodes()[0].id = "oo";
               console.log(table.row(cell.index().row).nodes());


               //Get row
               var row = dt.row( cell.index().row ).node();

               if ( $(row).hasClass('selected') ) {
                     //deselect
                     console.log("deselect");



                      return false;
               } else {
                  //Remove select and set the value
                //  remove_select_menu();
                  if (document.getElementById("sel")) {
                     let e = document.getElementById("sel");
                     let td_parent = document.getElementById("sel").parentNode.parentNode;
                     let val = e.options[e.selectedIndex].value;
                     td_parent.innerHTML = '<div contenteditable="true" id="'+ td_parent.id +'" style="color:black;background-color:white">'+val+'</div>';

                    console.log(document.getElementById("sel").parentNode.parentNode.id);
                    console.log(e.options[e.selectedIndex].value);

                  }

                  update_last_row(dt, old_index);
               }
              // return false;
               //If we have select menus they should appear now
               implement_select_menu( template[(cell[0][0].column)-1] + "_" + (cell[0][0].row).toString()  );
      });

      //Update the last row edited
      var implement_select_menu = (id) => {
        console.log(id);
        let id_jq = "#"+id;
        var parent = $(id_jq).parent();

            var returnstring = '';
            let arr = ['feather','egg', 'liver'];
            for (var i in arr) {
                    returnstring += "<option value='" + arr[i] + "'>" + arr[i] + "</option>";
         }
      //   $(id_jq).append("uuu");
         console.log($(id_jq)[0].innerHTML);

           $(id_jq)[0].innerHTML = '<div id="species_identification_0"><select id="sel" class="target">' + returnstring + '</select></div>';
      //   $(id_jq).replaceWith("<td id='"+id+"' class='focus'><div><select>" + returnstring + "</select></div></td>");
      //   $(id).replaceWith("<td id='test'><div contenteditable=\"true\"><select>" + returnstring + "</select></div></td>");
         //Remove select from where
      }


       $('#copyBtn').click( function() {

           //Get updated text
           if (!table.row({ selected: true }).node()) {
               alert("Please select at least one row");
           } else {
               //Get hold of the content
               let sel_row =   table.row({ selected: true }).data();
               let cpy_row = [];

               //Get rid of old divs - extract innerHTML from text string
               for (var c of sel_row){
                    cpy_row.push(c.replace(/<\/*div[^>]*>/g,""));
               }

               let num_rows = get_rows();
               let rowArr, rowNode;

               //Get number of rows
               for (let j=0;j<(num_rows);j++){
                 rowArr = [""];

                 for (let i=0;i<template.length;i++){
                    rowArr.push('<div contenteditable="true" id="'+ template[i] +'_'+ index_count.toString()+'" style="color:black;background-color:white">'+cpy_row[i+1]+'</div>');
                 };
               //Id shouldnot have id or be editable
                rowArr[rowArr.length-1] = '';
                rowNode = table.row.add( rowArr ).draw().node();
                rowNode.id = "row_"+index_count;
                increment_index_count();
               };
               add_id();
               $( rowNode )
                       .animate( { color: 'blue' } );
               }
               return false;
       } );

       //Update the last row edited
       var update_last_row = (dt, old_index) => {
         //Get new values
         let row_content = dt.row( old_index ).node().innerHTML;
         //Change a long text string HTML style into an div array
         //Only with node() we can get the updated value.
         let row_content2 = row_content.replace(/<\/*td[^>]*>/g,"")
                                       .replace(/<\/div>/g,"</div>,")
                                       .replace(/[^<]/,",").split(",");
         //Draw (publish) array
         let rowNode = table.row(old_index).data(row_content2).draw(false);
       }

       $('#saveBtn').click( function() {
          let sel_row = table.row({ selected: true }).nodes();
          console.log(sel_row);
          console.log(table.row({ selected: true }).data());

          //table.cells().nodes()[0]['id'] = "no1";
          //table.cells().nodes()[2]['_DT_CellIndex'];

          update_last_row(sel_row, sel_row.index);



          //console.log(table.cell({ selected: true }))

          var data = table.data();
          console.log(table);
          return false;
       } );


       $('#newBtn').click( function() {
               let num_rows = get_rows();
               let rowArr;

               //Get number of rows
               for (let j=0;j<(num_rows);j++){
                 rowArr = [""];

                 template.forEach(function (i){
                    rowArr.push('<div contenteditable="true" id="'+ i +'_'+ index_count.toString()+'" style="color:black;background-color:white">&nbsp;</div>');
                 });
               //Id should not be editable
                rowArr[rowArr.length-1] = '';
                let rowNode = table.row.add( rowArr ).draw().node();
                //Add row id to TR element
                rowNode.id = "row_"+index_count;
                increment_index_count();
                add_id();
               };
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
           });
});
