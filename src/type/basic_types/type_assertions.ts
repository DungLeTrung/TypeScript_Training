interface Person {
  name: string;
  age: number;
  gender?: string;
}

export const person = {
  name: 'John',
  age: 18,
} as Person