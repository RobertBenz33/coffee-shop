# Coffee Shop

The Customizable Coffee Shop — Technical Assessment

ระบบ Coffee Shop สำหรับเลือกเครื่องดื่ม กำหนดขนาด เพิ่ม Syrup / Topping และจัดการราคา รวมถึงดูประวัติการซื้อ

## Tech Stack

* Next.js
* React
* TypeScript
* PostgreSQL
* Prisma ORM
* Docker Compose
* Tailwind CSS
* shadcn/ui

## Requirements

ก่อนเริ่มต้น ต้องติดตั้ง:

* Node.js
* npm
* Docker Desktop

ตรวจสอบ version:

```bash
node -v
npm -v
docker -v
```

---

## 1. Clone Project

```bash
git clone <https://github.com/RobertBenz33/coffee-shop.git>
cd coffee-shop
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Setup Environment

สร้างไฟล์ `.env` ที่ root project:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coffee_shop"
```

> ตรวจสอบให้ตรงกับ PostgreSQL configuration ใน `docker-compose.yml`

---

## 4. Start PostgreSQL ด้วย Docker

Start PostgreSQL container:

```bash
npm run db:up
```

ตรวจสอบว่า container ทำงานอยู่:

```bash
docker compose ps
```

ควรเห็น PostgreSQL container อยู่ในสถานะ `running` หรือ `Up`

หากต้องการดู logs:

```bash
docker compose logs -f
```

---

## 5. Setup Prisma Database

หลังจาก PostgreSQL พร้อมแล้ว ให้สร้าง database schema ด้วย Prisma:

```bash
npm run prisma:setup
```

คำสั่งนี้จะทำ:

```text
Prisma Migration
      ↓
สร้าง Database Schema
      ↓
Generate Prisma Client
```

---

## 6. Seed Master Data

หลังจากสร้าง schema แล้ว ให้เพิ่มข้อมูลเริ่มต้น:

```bash
npm run prisma:seed
```

Seed จะสร้างข้อมูลตัวอย่าง เช่น

### Drinks

* Coffee
* Tea
* Milk

### Sizes

* Small
* Medium
* Large

### Syrups

* Vanilla
* Caramel
* Chocolate

### Toppings

* Whipped Cream
* Cinnamon
* Marshmallows

รวมถึงราคาเริ่มต้นของเครื่องดื่มแต่ละ Size

---

## 7. Run Development Server

หลังจาก Database และ Seed พร้อมแล้ว:

```bash
npm run dev
```

เปิดเว็บไซต์:

```text
http://localhost:3000
```

---

# Quick Start

หากเป็นการ Setup project ครั้งแรก สามารถทำตามลำดับนี้:

```bash
npm install

npm run db:up

npm run prisma:setup

npm run prisma:seed

npm run dev
```

จากนั้นเปิด:

```text
http://localhost:3000
```

---

# Reset Database

สำหรับ Development หากต้องการล้าง Database และสร้างใหม่:

```bash
npm run prisma:reset
```

คำสั่งนี้จะ:

```text
Delete existing database data
        ↓
Reset Prisma migrations
        ↓
Create database schema
        ↓
```

> หลัง Reset หากต้องการข้อมูลตัวอย่าง ให้รัน seed อีกครั้ง:

```bash
npm run prisma:seed
```

ดังนั้นแนะนำ:

```bash
npm run prisma:reset
npm run prisma:seed
```

---

# Database Commands

### Start PostgreSQL

```bash
npm run db:up
```

### Prisma Migration

```bash
npm run prisma:migrate
```

### Generate Prisma Client

```bash
npm run prisma:generate
```

### Seed Database

```bash
npm run prisma:seed
```

### Reset Database

```bash
npm run prisma:reset
```

---

# Application Features

## 1. Coffee Shop

เลือกเครื่องดื่ม:

* Coffee
* Tea
* Milk

เลือก Size:

* Small
* Medium
* Large

สามารถเพิ่ม Ingredients ได้หลายรายการ และสามารถเลือกซ้ำได้ เช่น:

```text
Vanilla × 2
Caramel × 1
```

---

## 2. กำหนดราคา

สามารถกำหนดราคาของ:

* Drink + Size
* Syrup
* Topping

ตัวอย่าง:

```text
Coffee
  Small   ฿40
  Medium  ฿50
  Large   ฿60
```

---

## 3. จัดการข้อมูล

สามารถจัดการ Master Data:

* Drinks
* Sizes
* Ingredients

รองรับการ:

* เพิ่มข้อมูล
* แก้ไขข้อมูล
* เปิด/ปิดการใช้งาน
* ลบข้อมูล

---

## 4. ประวัติการซื้อ

แสดงรายการ Order โดยเรียงจาก:

```text
ล่าสุด → เก่าสุด
```

สามารถกดดูรายละเอียดแต่ละ Order ได้ เช่น:

```text
Customer
Created Date
Drink
Size
Ingredients
Total Price
Payment Status
```

Order ที่สร้างสำเร็จจะถูกบันทึกเป็น:

```text
PAID
```

พร้อม `paidAt`

---

# Project Structure

```text
coffee-shop/
│
├── app/
│   ├── api/
│   │   ├── drinks/
│   │   ├── sizes/
│   │   ├── ingredients/
│   │   ├── pricing/
│   │   └── orders/
│   │
│   └── page.tsx
│
├── components/
│   ├── menu/
│   ├── pricing/
│   ├── management/
│   └── history/
│
├── lib/
│   └── prisma.ts
│
├── models/
│   ├── drink.ts
│   ├── size.ts
│   ├── ingredient.ts
│   └── order.ts
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   └── generated/
│       └── prisma/
│
├── docker-compose.yml
├── prisma.config.ts
├── package.json
├── tsconfig.json
└── .env
```

---

# Order Flow

```text
เลือกเมนู
    ↓
เลือก Drink
    ↓
เลือก Size
    ↓
เลือก Syrup / Topping
    ↓
สรุปรายการ
    ↓
กดชำระเงิน
    ↓
สร้าง Order
    ↓
PAID
    ↓
ชำระเงินสำเร็จ
    ↓
ประวัติการซื้อ
```

---

# API

## Drinks

```text
GET    /api/drinks
POST   /api/drinks
PATCH  /api/drinks/:id
DELETE /api/drinks/:id
```

## Sizes

```text
GET    /api/sizes
POST   /api/sizes
PATCH  /api/sizes/:id
DELETE /api/sizes/:id
```

## Ingredients

```text
GET    /api/ingredients
POST   /api/ingredients
PATCH  /api/ingredients/:id
DELETE /api/ingredients/:id
```

## Pricing

```text
GET    /api/pricing/drink-sizes
POST   /api/pricing/drink-sizes
PATCH  /api/pricing/drink-sizes/:id
```

## Orders

```text
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id
```

---

# Notes

โปรเจกต์นี้จัดทำขึ้นสำหรับ Technical Assessment โดยเน้นโครงสร้างที่เข้าใจง่ายและสามารถทดลองใช้งานได้ง่ายบน Local Environment

ข้อมูล Order จะเก็บ Snapshot ของชื่อสินค้า ขนาด Ingredient และราคา ณ เวลาที่สั่งซื้อ เพื่อให้ประวัติการซื้อไม่เปลี่ยนแปลงเมื่อ Master Data ถูกแก้ไขในภายหลัง
