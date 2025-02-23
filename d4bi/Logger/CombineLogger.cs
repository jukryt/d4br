namespace Importer.Logger
{
    internal class CombineLogger : ILogger
    {
        private readonly IReadOnlyCollection<ILogger> _loggers;

        public CombineLogger(params ILogger[] loggers) : this((IReadOnlyCollection<ILogger>)loggers)
        {
        }

        public CombineLogger(IReadOnlyCollection<ILogger> loggers)
        {
            _loggers = loggers;
        }

        public void WriteMessage(string message, string source = "")
        {
            foreach (var logger in _loggers)
                logger.WriteMessage(message, source);
        }

        public void WriteError(string message, string source = "")
        {
            foreach (var logger in _loggers)
                logger.WriteError(message, source);
        }

        public void WriteException(Exception exception, string source = "")
        {
            foreach (var logger in _loggers)
                logger.WriteException(exception, source);
        }
    }
}
