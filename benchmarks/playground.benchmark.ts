import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();

const a: any = new Map();
a.set('test', 'test');

const b: any = {};
b.test = 'test';

var length = 100; // user defined length

const array: number[] = [];
const map = new Map();

for (var i = 0; i < length; i++) {
  array.push(i);
  map.set(i, 0);
}
const tobepushed = [1, 2, 3];

// add tests
suite
  .add('Array#ForOf', async function () {
    const g = [];
    for (const test of array) {
      g.push(test);
    }
  })
  .add('Array#index', async function () {
    const g = [];
    for (let i = 0, len = array.length; i < len; i++) {
      g.push(array[i]);
    }
  })
  .add('Array#indexWithTemp', async function () {
    const g = [];
    for (let i = 0, temp = array[i]; i < array.length; temp = array[++i]) {
      g.push(temp);
    }
  })
  // add listeners
  .on('cycle', function (event: any) {
    console.log(String(event.target));
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ async: true });
