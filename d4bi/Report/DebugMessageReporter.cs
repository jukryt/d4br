using System.Diagnostics;

namespace Importer.Report
{
    internal class DebugMessageReporter : BaseMessageReporter
    {
        protected override void Write(string message)
        {
            Debug.WriteLine(message);
        }
    }
}
