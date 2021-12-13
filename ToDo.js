todoMain();

function todoMain(){

    let inputElement,
        categoryElement,
        addButton,
        selectElement;

    getElements();
    addListeners();

    function getElements(){
        inputElement = document.getElementsByTagName("input")[0];
        categoryElement = document.getElementsByTagName("input")[1];
        addButton = document.getElementById("addBtn");
        selectElement = document.getElementById("categoryFilter");
    }

    function addListeners(){
    addButton.addEventListener("click", addEntry, false);
    selectElement.addEventListener("change", filterEntries, false);
    }

    function addEntry(){

        let inputValue = inputElement.value;
        inputElement.value = "";

        let inputValue2 = categoryElement.value;
        categoryElement.value = "";

        //Add a new row

        let table = document.getElementById("todoTable");

        let trElement = document.createElement("tr");
        table.appendChild(trElement);

        //checkbox cell
        let checkboxElement = document.createElement("input");
        checkboxElement.type = "checkbox";
        checkboxElement.addEventListener("click", done, false);

        let tdElement1 = document.createElement("td");
        tdElement1.appendChild(checkboxElement);
        trElement.appendChild(tdElement1);


        //to-do cell
        let tdToDoElement = document.createElement("td");
        tdToDoElement.innerText = inputValue;
        trElement.appendChild(tdToDoElement);

        //category cell
        let tdCategoryElement = document.createElement("td");
        tdCategoryElement.innerText = inputValue2;
        trElement.appendChild(tdCategoryElement);

        //delete cell
        let spanElement = document.createElement("span");
        spanElement.innerText = "delete";
        spanElement.className = "material-icons";
        spanElement.addEventListener("click", deleteItem, false);

        let tdDeleteElement = document.createElement("td");
        tdDeleteElement.appendChild(spanElement);
        trElement.appendChild(tdDeleteElement);

        function deleteItem(){
            trElement.remove();
        }

        function done(){
            trElement.classList.toggle("strike");
        }

    }

    function filterEntries() {
        let selection = selectElement.value;

        if(selection === "All Categories"){

            let rows = document.getElementsByTagName("tr");

            Array.from(rows).forEach((row)=>{
                row.style.display = "";
            });
        }else{
        let rows = document.getElementsByTagName("tr");

        Array.from(rows).forEach((row, index)=>{
            if(index===0){
                return;
            }
            let category = row.getElementsByTagName("td")[2].innerText;
            if (category === selectElement.value){
                row.style.display = "";
            }else {
                row.style.display = "none";
            }
        });
        }

    }
}