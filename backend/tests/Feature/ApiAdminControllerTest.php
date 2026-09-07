<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Workspace;
use App\Models\SubscriberRequest;
use App\Models\Article;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Hash;

class ApiAdminControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $regularOwner;

    protected function setUp(): void
    {
        parent::setUp();

        $workspace1 = Workspace::create(['company_name' => 'HQ', 'status' => 'active']);
        $this->superAdmin = User::create([
            'name'         => 'Super Admin',
            'email'        => 'admin@rudood.com',
            'password'     => Hash::make('password123'),
            'workspace_id' => $workspace1->id,
            'role'         => 'super_admin',
        ]);

        $workspace2 = Workspace::create(['company_name' => 'Store Co', 'status' => 'active']);
        $this->regularOwner = User::create([
            'name'         => 'Regular Owner',
            'email'        => 'owner@store.com',
            'password'     => Hash::make('password123'),
            'workspace_id' => $workspace2->id,
            'role'         => 'owner',
        ]);
    }

    public function test_unauthorized_users_cannot_access_admin_overview()
    {
        $response = $this->actingAs($this->regularOwner)->getJson('/api/v1/admin/overview');
        $response->assertStatus(403);
    }

    public function test_super_admin_can_access_overview()
    {
        $response = $this->actingAs($this->superAdmin)->getJson('/api/v1/admin/overview');
        
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'total_workspaces',
                         'active_workspaces',
                         'total_users',
                         'total_bots',
                         'recent_workspaces',
                         'system_health'
                     ]
                 ]);
    }

    public function test_super_admin_can_view_subscribers()
    {
        SubscriberRequest::create([
            'name' => 'John Doe',
            'email' => 'john@test.com',
            'phone' => '1234567890',
            'company_name' => 'John Store',
            'status' => 'pending'
        ]);

        $response = $this->actingAs($this->superAdmin)->getJson('/api/v1/admin/subscribers');
        
        $response->assertStatus(200)
                 ->assertJsonPath('data.stats.total', 1);
    }

    public function test_super_admin_can_approve_subscriber()
    {
        $sub = SubscriberRequest::create([
            'name' => 'Jane Doe',
            'email' => 'jane@test.com',
            'phone' => '0987654321',
            'company_name' => 'Jane Store',
            'status' => 'pending'
        ]);

        $response = $this->actingAs($this->superAdmin)->postJson("/api/v1/admin/subscribers/{$sub->id}/approve", [
            'admin_notes' => 'Approved'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);
        
        $this->assertDatabaseHas('workspaces', [
            'company_name' => 'Jane Store'
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'jane@test.com'
        ]);
    }

    public function test_super_admin_can_view_workspaces()
    {
        $response = $this->actingAs($this->superAdmin)->getJson('/api/v1/admin/workspaces');
        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => ['workspaces']]);
    }

    public function test_super_admin_can_view_users()
    {
        $response = $this->actingAs($this->superAdmin)->getJson('/api/v1/admin/users');
        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => ['users']]);
    }

    public function test_super_admin_can_view_articles()
    {
        Article::create([
            'title' => 'Test Article',
            'slug' => 'test-article',
            'content' => 'Content here',
            'author_id' => $this->superAdmin->id,
            'is_published' => true
        ]);

        $response = $this->actingAs($this->superAdmin)->getJson('/api/v1/admin/articles');
        $response->assertStatus(200)
                 ->assertJsonPath('data.articles.0.title', 'Test Article');
    }

    public function test_super_admin_can_access_database_explorer()
    {
        $response = $this->actingAs($this->superAdmin)->getJson('/api/v1/admin/database/explorer');
        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => ['driver', 'tables', 'total_records']]);
    }

    public function test_super_admin_can_view_contacts()
    {
        ContactMessage::create([
            'name' => 'Alice',
            'email' => 'alice@test.com',
            'subject' => 'Help',
            'message' => 'I need help',
            'status' => 'new'
        ]);

        $response = $this->actingAs($this->superAdmin)->getJson('/api/v1/admin/contacts');
        $response->assertStatus(200)
                 ->assertJsonPath('data.stats.total', 1);
    }
}
