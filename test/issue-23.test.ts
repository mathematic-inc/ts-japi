import { Serializer, Relator } from "../lib";
import { inspect } from "util";

describe("Serializer", () => {
 it("Should traverse a depth > 1", async () => {
  type A = { id: string; prop: string };
  type B = { id: string; prop: string };
  type C = { id: string; prop: string };

  const counters = { AtoB: 0, BtoC: 0 };

  const SerializerC = new Serializer<C>("c");

  const BtoCRelator = new Relator<B, C>(async (data) => {
   counters.BtoC++;
   return { id: "1", prop: "c" };
  }, SerializerC);

  const SerializerB = new Serializer<B>("b", {
   relators: { c: BtoCRelator },
  });

  const AtoBRelator = new Relator<A, B>(async (data) => {
   counters.AtoB++;
   return { id: "1", prop: "b" };
  }, SerializerB);

  const SerializerA = new Serializer<A>("a", {
   relators: { b: AtoBRelator },
  });

  const serialized = await SerializerA.serialize({ id: "1", prop: "a" }, { depth: 2 });

  console.log(
   `A to B: ${counters.AtoB}\nB to C: ${counters.BtoC}\nSerialized Data:\n${inspect(
    serialized,
    false,
    20
   )}`
  );
  counters.AtoB = counters.BtoC = 0;
 });
});
