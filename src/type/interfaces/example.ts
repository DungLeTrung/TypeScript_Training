interface People {
  lastName: string
  firstName: string 
}

export const fullName = (object: People) => {
  console.log("Your full name is " + object.firstName + " " + object.lastName)
}

interface CircleConfig {
  color?: string,
  radius?: number, 
  diameter?: number
}

export const circleConfig = (config: CircleConfig) => {
  let newCircle = {color: "white", radius: 20, diameter: 20}
  console.log("Circle config: ", newCircle)
  if(config.color) {
    newCircle.color = config.color
  }
  if(config.radius) {
    newCircle.radius = config.radius
  }
  if(config.diameter) {
    newCircle.diameter = config.diameter * 2
  }
  return console.log("Circle config: ", newCircle)
}
