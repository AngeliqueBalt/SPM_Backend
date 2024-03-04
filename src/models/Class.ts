import { TrackedBaseEntity } from './BaseEntity';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { User } from './User';
import { Quiz } from './Quiz';

@Entity({ tableName: 'classes' })
export class Class extends TrackedBaseEntity {

    @Property({ type: 'text' })
    name!: string;

    @ManyToOne()
    teacher!: User;

    @ManyToMany()
    students = new Collection<User>(this);

    @OneToMany(() => Quiz, quiz => quiz.class)
    quizzes = new Collection<Quiz>(this);

    constructor(fields: {
        name: string;
        teacher: User;
        students?: Collection<User>;
    }) {
        super();

        this.name = fields.name;
        this.teacher = fields.teacher;

        if (fields.students) this.students = fields.students;
    }

}
