<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreIntegration extends Model
{
    protected $fillable = [
        'workspace_id',
        'provider',
        'api_key',
        'api_key_encrypted',
        'store_url',
        'is_active'
    ];

    protected $hidden = ['api_key_encrypted'];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function setApiKeyAttribute(?string $value): void
    {
        if (!empty($value)) {
            $this->attributes['api_key_encrypted'] = \Illuminate\Support\Facades\Crypt::encryptString($value);
        } else {
            $this->attributes['api_key_encrypted'] = null;
        }
    }

    public function getApiKeyAttribute(): ?string
    {
        if (empty($this->api_key_encrypted)) return null;
        try {
            return \Illuminate\Support\Facades\Crypt::decryptString($this->api_key_encrypted);
        } catch (\Throwable $e) {
            return null;
        }
    }
}
