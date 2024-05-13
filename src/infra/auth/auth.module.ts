import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(...args) {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1 day' },
        }
      },
    }),
  ],
  providers: [
    JwtService,
  ]
})
export class AuthModule {}