import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../user/user.entity';
import { getConfig } from '../config';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    // private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getConfig().jwt.secret,
    });
  }

  // 액세스토큰을 디코딩하여 얻은 payload (username)를 이용하여 user 객체를 찾아 반환
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userService.findOne(username); //, { loadEagerRelations: false });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}