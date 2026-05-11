# AI Coding Rules

> ใช้ไฟล์นี้เป็นกฎหลักสำหรับ AI ที่ช่วยเขียนโค้ด เช่น Claude Code, Cursor, ChatGPT, Copilot หรือ Agent อื่น ๆ  
> เป้าหมายไม่ใช่ให้ AI เขียนโค้ดเยอะที่สุด แต่ให้เขียนโค้ดที่ถูกทิศทาง ตรวจสอบได้ และไม่มีกลิ่น AI

---

## 1. หลักคิดหลัก

AI ต้องไม่แค่ “แก้คำ” หรือ “แต่งโค้ดให้สวย” แต่ต้องเข้าใจ Logic ของปัญหา

ก่อนเขียนโค้ดทุกครั้ง ให้คิดแบบนี้:

- ปัญหานี้เกิดจาก logic, flow, validation, data, state, permission หรือ error handling?
- โค้ดเดิมควร patch ต่อ หรือควร rewrite ใหม่?
- ถ้าโค้ดนี้ขึ้น production แล้ว error ตอนกลางคืน จะ debug ได้หรือไม่?
- มี log เพียงพอหรือไม่?
- error แต่ละประเภทถูกจัดการต่างกันหรือไม่?
- โค้ดนี้ง่ายพอที่คนอื่นจะดูแลต่อได้หรือไม่?

ห้ามตอบว่า `done`, `fixed`, `completed` ถ้ายังไม่ได้ตรวจสอบตามข้อกำหนดด้านล่าง

---

## 2. Reject Output Criteria

ถ้า output มีลักษณะต่อไปนี้ ให้ถือว่า “ไม่ผ่าน” และต้อง rewrite ใหม่

### 2.1 Over-engineering

ห้ามทำเกินกว่าที่โจทย์ต้องการ

ไม่ผ่าน:

- สร้าง class hierarchy ทั้งที่ function เดียวพอ
- แยกไฟล์มากเกินไปโดยไม่มีเหตุผล
- สร้าง abstraction เผื่ออนาคต ทั้งที่ยังไม่มี use case จริง
- เพิ่ม dependency ใหม่โดยไม่จำเป็น
- ทำระบบใหญ่ ทั้งที่โจทย์ต้องการแก้จุดเดียว

ผ่าน:

- function เดียว ทำงานเดียว
- logic ตรงไปตรงมา
- ใช้โครงสร้างเดิมก่อน ถ้ายังดีพอ
- เพิ่ม abstraction เฉพาะเมื่อมีเหตุผลจริง

---

### 2.2 AI Smell

ห้ามเขียนโค้ดที่ดูเหมือน AI เขียน

ไม่ผ่าน:

- comment ทุกบรรทัด
- docstring ยาวกว่า code
- ชื่อตัวแปร generic เช่น `data`, `item`, `result` โดยไม่จำเป็น
- error handler กว้างเกินไป
- โค้ดดูสะอาดแต่ไม่แก้ปัญหาจริง
- สรุปเกินจริงว่าโค้ดสมบูรณ์ ทั้งที่ยังไม่ได้รัน

ผ่าน:

- code อ่านเข้าใจได้เอง
- comment เฉพาะจุดที่ logic ซับซ้อน
- naming สื่อความหมายตาม domain จริง
- แยก error ตามประเภท
- บอกข้อจำกัดอย่างตรงไปตรงมา

---

### 2.3 Generic เกินไป

ห้ามใช้คำตอบแบบครอบจักรวาลที่ไม่ specific กับงานนี้

ไม่ผ่าน:

```js
function handleError(err) {
  console.error(err);
  return { success: false };
}
```

ผ่าน:

```js
function handleUploadError(err) {
  if (err.code === "LIMIT_FILE_SIZE") {
    return { status: 413, message: "File size exceeds upload limit" };
  }

  if (err.code === "ER_DUP_ENTRY") {
    return { status: 409, message: "Duplicate record found" };
  }

  console.error("[UPLOAD_UNEXPECTED_ERROR]", {
    message: err.message,
    stack: err.stack,
  });

  return { status: 500, message: "Unexpected upload error" };
}
```

---

## 3. วิธีตอบเมื่อได้รับงานเขียนโค้ด

ทุกครั้งที่ได้รับงาน ให้ทำตามลำดับนี้

1. อ่านโจทย์และระบุเป้าหมายจริง
2. ตรวจว่าเป็นงานแก้ bug, เพิ่ม feature, refactor หรือ rewrite
3. ถ้าโจทย์ไม่ชัด ให้เลือกแนวทางที่ปลอดภัยที่สุดและบอก assumption
4. อย่าเปลี่ยนโครงสร้างใหญ่ถ้าไม่จำเป็น
5. เขียนโค้ดให้น้อยที่สุดที่แก้ปัญหาได้จริง
6. ตรวจ edge case สำคัญ
7. ระบุสิ่งที่ยังไม่ได้ verify อย่างตรงไปตรงมา

---

## 4. กฎการเขียนโค้ด

### 4.1 ห้าม Over-engineer

- ห้ามสร้าง abstraction ล่วงหน้า
- ห้ามสร้าง helper ถ้าใช้แค่ครั้งเดียวและไม่ได้ทำให้โค้ดอ่านง่ายขึ้น
- ห้ามเพิ่ม library ถ้า native code ทำได้ดีพอ
- ห้ามเปลี่ยน architecture โดยไม่ได้รับคำสั่งชัดเจน
- ห้ามแก้หลายส่วนพร้อมกันถ้าโจทย์ต้องการแก้จุดเดียว

---

### 4.2 Specific > Generic

ต้องเขียน logic ให้ตรงกับปัญหา

ตัวอย่าง:

- network error → retry ได้
- auth error → return 401/403
- validation error → return 400
- duplicate data → return 409
- database unavailable → return 503
- data corruption → log ชัดเจน และไม่ swallow error

ห้ามรวม error ทุกแบบไว้ใน catch เดียวแล้วตอบเหมือนกันหมด

---

### 4.3 Verify Before Done

ห้ามบอกว่างานเสร็จ ถ้ายังไม่ได้ตรวจ

ก่อนตอบว่าเสร็จ ต้องตรวจอย่างน้อย:

- syntax ถูกหรือไม่
- import ครบหรือไม่
- variable มีอยู่จริงหรือไม่
- function ถูกเรียกด้วย parameter ที่ถูกต้องหรือไม่
- response status code ถูกหรือไม่
- error case สำคัญถูกจัดการหรือไม่
- โค้ดใหม่ไม่ทำลาย flow เดิมหรือไม่

ถ้ายังไม่ได้รันจริง ให้พูดว่า:

> ยังไม่ได้รันจริง แต่ตรวจ logic และ syntax เบื้องต้นแล้ว

ห้ามพูดว่า:

> ทดสอบแล้ว

ถ้ายังไม่ได้ทดสอบจริง

---

## 5. วิธีแก้โค้ด

### 5.1 ถ้า approach ผิด ให้ rewrite

ถ้าโค้ดเดิมผิดทิศทาง อย่า patch ทีละจุด

ให้ rewrite ใหม่เมื่อพบว่า:

- function ใหญ่เกินไป
- switch-case ยาวและรวมหลาย responsibility
- error handling ผิดโครงสร้าง
- state management พัง
- logic ซ้อนจนอ่านยาก
- patch ต่อแล้วจะยิ่งพัง

แนวทางที่ถูกต้อง:

- แยก handler ตาม action
- แยก validation ออกจาก business logic
- แยก side effect ออกจาก pure logic
- ให้ error boundary ชัดเจน
- ใช้ shared utility เท่าที่จำเป็น

---

### 5.2 ถ้าแก้เล็กพอ ให้ patch แบบจำกัดขอบเขต

ถ้าโครงสร้างเดิมยังถูก ให้แก้เฉพาะจุด

ห้าม rewrite ทั้งไฟล์โดยไม่จำเป็น

ต้องบอกให้ชัดว่า:

- แก้ตรงไหน
- เพราะอะไร
- มีผลกระทบกับส่วนอื่นหรือไม่

---

## 6. Error Handling Rules

Error handling ต้อง debug ได้จริง ไม่ใช่แค่กันระบบล่ม

ต้องมี:

- proper HTTP status code
- message ที่คนใช้งานเข้าใจ
- log ที่ developer debug ได้
- แยก expected error กับ unexpected error
- ห้าม swallow error เงียบ ๆ
- ห้าม return success ถ้ามีบางส่วน fail โดยไม่บอก

ตัวอย่าง status code:

- `400` validation ผิด
- `401` ยังไม่ได้ login
- `403` ไม่มีสิทธิ์
- `404` ไม่พบข้อมูล
- `409` ข้อมูลซ้ำหรือ conflict
- `413` ไฟล์ใหญ่เกินไป
- `422` ข้อมูลถูก format แต่ผิดเงื่อนไขธุรกิจ
- `500` unexpected server error
- `503` service/database ใช้งานไม่ได้ชั่วคราว

---

## 7. Logging Rules

Log ต้องช่วย debug ได้จริง

ต้องมี:

- event name
- context สำคัญ
- id ที่ trace ได้ เช่น user_id, company_id, task_id, file_id
- error message
- stack เฉพาะฝั่ง server
- ห้าม log sensitive data เช่น token, password, API key, เลขบัตร, ข้อมูลส่วนบุคคลเกินจำเป็น

ตัวอย่าง:

```js
console.error("[BANK_RECONCILE_FAILED]", {
  companyId,
  fileId,
  step: "match-bank",
  message: err.message,
  stack: err.stack,
});
```

---

## 8. API Rules

เมื่อสร้าง API endpoint ให้ทำตามนี้

ห้าม:

- ห้ามใช้ ORM ถ้า raw query ในระบบเดิมใช้อยู่และเพียงพอ
- ห้ามเปลี่ยน response format เดิมโดยไม่จำเป็น
- ห้าม return 200 ถ้าเกิด error
- ห้าม query โดยไม่ validate input
- ห้าม trust ค่า user_id, role, company_id จาก client โดยตรง ถ้ามี auth context

ต้อง:

- validate input ก่อน query
- ใช้ parameterized query
- แยก status code ให้ถูก
- return JSON ที่ predictable
- log error ฝั่ง server
- ไม่ส่ง stack trace ให้ client

รูปแบบ response แนะนำ:

```js
return res.status(200).json({
  success: true,
  data,
});
```

กรณี error:

```js
return res.status(400).json({
  success: false,
  message: "Invalid request data",
});
```

---

## 9. React Rules

เมื่อเขียน React ให้ทำตามนี้

ห้าม:

- ห้ามยัดทุกอย่างไว้ใน state เดียวถ้าทำให้อ่านยาก
- ห้ามใช้ `useEffect` ซ้อนกันโดยไม่จำเป็น
- ห้าม fetch ซ้ำทุก render
- ห้ามแก้ state โดย mutate object เดิม
- ห้ามสร้าง component ย่อยเยอะเกินไปถ้าไม่ได้ช่วยให้อ่านง่าย
- ห้ามใส่ comment อธิบาย JSX ทุกจุด

ต้อง:

- แยก loading, error, data state ให้ชัด
- handle empty state
- handle API error
- ใช้ optional chaining เฉพาะจุดที่จำเป็น
- ชื่อตัวแปรต้องสื่อ domain จริง
- รักษา UI pattern เดิม เช่น Bootstrap, React-Bootstrap, SweetAlert2 ถ้าโปรเจคใช้อยู่แล้ว

---

## 10. Node.js / Express Rules

เมื่อเขียน backend Node.js / Express ให้ทำตามนี้

ห้าม:

- ห้ามครอบ try-catch แบบกว้างแล้วตอบ error เดียวกันหมด
- ห้าม query string ต่อเองด้วย user input
- ห้ามลืม `return` หลังส่ง response
- ห้ามใช้ async function โดยไม่จัดการ error
- ห้ามลืม auth middleware ถ้า route ต้องป้องกันสิทธิ์

ต้อง:

- ใช้ `async/await`
- ใช้ parameterized query
- validate `req.body`, `req.params`, `req.query`
- แยก business error กับ system error
- response ต้อง predictable
- log เฉพาะข้อมูลที่จำเป็น

---

## 11. Database Rules

เมื่อเขียน SQL หรือแก้ schema ให้ทำตามนี้

ห้าม:

- ห้ามเดาชื่อ column
- ห้ามสร้าง table ใหม่ถ้า table เดิมรองรับได้
- ห้ามแก้ schema โดยไม่บอกผลกระทบ
- ห้ามใช้ `SELECT *` ใน production code ถ้าไม่จำเป็น
- ห้ามลบข้อมูลจริงโดยไม่มีเงื่อนไขชัดเจน

ต้อง:

- ตรวจชื่อ table และ column ก่อน
- ใช้ migration หรือ SQL ที่ rollback ได้ถ้าเป็นไปได้
- ใส่ index เมื่อ query จำเป็นต้อง filter/join บ่อย
- ระบุ foreign key เมื่อข้อมูลมีความสัมพันธ์จริง
- ใช้ transaction ถ้ามีหลาย query ที่ต้องสำเร็จพร้อมกัน

---

## 12. Output Format Rules

เวลาตอบงานโค้ด ให้ตอบแบบนี้

### ถ้าเป็นการแก้โค้ด

ให้ตอบ:

1. ปัญหาที่เจอ
2. แนวทางแก้
3. โค้ดที่แก้
4. จุดที่ต้องตรวจหลังนำไปใช้

ห้ามตอบยาวแบบ lecture ถ้าไม่ได้ถาม

---

### ถ้าเป็นการเขียนไฟล์เต็ม

ให้ตอบ:

1. ชื่อไฟล์
2. โค้ดเต็ม
3. วิธีนำไปวาง
4. ข้อควรระวัง

---

### ถ้าไม่แน่ใจ

ต้องพูดตรง ๆ ว่าไม่แน่ใจเพราะอะไร

ห้ามเดา

ใช้รูปแบบ:

> ยังไม่มีข้อมูลพอที่จะยืนยัน เพราะยังไม่เห็นไฟล์/route/schema ที่เกี่ยวข้อง

แล้วเสนอสิ่งที่ต้องใช้ตรวจต่อ เช่น:

- schema table
- route เดิม
- component เดิม
- sample response
- error log
- payload ตัวอย่าง

---

## 13. Prompt Shortcut ที่ใช้ซ้ำได้

ใช้คำสั่งสั้น ๆ เหล่านี้เพื่อ steer AI

### ตัดส่วนเกิน

```text
over-engineered ตัดออก ให้เหลือวิธีที่ง่ายที่สุดที่แก้ปัญหาได้จริง
```

### แก้ error handling

```text
error handling กว้างไป แยก expected error กับ unexpected error และใช้ status code ให้ถูก
```

### ห้ามโม้ว่าเสร็จ

```text
ยังไม่ได้รัน อย่าบอกว่า done ให้บอกเฉพาะสิ่งที่ตรวจแล้ว
```

### Rewrite ใหม่

```text
approach ผิด อย่า patch ให้ rewrite ใหม่โดยรักษา behavior เดิมเท่าที่จำเป็น
```

### ลด AI smell

```text
โค้ดดูเหมือน AI เขียน ลด comment และทำให้ naming เป็น domain จริง
```

### ทำให้ specific

```text
generic เกินไป ทำให้ logic เฉพาะกับ case นี้
```

---

## 14. Final Checklist ก่อนส่งคำตอบ

ก่อนส่ง output ต้องเช็ค:

- [ ] โค้ดแก้ปัญหาจริงหรือไม่
- [ ] มีส่วนที่ทำเกินโจทย์หรือไม่
- [ ] มี AI smell หรือไม่
- [ ] error handling specific พอหรือไม่
- [ ] status code ถูกหรือไม่
- [ ] log debug ได้จริงหรือไม่
- [ ] ไม่เดา table/column/function ที่ยังไม่เห็น
- [ ] ไม่บอกว่าทดสอบแล้วถ้ายังไม่ได้ทดสอบจริง
- [ ] มีข้อจำกัดหรือ assumption ระบุไว้ชัดเจน
- [ ] คำตอบสั้นพอและนำไปใช้ได้ทันที

---

## 15. Default Behavior

ถ้าไม่มีคำสั่งเฉพาะ ให้ยึดแนวทางนี้เสมอ:

- Simple first
- Specific over generic
- Rewrite bad approach
- Patch only when structure is right
- Verify before claiming done
- No over-engineering
- No AI smell
- No silent failure
- No fake confidence
