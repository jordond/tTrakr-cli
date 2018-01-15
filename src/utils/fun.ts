import c from "chalk";

const sayings = [
  c`hope you had {magenta fun} 😘`,
  c`go {blue fourth} my {red son}`,
  c`go {blue fourth} my {cyan child}`,
  c`blessed be the {red ori}`,
  c`good day!`,
  c`I'm done with you`,
  c`I'LL {magenta MISS} YOU 😘`,
  c`kbai`
];

export function randomMessage() {
  return sayings[Math.floor(Math.random() * sayings.length)];
}
