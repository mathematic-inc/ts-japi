import { Serializer, Relator } from '../lib';

describe('issue-68 - nested relations not being included', () => {
  class User {
    constructor(public id: string, public organisationMembers: OrganisationMember[]) {}
  }

  class OrganisationMember {
    constructor(public id: string, public organisation: Organisation) {}
  }

  class Organisation {
    constructor(public id: string, public name: string) {}
  }

  // assemble serializers
  const UserSerializer = new Serializer<User>('user', {
    projection: { organisationMembers: 0 },
  });

  const OrganisationMemberSerializer = new Serializer<OrganisationMember>('organisation-member');
  const OrganisationSerializer = new Serializer<Organisation>('organisation');

  // assemble relators
  const UserToOrganisationMemberRelator = new Relator<User, OrganisationMember>(
    async (user: User) => user.organisationMembers,
    OrganisationMemberSerializer,
    {
      relatedName: 'organisation-members',
    }
  );

  const OrganisationMemberToOrganisationRelator = new Relator<OrganisationMember, Organisation>(
    async (organisationMember: OrganisationMember) => organisationMember.organisation,
    OrganisationSerializer,
    {
      relatedName: 'organisation',
    }
  );

  UserSerializer.setRelators([UserToOrganisationMemberRelator]);
  OrganisationMemberSerializer.setRelators(OrganisationMemberToOrganisationRelator);

  const org1 = new Organisation('808a1c9b-4b3e-47a2-830a-ff3cdee42d6d', 'Some Company 1');
  const org2 = new Organisation('a0d14ebd-e9ae-4ec2-b6e8-d7da29c0391e', 'Some Company 3');
  const org3 = new Organisation('6896c877-2b8e-4349-97b6-364526be98fa', 'Some Company 2');

  const orgMemebers: OrganisationMember[] = [
    new OrganisationMember('3f889f6c-c5a6-4adf-8982-6d5924a01103', org1),
    new OrganisationMember('8ec9d44c-f502-4d8b-8a77-7c140cd2ad5f', org2),
    new OrganisationMember('b4cb2c41-a944-4578-9d44-c0b58cdb7183', org3),
  ];

  const data: User = {
    id: '8f8c9e81-130a-47b0-8128-8fa590f0b339',
    organisationMembers: orgMemebers,
  };

  it('should include all nested relations when included', async () => {
    const serialized = await UserSerializer.serialize(data, {
      include: ['organisation-members', 'preferences', 'organisation-members.organisation'],
    });

    expect(serialized.included).toHaveLength(6);
    expect(serialized.included?.filter((i) => i.type === 'organisation')).toHaveLength(3);
  });
});
