import { ModelA } from './issue-62/model-a';
import { ModelB } from './issue-62/model-b';
// import { A, AtoBRelator, SerializerA } from './issue-60/model-a';
// import { B, BtoARelator, SerializerB } from './issue-60/model-b';

// Error is when the model relators for a cyclic dependency loop
// The issue only presents when models and serializers are in separate files
// as they are isolated.

// This is not really a good test, however it does illustrate the issue
// and confirms that the change/fix does indeed work.

it('Should bypass recurse cycles after data fetched', async () => {
  const objA: ModelA = { id: '1' };
  const objB: ModelB = { id: '1', a: objA };
  objA.b = objB;

  const result = await ModelA.SerializerA.serialize(objA);

  expect(result.data).toBeDefined();
});
