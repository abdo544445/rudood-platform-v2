<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\KnowledgeBase;
use App\Models\KnowledgeChunk;
use App\Models\AutoRule;
use App\Services\AiService;
use App\Services\RagService;
use Illuminate\Support\Facades\Storage;

class KnowledgeBaseController extends BaseApiController
{
    /**
     * List all knowledge base training documents.
     */
    public function documents(): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $documents = KnowledgeBase::withCount('chunks')
            ->where('bot_id', $bot->id)
            ->orderByDesc('created_at')
            ->get();

        $totalChunks = KnowledgeChunk::where('bot_id', $bot->id)->count();

        return $this->success([
            'documents'    => $documents,
            'total_chunks' => $totalChunks,
        ]);
    }

    /**
     * Upload, extract text, and automatically vectorize document into pgvector storage.
     */
    public function upload(Request $request): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,doc,docx|max:15360',
        ]);

        $file = $request->file('file');
        $name = $file->getClientOriginalName();
        $ext  = strtolower($file->getClientOriginalExtension());
        $path = $file->store('knowledge_bases', 'local');

        $text = '';
        $fullPath = Storage::disk('local')->path($path);

        if ($ext === 'txt') {
            $text = file_get_contents($fullPath);
        } elseif ($ext === 'pdf') {
            try {
                $parser = new \Smalot\PdfParser\Parser();
                $pdf    = $parser->parseFile($fullPath);
                $text   = $pdf->getText();
            } catch (\Exception $e) {
                $text = 'تعذر استخراج النص البرمجي من ملف الـ PDF. ' . $e->getMessage();
            }
        } elseif (in_array($ext, ['doc', 'docx'])) {
            try {
                $phpWord = \PhpOffice\PhpWord\IOFactory::load($fullPath);
                $sections = $phpWord->getSections();
                foreach ($sections as $section) {
                    $elements = $section->getElements();
                    foreach ($elements as $element) {
                        if (method_exists($element, 'getText')) {
                            $text .= $element->getText() . "\n";
                        }
                    }
                }
            } catch (\Exception $e) {
                $text = 'تعذر استخراج النص من ملف Word.';
            }
        }

        $text = trim($text);
        if (empty($text)) {
            $text = "مستند تم رفعه باسم: {$name}";
        }

        $doc = KnowledgeBase::create([
            'bot_id'        => $bot->id,
            'file_name'     => $name,
            'file_path'     => $path,
            'document_text' => $text,
            'status'        => 'processed',
        ]);

        $chunksCount = KnowledgeChunk::where('knowledge_base_id', $doc->id)->count();

        return $this->success([
            'document'     => $doc,
            'chunks_count' => $chunksCount,
        ], "تم رفع وتدريب وتجزئة المستند «{$name}» إلى ({$chunksCount}) مقطع بنجاح ✓", 201);
    }

    /**
     * Delete document and its vector chunks.
     */
    public function deleteDocument(int $id): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $doc = KnowledgeBase::where('id', $id)->where('bot_id', $bot->id)->firstOrFail();
        Storage::disk('local')->delete($doc->file_path);
        $doc->delete();

        return $this->success(null, 'تم حذف المستند ومقاطعه المتجهة بنجاح ✓');
    }

    /**
     * Reindex all documents for this bot into PostgreSQL vector database.
     */
    public function reindex(): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $docs = KnowledgeBase::where('bot_id', $bot->id)->get();
        $totalChunks = 0;

        foreach ($docs as $doc) {
            $chunks = $doc->syncChunksWithEmbeddings();
            $totalChunks += count($chunks);
        }

        return $this->success([
            'total_documents' => $docs->count(),
            'total_chunks'    => $totalChunks,
        ], "تمت إعادة فهرسة وتضمين ({$totalChunks}) مقطع بنجاح ✓");
    }

    /**
     * Extract structured FAQ pairs from document text using AI.
     */
    public function generateFaq(int $id): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $doc = KnowledgeBase::where('id', $id)->where('bot_id', $bot->id)->firstOrFail();

        $aiService = new AiService($bot);
        $faqs = $aiService->extractFaqFromDocument($doc->document_text);

        return $this->success([
            'document_id' => $doc->id,
            'file_name'   => $doc->file_name,
            'faqs'        => $faqs,
        ], 'تم استخراج الأسئلة الشائعة بنجاح ✓');
    }

    /**
     * List all instant keyword Auto-Rules.
     */
    public function autoRules(): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $rules = AutoRule::where('workspace_id', $workspace->id)->orderByDesc('created_at')->get();
        return $this->success($rules);
    }

    /**
     * Store or update instant keyword Auto-Rule.
     */
    public function storeAutoRule(Request $request): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $validated = $request->validate([
            'id'             => 'nullable|integer',
            'keywords'       => 'required|string',
            'reply'          => 'required|string|max:3000',
            'question'       => 'nullable|string|max:255',
            'match_type'     => 'nullable|string|in:contains,exact',
            'is_active'      => 'nullable|boolean',
        ]);

        $keywordsArray = array_values(array_filter(
            array_map('trim', explode(',', $validated['keywords']))
        ));

        if (empty($keywordsArray)) {
            return $this->error('يجب إدخال كلمة مفتاحية واحدة على الأقل');
        }

        $rule = AutoRule::updateOrCreate([
            'id'           => $validated['id'] ?? null,
            'workspace_id' => $workspace->id,
        ], [
            'keywords'     => $keywordsArray,
            'reply'        => $validated['reply'],
            'question'     => $validated['question'] ?? ($keywordsArray[0] ?? null),
            'match_type'   => $validated['match_type'] ?? 'contains',
            'is_active'    => $validated['is_active'] ?? true,
        ]);

        return $this->success($rule, 'تم حفظ قاعدة الرد التلقائي الفوري بنجاح ✓', 201);
    }

    /**
     * Delete an Auto-Rule.
     */
    public function deleteAutoRule(int $id): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        AutoRule::where('workspace_id', $workspace->id)->where('id', $id)->delete();
        return $this->success(null, 'تم حذف القاعدة بنجاح');
    }
}
