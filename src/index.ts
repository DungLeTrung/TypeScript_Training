
//BASIC TYPES
// console.log(number); // 1
// console.log(string); // 'string'
// console.log(boolean); // true
// console.log(_arrays); // [1, 2]
// console.log(_arrays2); // [1, 2]
// console.log(color); // 2 (Color.Blue)
// a();
// console.log(Person); //
// console.log(Person1); //
// console.log(person); //

import { Person, updatePerson } from "./type/utility_types/partial"

//FUNCTION TYPES
// console.log("Traditional Function: ", add(3, 4))
// console.log("Arrow Function: ", minus(3, 4))
// console.log("Optional Parameter: ", multiply(3, 4))
// console.log("Optional Parameter2: ", multiply(3, 4, 5))
// console.log("Default Parameter2: ", divide(3, 4))

//UNION TYPES
// _function(2)
// _function('string')

//INTERFACE
// fullName({ firstName: 'Le', lastName: 'Trung Dung'})
// circleConfig({ color: 'Red', radius: 40, diameter: 50})

//GENERICS
// console.log(getData<number>([1, 2, 3, 4]))
// console.log(getData<string>(["A", "D", "A", "M", "O"]))

// interface Person {
//   name: string;
//   age: number;
//   gender: string;
// }

// const personList: Employee<Person> = [
//   {
//     name: 'Le',
//     age: 34,
//     gender: 'Female'
//   }
// ]

// console.log(personList)

// const person = {name: 'Le', age: 34, gender: 'Female'}
// console.log("Display: ", getProperty(person, 'name'))

// const string = new Employee2<string>("Adamoo!!")
// console.log(string.getContents())

const person = {
  name: "Adamo",
  age: 22,
  gender: "Female"
}

//PARTIAL
const updatePersonn: Readonly<Person> = {
    gender: "Male"
  }

//READONLY
// const updatePersonn: Readonly<Person> = {
//   gender: "Male"
// }
// updatePersonn.gender = "Female"

//REQUIRED
// const updatePersonn2: Required<Person> = {
//   gender: "Male"
// }

console.log(updatePerson(person, updatePersonn))

//RECORD
const person2: Record<string, string> = {
  firstName: "Le",
  lastName: "Dung"
}

console.log(person2)