import { IsString, MinLength, MaxLength, Matches } from "class-validator";
import { Field, InputType } from 'type-graphql';

@InputType()
export class SignInInputDto {
  @IsString() @MinLength(4) @MaxLength(20)
  @Field()
  uname: string;

  @IsString() @MinLength(8) @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password is too weak.' }
  )
  @Field()
  pwd: string;
}