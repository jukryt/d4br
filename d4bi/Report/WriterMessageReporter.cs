namespace Importer.Report
{
    internal class WriterMessageReporter : BaseMessageReporter
    {
        private readonly IWriter _writer;

        public WriterMessageReporter(IWriter writer)
        {
            _writer = writer;
        }

        protected override void Write(string message)
        {
            _writer.WriteLine(message);
        }
    }
}
