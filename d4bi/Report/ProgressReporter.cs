using Konsole;

namespace Importer.Report
{
    internal class ProgressReporter
    {
        private readonly ProgressBar _progressBar;
        private readonly object _lock;

        public ProgressReporter(IConsole console, string name, int maxValue)
        {
            Name = name;
            MaxValue = maxValue;
            _lock = new object();
            _progressBar = new ProgressBar(console, PbStyle.DoubleLine, MaxValue);
            _progressBar.Refresh(0, GenerateMessage());
        }

        public string Name { get; }
        public int CurrentValue { get; private set; }
        public int MaxValue { get; private set; }

        public void ReportNext(string? message = null)
        {
            lock (_lock)
            {
                CurrentValue++;

                if (CurrentValue > MaxValue)
                    AddMaxValue(CurrentValue - MaxValue);

                _progressBar.Refresh(CurrentValue, GenerateMessage(message));
            }
        }

        public void Complete()
        {
            lock (_lock)
                _progressBar.Refresh(MaxValue, GenerateMessage("Complete"));
        }

        public void AddMaxValue(int value)
        {
            lock (_lock)
            {
                MaxValue += value;
                _progressBar.Max = MaxValue;
            }
        }

        private string GenerateMessage(string? message = null)
        {
            if (string.IsNullOrEmpty(message))
                return Name;

            return $"{Name} - {message}";
        }
    }
}
