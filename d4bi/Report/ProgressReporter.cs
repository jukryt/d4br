using ShellProgressBar;

namespace Importer.Report
{
    internal class ProgressReporter : IDisposable
    {
        public static ProgressReporter CreateMainReporter(string name)
        {
            var progressBar = ProgressBarFactory.CreateProgressBar(name);
            return new ProgressReporter(progressBar);
        }

        public static ProgressReporter CreateChildReporter(ProgressReporter mainReporter, string name)
        {
            var progressBar = ProgressBarFactory.CreateChildProgressBar(mainReporter._progressBar, name);
            mainReporter.IncrementMaxValue();
            return new ProgressReporter(progressBar, () => mainReporter.ReportNext());
        }

        private readonly IProgressBar _progressBar;
        private readonly Action? _completeCallBack;
        private readonly object _lock;

        private ProgressReporter(IProgressBar progressBar, Action? completeCallBack = null)
        {
            _progressBar = progressBar;
            _completeCallBack = completeCallBack;
            _lock = new object();

            Name = progressBar.Message;
            MaxValue = progressBar.MaxTicks;
        }

        public string Name { get; }
        public int CurrentValue { get; private set; }
        public int MaxValue { get; private set; }

        public void UpdateMessage(string? message = null)
        {
            _progressBar.Message = GenerateMessage(message);
        }

        public void ReportNext(string? message = null)
        {
            lock (_lock)
            {
                CurrentValue++;

                if (CurrentValue > MaxValue)
                    IncrementMaxValue(CurrentValue - MaxValue);

                _progressBar.Tick(CurrentValue, GenerateMessage(message));
            }
        }

        public void Complete()
        {
            _progressBar.Tick(MaxValue, GenerateMessage("Complete"));
            _completeCallBack?.Invoke();
        }

        public void IncrementMaxValue(int value = 1)
        {
            lock (_lock)
            {
                MaxValue += value;
                _progressBar.MaxTicks = MaxValue;
            }
        }

        private string GenerateMessage(string? message = null)
        {
            var result = $"{Name,-20} ({CurrentValue} of {MaxValue})";

            if (!string.IsNullOrEmpty(message))
                result = $"{result} - {message}";

            return result;
        }

        public void Dispose()
        {
            _progressBar.Dispose();
        }
    }
}
