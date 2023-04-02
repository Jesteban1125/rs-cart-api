import { Injectable } from '@nestjs/common';
import { DbService } from './db.service';

import { Cart } from '../models';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  constructor(private _dbService: DbService) {}

  async findByUserId(userId: string): Promise<Cart> {
    const items = (await this._dbService.query(
      'SELECT * FROM cart_items JOIN carts ON carts.id = cart_items.cart_id WHERE carts.user_id=$1',
      [userId],
    )).rows;
    return items.length > 0 ? {
      id: items[0].id,
      items: items.map(item => ({
        product: {
          id: item.product_id,
          title: `Title for ${item.product_id}`,
          description: `Description for ${item.product_id}`,
          price: 10,
        },
        count: item.count,
      })),
    } : undefined;
  }

  async createByUserId(userId: string) {
    const today = new Date();

    const items = (await this._dbService.query(
      "INSERT INTO carts (user_id, created_at, updated_at, status) VALUES ($1, $2, $2, 'OPEN') RETURNING id",
      [userId, today],
    )).rows;
    return {
      id: items[0].id,
      items: [],
    };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [ ...items ],
    }

    this.userCarts[ userId ] = { ...updatedCart };

    const today = new Date();

    await this._dbService.query(
      'UPDATE carts SET updated_at = $1 WHERE id = $2;',
      [today, id],
    );

    for await (const item of items) {
      await this._dbService.query(
        'INSERT INTO cart_items (product_id, cart_id, count) VALUES ($1, $2, $3);',
        [item.product.id, id, item.count],
      )
    }

    return { ...updatedCart };
  }

  async removeByUserId(userId): Promise<void> {
    await this._dbService.query(
      'DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id=$1)',
      [userId],
    )
    await this._dbService.query(
      'DELETE FROM carts WHERE user_id=$1',
      [userId],
    )
  }
}
