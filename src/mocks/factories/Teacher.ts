import { Factory, Faker } from '@mikro-orm/seeder';
import { User, UserType } from '../../models/User';
import { EntityData } from '@mikro-orm/core';
import crypto from 'node:crypto';
import { mockPasswordHash } from '../data/user';

export class TeacherFactory extends Factory<User> {
    model = User;

    private generateName(faker: Faker): string {
        let isFemale = crypto.randomInt(2) >= 1;
        return `${faker.name.prefix(isFemale ? 'female' : 'male')} ${faker.name.firstName(isFemale ? 'female' : 'male')} ${faker.name.lastName(isFemale ? 'female' : 'male')}`;
    }

    protected definition(faker: Faker): EntityData<User> {
        return {
            name: this.generateName(faker),
            email: faker.internet.email(),
            idNumber: `SCH-T${faker.helpers.unique(() => faker.random.alphaNumeric(4, {casing: 'upper'}))}`,
            password: mockPasswordHash,
            userType: UserType.teacher,
        }
    }
}
