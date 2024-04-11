import { Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    const login =
      loginDto.email === process.env.AUTH_USER && loginDto.password === process.env.AUTH_PASSWORD;

    return {
      login,
    };
  }
}
