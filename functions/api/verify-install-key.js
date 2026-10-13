export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders()
    });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, message: 'Method not allowed' }, 405);
  }

  try {
    const body = await request.json();
    const { key, browserHwid } = body || {};

    if (!key || !browserHwid) {
      return json({ ok: false, message: 'Thiếu key hoặc HWID' }, 400);
    }

    const upperKey = String(key).trim().toUpperCase();

    if (!upperKey.startsWith('INNOVA-')) {
      return json({ ok: false, message: 'Key không đúng định dạng INNOVA' }, 403);
    }

    if (/^INNOVA-\d+[HM]-/i.test(upperKey)) {
      return json({ ok: false, message: 'Key theo Giờ/Phút không hỗ trợ cài trực tiếp.' }, 403);
    }

    const validPlan = /^INNOVA-(1D|3D|7D|15D|30D|90D|365D)-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
    if (!validPlan.test(upperKey)) {
      return json({ ok: false, message: 'Key không hợp lệ. Format: INNOVA-1D-XXXX-XXXX-XXXX' }, 403);
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

    return json({
      ok: true,
      ticket: ticket,
      expiresTimeStr: expiresTimeStr,
      plan: plan,
      browserHwid: browserHwid.slice(0, 24)
    });

  } catch (err) {
    return json({ ok: false, message: 'Lỗi server: ' + err.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
