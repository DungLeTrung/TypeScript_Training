//Required: Set tất cả thuộc tính thành lại required
//Read-only: Chỉ cho phép đọc thuộc tính không cho set lại giá trị
//Record: Định nghĩa kiểu type với key-value Record<keys, type>
interface Person {
  name: string;
  age: number;
  gender: string;
}

export function updatePerson(person: Person, fieldsUpdate: Partial<Person>) {
  return {...person, ...fieldsUpdate}
}