import { Field, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";

@InputType()
export class UserInput {
  @Field()
  id: String;

  @Field()
  @Length(1, 30)
  name: String;

  @Field()
  @IsEmail()
  @Length(1, 30)
  email: String;

  @Field()
  password: String;
}
