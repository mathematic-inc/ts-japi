import { PolymorphicSerializer, Relator, Serializer } from '../lib';
import ResourceIdentifier from '../lib/models/resource-identifier.model';
import Resource from '../lib/models/resource.model';

describe('Issue #65 - Polymorphic relator', () => {
  class Model {
    id: string;

    children: Child[];
  }

  abstract class Child {
    public type: string;

    constructor(public id: string) {}
  }

  class Child1 extends Child {
    constructor(id: string, public child1: string) {
      super(id);
      this.type = 'type:Child1';
    }
  }

  class Child2 extends Child {
    constructor(id: string, public child2: string) {
      super(id);
      this.type = 'type:Child2';
    }
  }

  class Child3 extends Child {
    constructor(id: string, public child2: string) {
      super(id);
      this.type = 'type:Child3';
    }
  }

  it('should work non-polymorphicly', async () => {
    const model: Model = new Model();
    const child1: Child1 = new Child1('1', 'child1');
    const child2: Child2 = new Child2('2', 'child2');

    model.id = '1';
    model.children = [child1, child2];

    const Child1Serializer = new Serializer<Child>('Child');

    const relator = new Relator<Model, Child>(
      async (obj) => obj.children,
      () => Child1Serializer,
      { relatedName: 'children' }
    );

    const ModelSerializer = new Serializer<Model>('Model', {
      relators: [relator],
      projection: {
        children: 0,
      },
    });

    const data = (await ModelSerializer.serialize(model)) as { data: Resource<Model> };

    expect(data.data).toBeInstanceOf(Resource);
    expect(data.data.relationships?.children.data).toHaveLength(2);
    expect(data.data.relationships?.children.data?.[0].id).toEqual('1');
    expect(data.data.relationships?.children.data?.[1].id).toEqual('2');

    expect(data.data.relationships?.children.data?.[0].type).toEqual('Child');
    expect(data.data.relationships?.children.data?.[1].type).toEqual('Child');
  });

  it('should work polymorphicly', async () => {
    const model: Model = new Model();
    const child1: Child1 = new Child1('1', 'child1');
    const child2: Child2 = new Child2('2', 'child2');
    const child3: Child2 = new Child3('3', 'child3');

    model.id = '1';
    model.children = [child1, child2, child3];

    const Child1Serializer = new Serializer<Child1>('Child1');
    const Child2Serializer = new Serializer<Child2>('Child2');

    const PolySerializer = new PolymorphicSerializer<Child>('Child', 'type', {
      'type:Child1': Child1Serializer,
      'type:Child2': Child2Serializer,
    });

    const relator = new Relator<Model, Child>(async (obj) => obj.children, PolySerializer, {
      relatedName: 'children',
    });

    const ModelSerializer = new Serializer<Model>('Model', {
      relators: [relator],
      projection: {
        children: 0,
      },
    });

    const data = (await ModelSerializer.serialize(model)) as { data: Resource<Model> };

    expect(data.data).toBeInstanceOf(Resource);
    expect(data.data.relationships?.children.data).toHaveLength(3);
    expect(data.data.relationships?.children.data?.[0].id).toEqual('1');
    expect(data.data.relationships?.children.data?.[1].id).toEqual('2');
    expect(data.data.relationships?.children.data?.[2].id).toEqual('3');

    expect(data.data.relationships?.children.data?.[0].type).toEqual('Child1');
    expect(data.data.relationships?.children.data?.[1].type).toEqual('Child2');
    expect(data.data.relationships?.children.data?.[2].type).toEqual('Child');
  });
});
