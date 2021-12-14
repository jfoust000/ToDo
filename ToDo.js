todoMain();

function todoMain(){

    const DEFAULT_CATEGORY_FILTER = "All Categories";

    let inputElement,
        categoryElement,
        addButton,
        selectElement,
        todoListStorageData = [];


    getElements();
    addListeners();
    load();
    renderRows();
    upDateSelectOptions();

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



        todoListStorageData.push({
            todo: inputValue,
            category: inputValue2,
        });
        renderRow(todoListStorageData);
        save();

        upDateSelectOptions();

    }

    function filterEntries() {
        let selection = selectElement.value;

        if(selection === DEFAULT_CATEGORY_FILTER){

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
    function upDateSelectOptions(){
        let options = [];

        let rows = document.getElementsByTagName("tr");

        Array.from(rows).forEach((row, index)=> {
            if (index === 0) {
                return;
            }
            let category = row.getElementsByTagName("td")[2].innerText;

                options.push(category);


        });

        let optionsSet = new Set(options);


        //empty options
        selectElement.innerHTML = "";

        let newOptionElement = document.createElement('option');
        newOptionElement.value = DEFAULT_CATEGORY_FILTER;
        newOptionElement.innerText = DEFAULT_CATEGORY_FILTER;
        selectElement.appendChild(newOptionElement);

        for (let option of optionsSet){
            let newOptionElement = document.createElement('option');
            newOptionElement.value = option;
            newOptionElement.innerText = option;
            selectElement.appendChild(newOptionElement);
        }
        filterEntries();


    }
    function save(){
        let stringified = JSON.stringify(todoListStorageData);
        localStorage.setItem("todoListStorageData", stringified);
    }
    function load(){

        let retrievedStorageData = localStorage.getItem("todoListStorageData");
        todoListStorageData = JSON.parse(retrievedStorageData);
        if (todoListStorageData === null){
            todoListStorageData = [];
        }

    }
    function renderRows(){
    todoListStorageData.forEach(todoObj => {
        renderRow(todoObj);
    })
    }
    function renderRow({todo: inputValue, category: inputValue2}){

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

            upDateSelectOptions();
        }

        function done(){
            trElement.classList.toggle("strike");
        }
    }
}