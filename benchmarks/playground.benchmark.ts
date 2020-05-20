import Benchmark from "benchmark";

const suite = new Benchmark.Suite();

// add tests
suite
 .add("Object#assign", async function () {
  let document: any = {};
  document.data = null
  return document;
 })
 .add("Object#spread", async function () {
  let document: any = {};
  return document.data = null || document;
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
