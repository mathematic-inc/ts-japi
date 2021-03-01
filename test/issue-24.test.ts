import { Serializer, Relator } from "../lib";
import { inspect } from "util";

describe("Serializer", () => {
 it("Should bypass recurse cycles after data fetched", async () => {
  type A = { id: string; prop: string };
  type B = { id: string; prop: string };
  let fetchCounter = 0;

  const SerializerB = new Serializer<B>("b");
  const AtoBRelator = new Relator<A, B>(async (data) => {
   fetchCounter++;
   return { id: "1", prop: "b" };
  }, SerializerB);

  const SerializerA = new Serializer<A>("a", {
   relators: { b: AtoBRelator }
  });

  const serialized = await SerializerA.serialize({ id: "1", prop: "a" }, { depth: 10 });

  // This is 2 rather than 1 due to fetch requests occuring outside of recurse
  // method. Subsequent work may be able to reduce calls to 1.
  // Note: prior to patching, the count was 11.
  expect(fetchCounter).toBe(2);
 });
});
