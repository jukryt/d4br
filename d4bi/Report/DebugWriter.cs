using System.Diagnostics;

namespace Importer.Report
{
    internal class DebugWriter : IWriter
    {
        public void WriteLine(string message)
        {
            Debug.WriteLine(message);
        }
    }
}
