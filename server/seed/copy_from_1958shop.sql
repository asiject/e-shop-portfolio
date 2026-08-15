-- 1958shop → eshop 카탈로그/관리 데이터 복사 + 데모 계정 생성
-- 스키마가 동일한 같은 인스턴스에서 실행할 것
-- 데모 계정은 demoUserService DEMO_ACCOUNTS 와 동일 (원본 user 테이블은 복사하지 않음)
-- 제외: 원본 user* / cart / orders* / file_* / *_policy
-- 실행 예: mysql -u USER -p < server/seed/copy_from_1958shop.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- 대상이 비어 있지 않아도 재실행 가능하도록 의존 역순 삭제
DELETE FROM `eshop`.`user_role`
WHERE `userid` IN (SELECT `userid` FROM `eshop`.`user` WHERE `sabun` IN (9998001, 9998002));
DELETE FROM `eshop`.`user_login`
WHERE `ssoid` IN ('demo-user-eshop', 'demo-admin-eshop');
DELETE FROM `eshop`.`user` WHERE `sabun` IN (9998001, 9998002);

DELETE FROM `eshop`.`product_option_items`;
DELETE FROM `eshop`.`product_option`;
DELETE FROM `eshop`.`product_image`;
DELETE FROM `eshop`.`category_product`;
DELETE FROM `eshop`.`product`;
DELETE FROM `eshop`.`category`;
DELETE FROM `eshop`.`menu`;
DELETE FROM `eshop`.`role`;

INSERT INTO `eshop`.`category` (`id`, `title`, `type`, `link`, `sortno`, `useyn`)
SELECT `id`, `title`, `type`, `link`, `sortno`, `useyn`
FROM `1958shop`.`category`;

INSERT INTO `eshop`.`product` (`id`, `title`, `description`, `thumbnail`, `cost`, `capacity`, `optionCnt`, `showyn`, `editor`, `createdate`)
SELECT `id`, `title`, `description`, `thumbnail`, `cost`, `capacity`, `optionCnt`, `showyn`, `editor`, `createdate`
FROM `1958shop`.`product`;

INSERT INTO `eshop`.`category_product` (`categoryid`, `productid`, `sortno`, `showyn`, `createdate`)
SELECT `categoryid`, `productid`, `sortno`, `showyn`, `createdate`
FROM `1958shop`.`category_product`;

INSERT INTO `eshop`.`product_image` (`id`, `path`, `sortno`, `productId`)
SELECT `id`, `path`, `sortno`, `productId`
FROM `1958shop`.`product_image`;

INSERT INTO `eshop`.`product_option` (`optionid`, `optkey`, `optvals`, `productid`)
SELECT `optionid`, `optkey`, `optvals`, `productid`
FROM `1958shop`.`product_option`;

INSERT INTO `eshop`.`product_option_items` (`itemid`, `productid`, `itemkey`, `itemval`, `price`, `capacity`, `useyn`, `optionid`)
SELECT `itemid`, `productid`, `itemkey`, `itemval`, `price`, `capacity`, `useyn`, `optionid`
FROM `1958shop`.`product_option_items`;

INSERT INTO `eshop`.`menu` (`id`, `title`, `url`, `useyn`, `sortno`, `createdate`)
SELECT `id`, `title`, `url`, `useyn`, `sortno`, `createdate`
FROM `1958shop`.`menu`;

INSERT INTO `eshop`.`role` (`roleid`, `rolename`)
SELECT `roleid`, `rolename`
FROM `1958shop`.`role`;

INSERT INTO `eshop`.`role` (`roleid`, `rolename`)
VALUES ('ADMIN', '관리자')
ON DUPLICATE KEY UPDATE `rolename` = VALUES(`rolename`);

-- 데모 유저 / 데모 관리자 (POST /auth/demo 와 동일 식별자)
SET @demo_user_id = UUID();
SET @demo_admin_id = UUID();

INSERT INTO `eshop`.`user` (`userid`, `username`, `photo`, `phone`, `sabun`, `refresh_token`, `createdate`)
VALUES
  (@demo_user_id, '데모유저', '', NULL, 9998001, NULL, NOW(6)),
  (@demo_admin_id, '데모관리자', '', NULL, 9998002, NULL, NOW(6));

INSERT INTO `eshop`.`user_login` (`userid`, `ssoid`, `email`, `type`, `createdate`)
VALUES
  (@demo_user_id, 'demo-user-eshop', 'demo-user@eshop.local', 'DEMO', NOW(6)),
  (@demo_admin_id, 'demo-admin-eshop', 'demo-admin@eshop.local', 'DEMO', NOW(6));

INSERT INTO `eshop`.`user_role` (`userid`, `roleid`)
VALUES (@demo_admin_id, 'ADMIN');

-- PK를 명시 INSERT 했으므로 AUTO_INCREMENT를 원본 MAX+1 로 맞춤
SET @ai = (SELECT IFNULL(MAX(`id`), 0) + 1 FROM `eshop`.`category`);
SET @sql = CONCAT('ALTER TABLE `eshop`.`category` AUTO_INCREMENT = ', @ai);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @ai = (SELECT IFNULL(MAX(`id`), 0) + 1 FROM `eshop`.`product`);
SET @sql = CONCAT('ALTER TABLE `eshop`.`product` AUTO_INCREMENT = ', @ai);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @ai = (SELECT IFNULL(MAX(`id`), 0) + 1 FROM `eshop`.`product_image`);
SET @sql = CONCAT('ALTER TABLE `eshop`.`product_image` AUTO_INCREMENT = ', @ai);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @ai = (SELECT IFNULL(MAX(`optionid`), 0) + 1 FROM `eshop`.`product_option`);
SET @sql = CONCAT('ALTER TABLE `eshop`.`product_option` AUTO_INCREMENT = ', @ai);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @ai = (SELECT IFNULL(MAX(`itemid`), 0) + 1 FROM `eshop`.`product_option_items`);
SET @sql = CONCAT('ALTER TABLE `eshop`.`product_option_items` AUTO_INCREMENT = ', @ai);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @ai = (SELECT IFNULL(MAX(`id`), 0) + 1 FROM `eshop`.`menu`);
SET @sql = CONCAT('ALTER TABLE `eshop`.`menu` AUTO_INCREMENT = ', @ai);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

-- 검증
SELECT 'category' AS tbl, COUNT(*) AS eshop_cnt FROM `eshop`.`category`
UNION ALL SELECT 'product', COUNT(*) FROM `eshop`.`product`
UNION ALL SELECT 'category_product', COUNT(*) FROM `eshop`.`category_product`
UNION ALL SELECT 'product_image', COUNT(*) FROM `eshop`.`product_image`
UNION ALL SELECT 'product_option', COUNT(*) FROM `eshop`.`product_option`
UNION ALL SELECT 'product_option_items', COUNT(*) FROM `eshop`.`product_option_items`
UNION ALL SELECT 'menu', COUNT(*) FROM `eshop`.`menu`
UNION ALL SELECT 'role', COUNT(*) FROM `eshop`.`role`
UNION ALL SELECT 'user', COUNT(*) FROM `eshop`.`user`
UNION ALL SELECT 'user_login', COUNT(*) FROM `eshop`.`user_login`
UNION ALL SELECT 'user_role', COUNT(*) FROM `eshop`.`user_role`;

SELECT `username`, `sabun` FROM `eshop`.`user` ORDER BY `sabun`;
SELECT `ssoid`, `email`, `type` FROM `eshop`.`user_login` ORDER BY `ssoid`;
