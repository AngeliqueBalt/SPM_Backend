import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Class } from '../../models/Class';
import { classSizes, quizzes } from '../data/classes';
import { TeacherFactory } from '../factories/Teacher';
import { StudentFactory } from '../factories/Student';
import { QuizFactory } from '../factories/Quiz';
import { QuizSubmissionFactory } from '../factories/QuizSubmission';
import { AdminFactory } from '../factories/Admin';

const MOCK_SCHOOL_DOMAIN = '@school.com';

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {

        // Mock timestamps.
        const createdAt = new Date();
        const updatedAt = createdAt;

        // Factories.
        const adminFactory = new AdminFactory(em);
        const teacherFactory = new TeacherFactory(em);
        const studentFactory = new StudentFactory(em);

        // Counters.
        let nextStudentId = 1;
        let nextTeacherId = 1;

        // Create 1 admin
        adminFactory.makeOne({
            email: `admin${MOCK_SCHOOL_DOMAIN}`
        });

        // Create 1 teacher for all classes.
        const teacher = teacherFactory.makeOne({
            idNumber: `SCH-T${nextTeacherId.toString().padStart(4, '0')}`,
            email: `teacher${nextTeacherId}${MOCK_SCHOOL_DOMAIN}`,
        });
        nextTeacherId++;

        // Create 100 students.
        const allStudents = studentFactory.each(student => {
            student.idNumber = `SCH-S${nextStudentId.toString().padStart(4, '0')}`;
            student.email = `student${nextStudentId}${MOCK_SCHOOL_DOMAIN}`;
            nextStudentId++;
        }).make(100);

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
            const quizFactory = new QuizFactory(em, clazz);
            const quiz = quizFactory.makeOne();

            // For each student in the quiz, make submissions.
            const quizSubmissionFactory = new QuizSubmissionFactory(em, quiz);
            for (let student of students) {
                quizSubmissionFactory.makeOne({
                    student
                });
            }
        }

    }
}
