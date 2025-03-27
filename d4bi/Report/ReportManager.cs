using Konsole;

namespace Importer.Report
{
    internal class ReportManager
    {
        public static ReportManager Instance { get; } = new ReportManager();

        private readonly IConsole _console;
        private readonly IConsole _progressWindow;

        private ReportManager()
        {
            _console = new ConcurrentWriter();
            _progressWindow = _console.OpenBox("Progress");
        }

        public ProgressReporter CreateProgressReporter(string name, int maxValue)
        {
            return new ProgressReporter(_progressWindow, name, maxValue);
        }

        public IMessageReporter CreateMessageReporter()
        {
            return new CombineMessageReporter(
#if DEBUG
                new DebugMessageReporter(),
#endif
                new ConsoleMessageReporter(_console));
        }
    }
}
