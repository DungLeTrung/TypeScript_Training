/*Generics type cho phép mình có thể tái sử dụng với nhiều kiểu dữ liệu khác nhau
nhưng vẫn đảm bảo tính an toàn về kiểu. Cho phép nhận tham số và trả về kiểu dữ liệu
tương ứng*/

//Generics Functions
export const getData = <T> (data: T[]) => {
  return data
}

//Generics Interface
export interface Employee<T> {
  [index: number]: T
}

//Generics Constraints
export const getProperty = <T, K extends keyof T> (obj: T, key: K) => {
  return obj[key]
}

//Generics Classes
export class Employee2<T> {
  contents: T

  constructor(contents: T) {
    this.contents = contents
  }

  getContents(): T {
    return this.contents
  }
}


