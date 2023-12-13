const apiUrl = "https://api.punkapi.com/v2/beers"

let allBeers = [];
async function fetchBeers(){
    try {
        const response = await fetch(apiUrl);
        allBeers = await response.json();
        displayBeers(allBeers);
    } catch (error) {
        console.error('Failed to fetch beers:', error);
    }
    document.getElementById('goBack').style.display = 'none'; 
}

function displayBeers(beers){
    const beerList = document.getElementById('beerList');
    beerList.innerHTML = '';
    beers.forEach(beer =>{
        const beerItem = document.createElement('div');
        beerItem.innerHTML = `
            <h3>${beer.name}</h3>
            <h5>${beer.tagline}</h5>
            <p>${beer.description}</p>
        `;
        const addToFavoritesButton = document.createElement('button');
        addToFavoritesButton.textContent = 'Add to Favorites';
        addToFavoritesButton.onclick = () => addToFavorites(beer);
        beerItem.appendChild(addToFavoritesButton);
        beerList.append(beerItem);
    });
}

function searchBeers(){
    const searchQuery = document.getElementById('searchBox').value;
    const searchResults = allBeers.filter(beer => beer.name.toLowerCase().includes(searchQuery.toLowerCase()));
    displayBeers(searchResults);

    document.getElementById('goBack').style.display = 'block';
}

function displayFavorites() {
    const favorites = getFavorites();
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = favorites.map(id => {
        const beer = allBeers.find(beer => beer.id === id);
        return beer ? `
            <div>
                <h3>${beer.name}</h3>
                <p>${beer.description}</p>
            </div>
        ` : '';
    }).join('');
}

function addToFavorites(beer) {
    const favorites = getFavorites();
    if (!favorites.includes(beer.id)) {
        favorites.push(beer.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

function clearFavorites() {
    localStorage.clear('favorites');
    displayFavorites();
    document.getElementById('clearFavorites').style.display = 'none'; 
}

function toggleFavoritesView() {
    const beerList = document.getElementById('beerList');
    const favoritesList = document.getElementById('favoritesList');
    const toggleViewButton = document.getElementById('toggleView');
    const clearButton = document.getElementById('clearFavorites');

    if (beerList.style.display === 'none') {
        beerList.style.display = 'block';
        favoritesList.style.display = 'none';
        toggleViewButton.style.backgroundColor = '#0275d8';
        toggleViewButton.textContent = 'Show Favorites';
        clearButton.style.display = 'none'; 
    } else {
        beerList.style.display = 'none';
        favoritesList.style.display = 'block';
        toggleViewButton.style.backgroundColor = '#FF4136'; 
        toggleViewButton.textContent = 'Show All Beers';
        clearButton.style.display = 'inline-block';
        displayFavorites(); 
    }
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function goBack() {
    displayBeers(allBeers);
    document.getElementById('goBack').style.display = 'none';
}

fetchBeers();
