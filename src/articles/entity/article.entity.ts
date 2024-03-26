
import { User } from '@user/entites/user.entites';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';

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

    @ManyToOne(() => User, user => user.article)
    @JoinColumn()
    author: User;

}