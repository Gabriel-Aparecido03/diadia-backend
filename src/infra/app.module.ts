import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CryptographyModule } from './cryptography/cryptography.module';
import { HttpModule } from './http/http.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [HttpModule,DatabaseModule,CryptographyModule,AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
