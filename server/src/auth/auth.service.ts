import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    }

    const user = await this.usersService.create(registerDto);
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    const { password, refresh_token, ...result } = user;
    return {
      user: result,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('ไม่พบอีเมลนี้ในระบบ');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    const { password, refresh_token, ...result } = user;
    return {
      user: result,
      ...tokens,
    };
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    // Verify the refresh token's signature & expiry, then trust its `sub` (not a client-supplied userId)
    let payload: { sub: number };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Access Denied');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Access Denied');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refresh_token || '');
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: (this.configService.get<string>('JWT_EXPIRATION') || '1d') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: (this.configService.get<string>('REFRESH_TOKEN_EXPIRATION') || '7d') as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
