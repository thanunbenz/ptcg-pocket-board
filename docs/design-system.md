# Design system

สไตล์หลัก: dark, โปร่ง, มินิมอล ใช้พื้นผิวโปร่งแสง (glass) แทนพื้นทึบ และให้สีแดง/น้ำเงินบอกฝั่งผู้เล่นเท่านั้น

## สี (tokens ใน `app/globals.css`)

| Token | ค่า | ใช้ที่ |
|---|---|---|
| `background` | `#000000` | พื้นฐานของหน้า (ซ้อนด้วย gradient ด้านล่าง) |
| `foreground` | `#f5f5f5` | ข้อความหลัก |
| `muted` | `#8a8a8a` | ป้ายการ์ด, Cancel, ข้อความรอง |
| `slot` | `#1a1a1e` | พื้นช่องการ์ดทุกช่องบนบอร์ด |
| `border` | `#333333` | เส้นขอบกลาง ๆ |
| `ring` | `#5aa9ff` | focus ring |
| `primary` | `#ffffff` | พื้นปุ่ม START |
| `primary-foreground` | `#111111` | ตัวอักษรบนปุ่ม START |
| `opponent` | `#ff5a5a` | Player 2, ขอบ Active ฝั่งตรงข้าม, ปุ่มสลับเด็ค |
| `self` | `#5aa9ff` | Player 1, ขอบ Active ฝั่งเรา |
| `surface` | `rgba(10,10,12,0.72)` | พื้น modal (โปร่งให้บอร์ดที่เบลออยู่ข้างหลังทะลุ) |
| `glass` | `rgba(255,255,255,0.06)` | พื้นแถวเด็ค |

## ค่าที่ใช้ตรง ๆ (นอก token)

| ค่า | ใช้ที่ |
|---|---|
| `#15151B → #0B0B0F → #050506` radial | พื้นหลังหน้าและพื้นบอร์ด (gradient กลางจอ) |
| `#140808 → #3A1111` (90deg) | แถบ Player 2 ด้านบน |
| `#113059 → #081220` (90deg) | แถบ Player 1 ด้านล่าง |
| `#2F2F35` | ขอบช่องการ์ด |
| `#2F5FA7` | เส้นกลางจอ (ไล่เป็นดำสองข้าง) |
| `#7894ED → #3AE4EF` | ขอบปุ่ม Start |
| `rgba(58,228,239,0.35)` | glow ปุ่ม Start |
| `#111111` / `#303030` | พื้นและขอบ FAB |
| `#141418` / `#3a3a40` | Energy Zone |
| `white/30` | ขอบ modal |
| `white/[0.03]` | พื้น panel ในหน้า VS |
| `white/10` | hover ของแถวเด็ค, เส้นใต้แท็บ |
| `white/30`, `white/50` | แถบเลื่อนของรายการเด็ค (thumb, hover) |
| `opponent/15`, `opponent/50` | พื้นและขอบปุ่มสลับเด็ค |

## ตัวอักษร

- ฟอนต์: `"Segoe UI", system-ui, sans-serif` ผ่าน `--font-sans`
- ป้ายช่องการ์ด: 11px (จอแคบ), 15px (บอร์ดเดสก์ท็อปปรับตามสัดส่วน)
- ชื่อผู้เล่นในแถบ: 13px mobile, 15px desktop, น้ำหนัก bold
- หัวข้อ modal: 18px bold
- ชื่อเด็ค: 15px bold, จำนวนการ์ด 13px `muted`
- ปุ่ม START: 14px bold uppercase

## รัศมีและระยะ

- ช่องการ์ด: 8px (จอแคบ), สเกลตามบอร์ดบนเดสก์ท็อป
- modal: 24px, panel ในหน้า VS: 16px, แถวเด็คและแท็บ: 12px
- ระยะภายในใช้กริด 4px, ระยะห่างหลัก 8px, 12px, 16px, 20px
- เส้นขอบ modal 1px

## คอมโพเนนต์

| คอมโพเนนต์ | ไฟล์ | สีหลัก |
|---|---|---|
| OpeningBoard (orchestrator) | `components/opening-board.tsx` | พื้น gradient |
| WideBoard | `components/board/wide-board.tsx` | slot, opponent, self |
| NarrowBoard | `components/board/narrow-board.tsx` | slot, opponent, self |
| parts (Slot, Pile, EnergyZone, PrizeRings, Fab) | `components/board/parts.tsx` | slot, border, muted, opponent, self |
| PickDeckDialog | `components/pick-deck/pick-deck-dialog.tsx` | surface, white/30 |
| MatchPreview | `components/pick-deck/match-preview.tsx` | opponent, self, white/[0.03] |
| DeckList | `components/pick-deck/deck-list.tsx` | glass, muted, white/10 |

แท็บในหน้าเลือกเด็คเป็นแบบ minimal: ข้อความสองแท็บบนเส้นคั่นบาง `white/10` แท็บที่เลือกใช้ข้อความขาวและเส้นใต้ 2px แท็บที่ไม่ได้เลือกใช้ `muted`

## Interaction

- ปุ่มลูกศรใน panel Player 2 (`opponent/15` พื้น, `opponent/50` ขอบ) สลับเด็คของสองฝั่ง
- กดการ์ดใน panel ใดก็ได้เพื่อเปิดหน้าเลือกเด็คของฝั่งนั้น
- Cancel ในหน้า VS ปิด popup
- Cancel ในหน้าเลือกเด็คกลับไปหน้า VS ไม่ปิด popup
- Escape หรือคลิกพื้นหลังปิด popup
- หน้า VS ย่อการ์ดตามความสูงจอ (`calc` จาก `dvh`) เพื่อไม่ให้มีแถบเลื่อน
- หน้าเลือกเด็ค: แสดงครั้งละ 6 เด็ค (3 แถวบนเดสก์ท็อป, 6 แถวบนมือถือ) ที่เหลือเลื่อนเอา หัวข้อกับแท็บอยู่กับที่และ Cancel อยู่ขอบล่างเสมอ กริดอยู่ในกรอบเลื่อนของตัวเอง ใช้แถบเลื่อนกว้าง 10px ที่มีขอบโปร่งใส 2px เหลือหัวมน 6px สี `white/30` (hover `white/50`) พื้นหลังโปร่งใส ไม่ใช่แถบสี่เหลี่ยมเริ่มต้นของเบราว์เซอร์

## Motion

ใช้ `motion` สำหรับแอนิเมชันทั้งหมด ไม่เขียน keyframe เอง

- เปิด/ปิด modal: opacity 180ms, scale 0.98 → 1
- เปลี่ยนหน้า VS กับรายการเด็ค: fade ออก 100ms, สลับขนาด modal ตอนเนื้อหา opacity 0, แล้ว fade เข้า 100ms (ไม่เห็นการกระตุกของขนาด)
- สลับเด็คด้วยปุ่มลูกศร: fade ออก 150ms, สลับชื่อตอน opacity 0, fade เข้า 150ms
- กดปุ่ม Start: scale 0.96 ตาม `prefers-reduced-motion`
- แสงหลังปุ่ม Start: loop 2.4s, opacity 0.35 → 0.85 → 0.35, scale 1 → 1.06 (ถ้า reduced motion หยุดที่ opacity 0.55)
- hover การ์ดในหน้า VS: `whileHover` scale 1.03, `whileTap` 0.99, 150ms
- เส้นใต้แท็บที่เลือก: เลื่อนด้วย `layoutId` แบบ spring (reduced motion เลื่อนทันที)

## Responsive

- เกณฑ์สลับบอร์ดคือ orientation: แนวตั้งใช้ `NarrowBoard`, แนวนอนใช้ `WideBoard`
- ความกว้าง modal กำหนดที่ view: `min(92vw, 370px)` สำหรับหน้า VS, `min(92vw, 620px)` เมื่อจอเตี้ย และ `min(92vw, 570px)` สำหรับรายการเด็ค
- เนื้อหาใน modal ใช้ `w-full` และเปิด `scrollbar-gutter: stable` เพื่อไม่ให้ความกว้างกระโดดตอนแถบเลื่อนโผล่
- รายการเด็คเป็น 1 คอลัมน์ต่ำกว่า 560px และ 2 คอลัมน์ตั้งแต่ 560px
- variant `short` (`max-height: 620px`) ย่อ modal: หน้า VS เรียงสอง panel แนวนอน, รายการเด็คเป็น 3 คอลัมน์เมื่อกว้างพอ, ลดระยะห่าง
- modal สูงไม่เกิน `92dvh` และเลื่อนภายในถ้าเนื้อหายาวกว่า
- บอร์ดเดสก์ท็อปยึดความสูงจอและครอปเฉพาะพื้นว่างด้านข้าง ไม่มีสกอร์ล
