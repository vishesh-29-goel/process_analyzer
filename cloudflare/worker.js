export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS Headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id, X-User-Role',
        };

        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // Root path handler for health check
            if (path === '/' || path === '') {
                return Response.json({ status: 'running', service: 'Pace API', version: '1.0.0' }, { headers: corsHeaders });
            }

            // Helper to get user context from headers (simplified for demo)
            const userId = request.headers.get('X-User-Id');
            const userRole = request.headers.get('X-User-Role') || 'customer';

            // --- HASHING HELPERS ---
            const hashPassword = async (password, salt) => {
                const encoder = new TextEncoder();
                const data = encoder.encode(password + salt);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            };

            const generateSalt = () => {
                const array = new Uint8Array(16);
                crypto.getRandomValues(array);
                return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
            };

            // --- AUTH ENDPOINTS ---
            if (path === '/api/auth/signup' && method === 'POST') {
                const { email, password, full_name, company_name } = await request.json();

                // Check if user exists
                const existing = await env.DB.prepare("SELECT id FROM profiles WHERE email = ?").bind(email).first();
                if (existing) {
                    return Response.json({ success: false, error: 'Email already exists' }, { status: 400, headers: corsHeaders });
                }

                const id = crypto.randomUUID();
                const salt = generateSalt();
                const hashedPassword = await hashPassword(password, salt);

                await env.DB.prepare(
                    "INSERT INTO profiles (id, full_name, company_name, email, password, salt, role) VALUES (?, ?, ?, ?, ?, ?, 'customer')"
                ).bind(id, full_name, company_name, email, hashedPassword, salt).run();

                return Response.json({
                    success: true,
                    user: { id, email, full_name, company_name, role: 'customer' }
                }, { headers: corsHeaders });
            }

            if (path === '/api/auth/login' && method === 'POST') {
                const { email, password } = await request.json();
                const profile = await env.DB.prepare("SELECT * FROM profiles WHERE email = ?").bind(email).first();

                if (!profile) {
                    return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
                }

                const inputHash = await hashPassword(password, profile.salt);
                if (inputHash !== profile.password) {
                    return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
                }

                return Response.json({ success: true, user: profile }, { headers: corsHeaders });
            }

            // --- PROCESS ENDPOINTS ---
            if (path === '/api/processes' && method === 'GET') {
                let query = "SELECT * FROM processes";
                let params = [];

                if (userRole !== 'admin') {
                    query += " WHERE user_id = ?";
                    params.push(userId);
                }

                query += " ORDER BY submitted_at DESC";

                const { results } = await env.DB.prepare(query).bind(...params).all();
                const parsedResults = results.map(r => ({
                    ...r,
                    challenges: JSON.parse(r.challenges || '[]'),
                    comm_channels: JSON.parse(r.comm_channels || '[]'),
                    impact: JSON.parse(r.impact || '{}'),
                    systems_detail: JSON.parse(r.systems_detail || '[]')
                }));
                return Response.json(parsedResults, { headers: corsHeaders });
            }

            if (path === '/api/processes' && method === 'POST') {
                const body = await request.json();
                const id = crypto.randomUUID();

                // Ensure user_id is set from header if not in body
                const targetUserId = userId || body.user_id;

                await env.DB.prepare(`
                    INSERT INTO processes (
                        id, name, description, company, industry,
                        team_activity, work_type, team_size, time_spent, monthly_volume, frequency,
                        automation_goals, challenges, bottleneck_effect, importance,
                        documentation_status, explainability, consistency_rate,
                        systems_count, systems_type, comm_channels,
                        status, user_id, impact, systems_detail
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?, ?)
                `).bind(
                    id,
                    body.name,
                    body.description,
                    body.company,
                    body.industry,
                    body.team_activity,
                    body.work_type,
                    body.team_size,
                    body.time_spent,
                    body.monthly_volume,
                    body.frequency,
                    body.automation_goals,
                    JSON.stringify(body.challenges || []),
                    body.bottleneck_effect,
                    body.importance,
                    body.documentation_status,
                    body.explainability,
                    body.consistency_rate,
                    body.systems_count,
                    body.systems_type,
                    JSON.stringify(body.comm_channels || []),
                    targetUserId,
                    JSON.stringify(body.impact || { financial: [], efficiency: [], accuracy: [] }),
                    JSON.stringify(body.systems_detail || [])
                ).run();
                return Response.json({ success: true, id }, { headers: corsHeaders });
            }

            if (path.startsWith('/api/processes/') && method === 'PUT') {
                const id = path.split('/').pop();
                const body = await request.json();

                // Simple Auth check for PUT
                const existing = await env.DB.prepare("SELECT user_id FROM processes WHERE id = ?").bind(id).first();
                if (!existing) return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });

                if (userRole !== 'admin' && existing.user_id !== userId) {
                    return Response.json({ error: 'Unauthorized' }, { status: 403, headers: corsHeaders });
                }

                if (userRole === 'admin') {
                    // Admins can update everything
                    await env.DB.prepare(`
                        UPDATE processes SET 
                            name = ?, description = ?, industry = ?, status = ?, 
                            recommendation = ?, priority = ?, value_score = ?,
                            feasibility_score = ?, priority_signal = ?, action_signal = ?,
                            impact = ?, systems_detail = ?, potential_value = ? 
                        WHERE id = ?
                    `).bind(
                        body.name, body.description, body.industry, body.status,
                        body.recommendation, body.priority, body.value_score,
                        body.feasibility_score, body.priority_signal, body.action_signal,
                        JSON.stringify(body.impact), JSON.stringify(body.systems_detail),
                        body.potential_value, id
                    ).run();
                } else {
                    // Customers can only update basic fields
                    await env.DB.prepare(`
                        UPDATE processes SET name = ?, description = ?, industry = ?
                        WHERE id = ?
                    `).bind(body.name, body.description, body.industry, id).run();
                }
                return Response.json({ success: true }, { headers: corsHeaders });
            }

            // --- ADMIN MANAGEMENT ---
            if (path.startsWith('/api/admin/promote/') && method === 'PUT') {
                const targetId = path.split('/').pop();
                const { role } = await request.json();

                // Only existing admins can promote others
                if (userRole !== 'admin') {
                    return Response.json({ error: 'Unauthorized' }, { status: 403, headers: corsHeaders });
                }

                await env.DB.prepare("UPDATE profiles SET role = ? WHERE id = ?").bind(role, targetId).run();
                return Response.json({ success: true }, { headers: corsHeaders });
            }

            // --- PASSWORD RESET ---
            if (path === '/api/auth/reset-password' && method === 'POST') {
                const { email, password } = await request.json();

                const profile = await env.DB.prepare("SELECT id FROM profiles WHERE email = ?").bind(email).first();
                if (!profile) {
                    return Response.json({ success: false, error: 'Email not found' }, { status: 404, headers: corsHeaders });
                }

                const salt = generateSalt();
                const hashedPassword = await hashPassword(password, salt);

                await env.DB.prepare("UPDATE profiles SET password = ?, salt = ? WHERE email = ?")
                    .bind(hashedPassword, salt, email).run();

                return Response.json({ success: true }, { headers: corsHeaders });
            }

            return new Response("Not Found", { status: 404, headers: corsHeaders });

        } catch (err) {
            return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
        }
    }
};
