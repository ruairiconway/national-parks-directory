'use strict';

//parkData.data[i].fullName
//parkData.data[i].url
//parkData.data[i].description
//parkData.data[i].addresses

function displayParkList(parkData) {
    console.log(parkData);
    $('#park-list').removeClass('hidden').html(
        `<p>test</p>`
    );
}


function getParkList(searchStateCode, searchMaxNum) {
    var myHeaders = new Headers();
    myHeaders.append("X-Api-Key", myApiKey);
    myHeaders.append("Cookie", myCookie);
    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${searchStateCode}&limit=${searchMaxNum}`, requestOptions)
        .then(response => response.json())
        .then(responseJson => displayParkList(responseJson))
        .catch(error => console.log('error occured //', error));
}


function watchForm() {
    $('#search-form').submit(event => {
        event.preventDefault();
        let searchStateCode = $('#js-search-state').val();
        let searchMaxNum = $('#js-search-num').val();
        getParkList(searchStateCode, searchMaxNum);
    });
}


$(watchForm);