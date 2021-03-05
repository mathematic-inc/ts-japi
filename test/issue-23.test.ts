import { Relator, Serializer } from '../lib';

describe('Serializer', () => {
  it('Should traverse a depth > 1', async () => {
    type A = { id: string; prop: string };
    type B = { id: string; prop: string };
    type C = { id: string; prop: string };

    const SerializerC = new Serializer<C>('c');

    const BtoCRelator = new Relator<B, C>(async (data) => {
      return { id: '1', prop: 'c' };
    }, SerializerC);

    const SerializerB = new Serializer<B>('b', {
      relators: { c: BtoCRelator },
    });

    const AtoBRelator = new Relator<A, B>(async (data) => {
      return { id: '1', prop: 'b' };
    }, SerializerB);

    const SerializerA = new Serializer<A>('a', {
      relators: { b: AtoBRelator },
    });

    const serialized = await SerializerA.serialize({ id: '1', prop: 'a' }, { depth: 2 });

    expect(serialized.included).toHaveLength(2);
    expect(serialized.included.find((data) => data.type === 'b')).toBeDefined();
    expect(serialized.included.find((data) => data.type === 'c')).toBeDefined();
    // console.log(util.inspect(serialized, false, 20));
  });
});
