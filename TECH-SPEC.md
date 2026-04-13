# Layers 技术规格文档

> 版本：1.0 | 日期：2026-04-14 | 状态：待开发

---

## 1. 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + TypeScript + TailwindCSS + Vite |
| 后端 | Express.js + Node.js 22 |
| 数据库 | PostgreSQL 15 + pg (原生) |
| 文件存储 | 阿里云 OSS |
| 支付 | Stripe Connect (Express Account) |
| 生产印刷 | Printify API |
| 进程管理 | PM2 |
| 服务器 | 阿里云轻量 39.106.162.16 |

---

## 2. 数据库设计

### 表结构

**users**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | |
| username | VARCHAR(50) UNIQUE | |
| email | VARCHAR(255) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt |
| artist_name | VARCHAR(100) | |
| avatar | VARCHAR(500) | OSS URL |
| role | VARCHAR(20) | 'artist' / 'admin' |
| plan | VARCHAR(20) | 'free' / 'basic' / 'pro' |
| subscription_status | VARCHAR(20) | |
| stripe_account_id | VARCHAR(255) | Stripe Connect ID |
| created_at | TIMESTAMP | |

**artworks**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | |
| user_id | INT FK | → users.id |
| title | VARCHAR(200) | |
| description | TEXT | |
| image_url | VARCHAR(500) | OSS URL |
| status | VARCHAR(20) | 'pending' / 'approved' / 'rejected' |
| tags | JSONB | |
| rejection_reason | TEXT | |
| printify_product_id | VARCHAR(100) | |
| printify_image_id | VARCHAR(100) | |
| created_at | TIMESTAMP | |

**subscriptions** / **orders** / **order_items** / **earnings** 表结构待补充。

---

## 3. API 路由

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 注册 | 否 |
| POST | /api/auth/login | 登录 | 否 |
| GET | /api/auth/me | 当前用户 | JWT |
| GET | /api/artworks | 我的作品列表 | JWT |
| POST | /api/artworks | 上传作品 | JWT |
| GET | /api/printify/blueprints | 产品模板 | 否 |
| POST | /api/stripe/connect | 开始 Connect | JWT |
| POST | /api/stripe/checkout | 创建结算 | JWT |
| POST | /api/stripe/webhook | 回调 | Signature |
| GET | /api/admin/artworks | 全部作品 | Admin |
| POST | /api/admin/artworks/:id/approve | 批准 | Admin |
| POST | /api/admin/artworks/:id/reject | 拒绝 | Admin |

---

## 4. Printify 集成

### Curated 12款产品模板
| ID | 名称 |
|----|------|
| 1 | Classic T-Shirt |
| 2 | Premium T-Shirt |
| 6 | Canvas Print |
| 26 | Poster |
| 10 | Mug |
| 16 | Pillow |
| 21 | Tote Bag |
| 14 | Hoodie |
| 38 | Long Sleeve |
| 27 | Phone Case |
| 71 | Tapestry |
| 9 | Apron |

### 同步流程
```
艺术家上传 → 管理员批准 → 上传图片到 Printify
→ 创建产品 → 发布到店铺 → 更新数据库
```

---

## 5. Stripe Connect

- 类型：Express Account
- 平台抽成：15%
- 版税：通过 Stripe 自动分账给艺术家

### Webhook 事件
- `checkout.session.completed` → 创建订单
- `account.updated` → 更新艺术家验证状态

---

## 6. 环境变量

```bash
# JWT
JWT_SECRET=<256位随机字符串>

# 数据库
DATABASE_URL=postgresql://layers:Layers2026@localhost:5432/layers

# Printify
PRINTIFY_SHOP_ID=27136321
PRINTIFY_API_TOKEN=<token>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OSS
OSS_ACCESS_KEY_ID=...
OSS_ACCESS_KEY_SECRET=...
OSS_BUCKET=layers-artworks
OSS_ENDPOINT=https://oss-cn-shanghai.aliyuncs.com
```

---

## 7. 部署架构

```
用户 → Cloudflare → 阿里云 Nginx (443)
                        ↓ /api
                   Node.js PM2 :3000
                        ↓
              PostgreSQL :5432  ←→  Printify API
```

---

## 8. 目录结构（目标）

```
layers/
├── client/              # 前端 React
│   └── src/
├── server/              # 后端 Express
│   └── src/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       └── db/
├── docs/                # 文档
│   ├── PRD.md
│   ├── TECH-SPEC.md
│   └── API.md
└── agents/              # 多Agent工作区
```
