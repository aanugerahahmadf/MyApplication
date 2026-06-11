<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Product;
use App\Services\CBIRService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function byText(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:1',
        ]);

        $query = $request->input('query');

        $packages = Package::with(['media', 'category'])
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->get();

        $products = Product::with(['media', 'category'])
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'packages' => $packages,
                'products' => $products,
            ],
        ]);
    }

    public function byImage(Request $request, CBIRService $cbirService)
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $apiResponse = $cbirService->searchByImage($request->file('image'));
        $results = $apiResponse['results'] ?? [];

        if (isset($apiResponse['error']) || ! ($apiResponse['success'] ?? false)) {
            return response()->json([
                'status' => 'error',
                'data' => [],
                'message' => $apiResponse['message'] ?? __('Rekomendasi gambar belum ditemukan.'),
            ]);
        }

        $formattedResults = collect($results)->map(function (mixed $result) {
            $package = Package::find($result['owner_id'] ?? 0, ['*']);
            if (! $package) {
                return null;
            }

            return [
                'package' => $package,
                'score' => (float) ($result['score'] ?? 0),
                'similarity' => (float) ($result['similarity'] ?? 0),
                'matched_image' => $result['image_url'] ?? null,
            ];
        })->filter()->values();

        return response()->json([
            'status' => 'success',
            'data' => $formattedResults,
        ]);
    }
}
