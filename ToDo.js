todoMain();

function todoMain() {

    const DEFAULT_CATEGORY_FILTER = "All Categories";

    let inputElement,
        categoryElement,
        dateInput,
        timeInput,
        addButton,
        sortButton,
        selectElement,
        todoListStorageData = [];


    getElements();
    addListeners();
    load();
    renderRows();
    upDateSelectOptions();

    function getElements() {
        inputElement = document.getElementsByTagName("input")[0];
        categoryElement = document.getElementsByTagName("input")[1];
        addButton = document.getElementById("addBtn");
        sortButton = document.getElementById("sortBtn");
        selectElement = document.getElementById("categoryFilter");
        dateInput = document.getElementById("dateInput");
        timeInput = document.getElementById("timeInput");
    }

    function addListeners() {
        addButton.addEventListener("click", addEntry, false);
        sortButton.addEventListener("click", sortToDoList, false);
        selectElement.addEventListener("change", filterEntries, false);
    }

    function addEntry() {

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

        let trElements  = document.getElementsByTagName("tr");
        for(let i = trElements.length - 1; i > 0; i--){
            trElements[i].remove();
        }
        //empty the table rows - keeping the first row
        if (selection === DEFAULT_CATEGORY_FILTER) {

            todoListStorageData.forEach(obj => renderRow(obj));

        } else {

            todoListStorageData.forEach( obj => {
                if( obj.category === selection){
                    renderRow(obj);
                }
            });

        }

    }

    function upDateSelectOptions() {
        let options = [];

        todoListStorageData.forEach((obj)=>{
            options.push(obj.category);
        });

        let optionsSet = new Set(options);


        //empty options
        selectElement.innerHTML = "";

        let newOptionElement = document.createElement('option');
        newOptionElement.value = DEFAULT_CATEGORY_FILTER;
        newOptionElement.innerText = DEFAULT_CATEGORY_FILTER;
        selectElement.appendChild(newOptionElement);

        for (let option of optionsSet) {
            let newOptionElement = document.createElement('option');
            newOptionElement.value = option;
            newOptionElement.innerText = option;
            selectElement.appendChild(newOptionElement);
        }
        filterEntries();


    }

    function save() {
        let stringified = JSON.stringify(todoListStorageData);
        localStorage.setItem("todoListStorageData", stringified);
    }

    function load() {

        let retrievedStorageData = localStorage.getItem("todoListStorageData");
        todoListStorageData = JSON.parse(retrievedStorageData);
        if (todoListStorageData === null) {
            todoListStorageData = [];
        }

    }

    function renderRows() {
        todoListStorageData.forEach(todoObj => {
            renderRow(todoObj);
        })

    }

    //add cells to the table row
    function renderRow({
                           id: id,
                           todo: inputValue,
                           category: inputValue2,
                           date: dateValue,
                           time: timeValue,
                           completed: completed
                       }) {

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
        let formattedDate = dateObject.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: 'UTC'
        });

        dateElement.innerText = formattedDate;
        trElement.appendChild(dateElement);

        //time cell
        let timeElement = document.createElement("td");

        //force time to be formatted in 12 hour time, not 24 hour time

        //store timeValue into a variable to keep the time value as string and perform operations
        let originalTime = timeValue;
        //get the hour from the time
        let originalHour = originalTime.substr(0, 2);
        //return int value of the hour and store into a variable
        let intHour = parseInt(originalHour);
        //dayOrNight will be AM or PM depending on hour being greater than 12
        let dayOrNight = " AM";
        //formattedTime will store the time with the newly formatted hour
        let formattedTime = "";
        //formattedHour will store the newly formatted hour
        let formattedHour = "";

        //check if the hour is greater than 12.
        // if it is, subtract 12 from the hour and set dayOrNight to PM
        if (intHour > 12) {
            intHour = intHour - 12;
            dayOrNight = " PM";
        }

        //convert intHour to string and assign to formatted hour
        formattedHour = intHour.toString();
        //replace originalTime's original hour with the new formatted hour
        formattedTime = originalTime.replace(originalHour, formattedHour);
        //set timeElement's inner text to the formatted time followed by AM or PM
        timeElement.innerText = formattedTime + dayOrNight;
        //add the timeElement td to the row
        trElement.appendChild(timeElement);

        //to-do cell
        let tdToDoElement = document.createElement("td");
        tdToDoElement.innerText = inputValue;
        trElement.appendChild(tdToDoElement);

        //category cell
        let tdCategoryElement = document.createElement("td");
        tdCategoryElement.innerText = inputValue2;
        tdCategoryElement.className = "categoryCell";
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

        if (completed) {
            trElement.classList.add("strike");
        } else {
            trElement.classList.remove("strike");
        }


        function deleteItem() {
            trElement.remove();

            upDateSelectOptions();

            for (let i = 0; i < todoListStorageData.length; i++) {

                if (todoListStorageData[i].id == this.dataset.id) {
                    todoListStorageData.splice(i, 1);
                }
            }
            save();
        }

        function done() {
            trElement.classList.toggle("strike");

            //check for element ["completed"] = this.checked

            for (let i = 0; i < todoListStorageData.length; i++) {

                if (todoListStorageData[i].id == this.dataset.id) {
                    todoListStorageData[i]["completed"] = this.checked;
                }
            }
            save();

        }


    }

    function _uuid() {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function sortToDoList() {
        todoListStorageData.sort((a, b) => {
        let aDate = Date.parse(a.date);
        let bDate = Date.parse(b.date);
        return aDate - bDate;
    });
        save();
        //empty the table rows - keeping the first row
        let trElements  = document.getElementsByTagName("tr");
        for(let i = trElements.length - 1; i > 0; i--){
            trElements[i].remove();
        }
        renderRows();
}

}