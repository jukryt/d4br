using Importer.Extension;
using System.Diagnostics;

namespace Importer.Logger
{
    internal abstract class BaseLogger : ILogger
    {
        private const int ExceptionLineIndent = 2;

        private readonly object _lockObject;
        private readonly bool _addTimestamp;
        private readonly bool _addCallStack;

        protected BaseLogger(bool addTimestamp, bool addCallStack)
        {
            _lockObject = new object();
            _addTimestamp = addTimestamp;
            _addCallStack = addCallStack;
        }

        public void WriteMessage(string message, string source = "")
        {
            lock (_lockObject)
            {
                var messages = new List<string>();

                if (_addTimestamp)
                    messages.Add(DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss zzz"));

                if (!string.IsNullOrEmpty(source))
                    messages.Add(source.Linearize(false));

                messages.Add(message);

                var finalMessage = string.Join(". ", messages);

                try
                {
                    Write(finalMessage);
                }
                catch (Exception ex)
                {
#if DEBUG
                    Debug.WriteLine(ex.GetMessage());
#else
                    Console.WriteLine(ex.GetMessage());
#endif
                }
            }
        }

        public void WriteError(string message, string source = "")
        {
            WriteMessage($"Error - {message}", source);
        }

        public void WriteException(Exception exception, string source = "")
        {
            var messages = new List<string>();

            var currentException = exception;
            var exceptionLevel = 0;

            while (currentException != null)
            {
                var exceptionIndent = exceptionLevel * ExceptionLineIndent;
                var exceptionMessage = currentException.GetMessage().AddLeft(exceptionIndent);
                messages.Add(exceptionMessage);

                if (!_addCallStack)
                    break;

                var stackTraceLines = currentException.StackTrace.GetLines();
                foreach (var stackTraceLine in stackTraceLines)
                {
                    var stackTraceIndent = exceptionIndent + ExceptionLineIndent;
                    var stackTraceMessage = stackTraceLine.TrimStart(' ').AddLeft(stackTraceIndent);
                    messages.Add(stackTraceMessage);
                }

                currentException = currentException.InnerException;
                exceptionLevel++;
            }

            var message = string.Join(Environment.NewLine, messages);
            WriteError(message, source);
        }

        protected abstract void Write(string message);
    }
}
