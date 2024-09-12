//Traditional Function
export function add(x: number, y: number): number {
  return x + y;
}

//Arrow Function
export const minus = (x: number, y: number): number => {
  return x - y;
}

//Optional Parameter
export const multiply = (x: number, y: number, z?: number): number => {
  if(z) {
    return x * y * z;
  }
  return x * y
}

//Default Parameter
export const divide = (x: number, y: number, z: number = 2): number => {
  return (x * y) / z
}

// //Không thể dùng chung Optional Parameter và Default Parameter vào một đối số.
// export const test = (x: number, y: number, z?: number = 2): number => {
//   return (x * y) / z
// }