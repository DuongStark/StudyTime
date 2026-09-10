import { useState } from 'react';
import { getSessions } from '../api';

export default function Export() {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const sessions = await getSessions();
      const csv = [
        ['ID', 'Môn học', 'Bắt đầu', 'Kết thúc', 'Thời lượng (phút)'],
        ...sessions.map((s) => [
          s.id,
          s.subject,
          new Date(s.startedAt).toLocaleString('vi-VN'),
          new Date(s.endedAt).toLocaleString('vi-VN'),
          s.durationMinutes,
        ]),
      ]
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `study-sessions-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Xuất file thất bại');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Xuất dữ liệu
      </h2>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Xuất CSV
        </h3>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
          Tải xuống tất cả phiên học dưới dạng file CSV để phân tích trong Excel hoặc Google Sheets.
        </p>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {exporting ? 'Đang xuất...' : 'Xuất CSV'}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Sắp có
        </h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• Xuất JSON (cho backup)</li>
          <li>• Xuất PDF báo cáo tuần/tháng</li>
          <li>• Đồng bộ Google Calendar</li>
        </ul>
      </div>
    </div>
  );
}
