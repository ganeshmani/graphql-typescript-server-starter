import {
  Arg,
  FieldResolver,
  Query,
  Mutation,
  Resolver,
  Ctx,
  Root,
} from "type-graphql";
import UserSchema from "./UserSchema";
import UserResponse from "./UserResponse";
import { IUser, IUserResponse } from "./UserModel";
import * as bcrypt from "bcryptjs";

@Resolver((of) => UserSchema)
export class UserResolver {
  @Query(() => String)
  sample(): String {
    return "Hello";
  }

  @Query((returns) => UserSchema, { nullable: true })
  async userByID(@Arg("id") id: string, @Ctx() ctx: any): Promise<IUser> {
    const userCollection = await ctx.userModel.findOne({ _id: id });

    return userCollection;
  }

  @Query((returns) => UserResponse)
  async loginUser(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: any
  ): Promise<UserResponse> {
    const user = await ctx.userModel.findOne({
      email: email,
    });

    if (user) {
      const { err } = await bcrypt.compare(password, user.password);

      if (!!err) {
        return {
          success: false,
          error: "Invalid Credetials",
          data: null,
        };
      } else {
        return {
          success: true,
          error: null,
          data: user,
        };
      }
    } else {
      return {
        success: false,
        error: "User Not Found",
        data: null,
      };
    }
  }

  @Mutation(() => UserSchema)
  async registerUser(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: any
  ): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await new ctx.userModel({
      name,
      email,
      password: hashedPassword,
    });

    return user.save();
  }
}
