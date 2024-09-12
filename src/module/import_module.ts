/*Export: Sử dụng để export một module ra bên ngoài
nếu không sử dungk export thì module sẽ ở trạng thái
private và không sử dụng được*/

export const add = (a: number, b: number) => {
  return a + b;
}

export const minus = (a: number, b: number) => {
  return a - b;
}

const mul = (a: number, b: number) => {
  return a * b;
}

const div = (a: number, b: number) => {
  return a / b;
}

export {mul, div}

const div2 = (a: number, b: number) => {
return a % b
}

/*Default export: Cho phép xuất mặc định cho mỗi file. Có thể cho một 
function, class, object. Cho phép đặt lại tên cho module*/
export default div2
