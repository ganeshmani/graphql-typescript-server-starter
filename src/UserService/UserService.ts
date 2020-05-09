import { Service, Inject } from "typedi";
import { IUserModel, IUser } from "./UserModel";

@Service()
export class UserService {
  constructor(@Inject("USER") private readonly user: IUserModel) {}

  async getAll() {
    return this.user.find();
  }

  async getById(id: string): Promise<IUser | null> {
    return this.user.findOne({ _id: id });
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return this.user.findOne({ email }).exec();
  }

  async insertUser(userInfo: any): Promise<IUser> {
    const user = new this.user(userInfo);
    return user.save();
  }
}
