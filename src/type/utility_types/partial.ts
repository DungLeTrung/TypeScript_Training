//Partial: Set tất cả thuộc tính của Type thành optional

export interface Person {
  name?: string;
  age?: number;
  gender?: string;
}

export function updatePerson(person: Person, fieldsUpdate: Partial<Person>) {
  return {...person, ...fieldsUpdate}
}

