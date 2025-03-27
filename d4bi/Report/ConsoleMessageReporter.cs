using Konsole;

namespace Importer.Report
{
    internal class ConsoleMessageReporter : BaseMessageReporter
    {
        private readonly IConsole _console;

        public ConsoleMessageReporter(IConsole console)
        {
            _console = console;
        }

        protected override void Write(string message)
        {
            _console.WriteLine(message);
        }
    }
}
