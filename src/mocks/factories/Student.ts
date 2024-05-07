import { Factory, Faker } from '@mikro-orm/seeder';
import { User, UserType } from '../../models/User';
import { EntityData } from '@mikro-orm/core';
import * as crypto from 'node:crypto';
import { mockPasswordHash } from '../data/user';

export class StudentFactory extends Factory<User> {
    model = User;

    private generateName(faker: Faker): string {
        let isFemale = crypto.randomInt(2) >= 1;
        return `${faker.name.firstName(isFemale ? 'female' : 'male')} ${faker.name.lastName(isFemale ? 'female' : 'male')}`;
    }

    protected definition(faker: Faker): EntityData<User> {
        return {
            name: this.generateName(faker),
            email: faker.helpers.unique(faker.internet.email),
            idNumber: `SCH-S${faker.helpers.unique(() => faker.random.alphaNumeric(4, {casing: 'upper'}))}`,
            password: mockPasswordHash,
            userType: UserType.student,
        }
    }
}
