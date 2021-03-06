import { Controller, Post, Body, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Res, } from '@nestjs/common';
import { SignInInput } from './sign-in.input';
import { AuthService } from './auth.service';
import { SignUpInput } from './sign-up.input';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './auth.decorator';
import { AuthTokenOutput } from './auth-token.output';
import { Response } from 'express';
import { getConfig } from '../config';


@Controller('api/auth')
// 아래 Intercepter는 User Entity를 반환하면 매핑된 필드들만 Response로 내려보내도록 해줌
// 상세한 매핑은 Entity 클래스 안의 Exclude, Expose Decorator로 확인
@UseInterceptors(ClassSerializerInterceptor)
export class ApiAuthController {
  constructor(
    private authService: AuthService
  ) { }

  @UseGuards(AuthGuard())
  @Get('/me')
  me(@GetUser() user: User): User {
    return user;
  }

  @Post('/signup')
  signUp(@Body() signUpInput: SignUpInput): Promise<User> {
    return this.authService.signUp(signUpInput);
  }

  // 아직 nest.js에서 쿠키를 직접 지원하지 않기 때문에
  // express response 객체를 이용하여 쿠키를 전송한다.
  // 이런 경우 return 구문을 사용하여 응답을 출력할 수 없기 때문에
  // res.send()를 사용해야 함
  @Post('/signin')
  async signIn(
    @Body() signInInput: SignInInput,
    @Res() res: Response,
  ) {
    const token = await this.authService.signIn(signInInput);
    // 쿠키에 토큰 설정
    res.cookie('token', token.token, { httpOnly: true, maxAge: getConfig().jwt.expiresIn * 1000, });
    res.send(token);
  }

  @Get('/signout')
  signOut(
    @Res() res: Response,
  ) {
    res.cookie('token', '', {httpOnly: true});
    res.send('bye');
  }

}