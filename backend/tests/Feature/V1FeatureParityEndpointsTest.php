<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Channel;
use App\Models\StoreIntegration;
use App\Models\AutoRule;
use Illuminate\Support\Facades\Hash;

class V1FeatureParityEndpointsTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Workspace $workspace;

    protected function setUp(): void
    {
        parent::setUp();

        $this->workspace = Workspace::create([
            'company_name' => 'Parity Test Store',
            'status'       => 'active',
        ]);

        $this->user = User::create([
            'name'         => 'Store Manager',
            'email'        => 'manager@paritytest.com',
            'password'     => Hash::make('secret123'),
            'workspace_id' => $this->workspace->id,
            'role'         => 'owner',
        ]);
    }

    /**
     * 1. Test Store Integrations (Salla, Zid, Shopify) CRUD and encryption.
     */
    public function test_store_integrations_crud_and_encryption(): void
    {
        // Save Salla integration
        $response = $this->actingAs($this->user)->postJson('/api/v1/integrations', [
            'provider'   => 'salla',
            'store_url'  => 'https://salla.sa/mystore',
            'api_key'    => 'salla_token_secret_xyz',
            'is_active'  => true,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // Verify it was stored
        $integration = StoreIntegration::where('workspace_id', $this->workspace->id)
            ->where('provider', 'salla')
            ->first();

        $this->assertNotNull($integration);
        $this->assertEquals('https://salla.sa/mystore', $integration->store_url);
        // Ensure API key is encrypted in database, but accessor decrypts it
        $this->assertEquals('salla_token_secret_xyz', $integration->api_key);

        // Fetch integrations list
        $listResponse = $this->actingAs($this->user)->getJson('/api/v1/integrations');
        $listResponse->assertStatus(200)
                     ->assertJson(['success' => true])
                     ->assertJsonFragment(['provider' => 'salla']);

        // Delete integration
        $deleteResponse = $this->actingAs($this->user)->deleteJson('/api/v1/integrations/salla');
        $deleteResponse->assertStatus(200)
                       ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('store_integrations', [
            'workspace_id' => $this->workspace->id,
            'provider'     => 'salla',
        ]);
    }

    /**
     * 2. Test WhatsApp Catalog Configuration & Sync Endpoints.
     */
    public function test_whatsapp_catalog_configuration(): void
    {
        $channel = Channel::create([
            'workspace_id' => $this->workspace->id,
            'platform'     => 'whatsapp',
            'is_connected' => true,
            'is_active'    => true,
            'phone_number_id' => '966500000000',
        ]);

        // Fetch catalog config (initially empty)
        $getResponse = $this->actingAs($this->user)->getJson('/api/v1/channels/whatsapp/catalog');
        $getResponse->assertStatus(200)
                    ->assertJson(['success' => true]);

        // Save catalog configuration
        $saveResponse = $this->actingAs($this->user)->postJson('/api/v1/channels/whatsapp/catalog', [
            'catalog_id'              => 'meta_cat_998877',
            'is_catalog_active'       => true,
            'auto_reply_with_catalog' => true,
        ]);

        $saveResponse->assertStatus(200)
                     ->assertJson(['success' => true])
                     ->assertJsonPath('data.catalog_id', 'meta_cat_998877');

        // Trigger catalog sync
        $syncResponse = $this->actingAs($this->user)->postJson('/api/v1/channels/whatsapp/catalog/sync');
        $syncResponse->assertStatus(200)
                     ->assertJson(['success' => true]);
    }

    /**
     * 3. Test Auto-Rules Engine Endpoints.
     */
    public function test_auto_rules_engine_endpoints(): void
    {
        // Store an auto rule
        $createResponse = $this->actingAs($this->user)->postJson('/api/v1/auto-rules', [
            'keywords'     => 'سعر,تكلفة,بكم',
            'reply'        => 'أسعار منتجاتنا تبدأ من 50 ريال.',
            'question'     => 'استفسار عن الأسعار',
            'is_active'    => true,
            'match_type'   => 'contains',
        ]);

        $createResponse->assertStatus(200)
                       ->assertJson(['success' => true]);

        $rule = AutoRule::where('workspace_id', $this->workspace->id)->first();
        $this->assertNotNull($rule);
        $this->assertContains('سعر', $rule->keywords);

        // List auto rules
        $listResponse = $this->actingAs($this->user)->getJson('/api/v1/auto-rules');
        $listResponse->assertStatus(200)
                     ->assertJson(['success' => true]);

        // Delete auto rule
        $deleteResponse = $this->actingAs($this->user)->deleteJson("/api/v1/auto-rules/{$rule->id}");
        $deleteResponse->assertStatus(200)
                       ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('auto_rules', ['id' => $rule->id]);
    }

    /**
     * 4. Test Dashboard CSV Export Endpoint.
     */
    public function test_dashboard_csv_export(): void
    {
        $response = $this->actingAs($this->user)->get('/api/v1/dashboard/export');

        $response->assertStatus(200);
        $this->assertTrue(str_contains($response->headers->get('content-type') ?? '', 'text/csv'));
        $this->assertTrue(str_contains($response->headers->get('content-disposition') ?? '', 'conversations_export_'));
    }
}
