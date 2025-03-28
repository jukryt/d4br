namespace Importer.Report
{
    internal class ReportManager : IDisposable
    {
        private readonly ProgressReporter _mainReporter;
        private readonly BufferWriter _reportWriter;

        public ReportManager()
        {
            _mainReporter = ProgressReporter.CreateMainReporter("Import progress");
            _reportWriter = new BufferWriter(new ConsoleWriter());
        }

        public ProgressReporter CreateProgressReporter(string name)
        {
            return ProgressReporter.CreateChildReporter(_mainReporter, name);
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

        private void FlushMessages()
        {
            Console.WriteLine(string.Empty);

            if (_reportWriter.MessageCount > 0)
            {
                Console.WriteLine("Messages:");
                _reportWriter.Flush();
            }
            else
            {
                Console.WriteLine("No Messages");
            }
        }

        public void Dispose()
        {
            _mainReporter.Complete();
            _mainReporter.Dispose();
            FlushMessages();
        }
    }
}
