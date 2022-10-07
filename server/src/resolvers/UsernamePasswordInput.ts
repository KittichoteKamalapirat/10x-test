import { Field, InputType } from "type-graphql";

@InputType({ description: "Argument for register user" })
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  isConsented: boolean;
}
