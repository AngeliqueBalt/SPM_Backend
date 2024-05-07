import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Class } from '../../models/Class';
import { classSizes, quizzes } from '../data/classes';
import { QuizFactory } from '../factories/Quiz';
import { QuizSubmissionFactory } from '../factories/QuizSubmission';
import { User, UserType } from '../../models/User';
import { mockPasswordHash } from '../data/user';

const MOCK_SCHOOL_DOMAIN = '@school.com';

export class IntegrationTestDatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {

        // Mock timestamps.
        const createdAt = new Date();
        const updatedAt = createdAt;

        // Create 1 admin
        em.getRepository(User).create({
            name: 'Admin #1',
            email: `admin1${MOCK_SCHOOL_DOMAIN}`,
            idNumber: undefined,
            password: mockPasswordHash,
            userType: UserType.admin,
            createdAt,
            updatedAt,
        });

        // Create 1 teacher for all classes.
        const teacher = em.getRepository(User).create({
            name: `Teacher #1`,
            email: `teacher1${MOCK_SCHOOL_DOMAIN}`,
            idNumber: `SCH-T0001`,
            password: mockPasswordHash,
            userType: UserType.teacher,
            createdAt,
            updatedAt,
        });

        // Create 100 students.
        const allStudents = Array(100)
            .fill(1)
            .map((o, i) => o + i)
            .map(id => em.getRepository(User).create({
                    name: `Student #${id}`,
                    email: `student${id}${MOCK_SCHOOL_DOMAIN}`,
                    idNumber: `SCH-S${id.toString().padStart(4, '0')}`,
                    password: mockPasswordHash,
                    userType: UserType.student,
                    createdAt,
                    updatedAt,
                }));

        // Create each of the classes.
        const classNames = Object.keys(quizzes);
        for (let i = 0; i < classNames.length; i++) {
            const className = classNames[i];
            const classSize = classSizes[i];

            const students = allStudents
                .filter((_, i) => i < classSize);

            // Create the class, with the teacher.
            const clazz = em.create(Class, {
                name: className,
                teacher,
                students,
                createdAt,
                updatedAt,
            });

            // Create the quiz, with the class.
            const quizFactory = new QuizFactory(
                em,
                clazz,
                (_) => `${className}`
            );
            const quiz = quizFactory.makeOne();

            // For each student in the quiz, make submissions.
            const quizSubmissionFactory = new QuizSubmissionFactory(em, quiz);

            let interval = 100 / students.length;
            let count = 1;

            for (let student of students) {
                quizSubmissionFactory.makeOne({
                    student,
                    submitted: new Date("2020-01-01T00:00:00Z"),
                    score: interval * count++,
                });
            }
        }

    }
}
