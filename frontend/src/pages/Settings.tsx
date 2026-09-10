interface SettingsProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export default function Settings({ isDarkMode, onDarkModeToggle }: SettingsProps) {

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Cài đặt
      </h2>

      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Giao diện
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-700 dark:text-slate-200">
                Chế độ tối
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Giảm ánh sáng xanh, bảo vệ mắt
              </div>
            </div>
            <button
              onClick={onDarkModeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Thông báo
        </h3>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Thông báo sẽ được yêu cầu quyền khi bạn bắt đầu phiên học đầu tiên.
        </div>
      </div>
    </div>
  );
}
