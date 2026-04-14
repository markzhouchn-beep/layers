# Layers 网站文案清单 / Copy Brief

---

## 一、页面结构决策

**问题：消费者首页 vs 创作者首页是否分开？**

建议：**入口统一 → 选择身份 → 分别主页**

```
/                   → 统一入口页（选择身份：买家 or 创作者）
/shop               → 消费者商店（浏览、搜索、购物车）
/creator            → 创作者后台（需登录）
/join               → 创作者注册
```

---

## 二、消费者端（Sales / Shop）

### 2.1 统一入口页 `/`
**当前状态：Shop Now 直接进 StorefrontHome**

**文案：**

```
头部：
- Logo: Layers
- 导航: Shop | For Artists | Language | Start Creating

Hero 区块：
- Eyebrow: Original Art · Global Print
- 标题: Chinese Art, World Audience.
- 副标题: Independent Chinese artists selling original designs on premium print products.
  Printed on-demand. Shipped worldwide from US, EU or Australia.
- CTA1: Browse Artworks → /shop
- CTA2: I'm an Artist → /join

分类横条：
All / T-Shirts / Posters / Canvas / Mugs / Tote Bags

Featured Artworks 标题：Featured Artworks

How it Works（三列）：
01 Choose a design — Browse original artworks from Chinese independent creators
02 Pick your product — T-shirt, mug, poster, canvas — all printed on-demand
03 Order securely — Stripe checkout. Printed locally and shipped worldwide

For Artists CTA：
- eyebrow: For Artists
- 标题: Turn your art into a global income stream
- 副标题: Subscribe in CNY. Earn in USD. Layers handles printing, shipping, 
  and customer service — you focus on creating.
- CTA1: Start for free → /join
- CTA2: Creator Login → /login
- 底部说明: ¥0 to start · 30%–45% royalty · Global reach
```

### 2.2 消费者商店 `/shop`
**需要新增功能：搜索、分类筛选、购物车**

**文案：**

```
页面标题：Shop Artworks

搜索栏 placeholder: Search artworks, artists...

筛选栏：
All / T-Shirts / Posters / Canvas / Mugs / Tote Bags / Phone Cases

排序：
Sort by: Featured / Newest / Price: Low to High / Price: High to Low

商品卡片：
- 图片（mockup）
- 作品名
- 艺术家名
- 价格 $XX

加载更多按钮：Load more artworks
空状态：No artworks found. Be the first to add one!
```

### 2.3 商品详情 `/shop/artwork/:id`
**已有，需要补充物流信息**

**文案：**

```
面包屑：← Back to shop

标题：[作品名]
艺术家：by [艺术家名]

价格：$[价格]

产品选择器：
Choose product
[产品选项按钮列表，包括名称和价格]

购买按钮：Buy Now — $[价格]
安全说明：Secure checkout via Stripe · Worldwide shipping 7–14 days

标签：#[标签1] #[标签2]

物流说明区块：
🌍 Worldwide Shipping
All orders are printed and shipped from our production partners 
in the US, EU, or Australia — whichever is closest to your delivery address.
- Production time: 5-7 business days
- Shipping time: 7-14 business days
- Tracking number provided after shipment

退款政策：
🔄 Money-Back Guarantee
If your order arrives damaged or doesn't meet quality standards, 
contact us for a free replacement or full refund.
```

### 2.4 购物车 `/shop/cart`
**新增功能**

**文案：**

```
页面标题：Your Cart

购物车为空时：
🛒 Your cart is empty
Start shopping and find something you love.
[Browse Artworks →]

有商品时：
[商品缩略图] [作品名 by 艺术家名] [选择产品] [价格] [删除按钮]
[继续选购] [结算按钮]

结算按钮：Checkout — $[总价]
```

### 2.5 消费者登录 `/login`
**新增功能（目前没有）**

**文案：**

```
页面标题：Sign in to your account

表单：
Email: [输入框]
Password: [输入框] [Forgot password?]

登录按钮：Sign in

没有账户：
Don't have an account? [Sign up →]

社交登录（可选）：
Or continue with [Google] [Apple]
```

### 2.6 消费者注册 `/register`
**新增功能**

**文案：**

```
页面标题：Create your account

表单：
Display name: [输入框]
Email: [输入框]
Password: [输入框]
Confirm password: [输入框]

注册按钮：Create account

已有账户：
Already have an account? [Sign in →]
```

### 2.7 订单历史 `/shop/orders`
**新增功能**

**文案：**

```
页面标题：Your Orders

无订单时：
📦 No orders yet
Once you make a purchase, your orders will appear here.
[Start Shopping →]

有订单时：
[订单卡片]
Order #[订单号] · [日期]
[作品缩略图] [作品名] × [数量]
Status: [Processing / Shipped / Delivered]
[查看详情] [查看物流]
```

### 2.8 订单详情 `/shop/orders/:id`
**新增功能**

**文案：**

```
订单号 #[订单号]
下单日期：[日期]

商品列表：
[缩略图] [作品名 by 艺术家名]
Product: [产品类型]
Quantity: [数量]
Price: $[价格]

物流信息：
Tracking: [快递单号]
Carrier: [DHL / USPS / etc.]
Status: [In Transit / Delivered]
[Track Package →]

总计：
Subtotal: $[小计]
Shipping: $[运费]
Total: $[总价]
```

---

## 三、创作者端（Creator）

### 3.1 创作者注册 `/join`
**已有，需要审核状态文案**

**步骤1 — 选择方案：**
```
页面标题：Choose your plan
副标题：All plans include access to the creator dashboard and unlimited artwork uploads (plan limits apply).

Free 方案：
¥0 / year
8% royalty
Up to 3 artworks
Basic support
[Select Free]

Basic 方案：
¥299 / year
30% royalty
Up to 20 artworks
Priority support
[Select Basic] ← 推荐标签

Pro 方案：
¥599 / year
45% royalty
Unlimited artworks
Priority support
[Select Pro]
```

**步骤2 — 账户信息：**
```
Username: [placeholder: your_artist_name]
Email: [placeholder: artist@example.com]
Password: [placeholder: At least 8 characters]
Artist / Studio name: [placeholder: 陈小明工作室]
```

**步骤3（订阅后）：**
```
🎉 Welcome to Layers, [艺术家名]!
Your account is ready. [Go to Creator Dashboard →]
```

### 3.2 创作者登录 `/login`
**已有，路由需修复**

### 3.3 创作者概览 `/creator`
**已有，文案已更新 Notion 风格**

### 3.4 我的作品 `/creator/artworks`
**修复：上传后按钮消失 + 审核状态不显示**

**当前问题：**
1. 上传过作品后上传按钮消失
2. 上传后看不到审核状态
3. MockupGenerator 没有产品预览效果

**文案：**

```
页面标题：My Artworks

Tab 横条：
全部 (N) | 待审核 (N) | 已通过 (N) | 已拒绝 (N)

右侧按钮：
[上传作品] ← 必须始终显示

上传 Modal（3步）：
步骤1 — 填写信息：
- 作品标题 *
- 描述（选填）
[下一步：设计 →]

步骤2 — 设计预览图：
- MockupGenerator（需要显示 T恤/马克杯/画框等产品模板）
- 已保存提示：✓ 预览图已保存 · 产品：T-Shirt
[← 上一步] [确认发布作品]

步骤3 — 提交确认：
（合并到步骤2按钮处理）

作品卡片：
[缩略图]
[作品名]
状态标签：
  - 待审核：badge-orange "Pending Review"
  - 已通过：badge-green "Approved"
  - 已拒绝：badge-red "Rejected" + [查看拒绝原因]
浏览次数：N views
```

### 3.5 订阅方案 `/creator/subscription`
**修复：免费用户显示基础版，升级按钮不能点**

**文案：**

```
页面标题：Subscription Plan

当前方案：[Free / Basic / Pro] ✓
到期时间：[日期]
[管理订阅]

方案对比表：
功能              Free      Basic     Pro
年费              ¥0        ¥299      ¥599
版税              8%        30%       45%
作品数量上限      3         20        无限制
支持              Basic     Priority  Priority

[立即升级到 Pro →]  ← Free 用户点这个跳支付
[降级到 Free]       ← Basic 用户可见
```

### 3.6 外部平台 `/creator/external`
**说明：目前是假数据，需要真实对接**

**实际对接需求：**
- Gumroad：艺术家在 Gumroad 创建产品，API Key 填入
- Etsy：艺术家在 Etsy 创建店铺，OAuth 接入
- Amazon Merch on Demand：需要申请资格

**当前文案（待改）：**
```
外部平台绑定
Connect your existing accounts to sync orders automatically.

[Gumroad]
状态：[未连接 ✓ 可连接] [连接 Gumroad →]
说明：Sync Gumroad sales as orders in your Layers dashboard.

[Etsy]
状态：[未连接] [申请 Etsy 资格 →]
说明：Connect your Etsy shop to import orders automatically.

[Amazon Merch]
状态：[不可用] [了解更多 →]
说明：Available for Pro creators with approved Amazon account.
```

### 3.7 设置 `/creator/settings`
**修复：目前点不进去**

**文案：**
```
页面标题：Account Settings

个人资料：
Display name: [输入框]
Artist / Studio name: [输入框]
Bio: [文本框]
Avatar: [上传头像]

联系方式：
Email: [邮箱]（不可更改）
[保存更改]

更改密码：
Current password: [输入框]
New password: [输入框]
Confirm new password: [输入框]
[更新密码]

危险区域：
Delete account [危险按钮]
```

---

## 四、Admin 后台

### 4.1 隐藏 Admin 导航
- 从 Navbar 移除 Admin 链接
- Admin 只能通过 `/admin` URL 访问
- 访问时检查 JWT role = 'admin'，否则跳转到 creator 或 login

### 4.2 Admin 创作者管理 `/admin/creators`
**新增功能**

**文案：**
```
页面标题：Creator Management

搜索栏：Search creators by name or email...
状态筛选：All / Active / Suspended

创作者列表：
[头像] [用户名] [艺术家名] [邮箱] [方案] [注册时间] [作品数] [操作]
```

---

## 五、法律页面（需要单独路由）

### 5.1 关于我们 `/about`
```
页面标题：About Layers

[待补充]
```

### 5.2 常见问题 `/faq`
```
页面标题：Frequently Asked Questions

[待补充]

建议包括：
- 如何注册成为创作者？
- 版税如何计算和支付？
- 作品审核标准是什么？
- 退货和退款政策
- 运费和配送时间
- 如何联系客服
```

### 5.3 版税说明 `/royalties`
```
页面标题：Royalty Program

[待补充]

建议包括：
- 各方案版税比例
- 何时可以提现
- 最低提现额度
- 支付方式（PayPal / 银行转账）
- 佣金结构说明
```

### 5.4 隐私政策 `/privacy`
```
页面标题：Privacy Policy

[待补充]
```

### 5.5 服务条款 `/terms`
```
页面标题：Terms of Service

[待补充]
```

### 5.6 联系合作 `/contact`
```
页面标题：Contact Us

[待补充]
```

---

## 六、Footer 文案（固定）

```
Shop: All Artworks / T-Shirts / Posters / Canvas / Mugs
Artists: Join as Creator / Creator Dashboard / Royalties / FAQ
Company: About / Contact / Privacy / Terms
底部: © 2026 Layers. Built for artists. Powered by Printify. | layershop.store
```

---

## 七、错误提示文案（需要整理）

```
登录：
- 邮箱或密码错误
- 该邮箱尚未注册
- 登录已过期，请重新登录

注册：
- 该邮箱已被注册
- 用户名已被占用
- 密码至少需要8个字符

上传：
- 请填写作品标题
- 请先生成预览图
- 文件上传失败，请重试
- 作品数量已达上限，请升级方案

购买：
- 支付失败，请重试
- 商品库存不足
- 订单创建失败
```

---

## 八、需要新增的页面清单

| 路由 | 页面 | 优先级 |
|------|------|--------|
| `/shop` | 消费者商店（搜索+筛选） | P0 |
| `/login` | 消费者登录 | P0 |
| `/register` | 消费者注册 | P0 |
| `/shop/cart` | 购物车 | P0 |
| `/shop/orders` | 订单列表 | P1 |
| `/shop/orders/:id` | 订单详情+物流 | P1 |
| `/creator/settings` | 设置页 | P0 |
| `/creator/external` | 外部平台（真实对接） | P2 |
| `/admin/creators` | Admin 创作者管理 | P1 |
| `/about` | 关于我们 | P2 |
| `/faq` | 常见问题 | P2 |
| `/royalties` | 版税说明 | P2 |
| `/contact` | 联系合作 | P2 |
| `/privacy` | 隐私政策 | P1 |
| `/terms` | 服务条款 | P1 |
