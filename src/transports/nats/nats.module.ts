import { Module } from '@nestjs/common';
import { natsProvider } from './nats.provider';

@Module({
  imports: [natsProvider],
  exports: [natsProvider],
})
export class NatsModule {}
