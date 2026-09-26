'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const styles = {
  page: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '2rem 1.25rem',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.4rem',
  },
  input: {
    width: '100%',
    fontSize: '1.4rem',
    padding: '0.6rem 0.75rem',
    borderRadius: 8,
    border: '2px solid #ccc',
    marginBottom: '1.25rem',
    boxSizing: 'border-box',
  },
  primaryButton: {
    width: '100%',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    padding: '0.9rem',
    borderRadius: 10,
    border: 'none',
    background: '#16a34a',
    color: '#fff',
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    fontSize: '1.1rem',
    padding: '0.75rem',
    borderRadius: 10,
    border: '2px solid #999',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
    marginTop: '0.75rem',
  },
  warningBox: {
    background: '#fef2f2',
    border: '3px solid #dc2626',
    borderRadius: 12,
    padding: '1.25rem',
    marginBottom: '1.5rem',
  },
  warningTitle: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: '0.75rem',
  },
  warningButton: {
    width: '100%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '0.85rem',
    borderRadius: 10,
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '0.75rem',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 50,
  },
  confirmBox: {
    background: '#fff',
    borderRadius: 14,
    padding: '1.5rem',
    maxWidth: 400,
    width: '100%',
    border: '3px solid #ea580c',
  },
  confirmTitle: {
    color: '#c2410c',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  confirmRow: {
    fontSize: '1.15rem',
    marginBottom: '0.4rem',
  },
  confirmActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.25rem',
  },
  cancelButton: {
    flex: 1,
    fontSize: '1.1rem',
    padding: '0.8rem',
    borderRadius: 10,
    border: '2px solid #999',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
  },
  confirmCloseButton: {
    flex: 1,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    padding: '0.8rem',
    borderRadius: 10,
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
  },
  resultBox: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  resultSummary: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  linkText: {
    fontSize: '1rem',
    wordBreak: 'break-all',
    color: '#1d4ed8',
  },
  copyButton: {
    fontSize: '0.95rem',
    padding: '0.4rem 0.75rem',
    borderRadius: 8,
    border: '1px solid #999',
    background: '#f3f4f6',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
};

const EMPTY_FORM = { tableNumber: '', adultCount: '', childCount: '' };

export default function GenerateQrPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // แถว session เดิมที่ยังเปิดอยู่ (ถ้ามี) — ใช้แสดงกล่องเตือน
  const [existingSession, setExistingSession] = useState(null);

  // ควบคุมกล่องยืนยันปิดโต๊ะเดิม
  const [showConfirm, setShowConfirm] = useState(false);
  const [closing, setClosing] = useState(false);

  // ผลลัพธ์ QR หลังเปิดโต๊ะสำเร็จ
  const [qrResult, setQrResult] = useState(null);
  const [copied, setCopied] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetAll() {
    setForm(EMPTY_FORM);
    setErrorMsg('');
    setExistingSession(null);
    setShowConfirm(false);
    setQrResult(null);
    setCopied(false);
  }

  function minutesSince(createdAt) {
    const created = new Date(createdAt).getTime();
    const diffMs = Date.now() - created;
    return Math.max(0, Math.floor(diffMs / 60000));
  }

  function buildOrderUrl(tableNumber) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/order/${tableNumber}`;
  }

  async function handleOpenTable() {
    setErrorMsg('');

    const tableNum = parseInt(form.tableNumber, 10);
    const adultNum = parseInt(form.adultCount, 10);
    const childNum = parseInt(form.childCount, 10);

    if (!Number.isInteger(tableNum) || tableNum <= 0) {
      setErrorMsg('กรุณากรอกเลขโต๊ะให้ถูกต้อง');
      return;
    }
    if (!Number.isInteger(adultNum) || adultNum < 0) {
      setErrorMsg('กรุณากรอกจำนวนผู้ใหญ่ให้ถูกต้อง');
      return;
    }
    if (!Number.isInteger(childNum) || childNum < 0) {
      setErrorMsg('กรุณากรอกจำนวนเด็กให้ถูกต้อง');
      return;
    }

    setLoading(true);
    try {
      // เช็คว่าโต๊ะนี้มี session ที่ยัง open อยู่หรือไม่
      const { data: existing, error: selectError } = await supabase
        .from('sessions')
        .select('id, adult_count, child_count, created_at')
        .eq('table_number', tableNum)
        .eq('status', 'open')
        .maybeSingle();

      if (selectError) {
        setErrorMsg('เกิดข้อผิดพลาดในการตรวจสอบโต๊ะ: ' + selectError.message);
        return;
      }

      if (existing) {
        // มี session เปิดค้างอยู่แล้ว -> แสดงกล่องเตือนแทนการสร้างใหม่
        setExistingSession({ ...existing, table_number: tableNum });
        setQrResult(null);
        return;
      }

      // ไม่มี session เปิดอยู่ -> สร้างใหม่
      const { data: inserted, error: insertError } = await supabase
        .from('sessions')
        .insert({
          table_number: tableNum,
          adult_count: adultNum,
          child_count: childNum,
          status: 'open',
        })
        .select()
        .single();

      if (insertError) {
        setErrorMsg('เปิดโต๊ะไม่สำเร็จ: ' + insertError.message);
        return;
      }

      const url = buildOrderUrl(tableNum);
      setQrResult({
        tableNumber: tableNum,
        adultCount: adultNum,
        childCount: childNum,
        url,
        sessionId: inserted.id,
      });
      setExistingSession(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmCloseOld() {
    if (!existingSession) return;
    setClosing(true);
    setErrorMsg('');
    try {
      const { data: updated, error: updateError } = await supabase
        .from('sessions')
        .update({ status: 'closed' })
        .eq('id', existingSession.id)
        .eq('status', 'open') // กันกดซ้ำซ้อน/ปิดไปแล้วจากที่อื่น
        .select();

      if (updateError) {
        setErrorMsg('ปิดโต๊ะเดิมไม่สำเร็จ: ' + updateError.message);
        return;
      }

      if (!updated || updated.length === 0) {
        setErrorMsg('โต๊ะนี้ถูกปิดไปแล้วจากที่อื่น กรุณากด "เปิดโต๊ะ" อีกครั้ง');
        setExistingSession(null);
        setShowConfirm(false);
        return;
      }

      // ปิดสำเร็จ -> เอากล่องเตือน/ยืนยันออก กลับไปที่ฟอร์มเดิม (ค่าที่กรอกไว้ยังอยู่)
      setShowConfirm(false);
      setExistingSession(null);
    } finally {
      setClosing(false);
    }
  }

  async function handleCopyLink() {
    if (!qrResult) return;
    try {
      await navigator.clipboard.writeText(qrResult.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setErrorMsg('คัดลอกลิงก์ไม่สำเร็จ กรุณาคัดลอกด้วยตนเอง');
    }
  }

  const qrImageUrl = qrResult
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        qrResult.url
      )}`
    : null;

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>เปิดโต๊ะลูกค้า</h1>

      {errorMsg && <div style={styles.errorText}>{errorMsg}</div>}

      {existingSession && !qrResult && (
        <div style={styles.warningBox}>
          <div style={styles.warningTitle}>
            โต๊ะนี้มีลูกค้าอยู่ระหว่างทานอาหาร กรุณาปิดออเดอร์เดิมก่อน
          </div>
          <div>
            โต๊ะ {existingSession.table_number} · ผู้ใหญ่ {existingSession.adult_count} · เด็ก{' '}
            {existingSession.child_count}
          </div>
          <div>เปิดมาแล้ว {minutesSince(existingSession.created_at)} นาที</div>
          <button
            style={styles.warningButton}
            onClick={() => setShowConfirm(true)}
          >
            ปิดออเดอร์เดิม
          </button>
        </div>
      )}

      {!qrResult && (
        <>
          <label style={styles.label}>เลขโต๊ะ</label>
          <input
            style={styles.input}
            type="number"
            inputMode="numeric"
            value={form.tableNumber}
            onChange={(e) => updateField('tableNumber', e.target.value)}
            placeholder="เช่น 7"
          />

          <label style={styles.label}>จำนวนผู้ใหญ่</label>
          <input
            style={styles.input}
            type="number"
            inputMode="numeric"
            value={form.adultCount}
            onChange={(e) => updateField('adultCount', e.target.value)}
            placeholder="เช่น 2"
          />

          <label style={styles.label}>จำนวนเด็ก</label>
          <input
            style={styles.input}
            type="number"
            inputMode="numeric"
            value={form.childCount}
            onChange={(e) => updateField('childCount', e.target.value)}
            placeholder="เช่น 1"
          />

          <button
            style={styles.primaryButton}
            onClick={handleOpenTable}
            disabled={loading}
          >
            {loading ? 'กำลังเปิดโต๊ะ...' : 'เปิดโต๊ะ'}
          </button>
        </>
      )}

      {qrResult && (
        <div style={styles.resultBox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImageUrl} alt={`QR สำหรับโต๊ะ ${qrResult.tableNumber}`} width={300} height={300} />
          <div style={styles.resultSummary}>
            โต๊ะ {qrResult.tableNumber} · ผู้ใหญ่ {qrResult.adultCount} · เด็ก {qrResult.childCount}
          </div>
          <div style={styles.linkRow}>
            <span style={styles.linkText}>{qrResult.url}</span>
            <button style={styles.copyButton} onClick={handleCopyLink}>
              {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกลิงก์'}
            </button>
          </div>
          <button style={styles.secondaryButton} onClick={resetAll}>
            เปิดโต๊ะใหม่
          </button>
        </div>
      )}

      {showConfirm && existingSession && (
        <div style={styles.overlay}>
          <div style={styles.confirmBox}>
            <div style={styles.confirmTitle}>ยืนยันปิดโต๊ะเดิม?</div>
            <div style={styles.confirmRow}>โต๊ะ: {existingSession.table_number}</div>
            <div style={styles.confirmRow}>
              ผู้ใหญ่ {existingSession.adult_count} · เด็ก {existingSession.child_count}
            </div>
            <div style={styles.confirmRow}>
              เปิดมาแล้ว {minutesSince(existingSession.created_at)} นาที
            </div>
            <div style={styles.confirmActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowConfirm(false)}
                disabled={closing}
              >
                ยกเลิก
              </button>
              <button
                style={styles.confirmCloseButton}
                onClick={handleConfirmCloseOld}
                disabled={closing}
              >
                {closing ? 'กำลังปิด...' : 'ยืนยันปิดโต๊ะเดิม'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
