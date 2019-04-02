'use strict';

const $  = require( 'jquery' );

const dt = require( 'datatables.net' )( window, $ );
require('datatables.net-select' )( window, $ );
require('datatables.net-autofill')( window, $ );
require('datatables.net-keytable')( window, $ );


//Testdata  template and fieldwork
let template =  [
    "matrix",
    "project",
    "species",
    "species_identification",
    "label_name",
    "comment",
    "my_own_field",
    "my_own_field2",
    "event_date",
    "id"
];

let fieldwork = [{
  "id":"4568140a7f01462edc029e42ab040f01",
  "matrix":"feather",
  "project": "Kongsfjorden northern fulmar",
  "species": "fulmarus glacialis",
  "species_identification": "77",
  "label_name": "6745232",
  "my_own_field": "test",
  "my_own_field2": "test2",
  "event_date":"2019-04-01T06:42:23Z",
  "comment": "dead"
},
{
  "id":"4568140a7f01462edc029e42ab056e41",
  "matrix":"feather",
  "project": "Kongsfjorden northern fulmar",
  "species": "fulmarus glacialis",
  "species_identification": "78",
  "label_name": "6745211",
  "my_own_field": "test",
  "my_own_field2": "test2",
  "event_date":"2019-09-01T06:42:23Z",
  "comment": "Juvenile"
},
{
  "id":"4568140a7f01462edc029e42ab056e41",
  "matrix":"egg",
  "project": "Kongsfjorden northern fulmar",
  "species": "fulmarus glacialis",
  "species_identification": "79",
  "label_name": "4566432",
  "my_own_field": "test",
  "my_own_field2": "test2",
  "event_date":"2019-01-01T06:42:23Z",
  "comment": ""
}];



let species_list = ["ursus maritimus", "vulpes lagopus",
      "boreogadus saida","salvelinus alpinus","mallotus villosus",
      "strongylocentrotus droebachiensis","hyas araneus","buccinum undatum",
      "buccinum glaciale", "mya truncata",
      "gymnacanthus tricuspis","myoxocephalus scorpius",
      "phoca vitulina","pagophilus groenlandicus",
      "cystophora cristata","pusa hispida",
      "odobenus rosmarus","leptonychotes weddellii",
      "orcinus orca","delphinapterus leucas", "monodon monoceros",
      "bubo scandiacus","larus hyperboreus","uria lomvia","uria aalge","rissa tridactyla",
      "somateria mollissima","fratercula arctica","phalacrocorax aristotelis",
      "larus argentatus", "morus bassanus", "fulmarus glacialis", "alle alle"];
let matrix_list = ["egg","milk","whole blood","blood cell",
      "plasma","serum","abdominal fat","subcutaneous fat",
      "blubber","hair","feather","muscle","liver","brain",
      "adrenal","whole animal","gonad",
      "whole animal except lower part of foot",
      "whole animal except closing muscle and siphon",
      "digestive gland"];

//Input object
let obj = { "fieldwork":fieldwork,
            "template":template,
            "selectlist": {"species":species_list, "matrix":matrix_list},
            "autocompletes":["my_own_field","my_own_field2"],
            "datefields":["event_date"]};


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
       rowArr.push('<td id="'+ k +'_'+(index_count).toString()+'"><input type="text" id="'+ k +'_'+(index_count).toString()+'" name="'+ k +'_'+(index_count).toString() +'"value="'+ text+'"></td>');
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
            autoFill: {
            columns: ':not(:last-child)'
            },
            select:'single',
            keys: true,  //connected events key-blur
            "ordering": true
        } );

    //Provide index
    table.on( 'order.dt search.dt', function () {
           table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
               cell.innerHTML = i+1;
           } );
       } ).draw();

  //add_id();

  //Add id to <td> html element
/*  function add_id () {
    table.cells().nodes()[0]['id'] = "undefined_0";
    for  (let b=1;b<table.cells().nodes().length;b++){
        let temp_ = table.cells().nodes()[b]['_DT_CellIndex'];
        table.cells().nodes()[b]['id'] = template[temp_.column-1] + "_" + temp_.row.toString();
    }
    return false;
  }*/


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

       //Datepicker
    /*   const picker = datepicker(id,{
         onSelect: (instance, date) =>
         {
           const value = date.getDate() +'-'+ (date.getMonth()+1) +'-'+ date.getFullYear();
           document.getElementById("test").innerText = value;
          // $(id) = value;
         }
       });*/


      //Update to select menus, autocomplete or datepicker
      table.on( 'key-focus', function ( e, datatable, cell, originalEvent ) {
        console.log("key-focus");

        //Find column
        let colname = template[cell.index().column-1];
        let id =  colname+'_'+cell.index().row;
        //if datefield
        if (obj.datefields.includes(colname)) {

            datepicker('#'+id);
        //if select
        } else if (obj.selectlist.hasOwnProperty(colname)) {
           console.log("select");
           implement_select(id);
        //if autocomplete
        } else if (obj.autocompletes.includes(colname)){
           console.log("autocomplete");
        }

      });

      //On leave - update data
      table.on( 'key-blur', function ( e, datatable, cell ) {
        //console.log("key-blur");
        //Get cell id
        let temp = template[parseInt(cell.index().column) - 1] + "_" + cell.index().row;
        let text = table.$('input#'+temp)[0].value;
        //Get old row data from input
        let rowData = datatable.row( cell.index().row ).data();
        //Create new data and update table
        rowData[cell[0][0].column]='<td id="'+ temp +'"><input type="text" id="'+ temp +'"value="'+ text+'"></td>'
        let rowNode = table.row(cell.index().row).data(rowData).draw(false);

      });

      let index = 0;
      let old_index = 0;
      //Autocomplete for predesignated fields
       var autocomplete = (id) => {
         if (document.getElementById(id) !== null) {
            console.log("autocomplete");
            let sel_col = [];
            //Get the name of the column
            let name = id.slice(0, (id.lastIndexOf("_")) );
            //Use the  column name to find the column index
            let col_num = Object.keys(template).find(key => template[key] === name);
            //Get all column data
            let col = table.column(parseInt(col_num)+1).select().data();

            for (var index = 0; index < col.length; index++) {
                //Extract the values and add them to sel_col array
                sel_col.push(col[index].replace(/<\/*div[^>]*>/g,""));
            }
          //  console.log(sel_col);

          //  for (var i in sel_col) {
          //        returnstring += "<option value='" + arr[i] + ">";
          //  }


      //$(id_jq)[0].innerHTML = '<div><select id="sel" class="target">' + returnstring + '</select></div>';



            //Extract all values from the selected column and try autocomplete

         }
       }


     //Remove_select_menu, set to selected value;
      var remove_select_menu = (id) => {
        if (document.getElementById(id) !== null) {

           let e = document.getElementById(id);
           let td_parent = document.getElementById(id).parentNode.parentNode;
           let val = e.options[e.selectedIndex].value;
          // td_parent.innerHTML = '<div contenteditable="true" style="color:black;background-color:white">'+val+'</div>';
           td_parent.innerHTML = '<input type="text" value="'+val+'">';
           //td_parent.innerHTML = '<div contenteditable="true" id="'+ td_parent.id +'" style="color:black;background-color:white">'+val+'</div>';
           console.log(td_parent.innerHTML);
        }
      }

      //Update the last row edited
      var implement_select = (id) => {

        let id_jq = "#"+id;
        let parent = $(id_jq).parent();
        let text = $(id_jq).text();
        let name_temp = ($(id_jq)[0].id).lastIndexOf("_");
        let name = ($(id_jq)[0].id).slice(0,name_temp);

        //If there is an array of select values matching the cell content
        console.log(obj.selectlist[name]);
        let arr = obj.selectlist[name];
        if (arr != undefined) {
              let returnstring = '';

              for (var i in arr) {
                  if (arr[i] === text) {
                    returnstring += "<option value='" + arr[i] + "'selected>" + arr[i] + "</option>";
                  } else {
                    returnstring += "<option value='" + arr[i] + "'>" + arr[i] + "</option>";
                  }
              }
            console.log($(id_jq)[0].innerHTML);
           $(id_jq)[0].innerHTML = '<select id="sel" class="target">' + returnstring + '</select>';
           console.log($(id_jq)[0]);

             }
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
                    //rowArr.push('<div contenteditable="true" id="'+ template[i] +'_'+ index_count.toString()+'" style="color:black;background-color:white">'+cpy_row[i+1]+'</div>');

                    rowArr.push('<div contenteditable="true" style="color:black;background-color:white">'+cpy_row[i+1]+'</div>');
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
         let row_content2 = row_content.replace(/<\/td>/g,"</td>,").split(",");
         row_content2.splice(-1,1);

         //Draw (publish) array
         let rowNode = table.row(old_index).data(row_content2).draw(false);
       }

       $('#saveBtn').click( function() {

      //   remove_select_menu("sel");
      //    let sel_row = table.row({ selected: true }).nodes();
      //    console.log(sel_row);
      //    update_last_row(sel_row, sel_row.index);
      //     var data = table.$('input, select').serialize();

            var data = table.$('input, select').serialize();
          //let data = table.data();
          //console.log(data);
          var nodes = table.nodes();
          console.log(nodes);
          return false;
       } );


       $('#newBtn').click( function() {
               let num_rows = get_rows();
               let rowArr;

               //Get number of rows
               for (let j=0;j<(num_rows);j++){
                 rowArr = [""];

                 template.forEach(function (i){
                //   rowArr.push('<div contenteditable="true" style="color:black;background-color:white">&nbsp;</div>');
                   rowArr.push('<input type="text">');
                  //  rowArr.push('<div contenteditable="true" id="'+ i +'_'+ index_count.toString()+'" style="color:black;background-color:white">&nbsp;</div>');
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
