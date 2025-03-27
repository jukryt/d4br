namespace Importer.Report
{
    internal interface IMessageReporter
    {
        void WriteMessage(string message, string source = "");

        void WriteError(string message, string source = "");

        void WriteException(Exception exception, string source = "");
    }
}
