import { Field, ObjectType } from "type-graphql";
import UserSchema from "./UserSchema";
@ObjectType({ description: "User Response" })
export default class UserResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => UserSchema)
  data: UserSchema | null;

  @Field(() => String)
  error: String | null;
}
