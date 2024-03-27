import { Token } from "@auth/entites";

export type AuthTokens = {
    accessToken: string;
    refreshToken: Token
}