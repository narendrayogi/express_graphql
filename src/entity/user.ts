import { Field, ID, ObjectType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
@ObjectType()
export class User {

    @PrimaryGeneratedColumn()
    @Field(type => ID)
    id?: number

    @Column()
    @Field()
    firstName: string

    @Column()
    @Field()
    lastName: string

    @Column()
    @Field()
    age: number

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    last_changed_at: Date;

    @DeleteDateColumn({ type: 'timestamptz' })
    deleted_at?: Date;
}
