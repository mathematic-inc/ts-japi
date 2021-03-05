import { Serializer, Relator } from '../lib';

it('Should bypass recurse cycles after data fetched', async () => {
  type A = { id: string; prop: string };
  type B = { id: string; prop: string };
  let fetchCounter = 0;

  const SerializerB = new Serializer<B>('b');
  const AtoBRelator = new Relator<A, B>(async () => {
    fetchCounter++;
    return { id: '1', prop: 'b' };
  }, SerializerB);

  const SerializerA = new Serializer<A>('a', {
    relators: { b: AtoBRelator },
  });

  await SerializerA.serialize(
    [
      { id: '1', prop: 'a1' },
      { id: '1', prop: 'a2' },
    ],
    { depth: 20 }
  );

  // The result is 2 because to relator is called each time.
  expect(fetchCounter).toBe(2);
});
