import { writeFile } from "fs";

const femaleNames = [
  "Anna",
  "Benita",
  "Cecylia",
  " Daria",
  " Elzbieta",
  " Florencja",
  " Gosia",
  " Honorata",
];
const maleNames = [
  "Andrzej",
  "Bartosz",
  "Cyprian",
  "Dariusz",
  "Eugeniusz",
  "Franciszek",
  "Gazda",
  "Hubert",
];

const secondNames = [
  "Adrianowicz",
  "Bartoszewicz",
  "Ciulinski",
  "Debicki",
  "Entymowski",
  "Falkiewicz",
  "Gornicki",
  "Hujowy",
];

let firstName,
  secondName,
  sex = "";
let age = 0;
let peopleArray = [];
let peopleString = "";
let males,
  females = {};

peopleString = "{ \n";
for (let i = 0; i <= 8; i++) {
  if (Math.random() < 0.5) {
    sex = "m";
    firstName = maleNames[Math.floor(Math.random() * 8)];
    secondName = secondNames[Math.floor(Math.random() * 8)];
    age = Math.floor(Math.random() * (79 - 18) + 18);
    males = { firstName, secondName, sex, age };
    peopleArray.push(males);
  } else {
    sex = "f";
    firstName = femaleNames[Math.floor(Math.random() * 8)];
    secondName = secondNames[Math.floor(Math.random() * 8)];
    age = Math.floor(Math.random() * (79 - 18) + 18);
    females = { firstName, secondName, sex, age };
    peopleArray.push(females);
  }
}
peopleArray = { people: peopleArray };
peopleString = JSON.stringify(peopleArray, null, 5);

console.log(peopleString);

writeFile("people.txt", peopleString, (err) => {
  if (err) throw err;
  console.log("the file has been saved");
});
