var myArray = [
  "drvo",
  "palacinka",
  "pica",
  "cokolada",
  "programiranje",
  "javascript"
];
var answers = [];
var guesses = 5;

function updateArray() {
  var enteredText = new RegExp(autocomplete.value, "i");
  for(var x = 0, b = document.createDocumentFragment(), c = false; x < myArray.length; x++) {
    if(enteredText.test(myArray[x])) {
      c = true;
      var d = document.createElement("p");
      d.innerText = myArray[x];
      d.setAttribute("onclick", "autocomplete.value=this.innerText;autocomplete_result.innerHTML='';autocomplete_result.style.display='none';");
      b.appendChild(d);
    }
  }
  while(c < myArray.length) {
    autocomplete_result.innerHTML = "";
    autocomplete_result.style.display = "block";
    autocomplete_result.appendChild(b);
    return;
  }
}

autocomplete.addEventListener("keyup", updateArray);


function addToArray() {
    var addWord = document.getElementById('word').value;
    myArray.push(addWord);
};


function startGame() {
  document.getElementById('firstDiv').style.display = "none";
  document.getElementById('secondDiv').style.display = "block";
  addWord = document.getElementById('autocomplete').value;
  letters = addWord.length;
  for (var i = 0; i < letters; i++) {
    answers[i] = "_";
  }
  document.getElementById("showWords").textContent = answers.join(" ");
  document.getElementById('lives').innerHTML =  "You have " +guesses+ " lives left!";

}

function checkLetters() {
  var letter = document.getElementById('selectLetter').value;
  if(letter.length > 0){
    if (addWord.indexOf(letter) == -1){
      guesses--;
    }
    else{
      for(var i = 0; i < addWord.length; i++){
        if(addWord[i] === letter){
          answers[i] = letter;
        }
      }
    }
    document.getElementById('showWords').innerHTML = answers.join (' ');
    document.getElementById('lives').innerHTML =  "You have " +guesses+ " lives!" ;
  }
  if(guesses < 1){
    document.getElementById("showWords").style.display = "none";
    alert('Crap, you run out of guesses!!');
  }
  if(addWord === answers.join("")){
    var reverse ="";
    for (var i = addWord.length - 1; i >= 0; i--){
      reverse += addWord[i];
    }
    document.getElementById('reverseString').innerHTML = reverse;
    alert('Congratulations, you did it!');
  }
}