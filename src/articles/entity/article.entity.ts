
import { User } from '@user/entites/user.entites';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 40, nullable: false, unique: true })
    title: string;

    @Column('text', { nullable: false })
    description: string;

    @CreateDateColumn()
    publishDate: string;

    @OneToOne(() => User, user => user.id)
    author: string;

}