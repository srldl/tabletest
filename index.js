'use strict';

//the rows
let dataRows=[["A","AA","2019-06-14T12:00:00Z"],["B","BB","2019-06-14T12:00:00Z"]];

//Create object with input parameters
let obj =  {  "dataRows": dataRows,
              "headers": ["project", "subproject", "event_date"],
              "selectlist": {"project":["A","B","C"]},
              "autocompletes": ["subproject"],
              "dateFields":["event_date"],
              "id": "exceltable"
};

//This counter holds the selected row
let row_selected = 0;
//This counter holds the row length
let row_length = obj.headers.length + 2;
//This counter holds next row_number
let index_count = 0;

function increment_index_count(count){
   for (let i=0;i<count;i++){
      index_count++;
   }
}



let handleKeyDown = function (event) {
    // do something!
    console.log('keyDown');
    console.log(event);
};

//Set cell and row select
let handleClick = function (event) {
    //1)Get row
    let elem = document.getElementById(event.explicitOriginalTarget.id);
    let id_arr = (elem.id).split('_');

    //2) Remove colors all other rows
    for (let j=1;j<index_count;j++){
      for (let i=0;i<row_length-2;i++){
         document.getElementById(id_arr[0]+"_"+j+"_"+i).style.backgroundColor = "#ffffff";
      }
    }
    //3)Set color
    for (let k=0;k<row_length-2;k++){
         document.getElementById(id_arr[0]+"_"+id_arr[1]+"_"+k).style.backgroundColor = "#f0def2";
    }
    elem.style.borderColor = "blue";
};

// new button pressed
let newBtn = function (event) {
    console.log('newBtn');
};

// copy button pressed
let copyBtn = function (event) {
    console.log('copyBtn');
};

// save button pressed
let delBtn = function (event) {
    console.log('delBtn');
};

// save button pressed
let saveBtn = function (event) {
    console.log('saveBtn');
    container = document.getElementById("table1");
    console.log(container);
    console.log(container.childNodes[4].value);
};

//This is first column with a running count
let count_col = function () {
     var input = document.createElement("input");
     input.type = "text";
     input.id = "counter_" + index_count;
     input.value = index_count;
     input.size = 4;  //Create a small field
     index_count === 0 ? input.value = "count" : input.value = index_count;
          input.readOnly = true;
     container.appendChild(input);
}

//This is last column with a running id
let id_col = function (id, col) {
     var input = document.createElement("input");
     input.type = "text";
     input.id = "cell_" + index_count + "_" + col;
     index_count === 0 ? input.value = "id" : input.value = id +"-"+ index_count;
     input.readOnly = true;
     container.appendChild(input);
}


//Lay out the next row
let newRow = function (container,dataRows,id,readOnly=false){

    //First column
    count_col();

    for (let col=0;col<row_length-2;col++){
                // Append a node with a random text
                //container.appendChild(document.createTextNode("Member " + (row+1)));

                // Create an <input> element, set its type and name attributes
                var input = document.createElement("input");
                input.type = "text";
                input.id = "cell_" + index_count + "_" + col;
                input.value = dataRows[col];
                //If heading,rowno or id, make it non-changeable
                if (readOnly) {
                  input.readOnly = true;
                }
                container.appendChild(input);
    }

     //Add id to the row as the last column
     id_col(id,row_length-1);
     // Append a line break
     container.appendChild(document.createElement("br"));
     increment_index_count(1);

};


 var container = document.getElementById("table1");
 //Autocomplete
 container.addEventListener('keydown', handleKeyDown);
 //Select row
 container.addEventListener('click', handleClick);
 document.getElementById("newBtn").addEventListener('click', newBtn);
 document.getElementById("copyBtn").addEventListener('click', copyBtn);
 document.getElementById("delBtn").addEventListener('click', delBtn);
 document.getElementById("saveBtn").addEventListener('click', saveBtn);

 //Add headers
 newRow(container,obj.headers, obj.id, true);
 //Add rows from database
 for (let j=0;j<dataRows.length;j++){
     newRow(container,obj.dataRows[j], obj.id);
 }
