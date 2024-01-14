const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const playerList = document.querySelector("#playerList");
let allPlayers = [];
// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-ACC-PT-WEB-PT-B';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players`);
        const result = await response.json();
        return (result.data.players);
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchData = async () => {
    try {
        allPlayers = [];
        const result = await fetchAllPlayers();
        result.forEach(item => allPlayers.push(item))
    } catch (error) {
        console.error('مشکل در دریافت داده!', error);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(
            `${APIURL}players/${playerId}`);
        const result = await response.json();
        console.log(result);
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async () => {
    try {
        let inputValues = {};
        inputValues.name = document.querySelector("input#name").value;
        if (inputValues.name == '' || null) { alert("Name can be empty"); return; }
        inputValues.breedValue = document.querySelector("input#breed").value;
        if (inputValues.breedValue == '' || null) { alert("Name can be empty"); return; }
        inputValues.imageURLValue = document.querySelector("input#url").value;
        inputValues.statusValue = document.getElementsByName("status").value;
        if (0 < document.querySelector("input#teamID").value >= 999) {
            inputValues.teamIDValue = document.querySelector("input#teamID").value;
        } else { inputValues.teamIDValue = null; }
        const response = await fetch(`${APIURL}players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: inputValues.name,
                breed: inputValues.breedValue,
                status: inputValues.statusValue,
                imageUrl: inputValues.imageURLValue,
                teamId: inputValues.teamIDValue,
            }),
        }
        );
        const result = await response.json();
        console.log(result);
        if (result.success) {
            updatePage({ container: "flex", form: "none", id: "playersList" });
            message();
            inputValues = {};
            document.querySelector("input#name").value = "";
            document.querySelector("input#breed").value = "";
            document.querySelector("input#url").value = "";
            document.querySelector("input#teamID").value = "";
        }




    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const message = function () {
    const messageDiv = document.createElement("DIV");
    document.getElementById("body").appendChild(messageDiv);
    messageDiv.classList.add("message");

    //const messageDiv = document.getElementById("messageDiv");
    messageDiv.innerHTML = `player added            <i class="fa-regular fa-rectangle-xmark"></i>`;
    messageDiv.addEventListener("click", (e) => {
        messageDiv.remove();
    })
}





document.querySelector("#SubmitBTN").addEventListener("click", () => {
    addNewPlayer();
});

document.querySelector("#closeBTN").addEventListener("click", () => {
    updatePage({ container: "flex", form: "none", id: "playersList" });
});

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}players/${playerId}`, {
            method: 'DELETE'
        }
        );
        const result = await response.json();
        if (result.success) {
            document.querySelector("#playerList").innerHTML = "";
            init();
        }

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

const renderAllPlayers = async (list) => {
    try {
        list.forEach(element => {
            render(element.id, element.imageUrl, element.name, element.breed, element.status, element.teamId)
        });

    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    await fetchData();
    await renderAllPlayers(allPlayers);
}
init();





//////////////DOM//////////////////
function render(Id, Img, Name, Breed, Status, TeamId) {



    const player = document.createElement("LI");
    player.classList.add("player");
    playerList.appendChild(player);

    const thumbNail = document.createElement("IMG");
    thumbNail.classList.add("thumbnail");
    thumbNail.src = Img;
    player.appendChild(thumbNail);

    const combiner = document.createElement("DIV");
    combiner.classList.add("combiner");
    player.appendChild(combiner);

    const playerName = document.createElement("DIV");
    playerName.classList.add("name");
    playerName.innerText = Name;
    combiner.appendChild(playerName);

    const breed = document.createElement("DIV");
    breed.classList.add("breed");
    breed.innerText = Breed;
    combiner.appendChild(breed);

    const playerStatus = document.createElement("SPAN");
    if (Status == "field") {
        playerStatus.classList.add("status");
        playerStatus.innerHTML = `<i class="fa-solid fa-circle">&nbsp;&nbsp;</i>Field`;
    } else {
        playerStatus.classList.add("statusRed");
        playerStatus.innerHTML = `<i class="fa-regular fa-circle">&nbsp;&nbsp;</i>Bench`
    }
    player.appendChild(playerStatus);

    const teamId = document.createElement("SPAN");
    teamId.classList.add("teamId");
    teamId.innerHTML = TeamId == null ? "Unassigned" : TeamId;
    player.appendChild(teamId);

    const update = document.createElement("SPAN");
    update.classList.add("update");
    player.appendChild(update);

    const updateIcon = document.createElement("I");
    updateIcon.classList.add("fa-regular", "fa-pen-to-square");
    updateIcon.setAttribute("id", Id)
    update.appendChild(updateIcon);
    updateIcon.addEventListener("click", e => {
        console.log("UpDate");
    })

    const remover = document.createElement("SPAN");
    remover.classList.add("del");
    player.appendChild(remover);

    const removerIcon = document.createElement("I");
    removerIcon.classList.add("fa-solid", "fa-trash-can");
    removerIcon.setAttribute("id", Id)
    remover.appendChild(removerIcon);
    removerIcon.addEventListener("click", e => {
        removePlayer(e.target.id);
    })
}




//////////////Router//////////////////
document.querySelector(".nav").addEventListener("click", myRouter);

function myRouter(e) {
    if (e.target.nodeName != "A") return;
    let data;
    switch (e.target.id) {
        case "newPlayerLink":
            data = { container: "none", form: "flex", id: e.target.id }
            updatePage(data)
            history.pushState(data, "New Player Form", "New-Player-Form")
            break;
        default:
            data = { container: "flex", form: "none", id: e.target.id }
            updatePage(data);
            history.pushState(data, "All Players List", "All-Players-List")
            break;
    }
}


function updatePage(data) {
    if (data.id == "playersList") {
        document.querySelector("#playerList").innerHTML = "";
        document.querySelector("#new-player-form").style.display = data.form;
        document.querySelector("#all-players-container").style.display = data.container;
        init();
    }
    else if (data.id == "newPlayerLink") {
        document.querySelector("#playerList").innerHTML = "";
        document.querySelector("#new-player-form").style.display = data.form;
        document.querySelector("#all-players-container").style.display = data.container;
    }
}

window.addEventListener("popstate", (e => {
    if (history.state) {
        updatePage(history.state)
    }
}))
//////////////Router//////////////////
//////////////DOM//////////////////

