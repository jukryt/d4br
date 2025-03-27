using Konsole;

namespace Importer.Report
{
    internal class ReportManager
    {
        public static ReportManager Instance { get; } = new ReportManager();

        private readonly IConsole _console;
        private readonly BufferWriter _reportWriter;

        private ReportManager()
        {
            _console = new ConcurrentWriter();
            _reportWriter = new BufferWriter(new ConsoleWriter(_console));
        }

        public ProgressReporter CreateProgressReporter(string name, int maxValue)
        {
            return new ProgressReporter(_console, name, maxValue);
        }

        public IMessageReporter CreateMessageReporter()
        {
            var reporter = new CombineMessageReporter();
#if DEBUG
            reporter.Add(new DebugMessageReporter());
#endif
            reporter.Add(new WriterMessageReporter(_reportWriter));

            return reporter;
        }

        public void FlushMessages()
        {
            _console.WriteLine(string.Empty);

            if (_reportWriter.MessageCount > 0)
            {
                _console.WriteLine(ConsoleColor.White, "Messages:");
                _reportWriter.Flush();
            }
            else
            {
                _console.WriteLine(ConsoleColor.White, "No Messages");
            }
        }
    }
}
