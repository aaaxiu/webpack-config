//index.js
import './index.less'


class Animal {
  constructor(name) {
      this.name = name;
  }
  getName() {
      return this.name;
  }
}

const dog = new Animal('dog');

document.write('Hello Webpack!')
console.log('Hello Webpack!')
