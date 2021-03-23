'use strict'

// =========== VARIABLES ===========
const landingWrapper = document.getElementById('js-landing-wrapper')
const stateForm = document.getElementById('js-state-form')
const stateDropdown = document.getElementById('js-state-select')
const submitBtn = document.getElementById('js-submit-btn')
const formMsg = document.getElementById('js-form-msg')
const directoryWrapper = document.getElementById('js-directory-wrapper')
const pageLoaderDiv = document.getElementById('js-page-loader')
const toTopBtn = document.getElementById('js-to-top-btn')
let alertHtml = ''
let webcamHtml = ''


// =========== TOOLS ===========

function setCardState() {
    const contactArray = document.querySelectorAll('.park-contact')
    const addressArray = document.querySelectorAll('.park-address')
    const alertArray = document.querySelectorAll('.park-alert')
    const linksArray = document.querySelectorAll('.park-links')
    const hoursArray = document.querySelectorAll('.park-hours')
    const paraArray = document.querySelectorAll('.park-para')
    const cardStateArray = [contactArray, addressArray, alertArray, linksArray, hoursArray, paraArray]
    cardStateArray.forEach( (array) => {
        for (let i of array) {
            i.classList.add('hidden')
        }
    })
}

function toggleCard(card) {

    const eleFront = [
        '.park-name',
        '.park-code',
        '.park-topics',
        // '.park-img',
    ]
    const eleBack = [
        '.park-name',
        '.park-contact',
        '.park-address',
        '.park-alert',
        '.park-links',
        '.park-hours',
        '.park-para',
    ]

    if (card.classList.contains('card-front')) {
        for (let ele of eleFront) {
            card.querySelector(ele).classList.add('card-fade-out')
            setTimeout(() => {
                card.querySelector(ele).classList.add('hidden')
                card.querySelector(ele).classList.remove('card-fade-out')
            }, 500)
        }
        for (let ele of eleBack) {
            setTimeout(() => {
                card.querySelector(ele).classList.add('card-fade-in')
                card.querySelector(ele).classList.remove('hidden')
                setTimeout(() => {
                    card.querySelector(ele).classList.remove('card-fade-in')
                }, 500)
            }, 500)
        }
        setTimeout(() => {
            card.classList.remove('card-front')
            card.classList.add('card-back')
        }, 500)

    } else if (card.classList.contains('card-back')) {
        for (let ele of eleFront) {
            setTimeout(() => {
                card.querySelector(ele).classList.add('card-fade-in')
                card.querySelector(ele).classList.remove('hidden')
                setTimeout(() => {
                    card.querySelector(ele).classList.remove('card-fade-in')
                }, 500)
            }, 500)
        }
        for (let ele of eleBack) {
            card.querySelector(ele).classList.add('card-fade-out')
            setTimeout(() => {
                card.querySelector(ele).classList.add('hidden')
                card.querySelector(ele).classList.remove('card-fade-out')
            }, 500)
        }
        setTimeout(() => {
            card.classList.remove('card-back')
            card.classList.add('card-front')
            card.querySelector('.park-name').classList.remove('hidden')
        }, 500)
    }
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


// =========== HANDLE ===========

function handleCardTopics(topics) {
    if (topics.length === 0) { // no topics exist
        let topicsHtml = `
            <div class="park-topics"></div>`
        return topicsHtml
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
    if(addresses.length > 0) {
        for (let address of addresses) {
            if (address.type === 'Physical') {
                let addressHtml = `
                    <div class="park-address">
                        <p>${address.city}</p>
                        <p>${address.line1}</p>
                        <p>${address.postalCode}, ${address.stateCode}</p>
                    </div>`
                return addressHtml
            } else {
                return ''
            }
        }
    } else {
        let addressHtml = `
            <div class="park-address"></div>`
        return addressHtml
    }
}

function handleCardContact(contact) {
    // email
    let email = ''
    let emailHtml = ''
    if (contact.emailAddresses.length > 0) {
        email = contact.emailAddresses[0].emailAddress
        if (email === '0@0') {
            emailHtml = ''
        } else {
            emailHtml = `
            <a href="mailto:${email}">${email}</a>`
        }
    } else {
        emailHtml = ''
    }
    // phoneNum
    let phoneNum
    for (let num of contact.phoneNumbers) {
        phoneNum = num.phoneNumber.replace(/\s+/g, '').split('') // remove spaces and create an array
        for (let i = 0; i < phoneNum.length; i++) {
            if (phoneNum[i] === '(' || phoneNum[i] === ')' || phoneNum[i] === '-' || phoneNum[i] === '.') {
                phoneNum.splice(i, 1)
            }
        }
        phoneNum = formatPhoneNum(phoneNum)
    }
    let phoneNumHtml = `<a href="tel:${phoneNum}">${phoneNum}</a>`
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
        hoursHtml = `
            <div class="park-hours">
                <p>no hours listed</p>
            </div>`
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
        <a href="${park.directionsUrl}" class="link link-dir" target="_blank"><p>directions</p></a>
        <a href="https://www.nps.gov/${park.parkCode}/planyourvisit/fees.htm" class="link link-fees" target="_blank"><p>${feesStr}</p></a>
        <a href="${park.url}" class="link link-nps" target="_blank"><p>nps website</p></a>`
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
            linksDiv.classList.add('park-links-cam')
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

function handleCardPara(park) {
    let descTrim = park.description.substring(0,310)
    let descHtml = `
        <p class="park-para">${descTrim}... <a href="${park.url}" target="_blank">read more</a></p>`
    return descHtml
}

function scrollToDirectory() {
    window.scroll({
        top: landingWrapper.scrollHeight,
        left: 0,
        behavior: "smooth"
    })
}

function handleScroll() {
    toTopBtn.addEventListener('click', () => {
        scrollToDirectory()
    })
    window.addEventListener("scroll", () => {
        // scroll to top
        const scrollToTopTarget = document.querySelector('.directory-list').scrollHeight
        if (scrollToTopTarget - 150 < window.scrollY) {
            toTopBtn.classList.add('show-to-top-btn')
        } else {
            toTopBtn.classList.remove('show-to-top-btn')
        }
        // mini form
        const scrollFormTarget = landingWrapper.scrollHeight
        if (scrollFormTarget - 25 < window.scrollY) {
            stateForm.classList.add('state-form-mini')
            if (scrollFormTarget < window.scrollY) {
                stateForm.classList.add('show-state-form-mini')
            } else {
                stateForm.classList.remove('show-state-form-mini')
            }
        } else {
            stateForm.classList.remove('state-form-mini')
        }
    })

}

function showGetParksLoad() {
    let loadHtml = `
    <p class="form-msg msg-load">Finding parks...</p>`
    formMsg.innerHTML = loadHtml
    formMsg.classList.remove('hidden')
    formMsg.classList.add('form-msg-fade-in')
    setTimeout(() => {
        formMsg.classList.remove('form-msg-fade-in')
    }, 500)
}

function hideGetParksLoad() {
    formMsg.classList.add('form-msg-fade-out')
    setTimeout(() => {
        formMsg.classList.add('hidden')
    }, 500)
}

function handleGetParksError() {
    let errorHtml = `
        <p class="form-msg msg-error">Could not connect to database, try again later!</p>`
    formMsg.innerHTML = errorHtml
    formMsg.classList.remove('hidden')
}

function handleCardImg(images) {
    if (images.length > 0) {
        const imgIndex = getRanNum(images.length)
        const imgUrl = images[imgIndex].url
        let imgHtml = `
            <div class="park-img" style="background-image:url('${imgUrl}')"></div>`
        return imgHtml
    } else {
        return ''
    }
}


// =========== RENDER ===========

function renderDirectoryHeader(state, total) {
    let directoryHeaderHtml = `
    <div id="js-directory-header" class="directory-header">
        <h3 class="directory-header-title">${state}</h3>
        <p class="directory-header-p">${total} parks</p>
        <p class="directory-header-p">NPS Directory</p>
    </div>`
    return directoryHeaderHtml
}

// ${handleCardImg(park.images)}
function renderParkCard(park) {
    let parkCardHtml = `
    <div class="park-card card-front">
        <h4 class="park-name">${park.fullName}</h4>
        <p class="park-lat">LAT: ${park.latitude}</p>
        <p class="park-long">LON: ${park.longitude}</p>
        <button type="button" class="card-switch"><div class="card-switch-icon">+</div></button>
        <p class="park-code">${park.parkCode}</p>
        ${handleCardTopics(park.topics)}
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
        ${handleCardPara(park)}
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
    setCardState()
    watchParkCard()
    handleScroll()
}

function renderPageLoader() {
    let quoteData = getQuote()
    let loaderHtml = `
        <div class="quote-wrapper">
            <p class="loader-content loader-quote">"${quoteData.quote}"</p>
            <p class="loader-content loader-author">-${quoteData.author}</p>
            <p class="loader-content loader-title">${quoteData.title}</p>
        </div>`
    pageLoaderDiv.innerHTML = loaderHtml
    setTimeout(() => {
        pageLoaderDiv.classList.add('hidden')
        pageLoaderDiv.innerHTML = ''
    }, 4750);
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
    showGetParksLoad()
    try {
        const parksPromise = await fetch(`${npsApiUrl}/parks?stateCode=${state}`)
        const parksJson = await parksPromise.json()
        if (parksJson.total === 0) {
            handleGetParksError()
        } else {
            await renderDirectory(state, parksJson)
            hideGetParksLoad()
            scrollToDirectory()
        }
    } catch (err) {
        handleGetParksError()
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
        card.querySelector('.card-switch').addEventListener('click', () => {
            handleCardAlert(card)
            handleCardWebcam(card)
            toggleCard(card)
            card.querySelector('.card-switch-icon').classList.toggle('card-switch-icon-rotate')
        })
    }
}

function watchForm() {
    // reset state dropdown error
    stateDropdown.addEventListener('click', () => {
        stateDropdown.classList.remove('state-dropdown-error')
        formMsg.classList.add('hidden')
    })
    // submit state
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        let stateSearch = stateDropdown.value
        // check state dropdown error
        if (stateSearch === 'none-selected') {
            stateDropdown.classList.add('state-dropdown-error')
        } else {
            getParks(stateSearch)
        }
    })
}


// =========== ON LOAD ===========

renderPageLoader()
watchForm()