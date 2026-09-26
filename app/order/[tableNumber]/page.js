'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const MAX_QTY_PER_ITEM = 5;
const MAX_LINE_ITEMS = 10;
const PRICE_ADULT = 289;
const PRICE_CHILD = 145;

const styles = {
  page: {
    maxWidth: 480,
    margin: '0 auto',
    fontFamily: 'sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '90px', // เผื่อพื้นที่ให้ตะกร้าลอย
  },
  centerScreen: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem 1.5rem',
    fontFamily: 'sans-serif',
    maxWidth: 480,
    margin: '0 auto',
  },
  bigMessage: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    lineHeight: 1.6,
  },
  header: {
    position: 'sticky',
    top: 0,
    background: '#fff',
    zIndex: 20,
    padding: '0.9rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
  },
  headerTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  billButton: {
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '0.55rem 0.9rem',
    borderRadius: 10,
    border: 'none',
    background: '#ea580c',
    color: '#fff',
    cursor: 'pointer',
  },
  tabsRow: {
    display: 'flex',
    overflowX: 'auto',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    position: 'sticky',
    top: 58,
    background: '#fff',
    zIndex: 19,
    borderBottom: '1px solid #eee',
  },
  tabButton: (active) => ({
    flex: '0 0 auto',
    padding: '0.6rem 1rem',
    borderRadius: 999,
    border: active ? '2px solid #16a34a' : '2px solid #ddd',
    background: active ? '#16a34a' : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  }),
  itemList: {
    padding: '0.75rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    flex: 1,
  },
  itemCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.9rem 1rem',
    borderRadius: 12,
    border: '1px solid #e5e5e5',
    background: '#fafafa',
  },
  itemName: {
    fontSize: '1.15rem',
    fontWeight: 'bold',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: 'none',
    background: '#16a34a',
    color: '#fff',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnMinus: {
    background: '#e5e5e5',
    color: '#333',
  },
  stepperQty: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  addOnlyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: 'none',
    background: '#16a34a',
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  floatingCart: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#111',
    color: '#fff',
    padding: '0.9rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 480,
    margin: '0 auto',
    zIndex: 30,
  },
  floatingCartInfo: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  submitButton: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    padding: '0.7rem 1.4rem',
    borderRadius: 10,
    border: 'none',
    background: '#16a34a',
    color: '#fff',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.25rem',
    zIndex: 50,
  },
  modalBox: {
    background: '#fff',
    borderRadius: 16,
    padding: '1.5rem',
    maxWidth: 400,
    width: '100%',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  modalRow: {
    fontSize: '1.1rem',
    marginBottom: '0.4rem',
  },
  modalTotal: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#ea580c',
    margin: '1rem 0',
    textAlign: 'center',
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  cancelButton: {
    flex: 1,
    fontSize: '1.05rem',
    padding: '0.8rem',
    borderRadius: 10,
    border: '2px solid #999',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
  },
  confirmBillButton: {
    flex: 1,
    fontSize: '1.05rem',
    fontWeight: 'bold',
    padding: '0.8rem',
    borderRadius: 10,
    border: 'none',
    background: '#ea580c',
    color: '#fff',
    cursor: 'pointer',
  },
  toast: {
    position: 'fixed',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#111',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: 999,
    fontSize: '1rem',
    zIndex: 60,
    maxWidth: '90%',
    textAlign: 'center',
  },
};

export default function OrderPage({ params }) {
  // Next.js เวอร์ชันนี้ params เป็น Promise ต้อง unwrap ด้วย use() เสมอ
  const { tableNumber } = use(params);
  const tableNumberNum = parseInt(tableNumber, 10);

  // pageState: 'loading' | 'not_open' | 'active' | 'closed'
  const [pageState, setPageState] = useState('loading');
  const [session, setSession] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const [cart, setCart] = useState({}); // { [itemId]: { name, quantity } }
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const [showBillModal, setShowBillModal] = useState(false);
  const [closingBill, setClosingBill] = useState(false);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  }

  // โหลด session + เมนู ตอนเข้าหน้า
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      if (!Number.isInteger(tableNumberNum)) {
        setPageState('not_open');
        return;
      }

      const { data: sessionRow, error: sessionError } = await supabase
        .from('sessions')
        .select('id, table_number, adult_count, child_count, status')
        .eq('table_number', tableNumberNum)
        .eq('status', 'open')
        .maybeSingle();

      if (isCancelled) return;

      if (sessionError || !sessionRow) {
        setPageState('not_open');
        return;
      }

      setSession(sessionRow);

      const [{ data: categoryRows, error: catError }, { data: itemRows, error: itemError }] =
        await Promise.all([
          supabase.from('menu_categories').select('id, name, sort_order').order('sort_order'),
          supabase.from('menu_items').select('id, category_id, name'),
        ]);

      if (isCancelled) return;

      if (catError || itemError) {
        setErrorMsg('โหลดเมนูไม่สำเร็จ กรุณาลองใหม่');
      } else {
        setCategories(categoryRows || []);
        setItems(itemRows || []);
        if (categoryRows && categoryRows.length > 0) {
          setActiveCategoryId(categoryRows[0].id);
        }
      }

      setPageState('active');
    }

    loadData();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableNumberNum]);

  function increment(item) {
    setCart((prev) => {
      const existing = prev[item.id];
      const currentQty = existing ? existing.quantity : 0;

      if (currentQty >= MAX_QTY_PER_ITEM) {
        return prev;
      }
      if (!existing && Object.keys(prev).length >= MAX_LINE_ITEMS) {
        showToast(`เลือกได้สูงสุด ${MAX_LINE_ITEMS} รายการต่อออเดอร์`);
        return prev;
      }
      return {
        ...prev,
        [item.id]: { name: item.name, quantity: currentQty + 1 },
      };
    });
  }

  function decrement(item) {
    setCart((prev) => {
      const existing = prev[item.id];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return {
        ...prev,
        [item.id]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  }

  const cartEntries = Object.entries(cart);
  const cartLineCount = cartEntries.length;
  const cartTotalQty = cartEntries.reduce((sum, [, v]) => sum + v.quantity, 0);

  async function handleSubmitOrder() {
    if (cartLineCount === 0 || !session) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      const itemsPayload = cartEntries.map(([, v]) => ({
        name: v.name,
        quantity: v.quantity,
      }));

      const { error } = await supabase.from('orders').insert({
        session_id: session.id,
        table_number: tableNumberNum,
        items: itemsPayload,
        status: 'received',
      });

      if (error) {
        setErrorMsg('ส่งออเดอร์ไม่สำเร็จ กรุณาลองใหม่');
        return;
      }

      setCart({});
      showToast('ส่งออเดอร์แล้ว');
    } finally {
      setSubmitting(false);
    }
  }

  const billAmount = session
    ? session.adult_count * PRICE_ADULT + session.child_count * PRICE_CHILD
    : 0;

  async function handleConfirmBill() {
    if (!session) return;
    setClosingBill(true);
    try {
      const { data: updated, error } = await supabase
        .from('sessions')
        .update({ status: 'closed' })
        .eq('id', session.id)
        .eq('status', 'open')
        .select();

      if (error) {
        setErrorMsg('ปิดโต๊ะไม่สำเร็จ กรุณาแจ้งพนักงาน');
        setShowBillModal(false);
        return;
      }

      // ไม่ว่าจะปิดสำเร็จตอนนี้หรือถูกปิดไปแล้วจากที่อื่น ผลลัพธ์ที่ลูกค้าเห็นเหมือนกัน
      setShowBillModal(false);
      setPageState('closed');
    } finally {
      setClosingBill(false);
    }
  }

  // ---------- หน้าจอ: กำลังโหลด ----------
  if (pageState === 'loading') {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.bigMessage}>กำลังโหลด...</div>
      </div>
    );
  }

  // ---------- หน้าจอ: โต๊ะยังไม่เปิด ----------
  if (pageState === 'not_open') {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.bigMessage}>โต๊ะนี้ยังไม่เปิดใช้งาน กรุณาแจ้งพนักงาน</div>
      </div>
    );
  }

  // ---------- หน้าจอ: ปิดโต๊ะแล้ว (จ่ายเงินเสร็จ) ----------
  if (pageState === 'closed') {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.bigMessage}>ขอบคุณที่ใช้บริการ 🙏</div>
      </div>
    );
  }

  // ---------- หน้าจอ: สั่งอาหาร ----------
  const visibleItems = items.filter((it) => it.category_id === activeCategoryId);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>โต๊ะ {tableNumberNum}</div>
        <button style={styles.billButton} onClick={() => setShowBillModal(true)}>
          เรียกเก็บเงิน
        </button>
      </div>

      {errorMsg && (
        <div style={{ color: '#b91c1c', padding: '0.5rem 1rem', fontSize: '0.95rem' }}>
          {errorMsg}
        </div>
      )}

      <div style={styles.tabsRow}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            style={styles.tabButton(cat.id === activeCategoryId)}
            onClick={() => setActiveCategoryId(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div style={styles.itemList}>
        {visibleItems.length === 0 && (
          <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
            ไม่มีเมนูในหมวดนี้
          </div>
        )}

        {visibleItems.map((item) => {
          const inCart = cart[item.id];
          return (
            <div key={item.id} style={styles.itemCard}>
              <div style={styles.itemName}>{item.name}</div>
              {inCart ? (
                <div style={styles.stepper}>
                  <button
                    style={{ ...styles.stepperBtn, ...styles.stepperBtnMinus }}
                    onClick={() => decrement(item)}
                  >
                    −
                  </button>
                  <div style={styles.stepperQty}>{inCart.quantity}</div>
                  <button
                    style={styles.stepperBtn}
                    onClick={() => increment(item)}
                    disabled={inCart.quantity >= MAX_QTY_PER_ITEM}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button style={styles.addOnlyBtn} onClick={() => increment(item)}>
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>

      {cartLineCount > 0 && (
        <div style={styles.floatingCart}>
          <div style={styles.floatingCartInfo}>
            ตะกร้า: {cartLineCount} รายการ ({cartTotalQty} ชิ้น)
          </div>
          <button
            style={styles.submitButton}
            onClick={handleSubmitOrder}
            disabled={submitting}
          >
            {submitting ? 'กำลังส่ง...' : 'ส่งออเดอร์'}
          </button>
        </div>
      )}

      {showBillModal && session && (
        <div style={styles.overlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalTitle}>ยืนยันเรียกเก็บเงิน</div>
            <div style={styles.modalRow}>ผู้ใหญ่ {session.adult_count} คน × 289 บาท</div>
            <div style={styles.modalRow}>เด็ก {session.child_count} คน × 145 บาท</div>
            <div style={styles.modalTotal}>รวม {billAmount.toLocaleString()} บาท</div>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowBillModal(false)}
                disabled={closingBill}
              >
                ยกเลิก
              </button>
              <button
                style={styles.confirmBillButton}
                onClick={handleConfirmBill}
                disabled={closingBill}
              >
                {closingBill ? 'กำลังปิด...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}
