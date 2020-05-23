import { Field, ObjectType } from "type-graphql";
import UserSchema from "./UserSchema";
import { IUser } from "./UserModel";
@ObjectType({ description: "User Response" })
export default class UserResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => UserSchema)
  data: IUser | null;

  @Field(() => String)
  error: String | null;
}
