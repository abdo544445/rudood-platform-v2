#!/bin/bash
echo "--- Testing public endpoints ---"
curl -s http://localhost:8000/api/v1/system/maintenance/status
echo ""

echo "--- Logging in as Admin ---"
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"admin@rudood.com","password":"password123"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "--- Turning on Maintenance Mode ---"
curl -s -X POST http://localhost:8000/api/v1/admin/maintenance/toggle -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"is_active":true,"message":"CLI Test","scheduled_end":"2026-12-12 12:12:12"}'
echo ""

echo "--- Testing public endpoint again ---"
curl -s http://localhost:8000/api/v1/system/maintenance/status
echo ""

echo "--- Testing protected endpoint (User/No Auth) ---"
curl -s http://localhost:8000/api/v1/bot/channels
echo ""

echo "--- Turning off Maintenance Mode ---"
curl -s -X POST http://localhost:8000/api/v1/admin/maintenance/toggle -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"is_active":false}'
echo ""
