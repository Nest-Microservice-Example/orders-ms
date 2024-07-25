import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigEnum, NATS_SERVICE } from '../../config';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const natsProvider = ClientsModule.registerAsync([
  {
    name: NATS_SERVICE,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const NATS_SERVERS = configService.get<string>(ConfigEnum.NATS);

      return {
        transport: Transport.NATS,
        options: {
          servers: NATS_SERVERS,
        },
      };
    },
  },
]);
