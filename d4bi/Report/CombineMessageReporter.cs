namespace Importer.Report
{
    internal class CombineMessageReporter : IMessageReporter
    {
        private readonly IReadOnlyCollection<IMessageReporter> _reporters;

        public CombineMessageReporter(params IMessageReporter[] reporters) : this((IReadOnlyCollection<IMessageReporter>)reporters)
        {
        }

        public CombineMessageReporter(IReadOnlyCollection<IMessageReporter> reporters)
        {
            _reporters = reporters;
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
