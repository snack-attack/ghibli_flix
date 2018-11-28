((d) => {
//init vars + create container div where cards will appear
let app = d.getElementById('root');
let container = d.createElement('div');
let logo = d.createElement('img');
let instructions = d.createElement('div');
let button = d.createElement('button');

//add the ghibli studio logo 
logo.src = 'logo.png';
container.setAttribute('class', 'container');

//style the button
button.classList.add('button');
button.textContent = 'Compare';

instructions.classList.add('instructions');
instructions.textContent = 'Wondering which film to watch tonight? Select the films that interest you, then compare them by Rotten Tomatoes rating to determine which one is best!';

//add logo + compare button + container div to the page
app.appendChild(logo);
app.appendChild(instructions);
app.appendChild(button);
app.appendChild(container);


//array where scores will be stored for comparison
let selectedFilms = [];

//display the higher Rotten Tomatoes score of the two selected cards
let displayWinner = (selectedFilms) => {
    //reduce selectedFilms to the object with the highest rating
    let highestScore = Math.max.apply(Math,selectedFilms.map((film) => {return film.rating}));

    let winner = selectedFilms.map((film) => {
        if(film.rating === highestScore) {
            return film.title;
        }
    });

    //alert the film with the highest Rotten Tomatoes score
    alert(`${winner} wins with a Rotten Tomatoes Score of ${highestScore}. Refresh the page to play again.`); 
}


//push the Rotten Tomatoes score (rt_score) and title to an object for later comparison
let selectFilmToCompare = (m) => {
    //add score + film title of selected cards to scores object 
    selectedFilms.push({title: m.title, rating: +m.rt_score}); 

    //return the selected scores for comparison
    return selectedFilms;
}

button.addEventListener('click', () => {
    displayWinner(selectedFilms);  
});

//create a display card for each film & click event
let createCard = movie => {
    let card = d.createElement('div');
    card.classList.add('card');

    let h1 = d.createElement('h1');
    h1.textContent = movie.title;

    let p = d.createElement('p');
    movie.description = movie.description.substring(0, 300);
    p.textContent = `${movie.description}...`;

    //append the cards to the 'container' div for displaying
    container.appendChild(card);
    card.appendChild(h1);
    card.appendChild(p);

    card.addEventListener('click', () => {
        selectFilmToCompare(movie);  
    }) 
}

fetch('https://ghibliapi.herokuapp.com/films')
    .then(
        response => {
            //check the response is in 200 range or log status if not
            if(response.status !== 200) {
                console.log('Looks like there was a problem fetching the resource. Status Code: ' + 
                    response.status);
                return;
            }

            //return promise from the API that resolves the JSON response to a JS object
            response.json().then( data => {
                //take response data and map createCard() over each object
                data.map(movie => createCard(movie))
            });
        } 
    )
    //catch any errors and log them to the console
    .catch( err => {
        console.log('Fetch error :-S', err);
    });

})(document);