import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UserPayload } from "declarations/models/users.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: true, 
      secretOrKey: process.env.JWT_SECRET, 
    });
  }

  async validate(payload: any) {
    /**
     * payloadの内容
     * {
     *   user: { key: string, last_login_at: number, registered_at: number };
     *   iat: number; 
     *   exp: number;
     * }
     * 上記からユーザー場を抽出する。
     */
    const { user } = payload;
    
    //このメソッドの戻り値がExpressRequest#userに格納される。  
    //この内容がフロントに返されるわけではない。
    //※テストでreq.userの内容を明示的に返却している場合を除く。
    /**
     * {
     *   key: string, 
     *   last_login_at: number;
     *   registerd_at: number; 
     * }
     * 上記の形式でExpressRequest.userに格納する。
     */
    return user;
  }
}
