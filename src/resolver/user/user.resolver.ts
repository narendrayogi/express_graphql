import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../../entity";
import { AppDataSource } from "../../data-source";
import { UserInput } from "./user.dto";

@Resolver(User)
export class UserResolver {

  @Query(() => [User], { description: "Get all user" })
  async users(
    @Arg("id") id: number,
    @Arg("withDeleted") withDeleted: boolean,
  ): Promise<User[]> {
    return AppDataSource.manager.find(User, {
      where: {
        id,
      },
      withDeleted: withDeleted ? withDeleted : false,
    });
  }

  @Mutation(() => User)
  addUser(
    @Arg("newUser") newUserData: UserInput,
  ): Promise<User> {
    return AppDataSource.manager.save(User, newUserData);
  }

  @Mutation(() => User)
  updateUser(
    @Arg("id") id: number,
    @Arg("updateUser") updateUserData: UserInput,
  ): Promise<User> {
    return AppDataSource.manager.save(User, { id, ...updateUserData });
  }

  @Mutation(() => Boolean)
  async removeRecipe(@Arg("id") id: string) {
    try {
      await AppDataSource.manager.softDelete(User, id);
      return true;
    } catch (err) {
      console.error({ err })
      return false;
    }
  }
}