import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [GameGateway, GameService],
})
export class GameModule {}