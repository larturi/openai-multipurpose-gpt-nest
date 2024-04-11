import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const isValidLogin =
      loginDto.email === process.env.AUTH_USER && loginDto.password === process.env.AUTH_PASSWORD;

    if (!isValidLogin) {
      return { login: false };
    }

    const payload = { email: loginDto.email, sub: loginDto.email };
    const token = this.jwtService.sign(payload);

    return {
      login: true,
      access_token: token,
    };
  }
}
