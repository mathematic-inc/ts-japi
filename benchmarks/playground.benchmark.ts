import Benchmark from "benchmark";

const suite = new Benchmark.Suite();

const a: any = new Map();
a.set("test", "test");

const b: any = {};
b.test = "test";

// add tests
suite
 .add("Object#assign", async function () {
  !0
 })
 .add("Object#spread", async function () {
  1
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
