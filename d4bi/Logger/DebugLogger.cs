using System.Diagnostics;

namespace Importer.Logger
{
    internal class DebugLogger : BaseLogger
    {
        public DebugLogger(bool addTimestamp, bool addCallStack) : base(addTimestamp, addCallStack)
        {
        }

        protected override void Write(string message)
        {
            Debug.WriteLine(message);
        }
    }
}
