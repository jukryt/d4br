namespace Importer.Extension
{
    internal static class ExceptionExtension
    {
        /// <summary> [Type] Message </summary>
        public static string GetMessage(this Exception exception)
        {
            var message = exception.Message.Linearize();

            if (string.IsNullOrEmpty(message))
                message = "Empty message.";

            return $"[{exception.GetType().Name}] {message}";
        }
    }
}
