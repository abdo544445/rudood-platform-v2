<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Authenticate as a normal user
$user = \App\Models\User::where('email', 'testuser123@example.com')->first();
if (!$user) {
    echo "Creating test user...\n";
    $user = \App\Models\User::create([
        'name' => 'Test',
        'email' => 'testuser123@example.com',
        'password' => bcrypt('password')
    ]);
}
$token = $user->createToken('test')->plainTextToken;

function request($uri, $method = 'GET', $token = null) {
    global $kernel;
    $request = Illuminate\Http\Request::create($uri, $method);
    if ($token) {
        $request->headers->set('Authorization', 'Bearer ' . $token);
    }
    $response = $kernel->handle($request);
    echo "[$method] $uri -> HTTP " . $response->getStatusCode() . "\n";
    return json_decode($response->getContent(), true);
}

// 1. Enable Maintenance Mode
echo "\n--- Enabling Maintenance Mode ---\n";
\App\Models\SystemSetting::setMaintenance(true, ['message' => 'Testing 123', 'scheduled_ends_at' => '2026-10-10 10:10:10']);

// 2. Test public endpoint
echo "\n--- Testing public endpoints ---\n";
request('/api/v1/system/maintenance/status');
request('/api/v1/auth/login', 'POST');

// 3. Test protected endpoint (as normal user)
echo "\n--- Testing protected endpoint (User) ---\n";
request('/api/v1/bot/channels', 'GET', $token);

// 4. Test protected endpoint (as admin)
echo "\n--- Testing protected endpoint (Super Admin) ---\n";
$admin = \App\Models\User::where('email', 'admin@rudood.com')->first();
$adminToken = $admin->createToken('admin')->plainTextToken;
request('/api/v1/admin/overview', 'GET', $adminToken);

// 5. Disable Maintenance Mode
echo "\n--- Disabling Maintenance Mode ---\n";
\App\Models\SystemSetting::setMaintenance(false);
request('/api/v1/bot/channels', 'GET', $token);

echo "\nDone.\n";
