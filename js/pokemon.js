let url = "https://pokeapi-enoki.netlify.app/pokeapi.json";

// Les ID des pokemons qui va me servir à remplacer ceux dans l'url des images de l'API qui ne correspond pas au pokémon.
// Je place les ID dans l'ordre des pokémons de l'API
const newIDPokemon = [152, 158, 133, 399, 147, 25, 77, 398, 383, 470, 873];

// Objets pour retenir l'ID donné par setInterval pour le clear par la suite
var intervalCard = null;
var intervalStopText = null;

// Objets des boutons pour pouvoir leur ajouter un event receiver et déclencher le start
var startButton = null;
var stopButton = null;

// On attend que la page soit complétement chargée sinon il peut y avoir des problèmes avec les extensions.
document.addEventListener("DOMContentLoaded", function () {
  startButton = document.querySelector(".go");
  startButton.addEventListener("click", clickStart);
  stopButton = document.querySelector(".stop");
  stopButton.addEventListener("click", clickStop);
});

// On retient les dernieres donnees recuperees par l'API pour pouvoir y acceder ulterieurement
var lastDataApi = null;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Chaque seconde qui passe on vient descendre le timer sur le bouton Stop
// NOTE: Cette fonction peut etre attaquée en modifiant le code source par l'inspecteur
function stopTimer() {
  if (stopButton.innerHTML == "Stop") {
    // On est au debut, initialisation du timer à 15 secondes
    stopButton.innerHTML = "15";
    return;
  }
  var currentNumber = parseInt(stopButton.innerHTML);
  stopButton.innerHTML = (currentNumber - 1).toString();

  if (currentNumber == 0) {

    
    clearInterval(intervalCard);
    intervalCard = null;

    clearInterval(intervalStopText);
    intervalStopText = null;
    stopButton.innerHTML = "Stop";
  }
}
function clickStop() {
  if (intervalStopText) {
    clearInterval(intervalStopText);
    intervalStopText = null;
    stopButton.innerHTML = "Stop";
  }
  if (intervalCard) {
    clearInterval(intervalCard);
    intervalCard = null;
  }
}

function clickStart() {
  if (!intervalCard) {
    // On définit l'intervalle en ms entre chaque changement de carte
    intervalCard = setInterval(displayMainCard, 1000);
  }

  if (!intervalStopText) {
    intervalStopText = setInterval(stopTimer, 1000);
  }
}
function displayMainCard() {
  // On recupere les dernieres donnees update par fetch
  var data = lastDataApi;

  // i va me permettre de randomiser un numéro de 1 à 11 avec sa function ligne 26
  var i = getRandomInt(11);

  // On change le background de la carte en fonction de son élément
  var viewPrincipal = (document.querySelector(
    ".cardPrincipal"
  ).style.backgroundColor = data.pokemons[i].background_color);

  // On recupere le noeud de la carte principale
  var viewPrincipal = document.querySelector(".viewPrincipal");
  // On vient remplir son div name par le nom du pokémon
  viewPrincipal.querySelector(".name").textContent = data.pokemons[i].name;

  // pareil ici j'ajoute l'icone de l'élément du pokemon dans la div avec sa class level
  var level = viewPrincipal.querySelector(".level");
  level.textContent =
    data.pokemons[i].level + data.pokemons[i].abilities[0].icon;

  // On vient remplacer l'attribut src de l'image par l'ID du bon lien de l'image pokemon en question
  // qui est le même random que l'id du pokemon dans l'API (mon tableau avec les id des pokemons sert à ce moment là)
  var imgAttribute = viewPrincipal.querySelector(".picturePokemon");
  imgAttribute.setAttribute(
    "src",
    data.pokemons[i].image.replace(1, newIDPokemon[i])
  );

  // debut de la boucle pour ajouter les sorts, d'abord on recupere le placeholder des sorts
  var sorts = document.querySelector(".sorts");
  // On le reinitialise pour ne pas que ca ajoute les sorts à chaque défilement et que ca créer un empilement.
  sorts.innerHTML = "";

  for (let j = 0; j < data.pokemons[i].abilities.length; j++) {
    console.log(data.pokemons[i].abilities[j]);

    // Mise en page de la fiche technique du pokemon (sort , élément etc)
    // On cree un nouveau div pour l'element du sort, qu'on viendra ajouter dans le placeholder sort
    // la même chose pour le reste
    var sort = document.createElement("div");
    sort.setAttribute("class", "global_sort");

    var sortElement = document.createElement("div");
    sortElement.setAttribute("class", "element");
    sortElement.innerHTML = data.pokemons[i].abilities[j].icon;
    sort.appendChild(sortElement);

    var sortName = document.createElement("div");
    sortName.setAttribute("class", "name");
    sortName.innerHTML = data.pokemons[i].abilities[j].name;
    sort.appendChild(sortName);

    var sortDamage = document.createElement("div");
    sortDamage.setAttribute("class", "damage");
    sortDamage.innerHTML = data.pokemons[i].abilities[j].power;
    sort.appendChild(sortDamage);

    var sortDesctiption = document.createElement("div");
    sortDesctiption.setAttribute("class", "description");
    sortDesctiption.innerHTML = data.pokemons[i].abilities[j].description;
    sort.appendChild(sortDesctiption);

    // on vient rajouter le sort dans la liste de sorts
    sorts.appendChild(sort);
  }
}

fetch(url).then((response) =>
  response.json().then((data) => {
    lastDataApi = data;
    displayMainCard();
  })
);
