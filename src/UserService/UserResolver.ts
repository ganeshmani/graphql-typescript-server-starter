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
import { UserService } from "./UserService";

@Resolver((of) => UserSchema)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => UserSchema, { nullable: true })
  async userByID(
    @Arg("id") id: string,
    @Ctx() ctx: any
  ): Promise<IUser | null> {
    const user = await this.userService.getById(id);
    return user;
  }

  @Query((returns) => UserResponse)
  async loginUser(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: any
  ): Promise<UserResponse> {
    const user = await this.userService.getByEmail(email);

    if (user) {
      const response = await bcrypt.compare(password, user.password);

      if (!response) {
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

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: any
  ): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.insertUser({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      error: null,
      data: user,
    };
  }
}
