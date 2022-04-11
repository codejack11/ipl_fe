var jwt = localStorage.getItem("jwt");
if (jwt == null) {
    window.location.href = './login.html'
}
var form = document.getElementById("searchForm");

function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);
var TEAMS = ""
var VENUES = ""

const labels = {
    "eliminator": "Eliminator",
    "id": "",
    "man_of_the_match": "Man of the Match",
    "match_date": "Date",
    "match_winner": "Winner",
    "method": "Method",
    "team_1": "Team 1",
    "team_2": "Team 2",
    "toss_decision": "Toss Descision",
    "toss_winner": "Toss Winner",
    "umpire_1": "Umpire 1",
    "umpire_2": "Umpire 2",
    "venue": "Venue",
    "win_margin": "Win Margin",
    "win_type": "Win Type"
}

function loadUser() {
    document.getElementById("email").innerHTML = localStorage.getItem("email");
    document.getElementById("username").innerHTML = localStorage.getItem("name");
}

loadUser();

function logout() {
    localStorage.removeItem("jwt");
    localStorage.clear();
    window.location.href = './login.html'
}

function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key;
        return {
            [newKey]: obj[key]
        };
    });
    return Object.assign({}, ...keyValues);
}

function searchMatch() {
    var matchHeaders = "";
    var matchRows = "";
    var matchData = "";
    const team_1 = document.getElementById("team_1").value;
    const team_2 = document.getElementById("team_2").value;
    const venue = document.getElementById("venues").value;

    const team_1_id = TEAMS.filter((item) => item.name == team_1)[0].id;
    var team_2_id = "";
    var venue_id = "";
    if (team_2) {
        team_2_id = TEAMS.filter((item) => item.name == team_2)[0].id;
    }
    if (venue) {
        venue_id = VENUES.filter((item) => item.stadium == venue)[0].id;
    }

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", BASE_URL + "api/search/match/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
    xhttp.send(JSON.stringify({
        "team_1": team_1_id,
        "team_2": team_2_id,
        "venue": venue_id
    }));

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            if (this.status == 200) {
                var data = objects['data'];
                if (typeof data !== 'undefined' && data.length > 0) {
                    var obj = data[0]
                    const renamedObj = renameKeys(obj, labels);
                    var keys = Object.keys(renamedObj);
                    keys.forEach(key => {
                        matchHeaders += "<th>" + key + "</th>";
                    });

                    data.forEach(element => {
                        Object.values(element).forEach(value => {
                            matchData += "<td>" + value + "</td>";
                        })
                        matchRows += "<tr>" + matchData + "</tr>"
                        matchData = ""
                    });
                    document.getElementById("matchDetails").innerHTML = matchHeaders;
                    document.getElementById("matchDetails").innerHTML += matchRows;
                } else {
                    document.getElementById("matchDetails").innerHTML = "<p>No Records Found!</p>"
                }
            }
        }
    };
}

function loadTeams() {
    var teamOptions = '<option value="" disabled selected>Select</option>';
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", BASE_URL + "api/teams/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            if (this.status == 200) {
                const data = objects["data"]
                TEAMS = data
                data.forEach(element => {
                    teamOptions += "<option>" + element.name + "</option>";
                });
                document.getElementById("team_1").innerHTML = teamOptions;
            }
        }
    };
}

function loadVenues() {
    var venuesOptions = '<option value="" disabled selected>Select</option>';
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", BASE_URL + "api/venues/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            if (this.status == 200) {
                const data = objects["data"]
                VENUES = data
                data.forEach(element => {
                    venuesOptions += "<option>" + element.stadium + "</option>";
                });
                document.getElementById("venues").innerHTML = venuesOptions;
            }
        }
    };
}

function changeTeam(value) {
    var teamOptions = '<option value="" disabled selected>Select</option>';
    const team2 = TEAMS.filter((item) => item.name !== value);
    team2.forEach(element => {
        teamOptions += "<option>" + element.name + "</option>";

    });
    document.getElementById("team_2").innerHTML = teamOptions;
}

loadTeams();
loadVenues();