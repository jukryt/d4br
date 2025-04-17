namespace Importer.Report
{
    internal class CombineMessageReporter : IMessageReporter
    {
        private readonly List<IMessageReporter> _reporters;

        public CombineMessageReporter()
        {
            _reporters = new List<IMessageReporter>();
        }

        public void Add(IMessageReporter reporter)
        {
            _reporters.Add(reporter);
        }

        public void WriteError(string message, string source = "")
        {
            foreach (var reporter in _reporters)
                reporter.WriteError(message, source);
        }

        public void WriteException(Exception exception, string source = "")
        {
            foreach (var reporter in _reporters)
                reporter.WriteException(exception, source);
        }

        public void WriteMessage(string message, string source = "")
        {
            foreach (var reporter in _reporters)
                reporter.WriteMessage(message, source);
        }
    }
}
