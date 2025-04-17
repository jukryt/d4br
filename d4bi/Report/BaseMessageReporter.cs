using Importer.Extension;

namespace Importer.Report
{
    internal abstract class BaseMessageReporter : IMessageReporter
    {
        private const int ExceptionLineIndent = 2;

        public void WriteMessage(string message, string source = "")
        {
            var messages = new List<string>();

            if (!string.IsNullOrEmpty(source))
                messages.Add(source.Linearize(false));

            messages.Add(message);

            var finalMessage = string.Join(". ", messages);

            Write(finalMessage);
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
