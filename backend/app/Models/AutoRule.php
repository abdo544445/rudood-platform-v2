<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AutoRule extends Model
{
    protected $fillable = ['workspace_id', 'question', 'keywords', 'trigger_condition', 'reply_template', 'reply', 'is_active'];

    protected $casts = [
        'keywords' => 'array',
        'is_active' => 'boolean',
    ];

    public function setReplyAttribute($value): void
    {
        $this->attributes['reply_template'] = $value;
    }

    public function getReplyAttribute(): ?string
    {
        return $this->attributes['reply_template'] ?? null;
    }
}
