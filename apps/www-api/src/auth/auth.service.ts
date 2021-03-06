import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { SignInInput } from './sign-in.input';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignUpInput } from './sign-up.input';
import { User } from '../user/user.entity';
import { AuthTokenOutput } from './auth-token.output';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  me(username: string): Promise<User> {
    return this.userService.findOne(username);
  }

  signUp(signUpInput: SignUpInput): Promise<User> {
    return this.userService.signUp(signUpInput);
  }

  async signIn(signInInput: SignInInput): Promise<AuthTokenOutput> {
    const username = await this.userService.signIn(signInInput);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 토큰에 담을 데이터 구조. 맘대로 만들어도 되지만, 비번처럼 민감한 데이터는 넣으면 안 됨.
    const payload: JwtPayload = { username };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`);

    return { token };
  }

  findByIds(ids: number[]): Promise<User[]> {
    return this.userService.findByIds(ids);
  }
}
