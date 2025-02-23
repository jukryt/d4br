namespace Importer.Logger
{
    internal class ConsoleLogger : BaseLogger
    {
        public ConsoleLogger(bool addTimestamp, bool addCallStack) : base(addTimestamp, addCallStack)
        {
        }

        protected override void Write(string message)
        {
            Console.WriteLine(message);
        }
    }
}
