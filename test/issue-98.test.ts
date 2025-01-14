import { Relator, Serializer } from '../src';

describe('Issue 98 - nested relationship recursion performance issues', () => {
  class Parent {
    constructor(public id: string, public children: Child[]) {}
  }

  class Child {
    constructor(
      public id: string,
      public name: string,
      public nestedChildren: NestedChild[],
      public nestedChildren2: NestedChild[]
    ) {}
  }

  class NestedChild {
    constructor(public id: string, public label: string) {}
  }

  class NestedChild2 {
    constructor(public id: string, public label: string) {}
  }

  const randomId = (max: number) => {
    return Math.ceil(Math.random() * max)
      .toFixed(0)
      .toString();
  };

  const makeParent = (): Parent => {
    return {
      id: randomId(1_000),
      children: Array.from({ length: 1_000 }, (_, i) => makeChild()),
    };
  };

  const makeChild = (): Child => {
    return {
      id: randomId(10),
      name: Math.random().toString(),
      nestedChildren: Array.from({ length: 500 }, (_, i) => makeNestedChild()),
      nestedChildren2: Array.from({ length: 500 }, (_, i) => makeNestedChild2()),
    };
  };

  const makeNestedChild = (): NestedChild => {
    return {
      id: randomId(10),
      label: Math.random().toString(),
    };
  };
  const makeNestedChild2 = (): NestedChild => {
    return {
      id: randomId(10),
      label: Math.random().toString(),
    };
  };

  it('should serialise a massively nested object', async () => {
    const object = makeParent();

    const NestedChildSerializer = new Serializer<NestedChild>('NestedChild');
    const NestedChild2Serializer = new Serializer<NestedChild2>('NestedChild2');
    const ChildSerializer = new Serializer<Child>('Child', {
      relators: {
        nestedChildren: new Relator<Child, NestedChild>(
          async (child) => child.nestedChildren,
          NestedChildSerializer,
          { relatedName: 'nestedChildren' }
        ),
        nestedChildren2: new Relator<Child, NestedChild>(
          async (child) => child.nestedChildren2,
          NestedChild2Serializer,
          { relatedName: 'nestedChildren2' }
        ),
      },
    });
    const ParentSerializer = new Serializer<Parent>('Parent', {
      relators: [
        new Relator<Parent, Child>(async (parent) => parent.children, ChildSerializer, {
          relatedName: 'children',
        }),
      ],
    });

    const serializedDepth = await ParentSerializer.serialize(object, { include: 2 });
    expect(serializedDepth.included).toHaveLength(30);

    const serializedInclude = await ParentSerializer.serialize(object, {
      include: ['children.nestedChildren', 'children.nestedChildren2'],
    });
    expect(serializedInclude.included).toHaveLength(30);
  });
});
