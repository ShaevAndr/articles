import { Token } from '@auth/entites';
import { Article } from 'src/articles/entity/article.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 40, nullable: false, unique: true })
    email: string;

    @Column('text', { nullable: false })
    password: string;

    @CreateDateColumn()
    createdAt: number;

    @Column({
        type: 'enum',
        enum: ['admin', 'user'],
        default: 'user',
    })
    roles: Roles[];

    @Column({ default: true })
    isActive: boolean;

    @OneToOne(() => Token, token => token.user)
    token: Token;

    @OneToMany(() => Article, (article) => article.author)
    article: Article[];
}

type Roles = 'admin' | 'user';
