'use strict'

// =========== VARIABLES ===========
const stateDropdown = document.getElementById('js-state-select')
const submitBtn = document.getElementById('js-submit-btn')
const noStateMsg = document.getElementById('js-no-state-message')
const directoryWrapper = document.getElementById('js-directory-wrapper')


// =========== TOOLS ===========

function getRanNum(max) {
    return Math.floor(Math.random() * (max))
}


// =========== HANDLE ===========

function handleCardTopics(topics) {
    if (topics.length === 0) { // no topics exist
        return ''
    } else if (topics.length === 1) { // 1 topics exist
        let topicsHtml = `
            <div class="card-topics">
                <p>${topics[0].name}</p>
            </div>`
        return topicsHtml
    } else if (topics.length === 2) { // 2 topics exist
        let topicsHtml = `
            <div class="card-topics">
                <p>${topics[0].name}</p>
                <p>${topics[1].name}</p>
            </div>`
        return topicsHtml
    } else if (topics.length > 2) { // 3+ topics exist
        let index1 = getRanNum(topics.length)
        let index2 = getRanNum(topics.length)
        while (index1 === index2) {
            index2 = getRanNum(topics.length)
        }
        let topicHtml = `
            <div class="card-topics">
                <p>${topics[index1].name}</p>
                <p>${topics[index2].name}</p>
            </div>`
        return topicHtml
    }
}

function handleCardAddress(addresses) {
    for (let address of addresses) {
        if (address.type === 'Physical') {
            let addressHtml = `
                <div class="card-address">
                    <p>${address.city}</p>
                    <p>${address.line1}</p>
                    <p>${address.postalCode}, ${address.stateCode}</p>
                </div>`
            return addressHtml
        }
    }
}

function handleCardContact(contact) {
    // email
    let email
    if (contact.emailAddresses.length > 0) {
        email = contact.emailAddresses[0].emailAddress // email
    } else {
        return ''
    }
    // phoneNum
    for (let num of contact.phoneNumbers) { // phone
        let phoneNum = num.phoneNumber.replace(/\s+/g, '').split('') // remove spaces and create an array
        for (let i = 0; i < phoneNum.length; i++) {
            if (phoneNum[i] === '(' || phoneNum[i] === ')' || phoneNum[i] === '-' || phoneNum[i] === '.') {
                phoneNum.splice(i, 1)
            }
        }
        
        return phoneNum
    }
    // contactHtml
    let contactHtml = `
        <div class="card-contact">
            <p>${email}</p>
            <p>${phoneNum}</p>
        </div>`
    return contactHtml
}


// =========== GENERATE ===========

function generateDirectoryHeaderHtml(state, total) {
    let directoryHeaderHtml = `
    <div class="directory-header">
        <h3>${state}</h3>
        <p>${total} parks</p>
        <p>NPS Directory</p>
    </div>`
    return directoryHeaderHtml
}

function generateParkCardHtml(park) {
    // console.log(park)
    let parkCardHtml = `
    <div class="park-card">
        <h4>${park.fullName}</h4>
        <p>${park.latitude}</p>
        <p>${park.longitude}</p>
        <p>${park.parkCode}</p>
        ${handleCardTopics(park.topics)}
        ${handleCardAddress(park.addresses)}
        ${handleCardContact(park.contacts)}
    </div>`
    return parkCardHtml
}


// =========== RENDER ===========

function renderDirectory(state, parksData) {
    // reset
    directoryWrapper.innerHTML = ''
    // header
    let parkTotal = parksData.total
    let directoryHeaderHtml = generateDirectoryHeaderHtml(state, parkTotal)
    // list
    let parkListHtml = ''
    for (let park of parksData.data) {
        let parkCardHtml = generateParkCardHtml(park)
        parkListHtml += parkCardHtml
    }
    // render to dom
    let directoryHtml = `
        ${directoryHeaderHtml}
        <div class="directory-list">
            ${parkListHtml}
        </div>`
    directoryWrapper.innerHTML = directoryHtml
}


// =========== FETCH ===========
const npsApiUrl = `https://frozen-castle-15409.herokuapp.com/parks`

async function getParks(state) {
    try {
        const parksPromise = await fetch(`${npsApiUrl}/parks?stateCode=${state}`)
        const parksJson = await parksPromise.json()
        if (parksJson.total === 0) {
            noStateMsg.classList.remove('hidden')
        } else {
            renderDirectory(state, parksJson)
        }
    } catch (err) {
        alert("Could not connect to directory. Try again later.")
        console.error(err)
    }
}


// =========== WATCH ===========

function watchForm() {
    // submit state
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        let stateSearch = stateDropdown.value
        // check state is selected
        if (stateSearch === 'none-selected') {
            stateDropdown.classList.add('state-dropdown-error')
        } else {
            getParks(stateSearch)
        }
    })
    // remove error check
    stateDropdown.addEventListener('click', () => {
        stateDropdown.classList.remove('state-dropdown-error')
    })
}

watchForm()