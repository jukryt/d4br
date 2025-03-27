using Konsole;

namespace Importer.Report
{
    internal class ConsoleWriter : IWriter
    {
        private readonly IConsole _console;

        public ConsoleWriter(IConsole console)
        {
            _console = console;
        }

        public void WriteLine(string message)
        {
            _console.WriteLine(message);
        }
    }
}
