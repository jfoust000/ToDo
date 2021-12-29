todoMain();

function todoMain(){

    const DEFAULT_CATEGORY_FILTER = "All Categories";

    let inputElement,
        categoryElement,
        dateInput,
        timeInput,
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
        dateInput = document.getElementById("dateInput");
        timeInput = document.getElementById("timeInput");
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

        let dateValue = dateInput.value;
        dateInput.value = "";

        let timeValue = timeInput.value;
        timeInput.value = "";

        let obj = {
            id: _uuid(),
            todo: inputValue,
            category: inputValue2,
            date: dateValue,
            time: timeValue,
            completed: false,
        }

        renderRow(obj);

        todoListStorageData.push(obj);

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
    function renderRow({ id: id, todo: inputValue, category: inputValue2, date: dateValue, time: timeValue, completed: completed }){

        //Add a new row

        let table = document.getElementById("todoTable");

        let trElement = document.createElement("tr");
        table.appendChild(trElement);

        //checkbox cell
        let checkboxElement = document.createElement("input");
        checkboxElement.type = "checkbox";
        checkboxElement.addEventListener("click", done, false);
        checkboxElement.dataset.id = id;

        let tdElement1 = document.createElement("td");
        tdElement1.appendChild(checkboxElement);
        trElement.appendChild(tdElement1);

        //date cell
        let dateElement = document.createElement("td");
        let dateObject = new Date(dateValue);
        let formattedDate = dateObject.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric" });
        dateElement.innerText = formattedDate;
        trElement.appendChild(dateElement);

        //time cell
        let timeElement = document.createElement("td");

        let originalTime = timeValue;
        let originalHour = originalTime.substr(0,2);
        let intHour = parseInt(originalHour);
        let dayOrNight = " AM";

        let formattedTime = "";
        let formattedHour = "";

        if (intHour > 12){
           intHour = intHour - 12;
           dayOrNight = " PM";
        }


        formattedHour = intHour.toString();
        formattedTime = originalTime.replace(originalHour, formattedHour);

        timeElement.innerText = formattedTime + dayOrNight;
        trElement.appendChild(timeElement);

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
        spanElement.dataset.id = id;
        let tdDeleteElement = document.createElement("td");
        tdDeleteElement.appendChild(spanElement);
        trElement.appendChild(tdDeleteElement);

        checkboxElement.checked = completed;

        if(completed){
            trElement.classList.add("strike");
        }else{
            trElement.classList.remove("strike");
        }


        function deleteItem(){
            trElement.remove();

            upDateSelectOptions();

            for(let i = 0; i < todoListStorageData.length; i++) {

                if (todoListStorageData[i].id == this.dataset.id) {
                    todoListStorageData.splice(i, 1);
                }
            }
            save();
        }

        function done(){
            trElement.classList.toggle("strike");

            //check for element ["completed"] = this.checked

            for(let i = 0; i < todoListStorageData.length; i++) {

                if (todoListStorageData[i].id == this.dataset.id) {
                    todoListStorageData[i]["completed"] = this.checked;
               }
            }
            save();

        }


    }

    function _uuid() {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}