import { ServiceAccount } from "firebase-admin";

export default interface IConfig {
  sportsfeed?: {
    login?: string;
    password?: string;
    output?: string;
  };
  firebase?: ServiceAccount;
};
