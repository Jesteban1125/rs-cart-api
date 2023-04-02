CREATE extension IF NOT EXISTS "uuid-ossp";
CREATE TYPE status_type AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE IF NOT EXISTS carts (
	id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id uuid NOT NULL,
	created_at date NOT NULL,
	updated_at date NOT NULL,
	status status_type
);

CREATE TABLE IF NOT EXISTS cart_items (
	product_id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	cart_id uuid,
	-- product_id uuid NOT NULL,
	count integer NOT NULL,
	FOREIGN KEY ("cart_id") REFERENCES carts(id)
);

INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
('b6f6ac25-7c72-41d2-9306-7f5a7a3a333f', '0d82bb6c-42d2-4082-a4bf-5b73b9a7b963', '2023-03-30', '2023-03-30', 'ORDERED'),
('5bd1891d-f492-4761-a52c-8b14057482fb', '5343728b-65ab-4c0b-a632-aac30873944e', '2023-03-27', '2023-03-27', 'OPEN'),
('23d114bc-0d23-4021-9ad0-e6267243b6b9', '367f9f83-118e-42af-b2d1-1fef6c83ab81', '2023-03-28', '2023-03-28', 'OPEN');

INSERT INTO cart_items (product_id, cart_id, count) VALUES
('26da8db2-89f4-44dc-9fd8-4a1b21d5ee6b', 'b6f6ac25-7c72-41d2-9306-7f5a7a3a333f', 3),
('940c1e52-5896-4bbe-a8ad-f0df617f6360', '5bd1891d-f492-4761-a52c-8b14057482fb', 4),
('aeadc60c-c678-4a00-83b0-d4ab2daa0d01', '23d114bc-0d23-4021-9ad0-e6267243b6b9', 7),
('ecdde689-4fa7-4469-8ad1-cda3d92fd3bc', '23d114bc-0d23-4021-9ad0-e6267243b6b9', 6);

-- --

-- INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
-- ('b6f6ac25-7c72-41d2-9306-7f5a7a3a333f', '0d82bb6c-42d2-4082-a4bf-5b73b9a7b963', '2023-03-30', '2023-03-30', 'ORDERED');

-- INSERT INTO cart_items (product_id, cart_id, count) VALUES
-- ('26da8db2-89f4-44dc-9fd8-4a1b21d5ee6b', 'b6f6ac25-7c72-41d2-9306-7f5a7a3a333f', 3);

-- --

-- SELECT * FROM carts;
-- SELECT * FROM cart_items;

-- SELECT * FROM cart_items JOIN carts ON carts.id = cart_items.cart_id;
