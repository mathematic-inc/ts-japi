import { Relator, Serializer } from '../lib';
import Resource from '../lib/models/resource.model';

it('Should skip missing relationships', async () => {
  type User = { id: string };
  type Test = { id: string; user1: User; user2?: User };

  const UserSerializer = new Serializer<User>('User');

  const TestUser1Relator = new Relator<Test, User>(async (test) => test.user1, UserSerializer, {
    relatedName: 'user1',
  });

  const TestUser2Relator = new Relator<Test, User>(async (test) => test.user2, UserSerializer, {
    relatedName: 'user2',
  });

  const TestSerializer = new Serializer<Test>('Test', {
    relators: [TestUser1Relator, TestUser2Relator],
  });

  const testDto = { id: 'foo', user1: { id: 'Alice' } };
  const result = await TestSerializer.serialize(testDto);

  expect((result.data as Resource<Test>)!.relationships).toHaveProperty('user1');
  expect((result.data as Resource<Test>)!.relationships).not.toHaveProperty('user2');
});
