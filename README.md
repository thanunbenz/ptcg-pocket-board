# Pokémon TCG Pocket Board (POC)

บอร์ดเกมแนว Pokémon TCG Pocket แบบ POC (proof of concept) ทำหน้าที่เป็น **UI บอร์ดเกม**
ยังไม่มี engine หรือกฎเกมอยู่ในตัว เป้าหมายคือเอา UI ชุดนี้ไปต่อกับ game engine
ของจริงภายหลัง

โครงการนี้เป็นงานทดลองด้าน UI และ interaction ไม่มีส่วนเกี่ยวข้องหรือได้รับการรับรอง
จาก The Pokémon Company, Creatures หรือ Nintendo

## สถานะของโปรเจกต์

- เป็น front-end board game POC ไม่มี server, ไม่มี persistence, ไม่มี multiplayer
- ข้อมูลการ์ดเป็น mock ทั้งหมด (การ์ด 4 หน้า, HP คงที่ใน `components/game/card.tsx`)
- state ของเกมเก็บไว้ใน React ฝั่ง client เพื่อให้ทีมต่อ engine ได้ง่าย
- UI อ้างอิงจาก Figma export ในเครื่องผู้ออกแบบ และสรุป token ไว้ที่
  [`docs/design-system.md`](docs/design-system.md)

## สิ่งที่ทำแล้ว

- Opening board ก่อนเริ่มเกม พร้อม responsive ทั้ง desktop และ portrait
- Flow ก่อนเล่น: เลือกเด็ค, VS intro, Coin toss, แจกการ์ด 5 ใบเข้าไพ่อัตโนมัติ
- มือการ์ดของ Player 1 แบบ hover preview, ลากการ์ดไปวางบน Active หรือ Bench
- มือการ์ดของ Player 2 แบบคว่ำหลัง ไม่มีการแสดงหน้าไพ่
- Deck actions: Draw, View deck, Mulligan, Probabilities พร้อมจำนวนไพ่คงเหลือ
- Turn change overlay และปุ่ม End Turn แทนปุ่ม Start เดิมหลังเกมเริ่ม
- Action panel ของการ์ดที่วางบนบอร์ด: Ability, ท่าโจมตี, Retreat, Status
- ระบบจี้พลังงาน: ลากจาก Energy Zone ไปติดการ์ด, ใช้ท่าแล้วจี้ลง discard,
  Ability ดึงจี้จาก discard กลับมาติด Active
- สถานะบน Active 5 แบบพร้อม Shield และ popup สำหรับ custom
- Stadium: ลากการ์ด Trainer ลงช่อง, กดใช้แล้วเข้า discard
- Discard pile: แสดงการ์ดล่าสุด, จำนวนการ์ด, จำนวนจี้ และ panel ดูของในกอง
- Coin popup ระหว่างเกม, หน้าจบเกม Victory / Defeat / Draw
- ปุ่มทดสอบ `Get point` และ `End battle` ที่มุมซ้ายบนระหว่างเล่น

## สิ่งที่ยังไม่ทำ (จุดต่อ engine)

- กฎเกม, การคำนวณ damage จริง, เงื่อนไขชนะ, เทิร์นที่ถูกบังคับตามกติกา
- ข้อมูลการ์ดจริง, deck list จริง, การ shuffle ที่มาจาก engine
- ฝ่าย Player 2 ยังวางโปเกมอนบนบอร์ดไม่ได้
- ไม่มีการบันทึกเกม, reconnect, หรือ multiplayer

## การใช้งาน

ต้องมี Node.js 20 ขึ้นไป (แนะนำ LTS ล่าสุด) และ npm

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

Demo flow

1. กด `Start` เลือกเด็ค แล้วกด Start ในหน้า VS
2. รอ Coin toss และระบบแจกการ์ด
3. ระหว่างเกม ปุ่มเดิมจะกลายเป็น `End Turn` และมีปุ่มทดสอบมุมซ้ายบน
   `Get point` กับ `End battle`
4. คลิกการ์ดบนบอร์ดเพื่อเปิด action panel, hover deck เพื่อเปิดเมนู deck,
   ลากจี้จาก Energy Zone ไปติดการ์ด
5. ปุ่ม `...` โยนเหรียญระหว่างเกม, ปุ่มลูกศรย้อนกลับเปิดหน้าเลือกเด็คใหม่

## โครงสร้างโปรเจกต์

```text
app/                  App Router, metadata, design tokens (globals.css)
components/board/     WideBoard, NarrowBoard, slots, piles, FAB
components/game/      Card, Hand, useDealer, TurnChange, CoinPopup,
                      CardActions, StatusPopup, PointGain, EndBattle
components/pick-deck/ Flow ก่อนเกม: PickDeckDialog, MatchPreview, DeckList,
                      VsIntro, CoinToss
components/ui/        Button (shadcn style)
public/               รูปการ์ด, หลังการ์ด, เหรียญ, ไอคอนสถานะ
docs/                 design-system.md
```

## การต่อกับ game engine

UI ถูกแยกเป็น component ที่รับ props เป็นหลัก จุดที่ต้องเปลี่ยนเมื่อต่อ engine

| ไฟล์ | state ที่ถืออยู่ | สิ่งที่ต้องทำ |
| --- | --- | --- |
| `components/game/use-dealer.ts` | deck count, hands, offsets, dealing, mulligan, shuffle | เปลี่ยนเป็น adapter ที่อ่าน state จาก engine และส่งคำสั่ง draw, mulligan, play card |
| `components/board/wide-board.tsx` | โปเกมอนบนบอร์ด, HP, จี้, สถานะ, stadium, discard, discard energy | ย้าย state ไป engine แล้วรับเป็น props หรือ context แล้วผูก event กับคำสั่งของ engine |
| `components/opening-board.tsx` | flow เกม, เทิร์นปัจจุบัน, แต้ม, จบเกม | ให้ engine เป็นเจ้าของสถานะเกม แล้วให้ UI แค่ render และส่ง action |

แนวทางที่แนะนำ

1. สร้าง layer `lib/engine` ที่มี `getViewState()` และคำสั่งเช่น `endTurn()`,
   `playCard()`, `attack()`, `useAbility()`, `retreat()`, `attachEnergy()`
2. แทนที่ local state ใน `useDealer` และ `WideBoard` ด้วย state จาก engine
3. แทน `CARD_FRONTS` และ `CARD_HP` ด้วยข้อมูลการ์ดจาก engine
4. ให้ overlay ต่างๆ (TurnChange, PointGain, EndBattle) แสดงตาม event จาก engine
   แทนการกดปุ่มทดสอบ

## หมายเหตุ

รูปการ์ด เหรียญ และไอคอนสถานะใช้เพื่อการทดลอง UI เท่านั้น
Pokémon และ Pokémon TCG Pocket เป็นเครื่องหมายการค้าของเจ้าของสิทธิ์
