import { MaxLength, Length, ArrayMaxSize, Min, Max } from "class-validator";
import { ArgsType, Field, InputType, Int } from "type-graphql";

@InputType()
export class UserInput {
  @MaxLength(30)
  @Field()
  firstName: string

  @MaxLength(30)
  @Field()
  lastName: string

  @MaxLength(3)
  @Field()
  age: number
}

@InputType()
export class UpdateUserInput extends UserInput {
  @MaxLength(30)
  @Field()
  id: number
}

@ArgsType()
export class UserArgs {
  @Field(type => Int)
  @Min(0)
  skip: number = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take: number = 25;
}