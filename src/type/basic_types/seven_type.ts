export const number: number = 1;
export const string: string = 'string';
export const boolean: boolean = true;

//any là kiểu mà có thể gán bất kì ký kiểu nào cho nó
export let any: any = 1;
any = 'string';
any = true;

//Array: có 2 kiểu khai báo tương đương với nhau trong TS
export const _arrays: number[] = [1, 2]
export const _arrays2: Array<number> = [1, 2]

export enum Color {Red, Green, Blue}
export const color: Color = Color.Blue

//void được sử dụng khi hàm không trả lại bất kỳ giá trị nào
export function a(): void {
  console.log("This is my warning message")
}