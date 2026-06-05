import { sql } from '@vercel/postgres';

export async function POST(request) {
  try {
    const { name, phone, project_type, message } = await request.json();
    
    if (!name || !phone || !project_type) {
      return new Response(
        JSON.stringify({ success: false, message: '缺少必填字段' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    await sql`
      INSERT INTO contacts (name, phone, project_type, message)
      VALUES (${name}, ${phone}, ${project_type}, ${message})
    `;
    
    return new Response(
      JSON.stringify({ success: true, message: '提交成功' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('保存失败:', error);
    return new Response(
      JSON.stringify({ success: false, message: '服务器内部错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  try {
    const result = await sql`SELECT * FROM contacts ORDER BY created_at DESC`;
    return new Response(
      JSON.stringify({ success: true, data: result.rows }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: '服务器内部错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}