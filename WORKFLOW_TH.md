# Workflow ระบบ Offline Back-End

## ภาพรวมระบบ
ระบบ Back-End สำหรับแอปพลิเคชัน Offline ใช้ NestJS Framework กับฐานข้อมูล Prisma + MSSQL

## สถาปัตยกรรมระบบ

### 1. โครงสร้างโปรเจค
```
src/
├── app.module.ts          # Module หลักของระบบ
├── main.ts               # จุดเริ่มต้นการทำงาน
├── tasks/                # จัดการ Task และ Sync
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── dto/              # Data Transfer Objects
├── sync/                 # จัดการการ Sync ข้อมูล
├── prisma/               # การเชื่อมต่อฐานข้อมูล
└── app.controller.ts    # Controller หลัก
```

### 2. การทำงานของระบบ

#### 2.1 การจัดการ Task (Tasks)
- **สร้าง Task**: `POST /tasks`
  - รับข้อมูลจาก Client
  - กำหนด clientId และ lastSyncAt
  - บันทึกลงฐานข้อมูล

- **แก้ไข Task**: `PUT /tasks/:id`
  - ตรวจสอบ Version Conflict
  - อัพเดทข้อมูลและเพิ่ม Version
  - อัพเดท lastSyncAt

- **ลบ Task**: `DELETE /tasks/:id`
  - Soft Delete (ไม่ลบจริง)
  - กำหนด deletedAt และเพิ่ม Version

- **ดู Task**: `GET /tasks` และ `GET /tasks/:id`
  - กรองตาม clientId ถ้ามี
  - ไม่แสดงที่ถูกลบ (deletedAt ไม่เป็น null)

#### 2.2 การ Sync ข้อมูล
- **Sync Endpoint**: `POST /tasks/sync`
  - รับข้อมูลการเปลี่ยนแปลงจาก Client
  - ประมวลผลการสร้าง/แก้ไข/ลบ
  - ส่งข้อมูลที่เปลี่ยนแปลงจาก Server กลับไป

### 3. ขั้นตอนการทำงาน

#### 3.1 การเริ่มต้นระบบ
1. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm run start:dev
   ```

#### 3.2 การ Sync ข้อมูล
1. **Client ส่ง Request** พร้อมข้อมูล:
   - clientId: รหัสประจำเครื่อง
   - lastSyncAt: เวลา sync ครั้งล่าสุด
   - changes: ข้อมูลที่เปลี่ยนแปลง

2. **Server ประมวลผล**:
   - บันทึกการเปลี่ยนแปลงจาก Client
   - ดึงข้อมูลที่เปลี่ยนแปลงบน Server
   - ส่งข้อมูลกลับให้ Client

3. **Client รับข้อมูล**:
   - อัพเดทข้อมูลในเครื่อง
   - บันทึกเวลา sync ครั้งล่าสุด

### 4. การจัดการ Conflict

#### 4.1 Version Conflict
- เกิดเมื่อ Client ส่ง version เก่ามาอัพเดท
- Server ตอบกลับด้วย HTTP 409 Conflict
- Client ต้องดึงข้อมูลล่าสุดและทำการอัพเดทใหม่

#### 4.2 การแก้ไข Conflict
- **Last-Write-Wins**: ข้อมูลที่อัพเดททีหลังจะเป็นข้อมูลล่าสุด
- **Version Check**: ตรวจสอบ version ก่อนอัพเดท
- **Soft Delete**: ไม่ลบข้อมูลจริง ทำให้สามารถกู้คืนได้

### 5. API Endpoints

#### 5.1 Task Management
- `GET /tasks` - ดูรายการ Task ทั้งหมด
- `GET /tasks/:id` - ดู Task รายการเดียว
- `POST /tasks` - สร้าง Task ใหม่
- `PUT /tasks/:id` - แก้ไข Task
- `DELETE /tasks/:id` - ลบ Task

#### 5.2 Sync Operations
- `POST /tasks/sync` - Sync ข้อมูลระหว่าง Client และ Server

### 6. การจัดการข้อผิดพลาด

#### 6.1 ข้อผิดพลาดที่พบบ่อย
- **404 Not Found**: Task ไม่พบหรือถูกลบไปแล้ว
- **409 Conflict**: Version ไม่ตรงกัน
- **500 Internal Error**: ข้อผิดพลาดฝั่ง Server

#### 6.2 การแก้ไข
- Client ต้องตรวจสอบสถานะ HTTP Response
- ทำการ Retry สำหรับข้อผิดพลาดบางประเภท
- แสดงข้อความแจ้งเตือนให้ User ทราบ

### 7. การพัฒนาและทดสอบ

#### 7.1 Development Commands
```bash
pnpm run start:dev      # เริ่ม Development Server
pnpm run build          # Build สำหรับ Production
pnpm run test           # รัน Unit Tests
pnpm run lint           # ตรวจสอบ Code Quality
```

#### 7.2 การทดสอบ
- **Unit Tests**: ทดสอบแต่ละ Service แยกกัน
- **Integration Tests**: ทดสอบการทำงานร่วมกัน
- **E2E Tests**: ทดสอบการทำงานทั้งระบบ

### 8. การ Deploy

#### 8.1 Production Build
```bash
pnpm run build
pnpm run start:prod
```

#### 8.2 Environment Variables
- `DATABASE_URL`: Connection String สำหรับฐานข้อมูล
- `PORT`: Port สำหรับรัน Server (default: 3000)

### 9. การปรับปรุงระบบ

#### 9.1 ฟีเจอร์ที่เพิ่มเติมได้
- การจัดการ User และ Authentication
- การจัดการ Permission
- การ Log การเปลี่ยนแปลงข้อมูล
- การ Backup ข้อมูล

#### 9.2 ประสิทธิภาพ
- ใช้ Database Indexing
- จำกัดจำนวนข้อมูลต่อครั้ง
- Cache ข้อมูลที่ใช้บ่อย
