import { User } from 'src/user/entites/user.entites';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

@Entity()
export class Token {
    @PrimaryColumn()
    token: string;

    @Column('timestamp')
    exp: string;

    @OneToOne(() => User, (user) => user.token)
    @JoinColumn()
    user: User;
}
