<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    die("Access denied. Admin only.");
}

include('db_connection.php');

// Clear previous matches to avoid duplicates
$conn->query("DELETE FROM matches");

// Fetch all lost items
$lostItemsResult = $conn->query("SELECT * FROM lost_items");

while ($lostItem = $lostItemsResult->fetch_assoc()) {
    $lostId = $lostItem['id'];
    $lostName = strtolower($lostItem['item_name']);
    $lostCategory = strtolower($lostItem['category']);
    $lostDesc = strtolower($lostItem['description']);
    
    // Fetch found items in the same category
    $stmt = $conn->prepare("SELECT * FROM found_items WHERE LOWER(category) = ?");
    $stmt->bind_param("s", $lostCategory);
    $stmt->execute();
    $foundItemsResult = $stmt->get_result();
    
    while ($foundItem = $foundItemsResult->fetch_assoc()) {
        $foundId = $foundItem['id'];
        $foundName = strtolower($foundItem['item_name']);
        $foundDesc = strtolower($foundItem['description']);
        
        // Calculate similarity percentages
        similar_text($lostName, $foundName, $percentName);
        similar_text($lostDesc, $foundDesc, $percentDesc);
        
        // Weighted similarity score
        $similarity = ($percentName * 0.7) + ($percentDesc * 0.3);
        
        if ($similarity >= 60) { // Threshold 60%
            $insertStmt = $conn->prepare("INSERT INTO matches (lost_item_id, found_item_id, similarity_score, created_at) VALUES (?, ?, ?, NOW())");
            $insertStmt->bind_param("iid", $lostId, $foundId, $similarity);
            $insertStmt->execute();
            $insertStmt->close();
        }
    }
    $stmt->close();
}

$conn->close();

// Redirect back with success message
header("Location: view_matches.php?match=success");
exit;
?>
