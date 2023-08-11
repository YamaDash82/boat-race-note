import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log(`シークレットキー:${process.env.JWT_SECRET}`);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: true, 
      secretOrKey: process.env.JWT_SECRET, 
    });
  }

  async validate(payload: any) {
    return { username: payload.username, userKey: payload.userKey };
  }
}
