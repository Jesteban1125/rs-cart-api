import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { DbService } from './services/db.service';


@Module({
  imports: [ OrderModule ],
  providers: [ CartService, DbService ],
  controllers: [ CartController ]
})
export class CartModule {}
