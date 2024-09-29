    
// Function to toggle the profile menu visibility
function toggleMenu() {
    const profileMenu = document.getElementById('profile-menu');
    if (profileMenu.style.display === 'block') {
        profileMenu.style.display = 'none';
    } else {
        profileMenu.style.display = 'block';
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    const profileMenu = document.getElementById('profile-menu');
    const profileImg = document.getElementById('profile-img');
    
    if (!profileImg.contains(event.target)) {
        profileMenu.style.display = 'none';
    }
}


function openTab(event, contentId){
    //gets all tab titles and remove the "active " class
    var tabTitles =document.getElementsByClassName('tab-title');
    for( var i=0 ;i<tabTitles.length; i++){
        tabTitles[i].classList.remove('active')
    }

    //Get all tab content sections and hide them
    var tabContents= document.getElementsByClassName('tab-content');
    for (var i=0; i<tabContents.length; i++){
        tabContents[i].classList.remove('active');
    }

    //show the clicked tab and the corresponding content
    event.currentTarget.classList.add('active');
    document.getElementById(contentId).classList.add('active');
}

//scrolling left
function scrollContentLeft(){
    const scrollableContent = document.getElementById('tab-head');
    scrollableContent.scrollBy({
        left: -150,
        behavior: "smooth"
    });
}

//scrolling right
function scrollContentRight(){
    const scrollableContent = document.getElementById('tab-head');
    scrollableContent.scrollBy({
        left: 150,
        behavior: "smooth"
    });
}

//calender
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysInWeek = 7;

let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let currentDay = today.getDate();  // Store today's date

// Function to generate the calendar
function generateCalendar(month, year) {
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = ''; // Clear previous cells
    
    const firstDay = new Date(year, month, 1).getDay(); // First day of the month
    const daysInMonth = 32 - new Date(year, month, 32).getDate(); // Days in the month

    document.getElementById('monthYear').innerHTML = monthNames[month] + ' ' + year;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < daysInWeek; j++) {
            const cell = document.createElement('td');

            if (i === 0 && j < firstDay) {
                cell.appendChild(document.createTextNode(''));
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.appendChild(document.createTextNode(date));

                // Highlight the current date if it's today
                if (date === currentDay && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add('current-date');
                }

                date++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }
}

// Functions to navigate between months
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

// Function to automatically update the calendar every day at midnight
function checkDate() {
    const now = new Date();
    if (now.getDate() !== today.getDate()) {
        today = now;  // Update today's date
        currentDay = today.getDate();  // Update the current day
        currentMonth = today.getMonth();  // Update the current month
        currentYear = today.getFullYear();  // Update the current year
        generateCalendar(currentMonth, currentYear);  // Regenerate the calendar
    }
}

// Set interval to check if the day has changed every minute
setInterval(checkDate, 60000);


generateCalendar(currentMonth, currentYear);

//show the modal on page load if data is not set
window.onload= function(){
    if (window.location.pathname === '/dashboard/'){

        fetch('/get_dashboard_data/')
        .then(response =>{
            if(!response.ok){
                throw new Error(`Http Error! Status: ${response.status}`)
            }else{
                return response.json();  
            }
        })
        .then(data =>{
            if(data.error){
                console.log(data.error) 
            } else{
                if (!data.has_data){
                    // If no dashboard data,populate basic information show the modal
                    document.getElementById('initialFormModal').style.display='flex';
                }else {
                    document.getElementById('name').textContent =data.fname +" " + data.lname ;
                    document.getElementById('country-display').textContent=data.country || 'N/A';
                    document.getElementById('town-display').textContent =data.town || 'N/A';
                    document.getElementById('dob-display').textContent =data.dob || 'N/A';
                    document.getElementById('age-display').textContent = calculateAge(new Date(data.dob))  || 'N/A';
                    document.getElementById('gender-display').textContent = data.gender || 'N/A';
                    document.getElementById('phoneNumber-display').textContent = data.phone_number || 'N/A';
                    document.getElementById('email-display').textContent = data.email || 'N/A';
                    document.getElementById('linkedIn-display').textContent=data.linkedin || 'N/A';
                    document.getElementById('instagram-display').textContent=data.instagram || 'N/A';
                    document.getElementById('x-display').textContent=data.x || 'N/A';
                    document.getElementById('tiktok-display').textContent=data.tiktok || 'N/A';
                    document.getElementById('facebook-display').textContent =data.facebook || 'N/A';
                    document.getElementById('total-area-display').textContent= data.cultivated_land || 'N/A';
                    document.getElementById('crop-status-display').textContent= data.crops_grown || 'N/A';
                    document.getElementById('livestock-status-display').textContent=data.livestock_reared || 'N/A';
                    document.getElementById('labour-type-display').textContent=data.labour_type +" " +"Labour" || 'N/A';
                    document.getElementById('labour-number-display').textContent = data.total_workers +" "+ "Workers" || 'N/A';
                    document.getElementById('recent-activities-display').textContent=data.recent_activities || 'N/A';
                    sessionStorage.setItem('Town', data.town);
                }
            }
        })
        .catch(error =>{
            console.log('Error Fetching data:', error)
        })

}
}
//calculate age
function calculateAge(dob){
    const today= new Date();
    let age= today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() -dob.getMonth();

      // If the current month is before the birth month, or it's the birth month but the day hasn't passed yet, subtract a year.
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())){
        age--;
      }
      return age;
}


//Iframe for the crop calendar
const showIframeBtn = document.getElementById('show-iframe-btn');
const iframeOverlay =document.getElementById('iframeOverlay');
const closeIframeBtn =document.getElementById('closeIframeBtn')

//show overlay when button isclicked
showIframeBtn.onclick =function(){
    iframeOverlay.style.display='flex';
}
//hide overlay when button is clicked
closeIframeBtn.onclick =function(){
    iframeOverlay.style.display ='none'
}

//toggling between display and edit modes (for later individual edits)
// function toggleEdit(section){
//     const displayDiv= document.getElementById(`${section}-display`);
//     const editDiv =document.getElementById(`${section}-edit`);

//     if(editDiv.style.display=== 'none'){
//         displayDiv.style.display= 'none';
//         editDiv.style.display ='block';
//     }else{
//         displayDiv.style.display = 'block';
//         editDiv.style.display= 'none';
//     }
// }


window.onload =function(){
    if (window.location.pathname === '/planning/'){
        //Weather integration functionality
        const weatherForecastDiv = document.getElementById('weather-forecast');
        const apiKey = 'ec670e0dfa9ebab894255bf3edcc450c'; 
        fetchWeatherData()
        
        function fetchWeatherData() {
            const town = sessionStorage.getItem('Town')
            if (!town) {
                weatherForecastDiv.innerHTML = "Please enter a valid town name.";
                return;
            }

            // API URL for current weather data
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${town}&appid=${apiKey}&units=metric`;

            // API URL for 5-day forecast
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${town}&appid=${apiKey}&units=metric`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.cod === 200) {
                        displayWeatherData(data);
                    } else {
                        weatherForecastDiv.textContent = 'Error loading weather data: ' + data.message;
                    }
                })
                .catch(error => {
                    weatherForecastDiv.textContent = 'Error loading weather data...';
                    console.error('Error fetching weather data:', error);
                });

            // Fetch 5-day forecast
            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('5-Day Forecast:', data);
                    if (data.cod === '200') {
                        displayRainfallForecast(data);
                    } else {
                        document.getElementById("5-rainfall-forecast").textContent = 'Error loading forecast data: ' + data.message;
                    }
                })
                .catch(error => {
                    weatherForecastDiv.textContent = 'Error loading forecast data...';
                    console.error('Error fetching forecast data:', error);
                });
        }

        function displayWeatherData(data) {
            const temperature = data.main.temp;
            const weatherDescription = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const minTemp = data.main.temp_min;
            const maxTemp = data.main.temp_max;
            const feelsLike = data.main.feels_like;
            const pressure = data.main.pressure;
            const rainfall = data.main.rainfall;

            document.getElementById("weather-forecast-header").textContent=data.name +' '+ data.sys.country;
            const weatherInfo = `
                
                <div><p><strong>Temperature:</strong> ${temperature}°C</p></div>
                <div><p><strong>Feels Like:</strong> ${feelsLike}°C</p></div>
                <div><p><strong>Rainfall:</strong> ${rainfall}%</p></div>
                <div><p><strong>Min Temperature:</strong> ${minTemp}°C</p></div>
                <div><p><strong>Max Temperature:</strong> ${maxTemp}°C</p></div>
                <div><p><strong>Description:</strong> ${weatherDescription}</p></div>
                <div><p><strong>Humidity:</strong> ${humidity}%</p></div>
                <div><p><strong>Wind Speed:</strong> ${windSpeed} m/s</p></div>
                <div> <p><strong>Pressure:</strong> ${pressure} hPa</p></div>
            `;

            weatherForecastDiv.innerHTML = weatherInfo;
        }

        function displayRainfallForecast(data) {
            document.getElementById("rainfall-forecast-header").innerHTML= `<h3>5-Day Rainfall Forecast</h3>`;
            const forecastList = data.list;
            let rainfallForecast;
        
            // Loop through forecast data (3-hour intervals)
            forecastList.forEach(forecast => {
                const date = new Date(forecast.dt * 1000).toLocaleString();
                const rain = forecast.rain ? forecast.rain['3h'] : 0;  // Rainfall in mm over 3 hours
        
                // If there's any rain in the forecast, display it
                if (rain > 0) {
                    rainfallForecast += `
                        <div>   
                            <p> ${date}</p>
                            <p><strong>Rainfall:</strong> ${rain} mm </p><br>
                        </div>`;
                }
            });
        
            // Add the rainfall forecast to the main div
            document.getElementById('5-rainfall-forecast').innerHTML = rainfallForecast;
        }

    }
}


function viewTab(event, sectionId) {
    // Get all toggle titles and remove the active class
    var toggleTitles = document.getElementsByClassName('toggle-title');
    for (var i = 0; i < toggleTitles.length; i++) {
        toggleTitles[i].classList.remove('active');
    }

    // Add the active class to the clicked toggle
    event.currentTarget.classList.add('active');

    // Hide all sections with class 'toggle-content'
    var contentSections = document.getElementsByClassName('toggle-content');
    for (var i = 0; i < contentSections.length; i++) {
        contentSections[i].classList.remove('active');
    }

    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
}

//get csrf token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//function to suggest fertilizer basedon crop selection and soil type
function suggestFertilizer(){
    const csrftoken = getCookie('csrftoken');
    const crop= document.getElementById('crop').value;
    const soilType= document.getElementById('soil-type').value;
    suggestion='';
    const data = JSON.stringify({
        'crop_name': crop,
        'soil_type': soilType
    });

    fetch('/fertilizer-suggestion/',{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:data
    })
    .then(response=> response.json())
    .then(data =>{
        if (data.error){
            console.log("Error ", data.error)
        }else{
            const resultDiv =document.getElementById('fertilizer-result');
            resultDiv.style.display='block';
            resultDiv.innerHTML=`<p>${data.suggestion}</p>`
        }
    })

}

//function to track pH level and give recommendation
function trackpH(){
    const phLevel =parseFloat(document.getElementById('ph-level').value);
    let recommendation =''

    if(phLevel <6.0){
        recommendation = 'Your soil is too acidic. Apply lime to raise the pH level.';
    }else if (phLevel >7.5){
        recommendation = 'Your soil is too alkaline. Use sulfur or organic compost to lower the pH.';
    } else {
        recommendation = 'Your soil pH is optimal for most crops.';

    }

    const phResultDiv=document.getElementById('ph-result');
    phResultDiv.style.display='block';
    phResultDiv.innerHTML=`${recommendation}`
}


function getCropWarnings() {
    try {
        const cropSelect = document.getElementById('crop-select');
        const selectedCrop = cropSelect.value;

        fetch("/static/js/pests_diseases.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                const datas = [];

                rows.forEach(function(row) {
                    const columns = row.split(',');
                    datas.push(columns);
                });

                const resultDiv = document.getElementById('crop-warnings-result');
                resultDiv.style.display = "block";
                resultDiv.innerHTML = '';

                datas.forEach(function(row) {
                    console.log('Row 0:', row[0].trim());
                    if (row[0].trim() === selectedCrop) {
                        resultDiv.innerHTML=`
                        <h3>${row[1]} , ${row[2]} </h3>
                        <p>${row.slice(3).join(', ')}</p>`
                    }
                });
            })
            .catch(error => console.error('Error loading CSV file:', error));
    } catch (error) {
        console.error('Error:', error);
    }
}


// Function to get treatment options for selected pests/diseases
function getTreatmentOptions() {
    try {
        const pest = document.getElementById('pest-select').value;
        console.log('Selected pest:', pest);

        fetch("/static/js/crop_pests_treatments.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                const datas = [];

                rows.forEach(function(row) {
                    const columns = row.split(',');
                    datas.push(columns);
                });

                const resultsDiv = document.getElementById('treatment-result');
                resultsDiv.style.display = "block";
                resultsDiv.innerHTML = '';

                datas.forEach(function(row) {
                    console.log('Row 0:', row[0].trim());
                    if (row[0].trim() === pest) {
                        console.log('Row:', row);
                        console.log('Result Div:', resultsDiv);
                        resultsDiv.innerHTML=`
                            <h3>Organic Treatment:</h3>
                            <p>${row[1]} ,${row[2]}</p>
                            <h3>Chemical Treatment</h3>
                            <p>${row.slice(3).join(', ')}</p>
                        `;

                    }
                });
            })
            .catch(error => console.error('Error loading CSV file:', error));
    } catch (error) {
        console.error('Error:', error);
    }

}

// Function to track animal health
function trackHealth() {
    const animalId = document.getElementById('animal-id').value;
    const vaccinationDate = document.getElementById('vaccination-date').value;
    const illnessHistory = document.getElementById('illness-history').value;
    const treatmentHistory = document.getElementById('treatment-history').value;

    const healthResult = `Animal ID: ${animalId}
    \nVaccination Date: ${vaccinationDate}
    \nIllness History: ${illnessHistory}
    \nTreatment History: ${treatmentHistory}`;

    const resultDiv = document.getElementById('health-result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = healthResult;
}

// Function to track feeding schedule
function trackFeeding() {
    const animal = document.getElementById('animal-select').value;
    const feedAmount = document.getElementById('feed-amount').value;
    const feedTime = document.getElementById('feed-time').value;

    const feedingResult = `Animal: ${animal}
    \nFeed Amount: ${feedAmount} kg
    \nFeeding Time: ${feedTime}`;

    const resultDiv = document.getElementById('feeding-result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = feedingResult;
}

// Function to track breeding and reproduction
function trackBreeding() {
    const animalId = document.getElementById('animal-breeding-id').value;
    const lastBreedingDate = document.getElementById('last-breeding-date').value;
    const expectedOffspringDate = document.getElementById('expected-offspring-date').value;

    const breedingResult = `Animal ID: ${animalId}
    \nLast Breeding Date: ${lastBreedingDate}
    \nExpected Offspring Date: ${expectedOffspringDate}`;

    const resultDiv = document.getElementById('breeding-result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = breedingResult;
}

//button to collapse and uncollapse table
function showTable(element_dentity){
    const content = document.getElementById(element_dentity);
    if (content.style.display === 'block') {
        content.style.display = 'none';
    } else {
        content.style.display = 'block';
    }
}

function expenseDataSubmit(event){
    event.preventDefault(); 

    const expenseType= document.getElementById('expense-type').value;
    const amount =  document.getElementById('expense-amount').value;
    const date =document.getElementById('expense-date').value;
    const csrftoken = getCookie('csrftoken');
    const data=  JSON.stringify({
        'expense_type': expenseType,
        'amount' :amount,
        'date': date
    })

    fetch('/financial/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: data,
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Append the new expense to the table
            const table = document.getElementById('expense-table'); 
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${data.data.expense_type}</td>
                <td>${data.data.amount}</td>
                <td>${data.data.date}</td>
            `;
            table.querySelector('tbody').appendChild(newRow); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('expense-form').reset();
}

function salesDataSubmit(event){
    event.preventDefault()
    
    const product= document.getElementById('product').value;
    const quantity =  document.getElementById('quantity').value;
    const unit =document.getElementById('unit').value;
    const price =document.getElementById('price').value;
    const date =document.getElementById('income-date').value;
    const buyer = document.getElementById('buyer').value
    const csrftoken = getCookie('csrftoken');

    const data=  JSON.stringify({
        'product': product,
        'quantity' :quantity,
        'unit': unit,
        'price' : price,
        'date' :date,
        'buyer' :buyer
    })

    fetch('/financial/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: data,
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Append the new expense to the table
            const table = document.getElementById('sales-table'); 
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${data.data.product}</td>
                <td>${data.data.quantity}</td>
                <td>${data.data.price}</td>
                <td>${data.data.date}</td>
                <td>${data.data.buyer}</td>
            `;
            table.querySelector('tbody').appendChild(newRow);  
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('sales-form').reset();
}

function budgetDataSubmit(event){
    event.preventDefault()
    
    const budgetCategory= document.getElementById('budget-category').value;
    const budgetAmount =  document.getElementById('budget-amount').value;
    const budgetDescription =document.getElementById('budget-description').value;

    const csrftoken = getCookie('csrftoken');

    const data=  JSON.stringify({
        'category': budgetCategory,
        'amount' :budgetAmount,
        'description': budgetDescription
    })

    fetch('/financial/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: data,
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Append the new expense to the table
            const table = document.getElementById('budget-table'); 
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${data.data.category}</td>
                <td>${data.data.amount}</td>
                <td>${data.data.description}</td>
            `;
            table.querySelector('tbody').appendChild(newRow); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('budget-form').reset();

}

function submitHealthData(event){
    event.preventDefault(); 

    const animalId= document.getElementById('animal-id').value;
    const vaccination =  document.getElementById('vaccination-date').value;
    const illness =document.getElementById('illness-history').value;
    const treatment = document.getElementById('treatment-history').value;

    const csrftoken = getCookie('csrftoken');
    const data=  JSON.stringify({
        'animal_id': animalId,
        'vaccination' :vaccination,
        'illness': illness,
        'treatment' : treatment
    })

    fetch('/livestock/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: data,
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Append the new expense to the table
            const table = document.getElementById('health-table');  
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${data.data.animal_id}</td>
                <td>${data.data.vaccination}</td>
                <td>${data.data.illness}</td>
                <td>${data.data.treatment}</td>
            `;
            table.querySelector('tbody').appendChild(newRow);  
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('health-form').reset();
}

function submitFeedingData(event){
    event.preventDefault(); 

    const animalCategory= document.getElementById('animal-select').value;
    const feedAmount =  document.getElementById('feed-amount').value;
    const feedTime =document.getElementById('feed-time').value;

    const csrftoken = getCookie('csrftoken');
    const data=  JSON.stringify({
        'animal_category': animalCategory,
        'feed_amount' :feedAmount,
        'feed_time': feedTime,
    })

    fetch('/livestock/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: data,
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Append the new expense to the table
            const table = document.getElementById('feeding-table'); 
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${data.data.animal_category}</td>
                <td>${data.data.feed_amount}</td>
                <td>${data.data.feed_time}</td>
            `;
            table.querySelector('tbody').appendChild(newRow);  
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('feeding-form').reset();
}

function submitBreedingData(event){
    event.preventDefault(); 

    const animalId= document.getElementById('animal-breeding-id').value;
    const last_breeding =  document.getElementById('last-breeding-date').value;
    const expected_date =document.getElementById('expected-offspring-date').value;

    const csrftoken = getCookie('csrftoken');
    const data=  JSON.stringify({
        'animals_id': animalId,
        'last_breeding' :last_breeding,
        'next_breeding': expected_date,
    })

    fetch('/livestock/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: data,
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Append the new expense to the table
            const table = document.getElementById('breeding-table'); 
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${data.data.animal_id}</td>
                <td>${data.data.last_breeding}</td>
                <td>${data.data.next_breeding}</td>
            `;
            table.querySelector('tbody').appendChild(newRow);  
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('breeding-form').reset();
}

// Function to calculate profit/loss
// function calculateProfitLoss() {
//     const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
//     const totalIncome = income.reduce((total, inc) => total + inc.amount, 0);
//     const profitOrLoss = totalIncome - totalExpenses;

//     const resultDiv = document.getElementById('profit-loss-result');
//     resultDiv.style.display = 'block';
//     resultDiv.innerHTML = `<p>Total Income: $${totalIncome}</p><p>Total Expenses: Ksh${totalExpenses}</p><p>Profit/Loss: Ksh${profitOrLoss}</p>`;
// }

// Carbon Footprint Calculator Handler
function footprintCalc(event){
    event.preventDefault();

    const fuelUsed = parseFloat(document.getElementById('fuel-used').value);
    const electricityUsed = parseFloat(document.getElementById('electricity-used').value);
    const fertilizerUsed = parseFloat(document.getElementById('fertilizer-used').value);

    // Calculate carbon footprint (example factors: fuel=2.6 kg CO2/liter, electricity=0.5 kg CO2/kWh, fertilizer=1.3 kg CO2/kg)
    const carbonFootprint = (fuelUsed * 2.6) + (electricityUsed * 0.5) + (fertilizerUsed * 1.3);
    

    const resultDiv = document.getElementById('footprint-result');
    resultDiv.innerHTML = `<h3>Total Carbon Footprint:</h3>
                           <p><strong>${carbonFootprint.toFixed(2)} kg CO2</strong></p>`;
}

// Sustainable Practice Tracking Handler
function  sustainableTrack(event){
    event.preventDefault(); 
    
    const practice =  document.getElementById('practice').value;
    const area= document.getElementById('area').value;
    const unit =document.getElementById('metrics').value;
    const description =document.getElementById('description').value;

    const csrftoken = getCookie('csrftoken');

    const data=  JSON.stringify({
        'practice': practice,
        'area' : area,
        'unit' :unit,
        'description': description
    })

    fetch('/sustainability/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: data,
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Append the new expense to the table
            const table = document.getElementById('sustainable-table'); 
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${data.data.practice}</td>
                <td>${data.data.area}</td>
                <td>${data.data.description}</td>
            `;
            table.querySelector('tbody').appendChild(newRow); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('tracking-form').reset();
}

// Function to predict crop yield
function predictCropYield(event){
    event.preventDefault(); 

    document.getElementById("loading").style.display = "flex";
    const resultDiv = document.getElementById('prediction-result');
    resultDiv.innerHTML = ""

    const cropType= document.getElementById('crop-type').value;
    const soilType =  document.getElementById('soil-type').value;
    const rainfall =document.getElementById('rainfall').value;
    const temperature =  document.getElementById('temperature').value;
    const fertilizer =document.getElementById('fertilizer').value;
    const area= document.getElementById('area-size').value;

    const csrftoken = getCookie('csrftoken');
    const data=  JSON.stringify({
        'crop_type': cropType,
        'soil_type' :soilType,
        'rainfall': rainfall,
        'temperature': temperature,
        'fertilizer': fertilizer,
        'area' :area
    })

    fetch('/prediction/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: data,
    }) 
    .then(response => response.json())
    .then(data => {
        document.getElementById("loading").style.display = "none";
        if (data.status === 'success') {
            resultDiv.style.display='block';
            resultDiv.innerHTML = `<h3>Crop Yield Prediction:</h3>
                                   <p><strong>${data.data.yield} Tonnes/ha</strong></p>`;
        }else{
            resultDiv.style.display='block';
            resultDiv.innerHTML =`<h3>Error!</h3>
                                <p>${data.message}</p>`
        }
    })
    .catch(error => {
        document.getElementById("loading").style.display = "none";
        resultDiv.style.display='block';
        resultDiv.innerHTML=`<h3>Internal Server error</h3>
                            <p>Please Try Again</p>`
        console.error('Error:', error);
    });

    document.getElementById('yield-prediction-form').reset();
}

