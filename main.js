'use strict';

function generateEmptyListString() {
// called if displayParkList() if there are no parks to display
    let noParksFound = `<p>One or more of your search terms didn't work. Try again!</p>`;
    return noParksFound;
}

function generateParkListString(parkData) {
// called if displayParkList() has parks to display, creates string for each park item
    let stateParkList = ``;
    for (let i = 0; i < parkData.data.length; i++) {
        stateParkList += `
        <li>
            <p class="park-name">${parkData.data[i].fullName}</p>
            <p class="park-url"><a href="${parkData.data[i].url}" target="_blank">visit NPS website</a></p>
            <p class="park-desc">${parkData.data[i].description}</p>
        </li>`
    }

    return stateParkList;
}

function displayParkList(parkData) {
// if park data response contains results, display list in DOM.
    console.log(parkData);
    if (parkData.total > 0) {
        $('#js-park-list').removeClass('hidden').append(
            `<h2>${parkData.data[0].states}</h2>
            <ul class="park-list">
                ${generateParkListString(parkData)}
            </ul>`
        );
    } else {
        $('#js-park-list').removeClass('hidden').append(
            generateEmptyListString()
        );
    }
}

function getParkList(stateCodeArray, searchMaxNum) {
// Get /parks data from developer.nps.gov for each of the state codes submitted, then call displayParkList()
    var myHeaders = new Headers();
    myHeaders.append("X-Api-Key", myApiKey);
    myHeaders.append("Cookie", myCookie);
    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    for (let i = 0; i < stateCodeArray.length; i++) {
        fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${stateCodeArray[i]}&limit=${searchMaxNum}`, requestOptions)
            .then(response => response.json())
            .then(responseJson => displayParkList(responseJson))
            .catch(error => console.log('error occured //', error));
    }
}

function watchForm() {
// On submit, pull input values, create array of state codes, and call getParkList()
    $('#search-form').submit(event => {
        event.preventDefault();
        $('#js-park-list').empty();
        let searchStateCode = $('#js-search-state').val();
        let searchMaxNum = $('#js-search-num').val();
        let stateCodeArray = searchStateCode.replaceAll(' ','').split(',');
        getParkList(stateCodeArray, searchMaxNum);
    });
}

// calls watchForm on load
$(watchForm);