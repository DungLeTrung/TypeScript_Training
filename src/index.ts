import { Employee, Employee2, getData, getProperty } from './type/generics/generic_types'
import { circleConfig, fullName} from './type/interfaces/example'

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

const string = new Employee2<string>("Adamoo!!")
console.log(string.getContents())