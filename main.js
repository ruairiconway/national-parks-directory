'use strict'

// =========== VARIABLES ===========
const landingWrapper = document.getElementById('js-landing-wrapper')
const stateForm = document.getElementById('js-state-form')
const stateDropdown = document.getElementById('js-state-select')
const submitBtn = document.getElementById('js-submit-btn')
const noStateMsg = document.getElementById('js-no-state-message')
const directoryWrapper = document.getElementById('js-directory-wrapper')
const pageLoaderDiv = document.getElementById('js-page-loader')
const directoryLoaderDiv = document.getElementById('js-directory-loader')
let alertHtml = ''
let webcamHtml = ''


// =========== TOOLS ===========

function toggleCard(card) {
    card.querySelector('.card-front').classList.toggle('hidden')
    card.querySelector('.card-back').classList.toggle('hidden')
}

function getRanNum(max) {
    return Math.floor(Math.random() * (max))
}

function formatPhoneNum(num) {
    num.splice(0, 0, '(')
    num.splice(4, 0, ')')
    num.splice(5, 0, ' ')
    num.splice(9, 0, ' ')
    return num.join('')
}

function scrollToDirectory() {
    document.body.style.overflow = "visible"
    const anim = requestAnimationFrame((timestamp) => {
        const stamp = timestamp || new Date().getTime();
        const duration = 1200
        const start = stamp
        const startScrollOffset = window.pageYOffset
        const scrollDirectoryTop = directoryWrapper.getBoundingClientRect().top
        scrollToElem(start, stamp, duration, scrollDirectoryTop, startScrollOffset)
    })
    const easeInCubic = function(t) {return t*t*t}
    const scrollToElem = (startTime, currentTime, duration, scrollEndElemTop, startScrollOffset) => {
        const runtime = currentTime - startTime
        let progress = runtime/duration
        progress = Math.min(progress, 1)
        const ease = easeInCubic(progress)
        window.scroll(0, startScrollOffset + (scrollEndElemTop * ease))
        if (runtime < duration) {
            requestAnimationFrame((timestamp) => {
                const currentTime = timestamp || new Date().getTime()
                scrollToElem(startTime, currentTime, duration, scrollEndElemTop, startScrollOffset)
            })
        }
    }
}


// =========== HANDLE ===========

function handleCardTopics(topics) {
    if (topics.length === 0) { // no topics exist
        return ''
    } else if (topics.length === 1) { // 1 topics exist
        let topicsHtml = `
            <div class="park-topics">
                <p>${topics[0].name}</p>
            </div>`
        return topicsHtml
    } else if (topics.length === 2) { // 2 topics exist
        let topicsHtml = `
            <div class="park-topics">
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
            <div class="park-topics">
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
                <div class="park-address">
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
    let email = ''
    let emailHtml = ''
    const includesDomain = contact.emailAddresses[0].emailAddress.includes('@nps.gov')
    if (contact.emailAddresses.length > 0 && includesDomain) {
        email = contact.emailAddresses[0].emailAddress // email
        emailHtml = `
            <a href="${email}">${email}</a>`
    } else {
        emailHtml = ''
    }
    // phoneNum
    let phoneNum
    for (let num of contact.phoneNumbers) { // phone
        phoneNum = num.phoneNumber.replace(/\s+/g, '').split('') // remove spaces and create an array
        for (let i = 0; i < phoneNum.length; i++) {
            if (phoneNum[i] === '(' || phoneNum[i] === ')' || phoneNum[i] === '-' || phoneNum[i] === '.') {
                phoneNum.splice(i, 1)
            }
        }
        phoneNum = formatPhoneNum(phoneNum)
    }
    let phoneNumHtml = `<p>${phoneNum}</p>`
    // contactHtml
    let contactHtml = `
        <div class="park-contact">
            ${emailHtml}
            ${phoneNumHtml}
        </div>`
    return contactHtml
}

function handleCardHours(operatingHours) {
    let hoursHtml = ''
    if (operatingHours.length === 0) {
        hoursHtml = `<p>no hours listed</p>`
    } else {
        let hours = operatingHours[0].standardHours
        hoursHtml = `
            <div class="park-hours">
                <ul class="days-list">
                    <p class="day">sun</p>
                    <p class="day">mon</p>
                    <p class="day">tue</p>
                    <p class="day">wed</p>
                    <p class="day">thu</p>
                    <p class="day">fri</p>
                    <p class="day">sat</p>
                </ul>
                <ul class="hours-list">
                    <p class="hours">${hours.sunday}</p>
                    <p class="hours">${hours.monday}</p>
                    <p class="hours">${hours.tuesday}</p>
                    <p class="hours">${hours.wednesday}</p>
                    <p class="hours">${hours.thursday}</p>
                    <p class="hours">${hours.friday}</p>
                    <p class="hours">${hours.saturday}</p>
                </ul>
            </div>`
    }
    return hoursHtml
}

function handleCardLinks(park) {
    // fees
    let feesStr = ''
    if (park.entranceFees.length === 0) {
        feesStr = 'fees n/a'
    } else if (park.entranceFees[0].cost === 0) {
        feesStr = 'free entry'
    } else {
        feesStr = 'fees'
    }
    // links HTML
    let linksHtml = `
        <a href="${park.directionsUrl}" class="link link-dir" target="_blank">directions</a>
        <a href="https://www.nps.gov/${park.parkCode}/planyourvisit/fees.htm" class="link link-fees" target="_blank">${feesStr}</a>
        <a href="${park.url}" class="link link-nps" target="_blank">nps website</a>`
    return linksHtml
}

async function handleCardWebcam(card) {
    const linksDiv = card.querySelector('.park-links')
    let webcamA
    if (!card.classList.contains('cam-checked')) {
        let parkCode = card.querySelector('.park-code').innerHTML
        let webcamData = await getWebcam(parkCode)
        if (webcamData.data.length > 0) {
            let webcamIndex = getRanNum(webcamData.data.length)
            let webcamUrl = webcamData.data[webcamIndex].url
            webcamA = document.createElement('a')
            webcamA.setAttribute("href", `${webcamUrl}`)
            webcamA.setAttribute("class", "link link-webcam")
            webcamA.setAttribute("target", "_blank")
            webcamA.innerHTML = 'webcam'
            linksDiv.append(webcamA)
        }
        card.classList.add('cam-checked')
    }
}

async function handleCardAlert(card) {
    const alertDiv = card.querySelector('.park-alert')
    if (!card.classList.contains('alerted')) {
        let parkCode = card.querySelector('.park-code').innerHTML
        let alertData = await getAlert(parkCode)
        if (alertData.data.length === 0) {
            alertHtml = `
            <p class="alert-latest">latest</p>
            <p class="alert-message">no current announcements</p>`
        } else {
            let alertTitle = alertData.data[0].title
            let alertUrl = alertData.data[0].url
            alertHtml = `
            <p class="alert-latest">latest</p>
            <a href="${alertUrl}" class="alert-message" target="_blank">${alertTitle}</a>`
        }
        card.classList.add('alerted')
    }
    alertDiv.innerHTML = alertHtml
}

function handleDirectoryLoader() {
    directoryWrapper.style.minHeight = "100vh"
    directoryWrapper.innerHTML = '<div>LOADING</div>'
    scrollToDirectory()
}

function handleFormScroll() {
    window.addEventListener('scroll', () => {
        const scrollTarget = landingWrapper.scrollHeight * (3/5)
        if (scrollTarget < window.scrollY) {
            stateForm.classList.add('state-form-mini')
        } else {
            stateForm.classList.remove('state-form-mini')
        }
    })
}


// =========== RENDER ===========

function renderDirectoryHeader(state, total) {
    let directoryHeaderHtml = `
    <div class="directory-header">
        <h3>${state}</h3>
        <p>${total} parks</p>
        <p>NPS Directory</p>
    </div>`
    return directoryHeaderHtml
}

function renderParkCard(park) {
    let parkCardHtml = `
    <div class="park-card">
        <h4 class="park-name">${park.fullName}</h4>
        <p class="park-lat">${park.latitude}</p>
        <p class="park-long">${park.longitude}</p>
        <div class="card-front">
            <p class="park-code">${park.parkCode}</p>
            ${handleCardTopics(park.topics)}
        </div>
        <div class="card-back hidden">
            <div class="card-switch">X</div>
            ${handleCardContact(park.contacts)}
            ${handleCardAddress(park.addresses)}
            <div class="park-alert">
                <p class="alert-latest">latest</p>
                <p class="alert-message">loading</p>
            </div>
            <div class="park-links">
                ${handleCardLinks(park)}
            </div>
            ${handleCardHours(park.operatingHours)}
            <p class="park-para">${park.description}</p>
        </div>
    </div>`
    return parkCardHtml
}

function renderDirectory(state, parksData) {
    // reset
    directoryWrapper.innerHTML = ''
    // header
    let parkTotal = parksData.total
    let directoryHeaderHtml = renderDirectoryHeader(state, parkTotal)
    // list
    let parkListHtml = ''
    for (let park of parksData.data) {
        let parkCardHtml = renderParkCard(park)
        parkListHtml += parkCardHtml
    }
    // render to dom
    let directoryHtml = `
        ${directoryHeaderHtml}
        <div class="directory-list">
            ${parkListHtml}
        </div>`
    directoryWrapper.innerHTML = directoryHtml
    watchParkCard()
}

function renderPageLoader() {
    let quoteData = getQuote()
    let pageLoaderHtml = `
        <p class="loader-content loader-quote">${quoteData.quote}</p>
        <p class="loader-content loader-author">-${quoteData.author}</p>
        <p class="loader-content loader-title">${quoteData.title}</p>`
    pageLoaderDiv.innerHTML = pageLoaderHtml
    setTimeout(() => {
        pageLoaderDiv.classList.remove('active')
        pageLoaderDiv.innerHTML = ''
    }, 1000);
}


// =========== GET / FETCH ===========
const npsApiUrl = `https://frozen-castle-15409.herokuapp.com/parks`

async function getAlert(parkCode) {
    try {
        const alertPromise = await fetch(`${npsApiUrl}/alerts?parkCode=${parkCode}`)
        const alertData = await alertPromise.json()
        return alertData
    } catch (err) {
        alert("Could not connect to directory. Try again later.")
        console.error(err)
    }
}

async function getWebcam(parkCode) {
    try{
        const webcamPromise = await fetch(`${npsApiUrl}/webcams?parkCode=${parkCode}`)
        const webcamData = await webcamPromise.json()
        return webcamData
    } catch (err) {
        alert("Could not connect to directory. Try again later.")
        console.error(err)
    }
}

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

function getQuote() {
    let quoteIndex = getRanNum(quotes.length)
    let quoteData = {
        quote: quotes[quoteIndex].quote,
        author: quotes[quoteIndex].author,
        title: quotes[quoteIndex].title
    }
    return quoteData
}


// =========== WATCH ===========

function watchParkCard() {
    let parkCardArray = document.querySelectorAll('.park-card')
    for (let card of parkCardArray) {
        card.querySelector('.card-front').addEventListener('click', () => {
            toggleCard(card)
            handleCardAlert(card)
            handleCardWebcam(card)
        })
        card.querySelector('.card-switch').addEventListener('click', () => {
            toggleCard(card)
        })
    }
}

function watchForm() {
    handleFormScroll()
    // submit state
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        let stateSearch = stateDropdown.value
        // check state is selected
        if (stateSearch === 'none-selected') {
            stateDropdown.classList.add('state-dropdown-error')
        } else {
            handleDirectoryLoader()
            getParks(stateSearch)
        }
    })
    // remove error check
    stateDropdown.addEventListener('click', () => {
        stateDropdown.classList.remove('state-dropdown-error')
    })
}


// =========== ON LOAD ===========

renderPageLoader()
watchForm()