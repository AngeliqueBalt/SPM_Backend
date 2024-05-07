import { Factory, Faker } from '@mikro-orm/seeder';
import { User, UserType } from '../../models/User';
import { EntityData } from '@mikro-orm/core';
import { mockPasswordHash } from '../data/user';

export class AdminFactory extends Factory<User> {
    model = User;

    protected definition(faker: Faker): EntityData<User> {
        return {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            idNumber: undefined,
            password: mockPasswordHash,
            userType: UserType.admin,
        }
    }
}
