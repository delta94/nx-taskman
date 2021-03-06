import { IsString, MinLength, MaxLength, Matches } from "class-validator";
import { InputType, } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@InputType()
export class SignUpInput {
  @IsString() @MinLength(2) @MaxLength(20)
  name: string;

  @IsString() @MinLength(8) @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password is too weak.' }
  )
  pwd: string;

  @IsString() @MinLength(4) @MaxLength(20)
  emaddr?: string;

  async toEntity(): Promise<User> {
    const user = new User();
    user.username = this.name;
    user.thumb = `/images/avatar/${user.username.toLowerCase().replace(/\s+/gi, ' ').replace(/\s/gi, '-')}.png`;
    await user.generatePassword(this.pwd); // 내부에서 salt, password 값이 생성되어 필드에 기록함
    user.email = this.emaddr;
    return user;
  }
}