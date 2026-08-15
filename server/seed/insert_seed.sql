-- eshop seed INSERT (server/seed/*.json 기준)
-- 실측 SHOW TABLES: snake_case (product_option_items 등)
-- 실행 예: mysql -u USER -p eshop < server/seed/insert_seed.sql
-- 컬럼 에러 시 DESCRIBE product / product_image 결과로 맞춤

USE `eshop`;

START TRANSACTION;

-- 의존 역순 삭제 (시드 id 범위만)
DELETE FROM `product_option_items` WHERE `productid` BETWEEN 1 AND 4;
DELETE FROM `product_option` WHERE `productid` BETWEEN 1 AND 4;
DELETE FROM `product_image` WHERE `productId` BETWEEN 1 AND 4;
DELETE FROM `category_product` WHERE `productid` BETWEEN 1 AND 4 OR `categoryid` BETWEEN 1 AND 3;
DELETE FROM `product` WHERE `id` BETWEEN 1 AND 4;
DELETE FROM `category` WHERE `id` BETWEEN 1 AND 3;
DELETE FROM `menu` WHERE `id` BETWEEN 1 AND 9;

-- 1) category
INSERT INTO `category` (`id`, `title`, `type`, `link`, `sortno`, `useyn`) VALUES
  (1, '신상품', 'PRODUCT', '/category/1', 1, 'Y'),
  (2, '베스트', 'PRODUCT', '/category/2', 2, 'Y'),
  (3, '세일', 'PRODUCT', '/category/3', 3, 'Y');

-- 2) product
INSERT INTO `product` (`id`, `title`, `description`, `thumbnail`, `cost`, `capacity`, `optionCnt`, `showyn`, `editor`, `createdate`) VALUES
  (1, '오리지널 블렌드 원두 200g', '미디엄 로스트, 견과류·카카오 노트', '/public/img/seed/product-01.jpg', 18000, 50, 2, 'Y', '<p>가상 시드 상품입니다. 오리지널 블렌드 원두.</p>', NOW()),
  (2, '디카페인 콜드브루 1L', '저온 추출, 카페인 거의 없음', '/public/img/seed/product-02.jpg', 12000, 30, 1, 'Y', '<p>가상 시드 상품입니다. 디카페인 콜드브루.</p>', NOW()),
  (3, '핸드드립 드리퍼 세트', '세라믹 드리퍼 + 필터 40매', '/public/img/seed/product-03.jpg', 29000, 20, 2, 'Y', '<p>가상 시드 상품입니다. 핸드드립 세트.</p>', NOW()),
  (4, '시그니처 머그 350ml', '매트 마감, 전자레인지 가능', '/public/img/seed/product-04.jpg', 15000, 40, 0, 'Y', '<p>가상 시드 상품입니다. 시그니처 머그.</p>', NOW());

-- 3) category_product
INSERT INTO `category_product` (`categoryid`, `productid`, `sortno`, `showyn`, `createdate`) VALUES
  (1, 1, 1, 'Y', NOW()),
  (1, 2, 2, 'Y', NOW()),
  (1, 3, 3, 'Y', NOW()),
  (1, 4, 4, 'Y', NOW()),
  (2, 1, 1, 'Y', NOW()),
  (2, 2, 2, 'Y', NOW()),
  (3, 2, 1, 'Y', NOW()),
  (3, 4, 2, 'Y', NOW());

-- 4) product_image (엔티티 JoinColumn 미지정 → 흔히 productId; 없으면 product_id 로 변경)
INSERT INTO `product_image` (`id`, `path`, `sortno`, `productId`) VALUES
  (1, '/public/img/seed/product-01.jpg', 1, 1),
  (2, '/public/img/seed/product-01-2.jpg', 2, 1),
  (3, '/public/img/seed/product-02.jpg', 1, 2),
  (4, '/public/img/seed/product-03.jpg', 1, 3),
  (5, '/public/img/seed/product-04.jpg', 1, 4);

-- 5) product_option
INSERT INTO `product_option` (`optionid`, `optkey`, `optvals`, `productid`) VALUES
  (1, '분쇄도', '홀빈,에스프레소,드립', 1),
  (2, '세트', '단품,2병세트', 2),
  (3, '색상', '화이트,블랙', 3);

-- 6) product_option_items
INSERT INTO `product_option_items` (`itemid`, `productid`, `itemkey`, `itemval`, `price`, `capacity`, `useyn`, `optionid`) VALUES
  (1, 1, '분쇄도', '홀빈', 0, 20, 'Y', 1),
  (2, 1, '분쇄도', '에스프레소', 0, 15, 'Y', 1),
  (3, 1, '분쇄도', '드립', 0, 15, 'Y', 1),
  (4, 2, '세트', '단품', 0, 20, 'Y', 2),
  (5, 2, '세트', '2병세트', 3000, 10, 'Y', 2),
  (6, 3, '색상', '화이트', 0, 10, 'Y', 3),
  (7, 3, '색상', '블랙', 0, 10, 'Y', 3);

ALTER TABLE `category` AUTO_INCREMENT = 4;
ALTER TABLE `product` AUTO_INCREMENT = 5;
ALTER TABLE `product_image` AUTO_INCREMENT = 6;
ALTER TABLE `product_option` AUTO_INCREMENT = 4;
ALTER TABLE `product_option_items` AUTO_INCREMENT = 8;

-- 7) 관리자 사이드 메뉴 (DEFAULT_ADMIN_MENUS 와 항목을 맞출 것)
INSERT INTO `menu` (`id`, `title`, `url`, `useyn`, `sortno`, `createdate`) VALUES
  (1, 'menu.dashboard', '/admin/dashboard', 'Y', 1, NOW()),
  (2, 'menu.product', '/admin/product', 'Y', 2, NOW()),
  (3, 'menu.category', '/admin/category', 'Y', 3, NOW()),
  (4, 'menu.order', '/admin/order', 'Y', 4, NOW()),
  (5, 'menu.shipment', '/admin/shipment', 'Y', 5, NOW()),
  (6, 'menu.claim', '/admin/claim', 'Y', 6, NOW()),
  (7, 'menu.policy', '/admin/policy', 'Y', 7, NOW()),
  (8, 'menu.role', '/admin/role', 'Y', 8, NOW()),
  (9, 'menu.menu', '/admin/menu', 'Y', 9, NOW());
ALTER TABLE `menu` AUTO_INCREMENT = 10;

-- synchronize=false 환경이면 user_login.type 에 DEMO 추가 필요:
-- ALTER TABLE `user_login` MODIFY COLUMN `type` ENUM('GOOGLE','KAKAO','NAVER','DEMO') NOT NULL;
INSERT INTO `role` (`roleid`, `rolename`)
VALUES ('ADMIN', '관리자')
ON DUPLICATE KEY UPDATE `rolename` = VALUES(`rolename`);

-- 데모 유저 / 데모 관리자 (demoUserService DEMO_ACCOUNTS 와 동일)
DELETE FROM `user_role`
WHERE `userid` IN (SELECT `userid` FROM `user` WHERE `sabun` IN (9998001, 9998002));
DELETE FROM `user_login`
WHERE `ssoid` IN ('demo-user-eshop', 'demo-admin-eshop');
DELETE FROM `user` WHERE `sabun` IN (9998001, 9998002);

SET @demo_user_id = UUID();
SET @demo_admin_id = UUID();

INSERT INTO `user` (`userid`, `username`, `photo`, `phone`, `sabun`, `refresh_token`, `createdate`)
VALUES
  (@demo_user_id, '데모유저', '', NULL, 9998001, NULL, NOW(6)),
  (@demo_admin_id, '데모관리자', '', NULL, 9998002, NULL, NOW(6));

INSERT INTO `user_login` (`userid`, `ssoid`, `email`, `type`, `createdate`)
VALUES
  (@demo_user_id, 'demo-user-eshop', 'demo-user@eshop.local', 'DEMO', NOW(6)),
  (@demo_admin_id, 'demo-admin-eshop', 'demo-admin@eshop.local', 'DEMO', NOW(6));

INSERT INTO `user_role` (`userid`, `roleid`)
VALUES (@demo_admin_id, 'ADMIN');

COMMIT;
