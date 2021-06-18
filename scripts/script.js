const pokemonTopName = document.querySelector('#pokemon_top_stats .name')
const pokemonBottomName = document.querySelector('#pokemon_bottom_stats .name')
const pokemonTopImage = document.getElementById('pokemon_top')
const pokemonBottomImage = document.getElementById('pokemon_bottom')
const pokemonMovesContainer = document.getElementById('pokemon_moves')
const pokemonTopHPelement = document.querySelector('#pokemon_top_stats .hp span')
const pokemonBottomHPelement = document.querySelector('#pokemon_bottom_stats .hp span')
const textMessage = document.querySelector('.options_information')
const maxPokemonLength = 879
let pokemonTopHP = 100;
let pokemonBottomHP = 100;

// start program
main()

//main logic
async function main() {
    //get pokemon data from api
    console.log(await getPokemon(''))
    let randomPokemonOne = Math.floor(Math.random() * maxPokemonLength + 1)
    let randomPokemonTwo = Math.floor(Math.random() * maxPokemonLength + 1)
    const pokemonTop = await getPokemon(randomPokemonOne)
    const pokemonBottom = await getPokemon(randomPokemonTwo)
    //get first 4 moves
    const moves = pokemonBottom.moves.filter((item, index) => index < 4)

    // set pokemon names
    pokemonTopName.textContent = pokemonTop.name
    pokemonBottomName.textContent = pokemonBottom.name

    //set moves
    moves.forEach(move => {
        const moveElement = `<button type="button" class="move">${move.move.name}</button>`
        pokemonMovesContainer.insertAdjacentHTML('beforeend', moveElement)
    })

    //get moves
    const pokemonMoves = document.querySelectorAll('.move')
    pokemonMoves.forEach(move => {
        move.addEventListener('click', (e) => {
            handleAttackPokemonOne(e)
        })
    })

    // remove animation when attack is done
    pokemonTopImage.addEventListener('animationend', (e) => {
        e.target.classList.remove('attack')
        e.target.classList.remove('getHit')
    })
    pokemonBottomImage.addEventListener('animationend', (e) => {
        e.target.classList.remove('attack')
        e.target.classList.remove('getHit')
    })

    //set pokemon images 
    pokemonTopImage.src = pokemonTop.sprites.front_default
    pokemonBottomImage.src = pokemonBottom.sprites.back_default

    console.log(pokemonBottom)
}

// handles the attack of the player pokemon
function handleAttackPokemonOne(e) {
    pokemonBottomImage.classList.add('attack')

    const dmg = calculateDmg()

    const message = createMessage('top', e.target.textContent, dmg)

    //show the message of the hit
    sendTextMessage(message)
    //after some time the pokemon gets hit
    pokemonTopHP = calculateHp(dmg, pokemonTopHP)

    setTimeout(() => {
        pokemonTopHPelement.style.setProperty('--hp', `${pokemonTopHP}%`)
        pokemonTopImage.classList.add('getHit')
    }, 1200)

    // computer hits back after a second
    setTimeout(() => {

        //check if pokemon dies
        if (pokemonTopHP < 1) {
            pokemonTopImage.style.transform = 'translateY(120%)'
            sendTextMessage('You have won!')
        } else {
            handleAttackPokemonTwo()
        }
    }, 3000)
}

// handles the attack of the computer pokemon
function handleAttackPokemonTwo() {

    pokemonTopImage.classList.add('attack')
    const dmg = calculateDmg()
    pokemonBottomHP = calculateHp(dmg, pokemonBottomHP)

    //give message 
    const message = createMessage('bottom', `your opponent hits back!`, dmg)
    sendTextMessage(message)

    //after some time the pokemon gets hit
    setTimeout(() => {
        pokemonBottomHPelement.style.setProperty('--hp', `${pokemonBottomHP}%`)
        pokemonBottomImage.classList.add('getHit')
    }, 1200)

    setTimeout(() => {
        //check if pokemon dies
        if (pokemonBottomHP < 1) {
            pokemonBottomImage.style.transform = 'translateY(120%)'
            sendTextMessage('You are defeated..')
        } else {
            textMessage.style.display = 'none'
        }
    }, 3000)
}

//create a text message to show
function createMessage(pokemon, msg, dmg) {
    let message = ''
    if (pokemon === 'top') {
        message += `you have used ${msg}.`
    } else {
        message += msg
    }
    if (dmg > 30) {
        message += ' It is a critical hit!'
    }
    return message
}

// handles the message block
function sendTextMessage(msg) {
    textMessage.style.display = 'block'
    textMessage.textContent = msg
}

//calculate how much HP is left
function calculateHp(dmg, currentHp) {
    let hp = currentHp - dmg
    if (hp < 0) {
        return 0
    }
    return hp
}

//calculate dmg delt
function calculateDmg() {
    const randomNumber = Math.floor(Math.random() * 4)
    let dmg;
    //if it crits, go from 50 to 100
    if (randomNumber === 4) {
        let min = Math.ceil(50);
        let max = Math.floor(100);
        dmg = Math.floor(Math.random() * (max - min) + min);
    }
    //normal attacks go from 0 to 50
    else {
        let min = Math.ceil(0);
        let max = Math.floor(50);
        dmg = Math.floor(Math.random() * (max - min) + min);
    }

    console.log(dmg)
    return dmg
}

//get pokemon data from the api
async function getPokemon(pokemon) {
    try {
        const baseURL = 'https://pokeapi.co/api/v2/pokemon/'
        const fullURL = baseURL + pokemon
        const response = await fetch(fullURL)
        const data = await response.json()
        return data
    }
    catch (error) {
        console.log(error)
    }
}

