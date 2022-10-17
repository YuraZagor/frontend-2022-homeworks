const url = 'https://randomuser.me/api/?results=50';
const cardsContainer = document.querySelector('.cards--container');
const inputsForm = document.querySelector('.form');
const inputValue = inputsForm.value;
let searchResult;
let sortedUsers;

let sortedData;
let genderFilteredData;
let forPrintData;

const fetchUsers = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      const { results } = await response.json();
      return results;		  
    }
  } catch (e) {
    console.error(e);
  }
};

async function friendsLoad(inputValue) {
  const loadedResults = await fetchUsers();
  searchByUserName(loadedResults);
  
  switch (inputValue) {
    case 'Reset':
    case 'ageUp':
    case 'ageDown':
    case 'az':
    case 'za':
      forPrintData = genderFilteredData ? [...genderFilteredData] : [...loadedResults];
      sortedData = sortUsers([...loadedResults], inputValue);
      forPrintData = sortUsers(forPrintData, inputValue);
      break;
    case 'male':
    case 'female':
    case 'all':
      genderFilteredData = filterByGender([...loadedResults], inputValue);
      forPrintData = filterByGender(sortedData ? sortedData : loadedResults, inputValue);
      break;
    default:
      forPrintData = loadedResults;
      break;
    }; 
    fillCardContainer(forPrintData)
    console.log(inputValue) 
    console.log(forPrintData) 
};  
friendsLoad()
  
inputsForm.onclick = function(event){
  let input = event.target.closest('input');
  if (!input) return;
  friendsLoad(input.value);
};

function fillCardContainer(data) {
  let userCard;
  cardsContainer.innerHTML = '';
  data.forEach(datapiece => {
    userCard = createCard(datapiece);
    cardsContainer.innerHTML += userCard;
  });
};

function createCard( {picture, name, dob, cell, location}) {
  const card = `
  <div class="user-card">
  <div class="user--img">
  <img class="user--image" src="${picture.large}" alt="" >
  </div>
  <div class="user-info">
  <h3 class="user-name">${name.first}</h3>
  <h3 class="user-name">${name.last}</h3>
  <p class="user-age">${dob.age} years old</p>
  <p class="user-phone"> ${cell}"</p> 
  <p class="user-country"> ${location.country} </p4> 
  <p class="user-city"> ${location.city} </p5> 
  </div>
  </div>
	`;
	return card;
};

function sortUsers(data, inputValue) {
  
  if (inputValue === 'ageUp' || inputValue === 'ageDown') {
    data.sort((a, b) => a.dob.age - b.dob.age);
    return inputValue === 'ageUp' ? data : data.reverse();
  }
  if (inputValue === 'az' || inputValue === 'za') {
    data.sort((a, b) => a.name.first.localeCompare(b.name.first));
    return inputValue === 'az' ? data : data.reverse();
  }
  return data;
};

function filterByGender(data, inputValue) {
  if (inputValue === 'female') {
    return data.filter((user) => user.gender === 'female');
  }
  if (inputValue === 'male') {
    return data.filter((user) => user.gender === 'male');
  }
  return data;
};

const searchInput = document.querySelector('#user--names');
const searchByUserName = (data) => {
  searchResult = [...data];
  searchInput.addEventListener('input', () => {
    searchResult = data.filter((user) => user.name.first.toLowerCase().includes(searchInput.value.toLowerCase()) || user.name.last.toLowerCase().includes(searchInput.value.toLowerCase()));
    if (searchResult.length === 0) {
      document.querySelector('.cards--container').innerHTML = `
        <h2 class="no-matches-title">No corresponding user, try some other variants ...</h2>
      `;
    } else {
      fillCardContainer(searchResult);
    }
  });
};

const resetUsers = (data) => {
  document.querySelector('.reset--button').addEventListener('click', (e) => {
    e.preventDefault();
    fillCardContainer(data);
    searchInput.value = '';
    document.getElementById('sex--any').checked = true;
    document.getElementById('empty').checked = true;
  });
};
