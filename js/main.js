var hangmanArray = [
  'drvo',
  'mica',
  'pica'
];
var samoglasnici = ['a', 'o', 'e', 'i', 'u'];
var joinWords = [];
var savedWords = [];
var showListItems = document.getElementById('lista');
var guesses = 5;
var score = 0;
var scores = 0;
var time = 0;
var seconds = 0;
var totalScore = 0;
var newlyAddedWords;

// Assign array and value form local storage to addAWord
addAWord = JSON.parse(localStorage.getItem('insertToLS')) || [];
// Convert value to JSON string and save it to local storage
localStorage.setItem('existing', JSON.stringify(hangmanArray));
existingWords  = JSON.parse(localStorage.getItem('existing'));
// If addAWord is true
if(addAWord) {
  // Concatinate existingWords and addAWord arrays into newlyAddedWords
  newlyAddedWords = existingWords.concat(addAWord);
}
// Get data from local storage and set values to aprpropriate variables
var retriveData = JSON.parse(localStorage.getItem('showLocal'));
var showStorage =  document.getElementById('showLocalStorage');
var storageTitle = document.getElementById('localStorageTitle').innerHTML = 'Your last words were:';
if('showLocal' in localStorage) {
  for(var i = 0, j = retriveData.length; i < j; i++ ) {
    showStorage.innerHTML += '- word: ' + retriveData[i].word + ' - score: ' + retriveData[i].score + ' - time: ' + retriveData[i].time + ' seconds.' + '<br>';
  }
}else {
  document.getElementById('showLocalStorage').style.display = 'none';
  document.getElementById('localStorageTitle').style.display = 'none';
}

function addToArray() {
  // Get value form element with the id word and add it to addWord
  addWord = document.getElementById('word').value;
  // If the index of addWord from newlyAddedWords is not true, add a word, set value to local storage and reload page
  if(newlyAddedWords.indexOf(addWord) == -1){
    console.log(addWord);
      addAWord.push(addWord);
      localStorage.setItem('insertToLS', JSON.stringify(addAWord));
      location.reload();
    }
};

function updateArray() {
  // Set value from autocomplete and ignore case-sensitiveness
  var enteredWord = new RegExp(autocomplete.value, 'i');
  // Create document fragment based on words in newlyAddedWords
  for(var arrayLength = 0, createFragment = document.createDocumentFragment(), c = false; arrayLength < newlyAddedWords.length; arrayLength++) {
    // Tests for a match in a string, returns true
    if(enteredWord.test(newlyAddedWords[arrayLength])) {
      c = true;
      var createPTag = document.createElement('p');
      createPTag.innerText = newlyAddedWords[arrayLength];
      createPTag.setAttribute("onclick", "autocomplete.value=this.innerText;autocomplete_result.innerHTML='';autocomplete_result.style.display='none';");
      createFragment.appendChild(createPTag);
    }
  }

  // Do while enteredWord is true
  while(newlyAddedWords.length) {
    autocomplete_result.innerHTML = '';
    autocomplete_result.style.display = 'block';
    autocomplete_result.appendChild(createFragment);
    return;
  }
};

autocomplete.addEventListener("keyup", updateArray);

function timer() {
  // Set seconds on element with the id times and add seconds
  document.getElementById('times').innerHTML = 'Time: ' + seconds;
  seconds++;
};

function startGame() {
  // Hide one div and show second
  document.getElementById('firstDiv').style.display = 'none';
  document.getElementById('secondDiv').style.display = 'block';
  addedWord = document.getElementById('autocomplete').value;
  // For every letter in addedWord change to '_'
  for (var i = 0; i < addedWord.length; i++) {
    joinWords[i] = '_';
  }
  // Join word, set to show guesses and set timer to count seconds
  document.getElementById('showWords').textContent = joinWords.join(' ');
  document.getElementById('lives').innerHTML =  'You have: ' + guesses + ' guesses!';
  setInterval(timer, 1000);
};

function checkLetters() {
  var letter = document.getElementById('selectLetter').value;
  if(letter.length > 0) {
    // If guessed letter was not equal to addedWord
    if(addedWord.indexOf(letter) == -1) {
      // Decrement guesses and take out from score 0.25
      guesses--;
      score -= 0.25;
    }else {
      // For every letter in addedWord
      for(var i = 0; i < addedWord.length; i++) {
        // If letter of addedWord is strict equal to letter
        if(addedWord[i] === letter) {
          // Change '_' to letter
          joinWords[i] = letter;
          // If that letter is samoglasnik add to score 0.25
          if(samoglasnici.indexOf(letter) == -1) {
              score += 0.25;
          }
          // For every other letter add to score 0.50
          else{
            score += 0.50;
          }
        }
      }
    }
    document.getElementById('selectLetter').value = '';
    document.getElementById('showWords').innerHTML = joinWords.join(' ');
    document.getElementById('lives').innerHTML =  'You have: ' + guesses + ' guesses!';
  }
  // If guesses are less or equal than 0
  if(guesses <= 0){
    // Finish game
    alert('Shoot, you have run out of guesses!!');
    document.getElementById('showWords').style.display = 'none';
    document.getElementById('times').style.display = 'none';
    document.getElementById('continueGame').setAttribute('disabled', 'disabled');
    document.getElementById('selectLetter').disabled = 'disabled';
    document.getElementById('restart').innerHTML = 'Refresh page to restart game.';
    // Else if addedWord is strict qeual joinWords.join('')
  }else if(addedWord === joinWords.join('')) {
    // Push to array savedWords
    savedWords.push({
      'word': addedWord,
      'score': score,
      'time': seconds
    });
    totalScore += score;
    score = 0;
    seconds = 0;
    // For every object in savedWords create new list item
    for(var n = 0; n < savedWords.length; n++){
      totalScore += score;
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(savedWords[n].word + ' - (' + savedWords[n].score + ' scores, ' + savedWords[n].time + ' seconds).'));
    }
    showListItems.appendChild(entry);
    document.getElementById('totalScore').innerHTML = 'Total score: ' + totalScore;
    joinWords = [];
  }
};

function continueGame() {
  // Set addedWord to be random value from newlyAddedWords
  addedWord = newlyAddedWords[Math.floor(Math.random() * newlyAddedWords.length)];
  console.log(addedWord);
  // Look for every element with word propertie in array savedWords and return their value
  checkSavedWords = savedWords.map(function(getWord) {
    return getWord.word;
  });
  // If newlyAddedWords length is greater then savedWords length
  if(newlyAddedWords.length > savedWords.length){
    // The ~ operator transforms only -1 in 0, thus it's the only falsy value.
    if(~checkSavedWords.indexOf(addedWord)){
      continueGame();
    }
    // Else win game
  }else {
    document.getElementById('showWords').style.display = 'none';
    document.getElementById('times').style.display = 'none';
    document.getElementById('continueGame').setAttribute('disabled', 'disabled');
    document.getElementById('selectLetter').disabled = 'disabled';
    alert('Congratulations! You won!');
    document.getElementById('restart').innerHTML = 'Refresh page to restart game.';
  }
  for(var a = 0; a < addedWord.length; a++) {
    joinWords[a] = "_";
  };
  document.getElementById('showWords').textContent = joinWords.join(" ");
  // Set savedWords array into local storage
  localStorage.setItem('showLocal', JSON.stringify(savedWords));
}
