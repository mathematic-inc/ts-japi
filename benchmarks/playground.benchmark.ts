import Benchmark from "benchmark";

const suite = new Benchmark.Suite();

const a: any = new Map();
a.set("test", "test");

const b: any = {};
b.test = "test";

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
 .add("Object#assign", async function () {
  let test: any;
  test = { ...test, test: 2 };
 })
 .add("Object#spread", async function () {
  let test: any;
  test = Object.assign({}, test, { test: 2 });
 })
 // add listeners
 .on("cycle", function (event: any) {
  console.log(String(event.target));
 })
 .on("complete", function (this: any) {
  console.log("Fastest is " + this.filter("fastest").map("name"));
 })
 // run async
 .run({ async: true });
