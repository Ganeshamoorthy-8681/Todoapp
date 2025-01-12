import { UserProviderEnum } from "../../enum/user-provider.model";

export interface UserModel {
  id: number;

  username: string;

  email: string;

  provider: UserProviderEnum;

  createdOn: number;

  updatedOn: number;
}
