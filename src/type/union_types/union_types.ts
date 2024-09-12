/*Trong Typescript: Một biến có thế có nhiều kiểu dữ liệu 
thay vì chúng ta định nghĩa từng biến.*/

let options: number | string;
options = 1;
options = 'string';

export const _function = (params: number | string) => {
  console.log(params);
}