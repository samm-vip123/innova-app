export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    const { key, browserHwid } = req.body || {};

    if (!key || !browserHwid) {
      return res.status(400).json({ ok: false, message: 'Thiếu key hoặc HWID' });
    }

    const upperKey = String(key).trim().toUpperCase();

    if (!upperKey.startsWith('INNOVA-')) {
      return res.status(403).json({ ok: false, message: 'Key không đúng định dạng INNOVA' });
    }

    if (/^INNOVA-\d+[HM]-/i.test(upperKey)) {
      return res.status(403).json({
        ok: false,
        message: 'Key theo Giờ/Phút không hỗ trợ cài trực tiếp. Vui lòng dùng key 1D trở lên.'
      });
    }

    const validPlan = /^INNOVA-(1D|3D|7D|15D|30D|90D|365D)-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
    if (!validPlan.test(upperKey)) {
      return res.status(403).json({
        ok: false,
        message: 'Key không hợp lệ. Format: INNOVA-1D-XXXX-XXXX-XXXX'
      });
    }

    const planMatch = upperKey.match(/^INNOVA-(\d+D)-/i);
    const plan = planMatch ? planMatch[1].toUpperCase() : '1D';
    const planDays = parseInt(plan.replace('D', ''), 10) || 1;

    const expiresAt = Date.now() + planDays * 24 * 60 * 60 * 1000;
    const expiresTimeStr = new Date(expiresAt).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const ticket = 'TK-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10).toUpperCase();

    return res.status(200).json({
      ok: true,
      ticket: ticket,
      expiresTimeStr: expiresTimeStr,
      plan: plan,
      browserHwid: browserHwid.slice(0, 24)
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Lỗi server: ' + (err && err.message ? err.message : String(err))
    });
  }
}
