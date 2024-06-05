import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(...args) {
        return {
          secret: "12398120398130@2938109321@1029381093821@",
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