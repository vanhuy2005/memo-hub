import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { cardService } from "../services";

export default function ImportCards() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { success, error, warning } = useToast();
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (
      !selectedFile.name.endsWith(".csv") &&
      !selectedFile.name.endsWith(".txt")
    ) {
      warning("⚠️ Vui lòng chọn file CSV hoặc TXT");
      return;
    }

    setFile(selectedFile);

    // Read and preview file
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      parseCSV(text);
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const cards = [];

    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      // Support formats: "front,back" or "front;back" or "front|back" or "front\tback"
      const parts = line.split(/[,;\t|]/).map((p) => p.trim());

      if (parts.length >= 2) {
        cards.push({
          front: parts[0],
          back: parts[1],
          pronunciation: parts[2] || "",
          example: parts[3] || "",
        });
      }
    }

    setPreview(cards);
  };

  const handleImport = async () => {
    if (!file) {
      error("✏️ Vui lòng chọn file");
      return;
    }

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        const lines = text.split("\n").filter((line) => line.trim());

        let successCount = 0;
        let errorCount = 0;

        for (const line of lines) {
          const parts = line.split(/[,;\t|]/).map((p) => p.trim());

          if (parts.length >= 2) {
            try {
              await cardService.createCard(deckId, {
                front_content: parts[0],
                back_content: parts[1],
                pronunciation: parts[2] || "",
                example_sentence: parts[3] || "",
              });
              successCount++;
            } catch (error) {
              console.error("Error importing card:", error);
              errorCount++;
            }
          }
        }

        if (successCount > 0) {
          success(
            `✨ Nhập thành công ${successCount} thẻ${
              errorCount > 0 ? `, ${errorCount} thẻ lỗi` : ""
            }!`
          );
        } else {
          error("😢 Không có thẻ nào được nhập thành công");
        }
        setTimeout(() => navigate(`/decks/${deckId}`), 500);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error("Error importing cards:", err);
      error("😢 Có lỗi xảy ra khi nhập thẻ");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <button
            onClick={() => navigate(`/decks/${deckId}`)}
            className="text-gray-800 dark:text-gray-200 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">
              arrow_back
            </span>
          </button>
          <h1 className="text-lg lg:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-gray-900 dark:text-white pr-10">
            Nhập thẻ từ File
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 lg:p-6 space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            Hướng dẫn định dạng file
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Mỗi dòng là một thẻ</li>
            <li>
              • Định dạng:{" "}
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                Mặt trước, Mặt sau, Phiên âm (tùy chọn), Ví dụ (tùy chọn)
              </code>
            </li>
            <li>
              • Có thể dùng dấu phân cách: dấu phẩy (,), chấm phẩy (;), tab hoặc
              gạch dọc (|)
            </li>
            <li>
              • Ví dụ:{" "}
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                Hello, Xin chào, /həˈloʊ/, Hello everyone!
              </code>
            </li>
          </ul>
        </div>

        {/* File Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex flex-col items-center justify-center py-4">
              <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500 mb-3">
                upload_file
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {file ? file.name : "Nhấp để chọn file CSV hoặc TXT"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Hỗ trợ file .csv và .txt
              </p>
            </div>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-4">
              Xem trước (5 thẻ đầu tiên)
            </h3>
            <div className="space-y-3">
              {preview.map((card, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                        Mặt trước
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {card.front}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                        Mặt sau
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {card.back}
                      </p>
                    </div>
                  </div>
                  {(card.pronunciation || card.example) && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                      {card.pronunciation && (
                        <p>Phiên âm: {card.pronunciation}</p>
                      )}
                      {card.example && <p>Ví dụ: {card.example}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="w-full py-4 bg-primary text-gray-900 rounded-full font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importing ? "Đang nhập..." : "Nhập thẻ vào bộ từ"}
        </button>
      </main>
    </div>
  );
}
