'use strict';

//parkData.data[i].fullName
//parkData.data[i].url
//parkData.data[i].description
//parkData.data[i].addresses


function generateEmptyListString() {
    let noParksFound = `<p>One or more of your search terms didn't work. Try again!</p>`;
    return noParksFound;
}


function generateParkListString(parkData) {
    let stateParkList = ``;

    for (let i = 0; i < parkData.data.length; i++) {
        stateParkList += `
        <li>
            <p>${parkData.data[i].fullName}</p>
            <a href="${parkData.data[i].url}" target=""_blank><p>visit site</p></a>
            <p>${parkData.data[i].description}</p>
        </li>`
    }

    return stateParkList;
}


function displayParkList(parkData) {
    console.log(parkData);
    if (parkData.total > 0) {
        $('#park-list').removeClass('hidden').append(
            `<p>${parkData.data[0].states}</p>
            <ul>
                ${generateParkListString(parkData)}
            </ul>`
        );
    } else {
        $('#park-list').removeClass('hidden').append(
            generateEmptyListString()
        );
    }
}


function getParkList(stateCodeArray, searchMaxNum) {
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
    $('#search-form').submit(event => {
        event.preventDefault();
        $('#park-list').empty();
        let searchStateCode = $('#js-search-state').val();
        let searchMaxNum = $('#js-search-num').val();
        let stateCodeArray = searchStateCode.replaceAll(' ','').split(',');
        getParkList(stateCodeArray, searchMaxNum);
    });
}


$(watchForm);